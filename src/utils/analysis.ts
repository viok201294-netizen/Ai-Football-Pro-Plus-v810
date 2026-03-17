export const DEFAULT_CFG = {
  o1_tai_strong: 1.55, o1_tai_edge: 1.60,
  o1_xiu_edge: 1.80, o1_xiu_signal: 1.83,
  gap_tai: 0.20, gap_xiu: 0.30,
  cp_tai: 80, cp_xiu: 60,
  pt_buffer: 5,
  pt_bench: 53,
  safe_delta: 0.25,
  safety_min: 65,
  kp_ignore: 2, kp_mild: 5, kp_notable: 9,
  hc_xiu_signal: 1.83, hc_khoang_cach: 0.28, hc_he_so: 0.5,
  hc_gap_nho: 0.20, hc_gap_lon: 0.30,
  hc_ou_cao: 2.75, hc_ou_thap: 2.25,
  hc_bypass: 0.25,
};

export function evalO1(o1: number, cfg: any) {
  const p = +(100 / o1).toFixed(1);
  if (o1 <= cfg.o1_tai_strong) return { sig: "T", c: "#00e676", ic: "🟢", lv: "Tín hiệu TÀI mạnh", nt: `odds1=${o1} ≤ ${cfg.o1_tai_strong} — P=${p}%` };
  if (o1 < cfg.o1_tai_edge) return { sig: "T", c: "#69ff47", ic: "🟢", lv: "Biên TÀI", nt: `odds1=${o1} gần ngưỡng ${cfg.o1_tai_strong}` };
  if (o1 <= cfg.o1_xiu_edge) return { sig: "N", c: "#ffd700", ic: "⚠️", lv: `Vùng nhạy cảm ${cfg.o1_tai_edge}–${cfg.o1_xiu_edge}`, nt: `odds1=${o1} — dễ bất ngờ` };
  if (o1 < cfg.o1_xiu_signal) return { sig: "N", c: "#ff9100", ic: "⚠️", lv: "Biên cảnh báo Xỉu", nt: `odds1=${o1} sắp chạm ${cfg.o1_xiu_signal}` };
  return { sig: "X", c: "#ff1744", ic: "🔴", lv: "Tín hiệu XỈU", nt: `odds1=${o1} ≥ ${cfg.o1_xiu_signal} — thống kê ~70% trận Xỉu` };
}

export function evalGAP(g: number, cfg: any) {
  const t1 = cfg.gap_tai, t2 = cfg.gap_xiu, t1e = +(t1 + 0.01).toFixed(2), t2e = +(t2 - 0.01).toFixed(2);
  if (g <= t1) return { sig: "T", c: "#00e676", ic: "🟢", lb: "TÀI mạnh", nt: `GAP=${g} ≤ ${t1}` };
  if (g < t1e) return { sig: "T", c: "#69ff47", ic: "🟢", lb: "Biên TÀI", nt: `GAP=${g} sát ${t1}` };
  if (g <= t2e) return { sig: "N", c: "#ffd700", ic: "⚠️", lb: `Vùng khó đoán ${t1e}–${t2e}`, nt: `GAP=${g} — tỷ lệ đúng ~50%` };
  if (g < t2) return { sig: "N", c: "#ff9100", ic: "⚠️", lb: "Sát ngưỡng Xỉu", nt: `GAP=${g}` };
  return { sig: "X", c: "#ff1744", ic: "🔴", lb: "XỈU mạnh", nt: `GAP=${g} ≥ ${t2}` };
}

export function evalCP(cp: number, cfg: any) {
  if (cp > cfg.cp_tai) return { sig: "T", c: "#00e676", ic: "🟢", lb: "TÀI rất mạnh", nt: `${cp.toFixed(1)}% > ${cfg.cp_tai}% — kịch bản 1-1 rất thấp` };
  if (cp >= cfg.cp_xiu) return { sig: "N", c: "#ffd700", ic: "⚠️", lb: `Vùng trung gian ${cfg.cp_xiu}–${cfg.cp_tai}%`, nt: `${cp.toFixed(1)}% — cần xem thêm tín hiệu khác` };
  return { sig: "X", c: "#ff1744", ic: "🔴", lb: "XỈU chiếm ưu thế", nt: `${cp.toFixed(1)}% < ${cfg.cp_xiu}% — tỉ số 1-1 ưu thế` };
}

export function evalPT(pt: number, cfg: any) {
  const bench = cfg.pt_bench / 100;
  const d = +(pt * 100 - cfg.pt_bench).toFixed(2);
  if (pt > bench) return { sig: "T", c: "#00e676", ic: "🟢", lb: "Tài có giá trị", d };
  if (pt < bench) return { sig: "X", c: "#ff1744", ic: "🔴", lb: "Xỉu có giá trị", d };
  return { sig: "N", c: "#ffd700", ic: "⚠️", lb: `Cân bằng ~${cfg.pt_bench}%`, d: 0 };
}

