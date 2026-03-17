import html2canvas from 'html2canvas';
import { toast, haptic } from './toast';

const buildCardHTML = (r: any, t: any) => {
  const rec = r.rec === 'T' ? 'TÀI' : 'XỈU';
  const recC = r.rec === 'T' ? t.gr : t.or;
  const d = new Date(r.ts);
  const dateStr = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  const timeStr = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  
  const tPct = r.safety.tPct || 0, xPct = r.safety.xPct || 0;

  return `<div style="width:400px;background:#060b17;border-radius:28px;overflow:hidden;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;border:2px solid ${recC}66;box-shadow:0 25px 70px rgba(0,0,0,0.9)">
    <!-- HEADER: TEAMS & LEAGUE -->
    <div style="background:linear-gradient(160deg,#0d1428 0%,#060b17 100%);padding:28px 24px;border-bottom:1px solid ${t.brd}33;position:relative;text-align:center">
      <div style="position:absolute;top:0;right:0;width:100%;height:100%;background:radial-gradient(circle at 50% 50%,${recC}10,transparent 80%);pointer-events:none"></div>
      <div style="position:relative;z-index:1">
        <div style="font-size:10px;color:${t.ac};letter-spacing:5px;text-transform:uppercase;margin-bottom:10px;font-weight:800;opacity:0.8">⚽ AI FOOTBALL ANALYSER</div>
        <div style="font-size:24px;font-weight:900;color:#fff;letter-spacing:-0.5px;line-height:1.2;margin-bottom:6px;display:flex;align-items:center;justify-content:center;gap:12px">
          <span style="flex:1;text-align:right">${r.form.tA || 'Đội A'}</span>
          <span style="background:${t.bg};padding:4px 12px;border-radius:12px;border:1.5px solid ${t.ac};color:${t.ac};font-family:'Orbitron',sans-serif;font-size:20px;min-width:60px">${r.sA || 0} : ${r.sB || 0}</span>
          <span style="flex:1;text-align:left">${r.form.tB || 'Đội B'}</span>
        </div>
        <div style="font-size:12px;color:${t.mut};font-weight:600;letter-spacing:1px">${r.form.lg || 'GIẢI ĐẤU'}</div>
      </div>
    </div>

    <!-- MAIN CONTENT: TIME & VERDICT -->
    <div style="padding:24px 20px;background:rgba(255,255,255,0.01)">
      <div style="display:flex;gap:12px;margin-bottom:20px">
        <!-- TIME BLOCK -->
        <div style="flex:1;background:rgba(255,255,255,0.03);border-radius:20px;padding:18px 10px;border:1px solid ${t.brd};text-align:center;display:flex;flex-direction:column;justify-content:center">
          <div style="font-size:9px;color:${t.mut};letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;font-weight:700">GIỜ THI ĐẤU</div>
          <div style="font-size:34px;font-weight:900;color:#fff;font-family:'Orbitron', sans-serif;line-height:1">${timeStr}</div>
          <div style="font-size:10px;color:${t.mut};margin-top:6px;font-weight:700">${dateStr}</div>
        </div>
        
        <!-- VERDICT BLOCK -->
        <div style="flex:1.2;background:${recC}15;border-radius:20px;padding:18px 10px;border:2px solid ${recC}44;text-align:center;display:flex;flex-direction:column;justify-content:center;box-shadow:0 10px 30px ${recC}15">
          <div style="font-size:9px;color:${recC}aa;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;font-weight:700">ĐỀ XUẤT KÈO</div>
          <div style="font-size:42px;font-weight:900;color:${recC};line-height:1;letter-spacing:2px;font-family:'Orbitron', sans-serif">${rec}</div>
          <div style="font-size:12px;font-weight:800;color:${recC}cc;margin-top:6px">${r.betLbl}</div>
        </div>
      </div>

      <!-- PROBABILITY BAR -->
      <div style="background:rgba(255,255,255,0.02);border-radius:16px;padding:14px;border:1px solid ${t.brd}66;margin-bottom:20px">
        <div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:11px;font-weight:800">
          <span style="color:${t.gr}">TÀI ${tPct}%</span>
          <span style="color:${recC}">P_TOTAL ${r.ptPct}%</span>
          <span style="color:${t.rd}">XỈU ${xPct}%</span>
        </div>
        <div style="height:12px;background:rgba(255,255,255,0.05);border-radius:6px;overflow:hidden;display:flex">
          <div style="width:${tPct}%;background:linear-gradient(90deg,${t.gr},${t.ac})"></div>
          <div style="flex:1;background:linear-gradient(90deg,${t.or},${t.rd})"></div>
        </div>
      </div>

      <!-- HANDICAP SECTION -->
      ${r.hcResult ? `
      <div style="padding:20px;border-radius:22px;background:${t.or}15;border:2px solid ${t.or}55;text-align:center;box-shadow:0 10px 30px ${t.or}15">
        <div style="font-size:10px;color:${t.or}aa;letter-spacing:3px;text-transform:uppercase;margin-bottom:10px;font-weight:700">♟️ KÈO CHẤP GỢI Ý</div>
        <div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:12px;line-height:1.4">${r.hcResult.msg}</div>
        ${r.hcResult.chon ? `
          <div style="padding:14px;background:${t.or}25;border-radius:14px;border:1px solid ${t.or}66">
            <div style="font-size:9px;color:${t.or};letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;font-weight:800">KHUYẾN NGHỊ</div>
            <div style="font-size:22px;font-weight:900;color:${t.or};letter-spacing:1px;font-family:'Orbitron', sans-serif">
              ${r.hcResult.chon === 'chap' ? 'NẰM ĐỘI CHẤP' : 'NẰM ĐỘI DƯỚI'}
            </div>
          </div>
        ` : ''}
      </div>` : ''}
    </div>

    <!-- FOOTER: SMALL INFO -->
    <div style="background:rgba(0,0,0,0.4);padding:16px 24px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid ${t.brd}33">
      <div>
        <div style="font-size:10px;color:#fff;font-weight:800;letter-spacing:1px">AI ANALYSER v8.1</div>
        <div style="font-size:8px;color:${t.mut};margin-top:2px;text-transform:uppercase">Verified by Mr. V94</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:18px;line-height:1">${r.conf.stars}</div>
        <div style="font-size:9px;color:${r.conf.c};font-weight:800;margin-top:4px;text-transform:uppercase">${r.conf.lb}</div>
      </div>
    </div>
  </div>`;
};

