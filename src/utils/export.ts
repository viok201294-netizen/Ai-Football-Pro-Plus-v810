import { toast, haptic } from './toast';

export const shareResult = (r: any) => {
  if (!r) return;
  const tA = r.form.tA || 'Đội A', tB = r.form.tB || 'Đội B', lg = r.form.lg || '';
  const rec = r.rec === 'T' ? 'TÀI' : 'XỈU';
  const lines = [
    '⚽ AI FOOTBALL ANALYSER v8.1',
    lg ? `🏆 ${lg}` : '',
    `⚔️  ${tA} vs ${tB}`,
    '─────────────────',
    `📊 BTTS O1.5: ${r.o1} | O2.5: ${r.o2}`,
    `📐 GAP: ${r.gap} | P(≥3|BTTS): ${r.condP}%`,
    `🎯 P_total: ${r.ptPct}% → ${rec} ${r.betLbl}`,
    (() => {
      if (!r.hcResult || !r.form.mh) return '';
      const side = r.hcResult.side || 'home';
      const chinhAbs = Math.abs(+r.form.mh).toFixed(2);
      const chinhTeam = side === 'home' ? (r.form.tA || 'Nhà') : (r.form.tB || 'Khách');
      const chon = r.hcResult.chon;
      const pickedTeam = chon === 'chap' ? chinhTeam : (side === 'home' ? (r.form.tB || 'Khách') : (r.form.tA || 'Nhà'));
      return `♟️ Kèo chấp: ${chinhTeam} chấp ${chinhAbs}\n👉 ${r.hcResult.msg}${chon ? ` → Chọn ${pickedTeam}` : ''}`;
    })(),
    '─────────────────',
    r.conflict ? '⚠️  Tín hiệu mâu thuẫn' : '✅ Tín hiệu đồng thuận',
    r.note ? `📝 Ghi chú: ${r.note}` : '',
    '💡 Design By MrV94',
  ].filter(Boolean).join('\n');

  if (navigator.clipboard) {
    navigator.clipboard.writeText(lines).then(() => toast('✅ Đã copy kết quả!', 'success')).catch(() => toast('Không thể copy', 'error'));
  } else {
    const ta = document.createElement('textarea'); ta.value = lines; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta); toast('✅ Đã copy kết quả!', 'success');
  }
  haptic('soft');
};