export function evalKeoPhu(ptRaw: number | string, cfg: any) {
  if (ptRaw == null || ptRaw === '' || isNaN(+ptRaw)) {
    return { lv: "unknown", msg: "Chưa có dữ liệu P_total", c: "#6b7db3", pri: false, skip: true };
  }
  const diff = +(+ptRaw * 100 - cfg.pt_bench).toFixed(2), adiff = Math.abs(diff);
  if (adiff < cfg.kp_ignore) return { lv: "ignore", msg: `Chênh lệch chỉ ${diff}% — không đáng kể, bỏ qua`, c: "#6b7db3", pri: false, skip: true };
  if (adiff < cfg.kp_mild) return { lv: "mild", msg: `Chênh lệch vừa (${diff > 0 ? '+' : ''}${diff}%) — kèo phụ ${diff > 0 ? 'nhỉnh' : 'thấp hơn'} kèo chính`, c: diff > 0 ? "#00e676" : "#ff6d00", pri: false, skip: false };
  if (adiff < cfg.kp_notable) return { lv: "notable", msg: `Chênh lệch đáng kể (${diff > 0 ? '+' : ''}${diff}%) — cân nhắc ưu tiên kèo phụ BTTS+O2.5`, c: diff > 0 ? "#00e676" : "#ff9100", pri: false, skip: false };
  return { lv: "strong", msg: `⚡ CHÊNH LỆCH BẤT THƯỜNG (${diff > 0 ? '+' : ''}${diff}%) — ƯU TIÊN KÈO PHỤ BTTS+O2.5`, c: "#ff1744", pri: true, skip: false };
}

export function calcSafety(sigs: string[], rec: string, cfg: any) {
  const score = sigs.reduce((a, s) => a + (s === "T" ? 1 : s === "N" ? 0.5 : 0), 0) / sigs.length;
  const tPct = +(score * 100).toFixed(1);
  const xPct = +(100 - tPct).toFixed(1);
  const safe = rec === "T" ? tPct >= cfg.safety_min : xPct >= cfg.safety_min;
  return { tPct, xPct, safe, score };
}

export function calcConf(tS: number, xS: number, rec: string, t: any) {
  const d = rec === "T" ? tS : xS;
  if (d >= 4) return { stars: "⭐⭐⭐⭐⭐", starsN: 5, lb: "RẤT CAO", c: t.gr };
  if (d === 3) return { stars: "⭐⭐⭐⭐", starsN: 4, lb: "CAO", c: t.gd };
  if (d === 2) return { stars: "⭐⭐⭐", starsN: 3, lb: "TRUNG BÌNH", c: t.or };
  return { stars: "⭐⭐", starsN: 2, lb: "THẤP", c: t.rd };
}

export function calcHandicap(o1: number, o2: number, ml: number, cfg: any) {
  if (!o1 || !o2 || o1 <= 0 || o2 <= 0) return null;
  let base = ((cfg.hc_xiu_signal - o1) / cfg.hc_khoang_cach) * cfg.hc_he_so;
  const gap = +(o2 - o1).toFixed(3);
  if (gap <= cfg.hc_gap_nho) base += cfg.safe_delta;
  else if (gap >= cfg.hc_gap_lon) base -= cfg.safe_delta;
  if (ml >= cfg.hc_ou_cao) base += cfg.safe_delta;
  else if (ml <= cfg.hc_ou_thap) base -= cfg.safe_delta;
  base = Math.max(-4, Math.min(4, base));
  return Math.round(base * 4) / 4;
}

export function xuLyKeoChap(goiy: number | string, chinh: number | string, cfg: any) {
  if (chinh === '' || chinh == null) return null;
  const g = +goiy, c = +chinh;
  if (isNaN(g) || isNaN(c)) return null;
  
  const ag = Math.abs(g);
  const ac = Math.abs(c);
  const diff = +Math.abs(ag - ac).toFixed(2);
  const side = c >= 0 ? 'home' : 'away';
  
  let msg = '';
  let chon: 'chap' | 'duoc_chap' | null = null;
  let loai: 'ok' | 'warning' | 'danger' | 'info' = 'info';
  let bay = false;
  let bypass = false;

  if (diff === 0.00) {
    if (ac > 1.75) {
      msg = "Đội chấp quá mạnh (>1.75). Ưu tiên nằm ĐỘI CHẤP.";
      chon = 'chap';
      loai = 'ok';
    } else if (ac >= 0.5) {
      msg = "Chênh lệch 0.00. Ưu tiên chọn ĐỘI CHẤP.";
      chon = 'chap';
      loai = 'ok';
    } else {
      msg = "Cảnh báo: Kèo chấp thấp (<0.5). Cân nhắc kỹ.";
      loai = 'warning';
      bay = true;
    }
  } else if (diff === 0.25) {
    msg = "Chênh lệch 0.25. Hai đội ngang nhau, ưu tiên ĐỘI DƯỚI.";
    chon = 'duoc_chap';
    loai = 'ok';
  } else if (diff === 0.75) {
    msg = "Chênh lệch 0.75. Dự đoán đội chấp thắng cách biệt 1 bàn (vừa đủ kèo).";
    chon = 'chap';
    loai = 'ok';
  } else if (diff >= 1.00) {
    if (ac < ag) {
      msg = `Nhà cái đánh giá thấp đội chấp (${ac} < ${ag}). Ưu tiên ĐỘI CHẤP.`;
      chon = 'chap';
      loai = 'ok';
    } else {
      msg = `Nhà cái đánh giá quá cao đội chấp (${ac} > ${ag}). Ưu tiên ĐỘI DƯỚI.`;
      chon = 'duoc_chap';
      loai = 'ok';
    }
  } else {
    // Fallback cho các trường hợp khác
    if (ag < ac) {
      msg = "Kèo chính cao hơn gợi ý. Ưu tiên ĐỘI DƯỚI.";
      chon = 'duoc_chap';
      loai = 'warning';
      bay = Math.abs(ag - ac) >= 0.5;
    } else {
      msg = "Kèo chính thấp hơn gợi ý. Ưu tiên ĐỘI CHẤP.";
      chon = 'chap';
      loai = 'info';
      bay = Math.abs(ag - ac) >= 0.5;
    }
  }

  return { msg, chon, loai, bay, bypass, diff, goiy: g, chinh: c, side };
}