export const exportSingleImg = async (r: any, t: any) => {
  if (!r) { toast('⚠️ Không có kết quả để xuất', 'warn'); return; }
  toast('⏳ Đang tạo ảnh...', 'info');

  const cardHTML = buildCardHTML(r, t);
  const wrap = document.createElement('div');
  // Set width to 400px to match buildCardHTML's internal div width
  wrap.style.cssText = 'position:fixed;top:0;left:-9999px;width:400px;background:#0a0f20;z-index:-1;pointer-events:none;overflow:visible;visibility:visible;opacity:1;font-family:Arial,sans-serif';
  wrap.innerHTML = cardHTML;
  document.body.appendChild(wrap);

  try {
    // Wait for fonts and layout
    await new Promise(res => requestAnimationFrame(() => requestAnimationFrame(res)));
    await new Promise(res => setTimeout(res, 300));

    const canvas = await html2canvas(wrap, {
      backgroundColor: '#0a0f20',
      scale: 2, // High quality
      useCORS: true,
      logging: false,
      width: 400, // Match the wrapper width
      windowWidth: 1200, // Larger window width to prevent media query issues
      x: 0, 
      y: 0,
      scrollX: 0, 
      scrollY: 0,
      allowTaint: true,
    });

    const tA = (r.form.tA || 'DoiA').replace(/\s+/g, '_');
    const tB = (r.form.tB || 'DoiB').replace(/\s+/g, '_');
    const fname = `phan_tich_${tA}_vs_${tB}.png`;

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      if ((window as any).showSaveFilePicker) {
        try {
          const handle = await (window as any).showSaveFilePicker({
            suggestedName: fname,
            types: [{ description: 'Hình PNG', accept: { 'image/png': ['.png'] } }],
          });
          const writable = await handle.createWritable();
          await writable.write(blob);
          await writable.close();
          haptic('success');
          toast('✅ Đã lưu ảnh!', 'success');
          return;
        } catch (e: any) {
          if (e.name === 'AbortError') return;
        }
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = fname;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      haptic('success');
      toast('✅ Đã lưu ảnh!', 'success');
    }, 'image/png');
  } catch (e) {
    console.warn('html2canvas error:', e);
    toast('❌ Không thể render — thử lại', 'error');
  } finally {
    if (wrap && wrap.parentNode) document.body.removeChild(wrap);
  }
};
