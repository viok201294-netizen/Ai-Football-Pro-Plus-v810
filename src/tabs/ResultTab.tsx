import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { toast, haptic } from '../utils/toast';
import { ScoreStepper } from '../components/ScoreStepper';
import { shareResult } from '../utils/export';
import { exportSingleImg } from '../utils/exportImage';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';

const OC: Record<string, [string, string, string]> = {
  'W': ['✅', 'THẮNG', '#00e676'],
  'L': ['❌', 'THUA', '#ff1744'],
  'P': ['🤝', 'HOÀ', '#ffd700']
};

export const ResultTab: React.FC = () => {
  const { state, updateState, theme } = useAppContext();
  const r = state.ar;

  const updateScore = (ts: number, field: 'sA' | 'sB', val: string) => {
    const newHist = state.hist.map(item => item.ts === ts ? { ...item, [field]: val } : item);
    updateState({ hist: newHist, ar: { ...r, [field]: val } });
  };

  const [showTime, setShowTime] = useState(false);
  const [matchTime, setMatchTime] = useState(() => {
    if (!r) return '00:00';
    const d = new Date(r.ts);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });

  const handleExport = () => {
    if (!r) return;
    const [h, m] = matchTime.split(':').map(Number);
    const d = new Date(r.ts);
    d.setHours(h, m);
    
    const updatedR = { ...r, ts: d.getTime() };
    
    // Update history too
    const newHist = state.hist.map(item => item.ts === r.ts ? updatedR : item);
    updateState({ hist: newHist, ar: updatedR });
    
    setShowTime(false);
    haptic('tap');
    setTimeout(() => exportSingleImg(updatedR, theme), 400);
  };

  if (!r) return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: theme.mut }}>
      <div style={{ fontSize: '48px', marginBottom: '14px' }}>📊</div>
      <div style={{ fontSize: '13px', marginBottom: '18px' }}>Chưa có kết quả</div>
      <button onClick={() => updateState({ tab: 'analyze' })} style={{ padding: '12px 26px', background: theme.bg2, border: 'none', borderRadius: '11px', color: '#000', fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif" }}>Phân Tích Ngay</button>
    </div>
  );

  const sigStrip = [
    { lb: 'ODDS1', v: r.o1, c: r.eO1.c },
    { lb: 'GAP', v: r.gap, c: r.eG.c },
    { lb: 'P(≥3|B)', v: `${r.condP}%`, c: r.eCP.c },
    { lb: 'P_TOT', v: `${r.ptPct}%`, c: r.ePT.c },
  ];

  const ouBadge = r.outcomeOU ? <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 7px', borderRadius: '10px', background: `${OC[r.outcomeOU][2]}22`, color: OC[r.outcomeOU][2] }}>{OC[r.outcomeOU][0]} OU</span> : null;
  const hcBadge = r.outcomeHC ? <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 7px', borderRadius: '10px', background: `${OC[r.outcomeHC][2]}22`, color: OC[r.outcomeHC][2] }}>{OC[r.outcomeHC][0]} HC</span> : null;

  const markOutcomeOU = (ts: number, o: string) => {
    const newHist = state.hist.map(item => item.ts === ts ? { ...item, outcomeOU: item.outcomeOU === o ? null : o } : item);
    updateState({ hist: newHist, ar: { ...r, outcomeOU: r.outcomeOU === o ? null : o } });
    haptic(o === 'W' ? 'success' : o === 'L' ? 'error' : 'soft');
    toast(o === 'W' ? '⚽ TÀI/XỈU: THẮNG' : o === 'L' ? '⚽ TÀI/XỈU: THUA' : '⚽ TÀI/XỈU: HOÀ', o === 'W' ? 'success' : o === 'L' ? 'error' : 'info');
  };

  const markOutcomeHC = (ts: number, o: string) => {
    const newHist = state.hist.map(item => item.ts === ts ? { ...item, outcomeHC: item.outcomeHC === o ? null : o } : item);
    updateState({ hist: newHist, ar: { ...r, outcomeHC: r.outcomeHC === o ? null : o } });
    haptic(o === 'W' ? 'success' : o === 'L' ? 'error' : 'soft');
    toast(o === 'W' ? '♟️ KÈO CHẤP: THẮNG' : o === 'L' ? '♟️ KÈO CHẤP: THUA' : '♟️ KÈO CHẤP: HOÀ', o === 'W' ? 'success' : o === 'L' ? 'error' : 'info');
  };

  const saveNote = (ts: number, val: string) => {
    const v = val.trim();
    const newHist = state.hist.map(item => item.ts === ts ? { ...item, note: v } : item);
    updateState({ hist: newHist, ar: { ...r, note: v } });
    if (v) toast('📝 Đã lưu ghi chú', 'success');
  };

  const doReset = () => {
    updateState({ form: { tA: '', tB: '', lg: '', o1: '', o2: '', ml: 2.5, mh: '', hcSide: 'home' }, ar: null, tab: 'analyze', lgShow: false });
  };

  const togStep = (n: number) => {
    updateState({ cs: { ...state.cs, [n]: !state.cs[n] } });
  };

  return (
    <div style={{ paddingTop: '12px' }}>
      <div className="verdict-glow" style={{ borderRadius: '20px', overflow: 'hidden', border: `2px solid ${r.betC}66`, boxShadow: `0 0 50px ${r.betC}18, inset 0 1px 0 rgba(255,255,255,0.05)`, background: `linear-gradient(160deg, ${theme.bg} 0%, ${theme.card} 50%, ${r.betC}08 100%)`, marginBottom: '12px' }}>
        <div style={{ padding: '12px 16px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '8px', color: theme.mut, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '2px' }}>{r.form.lg || 'Phân tích kèo'}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: theme.gd, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.form.tA || 'Đội A'} vs {r.form.tB || 'Đội B'}</div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: theme.bg, padding: '6px 12px', borderRadius: '16px', border: `2px solid ${theme.ac}`, boxShadow: `0 0 20px ${theme.ac}33`, position: 'relative' }}>
                <ScoreStepper val={r.sA || '0'} onUpd={(v) => updateScore(r.ts, 'sA', v)} color={theme.ac} />
                <span style={{ fontSize: '18px', color: theme.mut, fontWeight: 900, opacity: 0.5 }}>:</span>
                <ScoreStepper val={r.sB || '0'} onUpd={(v) => updateScore(r.ts, 'sB', v)} color={theme.ac} />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '5px', flexShrink: 0, marginLeft: '8px' }}>{ouBadge}{hcBadge}</div>
        </div>

        <div style={{ padding: '16px 16px 4px', textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: `${r.betC}99`, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '5px' }}>ĐỀ XUẤT VÀO KÈO</div>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '52px', fontWeight: 900, color: r.betC, lineHeight: 1, letterSpacing: '4px', textShadow: `0 0 40px ${r.betC}44`, marginBottom: '3px' }}>{r.rec === 'T' ? 'TÀI' : 'XỈU'}</div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: `${r.betC}cc`, marginBottom: '12px' }}>{r.betLbl}</div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '10px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '8px', color: theme.mut, letterSpacing: '1px', marginBottom: '3px' }}>KH. TÀI</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: theme.gr, fontFamily: 'Rajdhani, monospace' }}>{r.safety.tPct}%</div>
            </div>
            <div style={{ textAlign: 'center', padding: '8px 12px', background: theme.bg, borderRadius: '12px', border: `1px solid ${r.betC}33` }}>
              <div style={{ fontSize: '20px', letterSpacing: '2px', marginBottom: '3px' }}>{r.conf.stars}</div>
              <div style={{ fontSize: '8px', color: r.conf.c, fontWeight: 700, letterSpacing: '1px' }}>{r.conf.lb}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '8px', color: theme.mut, letterSpacing: '1px', marginBottom: '3px' }}>KH. XỈU</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: theme.rd, fontFamily: 'Rajdhani, monospace' }}>{r.safety.xPct}%</div>
            </div>
          </div>

          <div style={{ height: '8px', borderRadius: '4px', overflow: 'hidden', display: 'flex', marginBottom: '3px' }}>
            <div style={{ width: `${r.safety.tPct}%`, background: `linear-gradient(90deg, ${theme.gr}, ${theme.gr}aa)`, minWidth: r.safety.tPct > 0 ? '4px' : '0' }}></div>
            <div style={{ flex: 1, background: `linear-gradient(90deg, ${theme.or}aa, ${theme.rd})` }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: theme.mut, marginBottom: '12px' }}>
            <span style={{ color: theme.gr }}>TÀI {r.safety.tPct}%</span><span style={{ color: theme.rd }}>XỈU {r.safety.xPct}%</span>
          </div>

          <div style={{ padding: '9px 12px', background: `${r.betC}0e`, border: `1px solid ${r.betC}33`, borderRadius: '10px', fontSize: '10px', color: theme.mut, lineHeight: 1.7, textAlign: 'left', marginBottom: '12px' }}>
            {r.rec === 'T'
              ? <span>📌 Kèo O{r.ml} → Đặt <b style={{ color: theme.gr }}>Tài O{r.safeLine}</b> — thắng đủ khi ≥ {Math.ceil(r.safeLine)} bàn</span>
              : <span>📌 Kèo O{r.ml} → Đặt <b style={{ color: theme.or }}>Xỉu O{r.safeLine}</b> — thắng đủ khi ≤ {Math.floor(r.safeLine)} bàn</span>
            }
          </div>
        </div>

        <div style={{ display: 'flex', borderTop: `1px solid ${theme.brd}33`, background: `${theme.bg}88` }}>
          {sigStrip.map((s, i) => (
            <React.Fragment key={i}>
              <div style={{ flex: 1, textAlign: 'center', padding: '8px 4px' }}>
                <div style={{ fontSize: '7px', color: theme.mut, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '3px' }}>{s.lb}</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: s.c, fontFamily: 'Rajdhani, monospace' }}>{s.v}</div>
                <div style={{ height: '2px', borderRadius: '1px', background: s.c, marginTop: '4px', opacity: 0.6 }}></div>
              </div>
              {i < sigStrip.length - 1 && <div style={{ width: '1px', background: `${theme.brd}33`, margin: '8px 0' }}></div>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={{ height: '1px', background: `linear-gradient(90deg, transparent, ${theme.or}44, transparent)`, margin: '6px 0 12px' }}></div>
      <div style={{ fontSize: '9px', color: theme.mut, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '9px' }}>♟️ KÈO CHẤP — SO SÁNH & KHUYẾN NGHỊ</div>
      
      {/* HANDICAP RESULT */}
      {r.hcResult ? (
        <div style={{ borderRadius: '13px', overflow: 'hidden', border: `2px solid ${theme.or}55`, background: theme.card, marginBottom: '12px' }}>
          <div style={{ padding: '11px 14px', background: `${theme.or}14`, borderBottom: `1px solid ${theme.or}33`, display: 'flex', alignItems: 'center', gap: '9px' }}>
            <span style={{ fontSize: '22px' }}>{r.hcResult.loai === 'ok' ? '✅' : r.hcResult.bay ? '🚨' : '⚠️'}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: theme.or, letterSpacing: '1px' }}>
                {r.hcResult.msg}
              </div>
            </div>
          </div>
          <div style={{ padding: '13px 14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ background: theme.bg, borderRadius: '10px', padding: '11px 8px', textAlign: 'center', border: `1px solid ${theme.a2}55` }}>
                <div style={{ fontSize: '8px', color: theme.mut, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Gợi ý (Module)</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: theme.a2, fontFamily: 'Rajdhani, monospace', lineHeight: 1 }}>{Math.abs(r.hcResult.goiy).toFixed(2)}</div>
              </div>
              <div style={{ textAlign: 'center', padding: '4px' }}>
                <div style={{ fontSize: '18px', color: theme.or }}>{r.hcResult.diff === 0 ? '=' : r.hcResult.goiy < r.hcResult.chinh ? '‹' : '›'}</div>
                <div style={{ fontSize: '9px', fontWeight: 700, color: theme.or, fontFamily: 'Rajdhani, monospace' }}>Δ{r.hcResult.diff.toFixed(2)}</div>
              </div>
              <div style={{ background: theme.bg, borderRadius: '10px', padding: '11px 8px', textAlign: 'center', border: `1px solid ${theme.or}55` }}>
                <div style={{ fontSize: '8px', color: theme.mut, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Kèo chính</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: theme.or, fontFamily: 'Rajdhani, monospace', lineHeight: 1 }}>{Math.abs(r.hcResult.chinh).toFixed(2)}</div>
              </div>
            </div>

            {/* Comparison Visual */}
            <div style={{ marginBottom: '15px', padding: '0 4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: theme.mut, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                <span>Module</span>
                <span>Chênh lệch: {r.hcResult.diff.toFixed(2)}</span>
                <span>Kèo chính</span>
              </div>
              <div style={{ height: '6px', background: `${theme.brd}44`, borderRadius: '3px', overflow: 'hidden', display: 'flex' }}>
                <div style={{ 
                  width: `${(Math.abs(r.hcResult.goiy) / (Math.abs(r.hcResult.goiy) + Math.abs(r.hcResult.chinh))) * 100}%`, 
                  background: theme.a2,
                  transition: 'width 0.6s ease'
                }}></div>
                <div style={{ flex: 1, background: theme.or }}></div>
              </div>
            </div>
            
            {r.hcResult.chon && (
              <div style={{ padding: '12px', borderRadius: '12px', background: `${theme.or}18`, border: `1.5px solid ${theme.or}66`, textAlign: 'center', boxShadow: `0 4px 15px ${theme.or}18` }}>
                <div style={{ fontSize: '10px', color: theme.mut, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px' }}>KHUYẾN NGHỊ ĐẦU TƯ</div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: theme.or, fontFamily: 'Orbitron, sans-serif', letterSpacing: '1px' }}>
                  {r.hcResult.chon === 'chap' ? `NẰM ĐỘI CHẤP` : `NẰM ĐỘI DƯỚI`}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: theme.txt, marginTop: '4px' }}>
                  {r.hcResult.chon === 'chap' ? (r.hcResult.side === 'home' ? r.form.tA : r.form.tB) : (r.hcResult.side === 'home' ? r.form.tB : r.form.tA)}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ borderRadius: '12px', padding: '14px', background: theme.bg, border: `1px solid ${theme.brd}`, display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <span style={{ fontSize: '24px' }}>♟️</span>
          <div>
            <div style={{ fontSize: '10px', color: theme.mut, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '3px' }}>Gợi ý kèo chấp (từ BTTS)</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: theme.a2, fontFamily: 'Rajdhani, monospace', lineHeight: 1 }}>{Math.abs(r.goiyChap || 0).toFixed(2)}</div>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: '9px', color: theme.mut, textAlign: 'right', lineHeight: 1.6 }}>Chưa nhập<br />kèo chính</div>
        </div>
      )}

      {/* ALERTS */}
      {r.conflict && (
        <div className="alert-conflict" style={{ background: `${theme.gd}0a`, borderColor: `${theme.gd}55` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '8px' }}>
            <span style={{ fontSize: '20px' }}>⚠️</span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: theme.gd }}>TÍN HIỆU MÂU THUẪN</div>
              <div style={{ fontSize: '10px', color: theme.mut }}>{r.tS} Tài · {r.xS} Xỉu · V7.2: Quyết định bởi P_total vs 53%</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {r.sigs.map((s: string, i: number) => {
              const lbs = ['odds1', 'GAP', 'P(≥3|B)', 'P_total'];
              const cs = [r.eO1.c, r.eG.c, r.eCP.c, r.ePT.c];
              return <span key={i} className="chip" style={{ background: `${cs[i]}22`, color: cs[i] }}>{lbs[i]}:{s === 'T' ? 'TÀI' : s === 'X' ? 'XỈU' : '⚠️'}</span>;
            })}
          </div>
          {r.specials.length > 0 && (
            <div style={{ marginTop: '8px', borderTop: `1px solid ${theme.gd}22`, paddingTop: '8px' }}>
              {r.specials.map((sp: string, i: number) => <div key={i} style={{ fontSize: '10px', color: theme.ac, lineHeight: 1.7 }}>{sp}</div>)}
            </div>
          )}
        </div>
      )}

      {!r.safety.safe && (
        <div className="alert-danger" style={{ background: `${theme.rd}08`, borderColor: `${theme.rd}44` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '10px' }}>
            <span style={{ fontSize: '18px' }}>🔴</span>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: theme.rd }}>ĐÁNH GIÁ KHÔNG AN TOÀN</div>
              <div style={{ fontSize: '10px', color: theme.mut }}>Độ tin cậy thấp — xem xét kỹ trước khi vào kèo</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '5px' }}>
            <span style={{ color: theme.gr }}>▪ Khả năng TÀI: <b>{r.safety.tPct}%</b></span>
            <span style={{ color: theme.or }}>▪ Khả năng XỈU: <b>{r.safety.xPct}%</b></span>
          </div>
          <div style={{ height: '12px', borderRadius: '6px', overflow: 'hidden', display: 'flex', gap: 0 }}>
            <div style={{ width: `${r.safety.tPct}%`, background: theme.gr, minWidth: r.safety.tPct > 0 ? '4px' : '0' }}></div>
            <div style={{ flex: 1, background: theme.or }}></div>
          </div>
          <div style={{ fontSize: '10px', color: theme.mut, marginTop: '7px' }}>
            Nhận định <b style={{ color: r.betC }}>{r.rec === 'T' ? 'TÀI' : 'XỈU'}</b> với xác suất ước tính <b style={{ color: r.betC }}>{r.rec === 'T' ? r.safety.tPct : r.safety.xPct}%</b> — đối lập {r.rec === 'T' ? r.safety.xPct : r.safety.tPct}%
          </div>
        </div>
      )}

      {/* VISUAL ANALYSIS SECTION */}
      {r.safety && (
        <div style={{ marginBottom: '16px', background: theme.card, borderRadius: '16px', border: `1px solid ${theme.brd}`, padding: '16px', overflow: 'hidden' }}>
          <div style={{ fontSize: '9px', color: theme.mut, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: theme.ac }}>📊</span> Biểu đồ phân tích trực quan
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            {/* Probability Pie Chart */}
            <div style={{ height: '140px', position: 'relative', background: `${theme.bg}55`, borderRadius: '12px', padding: '8px' }}>
              <div style={{ fontSize: '8px', color: theme.mut, textAlign: 'center', marginBottom: '4px' }}>XÁC SUẤT T/X</div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Tài', value: r.safety.tPct },
                      { name: 'Xỉu', value: r.safety.xPct }
                    ]}
                    cx="50%"
                    cy="70%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={40}
                    outerRadius={55}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    <Cell fill={theme.gr} />
                    <Cell fill={theme.or} />
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: theme.card, border: `1px solid ${theme.brd}`, borderRadius: '8px', fontSize: '10px' }}
                    itemStyle={{ color: theme.txt }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', bottom: '20px', left: 0, right: 0, textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: r.betC, fontFamily: 'Rajdhani' }}>{r.rec === 'T' ? r.safety.tPct : r.safety.xPct}%</div>
                <div style={{ fontSize: '7px', color: theme.mut }}>{r.rec === 'T' ? 'TÀI' : 'XỈU'}</div>
              </div>
            </div>

            {/* Radar Chart for Signal Strength */}
            <div style={{ height: '140px', background: `${theme.bg}55`, borderRadius: '12px', padding: '8px' }}>
              <div style={{ fontSize: '8px', color: theme.mut, textAlign: 'center', marginBottom: '4px' }}>CƯỜNG ĐỘ TÍN HIỆU</div>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="60%" data={[
                  { subject: 'O1', A: r.eO1.sig === 'T' ? 100 : r.eO1.sig === 'X' ? 20 : 60 },
                  { subject: 'GAP', A: r.eG.sig === 'T' ? 100 : r.eG.sig === 'X' ? 20 : 60 },
                  { subject: 'CP', A: r.eCP.sig === 'T' ? 100 : r.eCP.sig === 'X' ? 20 : 60 },
                  { subject: 'PT', A: r.ePT.sig === 'T' ? 100 : r.ePT.sig === 'X' ? 20 : 60 },
                ]}>
                  <PolarGrid stroke={theme.brd} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: theme.mut, fontSize: 8 }} />
                  <Radar name="Sức mạnh" dataKey="A" stroke={theme.ac} fill={theme.ac} fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Signal Bias Bar Chart */}
          <div style={{ height: '120px', background: `${theme.bg}55`, borderRadius: '12px', padding: '12px 8px 4px' }}>
            <div style={{ fontSize: '8px', color: theme.mut, textAlign: 'center', marginBottom: '8px' }}>CHI TIẾT 4 CHỈ SỐ (TÀI {'>'} 0 {'>'} XỈU)</div>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'O1', val: r.eO1.sig === 'T' ? 1 : r.eO1.sig === 'X' ? -1 : 0 },
                  { name: 'GAP', val: r.eG.sig === 'T' ? 1 : r.eG.sig === 'X' ? -1 : 0 },
                  { name: 'CP', val: r.eCP.sig === 'T' ? 1 : r.eCP.sig === 'X' ? -1 : 0 },
                  { name: 'PT', val: r.ePT.sig === 'T' ? 1 : r.ePT.sig === 'X' ? -1 : 0 },
                ]}
                margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={theme.brd} vertical={false} />
                <XAxis dataKey="name" tick={{ fill: theme.mut, fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis domain={[-1, 1]} ticks={[-1, 0, 1]} tick={{ fill: theme.mut, fontSize: 8 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const v = payload[0].value;
                      const label = v === 1 ? 'TÀI' : v === -1 ? 'XỈU' : 'HOÀ';
                      const color = v === 1 ? theme.gr : v === -1 ? theme.rd : theme.gd;
                      return (
                        <div style={{ background: theme.card, border: `1px solid ${theme.brd}`, padding: '4px 8px', borderRadius: '6px', fontSize: '10px' }}>
                          <span style={{ color }}>{label}</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="val">
                  {
                    [
                      { name: 'O1', val: r.eO1.sig === 'T' ? 1 : r.eO1.sig === 'X' ? -1 : 0 },
                      { name: 'GAP', val: r.eG.sig === 'T' ? 1 : r.eG.sig === 'X' ? -1 : 0 },
                      { name: 'CP', val: r.eCP.sig === 'T' ? 1 : r.eCP.sig === 'X' ? -1 : 0 },
                      { name: 'PT', val: r.ePT.sig === 'T' ? 1 : r.ePT.sig === 'X' ? -1 : 0 },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.val === 1 ? theme.gr : entry.val === -1 ? theme.rd : theme.gd} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {r.kp.skip ? (
        <div style={{ background: `${theme.mut}0a`, border: `1px solid ${theme.mut}22`, borderRadius: '11px', padding: '10px 12px', marginBottom: '11px', fontSize: '10px', color: theme.mut }}>
          💡 <b>Kèo phụ vs kèo chính:</b> {r.kp.msg}
        </div>
      ) : (
        <div style={{ background: `${r.kp.c}${r.kp.pri ? '12' : '08'}`, border: `${r.kp.pri ? '2' : '1'}px solid ${r.kp.c}${r.kp.pri ? '66' : '33'}`, borderRadius: '11px', padding: '12px 13px', marginBottom: '11px', boxShadow: r.kp.pri ? `0 0 20px ${r.kp.c}18` : 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: r.kp.pri ? '20px' : '16px' }}>{r.kp.pri ? '⚡' : '💎'}</span>
            <div>
              <div style={{ fontSize: r.kp.pri ? '13px' : '11px', fontWeight: 700, color: r.kp.c }}>{r.kp.pri ? 'ƯU TIÊN KÈO PHỤ BTTS+O2.5' : 'So sánh kèo phụ vs kèo chính'}</div>
              <div style={{ fontSize: '10px', color: theme.mut, marginTop: '2px' }}>{r.kp.msg}</div>
            </div>
          </div>
          {r.kp.pri && (
            <div style={{ marginTop: '9px', padding: '9px 11px', background: `${r.kp.c}15`, borderRadius: '8px', fontSize: '10px', color: r.kp.c, lineHeight: 1.7 }}>
              Chênh lệch xác suất bất thường → nhà cái có thể định giá sai kèo chính.<br />
              <b>Gợi ý:</b> Xem xét đặt thẳng kèo phụ <b>BTTS + O2.5</b> thay vì kèo chính.
            </div>
          )}
        </div>
      )}

      <div style={{ fontSize: '9px', color: theme.mut, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ color: theme.a2 }}>▸</span> Chi tiết phân tích 6 bước</div>
      
      {/* STEPS */}
      {[
        { n: 1, c: theme.a2, ti: 'Bước 1 — Xác suất cơ bản', sum: `P(≥2)=${r.p2}%, P(≥3)=${r.p3}%, GAP=${r.gap}`, hl: false, body: (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '7px', marginBottom: '11px' }}>
              {[
                ['P(BTTS≥2)', `${r.p2}%`, theme.gd, `1÷${r.o1}`],
                ['P(BTTS≥3)', `${r.p3}%`, theme.ac, `1÷${r.o2}`],
                ['GAP', `${r.gap}`, theme.a2, `odds2−odds1`]
              ].map(([lb, vl, c, sub], i) => (
                <div key={i} style={{ background: theme.bg, borderRadius: '9px', padding: '10px 7px', textAlign: 'center', border: `1px solid ${theme.brd}` }}>
                  <div style={{ fontSize: '8px', color: theme.mut, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '3px' }}>{lb}</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: c, fontFamily: "'Rajdhani', monospace" }}>{vl}</div>
                  <div style={{ fontSize: '8px', color: theme.mut, marginTop: '2px' }}>{sub}</div>
                </div>
              ))}
            </div>
          </>
        )},
        { n: 2, c: theme.gd, ti: 'Bước 2 — Ngưỡng odds1 & GAP', sum: `odds1=${r.o1}→${r.eO1.lv} | GAP=${r.gap}→${r.eG.lb}`, hl: false, body: (
          <>
            <div style={{ marginBottom: '11px', background: theme.bg, borderRadius: '9px', padding: '11px', border: `1px solid ${r.eO1.c}44` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '17px' }}>{r.eO1.ic}</span>
                <div style={{ fontSize: '13px', fontWeight: 700, color: r.eO1.c }}>{r.eO1.lv}</div>
              </div>
              <div style={{ fontSize: '11px', color: theme.mut, lineHeight: 1.6 }}>{r.eO1.nt}</div>
            </div>
            <div style={{ background: theme.bg, borderRadius: '9px', padding: '11px', border: `1px solid ${r.eG.c}44` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '17px' }}>{r.eG.ic}</span>
                <div style={{ fontSize: '13px', fontWeight: 700, color: r.eG.c }}>{r.eG.lb}</div>
              </div>
              <div style={{ fontSize: '11px', color: theme.mut, lineHeight: 1.6 }}>{r.eG.nt}</div>
            </div>
          </>
        )},
        { n: 3, c: r.eCP.c, ti: 'Bước 3 — P(≥3|BTTS) [QUYẾT ĐỊNH]', sum: `${r.condP}% → ${r.eCP.lb}`, hl: true, body: (
          <>
            <div style={{ textAlign: 'center', marginBottom: '13px' }}>
              <div style={{ fontSize: '9px', color: theme.mut, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '5px' }}>P(≥3|BTTS) = odds1 ÷ odds2</div>
              <div style={{ fontSize: '9px', color: theme.mut, marginBottom: '9px' }}>{r.o1} ÷ {r.o2} × 100</div>
              <div style={{ fontSize: '42px', fontWeight: 700, color: r.eCP.c, fontFamily: "'Rajdhani', monospace", lineHeight: 1 }}>{r.condP}%</div>
              <div style={{ marginTop: '7px' }}><span className="chip" style={{ background: `${r.eCP.c}22`, color: r.eCP.c }}>{r.eCP.lb}</span></div>
            </div>
            <div style={{ background: theme.bg, borderRadius: '8px', padding: '10px', border: `1px solid ${r.eCP.c}33`, fontSize: '11px', color: theme.mut, lineHeight: 1.7 }}>{r.eCP.nt}</div>
          </>
        )},
        { n: 4, c: r.ePT.c, ti: 'Bước 4–5 — P_total(≥3) vs 51%', sum: `${r.ptPct}% → ${r.ePT.lb}`, hl: true, body: (
          <>
            <div style={{ display: 'flex', alignItems: 'stretch', borderRadius: '11px', overflow: 'hidden', border: `1px solid ${theme.brd}`, marginBottom: '13px' }}>
              <div style={{ flex: 1, padding: '13px 8px', textAlign: 'center', background: `${theme.ac}0a` }}>
                <div style={{ fontSize: '8px', color: theme.mut, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>P_total(≥3)</div>
                <div style={{ fontSize: '32px', fontWeight: 700, color: theme.ac, fontFamily: "'Rajdhani', monospace", lineHeight: 1 }}>{r.ptPct}%</div>
              </div>
              <div style={{ width: '1px', background: theme.brd }}></div>
              <div style={{ width: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${r.ePT.c}0a`, flexShrink: 0 }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: r.ePT.c }}>{r.ptPct > state.cfg.pt_bench ? '>' : '<'}</div>
              </div>
              <div style={{ width: '1px', background: theme.brd }}></div>
              <div style={{ flex: 1, padding: '13px 8px', textAlign: 'center', background: `${theme.gd}0a` }}>
                <div style={{ fontSize: '8px', color: theme.mut, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Ngưỡng</div>
                <div style={{ fontSize: '32px', fontWeight: 700, color: theme.gd, fontFamily: "'Rajdhani', monospace", lineHeight: 1 }}>{state.cfg.pt_bench}%</div>
              </div>
            </div>
            <div style={{ padding: '11px', borderRadius: '9px', textAlign: 'center', background: `${r.ePT.c}10`, border: `1px solid ${r.ePT.c}44` }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: r.ePT.c }}>{r.ePT.ic} {r.ePT.lb}</div>
            </div>
          </>
        )},
        { n: 5, c: r.conflict ? theme.gd : r.rec === 'T' ? theme.gr : theme.or, ti: 'Bước 6 — Tổng hợp & Kết luận', sum: `${r.tS} Tài · ${r.xS} Xỉu · ${r.conflict ? '⚡ Mâu thuẫn' : '✅ Đồng thuận'}`, hl: r.conflict, body: (
          <>
            <div style={{ fontSize: '10px', color: theme.mut, fontStyle: 'italic', lineHeight: 1.7, padding: '10px', background: theme.bg, borderRadius: '8px', border: `1px solid ${theme.brd}`, marginBottom: '9px' }}>💡 {r.reason}</div>
          </>
        )}
      ].map((s, i) => (
        <div key={i} className="sc" style={{ borderColor: `${s.c}${s.hl ? '88' : '33'}`, background: theme.card, boxShadow: s.hl ? `0 0 25px ${s.c}14` : 'none' }}>
          <div className="sh" onClick={() => togStep(s.n)}>
            <div className="sbadge" style={{ background: `${s.c}22`, color: s.c, borderColor: `${s.c}44` }}>{s.n}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '9px', color: theme.mut, textTransform: 'uppercase', letterSpacing: '1px' }}>{s.ti}</div>
              {!state.cs[s.n] && <div style={{ fontSize: '12px', fontWeight: 700, color: theme.txt, marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.sum}</div>}
            </div>
            {s.hl && <span className="chip" style={{ background: `${s.c}22`, color: s.c }}>KEY</span>}
            <span className={`sarr ${state.cs[s.n] ? 'open' : ''}`}>▾</span>
          </div>
          <AnimatePresence>
            {state.cs[s.n] && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                style={{ overflow: 'hidden' }}
              >
                <div className="sbody">{s.body}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {/* OUTCOME TRACKING */}
      <div style={{ marginTop: '14px', background: theme.card, borderRadius: '13px', border: `1px solid ${theme.brd}`, overflow: 'hidden' }}>
        <div style={{ padding: '10px 13px', borderBottom: `1px solid ${theme.brd}44`, fontSize: '9px', color: theme.mut, letterSpacing: '2px', textTransform: 'uppercase', textAlign: 'center' }}>📝 KẾT QUẢ THỰC TẾ (tuỳ chọn)</div>
        <div style={{ padding: '10px 13px', borderBottom: `1px solid ${theme.brd}33` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '7px' }}>
            <span style={{ fontSize: '14px' }}>⚽</span>
            <div style={{ fontSize: '10px', fontWeight: 700, color: theme.gr }}>TÀI XỈU</div>
            {r.outcomeOU ? <div style={{ marginLeft: 'auto', fontSize: '10px', fontWeight: 700, color: OC[r.outcomeOU][2] }}>{OC[r.outcomeOU][0]} {OC[r.outcomeOU][1]}</div> : <div style={{ marginLeft: 'auto', fontSize: '9px', color: `${theme.mut}55` }}>chưa cập nhật</div>}
          </div>
          <div style={{ display: 'flex', gap: '5px' }}>
            {Object.entries(OC).map(([k, [ic, lb, c]]) => {
              const sel = r.outcomeOU === k;
              return <button key={k} onClick={() => markOutcomeOU(r.ts, k)} style={{ flex: 1, padding: '6px 2px', borderRadius: '8px', border: `1.5px solid ${sel ? `${c}88` : `${c}33`}`, background: sel ? `${c}20` : 'transparent', color: sel ? c : `${c}88`, fontSize: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Rajdhani, sans-serif', transition: 'all 0.13s' }}>{ic} {lb}</button>;
            })}
          </div>
        </div>
        <div style={{ padding: '10px 13px', borderBottom: `1px solid ${theme.brd}33` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '7px' }}>
            <span style={{ fontSize: '14px' }}>♟️</span>
            <div style={{ fontSize: '10px', fontWeight: 700, color: theme.or }}>KÈO CHẤP</div>
            {r.outcomeHC ? <div style={{ marginLeft: 'auto', fontSize: '10px', fontWeight: 700, color: OC[r.outcomeHC][2] }}>{OC[r.outcomeHC][0]} {OC[r.outcomeHC][1]}</div> : <div style={{ marginLeft: 'auto', fontSize: '9px', color: `${theme.mut}55` }}>chưa cập nhật</div>}
          </div>
          {r.hcResult ? (
            <div style={{ display: 'flex', gap: '5px' }}>
              {Object.entries(OC).map(([k, [ic, lb, c]]) => {
                const sel = r.outcomeHC === k;
                return <button key={k} onClick={() => markOutcomeHC(r.ts, k)} style={{ flex: 1, padding: '6px 2px', borderRadius: '8px', border: `1.5px solid ${sel ? `${c}88` : `${c}33`}`, background: sel ? `${c}20` : 'transparent', color: sel ? c : `${c}88`, fontSize: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Rajdhani, sans-serif', transition: 'all 0.13s' }}>{ic} {lb}</button>;
              })}
            </div>
          ) : (
            <div style={{ fontSize: '9px', color: `${theme.mut}55`, textAlign: 'center', padding: '4px 0' }}>Chưa nhập kèo chấp ở bước phân tích</div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '7px', marginTop: '11px' }}>
        <button onClick={() => updateState({ tab: 'analyze' })} style={{ flex: 2, padding: '13px', background: theme.bg2, border: 'none', borderRadius: '12px', color: '#000', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.5px' }}>⚡ Phân Tích Mới</button>
        <button onClick={() => { haptic('tap'); setShowTime(true); }} style={{ flex: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '13px', background: `${theme.gr}18`, border: `1px solid ${theme.gr}44`, borderRadius: '12px', color: theme.gr, fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif" }}>
          <span>📸</span>
          <span>XUẤT ẢNH</span>
        </button>
        <button onClick={() => shareResult(r)} style={{ flex: 1, padding: '13px', background: `${theme.ac}18`, border: `1px solid ${theme.ac}44`, borderRadius: '12px', color: theme.ac, fontSize: '13px', cursor: 'pointer' }} title="Copy text">📤</button>
        <button onClick={doReset} style={{ flex: 1, padding: '13px', background: 'transparent', border: `1px solid ${theme.brd}`, borderRadius: '12px', color: theme.mut, fontSize: '13px', cursor: 'pointer' }} title="Reset">↺</button>
      </div>

      <AnimatePresence>
        {showTime && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '20px', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
            <motion.div 
              initial={{ y: -100, scale: 0.8, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: -50, scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              style={{ width: '100%', maxWidth: '340px', background: theme.card, borderRadius: '24px', border: `2px solid ${theme.gr}55`, overflow: 'hidden', boxShadow: `0 20px 50px rgba(0,0,0,0.5)` }}
            >
              <div style={{ padding: '20px', textAlign: 'center', background: `linear-gradient(180deg, ${theme.gr}15, transparent)` }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🕒</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: theme.gr, letterSpacing: '1px', textTransform: 'uppercase' }}>Thời gian bắt đầu</div>
                <div style={{ fontSize: '10px', color: theme.mut, marginTop: '4px' }}>Vui lòng nhập giờ và phút để xuất ảnh</div>
              </div>

              <div style={{ padding: '24px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="time" 
                    value={matchTime}
                    onChange={(e) => setMatchTime(e.target.value)}
                    style={{ 
                      background: theme.bg, 
                      border: `2px solid ${theme.brd}`, 
                      borderRadius: '16px', 
                      padding: '15px 20px', 
                      color: theme.txt, 
                      fontSize: '32px', 
                      fontWeight: 800, 
                      fontFamily: 'Orbitron, sans-serif',
                      outline: 'none',
                      textAlign: 'center',
                      width: '180px'
                    }}
                  />
                  <div style={{ position: 'absolute', top: '-8px', left: '15px', background: theme.card, padding: '0 8px', fontSize: '9px', color: theme.mut, fontWeight: 700 }}>GIỜ : PHÚT</div>
                </div>
              </div>

              <div style={{ padding: '0 20px 20px', display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => setShowTime(false)}
                  style={{ flex: 1, padding: '14px', borderRadius: '14px', background: 'transparent', border: `1px solid ${theme.brd}`, color: theme.mut, fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                >
                  HUỶ BỎ
                </button>
                <button 
                  onClick={handleExport}
                  style={{ flex: 2, padding: '14px', borderRadius: '14px', background: theme.gr, border: 'none', color: '#000', fontSize: '12px', fontWeight: 800, cursor: 'pointer', boxShadow: `0 4px 15px ${theme.gr}44` }}
                >
                  XÁC NHẬN & XUẤT
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
