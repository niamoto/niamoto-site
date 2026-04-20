// Theme presets — extracted from src/niamoto/gui/ui/src/themes/presets/
// Each entry covers the surfaces this UI kit actually paints.
window.NIA_THEMES = {
  frond: {
    name: 'Frond', desc: 'Default — translucent, cool greys',
    sidebarBg: '#15171B', sidebarFg: '#D9DDE1', sidebarHover: 'rgba(255,255,255,0.06)',
    sidebarActive: 'rgba(34,139,34,0.14)', sidebarActiveFg: '#6ECF71',
    bg: 'oklch(0.97 0.003 250)', surface: '#ffffff', fg: 'oklch(0.16 0.005 270)', fgMuted: 'oklch(0.50 0.01 250)',
    border: 'oklch(0.88 0.005 250 / 0.6)', borderStrong: 'oklch(0.82 0.005 250)',
    primary: '#2E7D32', primaryFg: '#fff',
    bgMuted: 'oklch(0.94 0.005 250)',
    radius: '7px', radiusXl: '12px', borderW: '1px',
    fontSans: '"Plus Jakarta Sans", system-ui, sans-serif',
    fontMono: '"JetBrains Mono", monospace',
    fontsUrl: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
    accentBlue:'#3b82f6', accentAmber:'#f59e0b', accentGreen:'#10b981', accentOrange:'#f97316',
  },
  forest: {
    name: 'Forest', desc: 'Canopy immersion — rounded, organic',
    sidebarBg: 'oklch(0.10 0.03 145)', sidebarFg: 'oklch(0.92 0.015 145)', sidebarHover: 'oklch(0.20 0.03 145)',
    sidebarActive: 'oklch(0.28 0.06 145)', sidebarActiveFg: 'oklch(0.85 0.12 145)',
    bg: 'oklch(0.98 0.008 145)', surface: 'oklch(0.995 0.005 145)', fg: 'oklch(0.18 0.04 145)', fgMuted: 'oklch(0.45 0.03 145)',
    border: 'oklch(0.90 0.02 145)', borderStrong: 'oklch(0.84 0.015 145)',
    primary: 'oklch(0.42 0.12 145)', primaryFg: 'oklch(0.98 0.005 145)',
    bgMuted: 'oklch(0.95 0.015 145)',
    radius: '16px', radiusXl: '24px', borderW: '1px',
    fontSans: 'Nunito, system-ui, sans-serif',
    fontMono: '"JetBrains Mono", monospace',
    fontsUrl: 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap',
    accentBlue:'oklch(0.55 0.12 200)', accentAmber:'oklch(0.75 0.12 85)', accentGreen:'oklch(0.55 0.12 145)', accentOrange:'oklch(0.65 0.10 40)',
  },
  herbier: {
    name: 'Herbier', desc: 'Serif academic — warm ivory, vert-de-gris',
    sidebarBg: 'oklch(0.96 0.01 80)', sidebarFg: 'oklch(0.20 0.02 55)', sidebarHover: 'oklch(0.92 0.01 80)',
    sidebarActive: 'oklch(0.88 0.02 170)', sidebarActiveFg: 'oklch(0.30 0.08 170)',
    bg: 'oklch(0.97 0.008 80)', surface: 'oklch(0.985 0.006 80)', fg: 'oklch(0.20 0.02 55)', fgMuted: 'oklch(0.52 0.015 55)',
    border: 'oklch(0.86 0.01 80)', borderStrong: 'oklch(0.78 0.015 80)',
    primary: 'oklch(0.42 0.08 170)', primaryFg: 'oklch(0.97 0.005 80)',
    bgMuted: 'oklch(0.93 0.008 80)',
    radius: '4px', radiusXl: '8px', borderW: '1px',
    fontSans: '"Source Serif 4", Georgia, serif',
    fontDisplay: '"Crimson Pro", Georgia, serif',
    fontMono: '"JetBrains Mono", monospace',
    fontsUrl: 'https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;500;600;700&family=Source+Serif+4:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
    accentBlue:'oklch(0.50 0.08 240)', accentAmber:'oklch(0.55 0.04 70)', accentGreen:'oklch(0.50 0.10 150)', accentOrange:'oklch(0.55 0.10 40)',
  },
  ink: {
    name: 'Ink', desc: 'Editorial monochrome — sharp, no shadows',
    sidebarBg: 'oklch(0.98 0.003 90)', sidebarFg: 'oklch(0.15 0 0)', sidebarHover: 'oklch(0.93 0.003 90)',
    sidebarActive: 'oklch(0.15 0 0)', sidebarActiveFg: 'oklch(0.99 0.005 90)',
    bg: 'oklch(0.99 0.005 90)', surface: 'oklch(0.98 0.003 90)', fg: 'oklch(0.15 0 0)', fgMuted: 'oklch(0.50 0 0)',
    border: 'oklch(0.25 0 0 / 0.25)', borderStrong: 'oklch(0.20 0 0)',
    primary: 'oklch(0.15 0 0)', primaryFg: 'oklch(0.99 0.005 90)',
    bgMuted: 'oklch(0.93 0.003 90)',
    radius: '0', radiusXl: '0', borderW: '1.5px',
    fontSans: 'Archivo, system-ui, sans-serif',
    fontMono: '"JetBrains Mono", monospace',
    fontsUrl: 'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
    accentBlue:'oklch(0.38 0 0)', accentAmber:'oklch(0.55 0 0)', accentGreen:'oklch(0.45 0 0)', accentOrange:'oklch(0.30 0 0)',
  },
  lapis: {
    name: 'Lapis', desc: 'Classic precision — slate-blue, blue-tinted shadows',
    sidebarBg: 'oklch(0.13 0.04 250)', sidebarFg: 'oklch(0.90 0.01 250)', sidebarHover: 'oklch(0.22 0.04 250)',
    sidebarActive: 'oklch(0.32 0.06 275)', sidebarActiveFg: '#ffffff',
    bg: 'oklch(0.975 0.005 250)', surface: '#ffffff', fg: 'oklch(0.25 0.04 270)', fgMuted: 'oklch(0.60 0.02 250)',
    border: 'oklch(0.92 0.005 250 / 0.5)', borderStrong: 'oklch(0.82 0.008 250)',
    primary: 'oklch(0.32 0.06 275)', primaryFg: '#fff',
    bgMuted: 'oklch(0.94 0.006 250)',
    radius: '5px', radiusXl: '8px', borderW: '0px',
    fontSans: '"Instrument Sans", system-ui, sans-serif',
    fontMono: '"JetBrains Mono", monospace',
    fontsUrl: 'https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
    accentBlue:'oklch(0.55 0.12 250)', accentAmber:'oklch(0.78 0.14 80)', accentGreen:'oklch(0.65 0.12 180)', accentOrange:'oklch(0.62 0.13 50)',
  },
  tidal: {
    name: 'Tidal', desc: 'Cartographic — sharp edges, teal palette',
    sidebarBg: 'oklch(0.12 0.03 240)', sidebarFg: 'oklch(0.90 0.01 230)', sidebarHover: 'oklch(0.24 0.025 240)',
    sidebarActive: 'oklch(0.49 0.13 200)', sidebarActiveFg: '#fff',
    bg: 'oklch(0.97 0.006 230)', surface: 'oklch(0.99 0.004 230)', fg: 'oklch(0.18 0.02 240)', fgMuted: 'oklch(0.52 0.02 240)',
    border: 'oklch(0.85 0.012 240)', borderStrong: 'oklch(0.75 0.012 240)',
    primary: 'oklch(0.49 0.13 200)', primaryFg: '#fff',
    bgMuted: 'oklch(0.93 0.008 240)',
    radius: '0', radiusXl: '2px', borderW: '1px',
    fontSans: 'Barlow, system-ui, sans-serif',
    fontMono: '"JetBrains Mono", monospace',
    fontsUrl: 'https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
    accentBlue:'oklch(0.55 0.10 250)', accentAmber:'oklch(0.78 0.14 85)', accentGreen:'oklch(0.52 0.12 165)', accentOrange:'oklch(0.62 0.14 40)',
  },
};

