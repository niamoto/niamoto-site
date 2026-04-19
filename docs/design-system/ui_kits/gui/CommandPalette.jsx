// CommandPalette — ⌘K modal. Fuzzy-search commands, recent items, navigation jumps.
function CommandPalette({ open, onClose, onNavigate }) {
  const [q, setQ] = React.useState('');
  const inputRef = React.useRef(null);
  const [sel, setSel] = React.useState(0);

  React.useEffect(() => {
    if (open) { setTimeout(() => inputRef.current?.focus(), 20); setQ(''); setSel(0); }
  }, [open]);

  const commands = [
    { grp:'Navigate', label:'Go to Dashboard',   hint:'G D', Icon: IHome,     act:() => onNavigate('dashboard') },
    { grp:'Navigate', label:'Go to Data sources', hint:'G S', Icon: IDatabase, act:() => onNavigate('data') },
    { grp:'Navigate', label:'Go to Collections',  hint:'G C', Icon: ILayers,   act:() => onNavigate('collections') },
    { grp:'Navigate', label:'Go to Site',         hint:'G W', Icon: IGlobe,    act:() => onNavigate('site') },
    { grp:'Navigate', label:'Go to Publish',      hint:'G P', Icon: ISend,     act:() => onNavigate('publish') },
    { grp:'Navigate', label:'Go to Plugins',      hint:'G X', Icon: IFlag,     act:() => onNavigate('plugins') },
    { grp:'Actions',  label:'Recalculate all collections', hint:'⌘ R', Icon: IRefresh, act:() => {} },
    { grp:'Actions',  label:'Build site',                  hint:'⌘ B', Icon: IGlobe,   act:() => {} },
    { grp:'Actions',  label:'Publish to production',       hint:'⌘ ⇧ P', Icon: ISend, act:() => {} },
    { grp:'Actions',  label:'Import data source…',         hint:'⌘ I', Icon: IUpload,  act:() => {} },
    { grp:'Actions',  label:'New collection…',             hint:'⌘ N', Icon: IPlus,    act:() => {} },
    { grp:'Taxa',     label:'Araucaria columnaris', hint:'taxon',      Icon: ILeaf, sub:'34 occurrences · 12 plots', act:() => {} },
    { grp:'Taxa',     label:'Agathis moorei',       hint:'taxon',      Icon: ILeaf, sub:'128 occurrences · 7 plots',  act:() => {} },
    { grp:'Taxa',     label:'Nothofagus aequilateralis', hint:'taxon', Icon: ILeaf, sub:'89 occurrences · 22 plots',  act:() => {} },
    { grp:'Settings', label:'Open project settings', hint:'⌘ ,', Icon: ISettings, act:() => {} },
    { grp:'Settings', label:'Switch theme…',         hint:'⌘ T', Icon: ISettings, act:() => onNavigate('theme') },
  ];

  const filtered = commands.filter(c =>
    !q || (c.label + ' ' + c.grp + ' ' + (c.sub||'')).toLowerCase().includes(q.toLowerCase())
  );

  const groups = {};
  filtered.forEach(c => { (groups[c.grp] = groups[c.grp] || []).push(c); });

  React.useEffect(() => { if (sel >= filtered.length) setSel(0); }, [q, filtered.length]);

  const flat = filtered;
  const onKey = (e) => {
    if (e.key === 'Escape') { onClose(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setSel(s => Math.min(s+1, flat.length-1)); }
    else if (e.key === 'ArrowUp')   { e.preventDefault(); setSel(s => Math.max(s-1, 0)); }
    else if (e.key === 'Enter') { flat[sel]?.act(); onClose(); }
  };

  if (!open) return null;
  return (
    <div onMouseDown={onClose} style={{
      position:'fixed', inset:0, background:'rgba(20,22,26,0.45)', backdropFilter:'blur(3px)',
      display:'flex', alignItems:'flex-start', justifyContent:'center', zIndex:9999,
      paddingTop:'10vh', fontFamily:'var(--font-sans)'
    }}>
      <div onMouseDown={e => e.stopPropagation()} style={{
        width:620, maxWidth:'92vw', background:'var(--surface)',
        borderRadius:'var(--radius-2xl, 12px)', boxShadow:'var(--shadow-xl)',
        border:'1px solid var(--border)', overflow:'hidden'
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'14px 16px', borderBottom:'1px solid var(--border)' }}>
          <ISearch size={16} style={{ color:'var(--fg-muted)' }}/>
          <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} onKeyDown={onKey}
            placeholder="Type a command, taxon, or jump to a screen…"
            style={{
              flex:1, border:0, outline:'none', background:'transparent',
              fontFamily:'var(--font-sans)', fontSize:15, color:'var(--fg)'
            }}/>
          <kbd style={kbd}>esc</kbd>
        </div>
        <div style={{ maxHeight:420, overflow:'auto', padding:6 }}>
          {Object.keys(groups).length === 0 && (
            <div style={{ padding:'32px 16px', textAlign:'center', color:'var(--fg-muted)', fontSize:13 }}>
              No matches for "{q}"
            </div>
          )}
          {Object.entries(groups).map(([grp, rows]) => (
            <div key={grp} style={{ marginBottom:4 }}>
              <div style={{
                fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em',
                color:'var(--fg-faint)', padding:'8px 10px 4px'
              }}>{grp}</div>
              {rows.map((r) => {
                const idx = flat.indexOf(r);
                const active = idx === sel;
                return (
                  <button key={r.label} onMouseEnter={() => setSel(idx)} onClick={() => { r.act(); onClose(); }}
                    style={{
                      display:'flex', alignItems:'center', gap:10, width:'100%',
                      padding:'8px 10px', border:0, cursor:'pointer', textAlign:'left',
                      background: active ? 'var(--bg-muted)' : 'transparent',
                      borderRadius:6, fontFamily:'var(--font-sans)', color:'var(--fg)', fontSize:13
                    }}>
                    <span style={{ color: active ? 'var(--nia-forest)' : 'var(--fg-muted)' }}><r.Icon size={14}/></span>
                    <span style={{ flex:1 }}>
                      <div>{r.label}</div>
                      {r.sub && <div style={{ fontSize:11, color:'var(--fg-muted)' }}>{r.sub}</div>}
                    </span>
                    <kbd style={kbd}>{r.hint}</kbd>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div style={{
          display:'flex', alignItems:'center', gap:14, padding:'8px 14px',
          borderTop:'1px solid var(--border)', background:'var(--bg-muted)',
          fontSize:11, color:'var(--fg-muted)', fontFamily:'var(--font-mono)'
        }}>
          <span><kbd style={kbd}>↑↓</kbd> navigate</span>
          <span><kbd style={kbd}>↵</kbd> run</span>
          <span><kbd style={kbd}>esc</kbd> close</span>
          <span style={{ marginLeft:'auto' }}>{flat.length} result{flat.length===1?'':'s'}</span>
        </div>
      </div>
    </div>
  );
}

const kbd = {
  fontFamily:'var(--font-mono)', fontSize:10, color:'var(--fg-muted)',
  background:'var(--surface)', border:'1px solid var(--border)',
  padding:'1px 5px', borderRadius:4, whiteSpace:'nowrap'
};

Object.assign(window, { CommandPalette });
