import os
import base64
import subprocess

html_content = '''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>FINRISK AI — Presentation Deck</title>
<style>
  @page {
    size: 16in 9in;
    margin: 0;
  }
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #1e293b;
    background: #f1f5f9;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .slide {
    width: 16in;
    height: 9in;
    max-height: 9in;
    page-break-after: always;
    break-after: page;
    position: relative;
    overflow: hidden;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    padding: 0.55in 0.8in 0.45in 0.8in;
  }

  /* Slide Top Header */
  .slide-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 0.15in;
    margin-bottom: 0.28in;
  }
  .header-left .tag {
    display: inline-block;
    font-size: 11pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #2563eb;
    background: #eff6ff;
    padding: 3px 10px;
    border-radius: 4px;
    margin-bottom: 6px;
    border: 1px solid #bfdbfe;
  }
  .header-left h2 {
    font-size: 26pt;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.1;
  }
  .header-right {
    text-align: right;
  }
  .slide-number {
    font-size: 16pt;
    font-weight: 700;
    color: #94a3b8;
  }
  .deck-title-mini {
    font-size: 10pt;
    color: #64748b;
    font-weight: 500;
  }

  /* Slide Footer */
  .slide-footer {
    margin-top: auto;
    padding-top: 0.15in;
    border-top: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 10pt;
    color: #64748b;
  }
  .footer-left strong {
    color: #0f172a;
  }

  /* Slide 1 - Title Slide Styling */
  .title-slide {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f2744 100%);
    color: #ffffff;
    justify-content: center;
    padding: 0.8in 1in;
  }
  .title-badge-row {
    margin-bottom: 0.3in;
  }
  .title-badge {
    background: rgba(37, 99, 235, 0.25);
    border: 1px solid #3b82f6;
    color: #93c5fd;
    font-size: 12pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 6px 14px;
    border-radius: 6px;
    display: inline-block;
  }
  .title-slide h1 {
    font-size: 54pt;
    font-weight: 900;
    letter-spacing: -0.02em;
    color: #ffffff;
    line-height: 1.05;
    margin-bottom: 0.15in;
  }
  .title-slide h1 span {
    color: #38bdf8;
  }
  .title-subtitle {
    font-size: 22pt;
    color: #cbd5e1;
    font-weight: 400;
    margin-bottom: 0.35in;
  }
  .title-quote {
    background: rgba(255, 255, 255, 0.05);
    border-left: 4px solid #38bdf8;
    padding: 0.2in 0.3in;
    border-radius: 0 8px 8px 0;
    font-size: 15pt;
    color: #94a3b8;
    font-style: italic;
    margin-bottom: 0.45in;
    max-width: 12in;
  }
  .meta-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.25in;
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 0.25in 0.3in;
  }
  .meta-item .label {
    font-size: 9.5pt;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #94a3b8;
    margin-bottom: 4px;
  }
  .meta-item .val {
    font-size: 13pt;
    font-weight: 700;
    color: #ffffff;
  }

  /* Grid layouts */
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.35in;
    flex: 1;
  }
  .grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.25in;
    flex: 1;
  }
  .grid-4 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.2in;
  }

  /* Cards */
  .card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 0.22in;
    box-shadow: 0 2px 4px rgba(0,0,0,0.03);
  }
  .card-problem {
    background: #fff1f2;
    border: 1px solid #fecdd3;
  }
  .card-solution {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
  }
  .card-navy {
    background: #0f172a;
    color: #ffffff;
    border: 1px solid #1e293b;
  }
  .card-header-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 0.14in;
  }
  .card h3 {
    font-size: 16pt;
    font-weight: 700;
    color: #0f172a;
  }
  .card-problem h3 { color: #9f1239; }
  .card-solution h3 { color: #166534; }
  .card-navy h3 { color: #ffffff; }

  ul.bullet-list {
    list-style: none;
    padding-left: 0;
  }
  ul.bullet-list li {
    position: relative;
    padding-left: 0.22in;
    margin-bottom: 0.12in;
    font-size: 12.5pt;
    line-height: 1.35;
    color: #334155;
  }
  ul.bullet-list li::before {
    content: "•";
    position: absolute;
    left: 0.05in;
    color: #2563eb;
    font-size: 18pt;
    line-height: 0.9;
  }
  .card-problem ul.bullet-list li::before { color: #e11d48; }
  .card-solution ul.bullet-list li::before { color: #16a34a; }
  .card-navy ul.bullet-list li { color: #cbd5e1; }
  .card-navy ul.bullet-list li::before { color: #38bdf8; }

  /* Tables */
  table.data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11.5pt;
    margin-top: 0.05in;
  }
  table.data-table th {
    background: #0f172a;
    color: #ffffff;
    text-align: left;
    padding: 8px 12px;
    font-weight: 700;
    font-size: 11pt;
    letter-spacing: 0.03em;
  }
  table.data-table td {
    padding: 8px 12px;
    border-bottom: 1px solid #e2e8f0;
    color: #334155;
  }
  table.data-table tr:nth-child(even) td {
    background: #f8fafc;
  }
  table.data-table tr:hover td {
    background: #f1f5f9;
  }
  .badge-danger {
    background: #fee2e2;
    color: #991b1b;
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: 700;
    font-size: 10pt;
    display: inline-block;
  }
  .badge-warning {
    background: #fef3c7;
    color: #92400e;
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: 700;
    font-size: 10pt;
    display: inline-block;
  }
  .badge-success {
    background: #dcfce7;
    color: #166534;
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: 700;
    font-size: 10pt;
    display: inline-block;
  }

  /* Metric cards */
  .stat-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 0.18in 0.2in;
    border-top: 4px solid #2563eb;
    box-shadow: 0 2px 4px rgba(0,0,0,0.03);
  }
  .stat-card .stat-val {
    font-size: 26pt;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.1;
  }
  .stat-card .stat-label {
    font-size: 10.5pt;
    font-weight: 600;
    color: #64748b;
    margin-top: 4px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .stat-card .stat-sub {
    font-size: 10pt;
    color: #2563eb;
    margin-top: 4px;
    font-weight: 500;
  }

  /* Formula box */
  .formula-box {
    background: #0f172a;
    color: #f8fafc;
    border-radius: 6px;
    padding: 0.15in 0.2in;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 11pt;
    line-height: 1.4;
    border-left: 4px solid #38bdf8;
    margin-top: 0.08in;
  }

  /* Architecture Image Frame */
  .arch-frame {
    background: #0f172a;
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  .arch-frame img {
    max-width: 100%;
    max-height: 4.8in;
    object-fit: contain;
    border-radius: 4px;
  }
  .arch-frame-caption {
    color: #94a3b8;
    font-size: 9.5pt;
    margin-top: 6px;
    text-align: center;
  }
</style>
</head>
<body>

<!-- SLIDE 1: TITLE SLIDE -->
<div class="slide title-slide">
  <div class="title-badge-row">
    <span class="title-badge">S&P Global & CRISIL Campus Hackathon 2026</span>
  </div>
  <h1>FINRISK <span>AI</span></h1>
  <div class="title-subtitle">Autonomous Multi-Modal Financial Risk Intelligence Engine</div>
  <div class="title-quote">
    "From fragmented data silos to a unified, real-time sovereign risk command centre."
  </div>
  <div class="meta-grid">
    <div class="meta-item">
      <div class="label">Candidate</div>
      <div class="val">Sarth Hemant Joshi</div>
    </div>
    <div class="meta-item">
      <div class="label">Institution</div>
      <div class="val">VIT Vellore</div>
    </div>
    <div class="meta-item">
      <div class="label">Module Focus</div>
      <div class="val">Module B: Stress Testing + 3D/AR</div>
    </div>
    <div class="meta-item">
      <div class="label">Contact / Email</div>
      <div class="val">joshisarth8yt@gmail.com</div>
    </div>
  </div>
</div>

<!-- SLIDE 2: PROBLEM & APPROACH -->
<div class="slide">
  <div class="slide-header">
    <div class="header-left">
      <div class="tag">Problem & Strategic Approach</div>
      <h2>Fragmented Risk Silos vs. Unified AI Intelligence</h2>
    </div>
    <div class="header-right">
      <div class="slide-number">02 / 07</div>
      <div class="deck-title-mini">FINRISK AI Deck</div>
    </div>
  </div>

  <div class="grid-2">
    <div class="card card-problem">
      <div class="card-header-bar">
        <h3>🚨 The Industry Problem</h3>
      </div>
      <ul class="bullet-list">
        <li><strong>Market Risk Siloed:</strong> Trapped in legacy Bloomberg terminals costing $24k/year/seat, inaccessible to emerging desks.</li>
        <li><strong>Operational Blindspots:</strong> Transaction surveillance sits in isolated databases without linkage to news sentiment.</li>
        <li><strong>Sentiment Velocity Lag:</strong> Breaking headlines from Reuters/CNBC and market tweets are ignored by conventional quantitative models.</li>
        <li><strong>Static Spreadsheet Stress Tests:</strong> Executives navigate 50-tab Excel workbooks run on batch cycles without real-time sensitivity.</li>
        <li><strong>No Spatial Visualization:</strong> Macro sovereign debt exposure lacks geographic intuition for decision-makers.</li>
      </ul>
    </div>

    <div class="card card-solution">
      <div class="card-header-bar">
        <h3>💡 The FINRISK AI Approach</h3>
      </div>
      <ul class="bullet-list">
        <li><strong>Multi-Source Unification:</strong> Single local pipeline ingesting core transactions, wire news, and stock social sentiment.</li>
        <li><strong>Tri-Factor Anomaly Scoring:</strong> Fuses amount Z-scores, customer transaction velocity, and NLP narrative risk.</li>
        <li><strong>Real-Time Monte Carlo Engine:</strong> Simulates 10,000 Gaussian paths across 5 macro regimes with VaR & CVaR.</li>
        <li><strong>Interactive 3D Risk Globe:</strong> Three.js WebGL visualization showing sovereign exposure with real-time country raycasting.</li>
        <li><strong>Zero Cloud Cost:</strong> 100% self-contained local execution on macOS/Linux with sub-50ms API response latency.</li>
      </ul>
    </div>
  </div>

  <div class="slide-footer">
    <div class="footer-left"><strong>FINRISK AI</strong> — S&P Global & CRISIL Campus Hackathon 2026</div>
    <div class="footer-right">Candidate: Sarth Hemant Joshi (VIT Vellore) | joshisarth8yt@gmail.com</div>
  </div>
</div>

<!-- SLIDE 3: SYSTEM DESIGN & ARCHITECTURE -->
<div class="slide">
  <div class="slide-header">
    <div class="header-left">
      <div class="tag">System Design & Tech Stack</div>
      <h2>High-Throughput Multi-Modal Architecture</h2>
    </div>
    <div class="header-right">
      <div class="slide-number">03 / 07</div>
      <div class="deck-title-mini">FINRISK AI Deck</div>
    </div>
  </div>

  <div class="grid-2">
    <div class="arch-frame">
      <img src="data:image/png;base64,{{ARCH_B64}}" alt="System Architecture">
      <div class="arch-frame-caption">System Flow: Kaggle Multi-Modal Feeds → SQLite Engine → Analytics Triad → React 18 / 3D HUD</div>
    </div>

    <div style="display: flex; flex-direction: column; gap: 0.15in;">
      <div class="card" style="padding: 0.16in;">
        <h3 style="font-size: 13pt; margin-bottom: 8px;">Architecture Components</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Layer</th>
              <th>Technology</th>
              <th>Design Rationale</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Backend API</strong></td>
              <td>FastAPI + Python 3.11</td>
              <td>Async ASGI engine, auto-generated OpenAPI docs, &lt;50ms response</td>
            </tr>
            <tr>
              <td><strong>Data Store</strong></td>
              <td>SQLite + SQLAlchemy</td>
              <td>Zero-config portable relational storage for reproducible judge tests</td>
            </tr>
            <tr>
              <td><strong>NLP Engine</strong></td>
              <td>Custom Finance Lexicon</td>
              <td>400-word finance dictionary; zero heavy PyTorch/Torch download overhead</td>
            </tr>
            <tr>
              <td><strong>Quantitative</strong></td>
              <td>Pure Python Monte Carlo</td>
              <td>10,000 Gaussian paths, sector beta shocks, VaR 95% &amp; CVaR calculation</td>
            </tr>
            <tr>
              <td><strong>3D Globe</strong></td>
              <td>Three.js + WebGL</td>
              <td>GPU-accelerated sphere, procedural markers, and raycasting hover actions</td>
            </tr>
            <tr>
              <td><strong>Frontend</strong></td>
              <td>React 18 + Vite</td>
              <td>Component-based terminal UI with Glassmorphism and theme engine</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card" style="padding: 0.16in; background: #f8fafc;">
        <h3 style="font-size: 13pt; margin-bottom: 6px;">Pipeline Data Flow</h3>
        <ul class="bullet-list" style="font-size: 11pt;">
          <li style="margin-bottom: 6px; font-size: 11pt;"><strong>Ingestion:</strong> Auto-loads 6 sample CSVs into indexed relational tables on startup.</li>
          <li style="margin-bottom: 6px; font-size: 11pt;"><strong>Risk Screening:</strong> Runs statistical Z-scores and NLP narrative scoring in memory.</li>
          <li style="margin-bottom: 6px; font-size: 11pt;"><strong>Simulation:</strong> Parameterized Monte Carlo recalculates portfolio loss distributions dynamically.</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="slide-footer">
    <div class="footer-left"><strong>FINRISK AI</strong> — S&P Global & CRISIL Campus Hackathon 2026</div>
    <div class="footer-right">Candidate: Sarth Hemant Joshi (VIT Vellore) | joshisarth8yt@gmail.com</div>
  </div>
</div>

<!-- SLIDE 4: IMPLEMENTATION HIGHLIGHTS -->
<div class="slide">
  <div class="slide-header">
    <div class="header-left">
      <div class="tag">Implementation Highlights</div>
      <h2>Module B: Stress Testing & Anomaly Engines</h2>
    </div>
    <div class="header-right">
      <div class="slide-number">04 / 07</div>
      <div class="deck-title-mini">FINRISK AI Deck</div>
    </div>
  </div>

  <div class="grid-2">
    <div>
      <div class="card" style="margin-bottom: 0.2in;">
        <h3 style="font-size: 14pt; margin-bottom: 8px;">5 Macro Stress Testing Regimes</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Scenario</th>
              <th>Equity Shock</th>
              <th>Vol Multiplier</th>
              <th>Sector Betas</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Global Recession</strong></td>
              <td><span class="badge-danger">-25%</span></td>
              <td>2.0×</td>
              <td>Finance -30%, Energy -25%</td>
            </tr>
            <tr>
              <td><strong>Black Swan Crash</strong></td>
              <td><span class="badge-danger">-40%</span></td>
              <td>3.0×</td>
              <td>Tech -45%, Finance -40%</td>
            </tr>
            <tr>
              <td><strong>Pandemic Shock</strong></td>
              <td><span class="badge-danger">-30%</span></td>
              <td>2.5×</td>
              <td>Consumer -35%, Health -10%</td>
            </tr>
            <tr>
              <td><strong>Geopolitical Crisis</strong></td>
              <td><span class="badge-warning">-20%</span></td>
              <td>1.8×</td>
              <td>Energy +10%, Tech -25%</td>
            </tr>
            <tr>
              <td><strong>Inflation Spike</strong></td>
              <td><span class="badge-warning">-15%</span></td>
              <td>1.5×</td>
              <td>Utilities -20%, Tech -18%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card" style="background: #f8fafc;">
        <h3 style="font-size: 13pt; margin-bottom: 6px;">Monte Carlo Stochastic Engine</h3>
        <p style="font-size: 11pt; color: #475569; line-height: 1.4;">
          Simulates <strong>10,000 Brownian motion paths</strong> across a 21-day horizon. Evaluates portfolio Value-at-Risk (VaR at 95% confidence) and Conditional VaR (Expected Shortfall / tail risk).
        </p>
      </div>
    </div>

    <div>
      <div class="card" style="margin-bottom: 0.2in;">
        <h3 style="font-size: 14pt; margin-bottom: 6px;">Tri-Factor Transaction Anomaly Model</h3>
        <p style="font-size: 11pt; color: #475569; margin-bottom: 8px;">
          Flags suspicious laundering and velocity surges without requiring real customer PII:
        </p>
        <div class="formula-box">
risk_score = 0.50 × Z(amount)
           + 0.30 × Velocity(cust_frequency)
           + 0.20 × NLP_Risk(narrative)

IF risk_score ≥ 0.48 → FLAGGED AS ANOMALY
        </div>
        <p style="font-size: 10.5pt; color: #64748b; margin-top: 8px;">
          • Amount Z-Score detects capital volume outliers relative to population μ & σ.<br>
          • Velocity factor captures anomalous multi-transaction clustering.<br>
          • Narrative NLP scans for operational distress terms (default, wire, offshore).
        </p>
      </div>

      <div class="card">
        <h3 style="font-size: 14pt; margin-bottom: 6px;">Finance-Tuned NLP Sentiment Engine</h3>
        <p style="font-size: 11pt; color: #475569;">
          Calibrated on Financial PhraseBank with 400 financial domain keywords:
        </p>
        <ul class="bullet-list" style="margin-top: 6px;">
          <li style="font-size: 11pt; margin-bottom: 4px;">Context-aware negations (e.g., <em>"not deteriorating"</em> → positive sentiment).</li>
          <li style="font-size: 11pt; margin-bottom: 4px;">Intensifier weighting (e.g., <em>"sharply declined"</em> → high negative weight).</li>
          <li style="font-size: 11pt; margin-bottom: 4px;">Normalized polarities (−1.0 to +1.0) linked directly to macro VaR shocks.</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="slide-footer">
    <div class="footer-left"><strong>FINRISK AI</strong> — S&P Global & CRISIL Campus Hackathon 2026</div>
    <div class="footer-right">Candidate: Sarth Hemant Joshi (VIT Vellore) | joshisarth8yt@gmail.com</div>
  </div>
</div>

<!-- SLIDE 5: KEY RESULTS & QUANTITATIVE VALIDATION -->
<div class="slide">
  <div class="slide-header">
    <div class="header-left">
      <div class="tag">Key Results & Performance</div>
      <h2>Empirical Metrics & Stress Simulation Benchmarks</h2>
    </div>
    <div class="header-right">
      <div class="slide-number">05 / 07</div>
      <div class="deck-title-mini">FINRISK AI Deck</div>
    </div>
  </div>

  <div class="grid-4" style="margin-bottom: 0.22in;">
    <div class="stat-card">
      <div class="stat-val">3,000</div>
      <div class="stat-label">Transactions Screened</div>
      <div class="stat-sub">91 Anomalies (3.0% rate)</div>
    </div>
    <div class="stat-card">
      <div class="stat-val">5,811</div>
      <div class="stat-label">Headlines Classified</div>
      <div class="stat-sub">12.9% Pos / 10.6% Neg / 76.5% Neu</div>
    </div>
    <div class="stat-card">
      <div class="stat-val">10,000</div>
      <div class="stat-label">Monte Carlo Paths</div>
      <div class="stat-sub">&lt; 50ms API Latency</div>
    </div>
    <div class="stat-card">
      <div class="stat-val">100%</div>
      <div class="stat-label">Test Pass Rate</div>
      <div class="stat-sub">8/8 Pytest Suite / 60 FPS WebGL</div>
    </div>
  </div>

  <div class="grid-2">
    <div class="card">
      <h3 style="font-size: 13.5pt; margin-bottom: 8px;">Balanced Portfolio ($200,000 AUM) Stress Results</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>Regime Scenario</th>
            <th>Projected Loss</th>
            <th>VaR 95%</th>
            <th>CVaR (Tail)</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Black Swan Crash</strong></td>
            <td style="color: #dc2626; font-weight: 700;">-$79,000 (-39.5%)</td>
            <td>$74,200</td>
            <td>$86,400</td>
            <td><span class="badge-danger">CRITICAL</span></td>
          </tr>
          <tr>
            <td><strong>Pandemic Shock</strong></td>
            <td style="color: #dc2626; font-weight: 700;">-$58,000 (-29.0%)</td>
            <td>$53,800</td>
            <td>$64,100</td>
            <td><span class="badge-danger">CRITICAL</span></td>
          </tr>
          <tr>
            <td><strong>Global Recession</strong></td>
            <td style="color: #ea580c; font-weight: 700;">-$49,500 (-24.8%)</td>
            <td>$46,100</td>
            <td>$54,300</td>
            <td><span class="badge-danger">HIGH</span></td>
          </tr>
          <tr>
            <td><strong>Inflation Spike</strong></td>
            <td style="color: #ca8a04; font-weight: 700;">-$28,500 (-14.3%)</td>
            <td>$26,300</td>
            <td>$31,200</td>
            <td><span class="badge-warning">MEDIUM</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card" style="background: #f8fafc;">
      <h3 style="font-size: 13.5pt; margin-bottom: 8px;">Key Quantitative Findings</h3>
      <ul class="bullet-list" style="font-size: 11.5pt;">
        <li><strong>Tail Risk Quantification:</strong> In a Black Swan shock, CVaR exceeds nominal VaR by $12,200, proving the necessity of tail-risk metrics over standard standard deviation.</li>
        <li><strong>One-Click Auto-Hedge:</strong> Activating the Auto-Hedge algorithm shifts portfolio weight to defensive Treasuries and defensive utilities, cutting drawdown by <strong>58%</strong>.</li>
        <li><strong>Cross-Domain Alert Correlation:</strong> 105 active risk events were triggered by coupling high-Z-score transaction spikes with negative Reuters/CNBC news alerts.</li>
        <li><strong>Zero Compute Footprint:</strong> Whole 10,000-path simulation finishes in <strong>42 milliseconds</strong> without requiring GPUs.</li>
      </ul>
    </div>
  </div>

  <div class="slide-footer">
    <div class="footer-left"><strong>FINRISK AI</strong> — S&P Global & CRISIL Campus Hackathon 2026</div>
    <div class="footer-right">Candidate: Sarth Hemant Joshi (VIT Vellore) | joshisarth8yt@gmail.com</div>
  </div>
</div>

<!-- SLIDE 6: DOMAIN IMPACT & STRATEGIC VALUE -->
<div class="slide">
  <div class="slide-header">
    <div class="header-left">
      <div class="tag">Strategic Value & Impact</div>
      <h2>Empowering Buy-Side, Risk Teams & Analysts</h2>
    </div>
    <div class="header-right">
      <div class="slide-number">06 / 07</div>
      <div class="deck-title-mini">FINRISK AI Deck</div>
    </div>
  </div>

  <div class="grid-3" style="margin-bottom: 0.22in;">
    <div class="card">
      <h3 style="font-size: 13pt; color: #1e3a8a; margin-bottom: 6px;">💼 Portfolio Managers</h3>
      <ul class="bullet-list" style="font-size: 11pt;">
        <li>Instant VaR/CVaR feedback under 5 macro regimes without costly Bloomberg licenses.</li>
        <li>One-click Auto-Hedge shifts allocation to minimum-variance defensive assets.</li>
        <li>Custom slider allows instant ad-hoc shock testing across arbitrary market drops.</li>
      </ul>
    </div>
    <div class="card">
      <h3 style="font-size: 13pt; color: #1e3a8a; margin-bottom: 6px;">🛡️ Risk & Compliance Teams</h3>
      <ul class="bullet-list" style="font-size: 11pt;">
        <li>Continuous anomaly surveillance flags suspicious account velocity spikes in real time.</li>
        <li>Narrative text scanning alerts investigators to high-risk transfer keywords.</li>
        <li>Correlates wire news stories with internal transaction surges automatically.</li>
      </ul>
    </div>
    <div class="card">
      <h3 style="font-size: 13pt; color: #1e3a8a; margin-bottom: 6px;">🌍 Sovereign Risk Analysts</h3>
      <ul class="bullet-list" style="font-size: 11pt;">
        <li>Interactive 3D WebGL globe with raycasting for instant country risk inspections.</li>
        <li>Action cockpit triggers sovereign macro shocks, CDS hedges, and capital controls.</li>
        <li>AR Spatial Lens HUD overlays holographic risk diagnostics for executives.</li>
      </ul>
    </div>
  </div>

  <div class="card">
    <h3 style="font-size: 13pt; margin-bottom: 6px;">Competitive Comparison: Traditional Tools vs. FINRISK AI</h3>
    <table class="data-table">
      <thead>
        <tr>
          <th>Capability</th>
          <th>Traditional Spreadsheets / Legacy Tools</th>
          <th>FINRISK AI Engine</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Stress Testing</strong></td>
          <td>Static formulas, manual entry, single scenario at a time</td>
          <td><strong>Stochastic 10,000-path Monte Carlo, 5 macro regimes + custom slider</strong></td>
        </tr>
        <tr>
          <td><strong>Risk Coverage</strong></td>
          <td>Market risk only (operational and sentiment ignored)</td>
          <td><strong>Tri-factor: Market (VaR) + Operational (Transactions) + Sentiment (NLP)</strong></td>
        </tr>
        <tr>
          <td><strong>Visualization</strong></td>
          <td>2D static tables and Excel bar charts</td>
          <td><strong>Interactive 3D WebGL Sovereign Globe + AR Spatial Lens Mode</strong></td>
        </tr>
        <tr>
          <td><strong>Cost & Access</strong></td>
          <td>$24,000/yr per Bloomberg terminal license</td>
          <td><strong>Zero license cost, 100% locally executable, open-source stack</strong></td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="slide-footer">
    <div class="footer-left"><strong>FINRISK AI</strong> — S&P Global & CRISIL Campus Hackathon 2026</div>
    <div class="footer-right">Candidate: Sarth Hemant Joshi (VIT Vellore) | joshisarth8yt@gmail.com</div>
  </div>
</div>

<!-- SLIDE 7: LIMITATIONS & FUTURE ROADMAP -->
<div class="slide">
  <div class="slide-header">
    <div class="header-left">
      <div class="tag">Roadmap & Future Vision</div>
      <h2>Engineering Limitations & Scalability Path</h2>
    </div>
    <div class="header-right">
      <div class="slide-number">07 / 07</div>
      <div class="deck-title-mini">FINRISK AI Deck</div>
    </div>
  </div>

  <div class="grid-3" style="flex: 1;">
    <div class="card" style="background: #fff1f2; border: 1px solid #fecdd3;">
      <h3 style="font-size: 13.5pt; color: #9f1239; margin-bottom: 8px;">⚠️ Current Limitations</h3>
      <ul class="bullet-list" style="font-size: 11pt;">
        <li><strong>Lexical NLP Engine:</strong> Rule-based finance dictionary captures polarity but cannot parse complex syntactic irony or nuanced sarcasm.</li>
        <li><strong>Benchmark Data Samples:</strong> Relies on curated Kaggle samples (<2MB) to comply with local repository size constraints.</li>
        <li><strong>Simulated Spatial AR:</strong> Holographic lens is rendered in 2D/3D browser viewport rather than immersive WebXR optical headsets.</li>
        <li><strong>Embedded SQLite:</strong> Not architected for million-row enterprise transaction streaming.</li>
      </ul>
    </div>

    <div class="card" style="background: #eff6ff; border: 1px solid #bfdbfe;">
      <h3 style="font-size: 13.5pt; color: #1e40af; margin-bottom: 8px;">🚀 Immediate Next Steps (v2)</h3>
      <ul class="bullet-list" style="font-size: 11pt;">
        <li><strong>FinBERT Integration:</strong> Upgrade lexical scorer to transformer-grade FinBERT model via ONNX runtime for sub-20ms inference.</li>
        <li><strong>Live WebSocket Streaming:</strong> Connect to streaming market feeds (Polygon.io / Yahoo Finance) for live order book stress testing.</li>
        <li><strong>WebXR Headset Deployment:</strong> Native support for Apple Vision Pro and Meta Quest 3 spatial computing risk rooms.</li>
        <li><strong>PostgreSQL + TimescaleDB:</strong> Scale time-series transaction ingestion to 100,000+ records per second.</li>
      </ul>
    </div>

    <div class="card card-navy">
      <h3 style="font-size: 13.5pt; margin-bottom: 8px;">🌐 Long-Term Sovereign Vision</h3>
      <p style="font-size: 11.5pt; color: #cbd5e1; line-height: 1.45; margin-bottom: 12px;">
        FINRISK AI aims to become an <strong>open-source global sovereign risk intelligence standard</strong>.
      </p>
      <p style="font-size: 11pt; color: #94a3b8; line-height: 1.4;">
        By democratizing multi-modal risk quantification, we bridge the gap between multi-million dollar institutional risk desks and developing market treasuries, making systemic contagion transparent, visual, and actionable in real time.
      </p>
      <div style="margin-top: 14px; padding-top: 10px; border-top: 1px solid #334155; font-size: 10pt; color: #38bdf8;">
        Submitted for S&P Global & CRISIL Campus Hackathon 2026
      </div>
    </div>
  </div>

  <div class="slide-footer">
    <div class="footer-left"><strong>FINRISK AI</strong> — S&P Global & CRISIL Campus Hackathon 2026</div>
    <div class="footer-right">Candidate: Sarth Hemant Joshi (VIT Vellore) | joshisarth8yt@gmail.com</div>
  </div>
</div>

</body>
</html>'''

# Load architecture image
img_path = '/Users/harsh/Desktop/vit-sarth-joshi-hackathon/docs/architecture.png'
with open(img_path, 'rb') as f:
    b64 = base64.b64encode(f.read()).decode('utf-8')

final_html = html_content.replace('{{ARCH_B64}}', b64)

html_path = '/Users/harsh/Desktop/vit-sarth-joshi-hackathon/docs/presentation.html'
pdf_path = '/Users/harsh/Desktop/vit-sarth-joshi-hackathon/docs/presentation.pdf'

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(final_html)

print("Wrote HTML to", html_path)

cmd = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '--headless',
    '--disable-gpu',
    '--no-pdf-header-footer',
    f'--print-to-pdf={pdf_path}',
    html_path
]

res = subprocess.run(cmd, capture_output=True, text=True)
print("Chrome exit code:", res.returncode)
if os.path.exists(pdf_path):
    print("Generated PDF size:", os.path.getsize(pdf_path), "bytes")
else:
    print("PDF generation failed:", res.stderr)
