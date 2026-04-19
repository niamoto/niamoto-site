function Widget({ icon, title, children, info=true }) {
  return (
    <div className="widget">
      <div className="widget-header">
        {icon && <FaIcon name={icon}/>}
        <span>{title}</span>
        {info && <span className="widget-info"><FaIcon name="info" style={{ fontSize:8 }}/></span>}
      </div>
      <div className="widget-body">{children}</div>
    </div>
  );
}

/* Tiny inline sparkline / bar chart utilities — pure SVG, no Plotly */
function BarChart({ data, height=150, color='#C28E5F', color2='#A0693F' }) {
  const max = Math.max(...data.map(d => d.v));
  const w = 100 / data.length;
  return (
    <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
      {data.map((d, i) => {
        const h = (d.v / max) * (height - 28);
        const isLarge = d.v > max * 0.6;
        return (
          <g key={i}>
            <rect x={i*w+w*0.1} y={height-18-h} width={w*0.8} height={h}
                  fill={isLarge ? color2 : color} rx="1"/>
            <text x={i*w+w/2} y={height-5} textAnchor="middle" fontSize="4"
                  fill="oklch(0.5 0.01 250)" fontFamily="var(--font-sans)">{d.l}</text>
          </g>
        );
      })}
    </svg>
  );
}

function DonutChart({ segments, total, label }) {
  const r = 60, C = 2 * Math.PI * r;
  const totalNum = segments.reduce((a,s) => a + s.v, 0);
  let acc = 0;
  return (
    <div style={{ display:'flex', alignItems:'center', gap:20 }}>
      <svg viewBox="0 0 150 150" width="150" height="150">
        <circle cx="75" cy="75" r={r} fill="none" stroke="var(--bg-muted)" strokeWidth="18"/>
        {segments.map((s, i) => {
          const len = (s.v / totalNum) * C;
          const off = -acc;
          acc += len;
          return (
            <circle key={i} cx="75" cy="75" r={r} fill="none"
                    stroke={s.c} strokeWidth="18"
                    strokeDasharray={`${len} ${C-len}`}
                    strokeDashoffset={off}
                    transform="rotate(-90 75 75)"/>
          );
        })}
        <text x="75" y="72" textAnchor="middle" fontSize="22" fontWeight="700" fill="var(--fg)">{total}</text>
        <text x="75" y="90" textAnchor="middle" fontSize="10" fill="var(--fg-muted)">{label}</text>
      </svg>
      <div style={{ display:'flex', flexDirection:'column', gap:6, fontSize:12 }}>
        {segments.map((s, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ width:10, height:10, borderRadius:2, background:s.c }}/>
            <span style={{ color:'var(--fg)' }}>{s.l}</span>
            <span style={{ color:'var(--fg-muted)', marginLeft:'auto' }}>{s.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Pseudo-Leaflet map — just a tile grid + markers */
function MiniMap({ markers=[], height=300 }) {
  return (
    <div style={{
      position:'relative', height, borderRadius:7, overflow:'hidden',
      background: `
        linear-gradient(135deg, #cfe0d1 0%, #b8d1bb 50%, #a7c3ae 100%)`,
      border:'1px solid var(--border)'
    }}>
      {/* faux coastline */}
      <svg viewBox="0 0 400 300" width="100%" height="100%" preserveAspectRatio="none" style={{ position:'absolute', inset:0 }}>
        <path d="M40 220 Q80 180 130 190 T240 170 Q300 165 340 200 T380 260 L380 300 L0 300 L0 240 Z"
              fill="#c0b193" opacity=".45"/>
        <path d="M30 140 Q70 120 110 125 T200 110 Q260 105 300 120 T370 150 L370 300 L0 300 L0 160 Z"
              fill="#a69579" opacity=".35"/>
      </svg>
      {markers.map((m, i) => (
        <div key={i} style={{
          position:'absolute', left:`${m.x}%`, top:`${m.y}%`,
          width:10, height:10, borderRadius:999,
          background:'var(--nia-fern)', border:'2px solid #fff',
          transform:'translate(-50%,-50%)',
          boxShadow:'0 1px 3px rgba(0,0,0,.3)'
        }}/>
      ))}
      <div style={{
        position:'absolute', bottom:8, right:8,
        background:'rgba(255,255,255,0.9)', padding:'4px 8px',
        borderRadius:4, fontSize:10, color:'var(--fg-muted)',
        fontFamily:'var(--font-mono)'
      }}>© OpenStreetMap · leaflet</div>
    </div>
  );
}

Object.assign(window, { Widget, BarChart, DonutChart, MiniMap });
