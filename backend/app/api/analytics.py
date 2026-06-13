import logging
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List
from pydantic import BaseModel

from app.core.database import get_db
from app.models.sales import Sale

# Initialize logger
logger = logging.getLogger("app.analytics")

router = APIRouter(tags=["analytics"])

# Pydantic Response Models for Documentation and Validation
class SummaryResponse(BaseModel):
    total_net_revenue: float
    total_units_sold: int
    gross_profit_margin_pct: float
    top_region: str
    top_channel: str
    top_product: str

class RegionSales(BaseModel):
    region: str
    net_revenue: float
    units_sold: int
    gross_profit: float
    gross_profit_margin_pct: float

class CategorySales(BaseModel):
    category: str
    net_revenue: float
    units_sold: int
    gross_profit: float
    gross_profit_margin_pct: float

class TopProduct(BaseModel):
    product_name: str
    sku: str
    category: str
    net_revenue: float
    units_sold: int

class ProfitByItem(BaseModel):
    name: str
    net_revenue: float
    cogs: float
    gross_profit: float
    gross_profit_margin_pct: float

class ProfitAnalysisResponse(BaseModel):
    by_category: List[ProfitByItem]
    by_subcategory: List[ProfitByItem]
    by_channel: List[ProfitByItem]

class MonthlyTrend(BaseModel):
    month: str
    net_revenue: float
    units_sold: int
    gross_profit: float


# Endpoints

@router.get("/summary", response_model=SummaryResponse)
def get_summary(db: Session = Depends(get_db)):
    """
    Get top-level KPIs including:
    - Total net revenue
    - Total units sold
    - Gross profit margin %
    - Top performing region, channel, and product (by net revenue)
    """
    try:
        # 1. Aggregates for net revenue, units sold, and gross profit
        kpis = db.query(
            func.sum(Sale.net_revenue_usd).label("net_revenue"),
            func.sum(Sale.units_sold).label("units_sold"),
            func.sum(Sale.gross_profit_usd).label("gross_profit")
        ).first()

        net_rev = float(kpis.net_revenue) if kpis and kpis.net_revenue is not None else 0.0
        units = int(kpis.units_sold) if kpis and kpis.units_sold is not None else 0
        profit = float(kpis.gross_profit) if kpis and kpis.gross_profit is not None else 0.0

        margin_pct = round((profit / net_rev) * 100, 2) if net_rev > 0 else 0.0

        # 2. Top Region by Net Revenue
        region_res = db.query(Sale.region).group_by(Sale.region).order_by(
            desc(func.sum(Sale.net_revenue_usd))
        ).first()
        top_region = region_res[0] if region_res else "N/A"

        # 3. Top Channel by Net Revenue
        channel_res = db.query(Sale.channel).group_by(Sale.channel).order_by(
            desc(func.sum(Sale.net_revenue_usd))
        ).first()
        top_channel = channel_res[0] if channel_res else "N/A"

        # 4. Top Product by Net Revenue
        product_res = db.query(Sale.product_name).group_by(Sale.product_name).order_by(
            desc(func.sum(Sale.net_revenue_usd))
        ).first()
        top_product = product_res[0] if product_res else "N/A"

        return {
            "total_net_revenue": round(net_rev, 2),
            "total_units_sold": units,
            "gross_profit_margin_pct": margin_pct,
            "top_region": top_region,
            "top_channel": top_channel,
            "top_product": top_product
        }
    except Exception as e:
        logger.error(f"Error fetching summary: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving sales summary data."
        )


