import os
import sys
import pandas as pd

# Add the current directory to sys.path to allow imports from 'app'
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.append(backend_dir)

from app.core.database import Base, engine, SessionLocal
from app.models.sales import Sale

def seed_database():
    print("Starting database seeding process...")
    
    # 1. Create tables if they do not exist
    try:
        Base.metadata.create_all(bind=engine)
        print("Database tables verified/created successfully.")
    except Exception as e:
        print(f"Error creating database tables: {e}", file=sys.stderr)
        sys.exit(1)
        
    # 2. Locate and load CSV file
    # CSV is located at ../data/novabite_sales_data.csv relative to this script
    csv_path = os.path.abspath(os.path.join(backend_dir, "..", "data", "novabite_sales_data.csv"))
    
    if not os.path.exists(csv_path):
        print(f"Error: CSV file not found at '{csv_path}'", file=sys.stderr)
        sys.exit(1)
        
    try:
        df = pd.read_csv(csv_path)
    except Exception as e:
        print(f"Error reading CSV file: {e}", file=sys.stderr)
        sys.exit(1)
        
    total_csv_rows = len(df)
    print(f"Loaded CSV file: {total_csv_rows} records found.")
    
    # 3. Retrieve existing transaction_id values to prevent duplicates
    session = SessionLocal()
    try:
        # Fetch only the transaction_id column to minimize memory and query time
        existing_ids = set(val[0] for val in session.query(Sale.transaction_id).all())
    except Exception as e:
        print(f"Error querying existing transaction records: {e}", file=sys.stderr)
        session.close()
        sys.exit(1)
        
    # 4. Filter out duplicates
    # Filter the DataFrame to keep only rows whose transaction_id is not in existing_ids
    new_df = df[~df["transaction_id"].isin(existing_ids)]
    rows_skipped = total_csv_rows - len(new_df)
    
    if new_df.empty:
        print("\n--- Seeding Summary ---")
        print(f"Total rows in CSV:     {total_csv_rows}")
        print(f"Rows imported:         0")
        print(f"Rows skipped:          {rows_skipped} (all already imported)")
        print("-----------------------")
        session.close()
        return

    # 5. Build model instances and bulk insert
    new_sales = []
    for _, row in new_df.iterrows():
        sale = Sale(
            transaction_id=str(row["transaction_id"]),
            date=str(row["date"]),
            month=str(row["month"]),
            quarter=str(row["quarter"]),
            sku=str(row["sku"]),
            product_name=str(row["product_name"]),
            category=str(row["category"]),
            subcategory=str(row["subcategory"]),
            region=str(row["region"]),
            channel=str(row["channel"]),
            sales_rep=str(row["sales_rep"]),
            units_sold=int(row["units_sold"]),
            unit_price_usd=float(row["unit_price_usd"]),
            gross_revenue_usd=float(row["gross_revenue_usd"]),
            discount_pct=float(row["discount_pct"]),
            net_revenue_usd=float(row["net_revenue_usd"]),
            cogs_usd=float(row["cogs_usd"]),
            gross_profit_usd=float(row["gross_profit_usd"]),
        )
        new_sales.append(sale)
        
    try:
        # Bulk save objects for high performance
        session.bulk_save_objects(new_sales)
        session.commit()
        rows_imported = len(new_sales)
        
        print("\n--- Seeding Summary ---")
        print(f"Total rows in CSV:     {total_csv_rows}")
        print(f"Rows imported:         {rows_imported}")
        print(f"Rows skipped:          {rows_skipped}")
        print("-----------------------")
        print("Database seeding completed successfully!")
    except Exception as e:
        session.rollback()
        print(f"Error during database transaction commit: {e}", file=sys.stderr)
        sys.exit(1)
    finally:
        session.close()

if __name__ == "__main__":
    seed_database()
