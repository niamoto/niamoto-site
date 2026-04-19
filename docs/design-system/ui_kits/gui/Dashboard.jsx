function Dashboard({ project, onNavigate }) {
  return (
    <div style={{ padding:'24px 28px', fontFamily:'var(--font-sans)' }}>
      <div style={{ marginBottom:20 }}>
        <div className="eyebrow" style={{ fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--fg-muted)', fontWeight:600, marginBottom:4 }}>Overview</div>
        <h1 style={{ margin:0, fontSize:28, fontWeight:700, letterSpacing:'-0.02em', color:'var(--fg)' }}>{project.name}</h1>
        <div style={{ color:'var(--fg-muted)', fontSize:13, marginTop:4 }}>Updates are needed — 2 collection(s) stale · last built 4m ago</div>
      </div>

      <div style={{
        display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14, marginBottom:20
      }}>
        <StageCard accent="#3b82f6" icon={IDatabase} title="Data"
          status={<StatusChip kind="fresh">fresh</StatusChip>}
          stats={[{ value:'3', label:'sources' }, { value:'489k', label:'rows' }]}
          hint="Imported 2m ago · taxonomy, occurrences, plots"/>
        <StageCard accent="#f59e0b" icon={ILayers} title="Collections"
          status={<StatusChip kind="stale">stale</StatusChip>}
          stats={[{ value:'4', label:'collections' }, { value:'2', label:'need update' }]}
          hint="Taxon · Plot · Shape · Indicators"/>
        <StageCard accent="#10b981" icon={IGlobe} title="Site"
          status={<StatusChip kind="fresh">fresh</StatusChip>}
          stats={[{ value:'18', label:'pages' }, { value:'2.4s', label:'build' }]}
          hint="Built to exports/web · 4m ago"/>
        <StageCard accent="#f97316" icon={ISend} title="Publish"
          status={<StatusChip kind="idle">never_run</StatusChip>}
          stats={[{ value:'—', label:'target' }, { value:'—', label:'last push' }]}
          hint="Not yet run"/>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:14 }}>
        <Card title="Pipeline queue" actions={
          <button style={btnGhost}><IMore size={14}/></button>
        }>
          <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
            {[
              { t:'Recalculate 4 collection(s)', s:'running', d:'3.1s elapsed', ic: IRefresh, color:'#3b82f6' },
              { t:'Rebuild site', s:'queued', d:'after collections', ic: IGlobe, color:'var(--fg-muted)' },
              { t:'Publish to niamoto-nc.github.io', s:'queued', d:'manual trigger', ic: ISend, color:'var(--fg-muted)' },
            ].map((row, i) => (
              <div key={i} style={{
                display:'flex', alignItems:'center', gap:12,
                padding:'12px 0',
                borderTop: i>0 ? '1px solid var(--border)' : 'none'
              }}>
                <div style={{ color: row.color }}><row.ic size={16}/></div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:500, color:'var(--fg)' }}>{row.t}</div>
                  <div style={{ fontSize:11, color:'var(--fg-muted)', fontFamily:'var(--font-mono)' }}>{row.d}</div>
                </div>
                <StatusChip kind={row.s==='running' ? 'running' : 'idle'}>{row.s}</StatusChip>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Recent activity">
          <div style={{ display:'flex', flexDirection:'column', gap:10, fontSize:12 }}>
            {[
              { d:'2m', t:'Imported 489,217 occurrences', c:'#22c55e' },
              { d:'4m', t:'Rebuilt site → 18 pages', c:'#22c55e' },
              { d:'1h', t:'Updated taxon collection schema', c:'var(--fg-muted)' },
              { d:'3d', t:'Initial commit · niamoto init', c:'var(--fg-muted)' },
            ].map((e,i) => (
              <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                <span style={{ width:6, height:6, borderRadius:999, background:e.c, marginTop:6 }}/>
                <div style={{ flex:1 }}>
                  <div style={{ color:'var(--fg)' }}>{e.t}</div>
                  <div style={{ color:'var(--fg-muted)', fontFamily:'var(--font-mono)', fontSize:10 }}>{e.d} ago</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

window.Dashboard = Dashboard;
