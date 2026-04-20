function CollectionsScreen({ onEditWidget }) {
  const collections = [
    { name:'Taxon',        icon:ILeaf,   status:'stale',   count:'12,408', desc:'One page per species · widgets: distribution map, DBH, phenology', updated:'3d' },
    { name:'Plot',         icon:IFlag,   status:'fresh',   count:'238',    desc:'Forest inventory plots · widgets: species list, structure, soil', updated:'2m' },
    { name:'Shape',        icon:IGlobe,  status:'fresh',   count:'3',      desc:'Administrative boundaries · widgets: area, richness index', updated:'2m' },
    { name:'Indicators',   icon:ILayers, status:'stale',   count:'14',     desc:'Derived biodiversity metrics · Shannon, endemism rate, richness', updated:'3d' },
  ];

  return (
    <div style={{ padding:'24px 28px', fontFamily:'var(--font-sans)' }}>
      <div style={{ display:'flex', alignItems:'center', marginBottom:16 }}>
        <div>
          <div className="eyebrow" style={{ fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--fg-muted)', fontWeight:600 }}>Stage 2</div>
          <h1 style={{ margin:0, fontSize:24, fontWeight:700, letterSpacing:'-0.02em' }}>Collections</h1>
        </div>
        <div style={{ flex:1 }}/>
        <button style={btnOutline}><IRefresh size={13}/> Recalculate all</button>
        <div style={{ width:8 }}/>
        <button style={btnPrimary}><IPlus size={13}/> New collection</button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:14 }}>
        {collections.map((c, i) => (
          <div key={i} onClick={() => c.name === 'Taxon' && onEditWidget && onEditWidget()} style={{
            background:'var(--surface)', border:'1px solid var(--border)',
            borderRadius:7, padding:16,
            display:'flex', flexDirection:'column', gap:10,
            transition:'box-shadow var(--motion-fast), transform var(--motion-fast)',
            cursor:'pointer'
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow='var(--shadow-md)'; e.currentTarget.style.transform='translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; }}
          >
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{
                width:34, height:34, borderRadius:7,
                background:'#ecfdf5', color:'var(--nia-forest)',
                display:'flex', alignItems:'center', justifyContent:'center'
              }}><c.icon size={18}/></div>
              <div>
                <div style={{ fontWeight:600, fontSize:14 }}>{c.name}</div>
                <div style={{ fontSize:11, color:'var(--fg-muted)', fontFamily:'var(--font-mono)' }}>{c.count} entries</div>
              </div>
              <div style={{ marginLeft:'auto' }}><StatusChip kind={c.status}>{c.status}</StatusChip></div>
            </div>
            <div style={{ fontSize:12, color:'var(--fg-muted)', lineHeight:1.5 }}>{c.desc}</div>
            <div style={{ display:'flex', gap:6, alignItems:'center', marginTop:4 }}>
              <button style={{ ...btnGhost, padding:'4px 8px', fontSize:11 }} onClick={e => e.stopPropagation()}><IRefresh size={11}/> Recalculate</button>
              <button style={{ ...btnGhost, padding:'4px 8px', fontSize:11 }} onClick={e => { e.stopPropagation(); onEditWidget && onEditWidget(); }}><ISettings size={11}/> Edit widgets</button>
              <div style={{ flex:1 }}/>
              <span style={{ fontSize:10, color:'var(--fg-faint)', fontFamily:'var(--font-mono)' }}>updated {c.updated} ago</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.CollectionsScreen = CollectionsScreen;
