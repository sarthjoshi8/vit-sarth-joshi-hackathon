import React, { useState, useEffect } from 'react';

const ALL_COMPANIES = {
  AAPL: { name: 'Apple Inc.', sector: 'Technology', category: 'Tech', arScore: 84, exposure: '$35,000', sentiment: 'Bullish (+0.42)', recessionImpact: '-28.5%', var95: '$4,120', anomalyProb: '3.2%', rating: 'AAA', hedgeRec: 'Hedge delta via put spreads; maintain long cash buffer.' },
  MSFT: { name: 'Microsoft Corp.', sector: 'Technology', category: 'Tech', arScore: 88, exposure: '$25,000', sentiment: 'Bullish (+0.56)', recessionImpact: '-24.0%', var95: '$2,850', anomalyProb: '1.8%', rating: 'AAA', hedgeRec: 'Low tail beta; excellent enterprise cloud cash flow resiliency.' },
  NVDA: { name: 'NVIDIA Corp.', sector: 'Semiconductors', category: 'Tech', arScore: 92, exposure: '$15,000', sentiment: 'Extremely Bullish (+0.81)', recessionImpact: '-38.0%', var95: '$3,250', anomalyProb: '7.4%', rating: 'AA+', hedgeRec: 'Collar hedge recommended against semiconductor supply cycle shocks.' },
  GOOGL: { name: 'Alphabet Inc.', sector: 'Technology', category: 'Tech', arScore: 86, exposure: '$22,000', sentiment: 'Bullish (+0.49)', recessionImpact: '-26.2%', var95: '$3,100', anomalyProb: '2.5%', rating: 'AAA', hedgeRec: 'Diversified cloud revenue acts as strong downside shock absorber.' },
  AMZN: { name: 'Amazon.com Inc.', sector: 'Consumer/Cloud', category: 'Tech', arScore: 79, exposure: '$18,000', sentiment: 'Moderate (+0.31)', recessionImpact: '-32.0%', var95: '$3,400', anomalyProb: '4.6%', rating: 'AA', hedgeRec: 'AWS margins buffer retail margin compression during downturns.' },
  META: { name: 'Meta Platforms', sector: 'Technology', category: 'Tech', arScore: 82, exposure: '$16,000', sentiment: 'Bullish (+0.45)', recessionImpact: '-30.5%', var95: '$3,300', anomalyProb: '3.9%', rating: 'AA', hedgeRec: 'Ad spend cyclicality requires dynamic trailing stop collars.' },
  TSLA: { name: 'Tesla Inc.', sector: 'Automotive/AI', category: 'Tech', arScore: 59, exposure: '$10,000', sentiment: 'Volatile (-0.22)', recessionImpact: '-42.0%', var95: '$2,600', anomalyProb: '12.8%', rating: 'BBB', hedgeRec: 'High beta tail risk; recommend dynamic delta-hedging collars.' },
  JPM: { name: 'JPMorgan Chase & Co.', sector: 'Financials', category: 'Finance', arScore: 68, exposure: '$20,000', sentiment: 'Neutral (-0.08)', recessionImpact: '-35.0%', var95: '$3,900', anomalyProb: '5.1%', rating: 'A+', hedgeRec: 'Net interest margin sensitivity; macro yield curve flattening risk.' },
  BAC: { name: 'Bank of America', sector: 'Financials', category: 'Finance', arScore: 65, exposure: '$14,000', sentiment: 'Cautious (-0.12)', recessionImpact: '-36.5%', var95: '$3,150', anomalyProb: '6.2%', rating: 'A', hedgeRec: 'Deposit beta monitoring recommended; hedge loan loss provisions.' },
  XOM: { name: 'ExxonMobil Corp.', sector: 'Energy', category: 'Energy', arScore: 71, exposure: '$12,000', sentiment: 'Neutral (+0.14)', recessionImpact: '-22.0%', var95: '$2,450', anomalyProb: '4.8%', rating: 'AA-', hedgeRec: 'Crude price inverse correlation provides natural inflation protection.' },
  CVX: { name: 'Chevron Corp.', sector: 'Energy', category: 'Energy', arScore: 73, exposure: '$11,000', sentiment: 'Neutral (+0.18)', recessionImpact: '-21.5%', var95: '$2,300', anomalyProb: '4.1%', rating: 'AA-', hedgeRec: 'High dividend coverage mitigates energy cycle drawdowns.' },
  JNJ: { name: 'Johnson & Johnson', sector: 'Healthcare', category: 'Healthcare', arScore: 89, exposure: '$15,000', sentiment: 'Defensive (+0.25)', recessionImpact: '-12.0%', var95: '$1,650', anomalyProb: '1.4%', rating: 'AAA', hedgeRec: 'Top-tier recession-proof defensive asset with minimal systemic beta.' },
  UNH: { name: 'UnitedHealth Group', sector: 'Healthcare', category: 'Healthcare', arScore: 85, exposure: '$13,000', sentiment: 'Stable (+0.30)', recessionImpact: '-14.5%', var95: '$1,800', anomalyProb: '2.1%', rating: 'AA+', hedgeRec: 'Predictable recurring medical cash flows significantly reduce portfolio VaR.' },
  PG: { name: 'Procter & Gamble', sector: 'Consumer Staples', category: 'Defensive', arScore: 91, exposure: '$14,000', sentiment: 'Resilient (+0.28)', recessionImpact: '-10.5%', var95: '$1,400', anomalyProb: '1.2%', rating: 'AAA', hedgeRec: 'Essential consumer goods pricing power cushions stagflationary shocks.' },
  NEE: { name: 'NextEra Energy', sector: 'Utilities', category: 'Defensive', arScore: 94, exposure: '$12,000', sentiment: 'Very Strong (+0.38)', recessionImpact: '-8.0%', var95: '$1,100', anomalyProb: '0.9%', rating: 'AAA', hedgeRec: 'Regulated utility infrastructure delivers ideal minimum-variance stability.' }
};

