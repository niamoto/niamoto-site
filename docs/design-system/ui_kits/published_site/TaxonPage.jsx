function TaxonPage({ taxonId, onNavigate }) {
  const dbhData = [
    { l:'10', v:48 }, { l:'20', v:92 }, { l:'30', v:140 },
    { l:'40', v:180 }, { l:'50', v:168 }, { l:'60', v:120 },
    { l:'70', v:78 }, { l:'80', v:44 }, { l:'90', v:22 }, { l:'100+', v:10 },
  ];
  const phenData = [
    { l:'J', v:12 }, { l:'F', v:18 }, { l:'M', v:40 }, { l:'A', v:72 },
    { l:'M', v:88 }, { l:'J', v:92 }, { l:'J', v:80 }, { l:'A', v:52 },
    { l:'S', v:28 }, { l:'O', v:18 }, { l:'N', v:10 }, { l:'D', v:6 },
  ];
  return (
    <>
      <div className="nia-breadcrumb">
        <a onClick={() => onNavigate('home')}>Home</a>
        <span className="sep">›</span>
        <a onClick={() => onNavigate('home')}>Taxa</a>
        <span className="sep">›</span>
        <span>Araucariaceae</span>
        <span className="sep">›</span>
        <span style={{ color:'var(--fg)' }}>Araucaria montana</span>
      </div>

      <section className="nia-hero" style={{ paddingTop:12 }}>
        <div className="eyebrow" style={{ fontSize:11, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--nia-fern)', fontWeight:600, marginBottom:6 }}>Species</div>
        <h1 className="taxon-title">
          <span className="sci">Araucaria montana</span> <span style={{ fontSize:16, color:'var(--fg-muted)', fontWeight:500, marginLeft:8 }}>Brongn. &amp; Gris</span>
        </h1>
        <div className="taxon-meta">
          <span><FaIcon name="folder-tree" style={{ marginRight:6 }}/>Araucariaceae</span>
          <span><FaIcon name="hashtag" style={{ marginRight:6 }}/>taxon_id 1124</span>
          <span><FaIcon name="map-pin" style={{ marginRight:6 }}/>1,204 occurrences</span>
          <span><FaIcon name="calendar" style={{ marginRight:6 }}/>last record: 2024-11-12</span>
        </div>
        <div style={{ display:'flex', gap:8, marginTop:14, flexWrap:'wrap' }}>
          <span className="badge endemic">Endemic · New Caledonia</span>
          <span className="badge redlist">IUCN · VU</span>
          <span className="badge">Gymnosperm</span>
          <span className="badge">Canopy tree · 20–35 m</span>
        </div>
      </section>

      <div className="nia-container">
        <div className="nia-grid">
          <div className="col-8">
            <Widget icon="map" title="Distribution map">
              <MiniMap height={360} markers={[
                { x:25, y:45 }, { x:32, y:40 }, { x:38, y:38 }, { x:44, y:42 },
                { x:50, y:35 }, { x:58, y:32 }, { x:48, y:50 }, { x:55, y:58 },
                { x:63, y:40 }, { x:70, y:48 },
              ]}/>
              <div style={{ display:'flex', gap:20, marginTop:10, fontSize:12, color:'var(--fg-muted)' }}>
                <span>1,204 occurrences · 2005–2024</span>
                <span>Altitude range: 600–1380 m</span>
                <span style={{ marginLeft:'auto' }}><a href="#" className="link">Download GeoJSON ↗</a></span>
              </div>
            </Widget>
          </div>

          <div className="col-4">
            <Widget icon="book" title="Classification">
              <dl className="kv">
                <dt>Kingdom</dt><dd>Plantae</dd>
                <dt>Phylum</dt><dd>Tracheophyta</dd>
                <dt>Class</dt><dd>Pinopsida</dd>
                <dt>Order</dt><dd>Araucariales</dd>
                <dt>Family</dt><dd>Araucariaceae</dd>
                <dt>Genus</dt><dd><i>Araucaria</i></dd>
                <dt>Species</dt><dd><i>A. montana</i></dd>
              </dl>
              <div style={{ fontSize:11, color:'var(--fg-muted)', marginTop:12 }}>
                Referenced in <a className="link" href="#">WFO-0000615013</a>
              </div>
            </Widget>
          </div>

          <div className="col-6">
            <Widget icon="chart-column" title="DBH distribution">
              <BarChart data={dbhData} height={180}/>
              <div style={{ fontSize:11, color:'var(--fg-muted)', marginTop:4 }}>Diameter at breast height, cm · n=902 stems measured</div>
            </Widget>
          </div>

          <div className="col-6">
            <Widget icon="seedling" title="Phenology">
              <BarChart data={phenData} height={180} color="#4BAF50" color2="#2E7D32"/>
              <div style={{ fontSize:11, color:'var(--fg-muted)', marginTop:4 }}>Flowering + fruiting records by month</div>
            </Widget>
          </div>

          <div className="col-6">
            <Widget icon="leaf" title="Co-occurring species">
              <div style={{ display:'flex', flexDirection:'column', gap:8, fontSize:13 }}>
                {[
                  ['Nothofagus balansae', 128, 0.72],
                  ['Agathis moorei',      88,  0.58],
                  ['Calophyllum caledonicum', 64, 0.44],
                  ['Metrosideros operculata', 49, 0.34],
                  ['Dacrydium guillauminii', 31, 0.22],
                ].map(([sp,n,r], i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{ fontStyle:'italic', flex:'0 0 180px', color:'var(--fg)' }}>{sp}</span>
                    <div style={{ flex:1, height:6, background:'var(--bg-muted)', borderRadius:3, overflow:'hidden' }}>
                      <div style={{ width:`${r*100}%`, height:'100%', background:'var(--nia-fern)' }}/>
                    </div>
                    <span style={{ width:36, textAlign:'right', fontFamily:'var(--font-mono)', fontSize:12, color:'var(--fg-muted)' }}>{n}</span>
                  </div>
                ))}
              </div>
            </Widget>
          </div>

          <div className="col-6">
            <Widget icon="circle-info" title="Ecology & notes">
              <p style={{ margin:'0 0 10px', fontSize:13, lineHeight:1.6 }}>
                <i>Araucaria montana</i> is a canopy-emergent gymnosperm restricted to the humid forests of Grande Terre, typically above 600 m on ultramafic substrates. Female cones mature over 18 months; regeneration is slow and fire-sensitive.
              </p>
              <dl className="kv">
                <dt>Habitat</dt><dd>Humid montane forest, ultramafic</dd>
                <dt>Altitude</dt><dd>600–1380 m</dd>
                <dt>Substrate</dt><dd>Peridotite, serpentine</dd>
                <dt>Threats</dt><dd>Fire, mining, invasive deer</dd>
              </dl>
            </Widget>
          </div>
        </div>
      </div>
    </>
  );
}

window.TaxonPage = TaxonPage;
