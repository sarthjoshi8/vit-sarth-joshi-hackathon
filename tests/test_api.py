"""Unit and integration test suite for FINRISK AI backend."""
import pytest
from fastapi.testclient import TestClient
from src.backend.app.main import app

client = TestClient(app)


def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"


def test_api_info():
    res = client.get("/api/info")
    assert res.status_code == 200
    data = res.json()
    assert data["name"] == "FINRISK AI"
    assert "Portfolio Stress Testing" in data["modules"]


def test_dashboard_summary():
    res = client.get("/api/dashboard/summary")
    assert res.status_code == 200
    data = res.json()
    assert "total_transactions" in data
    assert "total_headlines" in data
    assert "sentiment_distribution" in data
    assert data["total_transactions"] > 0


def test_transactions_endpoint():
    res = client.get("/api/transactions?limit=10")
    assert res.status_code == 200
    data = res.json()
    assert "items" in data
    assert len(data["items"]) <= 10
    if len(data["items"]) > 0:
        item = data["items"][0]
        assert "transaction_id" in item
        assert "amount" in item
        assert "risk_score" in item


def test_headlines_endpoint():
    res = client.get("/api/headlines?limit=5")
    assert res.status_code == 200
    data = res.json()
    assert "items" in data
    assert len(data["items"]) <= 5


def test_stress_test_scenarios():
    res = client.get("/api/stress-test/scenarios")
    assert res.status_code == 200
    data = res.json()
    assert "scenarios" in data
    keys = [s["key"] for s in data["scenarios"]]
    assert "recession" in keys
    assert "market_crash" in keys


def test_stress_test_execution():
    payload = {
        "portfolio": [
            {"stock": "AAPL", "weight": 0.6, "value": 60000},
            {"stock": "JPM", "weight": 0.4, "value": 40000}
        ],
        "scenario": "recession"
    }
    res = client.post("/api/stress-test/run", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["scenario_key"] == "recession"
    assert data["original_value"] == 100000.0
    assert data["stressed_value"] < data["original_value"]
    assert "var_95" in data
    assert "cvar_95" in data
    assert len(data["stock_impacts"]) == 2


def test_stress_test_comparison():
    payload = {
        "portfolio": [
            {"stock": "AAPL", "weight": 0.5, "value": 50000},
            {"stock": "NVDA", "weight": 0.5, "value": 50000}
        ],
        "scenario": "recession"
    }
    res = client.post("/api/stress-test/compare", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "comparison" in data
    assert "recession" in data["comparison"]
    assert "market_crash" in data["comparison"]


def test_analyze_custom_text():
    payload = {
        "text": "NVIDIA posts massive quarterly revenue growth beating estimates",
        "save_to_feed": False
    }
    res = client.post("/api/analyze-text", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["label"] == "positive"
    assert data["score"] > 0
    assert "growth" in data["positive_keywords"]
    assert data["risk_rating"] == "LOW"

