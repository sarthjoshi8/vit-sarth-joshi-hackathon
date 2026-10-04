"""
NLP Sentiment Analysis Service using a lightweight keyword-based approach
with optional HuggingFace transformer upgrade path.

This avoids heavy torch downloads for hackathon demo while still
producing meaningful sentiment scores.
"""
import re, math, logging
from typing import Tuple

logger = logging.getLogger(__name__)

# ── Sentiment lexicon (finance-tuned) ─────────────────────────
POSITIVE_WORDS = {
    "profit", "profits", "profitable", "gain", "gains", "gaining", "growth", "growing",
    "surge", "surges", "surging", "surged", "rally", "rallies", "rallying", "beat", "beats", "beating", "exceeds", "exceeded", "exceeding",
    "upgrade", "upgrades", "upgraded", "upgrading", "bullish", "recovery", "recoveries", "recovering", "recovered", "outperform", "outperformed",
    "dividend", "dividends", "earnings", "earned", "record", "records", "strong", "stronger", "strongest", "positive", "optimistic",
    "upside", "improve", "improves", "improved", "improving", "innovation", "innovative", "expand", "expands", "expanding", "expanded",
    "revenue", "revenues", "breakthrough", "breakthroughs", "success", "successful", "boost", "boosts", "boosted", "boosting",
    "high", "higher", "highest", "soar", "soars", "soaring", "soared", "climb", "climbs", "climbing", "climbed",
    "advance", "advances", "advancing", "win", "wins", "winning", "won", "rebound", "rebounds", "rebounding", "buy", "buys", "buying"
}

NEGATIVE_WORDS = {
    "loss", "losses", "lost", "losing", "decline", "declines", "declined", "declining", "drop", "drops", "dropped", "dropping",
    "fall", "falls", "falling", "fallen", "crash", "crashes", "crashed", "crashing", "plunge", "plunges", "plunged", "plunging",
    "bearish", "downgrade", "downgrades", "downgraded", "downgrading", "recession", "recessionary", "default", "defaults", "defaulted", "defaulting",
    "bankruptcy", "bankrupt", "bankruptcies", "fraud", "frauds", "fraudulent", "risk", "risks", "risky", "volatile", "volatility",
    "negative", "weak", "weaker", "weakest", "weakness", "slump", "slumps", "slumped", "slumping", "debt", "debts", "deficit", "deficits",
    "cut", "cuts", "cutting", "layoff", "layoffs", "warning", "warnings", "warned", "miss", "misses", "missed", "missing",
    "sell", "sells", "selling", "sold", "concern", "concerns", "concerned", "uncertainty", "uncertainties", "uncertain",
    "downturn", "downturns", "crisis", "crises", "collapse", "collapses", "collapsed", "collapsing",
    "penalty", "penalties", "penalized", "sanctions", "sanctioned", "inflation", "inflationary"
}

INTENSIFIERS = {"very", "extremely", "significantly", "sharply", "dramatically", "hugely"}
NEGATORS = {"not", "no", "never", "neither", "nor", "barely", "hardly"}


def analyze_sentiment(text: str) -> Tuple[str, float]:
    """
    Returns (label, score) where:
      - label: 'positive' | 'negative' | 'neutral'
      - score: float in [-1.0, 1.0]
    """
    if not text:
        return "neutral", 0.0

    words = re.findall(r'\b\w+\b', text.lower())
    pos_count = 0
    neg_count = 0
    negate = False

    for i, word in enumerate(words):
        if word in NEGATORS:
            negate = True
            continue

        multiplier = 1.5 if (i > 0 and words[i - 1] in INTENSIFIERS) else 1.0

        if word in POSITIVE_WORDS:
            if negate:
                neg_count += multiplier
            else:
                pos_count += multiplier
            negate = False
        elif word in NEGATIVE_WORDS:
            if negate:
                pos_count += multiplier
            else:
                neg_count += multiplier
            negate = False
        else:
            # Reset negation after 2 words
            if negate and i > 0:
                negate = False

    total = pos_count + neg_count
    if total == 0:
        return "neutral", 0.0

    raw_score = (pos_count - neg_count) / total  # in [-1, 1]

    if raw_score > 0.15:
        label = "positive"
    elif raw_score < -0.15:
        label = "negative"
    else:
        label = "neutral"

    return label, round(raw_score, 4)


