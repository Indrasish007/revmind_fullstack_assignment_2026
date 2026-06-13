from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.middleware.error_handler import setup_error_handlers
from app.api.health import router as health_router
from app.api.analytics import router as analytics_router

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        description="Backend API foundation for NovaBite Consumer Goods Sales Insights",
        version="1.0.0",
        debug=settings.DEBUG,
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
    
    return app

app = create_app()