@router.get("/sales-by-region", response_model=List[RegionSales])
def get_sales_by_region(db: Session = Depends(get_db)):
    """
    Get aggregated sales and profit metrics grouped by region.
    """
    try:
        results = db.query(
            Sale.region,
            func.sum(Sale.net_revenue_usd).label("net_revenue"),
            func.sum(Sale.units_sold).label("units_sold"),
            func.sum(Sale.gross_profit_usd).label("gross_profit")
        ).group_by(Sale.region).order_by(
            desc(func.sum(Sale.net_revenue_usd))
        ).all()

        response = []
        for r in results:
            net_rev = float(r.net_revenue) if r.net_revenue is not None else 0.0
            units = int(r.units_sold) if r.units_sold is not None else 0
            profit = float(r.gross_profit) if r.gross_profit is not None else 0.0
            margin_pct = round((profit / net_rev) * 100, 2) if net_rev > 0 else 0.0

            response.append({
                "region": r.region,
                "net_revenue": round(net_rev, 2),
                "units_sold": units,
                "gross_profit": round(profit, 2),
                "gross_profit_margin_pct": margin_pct
            })
        return response
    except Exception as e:
        logger.error(f"Error fetching sales by region: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving regional sales data."
        )


@router.get("/sales-by-category", response_model=List[CategorySales])
def get_sales_by_category(db: Session = Depends(get_db)):
    """
    Get aggregated sales and profit metrics grouped by product category.
    """
    try:
        results = db.query(
            Sale.category,
            func.sum(Sale.net_revenue_usd).label("net_revenue"),
            func.sum(Sale.units_sold).label("units_sold"),
            func.sum(Sale.gross_profit_usd).label("gross_profit")
        ).group_by(Sale.category).order_by(
            desc(func.sum(Sale.net_revenue_usd))
        ).all()

        response = []
        for r in results:
            net_rev = float(r.net_revenue) if r.net_revenue is not None else 0.0
            units = int(r.units_sold) if r.units_sold is not None else 0
            profit = float(r.gross_profit) if r.gross_profit is not None else 0.0
            margin_pct = round((profit / net_rev) * 100, 2) if net_rev > 0 else 0.0

            response.append({
                "category": r.category,
                "net_revenue": round(net_rev, 2),
                "units_sold": units,
                "gross_profit": round(profit, 2),
                "gross_profit_margin_pct": margin_pct
            })
        return response
    except Exception as e:
        logger.error(f"Error fetching sales by category: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving sales by category."
        )


@router.get("/top-products", response_model=List[TopProduct])
def get_top_products(
    limit: int = Query(10, ge=1, le=100, description="The maximum number of products to return (between 1 and 100)"), 
    db: Session = Depends(get_db)
):
    """
    Get the top performing products by net revenue.
    """
    try:
        # Group by product name, sku, and category to provide full context
        results = db.query(
            Sale.product_name,
            Sale.sku,
            Sale.category,
            func.sum(Sale.net_revenue_usd).label("net_revenue"),
            func.sum(Sale.units_sold).label("units_sold")
        ).group_by(Sale.product_name, Sale.sku, Sale.category).order_by(
            desc(func.sum(Sale.net_revenue_usd))
        ).limit(limit).all()

        response = []
        for r in results:
            response.append({
                "product_name": r.product_name,
                "sku": r.sku,
                "category": r.category,
                "net_revenue": round(float(r.net_revenue), 2) if r.net_revenue is not None else 0.0,
                "units_sold": int(r.units_sold) if r.units_sold is not None else 0
            })
        return response
    except Exception as e:
        logger.error(f"Error fetching top products: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving top products."
        )


