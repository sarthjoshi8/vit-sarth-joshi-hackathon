"""Stress testing API endpoints."""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from src.backend.app.services.stress_test import run_stress_test, get_available_scenarios

router = APIRouter(prefix="/api/stress-test", tags=["stress-test"])


class PortfolioPosition(BaseModel):
    stock: str
    weight: float = 0.0
    value: float = 0.0


class StressTestRequest(BaseModel):
    portfolio: List[PortfolioPosition]
    scenario: str = "recession"
    custom_shock: Optional[float] = None


@router.get("/scenarios")
def list_scenarios():
    """Get available stress test scenarios."""
    return {"scenarios": get_available_scenarios()}


@router.post("/run")
def execute_stress_test(req: StressTestRequest):
    """Run a stress test on the given portfolio."""
    if not req.portfolio:
        raise HTTPException(status_code=400, detail="Portfolio cannot be empty")

    portfolio = [p.model_dump() for p in req.portfolio]
    result = run_stress_test(portfolio, req.scenario, req.custom_shock)
    return result


@router.post("/compare")
def compare_scenarios(req: StressTestRequest):
    """Run all scenarios on the same portfolio for comparison."""
    if not req.portfolio:
        raise HTTPException(status_code=400, detail="Portfolio cannot be empty")

    portfolio = [p.model_dump() for p in req.portfolio]
    results = {}
    for scenario_key in ["recession", "inflation", "market_crash", "geopolitical", "pandemic"]:
        results[scenario_key] = run_stress_test(portfolio, scenario_key, None)

    return {"comparison": results}
