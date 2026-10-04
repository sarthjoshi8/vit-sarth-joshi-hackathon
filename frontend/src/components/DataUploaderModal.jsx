import React, { useState } from 'react';

export default function DataUploaderModal({ isOpen, onClose, onApplyPortfolio }) {
  const [dragActive, setDragActive] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [dataType, setDataType] = useState('portfolio'); // 'portfolio' | 'transactions'
  const [fileName, setFileName] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const parseCSV = (content) => {
    const lines = content.trim().split(/\r\n|\n/);
    if (lines.length < 2) {
      setStatusMessage('CSV must contain a header and at least one data row.');
      return;
    }

    const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const values = lines[i].split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
      const obj = {};
      headers.forEach((h, idx) => {
        obj[h] = values[idx] || '';
      });
      rows.push(obj);
    }

    setParsedData({ headers, rows });
    setStatusMessage(`✓ Successfully parsed ${rows.length} rows from CSV!`);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => parseCSV(event.target.result);
      reader.readAsText(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => parseCSV(event.target.result);
      reader.readAsText(file);
    }
  };

  const handleLoadSample = () => {
    const sampleCSV = `Ticker,Value,Sector\nNVDA,65000,Semiconductors\nMSFT,45000,Technology\nJPM,35000,Financials\nLLY,30000,Healthcare\nXOM,25000,Energy\nCOST,20000,Consumer Goods`;
    setFileName('sample_institutional_portfolio.csv');
    parseCSV(sampleCSV);
  };

  const handleApply = () => {
    if (!parsedData || parsedData.rows.length === 0) return;

    if (dataType === 'portfolio') {
      const formatted = parsedData.rows.map((r) => {
        const stock = r.Ticker || r.stock || r.Symbol || 'UNKNOWN';
        const value = parseFloat(r.Value || r.value || r.Amount || 10000) || 10000;
        const sector = r.Sector || r.sector || 'General';
        return { stock, value, sector, weight: 0 };
      });

      const totalVal = formatted.reduce((acc, cur) => acc + cur.value, 0);
      const withWeights = formatted.map((p) => ({ ...p, weight: p.value / totalVal }));

      if (onApplyPortfolio) {
        onApplyPortfolio(withWeights);
      }
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 16, 0.88)',
        backdropFilter: 'blur(16px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        className="glass-card animate-in"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid var(--border-glow)',
          boxShadow: 'var(--shadow-glow)',
          padding: '28px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
              📂 Custom Financial CSV Ingestion
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
              Upload your proprietary portfolio allocation or transactional surveillance logs
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '20px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        {/* Type Selector & Sample Load */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`btn ${dataType === 'portfolio' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '11px', padding: '6px 12px' }}
              onClick={() => { setDataType('portfolio'); setParsedData(null); }}
            >
              Portfolio Allocation CSV
            </button>
            <button
              className={`btn ${dataType === 'transactions' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '11px', padding: '6px 12px' }}
              onClick={() => { setDataType('transactions'); setParsedData(null); }}
            >
              Transactions Surveillance CSV
            </button>
          </div>

          <button
            className="btn btn-secondary"
            style={{ fontSize: '11px', padding: '6px 12px', color: 'var(--accent-cyan)' }}
            onClick={handleLoadSample}
          >
            📋 Load Sample CSV
          </button>
        </div>

        {/* Drag and Drop Box */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${dragActive ? 'var(--accent-cyan)' : 'var(--border-glass)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '32px 20px',
            textAlign: 'center',
            background: dragActive ? 'rgba(0, 242, 254, 0.05)' : 'var(--bg-glass)',
            cursor: 'pointer',
            marginBottom: '16px',
            transition: 'all 0.2s ease',
          }}
          onClick={() => document.getElementById('csvFileInput').click()}
        >
          <input
            id="csvFileInput"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📁</div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
            {fileName ? fileName : 'Drag & drop your CSV here, or click to browse'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Accepts CSV format (e.g., Ticker, Value, Sector)
          </div>
        </div>

        {statusMessage && (
          <div
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: statusMessage.startsWith('✓') ? 'var(--accent-emerald)' : 'var(--accent-rose)',
              marginBottom: '12px',
            }}
          >
            {statusMessage}
          </div>
        )}

        {/* Preview Table */}
        {parsedData && (
          <div style={{ flex: 1, overflowY: 'auto', maxHeight: '180px', marginBottom: '16px', border: '1px solid var(--border-glass)', borderRadius: '6px' }}>
            <table className="data-table" style={{ fontSize: '12px' }}>
              <thead>
                <tr>
                  {parsedData.headers.map((h, i) => (
                    <th key={i}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parsedData.rows.slice(0, 6).map((row, idx) => (
                  <tr key={idx}>
                    {parsedData.headers.map((h, i) => (
                      <td key={i}>{row[h]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            disabled={!parsedData}
            onClick={handleApply}
          >
            ⚡ Load into Stress Testing Model
          </button>
        </div>
      </div>
    </div>
  );
}
