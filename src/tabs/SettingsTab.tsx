import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { BRIGHTNESS, ACCENTS } from '../utils/theme';
import { toast } from '../utils/toast';

export const SettingsTab: React.FC = () => {
  const { state, updateState, theme } = useAppContext();
  const t = theme;
  const br = state.brightness || 'light';

  const togAcc = (id: string) => {
    updateState({ settAcc: { ...state.settAcc, [id]: !state.settAcc[id] } });
  };

  const [resetTap, setResetTap] = React.useState(0);
  const handleReset = () => {
    const now = Date.now();
    if (now - (window as any).lastTap < 500) {
      const newCount = resetTap + 1;
      setResetTap(newCount);
      if (newCount >= 5) {
        updateState({ pin: '', pold: '', pnew: '' });
        toast('🔓 Đã xóa mật khẩu thành công', 'success');
        setResetTap(0);
      }
    } else {
      setResetTap(1);
    }
    (window as any).lastTap = now;
  };

  const setBrightness = (b: 'light' | 'dark' | 'auto') => {
    updateState({ brightness: b });
  };

  const setTh = (k: string) => {
    updateState({ tk: k });
  };

  const openDev = () => {
    if (!state.pin) {
      updateState({ settAcc: { ...state.settAcc, pin: true }, devPending: true });
      toast('⚠️ Vui lòng đặt mật khẩu 6 số trước để truy cập mục này', 'warn');
      return;
    }
    updateState({ pscr: 'dev' });
  };

  const accRow = (id: string, icon: string, label: string, sub: string, color: string, body: React.ReactNode) => {
    const open = state.settAcc[id];
    return (
      <div style={{ borderRadius: '13px', marginBottom: '8px', overflow: 'hidden', border: `1px solid ${color}${open ? '55' : '22'}`, background: t.card, transition: 'border-color 0.2s' }}>
        <div onClick={() => togAcc(id)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', cursor: 'pointer', userSelect: 'none', WebkitUserSelect: 'none' }}>
          <div style={{ width: '33px', height: '33px', borderRadius: '10px', background: `${color}18`, border: `1px solid ${color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{icon}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: color }}>{label}</div>
            <div style={{ fontSize: '10px', color: t.mut, marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub}</div>
          </div>
          <span style={{ fontSize: '12px', color: t.mut, transition: 'transform 0.22s', display: 'inline-block', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>▾</span>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ padding: '0 14px 14px' }}>{body}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const brLabel = BRIGHTNESS[br];
  const brSub = `${brLabel.e} ${brLabel.n} · ${ACCENTS[state.tk]?.e || ''} ${ACCENTS[state.tk]?.n || ''}`;
  const profAvIcon = state.profile.avatarType === 'emoji' ? (state.profile.emoji || '⚽') : '📷';
  const profName = state.profile.name || 'Chưa đặt tên';

  return (
    <div style={{ paddingTop: '16px' }}>
      {accRow('profile', profAvIcon, 'Hồ sơ người dùng', `Tên: ${profName}`, t.a2, (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '4px 0 12px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: `${t.a2}22`, border: `3px solid ${t.a2}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '44px', marginBottom: '8px' }}>{state.profile.emoji || '⚽'}</div>
          
          <div style={{ width: '100%', marginBottom: '15px' }}>
            <div style={{ fontSize: '9px', color: t.mut, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px', textAlign: 'center' }}>Chọn Icon đại diện</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(44px, 1fr))', gap: '6px', padding: '10px', background: t.bg, borderRadius: '12px', border: `1px solid ${t.brd}`, maxHeight: '180px', overflowY: 'auto' }}>
              {[
                '⚽', '🏀', '🏈', '🎾', '🏐', '🏆', '🥇', '🥈', '🥉', '🎯', '🥊', '🥋',
                '🔥', '⚡', '💎', '👑', '🦁', '🐯', '🦅', '🐺', '🐉', '🤖', '👽', '👻',
                '😎', '🤩', '🧐', '🧠', '💪', '🚀', '💰', '📈', '🍀', '🎮', '🎧', '💻'
              ].map(e => (
                <div key={e} onClick={() => updateState({ profile: { ...state.profile, emoji: e } })} 
                  style={{ fontSize: '20px', padding: '8px 0', textAlign: 'center', cursor: 'pointer', borderRadius: '8px', background: state.profile.emoji === e ? `${t.a2}22` : 'transparent', border: `1px solid ${state.profile.emoji === e ? t.a2 : 'transparent'}`, transition: 'all 0.15s' }}>
                  {e}
                </div>
              ))}
            </div>
          </div>

          <div style={{ width: '100%' }}>
            <div style={{ fontSize: '9px', color: t.mut, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Tên hiển thị</div>
            <input type="text" value={state.profile.name} onChange={e => updateState({ profile: { ...state.profile, name: e.target.value } })} placeholder="Nhập tên của bạn..." style={{ width: '100%', boxSizing: 'border-box', padding: '11px 13px', background: t.bg, border: `1px solid ${t.brd}`, borderRadius: '10px', color: t.txt, fontSize: '14px', fontFamily: 'Rajdhani, sans-serif', outline: 'none', WebkitAppearance: 'none' }} />
          </div>
        </div>
      ))}

      {accRow('bright', brLabel.e, 'Chế độ hiển thị', brSub, t.ac, (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '7px', marginBottom: '10px' }}>
          {Object.entries(BRIGHTNESS).map(([key, bm]) => {
            const active = br === key;
            return (
              <div key={key} onClick={() => setBrightness(key as any)} style={{ padding: '12px 6px', borderRadius: '11px', textAlign: 'center', cursor: 'pointer', border: `2px solid ${active ? t.ac : t.brd}`, background: active ? `${t.ac}18` : t.bg, transition: 'all 0.15s' }}>
                <div style={{ fontSize: '22px', marginBottom: '4px' }}>{bm.e}</div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: active ? t.ac : t.mut }}>{bm.n}</div>
              </div>
            );
          })}
        </div>
      ))}

      {accRow('theme', '🎨', 'Tuỳ chọn màu', `Đang dùng: ${ACCENTS[state.tk]?.e || ''} ${ACCENTS[state.tk]?.n || ''}`, t.a2, (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
          {Object.entries(ACCENTS).map(([key, ac]) => {
            const active = state.tk === key;
            const isDk = t.isDark;
            const mainC = isDk ? ac.dk.ac : ac.ac;
            return (
              <div key={key} onClick={() => setTh(key)} style={{ padding: '10px 7px', borderRadius: '10px', textAlign: 'center', cursor: 'pointer', border: `2px solid ${active ? mainC : t.brd}`, background: active ? `${mainC}18` : t.bg, transition: 'all 0.15s' }}>
                <div style={{ fontSize: '18px', marginBottom: '3px' }}>{ac.e}</div>
                <div style={{ fontSize: '9px', fontWeight: 700, color: active ? mainC : t.mut, marginBottom: '5px' }}>{ac.n}</div>
              </div>
            );
          })}
        </div>
      ))}

      {accRow('pin', '🔐', 'Bảo mật & Mật khẩu', state.pin ? 'Đã thiết lập mật khẩu 6 số' : 'Chưa thiết lập mật khẩu', t.or, (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {state.pin && (
            <div style={{ marginBottom: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <div style={{ fontSize: '9px', color: t.mut, letterSpacing: '1px', textTransform: 'uppercase' }}>Mật khẩu cũ</div>
                <div onClick={handleReset} style={{ fontSize: '8px', color: t.rd, cursor: 'pointer', opacity: 0.5 }}>Quên mật khẩu?</div>
              </div>
              <input 
                type="password" 
                maxLength={6} 
                inputMode="numeric" 
                value={state.pold} 
                onChange={e => updateState({ pold: e.target.value.replace(/\D/g, '') })} 
                placeholder="Nhập 6 số cũ..." 
                className="ti" 
                style={{ textAlign: 'center', fontSize: '18px', letterSpacing: '4px' }} 
              />
            </div>
          )}
          
          <div style={{ marginBottom: '4px' }}>
            <div style={{ fontSize: '9px', color: t.mut, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
              {state.pin ? 'Mật khẩu mới (6 số)' : 'Thiết lập mật khẩu mới (6 số)'}
            </div>
            <input 
              type="password" 
              maxLength={6} 
              inputMode="numeric" 
              value={state.pnew} 
              onChange={e => updateState({ pnew: e.target.value.replace(/\D/g, '') })} 
              placeholder="Nhập 6 số mới..." 
              className="ti" 
              style={{ textAlign: 'center', fontSize: '18px', letterSpacing: '4px' }} 
            />
          </div>

          <button 
            onClick={() => {
              if (state.pin && state.pold !== state.pin) {
                toast('⚠️ Mật khẩu cũ không chính xác', 'error');
                return;
              }
              if (state.pnew.length !== 6) {
                toast('⚠️ Mật khẩu mới phải đúng 6 chữ số', 'error');
                return;
              }
              if (state.pin && state.pnew === state.pin) {
                toast('⚠️ Mật khẩu mới không được trùng mật khẩu cũ', 'warn');
                return;
              }
              updateState({ pin: state.pnew, pnew: '', pold: '' });
              toast('✅ Đã cập nhật mật khẩu thành công', 'success');
            }} 
            style={{ width: '100%', padding: '12px', background: `${t.or}18`, border: `1px solid ${t.or}44`, borderRadius: '10px', color: t.or, fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif" }}
          >
            {state.pin ? 'Xác nhận đổi mật khẩu' : 'Xác nhận thiết lập'}
          </button>
          <div style={{ fontSize: '9px', color: t.mut, marginTop: '6px', textAlign: 'center', fontStyle: 'italic' }}>
            * Quyền sử dụng 3 ngày sẽ kích hoạt sau trận phân tích đầu tiên.
          </div>
        </div>
      ))}

      {accRow('dev', '🛠', 'Tuỳ Chọn Nhà Phát Triển', state.pin ? 'Bảo vệ bởi mật khẩu 6 số' : 'Cần đặt mật khẩu trước', t.or, (
        <>
          <div style={{ fontSize: '10px', color: t.mut, padding: '9px', background: t.bg, borderRadius: '9px', border: `1px solid ${t.brd}`, marginBottom: '10px', lineHeight: 1.7 }}>
            {state.pin ? '🔐 Luôn yêu cầu mật khẩu 6 số — chứa cài đặt phân tích chuyên sâu.' : `⚠️ Chưa có mật khẩu. Vui lòng đặt mật khẩu tại mục Bảo mật trước.`}
          </div>
          <button onClick={openDev} style={{ width: '100%', padding: '13px', background: state.pin ? `${t.a2}22` : 'rgba(128,128,128,0.06)', border: `1px solid ${state.pin ? `${t.a2}55` : t.brd}`, borderRadius: '10px', color: state.pin ? t.a2 : t.mut, fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '1px' }}>
            {state.pin ? '🔐 Nhập mật khẩu để vào' : '⚠️ Chưa thể truy cập — Đặt mật khẩu trước'}
          </button>
        </>
      ))}

      {accRow('advanced', '⚙️', 'Tuỳ chỉnh nâng cao', 'Tự động đổi màu & Màn hình chờ', t.ac, (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div onClick={() => updateState({ autoChangeAccent: !state.autoChangeAccent })} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: t.bg, borderRadius: '10px', border: `1px solid ${state.autoChangeAccent ? t.ac : t.brd}`, cursor: 'pointer' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: state.autoChangeAccent ? t.ac : t.txt }}>Tự động đổi màu khi mở lại</div>
            <div style={{ width: '36px', height: '20px', borderRadius: '10px', background: state.autoChangeAccent ? t.ac : t.brd, position: 'relative', transition: 'background 0.2s' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '3px', left: state.autoChangeAccent ? '19px' : '3px', transition: 'left 0.2s' }}></div>
            </div>
          </div>

          <div style={{ padding: '10px 12px', background: t.bg, borderRadius: '10px', border: `1px solid ${t.brd}` }}>
            <div style={{ fontSize: '9px', color: t.mut, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Màn hình chờ (Splash Screen)</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '10px' }}>
              {['default', 'image', 'gif'].map(type => (
                <div key={type} onClick={() => updateState({ wlcBg: { ...state.wlcBg, type } })} style={{ padding: '8px 4px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', border: `1.5px solid ${state.wlcBg.type === type ? t.ac : t.brd}`, background: state.wlcBg.type === type ? `${t.ac}14` : 'transparent', fontSize: '10px', fontWeight: 700, color: state.wlcBg.type === type ? t.ac : t.mut }}>
                  {type === 'default' ? 'Mặc định' : type === 'image' ? 'Ảnh tĩnh' : 'Ảnh động'}
                </div>
              ))}
            </div>

            {state.wlcBg.type !== 'default' && (
              <div style={{ marginTop: '5px' }}>
                <input 
                  type="file" 
                  accept={state.wlcBg.type === 'image' ? "image/*" : "image/gif"} 
                  id="wlc-upload" 
                  style={{ display: 'none' }} 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const data = ev.target?.result as string;
                        if (state.wlcBg.type === 'image') updateState({ wlcBg: { ...state.wlcBg, imgData: data } });
                        else updateState({ wlcBg: { ...state.wlcBg, gifData: data } });
                        toast('✅ Đã cập nhật ảnh màn hình chờ', 'success');
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <label htmlFor="wlc-upload" style={{ display: 'block', width: '100%', padding: '10px', background: `${t.ac}14`, border: `1px dashed ${t.ac}44`, borderRadius: '8px', textAlign: 'center', cursor: 'pointer', fontSize: '11px', color: t.ac, fontWeight: 700 }}>
                  {state.wlcBg.type === 'image' ? (state.wlcBg.imgData ? 'Thay đổi ảnh tĩnh' : 'Chọn ảnh tĩnh từ máy') : (state.wlcBg.gifData ? 'Thay đổi ảnh động' : 'Chọn ảnh GIF từ máy')}
                </label>
                {(state.wlcBg.type === 'image' ? state.wlcBg.imgData : state.wlcBg.gifData) && (
                  <div style={{ marginTop: '8px', position: 'relative', borderRadius: '8px', overflow: 'hidden', height: '60px', border: `1px solid ${t.brd}` }}>
                    <img src={state.wlcBg.type === 'image' ? state.wlcBg.imgData : state.wlcBg.gifData} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div onClick={() => {
                      if (state.wlcBg.type === 'image') updateState({ wlcBg: { ...state.wlcBg, imgData: '' } });
                      else updateState({ wlcBg: { ...state.wlcBg, gifData: '' } });
                    }} style={{ position: 'absolute', top: '4px', right: '4px', width: '18px', height: '18px', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', cursor: 'pointer' }}>✕</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
