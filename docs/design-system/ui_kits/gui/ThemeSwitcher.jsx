// ThemeSwitcher — live preset picker with swatches + preview.
function ThemeSwitcher({ current, onChoose }) {
  const themes = Object.entries(window.NIA_THEMES);
  return (
    <div style={{ padding:'24px 28px', fontFamily:'var(--font-sans)' }}>
      <div style={{ marginBottom:16 }}>
        <div className="eyebrow" style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--fg-muted)', marginBottom:4 }}>Appearance</div>
        <h1 style={{ margin:0, fontSize:28, fontWeight:700, letterSpacing:'-0.02em' }}>Theme</h1>
        <div style={{ color:'var(--fg-muted)', fontSize:13, marginTop:4 }}>
          Preview the whole app in each preset. The published website inherits the same tokens.
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:14 }}>
        {themes.map(([id, t]) => (
          <ThemeCard key={id} id={id} t={t} active={id === current} onChoose={() => onChoose(id)}/>
        ))}
      </div>
    </div>
  );
}

function ThemeCard({ id, t, active, onChoose }) {
  const radiusNum = parseFloat(t.radius) || 0;
  return (
    <button onClick={onChoose} style={{
      display:'flex', flexDirection:'column', gap:0, padding:0, cursor:'pointer',
      background:'var(--surface)', border: active ? '2px solid var(--nia-forest)' : '1px solid var(--border)',
      borderRadius:10, overflow:'hidden', textAlign:'left', fontFamily:'var(--font-sans)',
      boxShadow: active ? 'var(--shadow-md)' : 'var(--shadow-sm)',
      transition:'box-shadow var(--motion-fast), transform var(--motion-fast)',
    }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.boxShadow='var(--shadow-md)'; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.boxShadow='var(--shadow-sm)'; }}
    >
      {/* mini-app preview */}
      <div style={{
        height:160, display:'grid', gridTemplateColumns:'46px 1fr',
        background: t.bg, borderBottom:'1px solid var(--border)'
      }}>
        <div style={{ background: t.sidebarBg, padding:'10px 0', display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
          <div style={{ width:18, height:18, borderRadius: Math.min(5, radiusNum + 3), background: t.primary }}/>
          {[0,1,2,3].map(i => (
            <div key={i} style={{
              width:26, height:6, borderRadius:2,
              background: i === 1 ? t.sidebarActive : 'transparent',
              opacity: i === 1 ? 1 : 0.25,
              border: i !== 1 ? `1px solid ${t.sidebarFg}` : 'none'
            }}/>
          ))}
        </div>
        <div style={{ padding:12, display:'flex', flexDirection:'column', gap:6 }}>
          <div style={{ height:10, width:'60%', background: t.fg, opacity:0.9, borderRadius:2, fontFamily: t.fontSans }}/>
          <div style={{ height:6,  width:'40%', background: t.fgMuted, opacity:0.6, borderRadius:2 }}/>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:4, marginTop:4 }}>
            {[t.accentBlue, t.accentAmber, t.accentGreen, t.accentOrange].map((c,i) => (
              <div key={i} style={{
                height:28, background: t.surface,
                border: `${t.borderW} solid ${t.border}`,
                borderLeft: `3px solid ${c}`,
                borderRadius: t.radius
              }}/>
            ))}
          </div>
        </div>
      </div>

      {/* meta */}
      <div style={{ padding:'12px 14px', display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ fontSize:14, fontWeight:600, color:'var(--fg)', fontFamily: t.fontSans }}>{t.name}</div>
            {active && <StatusChip kind="fresh">active</StatusChip>}
          </div>
          <div style={{ fontSize:11, color:'var(--fg-muted)', marginTop:2 }}>{t.desc}</div>
        </div>
        <div style={{ display:'flex', gap:4 }}>
          {[t.primary, t.accentBlue, t.accentAmber, t.accentGreen].map((c,i) => (
            <div key={i} style={{ width:14, height:14, borderRadius:99, background:c, border:'1px solid var(--border)' }}/>
          ))}
        </div>
      </div>
      <div style={{ padding:'8px 14px', borderTop:'1px solid var(--border)', background:'var(--bg-muted)', fontSize:11, color:'var(--fg-muted)', fontFamily:'var(--font-mono)', display:'flex', gap:10 }}>
        <span>radius {t.radius}</span>
        <span>•</span>
        <span>{t.fontSans.split(',')[0].replace(/"/g,'')}</span>
      </div>
    </button>
  );
}

Object.assign(window, { ThemeSwitcher });
