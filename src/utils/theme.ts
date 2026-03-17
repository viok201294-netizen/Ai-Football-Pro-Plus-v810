export const DARK_BASE = { bg: "#070c18", card: "#0f1828", c2: "#162035", txt: "#e8f0fe", mut: "#6b7db3", brd: "#1a2a44" };
export const LIGHT_BASE = { bg: "#f2f5fc", card: "#ffffff", c2: "#e8edf8", txt: "#0d1a3a", mut: "#7a8eb0", brd: "#c8d4ec" };

export const ACCENTS: Record<string, any> = {
  cyan: {
    n: "Cyan", e: "🔵", ac: "#0077cc", a2: "#7c4dff", gr: "#00b050", rd: "#d93025", or: "#e65c00", gd: "#c89600", glow: "rgba(0,119,204,0.10)",
    dk: { ac: "#00e5ff", a2: "#7c4dff", gr: "#00e676", rd: "#ff1744", or: "#ff6d00", gd: "#ffd700", glow: "rgba(0,229,255,0.08)" }
  },
  emerald: {
    n: "Xanh Lá", e: "🟢", ac: "#1a7a40", a2: "#b8860b", gr: "#1a7a40", rd: "#cc2200", or: "#cc6600", gd: "#b8860b", glow: "rgba(26,122,64,0.10)",
    dk: { ac: "#00e676", a2: "#ffd700", gr: "#00e676", rd: "#ff4444", or: "#ff8c00", gd: "#ffd700", glow: "rgba(0,230,118,0.08)" }
  },
  fire: {
    n: "Đỏ Cam", e: "🔴", ac: "#cc4400", a2: "#cc0022", gr: "#996600", rd: "#cc0022", or: "#cc4400", gd: "#aa8800", glow: "rgba(204,68,0,0.10)",
    dk: { ac: "#ff6d00", a2: "#ff1744", gr: "#ffab40", rd: "#ff1744", or: "#ff6d00", gd: "#ffd740", glow: "rgba(255,109,0,0.08)" }
  },
  neon: {
    n: "Tím Hồng", e: "💜", ac: "#9c00cc", a2: "#cc0055", gr: "#0088aa", rd: "#cc0055", or: "#cc4400", gd: "#aa8800", glow: "rgba(156,0,204,0.10)",
    dk: { ac: "#e040fb", a2: "#ff4081", gr: "#00e5ff", rd: "#ff4081", or: "#ff6d00", gd: "#ffd700", glow: "rgba(224,64,251,0.08)" }
  },
  cobalt: {
    n: "Cobalt", e: "🫧", ac: "#1a5cc8", a2: "#007acc", gr: "#2d8800", rd: "#cc0022", or: "#cc5500", gd: "#aa8800", glow: "rgba(26,92,200,0.10)",
    dk: { ac: "#448aff", a2: "#00b0ff", gr: "#69ff47", rd: "#ff1744", or: "#ff9100", gd: "#ffd740", glow: "rgba(68,138,255,0.08)" }
  },
  gold: {
    n: "Vàng", e: "🏆", ac: "#aa7700", a2: "#cc8800", gr: "#2d8800", rd: "#cc0022", or: "#cc4400", gd: "#aa7700", glow: "rgba(170,119,0,0.10)",
    dk: { ac: "#ffd700", a2: "#ffab40", gr: "#69ff47", rd: "#ff1744", or: "#ff6d00", gd: "#ffd700", glow: "rgba(255,215,0,0.08)" }
  },
};

export const BRIGHTNESS = {
  dark: { n: "Tối", e: "🌙", label: "Giao diện tối" },
  light: { n: "Sáng", e: "☀️", label: "Giao diện sáng" },
  auto: { n: "Tự động", e: "🌓", label: "Theo giờ (6h–18h sáng)" },
};

export function resolveTheme(brightness: string, tk: string, autoStart: number = 6, autoEnd: number = 18) {
  const A = ACCENTS[tk] || ACCENTS.cyan;
  let isDark = true;
  if (brightness === 'light') isDark = false;
  else if (brightness === 'auto') {
    const h = new Date().getHours();
    isDark = h < autoStart || h >= autoEnd;
  }
  const base = isDark ? DARK_BASE : LIGHT_BASE;
  const acc = isDark ? A.dk : A;
  const hg = isDark
    ? `linear-gradient(135deg,${base.bg},${acc.a2}22,${base.bg})`
    : `linear-gradient(135deg,#e8f0ff,${acc.ac}18,#f0f4ff)`;
  const bg2 = `linear-gradient(90deg,${acc.ac},${acc.a2})`;
  return { ...base, ...acc, hg, bg2, isDark, br: brightness };
}
