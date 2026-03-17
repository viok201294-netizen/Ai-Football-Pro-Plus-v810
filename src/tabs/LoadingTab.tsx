import React from 'react';
import { useAppContext } from '../context/AppContext';

export const LoadingTab: React.FC = () => {
  const { state, theme } = useAppContext();
  const f = state.form;
  const tA = f.tA || 'Đội A';
  const tB = f.tB || 'Đội B';

  return (
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center' }}>
      <div style={{ position: 'relative', marginBottom: '22px' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', border: `3px solid ${theme.ac}33`, borderTopColor: theme.ac, animation: 'spin 0.9s linear infinite', margin: 'auto' }}></div>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>⚽</div>
      </div>
      <div style={{ fontSize: '16px', fontWeight: 700, color: theme.gd, letterSpacing: '2px', marginBottom: '6px', fontFamily: "'Orbitron', monospace" }}>ĐANG PHÂN TÍCH</div>
      <div style={{ fontSize: '13px', color: theme.ac, fontWeight: 600, marginBottom: '4px' }}>{tA} <span style={{ color: theme.mut }}>vs</span> {tB}</div>
      <div style={{ fontSize: '10px', color: theme.mut, marginBottom: '24px' }}>{f.lg || 'Kèo BTTS'}</div>
      <div style={{ width: '100%', maxWidth: '280px', background: theme.bg, borderRadius: '99px', height: '5px', overflow: 'hidden', marginBottom: '24px', border: `1px solid ${theme.brd}` }}>
        <div style={{ height: '100%', borderRadius: '99px', background: `linear-gradient(90deg, ${theme.ac}, ${theme.a2})`, animation: 'loadbar 1.5s ease-in-out forwards' }}></div>
      </div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '16px' }}>
        {['BTTS', 'GAP', 'P_total', 'Safe Line'].map((s, i) => (
          <span key={i} style={{ fontSize: '8px', padding: '2px 8px', borderRadius: '10px', background: `${theme.ac}${i === 0 ? '33' : '14'}`, color: theme.ac, letterSpacing: '1px' }}>{s}</span>
        ))}
      </div>
      <div id="loading-step" style={{ fontSize: '10px', color: theme.mut, letterSpacing: '1px', minHeight: '16px', transition: 'opacity 0.3s' }}>Đang tổng hợp kết quả...</div>
    </div>
  );
};
