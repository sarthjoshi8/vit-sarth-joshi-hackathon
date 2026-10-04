"""
Strategic Portfolio Stress Testing Engine (Module B).

Implements Monte Carlo VaR/CVaR simulation and predefined macro scenarios.
"""
import math, random, statistics, logging
from typing import List, Dict, Optional

logger = logging.getLogger(__name__)

# ── Predefined Macro Scenarios ────────────────────────────────
SCENARIOS = {
    "recession": {
        "label": "Global Recession",
        "description": "GDP contracts 3%, unemployment rises, consumer spending drops",
        "equity_shock": -0.25,       # -25%
        "volatility_multiplier": 2.0,
        "sector_adjustments": {
            "tech": -0.30, "finance": -0.35, "healthcare": -0.10,
            "energy": -0.20, "consumer": -0.28, "utilities": -0.05,
        },
    },
    "inflation": {
        "label": "Inflation Spike",
        "description": "CPI rises to 8%+, Fed raises rates aggressively",
        "equity_shock": -0.15,
        "volatility_multiplier": 1.5,
        "sector_adjustments": {
            "tech": -0.25, "finance": 0.05, "healthcare": -0.08,
            "energy": 0.10, "consumer": -0.20, "utilities": -0.03,
        },
    },
    "market_crash": {
        "label": "Black Swan Market Crash",
        "description": "Sudden 40% market decline, liquidity crisis",
        "equity_shock": -0.40,
        "volatility_multiplier": 3.0,
        "sector_adjustments": {
            "tech": -0.45, "finance": -0.50, "healthcare": -0.25,
            "energy": -0.35, "consumer": -0.38, "utilities": -0.15,
        },
    },
    "geopolitical": {
        "label": "Geopolitical Crisis",
        "description": "Major trade war, sanctions, supply chain disruption",
        "equity_shock": -0.20,
        "volatility_multiplier": 1.8,
        "sector_adjustments": {
            "tech": -0.22, "finance": -0.18, "healthcare": -0.05,
            "energy": -0.30, "consumer": -0.25, "utilities": -0.08,
        },
    },
    "pandemic": {
        "label": "Pandemic Shock",
        "description": "New pandemic causes global lockdowns and economic disruption",
        "equity_shock": -0.30,
        "volatility_multiplier": 2.5,
        "sector_adjustments": {
            "tech": 0.05, "finance": -0.25, "healthcare": 0.15,
            "energy": -0.40, "consumer": -0.35, "utilities": -0.10,
        },
    },
}

# Map common stock tickers to sectors
STOCK_SECTORS = {
    "AAPL": "tech", "MSFT": "tech", "GOOGL": "tech", "AMZN": "tech",
    "META": "tech", "NVDA": "tech", "TSLA": "tech", "NFLX": "tech",
    "JPM": "finance", "BAC": "finance", "GS": "finance", "WFC": "finance",
    "JNJ": "healthcare", "PFE": "healthcare", "UNH": "healthcare",
    "XOM": "energy", "CVX": "energy", "COP": "energy",
    "WMT": "consumer", "PG": "consumer", "KO": "consumer", "PEP": "consumer",
    "NEE": "utilities", "DUK": "utilities", "SO": "utilities",
}


def _get_sector(stock: str) -> str:
    return STOCK_SECTORS.get(stock.upper(), "tech")  # default to tech


def monte_carlo_var(
    portfolio_value: float,
    shock: float,
    vol_multiplier: float,
    n_simulations: int = 10000,
    confidence: float = 0.95,
) -> Dict:
    """Run Monte Carlo simulation for VaR/CVaR."""
    random.seed(42)
    daily_vol = 0.02 * vol_multiplier  # base 2% daily vol
    mean_return = shock / 252           # annualised shock to daily

    simulated_losses = []
    for _ in range(n_simulations):
        # Simulate 21 trading days (1 month)
        cumulative_return = 0
        for _ in range(21):
            daily_return = random.gauss(mean_return, daily_vol)
            cumulative_return += daily_return
        loss = portfolio_value * cumulative_return
        simulated_losses.append(loss)

    simulated_losses.sort()
    var_idx = int((1 - confidence) * n_simulations)
    var_95 = abs(simulated_losses[var_idx])
    cvar_95 = abs(statistics.mean(simulated_losses[:var_idx])) if var_idx > 0 else var_95

    return {
        "var_95": round(var_95, 2),
        "cvar_95": round(cvar_95, 2),
        "worst_case": round(abs(min(simulated_losses)), 2),
        "best_case": round(max(simulated_losses), 2),
        "mean_loss": round(abs(statistics.mean(simulated_losses)), 2),
    }


def run_stress_test(
    portfolio: List[Dict],
    scenario: str = "recession",
    custom_shock: Optional[float] = None,
) -> Dict:
    """
    Run stress test on a portfolio.

    Args:
        portfolio: [{"stock": "AAPL", "weight": 0.3, "value": 10000}, ...]
        scenario: one of the predefined scenario keys
        custom_shock: optional override shock percentage (e.g., -0.30)

    Returns:
        Complete stress test results including per-stock impacts.
    """
    sc = SCENARIOS.get(scenario, SCENARIOS["recession"])

    total_value = sum(p.get("value", 0) for p in portfolio)
    if total_value == 0:
        total_value = 100000  # default

    stock_impacts = []
    stressed_total = 0

    for position in portfolio:
        stock = position.get("stock", "UNKNOWN")
        weight = position.get("weight", 1.0 / len(portfolio))
        value = position.get("value", total_value * weight)
        sector = _get_sector(stock)

        # Get sector-specific shock or use general equity shock
        if custom_shock is not None:
            shock = custom_shock
        else:
            shock = sc["sector_adjustments"].get(sector, sc["equity_shock"])

        stressed_value = value * (1 + shock)

        stock_impacts.append({
            "stock": stock,
            "sector": sector,
            "original_value": round(value, 2),
            "stressed_value": round(stressed_value, 2),
            "loss": round(value - stressed_value, 2),
            "loss_pct": round(abs(shock) * 100, 2),
            "shock_applied": round(shock, 4),
        })

        stressed_total += stressed_value

    # Monte Carlo for portfolio-level VaR
    mc = monte_carlo_var(
        total_value,
        custom_shock or sc["equity_shock"],
        sc["volatility_multiplier"],
    )

    loss_pct = round(((total_value - stressed_total) / total_value) * 100, 2) if total_value else 0

    return {
        "scenario": sc["label"],
        "scenario_key": scenario,
        "description": sc["description"],
        "original_value": round(total_value, 2),
        "stressed_value": round(stressed_total, 2),
        "total_loss": round(total_value - stressed_total, 2),
        "loss_pct": loss_pct,
        "var_95": mc["var_95"],
        "cvar_95": mc["cvar_95"],
        "worst_case_loss": mc["worst_case"],
        "mean_expected_loss": mc["mean_loss"],
        "stock_impacts": stock_impacts,
        "risk_rating": (
            "CRITICAL" if loss_pct > 30 else
            "HIGH" if loss_pct > 20 else
            "MEDIUM" if loss_pct > 10 else
            "LOW"
        ),
    }


def get_available_scenarios() -> List[Dict]:
    """Return list of available stress test scenarios."""
    return [
        {
            "key": k,
            "label": v["label"],
            "description": v["description"],
            "equity_shock": v["equity_shock"],
        }
        for k, v in SCENARIOS.items()
    ]
