# ⚡ FINRISK AI: Multi-Modal Financial Risk Intelligence Engine
### S&P Global & CRISIL Campus Hackathon 2026 Submission

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Python](https://img.shields.io/badge/Python-3.11+-brightgreen.svg)
![React](https://img.shields.io/badge/React-18.3-cyan.svg)
![Three.js](https://img.shields.io/badge/Three.js-3D%20Globe-orange.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-1.0.0-009688.svg)
![Tests](https://img.shields.io/badge/Tests-8%2F8%20Passed-success.svg)

---

## 🌟 Executive Overview
**FINRISK AI** is an advanced AI/NLP Financial Risk Intelligence platform engineered for the **S&P Global & CRISIL Campus Hackathon 2026**. It unifies fragmented financial intelligence across banking transaction logs, global news wire headlines, Twitter sentiment, and annotated financial phrases into an autonomous decision engine featuring **Module B (Strategic Portfolio Stress Testing)** and a **3D + AR Spatial User Experience**.

---

## 🚀 Key Modules & Capabilities

### 1. ⚡ Module B: Strategic Portfolio Stress Testing (Core Requirement)
* **Predefined Macro Stress Regimes:**
  * 📉 *Global Recession* (-25% equity shock, credit spread widening)
  * 🔥 *Inflation Spike* (-15% shock, aggressive rate hikes)
  * ⚡ *Black Swan Market Crash* (-40% liquidity freeze)
  * ⚔️ *Geopolitical Crisis* (-20% sanctions & embargo shock)
  * 🧬 *Pandemic Shock* (-30% cross-border supply chain freeze)
* **Dynamic Portfolio Allocation Builder:** Custom ticker weights, preset portfolios (*Tech Growth*, *Defensive*, *Balanced*).
* **Monte Carlo Tail-Risk Engine:** 10,000 geometric Brownian motion simulation paths over a 21-day horizon computing **95% Value-at-Risk (VaR)** and **Conditional VaR (CVaR / Expected Shortfall)**.
* **Continuous Shock Override:** Interactive slider (-5% to -60%) for custom sensitivity testing.
* **Cross-Scenario Capital Loss Matrix:** Side-by-side comparative resilience evaluation across all macro regimes.

### 2. 🌐 3D Geospatial Financial Risk Corridor (Three.js)
* High-performance WebGL 3D Globe mapping global financial hubs (NYSE, LSE, DAX, NSE/BSE, HKEX, TSE, ASX).
* **3D Risk Towers:** Outward radial spikes with height and emissive coloring mapped to local sovereign and equity risk.
* Interactive raycasting: click any node to view real-time market telemetry and projected VaR impact.
* Connecting inter-exchange financial corridors and background cosmic starfield.

### 3. 👓 Augmented Reality (AR) Spatial Risk Lens
* Holographic HUD simulator displaying asset-specific diagnostic telemetry.
* Real-time spatial targeting reticle with ticker selection (`AAPL`, `MSFT`, `JPM`, `NVDA`, `TSLA`).
* Displays live NLP sentiment, shock resilience, VaR 95%, and automated hedge recommendations.

### 4. 💳 Multi-Dimensional Transaction Anomaly Surveillance
* Real-time scoring combining:
  1. Statistical **Amount Z-Score** ($Z = \frac{|x - \mu|}{\sigma}$)
  2. **Customer Velocity Spike Factor**
  3. **NLP Description Narrative Sentiment**
* Flags high-risk operational anomalies with clear audit badges.

### 5. 📰 Unified NLP Sentiment & Headline Intelligence Feed
* Multi-source sentiment classification tuned on **Financial PhraseBank** lexicons.
* Live filterable feed of Reuters, CNBC, Guardian headlines and equity-linked Twitter feeds.

---

## 🏗️ Architecture

```
vit-sarth-joshi-hackathon/
├── data/
│   ├── samples/                     # Compressed sample datasets (<2MB total)
│   │   ├── transactions_sample.csv
│   │   ├── phrasebank_sample.csv
│   │   ├── cnbc_headlines_sample.csv
│   │   ├── guardian_headlines_sample.csv
│   │   ├── reuters_headlines_sample.csv
│   │   └── tweets_sample.csv
│   └── finrisk.sqlite3              # Local SQLite database
├── docs/
│   ├── data_profile.md              # Dataset profiling & schema documentation
│   ├── architecture.md              # System design & mathematical formulation
│   └── presentation_deck.md         # Hackathon pitch slide outline
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx        # Executive overview & Recharts analytics
│   │   │   ├── StressTesting.jsx    # Module B Strategic Portfolio Stress Testing
│   │   │   ├── Globe3D.jsx          # Three.js 3D Risk Globe with outward spikes
│   │   │   ├── ARLensModal.jsx      # WebXR Holographic AR HUD modal
│   │   │   ├── TransactionsView.jsx # Anomaly detection & surveillance table
│   │   │   └── NLPFeed.jsx          # Multi-source NLP intelligence feed
│   │   ├── App.jsx                  # Master shell & navigation
│   │   ├── index.css                # Dark Glassmorphism Design System
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── src/backend/app/
│   ├── ingestion/loader.py          # Data ingestion & normalization
│   ├── models/                      # SQLAlchemy ORM & Pydantic schemas
│   ├── services/
│   │   ├── risk_engine.py           # Anomaly scoring & risk event generator
│   │   ├── sentiment.py             # Financial NLP sentiment analyzer
│   │   └── stress_test.py           # Module B Monte Carlo VaR/CVaR engine
│   ├── routers/                     # FastAPI endpoint routers
│   ├── database.py                  # SQLite engine setup
│   └── main.py                      # FastAPI application entry point
├── tests/
│   └── test_api.py                  # Pytest test suite (100% pass)
├── scripts/
│   └── make_samples.py              # Data sampling script
├── requirements.txt                 # Python dependencies
├── run.sh                           # One-click execution script
└── README.md
```

---

## ⚡ Quickstart Guide

### Option 1: One-Click Launch (Recommended)
```bash
# Make executable and run
chmod +x run.sh
./run.sh
```
This automatically starts:
* **FastAPI Backend:** [http://127.0.0.1:8000](http://127.0.0.1:8000) (Interactive Swagger Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs))
* **React 3D Frontend:** [http://localhost:5173](http://localhost:5173)

---

### Option 2: Manual Step-by-Step Setup

#### 1. Backend Setup
```bash
# Create & activate Python virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
PYTHONPATH=. uvicorn src.backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

---

## 🧪 Running Automated Tests
Run the comprehensive test suite to verify all endpoints, database queries, and Module B stress test algorithms:
```bash
source .venv/bin/activate
PYTHONPATH=. pytest tests/ -v
```
**Test Results:**
```
tests/test_api.py::test_health PASSED                      [ 12%]
tests/test_api.py::test_api_info PASSED                    [ 25%]
tests/test_api.py::test_dashboard_summary PASSED           [ 37%]
tests/test_api.py::test_transactions_endpoint PASSED       [ 50%]
tests/test_api.py::test_headlines_endpoint PASSED          [ 62%]
tests/test_api.py::test_stress_test_scenarios PASSED       [ 75%]
tests/test_api.py::test_stress_test_execution PASSED       [ 87%]
tests/test_api.py::test_stress_test_comparison PASSED      [100%]
======================== 8 passed in 0.52s =========================
```

---

## 📋 Hackathon Compliance Checklist
* [x] **Raw Datasets Outside Main Repo:** Large raw data files reside outside repo (`~/Desktop/dataset_11`), while sample files reside under `data/samples/` (<2MB).
* [x] **Repository Size Limit:** Total repo size is well under the 50MB ceiling.
* [x] **Module B Complete:** Strategic Portfolio Stress Testing with Monte Carlo VaR, CVaR, predefined macro crises, and custom shock sliders.
* [x] **3D + AR User Experience:** Three.js 3D Risk Globe with outward spikes + WebXR-style Holographic AR Lens HUD.
* [x] **No Cloud Lock-in:** 100% locally self-contained on macOS / Linux.
* [x] **Documentation & Presentation:** Full data profile, architecture diagram, and slide deck outline included under `docs/`.

---

## 👥 Authors
* **Sarth Joshi & Team** — VIT Pune
* Submission for **S&P Global & CRISIL Campus Hackathon 2026**
