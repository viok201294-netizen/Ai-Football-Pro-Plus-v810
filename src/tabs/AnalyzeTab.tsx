import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { runAnalysis } from '../utils/analysis';
import { toast, haptic } from '../utils/toast';

const LV = Array.from({ length: 25 }, (_, i) => +(1 + i * 0.25).toFixed(2));

export const AnalyzeTab: React.FC = () => {
  const { state, updateState, theme } = useAppContext();
  const f = state.form;
  
  const [openSections, setOpenSections] = useState({
    match: true,
    btts: true,
    ou: true,
    hc: true
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
    haptic('tap');
  };

  const sf = (k: string, v: string | number) => {
    updateState({ form: { ...state.form, [k]: v } });
  };

  const doAnalyze = () => {
    const o1v = parseFloat(f.o1);
    const o2v = parseFloat(f.o2);

    if (isNaN(o1v) || isNaN(o2v) || o1v <= 1 || o2v <= 1) { 
      toast('⚠️ Nhập odds1 và odds2 hợp lệ (> 1.0)', 'error'); 
      return; 
    }
    
    if (o2v <= o1v) { 
      toast('⚠️ odds2 phải lớn hơn odds1 (BTTS+O2.5 > BTTS+O1.5)', 'error'); 
      return; 
    }
    
    updateState({ tab: 'loading' });
    
    setTimeout(() => {
      const r = runAnalysis(f, state.cfg, theme);
      const newHist = [r, ...state.hist].slice(0, 50);
      haptic('heavy');
      updateState({ 
        hist: newHist, 
        ar: r, 
        tab: 'result', 
        plWarn: true, 
        firstTs: state.firstTs || Date.now(),
        firstAnalysisTime: state.firstAnalysisTime || Date.now()
      });
    }, 1500);
  };

  const doReset = () => {
    updateState({ form: { tA: '', tB: '', lg: '', o1: '', o2: '', ml: 2.5, mh: '', hcSide: 'home' }, ar: null, lgShow: false });
  };

  const setHcVal = (absV: number) => {
    const side = f.hcSide || 'home';
    sf('mh', absV === 0 ? "0" : (side === 'home' ? absV.toString() : (-absV).toString()));
  };

  const HV = []; for (let v = 0; v <= 4.001; v = Math.round((v + 0.25) * 100) / 100) HV.push(v);
  const curMhRaw = (f.mh !== '' && f.mh != null) ? +f.mh : null;
  const curAbs = curMhRaw !== null ? Math.abs(curMhRaw) : null;

  const SectionHeader = ({ title, icon, sectionKey, color, badge }: { title: string, icon: string, sectionKey: keyof typeof openSections, color: string, badge?: string }) => (
    <div 
      onClick={() => toggleSection(sectionKey)}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '12px 4px', 
        cursor: 'pointer',
        userSelect: 'none'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color, fontSize: '14px' }}>{icon}</span>
        <span style={{ fontSize: '11px', fontWeight: 700, color: theme.txt, letterSpacing: '1px', textTransform: 'uppercase' }}>{title}</span>
        {badge && <span className="chip" style={{ background: `${color}22`, color: color, fontSize: '8px', padding: '2px 6px' }}>{badge}</span>}
      </div>
      <span style={{ color: theme.mut, fontSize: '10px', transition: 'transform 0.3s', transform: openSections[sectionKey] ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
    </div>
  );

  return (
    <div style={{ paddingTop: '16px', paddingBottom: '80px' }}>
      <div style={{ marginBottom: '12px', borderBottom: `1px solid ${theme.brd}44` }}>
        <SectionHeader title="Thông tin trận" icon="⚽" sectionKey="match" color={theme.ac} />
        <AnimatePresence>
          {openSections.match && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div className="card" style={{ background: theme.card, marginTop: '4px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', gap: '9px', marginBottom: '11px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '8px', color: theme.mut, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '5px' }}>Đội Nhà</div>
                    <input className="ti" value={f.tA} onChange={e => sf('tA', e.target.value)} placeholder="VD: Man City" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '8px', color: theme.mut, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '5px' }}>Đội Khách</div>
                    <input className="ti" value={f.tB} onChange={e => sf('tB', e.target.value)} placeholder="VD: Arsenal" />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <div style={{ fontSize: '8px', color: theme.mut, letterSpacing: '1px', textTransform: 'uppercase' }}>Giải đấu (tuỳ chọn)</div>
                  <button onClick={() => updateState({ lgShow: !state.lgShow })} style={{ background: 'transparent', border: 'none', color: theme.ac, fontSize: '9px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Rajdhani, sans-serif' }}>
                    {state.lgShow ? '✕ Đóng' : '📂 Chọn giải'}
                  </button>
                </div>
                <input className="ti" value={f.lg} onChange={e => sf('lg', e.target.value)} placeholder="VD: Premier League" />
                
                {state.lgShow && (
                  <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '5px', padding: '10px', background: theme.bg, borderRadius: '9px', border: `1px dashed ${theme.ac}44`, maxHeight: '150px', overflowY: 'auto' }}>
                    {[
                      'FIFA World Cup', 'FIFA Club World Cup', 'World Cup Qualifiers',
                      'UEFA Champions League', 'UEFA Europa League', 'UEFA Euro',
                      'Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1',
                      'AFC Champions League', 'AFC Asian Cup', 'V-League 1',
                      'Copa America', 'Gold Cup', 'Africa Cup of Nations', 'Friendly'
                    ].map(l => (
                      <span key={l} onClick={() => { sf('lg', l); updateState({ lgShow: false }); }} 
                        style={{ fontSize: '9px', padding: '4px 8px', borderRadius: '6px', background: f.lg === l ? theme.ac : `${theme.ac}15`, color: f.lg === l ? '#000' : theme.ac, cursor: 'pointer', fontWeight: 700, border: `1px solid ${theme.ac}33`, transition: 'all 0.1s' }}>
                        {l}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SECTION 2: BTTS ODDS */}
      <div style={{ marginBottom: '12px', borderBottom: `1px solid ${theme.brd}44` }}>
        <SectionHeader title="Kèo phụ BTTS" icon="⚡" sectionKey="btts" color={theme.gd} badge="BẮT BUỘC" />
        <AnimatePresence>
          {openSections.btts && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div className="card" style={{ background: theme.card, marginTop: '4px', marginBottom: '12px' }}>
                <div style={{ fontSize: '9px', color: theme.mut, marginBottom: '10px', lineHeight: 1.6 }}>Nhập odds kèo <b style={{ color: theme.gd }}>BTTS + Over</b> từ nhà cái</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <div className="ol" style={{ marginBottom: '5px' }}>BTTS + O1.5 <span style={{ color: theme.rd }}>*</span></div>
                    <div className="ob" style={{ borderColor: +f.o1 > 1 ? `${theme.gd}66` : f.o1 ? 'rgba(255,23,68,0.5)' : theme.brd, padding: 0 }}>
                      <input className="on" type="text" inputMode="decimal" pattern="[0-9]*\.?[0-9]*" value={f.o1} onChange={e => sf('o1', e.target.value)} placeholder="1.58" style={{ width: '100%', padding: '11px 12px', fontSize: '20px', fontWeight: 700, fontFamily: "'Rajdhani', monospace", color: +f.o1 > 1 ? theme.gd : theme.txt, background: 'transparent', border: 'none', outline: 'none', boxSizing: 'border-box', textAlign: 'center' }} />
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="ol" style={{ marginBottom: '5px' }}>BTTS + O2.5 <span style={{ color: theme.rd }}>*</span></div>
                    <div className="ob" style={{ borderColor: +f.o2 > 1 ? `${theme.ac}66` : f.o2 ? 'rgba(255,23,68,0.5)' : theme.brd, padding: 0 }}>
                      <input className="on" type="text" inputMode="decimal" pattern="[0-9]*\.?[0-9]*" value={f.o2} onChange={e => sf('o2', e.target.value)} placeholder="1.95" style={{ width: '100%', padding: '11px 12px', fontSize: '20px', fontWeight: 700, fontFamily: "'Rajdhani', monospace", color: +f.o2 > 1 ? theme.ac : theme.txt, background: 'transparent', border: 'none', outline: 'none', boxSizing: 'border-box', textAlign: 'center' }} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SECTION 3: OVER/UNDER */}
      <div style={{ marginBottom: '12px', borderBottom: `1px solid ${theme.brd}44` }}>
        <SectionHeader title="Kèo chính Tài Xỉu" icon="🎯" sectionKey="ou" color={theme.a2} badge="SAFE LINE" />
        <AnimatePresence>
          {openSections.ou && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div className="card" style={{ background: theme.card, marginTop: '4px', marginBottom: '12px' }}>
                <div style={{ fontSize: '8px', color: theme.mut, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '7px' }}>
                  Chọn đường kèo chính — <span style={{ color: theme.ac, fontWeight: 700 }}>O{f.ml}</span>
                </div>
                <div id="lscroll" style={{ display: 'flex', overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', borderRadius: '9px', border: `1px solid ${theme.brd}`, background: theme.bg }}>
                  {LV.map(v => {
                    const sel = v === f.ml;
                    const isQ = (v * 4) % 2 !== 0;
                    return (
                      <button key={v} className="lbtn" onClick={() => sf('ml', v)}
                        style={{ width: isQ ? '50px' : '46px', fontSize: isQ ? '11px' : '13px', color: sel ? '#fff' : isQ ? theme.mut : theme.txt, background: sel ? theme.a2 : 'transparent', borderBottom: `2px solid ${sel ? theme.ac : 'transparent'}` }}>
                        {v % 1 === 0 ? v.toFixed(0) : v}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SECTION 4: HANDICAP */}
      <div style={{ marginBottom: '24px', borderBottom: `1px solid ${theme.brd}44` }}>
        <SectionHeader title="Kèo Chấp" icon="♟️" sectionKey="hc" color={theme.or} badge="TUỲ CHỌN" />
        <AnimatePresence>
          {openSections.hc && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div className="card" style={{ background: theme.card, marginTop: '4px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '9px' }}>
                  <div style={{ fontSize: '8px', color: theme.mut, letterSpacing: '2px', textTransform: 'uppercase' }}>
                    Kèo chấp — <span style={{ color: theme.or, fontWeight: 700 }}>{curMhRaw !== null ? Math.abs(curMhRaw).toFixed(2) : '—'}</span>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px', marginBottom: '9px' }}>
                  <button onClick={() => { 
                      updateState({ 
                        form: { 
                          ...f, 
                          hcSide: 'home', 
                          mh: f.mh !== '' ? Math.abs(+f.mh).toString() : f.mh 
                        } 
                      });
                    }}
                    style={{ padding: '8px 4px', borderRadius: '9px', border: `1.5px solid ${f.hcSide === 'home' ? `${theme.or}88` : theme.brd}`, background: f.hcSide === 'home' ? `${theme.or}20` : theme.bg, color: f.hcSide === 'home' ? theme.or : theme.mut, fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif", transition: 'all 0.15s' }}>
                    🏠 {f.tA || 'Đội Nhà'}
                  </button>
                  <button onClick={() => { 
                      updateState({ 
                        form: { 
                          ...f, 
                          hcSide: 'away', 
                          mh: f.mh !== '' ? (-Math.abs(+f.mh)).toString() : f.mh 
                        } 
                      });
                    }}
                    style={{ padding: '8px 4px', borderRadius: '9px', border: `1.5px solid ${f.hcSide === 'away' ? `${theme.or}88` : theme.brd}`, background: f.hcSide === 'away' ? `${theme.or}20` : theme.bg, color: f.hcSide === 'away' ? theme.or : theme.mut, fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif", transition: 'all 0.15s' }}>
                    ✈️ {f.tB || 'Đội Khách'}
                  </button>
                </div>
                <div id="hscroll" style={{ display: 'flex', overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', borderRadius: '9px', border: `1px solid ${theme.brd}`, background: theme.bg }}>
                  {HV.map(v => {
                    const sel = curAbs !== null && Math.abs(curAbs - v) < 0.001;
                    const isQ = (v * 4) % 2 !== 0;
                    return (
                      <button key={v} className="lbtn" onClick={() => setHcVal(v)}
                        style={{ width: isQ ? '50px' : '46px', fontSize: isQ ? '11px' : '13px', position: 'relative', color: sel ? '#fff' : theme.txt, background: sel ? theme.or : 'transparent', borderBottom: `2px solid ${sel ? theme.or : 'transparent'}` }}>
                        {v === 0 ? '0' : v.toFixed(2).replace(/\.00$/, '')}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ACTION BUTTONS */}
      <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button 
          onClick={doAnalyze} 
          style={{ 
            width: '100%', 
            padding: '16px', 
            background: theme.bg2, 
            border: 'none', 
            borderRadius: '14px', 
            color: '#000', 
            fontSize: '15px', 
            fontWeight: 800, 
            letterSpacing: '2px', 
            textTransform: 'uppercase', 
            cursor: 'pointer', 
            fontFamily: "'Rajdhani', sans-serif", 
            boxShadow: `0 8px 24px ${theme.ac}44`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <span>⚡</span> PHÂN TÍCH NGAY
        </button>
        
        <button 
          onClick={doReset} 
          style={{ 
            width: '100%', 
            padding: '12px', 
            background: 'transparent', 
            border: `1px solid ${theme.brd}`, 
            borderRadius: '14px', 
            color: theme.mut, 
            fontSize: '11px', 
            fontWeight: 600, 
            letterSpacing: '1px', 
            textTransform: 'uppercase', 
            cursor: 'pointer', 
            fontFamily: "'Rajdhani', sans-serif" 
          }}
        >
          ↺ Nhập Lại / Làm Mới
        </button>
      </div>
    </div>
  );
};
