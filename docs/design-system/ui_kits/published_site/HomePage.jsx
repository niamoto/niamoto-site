function HomePage({ onNavigate, onSelectTaxon }) {
  const featured = [
    { id:'araucaria-montana', sci:'Araucaria montana', fam:'Araucariaceae', occ:'1,204', iucn:'VU', endemic:true },
    { id:'agathis-moorei',    sci:'Agathis moorei',    fam:'Araucariaceae', occ:'487',   iucn:'EN', endemic:true },
    { id:'nothofagus-balansae',sci:'Nothofagus balansae', fam:'Nothofagaceae', occ:'320', iucn:'VU', endemic:true },
    { id:'calophyllum-caledonicum', sci:'Calophyllum caledonicum', fam:'Calophyllaceae', occ:'812', iucn:'LC', endemic:true },
  ];
  return (
    <>
      <section className="nia-hero">
        <div className="eyebrow" style={{ fontSize:11, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--nia-fern)', fontWeight:600, marginBottom:6 }}>Biodiversity portal · New Caledonia</div>
        <h1>Flora & forest inventory of Grande Terre</h1>
        <p className="subtitle">Structured from 489,217 occurrence records and 238 inventory plots. Browse species, explore distribution, or compare indicators across administrative boundaries.</p>

        <div style={{
          display:'flex', alignItems:'center', gap:10,
          background:'#fff', border:'1px solid var(--border)', borderRadius:8,
          padding:'10px 14px', marginTop:18, maxWidth:560,
          boxShadow:'var(--shadow-sm)'
        }}>
          <FaIcon name="search" style={{ color:'var(--fg-muted)' }}/>
          <input placeholder="Search a taxon, plot or locality…"
                 style={{ border:0, outline:0, flex:1, fontFamily:'var(--font-sans)', fontSize:14, background:'transparent' }}/>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--fg-faint)' }}>⌘K</span>
        </div>
      </section>

      <div className="nia-container">
        <div className="nia-grid" style={{ marginBottom:24 }}>
          <div className="col-3">
            <Widget icon="leaf" title="Taxa indexed">
              <div style={{ fontSize:30, fontWeight:700, letterSpacing:'-0.02em' }}>3,207</div>
              <div style={{ color:'var(--fg-muted)', fontSize:12 }}>species · 1,208 endemic</div>
            </Widget>
          </div>
          <div className="col-3">
            <Widget icon="map-location-dot" title="Occurrences">
              <div style={{ fontSize:30, fontWeight:700, letterSpacing:'-0.02em' }}>489,217</div>
              <div style={{ color:'var(--fg-muted)', fontSize:12 }}>georeferenced</div>
            </Widget>
          </div>
          <div className="col-3">
            <Widget icon="flag" title="Plots">
              <div style={{ fontSize:30, fontWeight:700, letterSpacing:'-0.02em' }}>238</div>
              <div style={{ color:'var(--fg-muted)', fontSize:12 }}>ha surveyed: 312.4</div>
            </Widget>
          </div>
          <div className="col-3">
            <Widget icon="shield-halved" title="Endemism">
              <div style={{ fontSize:30, fontWeight:700, letterSpacing:'-0.02em' }}>37.6%</div>
              <div style={{ color:'var(--fg-muted)', fontSize:12 }}>of flora · Shannon H′ 3.8</div>
            </Widget>
          </div>

          <div className="col-8">
            <Widget icon="map" title="Occurrence density">
              <MiniMap markers={[
                { x:20, y:60 }, { x:30, y:50 }, { x:38, y:48 }, { x:45, y:55 },
                { x:52, y:42 }, { x:58, y:38 }, { x:65, y:45 }, { x:72, y:52 },
                { x:78, y:48 }, { x:40, y:72 }, { x:48, y:68 }, { x:62, y:70 },
                { x:70, y:62 }, { x:80, y:60 }, { x:34, y:80 }, { x:55, y:78 },
              ]}/>
            </Widget>
          </div>
          <div className="col-4">
            <Widget icon="chart-pie" title="Conservation status">
              <DonutChart total="3,207" label="species"
                segments={[
                  { l:'Least Concern', v:1640, c:'#4BAF50' },
                  { l:'Vulnerable',    v:612,  c:'#F2B94B' },
                  { l:'Endangered',    v:418,  c:'#E08B3C' },
                  { l:'Critically En.',v:187,  c:'#C2336A' },
                  { l:'Data Deficient',v:350,  c:'#9AA0A6' },
                ]}/>
            </Widget>
          </div>
        </div>

        <h2 style={{ fontSize:22, margin:'8px 0 12px', letterSpacing:'-0.02em' }}>Featured taxa</h2>
        <div className="nia-grid">
          {featured.map(t => (
            <div key={t.id} className="col-3">
              <div onClick={() => onSelectTaxon(t.id)} style={{
                background:'#fff', border:'1px solid var(--border)', borderRadius:12,
                padding:16, cursor:'pointer', transition:'transform var(--motion-base) var(--ease-out-expo), box-shadow var(--motion-base) var(--ease-out-expo)'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='var(--shadow-widget-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; }}
              >
                <div style={{
                  height:100, borderRadius:7, marginBottom:12,
                  background:`linear-gradient(135deg, #e8f3e6 0%, #cfe3cc 100%)`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color:'var(--nia-fern)', fontSize:36
                }}>
                  <FaIcon name="tree"/>
                </div>
                <div style={{ fontSize:15, fontWeight:600, fontStyle:'italic', color:'var(--fg)' }}>{t.sci}</div>
                <div style={{ fontSize:11, color:'var(--fg-muted)', marginTop:2 }}>{t.fam}</div>
                <div style={{ display:'flex', gap:6, marginTop:10, flexWrap:'wrap' }}>
                  {t.endemic && <span className="badge endemic">Endemic</span>}
                  <span className={`badge ${t.iucn === 'EN' || t.iucn === 'CR' ? 'redlist' : ''}`}>{t.iucn}</span>
                  <span className="badge" style={{ background:'var(--bg-muted)', color:'var(--fg-muted)' }}>{t.occ} occ.</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

window.HomePage = HomePage;
