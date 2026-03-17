import React from 'react';
import { haptic } from '../utils/toast';

interface Props {
  val: string;
  onUpd: (v: string) => void;
  color: string;
}

export const ScoreStepper: React.FC<Props> = ({ val, onUpd, color }) => {
  const n = parseInt(val) || 0;
  
  const step = (d: number) => {
    const nv = Math.max(0, n + d);
    onUpd(String(nv));
    haptic('tap');
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.2)', padding: '2px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
      <button 
        onClick={e => { e.stopPropagation(); step(-1); }}
        style={{ width: '24px', height: '24px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
      >
        −
      </button>
      <input 
        type="text"
        inputMode="numeric"
        value={val}
        onClick={e => e.stopPropagation()}
        onChange={(e) => {
          const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
          onUpd(v || '0');
        }}
        onBlur={() => {
          if (!val) onUpd('0');
        }}
        style={{ 
          width: '28px', 
          textAlign: 'center', 
          background: 'transparent', 
          border: 'none', 
          color: color, 
          fontSize: '16px', 
          fontWeight: 900, 
          fontFamily: 'Orbitron, sans-serif',
          outline: 'none',
          padding: 0
        }}
      />
      <button 
        onClick={e => { e.stopPropagation(); step(1); }}
        style={{ width: '24px', height: '24px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
      >
        +
      </button>
    </div>
  );
};
