from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="RevMind Full Stack Assignment API",
    description="Backend API scaffold for NovaBite Consumer Goods Sales Insights",
    version="1.0.0",
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    question: str

@app.get("/")
def read_root():
    return {"message": "Welcome to the RevMind Full-Stack Assignment API!"}

@app.get("/api/products")
def get_products():
    """
    Return distinct products with total net revenue and units sold.
    Mock response for scaffolding.
    """
    return [
        {"product_name": "Product A", "total_net_revenue": 0.0, "units_sold": 0},
        {"product_name": "Product B", "total_net_revenue": 0.0, "units_sold": 0},
    ]

@app.get("/api/summary")
def get_summary():
    """
    Return top-level KPIs: total net revenue, total units, gross profit margin %,
    top region, top channel, top product.
    Mock response for scaffolding.
    """
    return {
        "total_net_revenue": 0.0,
        "total_units": 0,
        "gross_profit_margin_pct": 0.0,
        "top_region": "N/A",
        "top_channel": "N/A",
        "top_product": "N/A",
    }

@app.get("/api/trends")
def get_trends():
    """
    Return monthly net revenue aggregated by month.
    Mock response for scaffolding.
    """
    return [
        {"month": "2024-01", "net_revenue": 0.0},
    ]

@app.post("/api/chat")
def post_chat(request: ChatRequest):
    """
    Accept { "question": "..." }, return { "answer": "..." }.
    Mock response for scaffolding.
    """
    return {
        "answer": f"This is a placeholder response. You asked: '{request.question}'"
    }
