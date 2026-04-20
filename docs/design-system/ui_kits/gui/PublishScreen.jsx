function PublishScreen() {
  const [pushing, setPushing] = React.useState(false);
  return (
    <div style={{ padding:'24px 28px', fontFamily:'var(--font-sans)' }}>
      <div style={{ marginBottom:16 }}>
        <div className="eyebrow" style={{ fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--fg-muted)', fontWeight:600 }}>Stage 4</div>
        <h1 style={{ margin:0, fontSize:24, fontWeight:700, letterSpacing:'-0.02em' }}>Publish</h1>
        <div style={{ color:'var(--fg-muted)', fontSize:13, marginTop:4 }}>Push the generated site to your hosting target.</div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <Card title="Target">
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <div style={{
              display:'flex', alignItems:'center', gap:10, padding:12,
              border:'1px solid var(--nia-forest)', borderRadius:6, background:'#ecfdf5'
            }}>
              <IGlobe size={16} style={{ color:'var(--nia-forest)' }}/>
              <div>
                <div style={{ fontWeight:600, fontSize:13 }}>GitHub Pages</div>
                <div style={{ fontSize:11, color:'var(--fg-muted)', fontFamily:'var(--font-mono)' }}>niamoto-nc.github.io</div>
              </div>
              <ICheck size={16} style={{ marginLeft:'auto', color:'var(--nia-leaf)' }}/>
            </div>
            {['Netlify','S3 + CloudFront','Custom SSH'].map((t,i) => (
              <div key={i} style={{
                display:'flex', alignItems:'center', gap:10, padding:12,
                border:'1px solid var(--border)', borderRadius:6,
                color:'var(--fg-muted)', fontSize:13
              }}>
                <ICircle size={16}/> {t}
                <span style={{ marginLeft:'auto', fontSize:11 }}>not configured</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Ready-to-push">
          <div style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'var(--fg-muted)', marginBottom:12 }}>exports/web/ · 18 pages · 2.4 MB</div>
          <div style={{ display:'flex', flexDirection:'column', gap:6, fontSize:12 }}>
            {[
              ['index.html','12 KB'],
              ['taxon/araucaria-montana.html','18 KB'],
              ['taxon/agathis-moorei.html','16 KB'],
              ['plot/plot-112.html','9 KB'],
              ['assets/js/niamoto.js','88 KB'],
            ].map(([f,s],i) => (
              <div key={i} style={{ display:'flex', gap:10, alignItems:'center', padding:'4px 0' }}>
                <IArrowUpRight size={12} style={{ color:'var(--fg-faint)' }}/>
                <span style={{ fontFamily:'var(--font-mono)', color:'var(--fg)' }}>{f}</span>
                <span style={{ marginLeft:'auto', fontFamily:'var(--font-mono)', color:'var(--fg-muted)' }}>{s}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop:16, display:'flex', gap:8 }}>
            <button onClick={() => { setPushing(true); setTimeout(() => setPushing(false), 2000); }} style={{ ...btnPrimary, flex:1, justifyContent:'center' }}>
              {pushing ? <><IRefresh size={13}/> Pushing…</> : <><ISend size={13}/> Publish now</>}
            </button>
            <button style={btnOutline}>Open preview</button>
          </div>
        </Card>
      </div>

      <Card title="Recent deploys" style={{ marginTop:14 }}>
        <div style={{ fontSize:12 }}>
          {[
            { h:'3d8fa1', t:'Add 4 new taxa · update endemism indicator', d:'yesterday', ok:true },
            { h:'a22ef0', t:'Reorder widget layout on taxon page', d:'3 days ago', ok:true },
            { h:'0011cd', t:'Initial publish', d:'last week', ok:true },
          ].map((e,i) => (
            <div key={i} style={{ display:'flex', gap:12, alignItems:'center', padding:'10px 0', borderTop: i>0 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--fg-muted)' }}>{e.h}</span>
              <span style={{ flex:1, color:'var(--fg)' }}>{e.t}</span>
              <span style={{ color:'var(--fg-muted)', fontSize:11 }}>{e.d}</span>
              <StatusChip kind="fresh">deployed</StatusChip>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

window.PublishScreen = PublishScreen;
