import React, { useState, useEffect } from 'react';

export default function AudioBriefingButton() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
    }
  }, []);

  const handleToggleAudio = () => {
    if (!isSupported) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();

    const text = `Good morning. This is the FINRISK AI automated risk briefing for S&P Global and Crisil. 
    Current portfolio equity is evaluated across 5 macro stress regimes. 
    Under our Global Recession scenario, projected capital drawdown is 32.5 percent, with a 95 percent monthly Value at Risk of 32,122 dollars. 
    Multi-source NLP sentiment across 5,800 headlines reflects elevated credit and regulatory risk. 
    91 banking transaction anomalies are currently isolated by our Z-score surveillance model. 
    Downside tail-risk options hedging is advised. System operational status is nominal.`;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    // Pick best English voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  if (!isSupported) return null;

  return (
    <button
      onClick={handleToggleAudio}
      className={`btn ${isPlaying ? 'btn-danger' : 'btn-secondary'}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 14px',
        fontSize: '12px',
        border: isPlaying ? '1px solid #ff3366' : '1px solid var(--border-glass)',
        boxShadow: isPlaying ? '0 0 15px rgba(255, 51, 102, 0.4)' : undefined,
      }}
      title="Play automated AI Risk Officer voice briefing"
    >
      <span>{isPlaying ? '⏹' : '🎙️'}</span>
      <span>{isPlaying ? 'Stop Briefing' : 'AI Audio Briefing'}</span>
      {isPlaying && (
        <span style={{ display: 'inline-flex', gap: '2px', alignItems: 'center' }}>
          <span className="wave-bar" style={{ animationDelay: '0s' }}></span>
          <span className="wave-bar" style={{ animationDelay: '0.2s' }}></span>
          <span className="wave-bar" style={{ animationDelay: '0.4s' }}></span>
        </span>
      )}

      <style>{`
        .wave-bar {
          width: 3px;
          height: 12px;
          background: #ff3366;
          border-radius: 2px;
          animation: wavePulse 0.8s ease-in-out infinite alternate;
        }
        @keyframes wavePulse {
          0% { height: 4px; }
          100% { height: 14px; }
        }
      `}</style>
    </button>
  );
}
