// PluginMarketplace — install / manage exporter, loader, widget, transformer plugins.
function PluginMarketplace() {
  const [tab, setTab] = React.useState('browse');
  const [cat, setCat] = React.useState('all');
  const cats = [
    { id:'all',         label:'All plugins',   count: 24 },
    { id:'loader',      label:'Loaders',       count: 6 },
    { id:'transformer', label:'Transformers',  count: 9 },
    { id:'widget',      label:'Widgets',       count: 7 },
    { id:'exporter',    label:'Exporters',     count: 2 },
  ];
  const plugins = [
    { id:'darwincore', name:'Darwin Core loader', kind:'loader', desc:'Import occurrences in DwC-A (zip + meta.xml) format straight from GBIF or a local archive.', author:'niamoto-team', verified:true, installed:true, stars:342, version:'1.4.2', updated:'12d ago' },
    { id:'gbif-live', name:'GBIF live sync', kind:'loader', desc:'Query and stream GBIF occurrences with a paged cursor. Resumable.', author:'@sylvainvincent', verified:true, installed:true, stars:221, version:'0.9.1', updated:'1mo ago' },
    { id:'iucn-status', name:'IUCN Red List status', kind:'transformer', desc:'Enrich each taxon with its current Red List category by name-matching on the IUCN API.', author:'@redlist-tools', verified:true, installed:true, stars:184, version:'2.0.0', updated:'4d ago' },
    { id:'morpho', name:'Morphological traits', kind:'transformer', desc:'Compute DBH bins, basal area, height class, crown projection area from raw measurements.', author:'niamoto-team', verified:true, installed:true, stars:512, version:'3.1.0', updated:'8d ago' },
    { id:'phylo-tree', name:'Phylogenetic tree widget', kind:'widget', desc:'Interactive d3-based phylogram with zoom, collapsing, tip highlighting.', author:'@canopylab', verified:false, installed:false, stars:78, version:'0.6.0', updated:'3mo ago' },
    { id:'endemism', name:'Endemism map', kind:'widget', desc:'Choropleth that shades provinces/communes by endemism score, with a diverging Steel→Forest ramp.', author:'@iac-nc', verified:true, installed:false, stars:129, version:'1.0.4', updated:'2w ago' },
    { id:'sankey', name:'Habitat → taxon sankey', kind:'widget', desc:'Flow diagram linking habitat types to the taxa they host, sized by occurrence count.', author:'@open-ecology', verified:false, installed:false, stars:44, version:'0.3.0', updated:'6mo ago' },
    { id:'netlify', name:'Netlify deploy', kind:'exporter', desc:'Zero-config publish with deploy previews and redirects. Reads ~/.netlify/auth.', author:'niamoto-team', verified:true, installed:true, stars:267, version:'1.2.0', updated:'1mo ago' },
    { id:'ipfs', name:'IPFS / Web3.storage', kind:'exporter', desc:'Publish to IPFS with pinning and a CID history log.', author:'@decentralized-biota', verified:false, installed:false, stars:62, version:'0.5.1', updated:'2mo ago' },
  ];
  const filtered = plugins.filter(p => cat === 'all' || p.kind === cat);
  const installed = plugins.filter(p => p.installed);

  return (
    <div style={{ padding:'24px 28px', fontFamily:'var(--font-sans)' }}>
      <div style={{ marginBottom:16 }}>
        <div className="eyebrow" style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--fg-muted)', marginBottom:4 }}>Extensions</div>
        <h1 style={{ margin:0, fontSize:28, fontWeight:700, letterSpacing:'-0.02em' }}>Plugin marketplace</h1>
        <div style={{ color:'var(--fg-muted)', fontSize:13, marginTop:4 }}>
          {installed.length} installed · {plugins.length} available · sync'd 2m ago from registry
        </div>
      </div>

      {/* tabs */}
      <div style={{ display:'flex', gap:2, borderBottom:'1px solid var(--border)', marginBottom:18 }}>
        {[['browse','Browse'],['installed',`Installed (${installed.length})`],['updates','Updates (2)']].map(([id,l]) => {
          const active = id === tab;
          return (
            <button key={id} onClick={() => setTab(id)} style={{
              padding:'10px 14px', border:0, background:'transparent',
              borderBottom: active ? '2px solid var(--nia-forest)' : '2px solid transparent',
              color: active ? 'var(--fg)' : 'var(--fg-muted)',
              fontWeight: active ? 600 : 500, fontSize:13, cursor:'pointer',
              fontFamily:'var(--font-sans)', marginBottom:-1
            }}>{l}</button>
          );
        })}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', gap:20 }}>
        {/* category rail */}
        <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
          {cats.map(c => {
            const active = c.id === cat;
            return (
              <button key={c.id} onClick={() => setCat(c.id)} style={{
                display:'flex', alignItems:'center', gap:6, padding:'8px 10px',
                border:0, background: active ? 'var(--bg-muted)' : 'transparent',
                borderRadius:6, cursor:'pointer', textAlign:'left',
                fontFamily:'var(--font-sans)', fontSize:13,
                color: active ? 'var(--fg)' : 'var(--fg-muted)',
                fontWeight: active ? 600 : 500
              }}>
                <span style={{ flex:1 }}>{c.label}</span>
                <span style={{ fontSize:11, color:'var(--fg-faint)' }}>{c.count}</span>
              </button>
            );
          })}
          <div style={{ marginTop:16, padding:12, background:'var(--bg-muted)', borderRadius:7, fontSize:11, color:'var(--fg-muted)', lineHeight:1.5 }}>
            <div style={{ fontWeight:600, color:'var(--fg)', fontSize:12, marginBottom:4 }}>Publish a plugin</div>
            Plugins are Python packages on PyPI prefixed with <code style={{fontFamily:'var(--font-mono)'}}>niamoto-</code>.{' '}
            <a href="#" style={{ color:'var(--nia-forest)' }}>Read the docs</a>
          </div>
        </div>

        {/* grid */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {(tab === 'installed' ? installed : filtered).map(p => (
            <PluginCard key={p.id} p={p}/>
          ))}
        </div>
      </div>
    </div>
  );
}

