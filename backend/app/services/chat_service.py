import os
import re
import logging
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import text
from openai import OpenAI
from app.core.config import settings

# Initialize logger
logger = logging.getLogger("app.services.chat_service")

# Global client initialization helper
def get_groq_client() -> OpenAI:
    api_key = settings.GROQ_API_KEY
    if not api_key:
        logger.error("GROQ_API_KEY environment variable is missing.")
        raise ValueError("GROQ_API_KEY is not configured. Please set the GROQ_API_KEY in your environment.")
    
    return OpenAI(
        api_key=api_key,
        base_url="https://api.groq.com/openai/v1"
    )

def get_schema_context() -> str:
    """
    Returns the schema of the SQLite 'sales' table for LLM context.
    """
    return """
We have a single SQLite table named 'sales' with the following schema:
Table: sales
Columns:
- transaction_id (TEXT, Primary Key): Unique transaction ID (e.g. 'TXN0001')
- date (TEXT): Transaction date in YYYY-MM-DD format (e.g. '2024-03-15')
- month (TEXT): Chronological month in YYYY-MM format (e.g. '2024-03')
- quarter (TEXT): Quarter representation (e.g. 'Q1-2024', 'Q2-2024', etc.)
- sku (TEXT): Product SKU code (e.g. 'SKU1001')
- product_name (TEXT): Full name of the product (e.g. 'NovaBite Shampoo Keratin 400ml')
- category (TEXT): Product category. Allowed values: 'Personal Care', 'Snacks', 'Beverages', 'Home Care'
- subcategory (TEXT): Product subcategory (e.g. 'Hair Care', 'Chips', 'Soft Drinks')
- region (TEXT): Sales region. Allowed values: 'North', 'South', 'East', 'West', 'Central'
- channel (TEXT): Sales distribution route. Allowed values: 'Modern Trade', 'General Trade', 'E-Commerce', 'Direct to Consumer'
- sales_rep (TEXT): Sales representative name (e.g. 'John Doe')
- units_sold (INTEGER): Quantity of units sold
- unit_price_usd (REAL): Price per unit in USD
- gross_revenue_usd (REAL): Gross sales revenue before discount (units_sold * unit_price_usd)
- discount_pct (REAL): Discount applied in percent (e.g. 5.0 for 5%)
- net_revenue_usd (REAL): Revenue after discount (Net Revenue)
- cogs_usd (REAL): Cost of goods sold (COGS)
- gross_profit_usd (REAL): Gross profit calculated as: net_revenue_usd - cogs_usd
"""

def get_sales_summary_context(db: Session) -> str:
    """
    Queries the database dynamically for high-level metrics to inject baseline context.
    """
    try:
        query = text("""
            SELECT 
                COUNT(*) as total_rows,
                MIN(date) as min_date,
                MAX(date) as max_date,
                SUM(net_revenue_usd) as total_net_revenue,
                SUM(units_sold) as total_units_sold,
                SUM(gross_profit_usd) as total_gross_profit
            FROM sales
        """)
        res = db.execute(query).fetchone()
        if not res or res.total_rows == 0:
            return "Current Database Status: Empty"

        net_rev = res.total_net_revenue or 0.0
        profit = res.total_gross_profit or 0.0
        margin_pct = (profit / net_rev) * 100 if net_rev > 0 else 0.0

        return f"""
Current Database General Statistics:
- Total Sales Transactions: {res.total_rows}
- Sales Date Range: {res.min_date} to {res.max_date}
- Total Net Revenue: ${net_rev:,.2f}
- Total Units Sold: {res.total_units_sold:,}
- Average Gross Profit Margin: {margin_pct:.2f}%
"""
    except Exception as e:
        logger.warning(f"Failed to generate sales summary context: {str(e)}")
        return "Current Database Status: Available, metadata queries failed."

def clean_sql_query(llm_response: str) -> str:
    """
    Parses LLM response to extract only the raw SQL query.
    Strips out markdown code blocks (```sql ... ```) and leading/trailing whitespace.
    """
    # Remove markdown block wrappers
    sql = re.sub(r"```sql\s*", "", llm_response, flags=re.IGNORECASE)
    sql = re.sub(r"```\s*", "", sql)
    # Remove single line comments
    sql = re.sub(r"--.*?\n", "\n", sql)
    return sql.strip()

def validate_sql_query(sql_query: str) -> bool:
    """
    Safety guard to ensure the SQL query is a read-only SELECT statement.
    Rejects operations that can modify the schema or data.
    """
    cleaned = sql_query.strip().lower()
    
    # Must start with SELECT
    if not cleaned.startswith("select"):
        logger.warning(f"SQL validation failed: Query does not start with SELECT. Query: {sql_query}")
        return False
    
    # Rejects destructive/modifying SQL keywords
    forbidden_patterns = [
        r"\binsert\b", r"\bupdate\b", r"\bdelete\b", r"\bdrop\b", r"\balter\b", 
        r"\bcreate\b", r"\breplace\b", r"\btruncate\b", r"\bvacuum\b", 
        r"\bexecute\b", r"\bgrant\b", r"\brevoke\b"
    ]
    
    for pattern in forbidden_patterns:
        if re.search(pattern, cleaned):
            logger.warning(f"SQL validation failed: Forbidden keyword pattern '{pattern}' matched. Query: {sql_query}")
            return False
            
    return True