window.applyNiaTheme = function(id) {
  const t = window.NIA_THEMES[id]; if (!t) return;
  // load fonts once per id
  const linkId = `nia-fonts-${id}`;
  if (!document.getElementById(linkId)) {
    const l = document.createElement('link'); l.id = linkId; l.rel='stylesheet'; l.href = t.fontsUrl;
    document.head.appendChild(l);
  }
  const r = document.documentElement.style;
  r.setProperty('--bg', t.bg); r.setProperty('--bg-muted', t.bgMuted); r.setProperty('--surface', t.surface);
  r.setProperty('--fg', t.fg); r.setProperty('--fg-muted', t.fgMuted);
  r.setProperty('--border', t.border); r.setProperty('--border-strong', t.borderStrong);
  r.setProperty('--nia-forest', t.primary);
  r.setProperty('--font-sans', t.fontSans); r.setProperty('--font-mono', t.fontMono);
  r.setProperty('--radius-lg', t.radius); r.setProperty('--radius-2xl', t.radiusXl);
  r.setProperty('--nia-sidebar-bg', t.sidebarBg);
  r.setProperty('--nia-sidebar-fg', t.sidebarFg);
  r.setProperty('--nia-sidebar-hover', t.sidebarHover);
  r.setProperty('--nia-sidebar-active', t.sidebarActive);
  r.setProperty('--nia-sidebar-active-fg', t.sidebarActiveFg);
  r.setProperty('--nia-accent-blue', t.accentBlue);
  r.setProperty('--nia-accent-amber', t.accentAmber);
  r.setProperty('--nia-accent-green', t.accentGreen);
  r.setProperty('--nia-accent-orange', t.accentOrange);
  document.body.style.background = t.bg;
  document.body.style.color = t.fg;
  document.body.style.fontFamily = t.fontSans;
};
