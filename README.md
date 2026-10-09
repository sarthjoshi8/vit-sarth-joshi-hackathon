# FINRISK AI — Multi-Modal Financial Risk Intelligence Engine
## S&P Global & Crisil Campus Hackathon 2026

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Python](https://img.shields.io/badge/Python-3.11+-brightgreen.svg)
![React](https://img.shields.io/badge/React-18.3-cyan.svg)
![Three.js](https://img.shields.io/badge/Three.js-3D%20Globe-orange.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688.svg)
![Tests](https://img.shields.io/badge/Tests-8%2F8%20Passed-success.svg)

---

**Candidate Name:** Sarth Hemant Joshi  
**College Email ID:** joshisarth8yt@gmail.com  
**College / Campus:** VIT Vellore  
**Demo Video Link:** *(YouTube unlisted — to be added)*  
**Slide Deck Link:** [docs/presentation_deck.md](./docs/presentation_deck.md)

---

## 1. Project Overview / Problem Statement & Approach

### Problem Statement
Financial risk intelligence today is **fragmented across silos**: market risk lives in Bloomberg terminals, operational risk in transaction databases, and sentiment risk across Twitter, Reuters, and financial news wires. Existing stress-testing tools are static, batch-driven, and fail to capture real-time cross-domain risk correlations. Decision-makers are forced to navigate 50-tab spreadsheets instead of actionable, unified dashboards.

### Solution Approach
**FINRISK AI** is a full-stack, AI/NLP-powered financial risk intelligence platform that unifies four risk dimensions — market, operational, credit, and sentiment — into a single real-time dashboard. The system:

1. **Ingests** multi-source financial data (banking transactions, CNBC/Reuters/Guardian headlines, Twitter equity sentiment, Financial PhraseBank annotations) into a normalised SQLite store.
2. **Scores** every data point through a composite risk pipeline: statistical Z-score anomaly detection, customer velocity analysis, and a finance-tuned lexical NLP sentiment engine.
3. **Simulates** macro shocks via Module B — a Monte Carlo VaR/CVaR engine running 10,000 simulation paths across 5 predefined crisis regimes.
4. **Visualises** sovereign risk geospatially on an interactive Three.js 3D Globe with country-level recognition and action triggers, plus a WebXR-style AR Spatial Risk Lens.

The result is a **Palantir/Bloomberg-style risk terminal** runnable entirely locally — no cloud lock-in, no proprietary data.

---

## 2. Architecture & Tech Stack

```
                ┌─────────────────────────────────────┐
                │         DATA INGESTION LAYER         │
                │  transactions.csv  │  headlines.csv  │
                │  phrasebank.csv    │  tweets.csv      │
                └──────────────┬──────────────────────┘
                               │ loader.py (on startup)
                               ▼
                ┌─────────────────────────────────────┐
                │          SQLite DATABASE             │
                │  Transaction | Headline | Tweet      │
                │  PhraseBank  | RiskEvent             │
                └──────────────┬──────────────────────┘
                               │
               ┌───────────────┼───────────────┐
               ▼               ▼               ▼
        risk_engine.py    sentiment.py    stress_test.py
        (Z-score +        (Finance NLP    (Monte Carlo
         velocity)         Lexicon)        VaR/CVaR)
               │               │               │
               └───────────────┼───────────────┘
                               ▼
                ┌─────────────────────────────────────┐
                │         FastAPI REST API             │
                │  /api/dashboard/summary              │
                │  /api/risk-events                    │
                │  /api/stress-test/run                │
                │  /api/stress-test/compare            │
                └──────────────┬──────────────────────┘
                               │ HTTP (proxied by Vite)
                               ▼
                ┌─────────────────────────────────────┐
                │         REACT FRONTEND (Vite)        │
                │  Dashboard.jsx  │  StressTesting.jsx │
                │  Globe3D.jsx    │  ARLensModal.jsx   │
                │  LiveAnalyzer   │  NLPFeed.jsx       │
                └─────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Backend Framework** | FastAPI (Python 3.11) | Async REST API, auto Swagger docs, Pydantic validation |
| **Database** | SQLAlchemy + SQLite | Zero-config local DB, ORM-first schema management |
| **NLP Engine** | Custom Lexical Sentiment (finance-tuned) | No heavy torch downloads; finance-specific 400-word lexicon with negators & intensifiers |
| **Monte Carlo Engine** | Pure Python `random.gauss` (10k paths) | No external dependency; geometric Brownian motion over 21-day horizon |
| **3D Visualization** | Three.js (WebGL) | GPU-accelerated 3D globe; raycasting for country detection |
| **Frontend Framework** | React 18 + Vite | Fast HMR, component-based, proxies API calls |
| **Charts** | Recharts | Declarative React charting for sentiment donut and risk bars |
| **Styling** | Vanilla CSS (Glassmorphism) | Three custom themes: Obsidian Terminal, Cyberpunk Neon, S&P Light |
| **Testing** | Pytest + pytest-asyncio | 8 endpoint tests, 100% pass rate |

---

## 3. Dataset Used

All datasets are **publicly available or synthetically generated** — no proprietary or client data is used.

| Dataset | Source | Size | Nature |
|---|---|---|---|
| `transactions_sample.csv` | Synthetic (generated) | 3,000 rows | Banking transaction ledger — customer ID, amount, type, description |
| `phrasebank_sample.csv` | Financial PhraseBank (Malo et al., 2014) — Public | ~1,000 rows | Annotated financial sentences with sentiment labels |
| `cnbc_headlines_sample.csv` | Publicly scraped CNBC financial headlines | ~2,000 rows | News headline + timestamp |
| `guardian_headlines_sample.csv` | The Guardian public RSS/API | ~1,500 rows | Financial section headlines |
| `reuters_headlines_sample.csv` | Reuters public financial feeds | ~2,300 rows | Market/business headlines |
| `tweets_sample.csv` | Kaggle: Stock Market Tweet Sentiment (public) | ~1,200 rows | Tweets with LSTM polarity, 1/7-day returns, 30d volatility |

**Assumptions:**
- Transaction amounts and customer IDs are fully synthetic — no real customer data.
- Headlines are used solely for NLP sentiment classification research purposes.
- All data fits within the `data/samples/` folder under 2MB total.

---

## 4. Quickstart & Installation

**Runtime:** Python 3.11+ / Node 20+ on macOS / Linux

### Option 1: One-Click Launch (Recommended)
```bash
git clone <your-repo-url>
cd vit-sarth-joshi-hackathon

chmod +x run.sh
./run.sh
```

Open → **http://localhost:5173** (Frontend) | **http://127.0.0.1:8000/docs** (API Swagger)

---

### Option 2: Manual Setup

#### Backend
```bash
# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start backend (auto-ingests data on first run)
PYTHONPATH=. uvicorn src.backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

#### Frontend
```bash
cd frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

#### Run Tests
```bash
source .venv/bin/activate
PYTHONPATH=. pytest tests/ -v
```

**Expected output:**
```
tests/test_api.py::test_health                   PASSED  [ 12%]
tests/test_api.py::test_api_info                 PASSED  [ 25%]
tests/test_api.py::test_dashboard_summary        PASSED  [ 37%]
tests/test_api.py::test_transactions_endpoint    PASSED  [ 50%]
tests/test_api.py::test_headlines_endpoint       PASSED  [ 62%]
tests/test_api.py::test_stress_test_scenarios    PASSED  [ 75%]
tests/test_api.py::test_stress_test_execution    PASSED  [ 87%]
tests/test_api.py::test_stress_test_comparison   PASSED  [100%]
======================== 8 passed in 0.52s ========================
```

---

## 5. Key Results & Domain Impact

### Quantitative Outputs

| Metric | Value |
|---|---|
| Transactions screened | **3,000** (Z-score + velocity + NLP) |
| Anomalies detected | **91** (3.0% anomaly rate) |
| News headlines classified | **5,811** (CNBC + Guardian + Reuters) |
| Active risk events generated | **105** (multi-source correlated) |
| Monte Carlo paths per simulation | **10,000** paths over 21 trading days |
| Stress scenarios available | **5** macro regimes + custom shock slider |
| API response time | **< 50ms** average |
| Frontend render | **60 FPS** WebGL 3D Globe |
| Test coverage | **8/8 tests passing (100%)** |

### Domain Impact

**For Portfolio Managers:**
- Instantly quantify capital drawdown under 5 macro crisis regimes without Bloomberg access.
- Auto-hedge button shifts portfolio to minimum-variance defensive assets in one click.
- 95% VaR and CVaR (Expected Shortfall) computed in real-time.

**For Risk/Compliance Teams:**
- Unified anomaly surveillance across 3,000 transactions — flags high-risk customers by velocity and amount Z-score.
- NLP-tagged risk events from live news feeds correlated with transaction anomalies.

**For Executives:**
- 3D globe shows sovereign risk exposure by country with hover-recognition and action triggers.
- AR Spatial Lens overlays holographic risk diagnostics — intuitive for non-technical stakeholders.

**vs. Naïve Approach:**
- Traditional static spreadsheet stress test: manual, single-scenario, no NLP correlation.
- FINRISK AI: real-time, multi-scenario, cross-domain NLP+statistical+3D — all in a single local platform.

---

## 📁 Repository Structure

```
vit-sarth-joshi-hackathon/
├── README.md                        ← This file
├── LICENSE                          ← MIT License
├── requirements.txt                 ← Python dependencies
├── run.sh                           ← One-click startup script
├── data/
│   └── samples/                     ← All 6 CSV datasets (<2MB total)
├── docs/
│   ├── presentation_deck.md         ← 7-slide pitch deck content
│   ├── architecture.md              ← Detailed system design
│   └── data_profile.md              ← Dataset schema & profiling
├── src/backend/app/
│   ├── main.py                      ← FastAPI entry point
│   ├── ingestion/loader.py          ← CSV → SQLite ingestion
│   ├── services/
│   │   ├── risk_engine.py           ← Anomaly scoring pipeline
│   │   ├── sentiment.py             ← Finance NLP engine
│   │   └── stress_test.py           ← Monte Carlo VaR/CVaR
│   ├── routers/                     ← API route handlers
│   └── models/                      ← SQLAlchemy ORM models
├── frontend/src/components/
│   ├── Dashboard.jsx                ← Executive overview
│   ├── StressTesting.jsx            ← Module B stress engine
│   ├── Globe3D.jsx                  ← Three.js 3D Risk Globe
│   ├── ARLensModal.jsx              ← AR holographic HUD
│   ├── LiveAnalyzer.jsx             ← Real-time NLP analyzer
│   └── NLPFeed.jsx                  ← Sentiment feed
└── tests/test_api.py                ← Pytest suite (8/8 pass)
```

---

## ✅ Submission Compliance Checklist

- [x] Repository is **Public**
- [x] MIT License included
- [x] All datasets are **synthetic or publicly available** (no proprietary data)
- [x] Setup + run commands clearly documented in Quickstart
- [x] Module B (Strategic Stress Testing) fully implemented
- [x] Architecture diagram included in `docs/`
- [x] Presentation deck included in `docs/`
- [x] 100% test pass rate documented
- [x] No cloud dependencies — fully local execution
- [ ] Demo video link *(to be added)*

---

*Submission for S&P Global & CRISIL Campus Hackathon 2026 — Individual submission by Sarth Hemant Joshi, VIT Vellore.*
