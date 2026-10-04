"""Dashboard & analytics API endpoints."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from src.backend.app.database import get_db
from src.backend.app.models.orm import Transaction, Headline, Tweet, RiskEvent

router = APIRouter(prefix="/api", tags=["dashboard"])


@router.get("/dashboard/summary")
def get_dashboard_summary(db: Session = Depends(get_db)):
    """Get aggregated dashboard statistics."""
    total_txn = db.query(Transaction).count()
    total_headlines = db.query(Headline).count()
    total_tweets = db.query(Tweet).count()
    total_risk = db.query(RiskEvent).count()
    anomalies = db.query(Transaction).filter(Transaction.anomaly_flag == 1).count()

    # Average risk score
    avg_risk = db.query(func.avg(Transaction.risk_score)).scalar()

    # Sentiment distribution from headlines
    pos = db.query(Headline).filter(Headline.sentiment == "positive").count()
    neg = db.query(Headline).filter(Headline.sentiment == "negative").count()
    neu = db.query(Headline).filter(Headline.sentiment == "neutral").count()

    # Severity distribution from risk events
    sev_dist = {}
    for sev in ["low", "medium", "high", "critical"]:
        sev_dist[sev] = db.query(RiskEvent).filter(RiskEvent.severity == sev).count()

    # Category distribution
    cat_dist = {}
    for cat in ["market", "credit", "operational", "sentiment"]:
        cat_dist[cat] = db.query(RiskEvent).filter(RiskEvent.category == cat).count()

    return {
        "total_transactions": total_txn,
        "total_headlines": total_headlines,
        "total_tweets": total_tweets,
        "total_risk_events": total_risk,
        "anomaly_count": anomalies,
        "avg_risk_score": round(avg_risk, 4) if avg_risk else 0,
        "sentiment_distribution": {"positive": pos, "negative": neg, "neutral": neu},
        "severity_distribution": sev_dist,
        "category_distribution": cat_dist,
    }


@router.get("/transactions")
def get_transactions(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    anomaly_only: bool = False,
    db: Session = Depends(get_db),
):
    """List transactions with pagination and optional anomaly filter."""
    q = db.query(Transaction)
    if anomaly_only:
        q = q.filter(Transaction.anomaly_flag == 1)
    q = q.order_by(Transaction.risk_score.desc())
    total = q.count()
    items = q.offset((page - 1) * limit).limit(limit).all()
    return {
        "total": total,
        "page": page,
        "items": [
            {
                "id": t.id, "transaction_id": t.transaction_id,
                "date": t.date, "customer_id": t.customer_id,
                "amount": t.amount, "type": t.type,
                "description": t.description,
                "risk_score": t.risk_score, "anomaly_flag": t.anomaly_flag,
            }
            for t in items
        ],
    }


@router.get("/headlines")
def get_headlines(
    source: str = Query(None),
    sentiment: str = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    """List headlines with optional source and sentiment filters."""
    q = db.query(Headline)
    if source:
        q = q.filter(Headline.source == source)
    if sentiment:
        q = q.filter(Headline.sentiment == sentiment)
    total = q.count()
    items = q.offset((page - 1) * limit).limit(limit).all()
    return {
        "total": total,
        "page": page,
        "items": [
            {
                "id": h.id, "source": h.source, "headline": h.headline,
                "time": h.time, "sentiment": h.sentiment,
                "sentiment_score": h.sentiment_score,
            }
            for h in items
        ],
    }


@router.get("/tweets")
def get_tweets(
    stock: str = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    """List tweets with optional stock filter."""
    q = db.query(Tweet)
    if stock:
        q = q.filter(Tweet.stock == stock)
    total = q.count()
    items = q.offset((page - 1) * limit).limit(limit).all()
    return {
        "total": total,
        "page": page,
        "items": [
            {
                "id": t.id, "tweet": t.tweet, "stock": t.stock,
                "date": t.date, "last_price": t.last_price,
                "volatility_30d": t.volatility_30d,
                "lstm_polarity": t.lstm_polarity,
                "textblob_polarity": t.textblob_polarity,
            }
            for t in items
        ],
    }


@router.get("/risk-events")
def get_risk_events(
    category: str = Query(None),
    severity: str = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    """List risk events with optional filters."""
    q = db.query(RiskEvent)
    if category:
        q = q.filter(RiskEvent.category == category)
    if severity:
        q = q.filter(RiskEvent.severity == severity)
    q = q.order_by(RiskEvent.score.desc())
    total = q.count()
    items = q.offset((page - 1) * limit).limit(limit).all()
    return {
        "total": total,
        "page": page,
        "items": [
            {
                "id": e.id, "timestamp": e.timestamp, "category": e.category,
                "severity": e.severity, "title": e.title,
                "description": e.description, "source": e.source, "score": e.score,
            }
            for e in items
        ],
    }


@router.get("/stocks")
def get_unique_stocks(db: Session = Depends(get_db)):
    """Get list of unique stocks in tweet data."""
    stocks = db.query(Tweet.stock).distinct().all()
    return {"stocks": sorted([s[0] for s in stocks if s[0]])}
