# FINRISK AI — 7-Slide Presentation Deck
### S&P Global & CRISIL Campus Hackathon 2026
**Candidate:** Sarth Hemant Joshi | VIT Vellore | joshisarth8yt@gmail.com

---

## Slide 1 — Title

**FINRISK AI**
*Autonomous Multi-Modal Financial Risk Intelligence Engine*

> "From fragmented data silos to a unified, real-time sovereign risk command centre."

- **Candidate:** Sarth Hemant Joshi
- **College:** VIT Vellore
- **Hackathon:** S&P Global & CRISIL Campus Hackathon 2026
- **Module:** B — Strategic Portfolio Stress Testing + 3D/AR Spatial Experience

---

## Slide 2 — Problem & Approach

### The Problem
Financial risk today is trapped in silos:
- **Market risk** → Bloomberg terminals (expensive, inaccessible)
- **Operational risk** → buried in transaction databases
- **Sentiment risk** → scattered across Twitter, Reuters, CNBC

**Existing stress-testing tools** are static, batch-driven, and disconnected from real-time news sentiment and transaction anomalies.

Executives are forced to navigate **50-tab spreadsheets** instead of unified, actionable dashboards.

### Our Approach
Build a **single, locally-runnable platform** that:
1. Ingests multi-source financial data (transactions + news + tweets)
2. Scores every signal through AI/NLP + statistical engines
3. Simulates macro shocks via Monte Carlo VaR
4. Visualises sovereign risk on a 3D interactive globe

---

## Slide 3 — System Design

### Architecture at a Glance

```
CSV Datasets → Ingestion (loader.py) → SQLite DB
                                            │
            ┌───────────┬───────────────────┤
            ▼           ▼                   ▼
      risk_engine   sentiment.py      stress_test.py
      (Z-score +    (Finance NLP      (Monte Carlo
       velocity)     Lexicon)          VaR/CVaR)
            │           │                   │
            └───────────┴─────────────────-─┘
                         │
                   FastAPI REST API
                         │
              React 18 + Vite Frontend
       ┌──────────┬──────────┬──────────┐
   Dashboard  StressTest   Globe3D   ARLens
```

### Key Tech Choices

| Component | Technology | Reason |
|---|---|---|
| Backend | FastAPI + SQLite | Fast, zero-config, auto-docs |
| NLP | Custom Finance Lexicon | No torch downloads; 400-word finance-tuned |
| Monte Carlo | Pure Python (10k paths) | No external ML deps |
| 3D Globe | Three.js WebGL | GPU-accelerated, raycasting |
| Frontend | React 18 + Vite | Component-based, instant HMR |

---

## Slide 4 — Implementation Highlights

### Module B: Strategic Portfolio Stress Testing

**5 Macro Regimes:**
| Scenario | Equity Shock | Volatility Multiplier |
|---|---|---|
| Global Recession | -25% | 2.0× |
| Inflation Spike | -15% | 1.5× |
| Black Swan Crash | -40% | 3.0× |
| Geopolitical Crisis | -20% | 1.8× |
| Pandemic Shock | -30% | 2.5× |

**How it works:**
1. Each stock ticker maps to a sector (Tech/Finance/Healthcare/Energy/Utilities)
2. Sector-specific shocks applied (e.g., Tech -45% in Black Swan vs Healthcare -25%)
3. Monte Carlo runs **10,000 Gaussian random paths** over 21 trading days
4. Outputs: VaR 95%, CVaR/Expected Shortfall, worst-case, best-case

**NLP Sentiment Engine:**
- Finance-tuned lexicon: 200 positive + 200 negative financial keywords
- Handles negators (`not`, `barely`) and intensifiers (`extremely`, `sharply`)
- Score: −1.0 to +1.0 → label: positive / negative / neutral
- No HuggingFace/PyTorch required

**Transaction Anomaly Detection:**
```
risk_score = 0.5 × Z-score(amount)
           + 0.3 × velocity(customer frequency)
           + 0.2 × NLP sentiment risk(description)

risk ≥ 0.48 → ANOMALY FLAGGED
```

---

## Slide 5 — Key Results

### System Metrics

| Metric | Result |
|---|---|
| Transactions screened | **3,000** |
| Anomalies flagged | **91** (3.0% rate) |
| News headlines classified | **5,811** |
| Active risk events | **105** multi-source alerts |
| Simulation paths | **10,000** per stress test |
| API latency | **< 50ms** |
| Globe render | **60 FPS** WebGL |
| Tests passing | **8/8 (100%)** |

### Sentiment Distribution (5,811 headlines)
- 🟢 Positive: **749** (12.9%)
- 🔴 Negative: **618** (10.6%)
- ⚫ Neutral: **4,444** (76.5%)

### Stress Test Example (Balanced Portfolio, $200k)
| Scenario | Total Loss | Risk Rating |
|---|---|---|
| Global Recession | -$49,500 | HIGH |
| Black Swan Crash | -$79,000 | CRITICAL |
| Pandemic Shock | -$58,000 | CRITICAL |
| Inflation Spike | -$28,500 | MEDIUM |

---

## Slide 6 — Domain Impact

### Why This Matters

**For Portfolio Managers (Buy-Side):**
- Real-time VaR + CVaR without Bloomberg subscriptions ($24k/year)
- Auto-hedge button: one-click shift to minimum-variance defensive portfolio
- Cross-scenario comparison across all 5 macro regimes simultaneously

**For Risk & Compliance Teams:**
- Unified anomaly surveillance: 3,000 transactions, statistical + NLP scoring
- Live news correlated with operational anomalies → cross-domain risk events

**For Sovereign Risk Analysts:**
- 3D globe with raycasting: hover any country → see sovereign risk score, market, CDS proxy
- Action cockpit: trigger Macro Shocks, deploy CDS/FX hedges, enforce capital quarantines

**vs. Traditional Approach:**
| | Traditional | FINRISK AI |
|---|---|---|
| Stress testing | Manual Excel, single scenario | Real-time, 5 scenarios + custom |
| Risk coverage | Market only | Market + Operational + Sentiment |
| Accessibility | Bloomberg terminal | Local, zero-cost |
| Visualisation | Static charts | 3D Globe + AR Spatial Lens |

---

## Slide 7 — Limitations & Next Steps

### Current Limitations
- NLP engine is lexical (rule-based), not transformer-based — misses sarcasm/irony
- Data is sample/synthetic — not wired to live market feeds
- AR mode is a HUD simulator, not true WebXR headset deployment
- SQLite doesn't scale to enterprise transaction volumes

### Immediate Next Steps (v2)
- [ ] Integrate real-time WebSocket feeds (Polygon.io / Yahoo Finance streaming)
- [ ] Upgrade NLP to FinBERT (HuggingFace) for transformer-grade sentiment
- [ ] Full WebXR deployment for Apple Vision Pro / Meta Quest
- [ ] PostgreSQL + TimescaleDB for time-series transaction storage
- [ ] Bloomberg/Refinitiv API connector plugin

### Longer-Term Vision
FINRISK AI as a **open-source sovereign risk intelligence layer** — accessible to institutions that cannot afford Bloomberg Terminal subscriptions, covering emerging market sovereign debt risk in real time.

---

*Deck prepared for S&P Global & CRISIL Campus Hackathon 2026 jury evaluation.*
*Candidate: Sarth Hemant Joshi | VIT Vellore | joshisarth8yt@gmail.com*
