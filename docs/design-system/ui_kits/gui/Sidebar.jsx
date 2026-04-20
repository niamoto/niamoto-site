// Sidebar — dark collapsible nav
function Sidebar({ current, onNavigate, collapsed, onToggle, onCommand, onTheme }) {
  const items = [
    { id: 'dashboard', label: 'Dashboard', Icon: IHome },
    { id: 'data',      label: 'Data',      Icon: IDatabase },
    { id: 'collections', label: 'Collections', Icon: ILayers },
    { id: 'site',      label: 'Site',      Icon: IGlobe },
    { id: 'publish',   label: 'Publish',   Icon: ISend },
    { id: 'plugins',   label: 'Plugins',   Icon: IFlag },
    { id: 'theme',     label: 'Theme',     Icon: ISettings },
  ];
  const w = collapsed ? 64 : 208;
  return (
    <aside style={{
      width: w, flexShrink: 0, background:'#15171B', color:'#D9DDE1',
      display:'flex', flexDirection:'column',
      borderRight:'1px solid rgba(255,255,255,0.06)',
      transition:'width var(--motion-base) var(--ease-out-expo)'
    }}>
      <div style={{
        display:'flex', alignItems:'center', gap:10, padding: collapsed ? '14px 20px' : '14px 14px',
        borderBottom:'1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          width:24, height:24, borderRadius:5, background:'#2E7D32',
          display:'flex', alignItems:'center', justifyContent:'center',
          color:'#fff', fontFamily:'var(--font-sans)', fontWeight:700, fontSize:13
        }}>N</div>
        {!collapsed && <div style={{ fontWeight:600, fontSize:14, letterSpacing:'-0.01em', color:'#fff' }}>Niamoto</div>}
      </div>

      <nav style={{ flex:1, padding:8, display:'flex', flexDirection:'column', gap:2 }}>
        {items.map(it => {
          const active = it.id === current;
          return (
            <button key={it.id} onClick={() => onNavigate(it.id)}
              style={{
                display:'flex', alignItems:'center', gap:10,
                padding: collapsed ? '10px 0' : '8px 10px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                background: active ? 'rgba(34,139,34,0.14)' : 'transparent',
                color: active ? '#6ECF71' : '#D9DDE1',
                border:0, borderRadius:6, cursor:'pointer',
                fontFamily:'var(--font-sans)', fontSize:13, fontWeight: active ? 600 : 500,
                textAlign:'left',
                transition:'background var(--motion-fast)',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background='rgba(255,255,255,0.06)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background='transparent'; }}
            >
              <it.Icon size={collapsed ? 18 : 16}/>
              {!collapsed && <span>{it.label}</span>}
            </button>
          );
        })}
      </nav>

      <div style={{ padding:8, borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={onCommand} style={{
          width:'100%', display:'flex', alignItems:'center', gap:8,
          padding: collapsed ? '10px 0' : '8px 10px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          background:'transparent', border:0, color:'#9AA0A6',
          fontFamily:'var(--font-sans)', fontSize:12, cursor:'pointer', borderRadius:6,
        }}
          onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.06)'}
          onMouseLeave={e => e.currentTarget.style.background='transparent'}
        >
          <ICommand size={14}/>
          {!collapsed && <><span>Command</span><span style={{ marginLeft:'auto', fontSize:11, color:'#6B7280' }}>⌘K</span></>}
        </button>
        <button onClick={onToggle} style={{
          width:'100%', display:'flex', alignItems:'center', gap:8,
          padding: collapsed ? '10px 0' : '8px 10px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          background:'transparent', border:0, color:'#9AA0A6',
          fontFamily:'var(--font-sans)', fontSize:12, cursor:'pointer', borderRadius:6,
        }}>
          <IChevRight size={14} style={{ transform: collapsed ? 'none' : 'rotate(180deg)' }}/>
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

window.Sidebar = Sidebar;
