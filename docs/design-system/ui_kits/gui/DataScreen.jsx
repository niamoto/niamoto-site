function DataScreen() {
  const sources = [
    { name:'taxonomy.csv',    status:'fresh',   rows:'12,408',  updated:'2m ago',  type:'Taxonomy',    fields:9 },
    { name:'occurrences.csv', status:'fresh',   rows:'489,217', updated:'2m ago',  type:'Occurrences', fields:14 },
    { name:'plots.shp',       status:'stale',   rows:'238',     updated:'3d ago',  type:'Plot geometry', fields:6 },
    { name:'shapes/provinces.geojson', status:'fresh', rows:'3', updated:'2m ago', type:'Boundaries',  fields:4 },
  ];
  return (
    <div style={{ padding:'24px 28px', fontFamily:'var(--font-sans)' }}>
      <div style={{ display:'flex', alignItems:'center', marginBottom:16 }}>
        <div>
          <div className="eyebrow" style={{ fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--fg-muted)', fontWeight:600 }}>Stage 1</div>
          <h1 style={{ margin:0, fontSize:24, fontWeight:700, letterSpacing:'-0.02em' }}>Data sources</h1>
        </div>
        <div style={{ flex:1 }}/>
        <button style={btnOutline}><IUpload size={13}/> Import file</button>
        <div style={{ width:8 }}/>
        <button style={btnPrimary}><IPlus size={13}/> Connect source</button>
      </div>

      <Card pad={0}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 0.8fr 40px', padding:'10px 16px', background:'var(--bg-muted)', fontSize:11, color:'var(--fg-muted)', fontWeight:600, letterSpacing:'0.04em', textTransform:'uppercase' }}>
          <div>Source</div><div>Type</div><div>Rows</div><div>Updated</div><div>Status</div><div/>
        </div>
        {sources.map((s, i) => (
          <div key={i} style={{
            display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 0.8fr 40px',
            padding:'12px 16px', alignItems:'center',
            borderTop:'1px solid var(--border)',
            fontSize:13,
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <IDatabase size={14} style={{ color:'var(--fg-muted)' }}/>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'var(--fg)' }}>{s.name}</span>
            </div>
            <div style={{ color:'var(--fg)' }}>{s.type}</div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'var(--fg-muted)' }}>{s.rows}</div>
            <div style={{ color:'var(--fg-muted)' }}>{s.updated}</div>
            <div><StatusChip kind={s.status}>{s.status}</StatusChip></div>
            <div style={{ textAlign:'right' }}><IMore size={14} style={{ color:'var(--fg-muted)' }}/></div>
          </div>
        ))}
      </Card>

      <div style={{ marginTop:18, display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <Card title="Field mapping — occurrences.csv">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 16px 1fr', gap:8, fontSize:12, alignItems:'center' }}>
            {[
              ['occ_id','occurrence_id'],
              ['taxon_id','taxon_ref_id'],
              ['lat','decimal_latitude'],
              ['lon','decimal_longitude'],
              ['date','event_date'],
            ].map(([a,b], i) => (
              <React.Fragment key={i}>
                <div style={{ fontFamily:'var(--font-mono)', color:'var(--fg-muted)' }}>{a}</div>
                <IChevRight size={12} style={{ color:'var(--fg-faint)' }}/>
                <div style={{ fontFamily:'var(--font-mono)', color:'var(--fg)' }}>{b}</div>
              </React.Fragment>
            ))}
          </div>
        </Card>
        <Card title="CLI · equivalent command">
          <pre style={{
            margin:0, fontFamily:'var(--font-mono)', fontSize:12,
            background:'var(--bg-muted)', padding:12, borderRadius:6,
            color:'var(--fg)', lineHeight:1.55, overflow:'auto'
          }}>
<span style={{ color:'var(--nia-steel)' }}>$</span> niamoto import \{'\n'}    --taxonomy imports/taxonomy.csv \{'\n'}    --occurrences imports/occurrences.csv \{'\n'}    --plots imports/plots.shp
          </pre>
        </Card>
      </div>
    </div>
  );
}

window.DataScreen = DataScreen;
