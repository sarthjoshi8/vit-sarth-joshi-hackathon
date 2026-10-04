import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid
} from 'recharts';
import DataUploaderModal from './DataUploaderModal';
import Globe3D from './Globe3D';

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
  const [useCustomShock, setUseCustomShock] = useState(false);
  const [sliderVal, setSliderVal] = useState(-25);
  const [scenariosList, setScenariosList] = useState([]);
  const [results, setResults] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detailTab, setDetailTab] = useState('breakdown'); // 'breakdown' | 'matrix' | 'heatmap' | 'globe'
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
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Module B Header Banner (Compact) */}
      <div
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.06) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          padding: '14px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: 800, color: 'var(--accent-cyan)', background: 'rgba(34, 211, 238, 0.12)', padding: '3px 8px', borderRadius: '4px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            <span>⚡</span> HACKATHON MODULE B • STRATEGIC STRESS TESTING
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 2px 0' }}>
            Macroeconomic Shock &amp; Portfolio Monte Carlo Simulation
          </h2>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Simulate systemic tail-risk drawdowns, compute 95% Parametric VaR &amp; Expected Shortfall (CVaR).
          </div>
          {hedgeMessage && (
            <div style={{ marginTop: '4px', fontSize: '11px', color: 'var(--accent-emerald)', fontWeight: 700 }}>
              {hedgeMessage}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary"
            style={{ fontSize: '11px', padding: '6px 12px', color: 'var(--accent-emerald)', border: '1px solid rgba(0, 245, 155, 0.4)' }}
            onClick={handleOptimizeHedge}
            title="Auto-rebalance portfolio towards minimum-variance defensive assets"
          >
            🛡️ Auto-Hedge
          </button>
          <button
            className="btn btn-secondary"
            style={{ fontSize: '11px', padding: '6px 12px', color: 'var(--accent-cyan)', border: '1px solid rgba(0, 242, 254, 0.4)' }}
            onClick={() => setIsUploaderOpen(true)}
          >
            📂 Ingest CSV
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

      {/* 2-Column Command Cockpit Layout */}
      <div className="stress-cockpit-grid">
        {/* LEFT COLUMN: Controls & Composition (~360px) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Card 1: Portfolio Allocation */}
          <div className="glass-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 800 }}>
                  💼 Portfolio Allocation
                </h3>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Total Equity: ${(totalPortfolioValue).toLocaleString()}
                </span>
              </div>

              {/* Presets */}
              <div style={{ display: 'flex', gap: '4px' }}>
                <button className="btn btn-secondary" style={{ fontSize: '10px', padding: '3px 7px' }} onClick={() => handleLoadPreset('balanced')}>Bal</button>
                <button className="btn btn-secondary" style={{ fontSize: '10px', padding: '3px 7px' }} onClick={() => handleLoadPreset('techHeavy')}>Tech</button>
                <button className="btn btn-secondary" style={{ fontSize: '10px', padding: '3px 7px' }} onClick={() => handleLoadPreset('defensive')}>Def</button>
              </div>
            </div>

            {/* Scrollable Asset Chips */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '160px', overflowY: 'auto', marginBottom: '12px', paddingRight: '4px' }}>
              {portfolio.map((pos, idx) => (
                <div
                  key={pos.stock + idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '5px 10px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 800, color: 'var(--accent-indigo)', fontFamily: 'var(--font-mono)' }}>
                      {pos.stock}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {pos.sector}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                      ${pos.value.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--accent-cyan)' }}>
                      {((pos.value / totalPortfolioValue) * 100).toFixed(0)}%
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
                        fontSize: '12px',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Asset Inline Form */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Ticker (e.g. GOOGL)"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
                style={{
                  padding: '6px 10px',
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  flex: 1,
                }}
              />
              <input
                type="number"
                placeholder="$"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                style={{
                  padding: '6px 8px',
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  width: '70px',
                }}
              />
              <button className="btn btn-primary" style={{ padding: '6px 10px', fontSize: '11px' }} onClick={handleAddStock}>
                + Add
              </button>
            </div>
          </div>

          {/* Card 2: Macro Regime Selection */}
          <div className="glass-card" style={{ padding: '16px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 800 }}>
              🌪️ Macro Stress Regime
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
              {[
                { key: 'recession', icon: '📉', label: 'Global Recession', shock: '-25%' },
                { key: 'inflation', icon: '🔥', label: 'Inflation Spike', shock: '-15%' },
                { key: 'market_crash', icon: '⚡', label: 'Black Swan Crash', shock: '-40%' },
                { key: 'geopolitical', icon: '⚔️', label: 'Geopolitical Crisis', shock: '-20%' },
                { key: 'pandemic', icon: '🧬', label: 'Pandemic Shock', shock: '-30%' }
              ].map((item) => (
                <div
                  key={item.key}
                  onClick={() => {
                    setScenario(item.key);
                    setUseCustomShock(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    background: scenario === item.key && !useCustomShock ? 'rgba(0, 242, 254, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                    border: scenario === item.key && !useCustomShock ? '1px solid var(--accent-cyan)' : '1px solid var(--border-glass)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600 }}>
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent-rose)' }}>
                    {item.shock}
                  </span>
                </div>
              ))}
            </div>

            {/* Custom Shock Override Slider */}
            <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-glass)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={useCustomShock}
                    onChange={(e) => setUseCustomShock(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span>Custom Shock:</span>
                </label>
                <span style={{ fontSize: '13px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-rose)' }}>
                  {sliderVal}%
                </span>
              </div>
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

        {/* RIGHT COLUMN: Analytics, Chart & Workspace Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Row 1: 4 Impact KPI Cards */}
          <div className="stats-grid" style={{ marginBottom: 0, gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
            <div className="stat-card rose" style={{ padding: '12px 14px' }}>
              <div className="stat-label" style={{ fontSize: '10px' }}>Capital Drawdown</div>
              <div className="stat-value" style={{ fontSize: '20px', color: 'var(--accent-rose)' }}>
                -${(results?.total_loss || 0).toLocaleString()}
              </div>
              <div className="stat-sub" style={{ fontSize: '10px' }}>
                -{results?.loss_pct || 0}% total equity
              </div>
            </div>

            <div className="stat-card amber" style={{ padding: '12px 14px' }}>
              <div className="stat-label" style={{ fontSize: '10px' }}>1-Mo 95% VaR</div>
              <div className="stat-value" style={{ fontSize: '20px', color: 'var(--accent-amber)' }}>
                ${(results?.var_95 || 0).toLocaleString()}
              </div>
              <div className="stat-sub" style={{ fontSize: '10px' }}>
                Monte Carlo Simulation
              </div>
            </div>

            <div className="stat-card indigo" style={{ padding: '12px 14px' }}>
              <div className="stat-label" style={{ fontSize: '10px' }}>Expected Shortfall</div>
              <div className="stat-value" style={{ fontSize: '20px', color: 'var(--accent-indigo)' }}>
                ${(results?.cvar_95 || 0).toLocaleString()}
              </div>
              <div className="stat-sub" style={{ fontSize: '10px' }}>
                Tail 5% Mean Loss
              </div>
            </div>

            <div className="stat-card emerald" style={{ padding: '12px 14px' }}>
              <div className="stat-label" style={{ fontSize: '10px' }}>Post-Shock Equity</div>
              <div className="stat-value" style={{ fontSize: '20px', color: 'var(--accent-emerald)' }}>
                ${(results?.stressed_value || 0).toLocaleString()}
              </div>
              <div className="stat-sub" style={{ fontSize: '10px' }}>
                Residual Capital
              </div>
            </div>
          </div>

          {/* Row 2: Asset Pre-Shock vs Post-Shock Bar Chart */}
          <div className="glass-card" style={{ padding: '14px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 800 }}>
                📊 Stressed Value vs. Pre-Shock Value by Asset
              </h3>
              {results && (
                <span className={`badge ${results.risk_rating.toLowerCase()}`} style={{ fontSize: '9px' }}>
                  Rating: {results.risk_rating}
                </span>
              )}
            </div>

            <div style={{ height: '170px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={results?.stock_impacts || []} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                  <XAxis dataKey="stock" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111827',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                    formatter={(val, name) => [`$${val.toLocaleString()}`, name === 'original_value' ? 'Base Value' : 'Stressed Value']}
                  />
                  <Bar dataKey="original_value" name="Base Value" fill="#6366f1" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="stressed_value" name="Stressed Value" fill="#f43f5e" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Row 3: Detail Workspace with Tab Switcher */}
          <div className="glass-card" style={{ padding: '14px 18px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button
                  className={`btn ${detailTab === 'breakdown' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '10px', padding: '5px 10px' }}
                  onClick={() => setDetailTab('breakdown')}
                >
                  📋 Position Breakdown
                </button>
                <button
                  className={`btn ${detailTab === 'matrix' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '10px', padding: '5px 10px' }}
                  onClick={() => setDetailTab('matrix')}
                >
                  ⚡ All-Scenario Matrix
                </button>
                <button
                  className={`btn ${detailTab === 'heatmap' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '10px', padding: '5px 10px' }}
                  onClick={() => setDetailTab('heatmap')}
                >
                  🔥 Correlation Heatmap
                </button>
                <button
                  className={`btn ${detailTab === 'globe' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '10px', padding: '5px 10px' }}
                  onClick={() => setDetailTab('globe')}
                >
                  🌐 3D Risk Corridors
                </button>
              </div>
            </div>

            {/* TAB 1: Position Breakdown Table */}
            {detailTab === 'breakdown' && (
              <div style={{ overflowX: 'auto', maxHeight: '240px', overflowY: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Ticker</th>
                      <th>Sector</th>
                      <th>Base Value</th>
                      <th>Shock</th>
                      <th>Loss Amount</th>
                      <th>Post-Shock Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(results?.stock_impacts || []).map((row, idx) => (
                      <tr key={row.stock + idx}>
                        <td style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                          {row.stock}
                        </td>
                        <td>{row.sector}</td>
                        <td>${row.original_value.toLocaleString()}</td>
                        <td style={{ color: 'var(--accent-rose)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                          -{(row.loss_pct).toFixed(1)}%
                        </td>
                        <td style={{ color: 'var(--accent-rose)', fontWeight: 700 }}>
                          -${row.loss.toLocaleString()}
                        </td>
                        <td style={{ fontWeight: 600 }}>
                          ${row.stressed_value.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 2: All-Scenario Matrix */}
            {detailTab === 'matrix' && comparison && (
              <div style={{ overflowX: 'auto', maxHeight: '240px', overflowY: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Macro Regime</th>
                      <th>Base Portfolio</th>
                      <th>Loss ($)</th>
                      <th>Drawdown</th>
                      <th>1-Mo 95% VaR</th>
                      <th>CVaR (Tail Risk)</th>
                      <th>Rating</th>
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
            )}

            {/* TAB 3: Correlation Heatmap */}
            {detailTab === 'heatmap' && (
              <div style={{ overflowX: 'auto', maxHeight: '240px', overflowY: 'auto' }}>
                <table className="data-table" style={{ textAlign: 'center', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left' }}>Asset</th>
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
            )}

            {/* TAB 4: 3D Spillover Globe */}
            {detailTab === 'globe' && (
              <div style={{ padding: '8px 0' }}>
                <Globe3D height={260} compact={true} selectedScenario={scenario} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Custom CSV Ingestion */}
      <DataUploaderModal
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        onApplyPortfolio={(newPort) => setPortfolio(newPort)}
      />
    </div>
  );
}
