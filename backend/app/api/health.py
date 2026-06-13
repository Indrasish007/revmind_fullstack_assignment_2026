from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db

router = APIRouter(tags=["health"])

@router.get("/health")
def check_health(db: Session = Depends(get_db)):
    """
    Check the service health and status including database connectivity.
    """
    db_status = "connected"
    try:
        # Execute a simple query to verify connection
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    return {
        "status": "healthy" if "unhealthy" not in db_status else "unhealthy",
        "timestamp": datetime.utcnow().isoformat(),
        "details": {
            "database": db_status
        }
    }

