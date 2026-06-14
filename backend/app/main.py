from contextlib import asynccontextmanager
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.middleware.error_handler import setup_error_handlers
from app.api.health import router as health_router
from app.api.analytics import router as analytics_router
from app.api.chat import router as chat_router

logger = logging.getLogger("uvicorn.error")

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        from seed import seed_database
        seed_database()
    except Exception as e:
        logger.error(f"Error during database seeding on startup: {e}", exc_info=True)
    yield

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        description="Backend API foundation for NovaBite Consumer Goods Sales Insights",
        version="1.0.0",
        debug=settings.DEBUG,
        lifespan=lifespan,
    )
    
    # Enable CORS for frontend development
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Adjust in production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Register error handlers
    setup_error_handlers(app)
    
    # Include routers
    app.include_router(health_router)
    app.include_router(analytics_router, prefix="/api")
    app.include_router(chat_router, prefix="/api")
    
    return app

app = create_app()

