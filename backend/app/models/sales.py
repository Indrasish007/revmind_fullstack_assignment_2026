from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class Sale(Base):
    __tablename__ = "sales"

    transaction_id: Mapped[str] = mapped_column(primary_key=True, index=True)
    date: Mapped[str] = mapped_column(index=True)
    month: Mapped[str] = mapped_column(index=True)
    quarter: Mapped[str] = mapped_column(index=True)
    sku: Mapped[str] = mapped_column(index=True)
    product_name: Mapped[str] = mapped_column(index=True)
    category: Mapped[str] = mapped_column(index=True)
    subcategory: Mapped[str] = mapped_column()
    region: Mapped[str] = mapped_column(index=True)
    channel: Mapped[str] = mapped_column(index=True)
    sales_rep: Mapped[str] = mapped_column(index=True)
    units_sold: Mapped[int] = mapped_column()
    unit_price_usd: Mapped[float] = mapped_column()
    gross_revenue_usd: Mapped[float] = mapped_column()
    discount_pct: Mapped[float] = mapped_column()
    net_revenue_usd: Mapped[float] = mapped_column()
    cogs_usd: Mapped[float] = mapped_column()
    gross_profit_usd: Mapped[float] = mapped_column()

    def __repr__(self) -> str:
        return f"<Sale {self.transaction_id} - {self.product_name} ({self.units_sold} units)>"
