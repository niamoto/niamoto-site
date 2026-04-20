// WidgetConfigDialog — editor for a widget on a collection page.
// Left rail = fields, main = preview, right = validation/CLI equivalent.
function WidgetConfigDialog({ open, onClose }) {
  const [type, setType] = React.useState('bar_chart');
  const [title, setTitle] = React.useState('DBH distribution');
  const [source, setSource] = React.useState('occurrences.dbh');
  const [bins, setBins] = React.useState(12);
  const [color, setColor] = React.useState('dbh');

  if (!open) return null;
  const types = [
    { id:'bar_chart',      label:'Bar chart',      Icon: IDatabase },
    { id:'map',            label:'Map',            Icon: IGlobe },
    { id:'stat_grid',      label:'Stat grid',      Icon: ILayers },
    { id:'radial',         label:'Radial profile', Icon: ICircle },
    { id:'timeline',       label:'Timeline',       Icon: IClock },
    { id:'image_gallery',  label:'Image gallery',  Icon: IFolder },
  ];

  return (
    <div onMouseDown={onClose} style={{
      position:'fixed', inset:0, background:'rgba(20,22,26,0.5)', backdropFilter:'blur(3px)',
      display:'flex', alignItems:'center', justifyContent:'center', zIndex:9998, fontFamily:'var(--font-sans)'
    }}>
      <div onMouseDown={e => e.stopPropagation()} style={{
        width:1040, maxWidth:'94vw', maxHeight:'88vh',
        background:'var(--surface)', borderRadius:'var(--radius-2xl, 12px)',
        boxShadow:'var(--shadow-xl)', border:'1px solid var(--border)',
        display:'flex', flexDirection:'column', overflow:'hidden'
      }}>
        {/* header */}
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'14px 18px', borderBottom:'1px solid var(--border)' }}>
          <div>
            <div className="eyebrow" style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--fg-muted)' }}>Collections · Taxon</div>
            <div style={{ fontSize:15, fontWeight:600, color:'var(--fg)', letterSpacing:'-0.01em' }}>Configure widget</div>
          </div>
          <div style={{ flex:1 }}/>
          <StatusChip kind="stale">unsaved</StatusChip>
          <button style={btnGhost} onClick={onClose}><IX size={14}/></button>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'220px 1fr 320px', flex:1, minHeight:0 }}>
          {/* type picker rail */}
          <div style={{ borderRight:'1px solid var(--border)', padding:12, overflow:'auto', background:'var(--bg-muted)' }}>
            <div className="eyebrow" style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--fg-muted)', padding:'4px 6px 8px' }}>Widget type</div>
            <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
              {types.map(t => {
                const active = t.id === type;
                return (
                  <button key={t.id} onClick={() => setType(t.id)} style={{
                    display:'flex', alignItems:'center', gap:8, padding:'8px 10px',
                    border:0, background: active ? 'var(--surface)' : 'transparent',
                    boxShadow: active ? 'var(--shadow-sm)' : 'none',
                    borderRadius:6, cursor:'pointer', textAlign:'left',
                    fontFamily:'var(--font-sans)', fontSize:13, color: active ? 'var(--fg)' : 'var(--fg-muted)',
                    fontWeight: active ? 600 : 500
                  }}>
                    <t.Icon size={14}/>
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
            <div style={{ marginTop:18 }} className="eyebrow">Layout</div>
            <div style={{ padding:'4px 6px', fontSize:12, color:'var(--fg-muted)' }}>Row 2, col 1 · span 2×1</div>
          </div>

          {/* center: form + preview */}
          <div style={{ padding:18, overflow:'auto' }}>
            <Field label="Title">
              <input value={title} onChange={e => setTitle(e.target.value)} style={inp}/>
            </Field>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <Field label="Data source" hint="Dot-path into the collection record">
                <input value={source} onChange={e => setSource(e.target.value)} style={{...inp, fontFamily:'var(--font-mono)', fontSize:12}}/>
              </Field>
              <Field label="Group by">
                <select style={inp} defaultValue="size_class">
                  <option value="size_class">size_class</option>
                  <option value="family">family</option>
                  <option value="status">status</option>
                </select>
              </Field>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
              <Field label="Bins">
                <input type="number" value={bins} onChange={e => setBins(+e.target.value)} style={inp}/>
              </Field>
              <Field label="Palette">
                <select value={color} onChange={e => setColor(e.target.value)} style={inp}>
                  <option value="dbh">DBH (sienna)</option>
                  <option value="forest">Forest</option>
                  <option value="qual">Qualitative</option>
                </select>
              </Field>
              <Field label="Unit">
                <input defaultValue="cm" style={inp}/>
              </Field>
            </div>

            <Field label="Preview" hint={`${type} · driven by ${source}`}>
              <WidgetPreview type={type} bins={bins} color={color} title={title}/>
            </Field>
          </div>

          {/* right: validation + cli + yaml */}
          <div style={{ borderLeft:'1px solid var(--border)', padding:14, overflow:'auto', background:'var(--bg-muted)', display:'flex', flexDirection:'column', gap:14 }}>
            <div>
              <div className="eyebrow" style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--fg-muted)', marginBottom:6 }}>Validation</div>
              <ValRow ok label={`Field ${source} exists`}/>
              <ValRow ok label="489,217 non-null values"/>
              <ValRow warn label="3.2% outside expected range (0–200cm)"/>
            </div>
            <div>
              <div className="eyebrow" style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--fg-muted)', marginBottom:6 }}>YAML</div>
              <pre style={{
                margin:0, padding:12, background:'var(--surface)', border:'1px solid var(--border)',
                borderRadius:6, fontSize:11, lineHeight:1.55, color:'var(--fg)',
                whiteSpace:'pre-wrap', fontFamily:'var(--font-mono)'
              }}>{`- type: ${type}
  title: "${title}"
  source: ${source}
  bins: ${bins}
  palette: ${color}`}</pre>
            </div>
            <div>
              <div className="eyebrow" style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--fg-muted)', marginBottom:6 }}>CLI equivalent</div>
              <div style={{
                padding:'8px 12px', background:'#15171B', color:'#a1efa1',
                borderRadius:6, fontFamily:'var(--font-mono)', fontSize:11
              }}>$ niamoto widget add --page taxon --type {type}</div>
            </div>
          </div>
        </div>

        {/* footer */}
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 18px', borderTop:'1px solid var(--border)' }}>
          <span style={{ fontSize:12, color:'var(--fg-muted)' }}>Changes rebuild the Taxon page only.</span>
          <div style={{ flex:1 }}/>
          <button style={btnOutline} onClick={onClose}>Cancel</button>
          <button style={btnPrimary}><ICheck size={13}/> Save widget</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:4 }}>
        <label style={{ fontSize:12, fontWeight:600, color:'var(--fg)' }}>{label}</label>
        {hint && <span style={{ fontSize:11, color:'var(--fg-muted)' }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

const inp = {
  width:'100%', boxSizing:'border-box',
  padding:'7px 10px', border:'1px solid var(--border-strong)',
  borderRadius:6, background:'var(--surface)',
  fontFamily:'var(--font-sans)', fontSize:13, color:'var(--fg)', outline:'none'
};

function ValRow({ ok, warn, label }) {
  const color = ok ? '#22c55e' : warn ? '#f59e0b' : '#ef4444';
  const Ic = ok ? ICheck : IAlert;
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, padding:'4px 0', fontSize:12, color:'var(--fg)' }}>
      <span style={{ color }}><Ic size={13}/></span>
      <span>{label}</span>
    </div>
  );
}

