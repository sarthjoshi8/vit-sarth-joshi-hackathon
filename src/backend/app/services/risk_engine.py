"""
Risk scoring engine — assigns risk scores to transactions and generates
aggregated risk events from multiple data sources.
"""
import logging, statistics, random
from datetime import datetime
from sqlalchemy.orm import Session
from src.backend.app.models.orm import Transaction, Headline, Tweet, RiskEvent
from src.backend.app.services.sentiment import analyze_sentiment

logger = logging.getLogger(__name__)


def score_transactions(db: Session):
    """
    Assign risk scores to transactions based on:
    - Amount outlier detection (z-score)
    - Transaction frequency per customer
    - Description sentiment
    """
    txns = db.query(Transaction).all()
    if not txns:
        return

    amounts = [t.amount for t in txns]
    mean_amt = statistics.mean(amounts)
    std_amt = statistics.stdev(amounts) if len(amounts) > 1 else 1.0

    # Count transactions per customer for velocity scoring
    customer_counts = {}
    for t in txns:
        customer_counts[t.customer_id] = customer_counts.get(t.customer_id, 0) + 1

    max_count = max(customer_counts.values())

    for t in txns:
        # Z-score for amount (higher = riskier)
        z_score = abs((t.amount - mean_amt) / std_amt) if std_amt > 0 else 0

        # Velocity score (normalized)
        velocity = customer_counts[t.customer_id] / max_count

        # Sentiment from description
        _, sent_score = analyze_sentiment(t.description)
        # More negative = riskier
        sent_risk = max(0, -sent_score)

        # Weighted composite score [0, 1]
        risk = min(1.0, (0.5 * min(z_score / 3, 1.0)) + (0.3 * velocity) + (0.2 * sent_risk))
        t.risk_score = round(risk, 4)
        t.anomaly_flag = 1 if risk >= 0.48 else 0

    db.commit()
    anomalies = sum(1 for t in txns if t.anomaly_flag == 1)
    logger.info(f"Scored {len(txns)} transactions, {anomalies} anomalies flagged")


def score_headlines(db: Session):
    """Run sentiment analysis on all headlines."""
    headlines = db.query(Headline).filter(Headline.sentiment.is_(None)).all()
    for h in headlines:
        label, score = analyze_sentiment(h.headline)
        h.sentiment = label
        h.sentiment_score = score
    db.commit()
    logger.info(f"Scored {len(headlines)} headlines")


def generate_risk_events(db: Session):
    """Generate aggregated risk events from scored data."""
    now = datetime.utcnow().isoformat()
    db.query(RiskEvent).delete()

    # 1. Transaction anomaly events
    anomalies = db.query(Transaction).filter(Transaction.anomaly_flag == 1).order_by(Transaction.risk_score.desc()).all()
    for a in anomalies[:40]:  # Top 40 anomalies
        db.add(RiskEvent(
            timestamp=now,
            category="operational",
            severity="critical" if a.risk_score > 0.62 else "high" if a.risk_score > 0.52 else "medium",
            title=f"Anomalous transaction #{a.transaction_id}",
            description=f"Customer {a.customer_id}: ${a.amount:.2f} ({a.type}) — risk score {a.risk_score:.2f}",
            source="transaction",
            score=a.risk_score,
        ))

    # 2. Negative headline events
    neg_headlines = db.query(Headline).filter(Headline.sentiment == "negative").order_by(
        Headline.sentiment_score.asc()
    ).limit(30).all()
    for h in neg_headlines:
        severity = "critical" if h.sentiment_score < -0.6 else "high" if h.sentiment_score < -0.3 else "medium"
        db.add(RiskEvent(
            timestamp=now,
            category="market",
            severity=severity,
            title=h.headline[:200],
            description=f"Source: {h.source} | Sentiment: {h.sentiment_score:.2f}",
            source="headline",
            score=abs(h.sentiment_score),
        ))

    # 3. High-volatility tweet events
    vol_tweets = db.query(Tweet).filter(
        Tweet.volatility_30d.isnot(None),
        Tweet.volatility_30d > 25
    ).limit(20).all()
    for t in vol_tweets:
        db.add(RiskEvent(
            timestamp=now,
            category="sentiment",
            severity="high" if t.volatility_30d > 40 else "medium",
            title=f"High volatility alert: {t.stock}",
            description=f"30d vol: {t.volatility_30d:.1f}% | Tweet: {t.tweet[:100]}",
            source="tweet",
            score=min(1.0, t.volatility_30d / 50),
        ))

    db.commit()
    total = db.query(RiskEvent).count()
    logger.info(f"Generated risk events, total in DB: {total}")


def run_full_pipeline(db: Session):
    """Execute the complete risk scoring pipeline."""
    logger.info("=== Starting risk scoring pipeline ===")
    score_transactions(db)
    score_headlines(db)
    generate_risk_events(db)
    logger.info("=== Risk scoring pipeline complete ===")
