import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { toast, haptic } from '../utils/toast';

export const Overlays: React.FC = () => {
  const { state, updateState, theme } = useAppContext();
  const t = theme;

  // --- PIN Overlay ---
  const renderPinOverlay = () => {
    if (!state.pscr) return null;
    const dg = state.pd;

    const pBk = () => updateState({ pd: state.pd.slice(0, -1), pe: '' });
    const pPr = (d: number) => {
      if (state.pd.length >= 6) return;
      const newPd = [...state.pd, d];
      updateState({ pd: newPd, pe: '' });
      if (newPd.length === 6) {
        if (newPd.join('') === state.pin) {
          updateState({ pscr: null, pd: [], tab: 'dev' });
        } else {
          updateState({ pshk: true, pe: 'Sai mật khẩu' });
          setTimeout(() => updateState({ pshk: false, pd: [], pe: '' }), 560);
        }
      }
    };

    return (
      <div id="pio" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: '430px', margin: 'auto' }}>
        <div style={{ width: '100%', padding: '0 28px', maxWidth: '350px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '44px', marginBottom: '11px' }}>🔐</div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: t.txt, letterSpacing: '2px' }}>Nhập mật khẩu</div>
            <div style={{ fontSize: '10px', color: t.mut, marginTop: '3px' }}>6 chữ số để truy cập Tuỳ Chọn Nhà Phát Triển</div>
          </div>
          <div className={state.pshk ? 'shake' : ''} style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '7px' }}>
            {[0, 1, 2, 3, 4, 5].map(i => (
              <div key={i} className="pd" style={{ background: i < dg.length ? t.ac : 'transparent', border: `2px solid ${i < dg.length ? t.ac : t.brd}`, boxShadow: i < dg.length ? `0 0 7px ${t.ac}88` : 'none', width: '16px', height: '16px', borderRadius: '50%', transition: 'background 0.1s, transform 0.1s' }}></div>
            ))}
          </div>
          {state.pe ? <div style={{ textAlign: 'center', fontSize: '11px', color: t.rd, marginBottom: '7px' }}>{state.pe}</div> : <div style={{ height: '22px' }}></div>}
          <div className="kp" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '9px', marginTop: '5px' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '⌫'].map((k, i) => (
              <button key={i} className={`kb${k === '' ? ' emp' : k === '⌫' ? ' del' : ''}`} onClick={() => k === '' ? null : k === '⌫' ? pBk() : pPr(k as number)} style={{ opacity: k === '' ? 0 : 1, pointerEvents: k === '' ? 'none' : 'auto' }}>{k}</button>
            ))}
          </div>
          <button onClick={() => updateState({ pscr: null, pd: [], pe: '' })} style={{ width: '100%', marginTop: '13px', padding: '13px', background: 'transparent', border: `1px solid ${t.brd}`, borderRadius: '11px', color: t.mut, fontSize: '12px', cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif" }}>Huỷ</button>
        </div>
      </div>
    );
  };

  // --- Trial Lock Overlay ---
  const renderTrialLockOverlay = () => {
    const limit = 3 * 24 * 60 * 60 * 1000;
    const isExpired = state.firstAnalysisTime && (Date.now() - state.firstAnalysisTime > limit);
    
    if (!isExpired) return null;
    
    // Reuse PIN overlay logic but with a different message
    const dg = state.cd; // Use a separate digit array for trial lock if needed, or reuse pd
    const pBk = () => updateState({ cd: state.cd.slice(0, -1), pe: '' });
    const pPr = (d: number) => {
      if (state.cd.length >= 6) return;
      const newCd = [...state.cd, d];
      updateState({ cd: newCd, pe: '' });
      if (newCd.length === 6) {
        if (newCd.join('') === state.pin || (state.pin === "" && newCd.join('') === "123456")) {
          // If no pin set, default to 123456
          updateState({ firstAnalysisTime: Date.now(), cd: [], pe: '' }); // Reset trial for demo or just unlock
          toast('✅ Đã gia hạn quyền sử dụng', 'success');
        } else {
          updateState({ pshk: true, pe: 'Mật khẩu kích hoạt không đúng' });
          setTimeout(() => updateState({ pshk: false, cd: [], pe: '' }), 560);
        }
      }
    };

    return (
      <div id="trial-lock" style={{ position: 'fixed', inset: 0, background: 'rgba(5,10,20,0.98)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: '500px', margin: 'auto' }}>
        <div style={{ width: '100%', padding: '0 32px', textAlign: 'center' }}>
          <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: `${t.rd}22`, border: `2px solid ${t.rd}44`, animation: 'pulseBorder 2s infinite' }}></div>
            <span style={{ fontSize: '48px' }}>⌛</span>
          </div>
          
          <div style={{ fontSize: '20px', fontWeight: 900, color: '#fff', letterSpacing: '2px', marginBottom: '8px', fontFamily: 'Orbitron, sans-serif' }}>HẾT HẠN SỬ DỤNG</div>
          <div style={{ fontSize: '12px', color: t.mut, lineHeight: 1.6, marginBottom: '28px' }}>
            Thời gian dùng thử 3 ngày đã kết thúc.<br />
            Vui lòng nhập mật khẩu kích hoạt để tiếp tục.
          </div>

          <div className={state.pshk ? 'shake' : ''} style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
            {[0, 1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{ background: i < dg.length ? t.ac : 'transparent', border: `2px solid ${i < dg.length ? t.ac : t.brd}`, width: '14px', height: '14px', borderRadius: '50%', boxShadow: i < dg.length ? `0 0 10px ${t.ac}` : 'none' }}></div>
            ))}
          </div>
          
          {state.pe && <div style={{ fontSize: '11px', color: t.rd, marginBottom: '12px', fontWeight: 700 }}>{state.pe}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', maxWidth: '280px', margin: '0 auto' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '⌫'].map((k, i) => (
              <button key={i} className="kb" onClick={() => k === '' ? null : k === '⌫' ? pBk() : pPr(k as number)} style={{ padding: '12px 0', fontSize: '18px', opacity: k === '' ? 0 : 1 }}>{k}</button>
            ))}
          </div>
          
          <div style={{ marginTop: '24px', fontSize: '10px', color: t.mut }}>
            Liên hệ nhà phát triển để nhận mã kích hoạt
          </div>
        </div>
      </div>
    );
  };

  // --- Welcome Overlay ---
  const renderWelcomeOverlay = () => {
    if (!state.showWelcome) return null;
    const ac = t.a2 || '#00e5ff';
    const ac2 = t.ac || '#00b0ff';
    const gr = t.gr || '#00e676';

    const bgType = state.wlcBg.type;
    const customData = bgType === 'image' ? state.wlcBg.imgData : bgType === 'gif' ? state.wlcBg.gifData : null;

    return (
      <div id="welcome-overlay" style={{ position: 'fixed', inset: 0, zIndex: 400, overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch', display: 'block' }}>
        {/* Background Layer */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#050a14 0%,#0a1628 40%,#060d1a 100%)' }}></div>
        
        {bgType !== 'default' && customData ? (
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${customData})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.6, animation: 'wlcFadeIn 1.5s ease' }}></div>
        ) : (
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${ac}12 1px, transparent 1px), linear-gradient(90deg, ${ac}12 1px, transparent 1px)`, backgroundSize: '40px 40px', animation: 'wlcFadeIn 1.5s ease' }}></div>
        )}

        <div className="scan-line" style={{ background: `linear-gradient(90deg, transparent, ${ac}88, transparent)` }}></div>
        
        <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '24px 28px 32px', animation: 'wlcFadeIn 0.6s ease', boxSizing: 'border-box' }}>
          <div style={{ position: 'relative', width: '140px', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', flexShrink: 0, animation: 'wlcFloat 3s ease-in-out infinite' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: `radial-gradient(circle, ${ac}22 0%, transparent 70%)` }}></div>
            <div style={{ position: 'absolute', inset: '14px', borderRadius: '50%', border: '2px solid transparent', borderTopColor: ac, borderRightColor: ac2, animation: 'spin 2s linear infinite' }}></div>
            <div style={{ position: 'absolute', inset: '6px', borderRadius: '50%', border: '1.5px solid transparent', borderBottomColor: `${ac}66`, animation: 'spin 3.5s linear infinite reverse' }}></div>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: `radial-gradient(circle at 35% 35%, ${ac}33, #0d1f3c)`, border: `2px solid ${ac}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '56px', animation: 'ballSpin 8s linear infinite' }}>⚽</div>
          </div>

          <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '30px', fontWeight: 900, color: '#fff', letterSpacing: '4px', textAlign: 'center', lineHeight: 1, animation: 'wlcGlow 2.5s ease-in-out infinite', marginBottom: '4px' }}>AI FOOTBALL</div>
          <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '13px', fontWeight: 700, color: ac, letterSpacing: '6px', textAlign: 'center', marginBottom: '6px' }}>ANALYSER</div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <div style={{ height: '1px', width: '40px', background: `linear-gradient(90deg, transparent, ${ac})` }}></div>
            <div style={{ fontSize: '9px', color: ac, letterSpacing: '3px', fontWeight: 700 }}>PRO v8.1</div>
            <div style={{ height: '1px', width: '40px', background: `linear-gradient(90deg, ${ac}, transparent)` }}></div>
          </div>

          <div style={{ fontSize: '12px', color: '#8899aa', textAlign: 'center', letterSpacing: '1.5px', lineHeight: 1.8, marginBottom: '10px', animation: 'wlcSlideUp 0.8s ease 0.3s both' }}>
            Phân tích kèo thông minh<br />
            <span style={{ color: gr, fontWeight: 700 }}>Tài · Xỉu · Chấp</span> — Chính xác mỗi ngày
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '14px', animation: 'wlcSlideUp 0.8s ease 0.35s both' }}>
            <span style={{ fontSize: '8px', fontFamily: 'Orbitron, monospace', fontWeight: 700, color: '#000', background: `linear-gradient(135deg, ${ac}, ${ac2})`, padding: '3px 11px', borderRadius: '20px', letterSpacing: '1.5px' }}>v8.1</span>
            <span style={{ fontSize: '8px', color: `${ac}88`, letterSpacing: '2px', textTransform: 'uppercase' }}>MrV94</span>
          </div>

          <div id="wlc-btn-wrap" style={{ animation: 'wlcSlideUp 0.6s ease 1s both' }}>
            <button onClick={() => updateState({ showWelcome: false })} style={{ padding: '16px 52px', background: `linear-gradient(135deg, ${ac}, ${ac2})`, border: 'none', borderRadius: '50px', color: '#000', fontSize: '15px', fontWeight: 900, cursor: 'pointer', fontFamily: 'Orbitron, monospace', letterSpacing: '2px', boxShadow: `0 0 30px ${ac}66, 0 8px 24px ${ac}33`, animation: 'wlcBtnPulse 1.5s ease 1s infinite' }}>
              ▶ BẮT ĐẦU
            </button>
          </div>
        </div>
      </div>
    );
  };

  // --- Confirmation Overlay ---
  const renderConfirmationOverlay = () => {
    if (!state.conf || !state.conf.show) return null;
    const { title, msg, onOk } = state.conf;

    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div className="card fade-in" style={{ width: '100%', maxWidth: '320px', background: t.card, border: `1px solid ${t.brd}`, borderRadius: '20px', padding: '24px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚠️</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: t.txt, marginBottom: '8px', fontFamily: "'Rajdhani', sans-serif" }}>{title}</div>
          <div style={{ fontSize: '12px', color: t.mut, lineHeight: 1.5, marginBottom: '24px' }}>{msg}</div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => updateState({ conf: null })} style={{ flex: 1, padding: '12px', background: t.bg, border: `1px solid ${t.brd}`, borderRadius: '12px', color: t.mut, fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif" }}>
              HUỶ
            </button>
            <button onClick={() => { onOk(); updateState({ conf: null }); haptic('heavy'); }} style={{ flex: 1, padding: '12px', background: `${t.rd}18`, border: `1px solid ${t.rd}44`, borderRadius: '12px', color: t.rd, fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif" }}>
              XÁC NHẬN
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderPinOverlay()}
      {renderTrialLockOverlay()}
      {renderWelcomeOverlay()}
      {renderConfirmationOverlay()}
    </>
  );
};