// Mini preview — draws simple shapes for each widget type.
function WidgetPreview({ type, bins, color, title }) {
  const palette = color === 'forest' ? ['#2E7D32','#4BAF50','#7CB342']
               : color === 'qual'   ? ['#2E7D32','#5B86B0','#F2B94B','#9333EA']
               : ['#C28E5F','#A0693F'];
  return (
    <div style={{
      height:240, background:'var(--surface)', border:'1px solid var(--border)',
      borderRadius:7, padding:16, display:'flex', flexDirection:'column', gap:8
    }}>
      <div style={{ fontSize:12, fontWeight:600, color:'var(--fg)' }}>{title}</div>
      {type === 'bar_chart' && <Bars bins={bins} colors={palette}/>}
      {type === 'map' && <MapBlob/>}
      {type === 'stat_grid' && <StatGrid/>}
      {type === 'radial' && <Radial/>}
      {type === 'timeline' && <Timeline/>}
      {type === 'image_gallery' && <Gallery/>}
    </div>
  );
}

function Bars({ bins, colors }) {
  // gently bell-shaped fake distribution
  const heights = Array.from({length:bins}, (_,i) => {
    const x = (i - bins/2) / (bins/3);
    return Math.exp(-x*x) * 0.9 + Math.random() * 0.08;
  });
  return (
    <div style={{ flex:1, display:'flex', alignItems:'flex-end', gap:4, padding:'8px 0' }}>
      {heights.map((h, i) => (
        <div key={i} style={{
          flex:1, height: `${Math.max(4, h*100)}%`,
          background: `linear-gradient(180deg, ${colors[0]}, ${colors[1] || colors[0]})`,
          borderRadius:'3px 3px 0 0'
        }}/>
      ))}
    </div>
  );
}
function MapBlob() {
  return (
    <svg viewBox="0 0 400 180" style={{ flex:1, width:'100%' }}>
      <rect width="400" height="180" fill="oklch(0.95 0.02 240)"/>
      <path d="M60 120 Q 120 60, 200 90 T 340 110 L 340 150 L 60 150 Z" fill="#a7d8a7" stroke="#2E7D32" strokeWidth="1"/>
      {Array.from({length:18}).map((_,i) => (
        <circle key={i} cx={80 + Math.random()*240} cy={100 + Math.random()*40} r={2 + Math.random()*3} fill="#2E7D32" opacity="0.7"/>
      ))}
    </svg>
  );
}
function StatGrid() {
  const stats = [['489k','occurrences'],['12','plots'],['34','species'],['88%','validated']];
  return (
    <div style={{ flex:1, display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
      {stats.map(([v,l]) => (
        <div key={l} style={{ padding:12, background:'var(--bg-muted)', borderRadius:6 }}>
          <div style={{ fontSize:22, fontWeight:700, letterSpacing:'-0.02em', color:'var(--fg)' }}>{v}</div>
          <div style={{ fontSize:11, color:'var(--fg-muted)' }}>{l}</div>
        </div>
      ))}
    </div>
  );
}
function Radial() {
  return (
    <svg viewBox="0 0 200 180" style={{ flex:1, width:'100%' }}>
      {[70,55,40,25].map((r,i) => <circle key={i} cx="100" cy="90" r={r} fill="none" stroke="var(--border)" strokeDasharray="2 3"/>)}
      <polygon points="100,25 165,75 145,155 55,155 35,75" fill="#2E7D3260" stroke="#2E7D32" strokeWidth="1.5"/>
    </svg>
  );
}
function Timeline() {
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', gap:6, paddingTop:8 }}>
      {[['1998','Initial survey'],['2007','Full census'],['2015','Resurvey'],['2023','This dataset']].map(([y,t]) => (
        <div key={y} style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:44, fontFamily:'var(--font-mono)', fontSize:11, color:'var(--fg-muted)' }}>{y}</div>
          <div style={{ width:8, height:8, borderRadius:9999, background:'#2E7D32' }}/>
          <div style={{ flex:1, height:2, background:'var(--border)' }}/>
          <div style={{ fontSize:12, color:'var(--fg)' }}>{t}</div>
        </div>
      ))}
    </div>
  );
}
function Gallery() {
  const hues = [120, 90, 140, 70, 110, 95];
  return (
    <div style={{ flex:1, display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6 }}>
      {hues.map((h,i) => (
        <div key={i} style={{
          background:`linear-gradient(135deg, oklch(0.6 0.08 ${h}), oklch(0.4 0.09 ${h}))`,
          borderRadius:4
        }}/>
      ))}
    </div>
  );
}

Object.assign(window, { WidgetConfigDialog });
