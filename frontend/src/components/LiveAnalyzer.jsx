import React, { useState } from 'react';

const PRESETS = [
  {
    label: '🚨 Bank Run / Liquidity Shock',
    text: 'Silicon Valley Bank collapses following historic deposit flight, liquidity freeze and emergency regulatory shutdown.',
  },
  {
    label: '🚀 Tech Earnings Boom',
    text: 'NVIDIA reports record quarterly revenue and explosive profit margins, soaring past Wall Street guidance on massive AI chip demand.',
  },
  {
    label: '🔥 Fed Rate Hike & Inflation',
    text: 'Federal Reserve delivers aggressive 75 basis point rate hike, warning of persistent inflation, debt burden and recession risks.',
  },
  {
    label: '💊 Pharma Breakthrough',
    text: 'Pfizer announces successful Phase 3 trial results with strong efficacy, securing breakthrough FDA approval designation.',
  },
  {
    label: '📉 Corporate Fraud & Layoffs',
    text: 'Audit committee reveals widespread accounting fraud, prompting immediate executive resignations, credit downgrade, and 25% workforce cuts.',
  },
];

export default function LiveAnalyzer() {
  const [inputText, setInputText] = useState(PRESETS[0].text);
  const [saveToFeed, setSaveToFeed] = useState(true);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');

  const handleAnalyze = async (textToAnalyze = inputText) => {
    if (!textToAnalyze.trim()) return;
    setLoading(true);
    setNotification('');

    try {
      const res = await fetch('/api/analyze-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToAnalyze,
          save_to_feed: saveToFeed,
        }),
      });
      const data = await res.json();
      setResult(data);
      if (saveToFeed) {
        setNotification('✓ Successfully analyzed & injected into Live Risk Feed!');
        setTimeout(() => setNotification(''), 4000);
      }
    } catch (err) {
      console.error('Failed to analyze text:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (presetText) => {
    setInputText(presetText);
    handleAnalyze(presetText);
  };

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.12) 0%, rgba(99, 102, 241, 0.1) 100%)',
          border: '1px solid rgba(34, 211, 238, 0.3)',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: 'var(--accent-cyan)', background: 'rgba(34, 211, 238, 0.15)', padding: '4px 10px', borderRadius: '4px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          <span>🔬</span> REAL-TIME JUDGES TESTBENCH
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 6px 0' }}>
          Live Financial Headline &amp; Sentence NLP Analyzer
        </h2>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '750px' }}>
          Type or paste any financial disclosure, breaking headline, or earnings excerpt. The NLP engine scores polarity, identifies lexical signals, predicts sector beta impact, and estimates portfolio volatility in real-time.
        </p>
      </div>

      {/* Preset Quick Selectors */}
      <div>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
          Quick Benchmark Presets (Click to test instantly):
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              className="btn btn-secondary"
              style={{ fontSize: '12px', padding: '6px 12px' }}
              onClick={() => handleSelectPreset(p.text)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form Card */}
      <div className="glass-card">
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
          Input Financial Text / News Wire / Headline:
        </label>
        <textarea
          rows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter financial sentence or news wire headline..."
          style={{
            width: '100%',
            padding: '14px 16px',
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontSize: '15px',
            fontFamily: 'var(--font-sans)',
            lineHeight: '1.5',
            outline: 'none',
            resize: 'vertical',
            marginBottom: '16px',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              id="feedSync"
              checked={saveToFeed}
              onChange={(e) => setSaveToFeed(e.target.checked)}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <label htmlFor="feedSync" style={{ fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              Automatically broadcast this detected signal into the <strong>Live Risk Events Feed</strong>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {notification && (
              <span style={{ fontSize: '12px', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                {notification}
              </span>
            )}
            <button
              className="btn btn-primary"
              onClick={() => handleAnalyze()}
              disabled={loading || !inputText.trim()}
              style={{ minWidth: '150px' }}
            >
              {loading ? 'Analyzing...' : '⚡ Run NLP Analysis'}
            </button>
          </div>
        </div>
      </div>

      {/* Results View */}
      {result && (
        <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top Result Cards */}
          <div className="stats-grid">
            {/* Sentiment Card - Positive/Negative/Neutral in BLUE font per user request */}
            <div className="stat-card indigo">
              <div className="stat-label">Detected Polarity</div>
              <div className="stat-value" style={{ color: '#38bdf8', textTransform: 'uppercase', fontSize: '26px' }}>
                {result.label}
              </div>
              <div className="stat-sub" style={{ color: '#60a5fa', fontWeight: 600 }}>
                Polarity Score: {result.score > 0 ? `+${result.score}` : result.score}
              </div>
            </div>

            <div className="stat-card cyan">
              <div className="stat-label">Model Confidence</div>
              <div className="stat-value" style={{ color: 'var(--accent-cyan)' }}>
                {(result.confidence * 100).toFixed(0)}%
              </div>
              <div className="stat-sub">Lexicon &amp; PhraseBank Aligned</div>
            </div>

            <div className={`stat-card ${result.risk_rating === 'CRITICAL' ? 'rose' : result.risk_rating === 'HIGH' ? 'amber' : 'emerald'}`}>
              <div className="stat-label">Systemic Risk Severity</div>
              <div className="stat-value" style={{ color: result.risk_rating === 'CRITICAL' ? 'var(--accent-rose)' : result.risk_rating === 'HIGH' ? 'var(--accent-amber)' : 'var(--accent-emerald)' }}>
                {result.risk_rating}
              </div>
              <div className="stat-sub">Estimated Shock: {result.market_shock_pct}</div>
            </div>

            <div className="stat-card emerald">
              <div className="stat-label">Correlated Sector Bias</div>
              <div className="stat-value" style={{ fontSize: '20px' }}>
                {result.sectors[0]?.name || 'Broad Market'}
              </div>
              <div className="stat-sub" style={{ color: '#60a5fa', fontWeight: 600 }}>
                Direction: {result.sectors[0]?.bias || 'Neutral'}
              </div>
            </div>
          </div>

          {/* Polarity Meter Bar */}
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
              <span style={{ color: 'var(--accent-rose)', fontWeight: 700 }}>← Extreme Bearish (-1.0)</span>
              <span style={{ color: '#60a5fa', fontWeight: 700 }}>Neutral (0.0)</span>
              <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>Extreme Bullish (+1.0) →</span>
            </div>
            <div style={{ width: '100%', height: '14px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '7px', position: 'relative', overflow: 'hidden' }}>
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: result.score >= 0 ? '50%' : `${50 + (result.score * 50)}%`,
                  width: `${Math.abs(result.score) * 50}%`,
                  background: result.score > 0 ? 'var(--gradient-success)' : result.score < 0 ? 'var(--gradient-danger)' : '#60a5fa',
                  borderRadius: '7px',
                  transition: 'all 0.4s ease',
                }}
              />
              {/* Zero Marker Line */}
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '2px', background: 'rgba(255, 255, 255, 0.3)' }} />
            </div>
          </div>

          {/* Keywords & Tactical Recommendation Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {/* Keywords Breakdown */}
            <div className="glass-card">
              <h3 style={{ margin: '0 0 14px 0', fontSize: '15px', fontWeight: 700 }}>
                🏷️ Lexical Keyword Feature Extractions
              </h3>

              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-emerald)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  Positive / Growth Signals:
                </span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {result.positive_keywords.length > 0 ? (
                    result.positive_keywords.map((kw, i) => (
                      <span key={i} className="badge positive" style={{ fontSize: '11px' }}>
                        +{kw}
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>None detected</span>
                  )}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-rose)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  Negative / Risk Signals:
                </span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {result.negative_keywords.length > 0 ? (
                    result.negative_keywords.map((kw, i) => (
                      <span key={i} className="badge negative" style={{ fontSize: '11px' }}>
                        -{kw}
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>None detected</span>
                  )}
                </div>
              </div>
            </div>

            {/* Tactical AI Risk Advisory */}
            <div className="glass-card">
              <h3 style={{ margin: '0 0 14px 0', fontSize: '15px', fontWeight: 700 }}>
                💡 Automated Tactical Risk Advisory
              </h3>
              <div
                style={{
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(99, 102, 241, 0.12)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  color: 'var(--text-primary)',
                  marginBottom: '14px',
                }}
              >
                {result.recommendation}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                <span>Cross-asset impact: <strong>{result.market_shock_pct}</strong></span>
                <span style={{ color: 'var(--accent-cyan)' }}>S&amp;P Global &amp; CRISIL AI Engine</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
