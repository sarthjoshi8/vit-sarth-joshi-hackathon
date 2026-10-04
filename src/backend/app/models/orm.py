"""SQLAlchemy ORM models for FINRISK AI."""
from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from src.backend.app.database import Base


class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(Integer, unique=True, index=True)
    date = Column(String(20))
    customer_id = Column(Integer, index=True)
    amount = Column(Float)
    type = Column(String(10))          # credit / debit
    description = Column(Text)
    risk_score = Column(Float, nullable=True)       # computed later
    anomaly_flag = Column(Integer, default=0)       # 0=normal, 1=anomaly


class Headline(Base):
    __tablename__ = "headlines"
    id = Column(Integer, primary_key=True, index=True)
    source = Column(String(20))        # cnbc / guardian / reuters
    headline = Column(Text)
    time = Column(String(80), nullable=True)
    description = Column(Text, nullable=True)
    sentiment = Column(String(10), nullable=True)   # positive/negative/neutral
    sentiment_score = Column(Float, nullable=True)


class PhraseBank(Base):
    __tablename__ = "phrasebank"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text)
    sentiment = Column(String(10))     # positive/negative/neutral


class Tweet(Base):
    __tablename__ = "tweets"
    id = Column(Integer, primary_key=True, index=True)
    tweet = Column(Text)
    stock = Column(String(30), index=True)
    date = Column(String(20))
    last_price = Column(Float, nullable=True)
    day_return_1 = Column(Float, nullable=True)
    day_return_7 = Column(Float, nullable=True)
    volatility_10d = Column(Float, nullable=True)
    volatility_30d = Column(Float, nullable=True)
    lstm_polarity = Column(Float, nullable=True)
    textblob_polarity = Column(Float, nullable=True)


class RiskEvent(Base):
    """Aggregated risk events produced by the NLP pipeline."""
    __tablename__ = "risk_events"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(String(30))
    category = Column(String(30))      # market / credit / operational / sentiment
    severity = Column(String(10))      # low / medium / high / critical
    title = Column(String(200))
    description = Column(Text)
    source = Column(String(30))        # headline / tweet / transaction / phrasebank
    score = Column(Float)
