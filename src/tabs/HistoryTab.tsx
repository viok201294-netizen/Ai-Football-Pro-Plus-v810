import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { toast, haptic } from '../utils/toast';
import { ScoreStepper } from '../components/ScoreStepper';

export const HistoryTab: React.FC = () => {
  const { state, updateState, theme } = useAppContext();
  const t = theme;
  const H = state.hist;

  const setSub = (id: string) => updateState({ sub: id });

  const updateScore = (ts: number, field: 'sA' | 'sB', val: string) => {
    const newHist = state.hist.map(item => item.ts === ts ? { ...item, [field]: val } : item);
    const updates: any = { hist: newHist };
    if (state.ar && state.ar.ts === ts) {
      updates.ar = { ...state.ar, [field]: val };
    }
    updateState(updates);
  };

  const renderHistList = () => {
    const searchTerm = (state.histFilter.lg || '').toLowerCase().trim();
    const recFilter = state.histFilter.rec; // 'T' or 'X' or ''
    
    const filteredH = H.filter(r => {
      const matchesSearch = !searchTerm || (
        (r.form.lg || '').toLowerCase().includes(searchTerm) || 
        (r.form.tA || '').toLowerCase().includes(searchTerm) || 
        (r.form.tB || '').toLowerCase().includes(searchTerm)
      );
      const matchesRec = !recFilter || r.rec === recFilter;
      return matchesSearch && matchesRec;
    });

    return (
      <div>
        <div style={{ marginBottom: '9px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input type="text" value={state.histFilter.lg} onChange={e => updateState({ histFilter: { ...state.histFilter, lg: e.target.value } })} placeholder="Tìm giải, đội bóng..." style={{ width: '100%', padding: '8px 10px 8px 28px', background: t.bg, border: `1px solid ${t.brd}`, borderRadius: '9px', color: t.txt, fontSize: '12px', fontFamily: "'Rajdhani', sans-serif", outline: 'none' }} />
              <span style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', color: t.mut, fontSize: '12px' }}>🔍</span>
              {state.histFilter.lg && <span onClick={() => updateState({ histFilter: { ...state.histFilter, lg: '' } })} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', color: t.mut, cursor: 'pointer', fontSize: '14px' }}>✕</span>}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
            {[
              { id: '', lb: 'Tất cả', c: t.ac },
              { id: 'T', lb: 'Trận Tài', c: t.gr },
              { id: 'X', lb: 'Trận Xỉu', c: t.or }
            ].map(f => (
              <button 
                key={f.id} 
                onClick={() => updateState({ histFilter: { ...state.histFilter, rec: f.id } })}
                style={{ 
                  flex: 1, 
                  padding: '6px', 
                  fontSize: '10px', 
                  fontWeight: 700, 
                  borderRadius: '8px', 
                  border: `1px solid ${state.histFilter.rec === f.id ? f.c : t.brd}`,
                  background: state.histFilter.rec === f.id ? `${f.c}22` : 'transparent',
                  color: state.histFilter.rec === f.id ? f.c : t.mut,
                  cursor: 'pointer',
                  fontFamily: "'Rajdhani', sans-serif"
                }}
              >
                {f.lb}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ fontSize: '9px', color: t.mut, letterSpacing: '2px', fontWeight: 700, textTransform: 'uppercase' }}>Dữ liệu lưu trữ</div>
              <div style={{ background: `${t.ac}22`, color: t.ac, fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '10px', border: `1px solid ${t.ac}33` }}>
                {filteredH.length} {searchTerm || recFilter ? `/ ${H.length}` : ''}
              </div>
            </div>
            {H.length > 0 && (
              <div style={{ display: 'flex', gap: '5px' }}>
                <button onClick={() => updateState({ 
                  conf: { 
                    show: true, 
                    title: 'Xoá tất cả lịch sử?', 
                    msg: 'Hành động này sẽ xoá toàn bộ dữ liệu phân tích đã lưu. Bạn không thể hoàn tác.', 
                    onOk: () => {
                      updateState({ hist: [], ar: null, cids: [] });
                      toast('🗑 Đã xoá toàn bộ lịch sử', 'info');
                    }
                  } 
                })} style={{ fontSize: '9px', color: `${t.rd}88`, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif" }}>🗑 Xoá tất cả</button>
              </div>
            )}
          </div>
        </div>

        {filteredH.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: t.mut }}>
            <div style={{ fontSize: '44px', marginBottom: '11px' }}>{searchTerm ? '🔍' : '📂'}</div>
            <div style={{ marginBottom: '16px' }}>{searchTerm ? 'Không tìm thấy kết quả nào' : 'Chưa có lịch sử'}</div>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {filteredH.map((r, i) => {
              const d = new Date(r.ts);
              const tm = `${d.getDate()}/${d.getMonth() + 1} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
              const sel = state.ar && state.ar.ts === r.ts;

              return (
                <motion.div 
                  key={r.ts}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: Math.min(i * 0.03, 0.3) }}
                  onClick={() => { updateState({ ar: r, tab: 'result' }); haptic('tap'); }} 
                  className="card" 
                  style={{ background: sel ? `linear-gradient(135deg, ${t.a2}18, ${t.card})` : t.card, borderColor: sel ? `${t.a2}66` : t.brd, cursor: 'pointer', transition: 'border-color 0.15s, background 0.15s' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: t.gd, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.form.tA || 'Đội A'} vs {r.form.tB || 'Đội B'}</div>
                    <div style={{ fontSize: '9px', color: t.mut, marginTop: '2px' }}>{r.form.lg || '—'} · {tm}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginLeft: '9px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={e => e.stopPropagation()}>
                      <ScoreStepper val={r.sA || '0'} onUpd={(v) => updateScore(r.ts, 'sA', v)} color={t.ac} />
                      <span style={{ fontSize: '12px', color: t.mut, fontWeight: 900, opacity: 0.5 }}>:</span>
                      <ScoreStepper val={r.sB || '0'} onUpd={(v) => updateScore(r.ts, 'sB', v)} color={t.ac} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
                      <span className="chip" style={{ background: `${r.betC}22`, color: r.betC }}>{r.rec === 'T' ? 'TÀI' : 'XỈU'}</span>
                      <div style={{ fontSize: '9px', color: t.mut }}>{r.conf.lb}</div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '8px' }}>
                  <div style={{ borderRadius: '11px', overflow: 'hidden', border: `1.5px solid ${r.betC}`, background: `linear-gradient(160deg, ${t.bg}, ${t.card} 60%, ${t.bg})` }}>
                    <div style={{ background: `linear-gradient(90deg, ${r.betC}33, ${r.betC}18, ${r.betC}33)`, padding: '7px 11px', display: 'flex', alignItems: 'center', gap: '7px', borderBottom: `1px solid ${r.betC}33` }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: r.betC, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', flexShrink: 0 }}>{r.safety.safe ? '✅' : '⚠️'}</div>
                      <div style={{ flex: 1 }}><div style={{ fontSize: '10px', fontWeight: 700, color: '#fff', letterSpacing: '1.5px', textTransform: 'uppercase' }}>ĐỀ XUẤT VÀO KÈO</div></div>
                      <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 7px', borderRadius: '8px', background: `${r.conf.c}22`, color: r.conf.c }}>{r.conf.lb}</span>
                    </div>
                    <div style={{ padding: '10px 11px', textAlign: 'center' }}>
                      <div style={{ fontSize: '26px', fontWeight: 700, color: r.betC, letterSpacing: '2px', fontFamily: 'Orbitron, monospace', lineHeight: 1, marginBottom: '3px' }}>{r.rec === 'T' ? 'TÀI' : 'XỈU'}</div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: `${r.betC}cc`, marginBottom: '8px' }}>{r.betLbl}</div>
                      
                      {r.hcResult && (
                        <div style={{ marginBottom: '8px', padding: '6px', background: `${t.or}10`, borderRadius: '8px', border: `1px dashed ${t.or}33` }}>
                          <div style={{ fontSize: '7px', color: t.mut, textTransform: 'uppercase', marginBottom: '2px' }}>Kèo chấp gợi ý</div>
                          <div style={{ fontSize: '10px', fontWeight: 700, color: t.or }}>
                            {r.hcResult.chon === 'chap' ? 'Nằm Đội Chấp' : r.hcResult.chon === 'duoc_chap' ? 'Nằm Đội Dưới' : 'Bỏ qua'}
                          </div>
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '8px' }}>
                        <div style={{ background: t.bg, borderRadius: '7px', padding: '5px 9px', border: `1px solid ${t.gr}33` }}>
                          <div style={{ fontSize: '7px', color: t.mut, letterSpacing: '1px' }}>KH. TÀI</div>
                          <div style={{ fontSize: '14px', fontWeight: 700, color: t.gr, fontFamily: 'Rajdhani, monospace' }}>{r.safety.tPct || '—'}%</div>
                        </div>
                        <div style={{ background: t.bg, borderRadius: '7px', padding: '5px 11px', border: `1px solid ${r.betC}44`, display: 'flex', alignItems: 'center' }}>
                          <div style={{ fontSize: '16px' }}>{r.conf.stars}</div>
                        </div>
                        <div style={{ background: t.bg, borderRadius: '7px', padding: '5px 9px', border: `1px solid ${t.rd}33` }}>
                          <div style={{ fontSize: '7px', color: t.mut, letterSpacing: '1px' }}>KH. XỈU</div>
                          <div style={{ fontSize: '14px', fontWeight: 700, color: t.rd, fontFamily: 'Rajdhani, monospace' }}>{r.safety.xPct || '—'}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {r.conflict && <span className="chip" style={{ background: `${t.gd}22`, color: t.gd }}>⚠️ Mâu thuẫn</span>}
                    {r.kp.pri && <span className="chip" style={{ background: `${t.rd}22`, color: t.rd }}>⚡ Kèo phụ</span>}
                    {!r.safety.safe && <span className="chip" style={{ background: `${t.rd}22`, color: t.rd }}>🔴 Không AT</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button onClick={(e) => { e.stopPropagation(); updateState({ form: { ...r.form }, ar: null, tab: 'analyze', lgShow: false }); toast('🔄 Đã tải lại thông tin', 'info'); }} style={{ fontSize: '9px', color: t.a2, background: `${t.a2}10`, border: `1px solid ${t.a2}33`, borderRadius: '7px', padding: '4px 8px', cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif" }}>🔄 Phân tích lại</button>
                    <button onClick={(e) => { 
                      e.stopPropagation(); 
                      updateState({ 
                        conf: { 
                          show: true, 
                          title: 'Xoá mục này?', 
                          msg: `Bạn có chắc chắn muốn xoá kết quả trận ${r.form.tA} vs ${r.form.tB}?`, 
                          onOk: () => {
                            updateState({ 
                              hist: state.hist.filter(item => item.ts !== r.ts), 
                              cids: state.cids.filter(x => x !== r.ts), 
                              ar: state.ar?.ts === r.ts ? null : state.ar 
                            });
                            toast('🗑 Đã xoá mục lịch sử', 'info');
                          }
                        } 
                      });
                    }} style={{ fontSize: '10px', color: `${t.rd}99`, background: `${t.rd}08`, border: `1px solid ${t.rd}22`, borderRadius: '7px', padding: '4px 8px', cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif" }}>🗑 Xoá</button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}
      </div>
    );
  };

  const renderStats = () => {
    const searchTerm = (state.histFilter.lg || '').toLowerCase().trim();
    const filteredH = searchTerm
      ? H.filter(r => {
          const lg = r.form.lg || '';
          const tA = r.form.tA || '';
          const tB = r.form.tB || '';
          return lg.toLowerCase().includes(searchTerm) || tA.toLowerCase().includes(searchTerm) || tB.toLowerCase().includes(searchTerm);
        })
      : H;

    if (!H.length) return <div style={{ textAlign: 'center', padding: '40px 20px', color: t.mut }}><div style={{ fontSize: '44px', marginBottom: '11px' }}>📭</div><div>Chưa có dữ liệu</div></div>;

    const n = filteredH.length;
    const tc = filteredH.filter(r => r.rec === 'T').length;
    const xc = n - tc;
    const tp = n > 0 ? Math.round(tc / n * 100) : 0;
    const xp = n > 0 ? 100 - tp : 0;

    return (
      <div style={{ paddingBottom: '4px' }}>
        <div style={{ marginBottom: '12px' }}>
          <div style={{ position: 'relative', marginBottom: '8px' }}>
            <input type="text" value={state.histFilter.lg} onChange={e => updateState({ histFilter: { ...state.histFilter, lg: e.target.value } })} placeholder="Lọc thống kê theo giải/đội..." style={{ width: '100%', padding: '8px 10px 8px 28px', background: t.bg, border: `1px solid ${t.brd}`, borderRadius: '9px', color: t.txt, fontSize: '12px', fontFamily: "'Rajdhani', sans-serif", outline: 'none' }} />
            <span style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', color: t.mut, fontSize: '12px' }}>🔍</span>
          </div>
          <div style={{ fontSize: '8px', color: t.mut, letterSpacing: '2px', textTransform: 'uppercase' }}>
            📊 THỐNG KÊ {searchTerm ? `DỰA TRÊN "${searchTerm.toUpperCase()}"` : 'TỔNG QUAN'}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '10px' }}>
          {[
            ['Tổng', n, t.ac, ''],
            ['TÀI', tc, t.gr, 'T'],
            ['XỈU', xc, t.or, 'X']
          ].map(([lb, v, c, filterId], i) => (
            <div 
              key={i} 
              onClick={() => {
                updateState({ 
                  sub: 'history', 
                  histFilter: { ...state.histFilter, rec: filterId as string } 
                });
                haptic('tap');
              }}
              style={{ 
                background: t.card, 
                border: `1px solid ${c}33`, 
                borderRadius: '12px', 
                padding: '10px 6px', 
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.1s, background 0.1s'
              }}
              className="ripple-host"
            >
              <div style={{ fontSize: '24px', fontWeight: 700, color: c as string, fontFamily: 'Rajdhani, monospace' }}>{v}</div>
              <div style={{ fontSize: '7px', color: t.mut, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>{lb}</div>
            </div>
          ))}
        </div>

        <div style={{ background: t.card, borderRadius: '12px', padding: '12px', marginBottom: '10px', border: `1px solid ${t.brd}` }}>
          <div style={{ fontSize: '8px', color: t.mut, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '9px' }}>Phân bổ TÀI / XỈU</div>
          <div style={{ height: '14px', borderRadius: '7px', overflow: 'hidden', display: 'flex', marginBottom: '6px' }}>
            <div style={{ width: `${tp}%`, background: `linear-gradient(90deg, ${t.gr}, ${t.ac})`, borderRadius: '7px 0 0 7px', minWidth: tc > 0 ? '6px' : '0', transition: 'width 0.6s ease' }}></div>
            <div style={{ flex: 1, background: `linear-gradient(90deg, ${t.or}, ${t.rd})`, borderRadius: '0 7px 7px 0', minWidth: xc > 0 ? '6px' : '0' }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 700 }}>
            <span style={{ color: t.gr }}>▲ TÀI {tp}%</span>
            <span style={{ color: t.or }}>XỈU {xp}% ▼</span>
          </div>
        </div>
      </div>
    );
  };

  const renderCompare = () => {
    if (H.length < 2) return <div style={{ textAlign: 'center', padding: '40px 20px', color: t.mut }}><div style={{ fontSize: '44px', marginBottom: '11px' }}>⚖️</div><div>Cần ít nhất 2 phân tích để so sánh</div></div>;

    const sel = H.filter(r => state.cids.includes(r.ts));
    const n = sel.length;
    const CMP_MAX = 5;

    const togCmp = (ts: number) => {
      if (state.cids.includes(ts)) updateState({ cids: state.cids.filter(x => x !== ts) });
      else if (state.cids.length < CMP_MAX) updateState({ cids: [...state.cids, ts] });
    };

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ fontSize: '9px', color: t.mut, letterSpacing: '2px', textTransform: 'uppercase' }}>
            Chọn tối đa <b style={{ color: t.a2 }}>{CMP_MAX}</b> trận · đã chọn <b style={{ color: n > 0 ? t.ac : t.mut }}>{n}</b>
          </div>
          {n > 0 && <button onClick={() => updateState({ cids: [] })} style={{ fontSize: '9px', padding: '4px 10px', background: `${t.rd}14`, border: `1px solid ${t.rd}33`, borderRadius: '7px', color: t.rd, cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif" }}>✕ Bỏ tất cả</button>}
        </div>

        {n > 1 && (
          <div className="card" style={{ background: `${t.ac}08`, borderColor: `${t.ac}33`, padding: '12px', marginBottom: '15px' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: t.ac, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Bảng So Sánh Nhanh</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${t.brd}` }}>
                    <th style={{ textAlign: 'left', padding: '6px 4px', color: t.mut }}>Trận</th>
                    <th style={{ textAlign: 'center', padding: '6px 4px', color: t.mut }}>Kèo</th>
                    <th style={{ textAlign: 'center', padding: '6px 4px', color: t.mut }}>T/X %</th>
                    <th style={{ textAlign: 'center', padding: '6px 4px', color: t.mut }}>Sao</th>
                  </tr>
                </thead>
                <tbody>
                  {sel.map(r => (
                    <tr key={r.ts} style={{ borderBottom: `1px solid ${t.brd}44` }}>
                      <td style={{ padding: '8px 4px', fontWeight: 600, color: t.txt }}>{r.form.tA}</td>
                      <td style={{ padding: '8px 4px', textAlign: 'center' }}>
                        <span style={{ color: r.betC, fontWeight: 700 }}>{r.rec}</span>
                        <div style={{ fontSize: '8px', color: t.mut }}>{r.betLbl}</div>
                      </td>
                      <td style={{ padding: '8px 4px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ color: t.gr }}>{r.safety.tPct}%</span>
                          <span style={{ color: t.rd }}>{r.safety.xPct}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '8px 4px', textAlign: 'center', fontSize: '12px' }}>{r.conf.stars}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {H.map((r, i) => {
          const on = state.cids.includes(r.ts);
          const dis = !on && state.cids.length >= CMP_MAX;
          const idx = on ? state.cids.indexOf(r.ts) + 1 : 0;
          return (
            <div key={r.ts} onClick={() => !dis && togCmp(r.ts)} className="card" style={{ background: on ? `${t.a2}18` : t.card, borderColor: on ? `${t.a2}88` : t.brd, cursor: dis ? 'default' : 'pointer', opacity: dis ? 0.35 : 1, display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '7px', padding: '10px 12px', transition: 'all 0.15s' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: `2px solid ${on ? t.a2 : t.brd}`, background: on ? t.a2 : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '10px', fontWeight: 700, color: '#fff', transition: 'all 0.15s' }}>
                {on ? idx : ''}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: t.gd, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.form.tA || 'Đội A'} vs {r.form.tB || 'Đội B'}</div>
                <div style={{ fontSize: '9px', color: t.mut, marginTop: '1px' }}>{r.form.lg || '—'} · {new Date(r.ts).toLocaleDateString('vi-VN')}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
                <span className="chip" style={{ background: `${r.betC}22`, color: r.betC }}>{r.rec === 'T' ? 'TÀI' : 'XỈU'}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ paddingTop: '16px' }}>
      <div className="stabs">
        {[
          ['history', '🗂 Lịch Sử'],
          ['stats', '📈 Thống Kê'],
          ['compare', '⚖️ So Sánh']
        ].map(([id, lb]) => (
          <button key={id} className="stab" onClick={() => setSub(id)}
            style={{ background: state.sub === id ? `${t.ac}20` : 'transparent', borderColor: state.sub === id ? `${t.ac}44` : 'transparent', color: state.sub === id ? t.ac : t.mut }}>
            {lb}
          </button>
        ))}
      </div>
      {state.sub === 'history' ? renderHistList() : state.sub === 'stats' ? renderStats() : renderCompare()}
    </div>
  );
};
