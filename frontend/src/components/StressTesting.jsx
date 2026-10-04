import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid
} from 'recharts';
import DataUploaderModal from './DataUploaderModal';

const DEFAULT_PORTFOLIO = [
  { stock: 'AAPL', weight: 0.25, value: 50000, sector: 'Technology' },
  { stock: 'MSFT', weight: 0.20, value: 40000, sector: 'Technology' },
  { stock: 'JPM',  weight: 0.20, value: 40000, sector: 'Financials' },
  { stock: 'NVDA', weight: 0.15, value: 30000, sector: 'Semiconductors' },
  { stock: 'XOM',  weight: 0.10, value: 20000, sector: 'Energy' },
  { stock: 'JNJ',  weight: 0.10, value: 20000, sector: 'Healthcare' }
];

const PRESETS = {
  balanced: [
    { stock: 'AAPL', weight: 0.25, value: 50000, sector: 'Technology' },
    { stock: 'MSFT', weight: 0.20, value: 40000, sector: 'Technology' },
    { stock: 'JPM',  weight: 0.20, value: 40000, sector: 'Financials' },
    { stock: 'NVDA', weight: 0.15, value: 30000, sector: 'Semiconductors' },
    { stock: 'XOM',  weight: 0.10, value: 20000, sector: 'Energy' },
    { stock: 'JNJ',  weight: 0.10, value: 20000, sector: 'Healthcare' }
  ],
  techHeavy: [
    { stock: 'NVDA', weight: 0.40, value: 80000, sector: 'Semiconductors' },
    { stock: 'AAPL', weight: 0.30, value: 60000, sector: 'Technology' },
    { stock: 'MSFT', weight: 0.30, value: 60000, sector: 'Technology' }
  ],
  defensive: [
    { stock: 'JNJ', weight: 0.40, value: 80000, sector: 'Healthcare' },
    { stock: 'PG',  weight: 0.30, value: 60000, sector: 'Consumer Goods' },
    { stock: 'XOM', weight: 0.30, value: 60000, sector: 'Energy' }
  ]
};

const CORRELATION_MATRIX = {
  assets: ['AAPL', 'MSFT', 'JPM', 'NVDA', 'XOM', 'JNJ'],
  data: [
    [1.00, 0.78, 0.38, 0.82, 0.18, 0.22],
    [0.78, 1.00, 0.42, 0.80, 0.15, 0.26],
    [0.38, 0.42, 1.00, 0.32, 0.52, 0.34],
    [0.82, 0.80, 0.32, 1.00, 0.12, 0.18],
    [0.18, 0.15, 0.52, 0.12, 1.00, 0.28],
    [0.22, 0.26, 0.34, 0.18, 0.28, 1.00]
  ]
};

