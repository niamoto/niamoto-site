function StatusChip({ kind, children }) {
  const map = {
    fresh:   { bg:'#dcfce7', fg:'#166534', dot:'#22c55e' },
    stale:   { bg:'#fef3c7', fg:'#92400e', dot:'#f59e0b' },
    running: { bg:'#dbeafe', fg:'#1e40af', dot:'#3b82f6' },
    idle:    { bg:'oklch(0.94 0.005 250)', fg:'var(--fg-muted)', dot:'oklch(0.7 0.01 250)' },
    error:   { bg:'#fee2e2', fg:'#991b1b', dot:'#ef4444' },
  };
  const c = map[kind] || map.idle;
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:6,
      background:c.bg, color:c.fg, padding:'2px 10px',
      borderRadius:9999, fontFamily:'var(--font-sans)', fontSize:11, fontWeight:500,
      whiteSpace:'nowrap'
    }}>
      <span style={{ width:6, height:6, borderRadius:999, background:c.dot }}/>
      {children}
    </span>
  );
}

function StageCard({ accent, icon:IconC, title, status, stats, hint }) {
  return (
    <div style={{
      background:'var(--surface)',
      border:'1px solid var(--border)',
      borderLeft:`3px solid ${accent}`,
      borderRadius:7, padding:16,
      transition:'transform var(--motion-fast), box-shadow var(--motion-fast)',
      cursor:'pointer'
    }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow='var(--shadow-md)'; e.currentTarget.style.transform='translateY(-1px)'; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; }}
    >
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
        <div style={{
          width:36, height:36, borderRadius:8,
          background:`${accent}15`, color:accent,
          display:'flex', alignItems:'center', justifyContent:'center'
        }}>
          <IconC size={18}/>
        </div>
        <div style={{ fontFamily:'var(--font-sans)', fontWeight:600, fontSize:15, color:'var(--fg)' }}>{title}</div>
        <div style={{ marginLeft:'auto' }}>{status}</div>
      </div>
      <div style={{ display:'flex', gap:16, marginBottom:6 }}>
        {stats.map((s,i) => (
          <div key={i}>
            <div style={{ fontSize:18, fontWeight:700, color:'var(--fg)', fontFamily:'var(--font-sans)', letterSpacing:'-0.02em' }}>{s.value}</div>
            <div style={{ fontSize:11, color:'var(--fg-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize:11, color:'var(--fg-muted)' }}>{hint}</div>
    </div>
  );
}

function Card({ children, title, actions, pad=16, style }) {
  return (
    <div style={{
      background:'var(--surface)', border:'1px solid var(--border)',
      borderRadius:7, boxShadow:'var(--shadow-sm)', ...style
    }}>
      {title && (
        <div style={{
          display:'flex', alignItems:'center', gap:8,
          padding:'12px 16px', borderBottom:'1px solid var(--border)'
        }}>
          <div style={{ fontWeight:600, fontSize:13, color:'var(--fg)' }}>{title}</div>
          <div style={{ flex:1 }}/>
          {actions}
        </div>
      )}
      <div style={{ padding:pad }}>{children}</div>
    </div>
  );
}

Object.assign(window, { StatusChip, StageCard, Card });
