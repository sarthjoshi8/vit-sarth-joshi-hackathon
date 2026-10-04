import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import StressTesting from './components/StressTesting';
import Globe3D from './components/Globe3D';
import TransactionsView from './components/TransactionsView';
import NLPFeed from './components/NLPFeed';
import LiveAnalyzer from './components/LiveAnalyzer';
import ARLensModal from './components/ARLensModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'stress' | 'globe' | 'transactions' | 'nlp' | 'analyzer'
  const [isArOpen, setIsArOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">⚡</div>
          <div>
            <h1>FINRISK AI</h1>
            <span>Risk Intelligence</span>
          </div>
        </div>

        <div className="nav-section">
          <div className="nav-section-title">Core Modules</div>

          <div
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="nav-icon">📊</span>
            <span>Risk Dashboard</span>
          </div>

          <div
            className={`nav-item ${activeTab === 'stress' ? 'active' : ''}`}
            onClick={() => setActiveTab('stress')}
            style={{
              position: 'relative',
            }}
          >
            <span className="nav-icon">⚡</span>
            <span>Stress Testing (B)</span>
            <span
              style={{
                marginLeft: 'auto',
                fontSize: '9px',
                fontWeight: 800,
                background: 'var(--accent-indigo)',
                color: '#fff',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              MOD B
            </span>
          </div>

          <div
            className={`nav-item ${activeTab === 'globe' ? 'active' : ''}`}
            onClick={() => setActiveTab('globe')}
          >
            <span className="nav-icon">🌐</span>
            <span>3D Risk Globe</span>
          </div>
        </div>

        <div className="nav-section">
          <div className="nav-section-title">Surveillance &amp; NLP</div>

          <div
            className={`nav-item ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            <span className="nav-icon">💳</span>
            <span>Anomaly Detector</span>
          </div>

          <div
            className={`nav-item ${activeTab === 'nlp' ? 'active' : ''}`}
            onClick={() => setActiveTab('nlp')}
          >
            <span className="nav-icon">📰</span>
            <span>NLP Sentiment Feed</span>
          </div>

          <div
            className={`nav-item ${activeTab === 'analyzer' ? 'active' : ''}`}
            onClick={() => setActiveTab('analyzer')}
            style={{ position: 'relative' }}
          >
            <span className="nav-icon">🔬</span>
            <span>Live NLP Analyzer</span>
            <span
              style={{
                marginLeft: 'auto',
                fontSize: '9px',
                fontWeight: 800,
                background: 'var(--accent-cyan)',
                color: '#0a0e1a',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              INPUT
            </span>
          </div>
        </div>

        {/* Bottom AR Launcher in Sidebar */}
        <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-glass)' }}>
          <button
            onClick={() => setIsArOpen(true)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
              border: '1px solid rgba(34, 211, 238, 0.4)',
              color: 'var(--accent-cyan)',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '13px',
              transition: 'all 0.2s ease',
              boxShadow: '0 0 15px rgba(34, 211, 238, 0.1)',
            }}
          >
            <span>👓</span> Launch AR Risk Lens
          </button>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '8px' }}>
            WebXR Spatial Hologram View
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Top Header Bar */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '28px',
            paddingBottom: '20px',
            borderBottom: '1px solid var(--border-glass)',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-indigo)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                S&amp;P GLOBAL &amp; CRISIL CAMPUS HACKATHON 2026
              </span>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--text-muted)' }}></span>
              <span style={{ fontSize: '11px', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-emerald)' }}></span>
                BACKEND CONNECTED
              </span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>
              {activeTab === 'dashboard' && 'Executive Risk Intelligence Overview'}
              {activeTab === 'stress' && 'Module B: Strategic Portfolio Stress Testing'}
              {activeTab === 'globe' && '3D Geospatial Financial Risk Corridor'}
              {activeTab === 'transactions' && 'Fraud & Transaction Anomaly Surveillance'}
              {activeTab === 'nlp' && 'NLP Sentiment & Financial Intelligence Feed'}
              {activeTab === 'analyzer' && 'Live Financial Headline & NLP Sentence Analyzer'}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              className="btn btn-primary"
              onClick={() => setIsArOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #22d3ee 0%, #6366f1 100%)',
                color: '#fff',
                boxShadow: '0 4px 15px rgba(34, 211, 238, 0.3)',
              }}
            >
              👓 Launch AR Mode
            </button>
          </div>
        </header>

        {/* View Routing */}
        {activeTab === 'dashboard' && (
          <Dashboard onNavigateToStress={() => setActiveTab('stress')} />
        )}
        {activeTab === 'stress' && <StressTesting />}
        {activeTab === 'globe' && <Globe3D />}
        {activeTab === 'transactions' && <TransactionsView />}
        {activeTab === 'nlp' && <NLPFeed />}
        {activeTab === 'analyzer' && <LiveAnalyzer />}

        {/* AR Modal */}
        <ARLensModal isOpen={isArOpen} onClose={() => setIsArOpen(false)} />
      </main>
    </div>
  );
}
