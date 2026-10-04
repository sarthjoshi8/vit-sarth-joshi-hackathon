import React, { useState, useEffect } from 'react';

export default function TransactionsView() {
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [anomalyOnly, setAnomalyOnly] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page,
      limit: 30,
      anomaly_only: anomalyOnly,
    });

    fetch(`/api/transactions?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setTransactions(data.items || []);
        setTotal(data.total || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load transactions:', err);
        setLoading(false);
      });
  }, [page, anomalyOnly]);

  const filtered = transactions.filter((t) => {
    if (typeFilter !== 'all' && t.type !== typeFilter) return false;
    return true;
  });

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Bar */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 4px 0' }}>
            💳 Financial Transaction Anomaly &amp; Fraud Surveillance
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
            Real-time multi-dimensional scoring: statistical amount Z-Score + velocity pattern + NLP description sentiment
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            className={`btn ${anomalyOnly ? 'btn-danger' : 'btn-secondary'}`}
            onClick={() => { setAnomalyOnly(!anomalyOnly); setPage(1); }}
          >
            {anomalyOnly ? '🚨 Showing Anomalies Only' : '🔍 Filter High Anomalies (>0.75)'}
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button
          className={`btn ${typeFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '6px 14px', fontSize: '12px' }}
          onClick={() => setTypeFilter('all')}
        >
          All Types
        </button>
        <button
          className={`btn ${typeFilter === 'debit' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '6px 14px', fontSize: '12px' }}
          onClick={() => setTypeFilter('debit')}
        >
          Debits Only
        </button>
        <button
          className={`btn ${typeFilter === 'credit' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '6px 14px', fontSize: '12px' }}
          onClick={() => setTypeFilter('credit')}
        >
          Credits Only
        </button>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
          Showing {filtered.length} of {total} transactions (Page {page})
        </span>
      </div>

      {/* Transactions Table */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Txn ID</th>
              <th>Date</th>
              <th>Customer ID</th>
              <th>Amount ($)</th>
              <th>Type</th>
              <th>Description</th>
              <th>Risk Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} style={{ background: t.anomaly_flag ? 'rgba(244, 63, 94, 0.04)' : undefined }}>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>#{t.transaction_id}</td>
                <td>{t.date}</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>CUST-{t.customer_id}</td>
                <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                  ${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td>
                  <span
                    style={{
                      textTransform: 'uppercase',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: t.type === 'debit' ? 'var(--accent-amber)' : 'var(--accent-cyan)'
                    }}
                  >
                    {t.type}
                  </span>
                </td>
                <td style={{ color: 'var(--text-secondary)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {t.description}
                </td>
                <td style={{ width: '130px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${(t.risk_score || 0) * 100}%`,
                          background: t.risk_score > 0.75 ? 'var(--accent-rose)' : t.risk_score > 0.45 ? 'var(--accent-amber)' : 'var(--accent-emerald)',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      {((t.risk_score || 0) * 100).toFixed(0)}%
                    </span>
                  </div>
                </td>
                <td>
                  {t.anomaly_flag ? (
                    <span className="badge critical">ANOMALY</span>
                  ) : (
                    <span className="badge low">NORMAL</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid var(--border-glass)' }}>
          <button
            className="btn btn-secondary"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            style={{ padding: '6px 14px', fontSize: '12px' }}
          >
            ← Previous Page
          </button>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Page {page} of {Math.ceil(total / 30) || 1}
          </span>
          <button
            className="btn btn-secondary"
            disabled={page * 30 >= total}
            onClick={() => setPage((p) => p + 1)}
            style={{ padding: '6px 14px', fontSize: '12px' }}
          >
            Next Page →
          </button>
        </div>
      </div>
    </div>
  );
}