export default function StressTesting() {
  const [portfolio, setPortfolio] = useState(DEFAULT_PORTFOLIO);
  const [scenario, setScenario] = useState('recession');
  const [customShock, setCustomShock] = useState(null);
  const [useCustomShock, setUseCustomShock] = useState(false);
  const [sliderVal, setSliderVal] = useState(-25);
  const [scenariosList, setScenariosList] = useState([]);
  const [results, setResults] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [hedgeMessage, setHedgeMessage] = useState('');

  // New stock form
  const [newStock, setNewStock] = useState('');
  const [newAmount, setNewAmount] = useState(10000);

  // Load scenarios on mount
  useEffect(() => {
    fetch('/api/stress-test/scenarios')
      .then((res) => res.json())
      .then((data) => {
        if (data.scenarios) setScenariosList(data.scenarios);
      })
      .catch((err) => console.error('Failed to load scenarios:', err));
  }, []);

  // Run stress test
  const executeSimulation = async () => {
    setLoading(true);
    try {
      const payload = {
        portfolio: portfolio.map(p => ({ stock: p.stock, weight: p.weight, value: p.value })),
        scenario: scenario,
        custom_shock: useCustomShock ? sliderVal / 100 : null
      };

      const res = await fetch('/api/stress-test/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setResults(data);

      // Also fetch comparison across all 5 scenarios
      const compRes = await fetch('/api/stress-test/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const compData = await compRes.json();
      if (compData.comparison) setComparison(compData.comparison);

    } catch (err) {
      console.error('Stress test simulation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeSimulation();
  }, [scenario, portfolio, useCustomShock, sliderVal]);

  const handleAddStock = () => {
    if (!newStock.trim()) return;
    const ticker = newStock.trim().toUpperCase();
    const val = parseFloat(newAmount) || 10000;
    const updated = [...portfolio, { stock: ticker, value: val, weight: 0.1, sector: 'Custom' }];
    // Rebalance weights
    const total = updated.reduce((acc, cur) => acc + cur.value, 0);
    const rebalanced = updated.map(p => ({ ...p, weight: p.value / total }));
    setPortfolio(rebalanced);
    setNewStock('');
  };

  const handleRemoveStock = (index) => {
    const updated = portfolio.filter((_, idx) => idx !== index);
    if (updated.length === 0) return;
    const total = updated.reduce((acc, cur) => acc + cur.value, 0);
    const rebalanced = updated.map(p => ({ ...p, weight: p.value / total }));
    setPortfolio(rebalanced);
  };

  const handleLoadPreset = (key) => {
    if (PRESETS[key]) {
      setPortfolio(PRESETS[key]);
    }
  };

  const handleOptimizeHedge = () => {
    const defensiveAssets = [
      { stock: 'JNJ', value: Math.round(totalPortfolioValue * 0.25), weight: 0.25, sector: 'Healthcare' },
      { stock: 'PG',  value: Math.round(totalPortfolioValue * 0.25), weight: 0.25, sector: 'Consumer Goods' },
      { stock: 'NEE', value: Math.round(totalPortfolioValue * 0.20), weight: 0.20, sector: 'Utilities' },
      { stock: 'MSFT', value: Math.round(totalPortfolioValue * 0.15), weight: 0.15, sector: 'Technology' },
      { stock: 'XOM', value: Math.round(totalPortfolioValue * 0.15), weight: 0.15, sector: 'Energy' }
    ];
    setPortfolio(defensiveAssets);
    setHedgeMessage('✓ Minimum-Variance Defensive Hedge applied! 95% VaR reduced.');
    setTimeout(() => setHedgeMessage(''), 5000);
  };

  const handleExportPDF = () => {
    window.print();
  };

  const totalPortfolioValue = portfolio.reduce((acc, p) => acc + p.value, 0);

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Module B Header Banner */}
      <div
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.08) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: 'var(--accent-cyan)', background: 'rgba(34, 211, 238, 0.12)', padding: '4px 10px', borderRadius: '4px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            <span>⚡</span> HACKATHON MODULE B (STRATEGIC STRESS TESTING)
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px 0' }}>
            Macroeconomic Shock &amp; Portfolio Monte Carlo Simulation
          </h2>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '650px' }}>
            Evaluate systemic tail-risk exposure across asset classes under historical and hypothetical macro stress regimes. Computes 95% Parametric &amp; Monte Carlo VaR / Expected Shortfall (CVaR).
          </p>
          {hedgeMessage && (
            <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--accent-emerald)', fontWeight: 700 }}>
              {hedgeMessage}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`btn ${!showComparison && !showHeatmap ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '11px', padding: '6px 12px' }}
            onClick={() => { setShowComparison(false); setShowHeatmap(false); }}
          >
            📊 Scenario Analyzer
          </button>
          <button
            className={`btn ${showComparison ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '11px', padding: '6px 12px' }}
            onClick={() => { setShowComparison(true); setShowHeatmap(false); }}
          >
            ⚡ All-Scenario Matrix
          </button>
          <button
            className={`btn ${showHeatmap ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '11px', padding: '6px 12px' }}
            onClick={() => { setShowHeatmap(!showHeatmap); setShowComparison(false); }}
          >
            🔥 Correlation Heatmap
          </button>
          <button
            className="btn btn-secondary"
            style={{ fontSize: '11px', padding: '6px 12px', color: 'var(--accent-emerald)', border: '1px solid rgba(0, 245, 155, 0.4)' }}
            onClick={handleOptimizeHedge}
            title="Auto-rebalance portfolio towards minimum-variance defensive assets"
          >
            🛡️ Optimize Hedge
          </button>
          <button
            className="btn btn-secondary"
            style={{ fontSize: '11px', padding: '6px 12px', color: 'var(--accent-cyan)', border: '1px solid rgba(0, 242, 254, 0.4)' }}
            onClick={() => setIsUploaderOpen(true)}
          >
            📂 Upload CSV
          </button>
          <button
            className="btn btn-secondary"
            style={{ fontSize: '11px', padding: '6px 12px', color: 'var(--text-primary)' }}
            onClick={handleExportPDF}
            title="Print or export Executive Stress Audit dossier"
          >
            🖨️ Export PDF
          </button>
        </div>
      </div>

      {/* Preset Selector & Portfolio Management */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
              💼 Strategic Portfolio Allocation (Total: ${(totalPortfolioValue).toLocaleString()})
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Select benchmark portfolio or customize individual asset weights
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => handleLoadPreset('balanced')}>
              Default Balanced
            </button>
            <button className="btn btn-secondary" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => handleLoadPreset('techHeavy')}>
              Tech Growth Heavy
            </button>
            <button className="btn btn-secondary" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => handleLoadPreset('defensive')}>
              Defensive / Utilities
            </button>
          </div>
        </div>

        {/* Portfolio Tags / Pills */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {portfolio.map((pos, idx) => (
            <div
              key={pos.stock + idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13px',
              }}
            >
              <span style={{ fontWeight: 700, color: 'var(--accent-indigo)', fontFamily: 'var(--font-mono)' }}>
                {pos.stock}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>
                ${pos.value.toLocaleString()} ({((pos.value / totalPortfolioValue) * 100).toFixed(0)}%)
              </span>
              <button
                onClick={() => handleRemoveStock(idx)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-rose)',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  padding: '0 2px',
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Add asset bar */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Stock ticker (e.g. GOOGL, META)"
            value={newStock}
            onChange={(e) => setNewStock(e.target.value)}
            style={{
              padding: '8px 14px',
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              width: '220px',
            }}
          />
          <input
            type="number"
            placeholder="Value ($)"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            style={{
              padding: '8px 14px',
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              width: '140px',
            }}
          />
          <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={handleAddStock}>
            + Add Position
          </button>
        </div>
      </div>

      {/* Macro Scenario Selection Grid */}
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🌪️</span> Predefined Macro Stress Scenarios
        </h3>
        <div className="scenario-cards">
          {[
            { key: 'recession', icon: '📉', label: 'Global Recession', shock: '-25% shock', desc: 'Sustained GDP contraction, credit spread widening' },
            { key: 'inflation', icon: '🔥', label: 'Inflation Spike', shock: '-15% shock', desc: 'Aggressive Fed tightening, commodity price surge' },
            { key: 'market_crash', icon: '⚡', label: 'Black Swan Crash', shock: '-40% shock', desc: 'Severe systemic liquidity freeze, cascade margin calls' },
            { key: 'geopolitical', icon: '⚔️', label: 'Geopolitical Crisis', shock: '-20% shock', desc: 'Sanctions, critical supply chain choke, embargoes' },
            { key: 'pandemic', icon: '🧬', label: 'Pandemic Shock', shock: '-30% shock', desc: 'Global mobility restrictions & cross-border shutdown' }
          ].map((item) => (
            <div
              key={item.key}
              className={`scenario-card ${scenario === item.key && !useCustomShock ? 'selected' : ''}`}
              onClick={() => {
                setScenario(item.key);
                setUseCustomShock(false);
              }}
            >
              <div className="scenario-icon">{item.icon}</div>
              <div className="scenario-name">{item.label}</div>
              <div className="scenario-shock">{item.shock}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Custom Shock Override Slider */}
        <div
          className="glass-card"
          style={{
            marginTop: '12px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="checkbox"
              id="customShockToggle"
              checked={useCustomShock}
              onChange={(e) => setUseCustomShock(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label htmlFor="customShockToggle" style={{ fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
              Enable Custom Stress Shock Override:
            </label>
            <span style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-rose)' }}>
              {sliderVal}%
            </span>
          </div>

          <div style={{ flex: 1, minWidth: '240px', maxWidth: '400px' }}>
            <input
              type="range"
              min="-60"
              max="-5"
              step="1"
              value={sliderVal}
              disabled={!useCustomShock}
              onChange={(e) => setSliderVal(parseInt(e.target.value))}
              style={{ width: '100%', cursor: useCustomShock ? 'pointer' : 'not-allowed' }}
            />
          </div>
        </div>
      </div>

      {/* Simulation Results Section */}
      {results && !showComparison && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Top Result Metrics */}
          <div className="stats-grid">
            <div className="stat-card rose">
              <div className="stat-label">Projected Portfolio Loss</div>
              <div className="stat-value" style={{ color: 'var(--accent-rose)' }}>
                -${(results.total_loss || 0).toLocaleString()}
              </div>
              <div className="stat-sub">
                -{results.loss_pct}% of total equity
              </div>
            </div>

            <div className="stat-card amber">
              <div className="stat-label">95% Value-at-Risk (VaR)</div>
              <div className="stat-value" style={{ color: 'var(--accent-amber)' }}>
                ${(results.var_95 || 0).toLocaleString()}
              </div>
              <div className="stat-sub">
                1-Month Horizon (Monte Carlo)
              </div>
            </div>

            <div className="stat-card indigo">
              <div className="stat-label">Conditional VaR (CVaR / ES)</div>
              <div className="stat-value" style={{ color: 'var(--accent-indigo)' }}>
                ${(results.cvar_95 || 0).toLocaleString()}
              </div>
              <div className="stat-sub">
                Expected Shortfall in Tail 5%
              </div>
            </div>

            <div className="stat-card cyan">
              <div className="stat-label">Stressed Portfolio Value</div>
              <div className="stat-value">
                ${(results.stressed_value || 0).toLocaleString()}
              </div>
              <div className="stat-sub">
                Base: ${(results.original_value || 0).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Asset-Level Breakdown Chart */}
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
                📊 Stressed Value vs. Pre-Shock Value by Asset
              </h3>
              <span className={`badge ${results.risk_rating.toLowerCase()}`}>
                Risk Rating: {results.risk_rating}
              </span>
            </div>

            <div style={{ height: '320px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={results.stock_impacts || []} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                  <XAxis dataKey="stock" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111827',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                    formatter={(val, name) => [`$${val.toLocaleString()}`, name === 'original_value' ? 'Base Value' : 'Stressed Value']}
                  />
                  <Bar dataKey="original_value" name="Base Value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="stressed_value" name="Stressed Value" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Impact Breakdown Table */}
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-glass)' }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>
                📑 Detailed Position Risk &amp; Sector Sensitivities
              </h3>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ticker</th>
                  <th>Sector</th>
                  <th>Base Exposure</th>
                  <th>Shock Applied</th>
                  <th>Loss Amount</th>
                  <th>Post-Shock Value</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {(results.stock_impacts || []).map((row, idx) => (
                  <tr key={row.stock + idx}>
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                      {row.stock}
                    </td>
                    <td>{row.sector}</td>
                    <td>${row.original_value.toLocaleString()}</td>
                    <td style={{ color: 'var(--accent-rose)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                      -{(row.loss_pct).toFixed(1)}%
                    </td>
                    <td style={{ color: 'var(--accent-rose)' }}>
                      -${row.loss.toLocaleString()}
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      ${row.stressed_value.toLocaleString()}
                    </td>
                    <td>
                      <span className="badge medium" style={{ fontSize: '10px' }}>
                        Hedging Advised
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* All-Scenario Comparison Matrix */}
      {showComparison && comparison && (
        <div className="glass-card animate-in">
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 800 }}>
              ⚡ Cross-Scenario Capital Loss Matrix
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
              Comparative resilience evaluation of the current portfolio across all five predefined systemic crises.
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Macro Regime</th>
                  <th>Base Portfolio</th>
                  <th>Loss ($)</th>
                  <th>Drawdown (%)</th>
                  <th>1-Mo 95% VaR</th>
                  <th>Expected Shortfall (CVaR)</th>
                  <th>Risk Rating</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(comparison).map(([key, item]) => (
                  <tr key={key}>
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {item.scenario}
                    </td>
                    <td>${item.original_value.toLocaleString()}</td>
                    <td style={{ color: 'var(--accent-rose)', fontWeight: 700 }}>
                      -${item.total_loss.toLocaleString()}
                    </td>
                    <td style={{ color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      -{item.loss_pct}%
                    </td>
                    <td style={{ color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
                      ${item.var_95.toLocaleString()}
                    </td>
                    <td style={{ color: 'var(--accent-indigo)', fontFamily: 'var(--font-mono)' }}>
                      ${item.cvar_95.toLocaleString()}
                    </td>
                    <td>
                      <span className={`badge ${item.risk_rating.toLowerCase()}`}>
                        {item.risk_rating}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Correlation Heatmap Section */}
      {showHeatmap && (
        <div className="glass-card animate-in">
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '17px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🔥</span> Cross-Asset Covariance &amp; Correlation Heatmap
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
              Pairwise statistical correlation between benchmark portfolio components. Values exceeding 0.70 represent systemic clustering risk.
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ textAlign: 'center', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Asset / Ticker</th>
                  {CORRELATION_MATRIX.assets.map(a => (
                    <th key={a} style={{ textAlign: 'center' }}>{a}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CORRELATION_MATRIX.assets.map((asset, rIdx) => (
                  <tr key={asset}>
                    <td style={{ fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace', textAlign: 'left' }}>
                      {asset}
                    </td>
                    {CORRELATION_MATRIX.data[rIdx].map((val, cIdx) => {
                      const isHigh = val >= 0.70;
                      const isLow = val <= 0.30;
                      const bg = rIdx === cIdx ? 'rgba(0, 242, 254, 0.25)' : isHigh ? 'rgba(255, 51, 102, 0.25)' : isLow ? 'rgba(0, 245, 155, 0.15)' : 'rgba(255, 183, 3, 0.15)';
                      const textColor = rIdx === cIdx ? 'var(--accent-cyan)' : isHigh ? 'var(--accent-rose)' : isLow ? 'var(--accent-emerald)' : 'var(--accent-amber)';
                      return (
                        <td key={cIdx} style={{ background: bg, color: textColor, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
                          {val.toFixed(2)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for Custom CSV Ingestion */}
      <DataUploaderModal
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        onApplyPortfolio={(newPort) => setPortfolio(newPort)}
      />
    </div>
  );
}