@router.get("/profit-analysis", response_model=ProfitAnalysisResponse)
def get_profit_analysis(db: Session = Depends(get_db)):
    """
    Get profit performance and margins broken down by Category, Subcategory, and Channel.
    """
    try:
        # 1. Profit breakdown by Category
        cat_results = db.query(
            Sale.category.label("name"),
            func.sum(Sale.net_revenue_usd).label("net_revenue"),
            func.sum(Sale.cogs_usd).label("cogs"),
            func.sum(Sale.gross_profit_usd).label("gross_profit")
        ).group_by(Sale.category).order_by(desc("gross_profit")).all()

        by_category = []
        for r in cat_results:
            net_rev = float(r.net_revenue) if r.net_revenue is not None else 0.0
            cogs = float(r.cogs) if r.cogs is not None else 0.0
            profit = float(r.gross_profit) if r.gross_profit is not None else 0.0
            margin_pct = round((profit / net_rev) * 100, 2) if net_rev > 0 else 0.0
            by_category.append({
                "name": r.name,
                "net_revenue": round(net_rev, 2),
                "cogs": round(cogs, 2),
                "gross_profit": round(profit, 2),
                "gross_profit_margin_pct": margin_pct
            })

        # 2. Profit breakdown by Subcategory
        subcat_results = db.query(
            Sale.subcategory.label("name"),
            func.sum(Sale.net_revenue_usd).label("net_revenue"),
            func.sum(Sale.cogs_usd).label("cogs"),
            func.sum(Sale.gross_profit_usd).label("gross_profit")
        ).group_by(Sale.subcategory).order_by(desc("gross_profit")).all()

        by_subcategory = []
        for r in subcat_results:
            net_rev = float(r.net_revenue) if r.net_revenue is not None else 0.0
            cogs = float(r.cogs) if r.cogs is not None else 0.0
            profit = float(r.gross_profit) if r.gross_profit is not None else 0.0
            margin_pct = round((profit / net_rev) * 100, 2) if net_rev > 0 else 0.0
            by_subcategory.append({
                "name": r.name,
                "net_revenue": round(net_rev, 2),
                "cogs": round(cogs, 2),
                "gross_profit": round(profit, 2),
                "gross_profit_margin_pct": margin_pct
            })

        # 3. Profit breakdown by Channel
        chan_results = db.query(
            Sale.channel.label("name"),
            func.sum(Sale.net_revenue_usd).label("net_revenue"),
            func.sum(Sale.cogs_usd).label("cogs"),
            func.sum(Sale.gross_profit_usd).label("gross_profit")
        ).group_by(Sale.channel).order_by(desc("gross_profit")).all()

        by_channel = []
        for r in chan_results:
            net_rev = float(r.net_revenue) if r.net_revenue is not None else 0.0
            cogs = float(r.cogs) if r.cogs is not None else 0.0
            profit = float(r.gross_profit) if r.gross_profit is not None else 0.0
            margin_pct = round((profit / net_rev) * 100, 2) if net_rev > 0 else 0.0
            by_channel.append({
                "name": r.name,
                "net_revenue": round(net_rev, 2),
                "cogs": round(cogs, 2),
                "gross_profit": round(profit, 2),
                "gross_profit_margin_pct": margin_pct
            })

        return {
            "by_category": by_category,
            "by_subcategory": by_subcategory,
            "by_channel": by_channel
        }
    except Exception as e:
        logger.error(f"Error fetching profit analysis: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving profit analysis data."
        )


@router.get("/monthly-trend", response_model=List[MonthlyTrend])
def get_monthly_trend(db: Session = Depends(get_db)):
    """
    Get chronological monthly sales and profit trends.
    """
    try:
        results = db.query(
            Sale.month,
            func.sum(Sale.net_revenue_usd).label("net_revenue"),
            func.sum(Sale.units_sold).label("units_sold"),
            func.sum(Sale.gross_profit_usd).label("gross_profit")
        ).group_by(Sale.month).order_by(
            Sale.month.asc()
        ).all()

        response = []
        for r in results:
            response.append({
                "month": r.month,
                "net_revenue": round(float(r.net_revenue), 2) if r.net_revenue is not None else 0.0,
                "units_sold": int(r.units_sold) if r.units_sold is not None else 0,
                "gross_profit": round(float(r.gross_profit), 2) if r.gross_profit is not None else 0.0
            })
        return response
    except Exception as e:
        logger.error(f"Error fetching monthly trend: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving monthly trend data."
        )