export default function ARLensModal({ isOpen, onClose, portfolio }) {
  const [scanning, setScanning] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState('AAPL');
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [arData, setArData] = useState(ALL_COMPANIES['AAPL']);

  useEffect(() => {
    if (isOpen) {
      setScanning(true);
      const timer = setTimeout(() => {
        setScanning(false);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isOpen, selectedAsset]);

  const handleSelect = (ticker) => {
    setSelectedAsset(ticker);
    if (ALL_COMPANIES[ticker]) {
      setArData(ALL_COMPANIES[ticker]);
    }
  };

  if (!isOpen) return null;

  const getScoreColor = (score) => {
    if (score >= 85) return 'var(--accent-emerald)';
    if (score >= 70) return 'var(--accent-cyan)';
    if (score >= 60) return 'var(--accent-amber)';
    return 'var(--accent-rose)';
  };

  const filteredTickers = Object.keys(ALL_COMPANIES).filter((ticker) => {
    if (sectorFilter === 'ALL') return true;
    return ALL_COMPANIES[ticker].category === sectorFilter;
  });

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 16, 0.94)',
        backdropFilter: 'blur(20px)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      {/* AR HUD Frame */}
      <div
        style={{
          width: '100%',
          maxWidth: '1040px',
          height: '740px',
          maxHeight: '94vh',
          position: 'relative',
          borderRadius: 'var(--radius-xl)',
          border: '2px solid rgba(34, 211, 238, 0.4)',
          boxShadow: '0 0 50px rgba(34, 211, 238, 0.25), inset 0 0 40px rgba(99, 102, 241, 0.12)',
          background: 'radial-gradient(circle at center, rgba(15, 23, 42, 0.7) 0%, rgba(6, 10, 18, 0.97) 100%)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* AR Scan Line Animation */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #22d3ee, #6366f1, transparent)',
            boxShadow: '0 0 15px #22d3ee',
            animation: 'arScan 3s linear infinite',
            pointerEvents: 'none',
            zIndex: 5,
          }}
        />

        <style>{`
          @keyframes arScan {
            0% { top: 0%; opacity: 0; }
            15% { opacity: 1; }
            85% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
          }
          @keyframes targetPulse {
            0%, 100% { transform: scale(1); opacity: 0.85; }
            50% { transform: scale(1.06); opacity: 1; }
          }
        `}</style>

        {/* 1. TOP HUD BAR */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 20px',
            borderBottom: '1px solid rgba(34, 211, 238, 0.2)',
            background: 'rgba(10, 16, 30, 0.65)',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>👓</span>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '1px', color: 'var(--accent-cyan)' }}>
                FINRISK AR SPATIAL LENS v2.4
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                LATENCY: 8ms • WEBRTC HOLOGRAPHIC TENSOR • S&amp;P GLOBAL CRISIL INNOVATION LAB
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                padding: '4px 10px',
                borderRadius: '4px',
                background: scanning ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                color: scanning ? 'var(--accent-amber)' : 'var(--accent-emerald)',
                border: `1px solid ${scanning ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`
              }}
            >
              {scanning ? '◉ SCANNING ASSET FIELD...' : `● ANCHORED: ${selectedAsset}`}
            </span>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(244, 63, 94, 0.2)',
                border: '1px solid rgba(244, 63, 94, 0.4)',
                color: '#f43f5e',
                borderRadius: '6px',
                padding: '5px 12px',
                fontSize: '11px',
                cursor: 'pointer',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
              }}
            >
              ✕ EXIT AR
            </button>
          </div>
        </div>

        {/* 2. HEADER: ALL COMPANIES AR SCORE SELECTOR RIBBON */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.75)',
            borderBottom: '1px solid rgba(34, 211, 238, 0.15)',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            ⚡ AR ASSETS:
          </span>
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            {Object.keys(ALL_COMPANIES).map((ticker) => {
              const comp = ALL_COMPANIES[ticker];
              const isSelected = selectedAsset === ticker;
              const scoreColor = getScoreColor(comp.arScore);
              return (
                <button
                  key={`head-${ticker}`}
                  onClick={() => handleSelect(ticker)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    background: isSelected ? 'rgba(34, 211, 238, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-glass)',
                    color: isSelected ? '#fff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '11px',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 0 12px rgba(34, 211, 238, 0.3)' : 'none',
                  }}
                  title={`${comp.name} - AR Score: ${comp.arScore}/100`}
                >
                  <span style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', color: isSelected ? 'var(--accent-cyan)' : 'var(--text-primary)' }}>
                    {ticker}
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                      background: 'rgba(0, 0, 0, 0.4)',
                      padding: '1px 5px',
                      borderRadius: '3px',
                      color: scoreColor,
                    }}
                  >
                    AR {comp.arScore}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. CENTER VIEWPORT: RETICLE & TELEMETRY */}
        <div style={{ flex: 1, position: 'relative', display: 'flex', padding: '16px 20px', gap: '16px', overflow: 'hidden' }}>
          {/* Hologram Reticle in Center */}
          <div
            style={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px dashed rgba(34, 211, 238, 0.25)',
              borderRadius: 'var(--radius-lg)',
              background: 'radial-gradient(circle at center, rgba(34, 211, 238, 0.04) 0%, transparent 70%)',
            }}
          >
            {/* Corner Markers */}
            <div style={{ position: 'absolute', top: '12px', left: '12px', width: '18px', height: '18px', borderTop: '2px solid #22d3ee', borderLeft: '2px solid #22d3ee' }} />
            <div style={{ position: 'absolute', top: '12px', right: '12px', width: '18px', height: '18px', borderTop: '2px solid #22d3ee', borderRight: '2px solid #22d3ee' }} />
            <div style={{ position: 'absolute', bottom: '12px', left: '12px', width: '18px', height: '18px', borderBottom: '2px solid #22d3ee', borderLeft: '2px solid #22d3ee' }} />
            <div style={{ position: 'absolute', bottom: '12px', right: '12px', width: '18px', height: '18px', borderBottom: '2px solid #22d3ee', borderRight: '2px solid #22d3ee' }} />

            {/* Glowing Hologram Reticle */}
            <div
              style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                border: '2px dashed rgba(34, 211, 238, 0.65)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                animation: 'targetPulse 2s ease-in-out infinite',
                boxShadow: '0 0 35px rgba(34, 211, 238, 0.2)',
              }}
            >
              <div
                style={{
                  width: '136px',
                  height: '136px',
                  borderRadius: '50%',
                  border: '1px solid rgba(99, 102, 241, 0.7)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(99, 102, 241, 0.1)',
                }}
              >
                <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                  {selectedAsset}
                </div>
                <div style={{ fontSize: '11px', color: getScoreColor(arData.arScore), fontWeight: 800, fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                  AR SCORE: {arData.arScore}/100
                </div>
                <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>
                  RATING: {arData.rating}
                </div>
              </div>
            </div>

            {/* Target Label */}
            <div style={{ marginTop: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>
                {arData.name}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                {arData.sector} • {arData.sentiment}
              </div>
            </div>
          </div>

          {/* Right Holographic Telemetry Panel */}
          <div
            style={{
              width: '330px',
              background: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(12px)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(34, 211, 238, 0.25)',
              padding: '16px 18px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '10px', color: 'var(--accent-cyan)', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                  SPATIAL ASSET DIAGNOSTIC
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    color: getScoreColor(arData.arScore),
                    background: 'rgba(0, 0, 0, 0.35)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: `1px solid ${getScoreColor(arData.arScore)}`,
                  }}
                >
                  AR: {arData.arScore}/100
                </span>
              </div>

              <h3 style={{ fontSize: '17px', fontWeight: 800, margin: '0 0 10px 0' }}>
                {arData.name}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Sector / Asset Class</span>
                  <strong>{arData.sector}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Estimated Exposure</span>
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>{arData.exposure}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>NLP Sentiment</span>
                  <strong style={{ color: 'var(--accent-emerald)' }}>{arData.sentiment}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Recession Shock Impact</span>
                  <strong style={{ color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)' }}>{arData.recessionImpact}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>1-Mo 95% Parametric VaR</span>
                  <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)' }}>{arData.var95}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Anomaly Probability</span>
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>{arData.anomalyProb}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Resilience Rating</span>
                  <span className="badge high" style={{ fontSize: '10px' }}>{arData.rating}</span>
                </div>
              </div>
            </div>

            {/* Recommendation HUD Chip */}
            <div
              style={{
                marginTop: '12px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                fontSize: '11px',
                lineHeight: '1.4',
              }}
            >
              <div style={{ fontWeight: 800, color: 'var(--accent-indigo)', marginBottom: '3px' }}>
                💡 SPATIAL HEDGE DIRECTIVE:
              </div>
              {arData.hedgeRec}
            </div>
          </div>
        </div>

        {/* 4. FOOTER: COMPANY SELECTOR DOCK & SECTOR FILTERS */}
        <div
          style={{
            background: 'rgba(10, 16, 30, 0.9)',
            borderTop: '1px solid rgba(34, 211, 238, 0.25)',
            padding: '10px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            flexShrink: 0,
          }}
        >
          {/* Sector Filter Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                SECTOR FILTER:
              </span>
              {['ALL', 'Tech', 'Finance', 'Energy', 'Healthcare', 'Defensive'].map((sec) => (
                <button
                  key={sec}
                  onClick={() => setSectorFilter(sec)}
                  style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    cursor: 'pointer',
                    background: sectorFilter === sec ? 'var(--accent-indigo)' : 'rgba(255, 255, 255, 0.05)',
                    color: sectorFilter === sec ? '#fff' : 'var(--text-secondary)',
                    border: '1px solid transparent',
                  }}
                >
                  {sec.toUpperCase()}
                </button>
              ))}
            </div>

            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
              TARGET: <strong style={{ color: '#fff' }}>{selectedAsset}</strong> • AR SCORE: <strong style={{ color: getScoreColor(arData.arScore) }}>{arData.arScore}/100</strong>
            </div>
          </div>

          {/* Footer Company Buttons Strip */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
            {filteredTickers.map((ticker) => {
              const comp = ALL_COMPANIES[ticker];
              const isSelected = selectedAsset === ticker;
              const scoreColor = getScoreColor(comp.arScore);
              return (
                <button
                  key={`foot-${ticker}`}
                  onClick={() => handleSelect(ticker)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    background: isSelected ? 'var(--gradient-primary)' : 'rgba(255, 255, 255, 0.04)',
                    color: isSelected ? '#05080e' : 'var(--text-primary)',
                    border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-glass)',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>{ticker}</span>
                  <span
                    style={{
                      fontSize: '10px',
                      padding: '1px 4px',
                      borderRadius: '3px',
                      background: isSelected ? '#05080e' : 'rgba(0, 0, 0, 0.4)',
                      color: isSelected ? '#fff' : scoreColor,
                    }}
                  >
                    {comp.arScore}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. BOTTOM STATUS TICKER */}
        <div
          style={{
            padding: '6px 20px',
            background: 'rgba(5, 8, 16, 0.95)',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '10px',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            flexShrink: 0,
          }}
        >
          <span>WebXR SPATIAL ENGINE: 60 FPS • HOLOGRAPHIC MESH ANCHORED</span>
          <span style={{ color: 'var(--accent-cyan)' }}>S&amp;P GLOBAL CRISIL INNOVATION LABS</span>
          <span>COMPANIES LOADED: 15 / 15</span>
        </div>
      </div>
    </div>
  );
}
