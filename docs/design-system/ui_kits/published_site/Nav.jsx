// Font Awesome glyph as inline span -- we rely on FA via CDN
function FaIcon({ name, style }) {
  return <i className={`fas fa-${name}`} style={style}/>;
}

function Nav({ current, onNavigate }) {
  const items = [
    { id:'home',     label:'Home' },
    { id:'taxa',     label:'Taxa' },
    { id:'plots',    label:'Plots' },
    { id:'shapes',   label:'Shapes' },
    { id:'about',    label:'About' },
  ];
  return (
    <nav className="nia-nav">
      <div className="nia-nav-inner">
        <div className="nia-nav-title">
          <img src="../../assets/niamoto_logo.png" alt=""/>
          Niamoto
        </div>
        <ul>
          {items.map(it => (
            <li key={it.id}>
              <a href="#" onClick={e => { e.preventDefault(); onNavigate(it.id); }}
                 className={current === it.id ? 'active' : ''}>{it.label}</a>
            </li>
          ))}
          <li>
            <a href="#" style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
              <FaIcon name="globe"/> EN
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div style={{ color:'#fff', fontWeight:600, marginBottom:6, fontFamily:'var(--font-site-title)', textTransform:'uppercase', letterSpacing:'.1em', fontSize:13 }}>Niamoto</div>
          <div>Ecological data platform · v0.7.0</div>
          <div style={{ marginTop:6 }}>Generated 16 April 2026 · 18 pages</div>
        </div>
        <div>
          <div style={{ color:'#fff', fontWeight:600, marginBottom:6 }}>Data</div>
          <div><a href="#">Taxonomy (CSV)</a></div>
          <div><a href="#">Occurrences (CSV)</a></div>
          <div><a href="#">Plots (Shapefile)</a></div>
        </div>
        <div>
          <div style={{ color:'#fff', fontWeight:600, marginBottom:6 }}>About</div>
          <div><a href="#">Methodology</a></div>
          <div><a href="#">Sources</a></div>
          <div><a href="#">Licence — CC-BY-4.0</a></div>
        </div>
        <div style={{ marginLeft:'auto', display:'flex', flexDirection:'column', gap:8, alignItems:'flex-end' }}>
          <img src="../../assets/wfo-logo.svg" alt="WFO" style={{ height:32, filter:'brightness(0) invert(1)', opacity:.85 }}/>
          <div>Taxonomy referenced · World Flora Online</div>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Nav, Footer, FaIcon });
