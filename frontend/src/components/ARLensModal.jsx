import React, { useState, useEffect } from 'react';

export default function ARLensModal({ isOpen, onClose, portfolio }) {
  const [scanning, setScanning] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState('AAPL');
  const [arData, setArData] = useState({
    name: 'Apple Inc.',
    ticker: 'AAPL',
    sector: 'Technology',
    arScore: 84,
    exposure: '$35,000',
    sentiment: 'Bullish (+0.42)',
    recessionImpact: '-28.5%',
    var95: '$4,120',
    anomalyProb: '3.2%',
    arStatus: 'SPATIAL TARGET LOCKED'
  });

  const assetDetails = {
    AAPL: { name: 'Apple Inc.', sector: 'Technology', arScore: 84, exposure: '$35,000', sentiment: 'Bullish (+0.42)', recessionImpact: '-28.5%', var95: '$4,120', anomalyProb: '3.2%' },
    MSFT: { name: 'Microsoft Corp.', sector: 'Technology', arScore: 88, exposure: '$25,000', sentiment: 'Bullish (+0.56)', recessionImpact: '-24.0%', var95: '$2,850', anomalyProb: '1.8%' },
    JPM: { name: 'JPMorgan Chase', sector: 'Financials', arScore: 68, exposure: '$20,000', sentiment: 'Neutral (-0.08)', recessionImpact: '-35.0%', var95: '$3,900', anomalyProb: '5.1%' },
    NVDA: { name: 'NVIDIA Corp.', sector: 'Semiconductors', arScore: 92, exposure: '$15,000', sentiment: 'Extremely Bullish (+0.81)', recessionImpact: '-38.0%', var95: '$3,250', anomalyProb: '7.4%' },
    TSLA: { name: 'Tesla Inc.', sector: 'Automotive/Tech', arScore: 59, exposure: '$10,000', sentiment: 'Volatile (-0.22)', recessionImpact: '-42.0%', var95: '$2,600', anomalyProb: '12.8%' }
  };

  useEffect(() => {
    if (isOpen) {
      setScanning(true);
      const timer = setTimeout(() => {
        setScanning(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, selectedAsset]);

  const handleSelect = (ticker) => {
    setSelectedAsset(ticker);
    if (assetDetails[ticker]) {
      setArData({
        ...assetDetails[ticker],
        ticker,
        arStatus: 'CALCULATING SPATIAL TENSOR'
      });
    }
  };

  if (!isOpen) return null;

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
        padding: '20px',
      }}
    >
      {/* AR HUD Frame */}
      <div
        style={{
          width: '100%',
          maxWidth: '920px',
          height: '620px',
          position: 'relative',
          borderRadius: 'var(--radius-xl)',
          border: '2px solid rgba(34, 211, 238, 0.4)',
          boxShadow: '0 0 40px rgba(34, 211, 238, 0.2), inset 0 0 40px rgba(99, 102, 241, 0.1)',
          background: 'radial-gradient(circle at center, rgba(15, 23, 42, 0.6) 0%, rgba(6, 10, 18, 0.95) 100%)',
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
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.08); opacity: 1; }
          }
        `}</style>

        {/* Top HUD Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 24px',
            borderBottom: '1px solid rgba(34, 211, 238, 0.2)',
            background: 'rgba(10, 16, 30, 0.5)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>👓</span>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '1px', color: 'var(--accent-cyan)' }}>
                FINRISK AR SPATIAL LENS v2.4
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                LATENCY: 12ms | TARGETING: HOLOGRAPHIC HEDGE TENSOR | WEBRTC SYNCED
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
              {scanning ? '◉ SCANNING ASSET FIELD...' : '● ASSET ANCHORED'}
            </span>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(244, 63, 94, 0.2)',
                border: '1px solid rgba(244, 63, 94, 0.4)',
                color: '#f43f5e',
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              ✕ EXIT AR
            </button>
          </div>
        </div>

        {/* HUD Viewport Content */}
        <div style={{ flex: 1, position: 'relative', display: 'flex', padding: '24px', gap: '24px' }}>
          {/* Target Reticle in Center */}
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
            }}
          >
            {/* Corner Markers */}
            <div style={{ position: 'absolute', top: '12px', left: '12px', width: '20px', height: '20px', borderTop: '2px solid #22d3ee', borderLeft: '2px solid #22d3ee' }} />
            <div style={{ position: 'absolute', top: '12px', right: '12px', width: '20px', height: '20px', borderTop: '2px solid #22d3ee', borderRight: '2px solid #22d3ee' }} />
            <div style={{ position: 'absolute', bottom: '12px', left: '12px', width: '20px', height: '20px', borderBottom: '2px solid #22d3ee', borderLeft: '2px solid #22d3ee' }} />
            <div style={{ position: 'absolute', bottom: '12px', right: '12px', width: '20px', height: '20px', borderBottom: '2px solid #22d3ee', borderRight: '2px solid #22d3ee' }} />

            {/* Glowing Hologram Reticle */}
            <div
              style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                border: '2px dashed rgba(34, 211, 238, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                animation: 'targetPulse 2s ease-in-out infinite',
                boxShadow: '0 0 30px rgba(34, 211, 238, 0.15)',
              }}
            >
              <div
                style={{
                  width: '140px',
                  height: '140px',
                  borderRadius: '50%',
                  border: '1px solid rgba(99, 102, 241, 0.6)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(99, 102, 241, 0.08)',
                }}
              >
                <div style={{ fontSize: '30px', fontWeight: 900, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                  {arData.ticker}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  AI RISK: {arData.arScore}/100
                </div>
              </div>
            </div>

            {/* Asset Selector Buttons */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '24px', zIndex: 10 }}>
              {Object.keys(assetDetails).map((ticker) => (
                <button
                  key={ticker}
                  onClick={() => handleSelect(ticker)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    cursor: 'pointer',
                    fontWeight: 700,
                    background: selectedAsset === ticker ? 'var(--gradient-primary)' : 'rgba(255, 255, 255, 0.05)',
                    color: selectedAsset === ticker ? '#fff' : 'var(--text-secondary)',
                    border: selectedAsset === ticker ? '1px solid var(--accent-indigo)' : '1px solid var(--border-glass)',
                  }}
                >
                  {ticker}
                </button>
              ))}
            </div>
          </div>

          {/* Right Holographic Telemetry Panel */}
          <div
            style={{
              width: '320px',
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(12px)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(34, 211, 238, 0.25)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
                SPATIAL ASSET DIAGNOSTIC
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 12px 0' }}>
                {arData.name}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Sector</span>
                  <strong>{arData.sector}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Current Exposure</span>
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>{arData.exposure}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>NLP Sentiment</span>
                  <strong style={{ color: 'var(--accent-emerald)' }}>{arData.sentiment}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Recession Shock</span>
                  <strong style={{ color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)' }}>{arData.recessionImpact}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>95% Monthly VaR</span>
                  <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)' }}>{arData.var95}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Txn Anomaly Prob.</span>
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>{arData.anomalyProb}</strong>
                </div>
              </div>
            </div>

            {/* Recommendation HUD Chip */}
            <div
              style={{
                marginTop: '16px',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                fontSize: '12px',
                lineHeight: '1.4',
              }}
            >
              <div style={{ fontWeight: 700, color: 'var(--accent-indigo)', marginBottom: '4px' }}>
                💡 HEDGE RECOMMENDATION:
              </div>
              Tail-risk options hedge advised against macro recession downshift. Volatility sensitivity exceeds peer median.
            </div>
          </div>
        </div>

        {/* Bottom Status Ticker */}
        <div
          style={{
            padding: '10px 24px',
            background: 'rgba(5, 8, 16, 0.8)',
            borderTop: '1px solid rgba(34, 211, 238, 0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <span>AR ENGINE: WebXR Holographic Mesh Ready</span>
          <span style={{ color: 'var(--accent-cyan)' }}>S&amp;P GLOBAL CRISIL INNOVATION LABS</span>
          <span>FPS: 60.0 | RESOLUTION: ADAPTIVE</span>
        </div>
      </div>
    </div>
  );
}
