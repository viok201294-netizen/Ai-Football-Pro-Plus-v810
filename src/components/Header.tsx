import React from 'react';
import { useAppContext } from '../context/AppContext';

export const Header: React.FC = () => {
  const { state, theme } = useAppContext();
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const getTrialTime = () => {
    if (!state.firstAnalysisTime) return null;
    const limit = 3 * 24 * 60 * 60 * 1000;
    const elapsed = Date.now() - state.firstAnalysisTime;
    const remaining = limit - elapsed;
    if (remaining <= 0) return 'Hết hạn';
    
    const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
    const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const mins = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    
    if (days > 0) return `${days} ngày ${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const trialText = getTrialTime();

  return (
    <div id="hdr" style={{
      position: 'sticky', top: 0, zIndex: 50, padding: 'clamp(10px, 2vh, 14px) clamp(14px, 4vw, 24px) clamp(8px, 1.5vh, 12px)',
      borderBottom: `1px solid ${theme.brd}`,
      background: theme.hg,
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      flexShrink: 0
    }}>
      <div style={{ position: 'absolute', top: '-55px', left: '50%', transform: 'translateX(-50%)', width: '260px', height: '120px', background: `radial-gradient(ellipse, ${theme.glow}, transparent 70%)`, pointerEvents: 'none' }}></div>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: theme.ac, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: "'Orbitron', monospace" }}>
            <span style={{ display: 'inline-block', animation: 'ballSpin 3s linear infinite' }}>⚽</span> Ai Football Analyser
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
            <div style={{ fontSize: '8px', color: theme.mut, letterSpacing: '2.5px', textTransform: 'uppercase' }}>
              BTTS · GAP · P_total · Safe Line
            </div>
            {trialText && (
              <div style={{ fontSize: '8px', color: trialText === 'Hết hạn' ? theme.rd : theme.gr, fontWeight: 700, background: trialText === 'Hết hạn' ? `${theme.rd}15` : `${theme.gr}15`, padding: '1px 6px', borderRadius: '4px', border: `1px solid ${trialText === 'Hết hạn' ? theme.rd : theme.gr}33` }}>
                ⏳ {trialText}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            <span style={{ background: theme.bg2, borderRadius: '20px', padding: '2px 9px', fontSize: '8px', fontWeight: 700, color: '#000' }}>v8.1</span>
            <span style={{ background: theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)', borderRadius: '20px', padding: '2px 8px', fontSize: '9px', color: theme.mut }}>
              {theme.br === 'auto' ? '🌓 Auto' : theme.isDark ? '🌙' : '☀️'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px' }}>{theme.e}</span>
            {state.ar && <span style={{ fontSize: '8px', color: theme.gr, letterSpacing: '1px' }}>● LIVE</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
