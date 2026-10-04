"""Pydantic schemas for API request/response validation."""
from pydantic import BaseModel
from typing import Optional, List


# ── Transactions ──────────────────────────────────────────────
class TransactionOut(BaseModel):
    id: int
    transaction_id: int
    date: str
    customer_id: int
    amount: float
    type: str
    description: str
    risk_score: Optional[float] = None
    anomaly_flag: int = 0

    class Config:
        from_attributes = True


# ── Headlines ─────────────────────────────────────────────────
class HeadlineOut(BaseModel):
    id: int
    source: str
    headline: str
    time: Optional[str] = None
    sentiment: Optional[str] = None
    sentiment_score: Optional[float] = None

    class Config:
        from_attributes = True


# ── Tweets ────────────────────────────────────────────────────
class TweetOut(BaseModel):
    id: int
    tweet: str
    stock: str
    date: str
    last_price: Optional[float] = None
    lstm_polarity: Optional[float] = None
    textblob_polarity: Optional[float] = None

    class Config:
        from_attributes = True


# ── Risk Events ───────────────────────────────────────────────
class RiskEventOut(BaseModel):
    id: int
    timestamp: str
    category: str
    severity: str
    title: str
    description: str
    source: str
    score: float

    class Config:
        from_attributes = True


# ── Dashboard Summary ─────────────────────────────────────────
class DashboardSummary(BaseModel):
    total_transactions: int
    total_headlines: int
    total_tweets: int
    total_risk_events: int
    anomaly_count: int
    avg_risk_score: Optional[float] = None
    sentiment_distribution: dict  # {"positive": int, "negative": int, "neutral": int}
    severity_distribution: dict   # {"low": int, "medium": int, ...}


# ── Stress Test ───────────────────────────────────────────────
class StressTestRequest(BaseModel):
    portfolio: List[dict]  # [{"stock": "AAPL", "weight": 0.3, "value": 10000}, ...]
    scenario: str = "recession"  # recession / inflation / market_crash / custom
    shock_pct: Optional[float] = None  # override shock percentage


class StressTestResult(BaseModel):
    scenario: str
    original_value: float
    stressed_value: float
    loss_pct: float
    var_95: float
    cvar_95: float
    stock_impacts: List[dict]