function PluginCard({ p }) {
  const kindColor = {
    loader:'#3b82f6', transformer:'#f59e0b', widget:'#10b981', exporter:'#f97316'
  }[p.kind];
  return (
    <div style={{
      background:'var(--surface)', border:'1px solid var(--border)',
      borderRadius:7, padding:16, display:'flex', flexDirection:'column', gap:10,
      transition:'box-shadow var(--motion-fast), transform var(--motion-fast)',
      cursor:'pointer'
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow='var(--shadow-md)'; e.currentTarget.style.transform='translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; }}
    >
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{
          width:36, height:36, borderRadius:8,
          background:`${kindColor}15`, color:kindColor,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontFamily:'var(--font-mono)', fontSize:14, fontWeight:600,
          textTransform:'uppercase'
        }}>{p.kind[0]}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ fontSize:14, fontWeight:600, color:'var(--fg)', letterSpacing:'-0.01em' }}>{p.name}</div>
            {p.verified && <span title="Verified publisher" style={{ color:'#3b82f6' }}><ICheck size={12}/></span>}
          </div>
          <div style={{ fontSize:11, color:'var(--fg-muted)', fontFamily:'var(--font-mono)' }}>
            niamoto-{p.id} · {p.version}
          </div>
        </div>
        <div style={{
          fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em',
          color:kindColor, background:`${kindColor}15`, padding:'2px 7px', borderRadius:4
        }}>{p.kind}</div>
      </div>

      <p style={{ margin:0, fontSize:12, color:'var(--fg-muted)', lineHeight:1.55, textWrap:'pretty' }}>
        {p.desc}
      </p>

      <div style={{ display:'flex', alignItems:'center', gap:10, fontSize:11, color:'var(--fg-muted)', marginTop:'auto' }}>
        <span>★ {p.stars.toLocaleString()}</span>
        <span>•</span>
        <span>{p.author}</span>
        <span>•</span>
        <span>Updated {p.updated}</span>
        <div style={{ flex:1 }}/>
        {p.installed
          ? <button style={{...btnOutline, padding:'5px 10px', fontSize:12}}><ISettings size={12}/> Configure</button>
          : <button style={{...btnPrimary, padding:'5px 10px', fontSize:12}}><IPlus size={12}/> Install</button>
        }
      </div>
    </div>
  );
}

Object.assign(window, { PluginMarketplace });