def batch_analyze(texts: list) -> list:
    """Analyze sentiment for a batch of texts."""
    return [analyze_sentiment(t) for t in texts]


def analyze_detailed(text: str) -> dict:
    """
    Detailed NLP inspection of a single sentence/headline:
    returns polarity, confidence, detected keywords, affected sectors, and risk level.
    """
    if not text:
        return {
            "label": "neutral",
            "score": 0.0,
            "confidence": 0.50,
            "risk_rating": "LOW",
            "positive_keywords": [],
            "negative_keywords": [],
            "sectors": [],
            "market_shock_pct": "0.0%",
            "recommendation": "Neutral market signal. Maintain standard allocation."
        }

    words = re.findall(r'\b\w+\b', text.lower())
    pos_found = []
    neg_found = []
    pos_count = 0
    neg_count = 0
    negate = False

    for i, word in enumerate(words):
        if word in NEGATORS:
            negate = True
            continue

        multiplier = 1.5 if (i > 0 and words[i - 1] in INTENSIFIERS) else 1.0

        if word in POSITIVE_WORDS:
            if negate:
                neg_count += multiplier
                neg_found.append(f"not {word}")
            else:
                pos_count += multiplier
                pos_found.append(word)
            negate = False
        elif word in NEGATIVE_WORDS:
            if negate:
                pos_count += multiplier
                pos_found.append(f"not {word}")
            else:
                neg_count += multiplier
                neg_found.append(word)
            negate = False
        else:
            if negate and i > 0:
                negate = False

    total = pos_count + neg_count
    if total == 0:
        raw_score = 0.0
        label = "neutral"
        confidence = 0.65
    else:
        raw_score = (pos_count - neg_count) / total
        confidence = min(0.98, round(0.65 + (abs(raw_score) * 0.30), 2))
        if raw_score > 0.15:
            label = "positive"
        elif raw_score < -0.15:
            label = "negative"
        else:
            label = "neutral"

    # Sector inference
    text_lower = text.lower()
    sectors = []
    if any(k in text_lower for k in ["tech", "ai", "software", "apple", "nvidia", "microsoft", "chip", "semiconductor"]):
        sectors.append({"name": "Technology", "bias": "Bullish" if label == "positive" else "Bearish" if label == "negative" else "Neutral"})
    if any(k in text_lower for k in ["bank", "fed", "rate", "inflation", "credit", "debt", "jpmorgan", "loan", "yield"]):
        sectors.append({"name": "Financials", "bias": "Bullish" if label == "positive" else "Bearish" if label == "negative" else "Neutral"})
    if any(k in text_lower for k in ["oil", "gas", "energy", "crude", "opec", "pipeline", "exxon"]):
        sectors.append({"name": "Energy", "bias": "Bullish" if label == "positive" else "Bearish" if label == "negative" else "Neutral"})
    if any(k in text_lower for k in ["fda", "drug", "trial", "vaccine", "health", "pharma", "biotech"]):
        sectors.append({"name": "Healthcare", "bias": "Bullish" if label == "positive" else "Bearish" if label == "negative" else "Neutral"})

    if not sectors:
        sectors.append({"name": "Broad Market (S&P 500)", "bias": "Bullish" if label == "positive" else "Bearish" if label == "negative" else "Neutral"})

    # Risk rating
    if label == "negative":
        risk_rating = "CRITICAL" if raw_score < -0.6 else "HIGH" if raw_score < -0.3 else "MEDIUM"
        shock_pct = f"{round(raw_score * 4.5, 1)}%"
        recommendation = "Downside volatility detected. Tactical delta hedging or index put protection recommended."
    elif label == "positive":
        risk_rating = "LOW"
        shock_pct = f"+{round(raw_score * 3.8, 1)}%"
        recommendation = "Favorable tailwind. Upside momentum expected across correlated equities."
    else:
        risk_rating = "LOW"
        shock_pct = "0.0%"
        recommendation = "Balanced baseline sentiment. No immediate macro rebalancing required."

    return {
        "text": text,
        "label": label,
        "score": round(raw_score, 4),
        "confidence": confidence,
        "risk_rating": risk_rating,
        "positive_keywords": list(set(pos_found)),
        "negative_keywords": list(set(neg_found)),
        "sectors": sectors,
        "market_shock_pct": shock_pct,
        "recommendation": recommendation
    }

