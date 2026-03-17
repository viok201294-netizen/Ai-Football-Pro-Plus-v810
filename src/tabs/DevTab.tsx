import React from 'react';
import { useAppContext } from '../context/AppContext';
import { DEFAULT_CFG } from '../utils/analysis';
import { toast } from '../utils/toast';

export const DevTab: React.FC = () => {
  const { state, updateState, theme } = useAppContext();
  const t = theme;

  const adjCfg = (key: string, delta: number, min: number, max: number) => {
    const v = +(state.cfg[key] + delta).toFixed(4);
    updateState({ cfg: { ...state.cfg, [key]: Math.max(min, Math.min(max, v)) } });
  };

  const saveCfg = () => {
    updateState({ cfgSaved: JSON.parse(JSON.stringify(state.cfg)) });
    toast('✅ Đã lưu thông số phân tích', 'success');
  };

  const resetCfg = () => {
    updateState({ cfg: DEFAULT_CFG });
    toast('✅ Đã đặt lại thông số mặc định', 'success');
  };

  const cfgNum = (key: string, min: number, max: number, step: number, label: string, unit: string = '') => {
    return (
      <div style={{ background: t.bg, borderRadius: '9px', padding: '10px', border: `1px solid ${t.brd}` }}>
        <div style={{ fontSize: '8px', color: t.mut, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button onClick={() => adjCfg(key, -step, min, max)} style={{ width: '28px', height: '28px', borderRadius: '7px', background: t.brd, border: 'none', color: t.txt, fontSize: '15px', cursor: 'pointer', lineHeight: 1 }}>−</button>
          <div style={{ flex: 1, textAlign: 'center', fontSize: '18px', fontWeight: 700, color: t.ac, fontFamily: "'Rajdhani', monospace" }}>{state.cfg[key]}{unit}</div>
          <button onClick={() => adjCfg(key, step, min, max)} style={{ width: '28px', height: '28px', borderRadius: '7px', background: t.brd, border: 'none', color: t.txt, fontSize: '15px', cursor: 'pointer', lineHeight: 1 }}>+</button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ paddingTop: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '14px' }}>
        <div style={{ fontSize: '9px', color: t.mut, letterSpacing: '3px', textTransform: 'uppercase', flex: 1 }}>🛠 Tuỳ Chọn Nhà Phát Triển</div>
        <button onClick={() => updateState({ tab: 'settings' })} style={{ padding: '6px 12px', background: t.brd, border: 'none', borderRadius: '8px', color: t.mut, fontSize: '10px', cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif" }}>← Quay lại</button>
      </div>

      <div className="card" style={{ background: `${t.a2}07`, borderColor: `${t.a2}33`, marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>⚙️</span>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: t.a2 }}>Chỉnh thông số phân tích</div>
              <div style={{ fontSize: '9px', color: t.mut, marginTop: '1px' }}>Thay đổi ngưỡng quyết định các bước</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '5px' }}>
            <button onClick={saveCfg} style={{ padding: '5px 10px', fontSize: '9px', background: `${t.gr}18`, border: `1px solid ${t.gr}44`, borderRadius: '7px', color: t.gr, cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>💾 Lưu</button>
            <button onClick={resetCfg} style={{ padding: '5px 10px', fontSize: '9px', background: `${t.rd}14`, border: `1px solid ${t.rd}33`, borderRadius: '7px', color: t.rd, cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif" }}>↺ Mặc định</button>
          </div>
        </div>

        <div style={{ fontSize: '9px', color: t.mut, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '7px', marginTop: '4px' }}>📌 Bước 2 — Ngưỡng odds1</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px', marginBottom: '10px' }}>
          {cfgNum('o1_tai_strong', 1.30, 1.70, 0.01, 'TÀI mạnh ≤')}
          {cfgNum('o1_xiu_signal', 1.65, 2.20, 0.01, 'XỈU ≥')}
        </div>

        <div style={{ fontSize: '9px', color: t.mut, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '7px' }}>📌 Bước 2 — Ngưỡng GAP</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px', marginBottom: '10px' }}>
          {cfgNum('gap_tai', 0.05, 0.35, 0.01, 'TÀI ≤')}
          {cfgNum('gap_xiu', 0.15, 0.60, 0.01, 'XỈU ≥')}
        </div>

        <div style={{ fontSize: '9px', color: t.mut, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '7px' }}>📌 Bước 3 — P(≥3|BTTS) %</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px', marginBottom: '10px' }}>
          {cfgNum('cp_tai', 60, 95, 1, 'TÀI > ', '%')}
          {cfgNum('cp_xiu', 40, 79, 1, 'XỈU < ', '%')}
        </div>

        <div style={{ fontSize: '9px', color: t.mut, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '7px' }}>📌 🎯 Quyết định V7.2 — P_total vs Ngưỡng</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px', marginBottom: '10px' }}>
          {cfgNum('pt_buffer', 0, 15, 1, 'Bonus không BTTS (V7.2)', '%')}
          {cfgNum('pt_bench', 45, 60, 1, 'Ngưỡng V7.2 (53%)', '%')}
        </div>

        <div style={{ fontSize: '9px', color: t.mut, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '7px' }}>📌 Kèo Chấp — Module V7.2</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '7px', marginBottom: '7px' }}>
          {cfgNum('hc_xiu_signal', 1.60, 2.20, 0.01, 'XỈU signal')}
          {cfgNum('hc_khoang_cach', 0.10, 0.60, 0.01, 'Khoảng cách')}
          {cfgNum('hc_he_so', 0.25, 1.00, 0.25, 'Hệ số')}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px', marginBottom: '10px' }}>
          {cfgNum('hc_gap_nho', 0.05, 0.30, 0.01, 'GAP nhỏ ≤')}
          {cfgNum('hc_gap_lon', 0.15, 0.50, 0.01, 'GAP lớn ≥')}
        </div>

        <div style={{ fontSize: '9px', color: t.mut, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '7px' }}>📌 Bước 6 & Cảnh báo</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '7px', marginBottom: '6px' }}>
          {cfgNum('safe_delta', 0.00, 0.75, 0.25, 'Safe line ±')}
          {cfgNum('safety_min', 40, 90, 5, 'An toàn min', '%')}
          {cfgNum('kp_notable', 3, 20, 1, 'Kèo phụ mạnh', '%')}
        </div>
        <div style={{ fontSize: '9px', color: t.rd, padding: '8px', background: `${t.rd}08`, borderRadius: '7px', border: `1px solid ${t.rd}22`, lineHeight: 1.7 }}>
          ⚠️ Thay đổi ngưỡng ảnh hưởng trực tiếp đến kết quả phân tích. Không khuyến khích thay đổi nếu không hiểu rõ phương pháp.
        </div>
      </div>

      <div className="card" style={{ background: t.card }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span style={{ fontSize: '16px' }}>🔐</span>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: t.or }}>Quản lý bảo mật</div>
            <div style={{ fontSize: '9px', color: t.mut, marginTop: '1px' }}>Đặt lại mật khẩu truy cập</div>
          </div>
        </div>
        
        {state.pin && (
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '9px', color: t.mut, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Mật khẩu cũ</div>
            <input type="password" maxLength={6} inputMode="numeric" value={state.pold} onChange={e => updateState({ pold: e.target.value.replace(/\D/g, '') })} placeholder="Nhập 6 số cũ..." className="ti" style={{ textAlign: 'center', fontSize: '18px', letterSpacing: '4px' }} />
          </div>
        )}

        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '9px', color: t.mut, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Mật khẩu mới (6 số)</div>
          <input type="password" maxLength={6} inputMode="numeric" value={state.pnew} onChange={e => updateState({ pnew: e.target.value.replace(/\D/g, '') })} placeholder="Nhập 6 số mới..." className="ti" style={{ textAlign: 'center', fontSize: '18px', letterSpacing: '4px' }} />
        </div>

        <button onClick={() => {
          if (state.pin && state.pold !== state.pin) {
            toast('⚠️ Mật khẩu cũ không chính xác', 'error');
            return;
          }
          if (state.pnew.length !== 6) {
            toast('⚠️ Mật khẩu mới phải đúng 6 chữ số', 'error');
            return;
          }
          updateState({ pin: state.pnew, pnew: '', pold: '' });
          toast('✅ Đã cập nhật mật khẩu mới', 'success');
        }} style={{ width: '100%', padding: '12px', background: `${t.or}18`, border: `1px solid ${t.or}44`, borderRadius: '10px', color: t.or, fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif" }}>
          Xác nhận đổi mật khẩu
        </button>
      </div>
    </div>
  );
};
