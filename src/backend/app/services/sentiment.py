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
    "profit", "gain", "growth", "surge", "rally", "beat", "exceeds",
    "upgrade", "bullish", "recovery", "outperform", "dividend", "earnings",
    "record", "strong", "positive", "optimistic", "upside", "improve",
    "innovation", "expand", "revenue", "breakthrough", "success", "boost",
    "high", "soar", "climb", "advance", "win", "rebound", "buy",
}

NEGATIVE_WORDS = {
    "loss", "decline", "drop", "fall", "crash", "plunge", "bearish",
    "downgrade", "recession", "default", "bankruptcy", "fraud", "risk",
    "volatile", "negative", "weak", "slump", "debt", "deficit", "cut",
    "layoff", "warning", "miss", "sell", "concern", "uncertainty",
    "downturn", "crisis", "collapse", "penalty", "sanctions", "inflation",
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
