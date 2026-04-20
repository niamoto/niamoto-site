function TopBar({ project, onAction, onSearch }) {
  return (
    <header style={{
      display:'flex', alignItems:'center', gap:12,
      padding:'10px 18px',
      background:'var(--surface)',
      borderBottom:'1px solid var(--border)',
      fontFamily:'var(--font-sans)'
    }}>
      <div>
        <div style={{ fontSize:14, fontWeight:600, letterSpacing:'-0.01em', color:'var(--fg)' }}>{project.name}</div>
        <div style={{ fontSize:11, color:'var(--fg-muted)', fontFamily:'var(--font-mono)' }}>{project.path}</div>
      </div>

      <div style={{ flex:1 }}/>

      <button onClick={onSearch} style={{
        display:'flex', alignItems:'center', gap:6,
        background:'var(--bg-muted)', border:'1px solid var(--border)',
        padding:'4px 10px', borderRadius:6, fontSize:12, color:'var(--fg-muted)',
        minWidth:220, cursor:'pointer', fontFamily:'var(--font-sans)'
      }}>
        <ISearch size={13}/>
        <span>Search taxa, fields, configs…</span>
        <span style={{ marginLeft:'auto', fontFamily:'var(--font-mono)', fontSize:11, color:'var(--fg-faint)' }}>⌘K</span>
      </button>

      <button onClick={() => onAction('recalc')} style={btnOutline}>
        <IRefresh size={13}/> Recalculate
      </button>
      <button onClick={() => onAction('publish')} style={btnPrimary}>
        <ISend size={13}/> Publish
      </button>
      <div style={{
        width:28, height:28, borderRadius:'50%',
        background:'linear-gradient(135deg,#2E7D32,#4BAF50)',
        color:'#fff', fontSize:12, fontWeight:600,
        display:'flex', alignItems:'center', justifyContent:'center'
      }}>JB</div>
    </header>
  );
}

const btnPrimary = {
  display:'inline-flex', alignItems:'center', gap:6,
  fontFamily:'var(--font-sans)', fontSize:13, fontWeight:500,
  background:'var(--nia-forest)', color:'#fff', border:0,
  padding:'7px 12px', borderRadius:6, cursor:'pointer',
  boxShadow:'0 1px 2px rgba(0,0,0,.05)',
  transition:'transform var(--motion-fast), filter var(--motion-fast)'
};
const btnOutline = {
  display:'inline-flex', alignItems:'center', gap:6,
  fontFamily:'var(--font-sans)', fontSize:13, fontWeight:500,
  background:'var(--surface)', color:'var(--fg)',
  border:'1px solid var(--border-strong)',
  padding:'6px 12px', borderRadius:6, cursor:'pointer',
  transition:'background var(--motion-fast)'
};
const btnGhost = {
  display:'inline-flex', alignItems:'center', gap:6,
  fontFamily:'var(--font-sans)', fontSize:13, fontWeight:500,
  background:'transparent', color:'var(--fg-muted)', border:0,
  padding:'7px 10px', borderRadius:6, cursor:'pointer',
};

Object.assign(window, { TopBar, btnPrimary, btnOutline, btnGhost });
