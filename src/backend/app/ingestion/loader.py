"""Load sample CSVs into SQLite database."""
import os, csv, logging
from sqlalchemy.orm import Session
from src.backend.app.database import engine, SessionLocal, Base
from src.backend.app.models.orm import Transaction, Headline, PhraseBank, Tweet

logger = logging.getLogger(__name__)

SAMPLES_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))),
    "data", "samples",
)


def _load_transactions(db: Session):
    path = os.path.join(SAMPLES_DIR, "transactions_sample.csv")
    if not os.path.exists(path):
        logger.warning("transactions_sample.csv not found, skipping")
        return 0
    count = 0
    with open(path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            db.add(Transaction(
                transaction_id=int(row["transaction_id"]),
                date=row["date"],
                customer_id=int(row["customer_id"]),
                amount=float(row["amount"]),
                type=row["type"],
                description=row["description"],
            ))
            count += 1
    db.commit()
    logger.info(f"Loaded {count} transactions")
    return count


def _load_headlines(db: Session, filename: str, source: str):
    path = os.path.join(SAMPLES_DIR, filename)
    if not os.path.exists(path):
        logger.warning(f"{filename} not found, skipping")
        return 0
    count = 0
    with open(path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            headline_text = row.get("Headlines", row.get("headline", ""))
            if not headline_text.strip():
                continue
            db.add(Headline(
                source=source,
                headline=headline_text,
                time=row.get("Time", row.get("time", "")),
                description=row.get("Description", row.get("description", "")),
            ))
            count += 1
    db.commit()
    logger.info(f"Loaded {count} headlines from {source}")
    return count


def _load_phrasebank(db: Session):
    path = os.path.join(SAMPLES_DIR, "phrasebank_sample.csv")
    if not os.path.exists(path):
        logger.warning("phrasebank_sample.csv not found, skipping")
        return 0
    count = 0
    with open(path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            db.add(PhraseBank(
                text=row.get("text", ""),
                sentiment=row.get("sentiment", "neutral"),
            ))
            count += 1
    db.commit()
    logger.info(f"Loaded {count} phrasebank entries")
    return count


def _load_tweets(db: Session):
    path = os.path.join(SAMPLES_DIR, "tweets_sample.csv")
    if not os.path.exists(path):
        logger.warning("tweets_sample.csv not found, skipping")
        return 0
    count = 0
    with open(path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            def safe_float(v):
                try:
                    return float(v)
                except (ValueError, TypeError):
                    return None
            db.add(Tweet(
                tweet=row.get("TWEET", ""),
                stock=row.get("STOCK", ""),
                date=row.get("DATE", ""),
                last_price=safe_float(row.get("LAST_PRICE")),
                day_return_1=safe_float(row.get("1_DAY_RETURN")),
                day_return_7=safe_float(row.get("7_DAY_RETURN")),
                volatility_10d=safe_float(row.get("VOLATILITY_10D")),
                volatility_30d=safe_float(row.get("VOLATILITY_30D")),
                lstm_polarity=safe_float(row.get("LSTM_POLARITY")),
                textblob_polarity=safe_float(row.get("TEXTBLOB_POLARITY")),
            ))
            count += 1
    db.commit()
    logger.info(f"Loaded {count} tweets")
    return count


def ingest_all():
    """Create tables and ingest all sample data."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Skip if already loaded
        if db.query(Transaction).first():
            logger.info("Database already populated, skipping ingestion")
            return

        _load_transactions(db)
        _load_headlines(db, "cnbc_headlines_sample.csv", "cnbc")
        _load_headlines(db, "guardian_headlines_sample.csv", "guardian")
        _load_headlines(db, "reuters_headlines_sample.csv", "reuters")
        _load_phrasebank(db)
        _load_tweets(db)
        logger.info("=== Ingestion complete ===")
    finally:
        db.close()
