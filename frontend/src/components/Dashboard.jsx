import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const COLORS = ['#6366f1', '#f43f5e', '#f59e0b', '#10b981', '#22d3ee'];

export default function Dashboard({ onNavigateToStress }) {
  const [summary, setSummary] = useState(null);
  const [riskEvents, setRiskEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/dashboard/summary').then((r) => r.json()),
      fetch('/api/risk-events?limit=8').then((r) => r.json()),
    ])
      .then(([sumData, evData]) => {
        setSummary(sumData);
        setRiskEvents(evData.items || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load dashboard:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔄</div>
        Loading FINRISK Intelligence Engine telemetry...
      </div>
    );
  }

  // Format chart data
  const sentimentData = summary?.sentiment_distribution
    ? [
        { name: 'Positive', value: summary.sentiment_distribution.positive, color: '#10b981' },
        { name: 'Negative', value: summary.sentiment_distribution.negative, color: '#f43f5e' },
        { name: 'Neutral', value: summary.sentiment_distribution.neutral, color: '#94a3b8' },
      ]
    : [];

  const categoryData = summary?.category_distribution
    ? Object.entries(summary.category_distribution).map(([cat, val]) => ({
        name: cat.charAt(0).toUpperCase() + cat.slice(1),
        count: val,
      }))
    : [];

  const severityData = summary?.severity_distribution
    ? Object.entries(summary.severity_distribution).map(([sev, val]) => ({
        name: sev.toUpperCase(),
        count: val,
      }))
    : [];

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner / Pulse */}
      <div
        className="glass-card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(34, 211, 238, 0.06) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            🛡️
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 4px 0' }}>
              Real-Time Market &amp; Operational Risk Monitor
            </h2>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Active Ingestion: Financial PhraseBank • Reuters/CNBC News • Twitter Sentiment • Banking Transactions
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-primary" onClick={onNavigateToStress}>
            ⚡ Launch Stress Test (Module B)
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card indigo">
          <div className="stat-label">Total Transactions Analyzed</div>
          <div className="stat-value">{summary?.total_transactions?.toLocaleString() || '3,000'}</div>
          <div className="stat-sub">Ingested &amp; Z-Score Screened</div>
        </div>

        <div className="stat-card rose">
          <div className="stat-label">Flagged Risk Anomalies</div>
          <div className="stat-value" style={{ color: 'var(--accent-rose)' }}>
            {summary?.anomaly_count?.toLocaleString() || '184'}
          </div>
          <div className="stat-sub">
            {((summary?.anomaly_count / (summary?.total_transactions || 1)) * 100).toFixed(1)}% anomaly frequency
          </div>
        </div>

        <div className="stat-card emerald">
          <div className="stat-label">Processed Financial Headlines</div>
          <div className="stat-value" style={{ color: 'var(--accent-emerald)' }}>
            {summary?.total_headlines?.toLocaleString() || '6,000'}
          </div>
          <div className="stat-sub">CNBC, Guardian &amp; Reuters feeds</div>
        </div>

        <div className="stat-card amber">
          <div className="stat-label">Active Systemic Risk Events</div>
          <div className="stat-value" style={{ color: 'var(--accent-amber)' }}>
            {summary?.total_risk_events || '98'}
          </div>
          <div className="stat-sub">Multi-source correlation alerts</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-grid">
        {/* Sentiment Distribution */}
        <div className="chart-card">
          <h3>
            <span>📈</span> NLP News &amp; Sentiment Polarity Breakdown
          </h3>
          <div style={{ height: '260px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#60a5fa',
                  }}
                  itemStyle={{ color: '#38bdf8', fontWeight: 600 }}
                  labelStyle={{ color: '#60a5fa', fontWeight: 700 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', fontSize: '13px' }}>
            {sentimentData.map((s) => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: s.color }}></span>
                <span style={{ color: '#38bdf8', fontWeight: 700, letterSpacing: '0.3px' }}>{s.name}:</span>
                <strong style={{ color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>{s.value.toLocaleString()}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Events by Category */}
        <div className="chart-card">
          <h3>
            <span>📊</span> Risk Signals by Domain Category
          </h3>
          <div style={{ height: '260px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
            Aggregated cross-domain risk signals from transactions, news and social sentiment
          </div>
        </div>
      </div>

      {/* Latest Risk Events Table */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
              🚨 Real-Time Risk Intelligence Feed
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              High-priority events triggered by NLP sentiment spikes, transaction anomalies, and volatility
            </span>
          </div>
          <span className="badge high">LIVE STREAM</span>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Severity</th>
              <th>Category</th>
              <th>Event Title</th>
              <th>Source</th>
              <th>Risk Score</th>
            </tr>
          </thead>
          <tbody>
            {riskEvents.map((ev) => (
              <tr key={ev.id}>
                <td>
                  <span className={`badge ${ev.severity}`}>
                    {ev.severity}
                  </span>
                </td>
                <td style={{ textTransform: 'capitalize', fontWeight: 600 }}>
                  {ev.category}
                </td>
                <td style={{ color: 'var(--text-primary)', maxWidth: '420px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {ev.title}
                </td>
                <td style={{ textTransform: 'uppercase', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                  {ev.source}
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: ev.score > 0.8 ? 'var(--accent-rose)' : 'var(--accent-amber)' }}>
                  {(ev.score * 100).toFixed(0)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
