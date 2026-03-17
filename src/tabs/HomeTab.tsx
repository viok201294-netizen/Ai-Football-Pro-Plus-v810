import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';

export const HomeTab: React.FC = () => {
  const { state, updateState, theme } = useAppContext();
  const [time, setTime] = useState({ time: '', date: '' });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const vn = new Date(now.getTime() + 7 * 3600000);
      const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      setTime({
        time: `${String(vn.getUTCHours()).padStart(2, '0')}:${String(vn.getUTCMinutes()).padStart(2, '0')}:${String(vn.getUTCSeconds()).padStart(2, '0')}`,
        date: `${days[vn.getUTCDay()]} ${String(vn.getUTCDate()).padStart(2, '0')}/${String(vn.getUTCMonth() + 1).padStart(2, '0')}/${vn.getUTCFullYear()}`
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const H = state.hist;
  const lastR = state.ar || H[0];
  const tc = H.filter(r => r.rec === 'T').length;
  const xc = H.length - tc;

  const navTo = (id: string) => {
    updateState({ tab: id });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ paddingTop: '16px' }}
    >
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px', border: `1px solid ${theme.ac}44`, background: `linear-gradient(135deg, ${theme.bg} 0%, ${theme.card} 40%, ${theme.a2}18 100%)`, padding: '20px 18px 18px', marginBottom: '14px' }}
      >
        <div className="scan-line"></div>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', background: `radial-gradient(circle, ${theme.ac}14, transparent 70%)`, pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', bottom: '-40px', left: '-20px', width: '140px', height: '140px', background: `radial-gradient(circle, ${theme.a2}10, transparent 70%)`, pointerEvents: 'none' }}></div>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ fontSize: '9px', color: theme.mut, letterSpacing: '4px', textTransform: 'uppercase' }}>⚽ PHÂN TÍCH KÈO CHUYÊN SÂU</div>
            <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '8px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: theme.ac, fontFamily: "'Orbitron', monospace", letterSpacing: '2px', lineHeight: 1 }}>{time.time}</div>
              <div style={{ fontSize: '8px', color: theme.mut, letterSpacing: '1px', marginTop: '2px' }}>{time.date}</div>
            </div>
          </div>
          <div className="hero-title" style={{ fontFamily: "'Orbitron', monospace", fontSize: '22px', fontWeight: 900, color: theme.ac, letterSpacing: '1px', lineHeight: 1.2, marginBottom: '4px' }}>AI FOOTBALL ANALYSER</div>
          <div style={{ fontSize: '11px', color: theme.a2, fontWeight: 600, letterSpacing: '1px', marginBottom: '14px' }}>BTTS · GAP · Conditional · P_total · Safe Line</div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button onClick={() => navTo('analyze')} style={{ padding: '10px 18px', background: theme.bg2, border: 'none', borderRadius: '10px', color: '#000', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '1px' }}>⚡ Phân Tích Ngay</button>
            {lastR && <button onClick={() => navTo('result')} style={{ padding: '10px 16px', background: `${theme.ac}18`, border: `1px solid ${theme.ac}44`, borderRadius: '10px', color: theme.ac, fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif" }}>📊 Kết Quả</button>}
          </div>
        </div>
      </motion.div>

      {H.length > 0 && (
        <>
          <div style={{ fontSize: '9px', color: theme.mut, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '9px', display: 'flex', alignItems: 'center', gap: '7px' }}>
            <span style={{ color: theme.ac }}>▸</span> Thống kê phiên này
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '7px', marginBottom: '12px' }}>
            <div style={{ borderRadius: '11px', padding: '12px 6px', textAlign: 'center', border: `1px solid ${theme.brd}`, background: theme.c2 }}>
              <div style={{ fontSize: '22px', fontWeight: 700, color: theme.ac, fontFamily: "'Rajdhani', monospace" }}>{H.length}</div>
              <div style={{ fontSize: '8px', color: theme.mut, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '1px' }}>Phân tích</div>
            </div>
            <div style={{ borderRadius: '11px', padding: '12px 6px', textAlign: 'center', border: `1px solid ${theme.brd}`, background: theme.c2 }}>
              <div style={{ fontSize: '22px', fontWeight: 700, color: theme.gr, fontFamily: "'Rajdhani', monospace" }}>{tc}</div>
              <div style={{ fontSize: '8px', color: theme.mut, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '1px' }}>TÀI</div>
            </div>
            <div style={{ borderRadius: '11px', padding: '12px 6px', textAlign: 'center', border: `1px solid ${theme.brd}`, background: theme.c2 }}>
              <div style={{ fontSize: '22px', fontWeight: 700, color: theme.or, fontFamily: "'Rajdhani', monospace" }}>{xc}</div>
              <div style={{ fontSize: '8px', color: theme.mut, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '1px' }}>XỈU</div>
            </div>
          </div>
        </>
      )}

      {lastR && (
        <>
          <div style={{ fontSize: '9px', color: theme.mut, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '9px', display: 'flex', alignItems: 'center', gap: '7px' }}>
            <span style={{ color: theme.a2 }}>▸</span> Phân tích gần nhất
          </div>
          <div className="card" onClick={() => navTo('result')} style={{ background: `linear-gradient(135deg, ${lastR.betC}10, ${theme.card})`, borderColor: `${lastR.betC}44`, cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: theme.gd }}>{lastR.form.tA || 'Đội A'} vs {lastR.form.tB || 'Đội B'}</div>
                <div style={{ fontSize: '10px', color: theme.mut, marginTop: '2px' }}>{lastR.form.lg || '—'}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '22px', fontWeight: 700, color: lastR.betC, fontFamily: "'Orbitron', monospace" }}>{lastR.rec === 'T' ? 'TÀI' : 'XỈU'}</div>
                <div style={{ fontSize: '11px', color: `${lastR.betC}aa` }}>{lastR.betLbl}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
              <span className="chip" style={{ background: `${lastR.ptRaw > 0.51 ? theme.gr : theme.rd}22`, color: lastR.ptRaw > 0.51 ? theme.gr : theme.rd }}>P_total {lastR.ptPct}%</span>
              <span className="chip" style={{ background: `${lastR.eCP.c}22`, color: lastR.eCP.c }}>P(≥3|B) {lastR.condP}%</span>
              <span className="chip" style={{ background: `${lastR.conf.c}22`, color: lastR.conf.c }}>{lastR.conf.lb}</span>
              {lastR.conflict && <span className="chip" style={{ background: `${theme.gd}22`, color: theme.gd }}>⚠️ Mâu thuẫn</span>}
              {lastR.kp.pri && <span className="chip" style={{ background: `${theme.rd}22`, color: theme.rd }}>⚡ KÈO PHỤ</span>}
            </div>
          </div>
        </>
      )}

      <div style={{ fontSize: '9px', color: theme.mut, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '9px', display: 'flex', alignItems: 'center', gap: '7px', marginTop: '4px' }}>
        <span style={{ color: theme.gd }}>▸</span> Phương pháp phân tích
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', marginBottom: '14px' }}>
        {[
          { ic: '📐', t: '6 Bước hệ thống', d: 'GAP · P_total · Conditional', c: theme.ac },
          { ic: '⚡', t: 'Cảnh báo mâu thuẫn', d: 'Highlight xung đột tín hiệu', c: theme.rd },
          { ic: '💎', t: 'So sánh kèo', d: 'Kèo phụ vs kèo chính', c: theme.a2 },
          { ic: '🎯', t: 'Safe Line', d: 'Mức kèo tối ưu ±0.25', c: theme.gr },
        ].map((f, i) => (
          <div key={i} className="card" style={{ background: `${f.c}0a`, borderColor: `${f.c}28`, marginBottom: 0 }}>
            <div style={{ fontSize: '22px', marginBottom: '6px' }}>{f.ic}</div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: f.c }}>{f.t}</div>
            <div style={{ fontSize: '10px', color: theme.mut, marginTop: '3px' }}>{f.d}</div>
          </div>
        ))}
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        style={{ background: `${theme.rd}08`, border: `1px solid ${theme.rd}22`, borderRadius: '11px', padding: '12px 13px', marginBottom: '8px' }}
      >
        <div style={{ fontSize: '10px', fontWeight: 700, color: theme.rd, marginBottom: '5px' }}>⚠️ Lưu ý quan trọng</div>
        <div style={{ fontSize: '10px', color: theme.mut, lineHeight: 1.7 }}>Công cụ phân tích xác suất — KHÔNG đảm bảo kết quả. Chỉ lấy odds cùng thời điểm. Sử dụng có trách nhiệm.</div>
      </motion.div>
    </motion.div>
  );
};
