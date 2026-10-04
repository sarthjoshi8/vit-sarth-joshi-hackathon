import React from 'react';

const TICKERS = [
  { symbol: 'S&P 500', price: '5,751.24', change: '+0.42%', up: true },
  { symbol: 'NASDAQ', price: '18,137.85', change: '+0.81%', up: true },
  { symbol: 'DOW JONES', price: '42,352.75', change: '-0.15%', up: false },
  { symbol: 'VIX (VOLATILITY)', price: '18.42', change: '-3.15%', up: false },
  { symbol: 'FTSE 100', price: '8,280.63', change: '-0.02%', up: false },
  { symbol: 'DAX', price: '19,115.12', change: '+0.55%', up: true },
  { symbol: 'NIFTY 50', price: '25,014.60', change: '-0.24%', up: false },
  { symbol: 'NIKKEI 225', price: '38,651.97', change: '+1.53%', up: true },
  { symbol: 'HANG SENG', price: '22,736.87', change: '+2.82%', up: true },
  { symbol: 'US 10Y YIELD', price: '3.98%', change: '+0.04%', up: true },
  { symbol: 'BRENT CRUDE', price: '$78.05', change: '+1.45%', up: true },
  { symbol: 'GOLD (OZ)', price: '$2,653.40', change: '+0.60%', up: true },
  { symbol: 'SYSTEMIC VAR', price: '$32.1M', change: 'CRITICAL', isAlert: true }
];

export default function TickerTape() {
  return (
    <div
      style={{
        width: '100%',
        overflow: 'hidden',
        background: 'rgba(5, 8, 14, 0.95)',
        borderBottom: '1px solid var(--border-glass)',
        padding: '6px 0',
        position: 'relative',
        zIndex: 50,
      }}
    >
      <div className="ticker-track">
        {/* Double list for infinite loop marquee */}
        {[...TICKERS, ...TICKERS].map((item, idx) => (
          <div
            key={idx}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0 18px',
              fontSize: '11px',
              fontFamily: 'JetBrains Mono, monospace',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>
              {item.symbol}:
            </span>
            <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
              {item.price}
            </span>
            <span
              style={{
                fontWeight: 700,
                color: item.isAlert
                  ? 'var(--accent-rose)'
                  : item.up
                  ? 'var(--accent-emerald)'
                  : 'var(--accent-rose)',
              }}
            >
              {item.change}
            </span>
            <span style={{ color: 'var(--border-glass)' }}>|</span>
          </div>
        ))}
      </div>

      <style>{`
        .ticker-track {
          display: flex;
          width: max-content;
          animation: tickerScroll 40s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
