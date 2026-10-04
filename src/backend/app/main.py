"""FINRISK AI — FastAPI Backend Entry Point."""
import logging, os, sys

# Add project root to path so imports work
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from src.backend.app.routers.dashboard import router as dashboard_router
from src.backend.app.routers.stress import router as stress_router
from src.backend.app.ingestion.loader import ingest_all
from src.backend.app.services.risk_engine import run_full_pipeline
from src.backend.app.database import SessionLocal

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="FINRISK AI",
    description="AI/NLP Financial Risk Intelligence Engine — S&P Global Hackathon 2026",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(dashboard_router)
app.include_router(stress_router)


@app.on_event("startup")
def on_startup():
    """Ingest data and run risk pipeline on server start."""
    logger.info("Starting data ingestion...")
    ingest_all()
    logger.info("Running risk scoring pipeline...")
    db = SessionLocal()
    try:
        run_full_pipeline(db)
    finally:
        db.close()
    logger.info("Backend ready!")


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "finrisk-ai"}


@app.get("/api/info")
async def api_info():
    return {
        "name": "FINRISK AI",
        "version": "1.0.0",
        "modules": ["NLP Sentiment Analysis", "Transaction Anomaly Detection", "Portfolio Stress Testing"],
        "datasets": ["Financial PhraseBank", "Tweet Sentiment", "News Headlines", "Financial Transactions"],
    }