def generate_sql_query_via_llm(client: OpenAI, question: str, schema_context: str, summary_context: str) -> str:
    """
    Uses Groq LLM to translate natural language into a SQLite SELECT query.
    """
    system_prompt = f"""You are a SQLite database assistant for NovaBite Consumer Goods.
Your task is to write a single valid SQLite SELECT query that answers the user's natural language question.

Here is the database schema context:
{schema_context}

Here is the high-level dataset statistics context:
{summary_context}

Instructions:
1. Output ONLY the raw SQL query. Do not wrap it in markdown unless using code blocks. Do not add explanations.
2. The query must start with SELECT and be strictly read-only.
3. Be precise with column names. Do not invent columns.
4. Calculations:
   - Net Revenue: SUM(net_revenue_usd)
   - Gross Profit: SUM(gross_profit_usd)
   - Units Sold: SUM(units_sold)
   - Gross Profit Margin %: (SUM(gross_profit_usd) / SUM(net_revenue_usd)) * 100
5. Categorical matching rules:
   - Regions are: 'North', 'South', 'East', 'West', 'Central' (Match exactly or use LIKE)
   - Channels are: 'Modern Trade', 'General Trade', 'E-Commerce', 'Direct to Consumer'
   - Categories are: 'Personal Care', 'Snacks', 'Beverages', 'Home Care'
   - Dates are formatted as YYYY-MM-DD. Quarters are strings like 'Q1-2024', 'Q2-2025' (stored in the 'quarter' column).
   - Years can be extracted from dates (e.g. strftime('%Y', date)) or using 'month' LIKE '2025-%' or 'quarter' LIKE '%-2025'.
6. Do not include trailing semicolons unless necessary. Keep queries simple.
"""

    try:
        # Using Llama 3 8B model on Groq for fast, accurate SQL generation
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Write the SQL query for: {question}"}
            ],
            temperature=0.0,
            max_tokens=256
        )
        llm_response = response.choices[0].message.content
        sql_query = clean_sql_query(llm_response)
        logger.info(f"Generated SQL: {sql_query}")
        return sql_query
    except Exception as e:
        logger.error(f"Error calling LLM for SQL generation: {str(e)}", exc_info=True)
        raise RuntimeError(f"Failed to generate SQL query from the natural language question: {str(e)}")

def execute_query(db: Session, sql_query: str) -> list:
    """
    Executes the validated SQL query against the SQLite database.
    """
    try:
        # Wrap query in sqlalchemy text to execute
        res = db.execute(text(sql_query))
        # Fetch columns and map to dictionary format for LLM readability
        columns = res.keys()
        rows = [dict(zip(columns, row)) for row in res.fetchall()]
        logger.info(f"SQL Execution succeeded. Returned {len(rows)} rows.")
        return rows
    except Exception as e:
        logger.error(f"Database query execution failed: {str(e)}", exc_info=True)
        raise RuntimeError(f"Database execution error: {str(e)}")

def generate_business_answer(
    client: OpenAI, 
    question: str, 
    sql_query: str, 
    query_results: list, 
    summary_context: str
) -> str:
    """
    Uses the Groq LLM to synthesize the final business-friendly response based on query results.
    """
    if query_results:
        if len(query_results) > 50:
            truncated = query_results[:50]
            results_str = str(truncated) + f"\n\n(Note: The results were truncated to fit context constraints. Showing first 50 of {len(query_results)} total records.)"
        else:
            results_str = str(query_results)
    else:
        results_str = "No records found."
    
    system_prompt = f"""You are a helpful business intelligence chatbot for NovaBite Consumer Goods.
Your goal is to answer the sales manager's natural language question accurately by summarizing the SQL query results.

Here is the context of our database:
{summary_context}

Here is the SQLite query that was run:
`{sql_query}`

Here is the exact data returned by the query:
{results_str}

Instructions:
1. Be concise, direct, and business-focused. Speak professionally as an insights analyst.
2. Directly answer the question in the first sentence with the exact metrics (e.g. specific revenues, margins, reps, or regions).
3. Format monetary values in USD (e.g. $123,456.78) and margins as percentages (e.g. 52.34%).
4. If appropriate, present comparisons as bullet points or in markdown tables.
5. Do not explain the underlying SQL query or mention SQLite unless asked.
6. If the database returned no results, state clearly that no records matched the requested filters.
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": question}
            ],
            temperature=0.2,
            max_tokens=512
        )
        answer = response.choices[0].message.content.strip()
        return answer
    except Exception as e:
        logger.error(f"Error calling LLM for answer generation: {str(e)}", exc_info=True)
        raise RuntimeError(f"Failed to synthesize response: {str(e)}")

def process_chat_query(db: Session, question: str) -> str:
    """
    Coordinates the full Text-to-SQL pipeline to resolve the user's business question.
    """
    # 1. Initialize Groq client (validates GROQ_API_KEY)
    client = get_groq_client()
    
    # 2. Retrieve dynamic schema & statistics context
    schema_context = get_schema_context()
    summary_context = get_sales_summary_context(db)
    
    # 3. Generate SQL query from question
    sql_query = generate_sql_query_via_llm(client, question, schema_context, summary_context)
    
    # 4. Safety validation
    if not validate_sql_query(sql_query):
        raise ValueError(
            "The generated query was rejected due to safety guardrails. "
            "Only read-only SELECT database queries are permitted."
        )
        
    # 5. Execute query against database
    results = execute_query(db, sql_query)
    
    # 6. Synthesize natural language answer
    answer = generate_business_answer(client, question, sql_query, results, summary_context)
    
    return answer