export function runAnalysis(form: any, cfg: any, t: any) {
  const o1 = +form.o1, o2 = +form.o2, ml = +form.ml || 2.5;
  const p2 = +(100 / o1).toFixed(2), p3 = +(100 / o2).toFixed(2);
  const gap = +((o2 - o1).toFixed(3));
  const condP = +(o1 / o2 * 100).toFixed(2);
  const ptRaw = 1 / o2 + (cfg.pt_buffer / 100), ptPct = +(ptRaw * 100).toFixed(2);
  const bench = cfg.pt_bench;

  const borderline = Math.abs(ptPct - bench) <= 1;
  const rec = ptRaw > bench / 100 ? "T" : "X";

  const eO1 = evalO1(o1, cfg), eG = evalGAP(gap, cfg), eCP = evalCP(condP, cfg), ePT = evalPT(ptRaw, cfg);
  const sigs = [eO1.sig, eG.sig, eCP.sig, ePT.sig];
  const tS = sigs.filter(s => s === "T").length, xS = sigs.filter(s => s === "X").length;

  const sigRec = tS > xS ? "T" : xS > tS ? "X" : null;
  const conflict = sigRec !== null && sigRec !== rec;

  const conf = calcConf(tS, xS, rec, t);
  const safety = calcSafety(sigs, rec, cfg);
  const kp = evalKeoPhu(ptRaw, cfg);

  const safeLine = rec === "T" ? +(ml - cfg.safe_delta).toFixed(2) : +(ml + cfg.safe_delta).toFixed(2);
  const betLbl = rec === "T" ? `TÀI O${safeLine}` : `XỈU O${safeLine}`;
  const betC = rec === "T" ? t.gr : t.or;

  const specials = [];
  if (borderline) specials.push(`⚠️ Vùng nhạy cảm: P_total=${ptPct}% ≈ ${bench}% (±1%) — kết hợp GAP và P(≥3|BTTS) để xác nhận`);
  if (gap > 0.30 && condP > 80) specials.push("⚡ GAP > 0.30 nhưng P(≥3|BTTS) > 80% — GAP có thể đánh lừa, P_total quyết định");
  if (o1 >= 1.83 && ptRaw > bench / 100) specials.push(`⚡ odds1 ≥ 1.83 nhưng P_total > ${bench}% — V7.2 ưu tiên TÀI theo P_total`);
  if (conflict) specials.push(`⚡ Tín hiệu phụ nghiêng ${sigRec === "T" ? "TÀI" : "XỈU"} nhưng P_total=${ptPct}% → V7.2 quyết định ${rec === "T" ? "TÀI" : "XỈU"}`);

  const reason = rec === "T"
    ? `P_total=${ptPct}% > ${bench}% (ngưỡng V7.2) → TÀI. Safe line: O${safeLine}`
    : `P_total=${ptPct}% ≤ ${bench}% (ngưỡng V7.2) → XỈU. Safe line: O${safeLine}`;

  const goiyChap = calcHandicap(o1, o2, ml, cfg);
  const hcResult = xuLyKeoChap(goiyChap || 0, form.mh, cfg);
  
  return {
    o1, o2, ml, p2, p3, gap, condP, ptRaw, ptPct, borderline, eO1, eG, eCP, ePT, sigs, tS, xS, conflict, specials, kp, safety, conf, rec, safeLine, betLbl, betC, reason, goiyChap, hcResult, hcSide: form.hcSide || 'home', form: { ...form }, ts: Date.now(),
    initO1: +form.initO1 || 0, initO2: +form.initO2 || 0, matchTime: form.matchTime || '', note: ''
  };
}
