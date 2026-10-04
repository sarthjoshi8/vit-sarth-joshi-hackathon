import React, { useState, useEffect } from 'react';

export default function NLPFeed() {
  const [activeTab, setActiveTab] = useState('headlines'); // 'headlines' | 'tweets'
  const [headlines, setHeadlines] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [sourceFilter, setSourceFilter] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [stocksList, setStocksList] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fetch stocks list on mount
  useEffect(() => {
    fetch('/api/stocks')
      .then((r) => r.json())
      .then((d) => setStocksList(d.stocks || []))
      .catch((e) => console.error(e));
  }, []);

  // Fetch headlines
  useEffect(() => {
    if (activeTab === 'headlines') {
      setLoading(true);
      const params = new URLSearchParams({
        page: page,
        limit: 25,
      });
      if (sourceFilter) params.append('source', sourceFilter);
      if (sentimentFilter) params.append('sentiment', sentimentFilter);

      fetch(`/api/headlines?${params.toString()}`)
        .then((r) => r.json())
        .then((data) => {
          setHeadlines(data.items || []);
          setLoading(false);
        })
        .catch((e) => setLoading(false));
    } else {
      setLoading(true);
      const params = new URLSearchParams({
        page: page,
        limit: 25,
      });
      if (stockFilter) params.append('stock', stockFilter);

      fetch(`/api/tweets?${params.toString()}`)
        .then((r) => r.json())
        .then((data) => {
          setTweets(data.items || []);
          setLoading(false);
        })
        .catch((e) => setLoading(false));
    }
  }, [activeTab, page, sourceFilter, sentimentFilter, stockFilter]);

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 4px 0' }}>
            📰 NLP Financial Intelligence &amp; Social Sentiment
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
            Real-time multi-source polarity analysis powered by Financial PhraseBank &amp; lexical NLP engine
          </p>
        </div>

        <div className="tabs" style={{ margin: 0 }}>
          <button
            className={`tab ${activeTab === 'headlines' ? 'active' : ''}`}
            onClick={() => { setActiveTab('headlines'); setPage(1); }}
          >
            Reuters / CNBC Headlines
          </button>
          <button
            className={`tab ${activeTab === 'tweets' ? 'active' : ''}`}
            onClick={() => { setActiveTab('tweets'); setPage(1); }}
          >
            Stock Social Sentiment
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      {activeTab === 'headlines' ? (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            value={sourceFilter}
            onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }}
            style={{ padding: '8px 14px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)' }}
          >
            <option value="">All News Sources</option>
            <option value="reuters">Reuters</option>
            <option value="cnbc">CNBC</option>
            <option value="guardian">The Guardian</option>
          </select>

          <select
            value={sentimentFilter}
            onChange={(e) => { setSentimentFilter(e.target.value); setPage(1); }}
            style={{ padding: '8px 14px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)' }}
          >
            <option value="">All Sentiments</option>
            <option value="positive">Positive Only</option>
            <option value="negative">Negative Only</option>
            <option value="neutral">Neutral Only</option>
          </select>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            value={stockFilter}
            onChange={(e) => { setStockFilter(e.target.value); setPage(1); }}
            style={{ padding: '8px 14px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)' }}
          >
            <option value="">All Tickers</option>
            {stocksList.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}

      {/* Main Feed Content */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        {activeTab === 'headlines' ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Source</th>
                <th>Headline</th>
                <th>Time</th>
                <th>Sentiment</th>
                <th>Polarity Score</th>
              </tr>
            </thead>
            <tbody>
              {headlines.map((h) => (
                <tr key={h.id}>
                  <td style={{ textTransform: 'uppercase', fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                    {h.source}
                  </td>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                    {h.headline}
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {h.time || 'Recent'}
                  </td>
                  <td>
                    <span className={`badge ${h.sentiment || 'neutral'}`}>
                      {h.sentiment || 'neutral'}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    {h.sentiment_score !== null ? (h.sentiment_score > 0 ? `+${h.sentiment_score}` : h.sentiment_score) : '0.0'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Stock</th>
                <th>Date</th>
                <th>Social Post / Tweet</th>
                <th>Market Price</th>
                <th>30d Volatility</th>
                <th>LSTM Polarity</th>
              </tr>
            </thead>
            <tbody>
              {tweets.map((t) => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-indigo)' }}>
                    {t.stock}
                  </td>
                  <td>{t.date}</td>
                  <td style={{ color: 'var(--text-primary)', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {t.tweet}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>
                    {t.last_price ? `$${t.last_price.toFixed(2)}` : 'N/A'}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>
                    {t.volatility_30d ? `${t.volatility_30d.toFixed(1)}%` : 'N/A'}
                  </td>
                  <td>
                    <span className={`badge ${t.lstm_polarity > 0 ? 'positive' : t.lstm_polarity < 0 ? 'negative' : 'neutral'}`}>
                      {t.lstm_polarity > 0 ? 'BULLISH' : t.lstm_polarity < 0 ? 'BEARISH' : 'NEUTRAL'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

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
            Page {page}
          </span>
          <button
            className="btn btn-secondary"
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
