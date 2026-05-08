import React, { useState, useEffect } from 'react';
import { BiCube, BiPalette, BiText, BiImage, BiCart } from 'react-icons/bi';
import { HiOutlineSparkles, HiOutlinePhotograph } from 'react-icons/hi';
import { VscSymbolColor } from 'react-icons/vsc';

const colors = [
  { name: 'BLACK',        hex: '#111111' },
  { name: 'GRAPHITE',     hex: '#555555' },
  { name: 'GRAY',         hex: '#999999' },
  { name: 'SILVER',       hex: '#c0c0c0' },
  { name: 'WHITE',        hex: '#ffffff' },
  { name: 'NAVY',         hex: '#002080' },
  { name: 'ROYAL BLUE',   hex: '#1a56db' },
  { name: 'SKY BLUE',     hex: '#0070c0' },
  { name: 'CYAN',         hex: '#00b0f0' },
  { name: 'TEAL',         hex: '#009688' },
  { name: 'FOREST',       hex: '#228b22' },
  { name: 'EMERALD',      hex: '#4caf50' },
  { name: 'OPTIC YELLOW', hex: '#ccff00' },
  { name: 'GOLD',         hex: '#ffd700' },
  { name: 'ORANGE',       hex: '#ff9800' },
  { name: 'RED',          hex: '#e00000' },
  { name: 'CRIMSON',      hex: '#990000' },
  { name: 'MAGENTA',      hex: '#cc00cc' },
  { name: 'PURPLE',       hex: '#6236ff' },
  { name: 'HOT PINK',     hex: '#ff4081' },
  { name: 'LIGHT PINK',   hex: '#ffb6c1' },
  { name: 'BROWN',        hex: '#8b4513' },
  { name: 'TAUPE',        hex: '#b38b6d' },
  { name: 'CREAM',        hex: '#fffdd0' },
];

const getColorName = (hex) =>
  colors.find(c => c.hex.toLowerCase() === hex?.toLowerCase())?.name || hex || '—';

const ColorGrid = ({ selected, onSelect }) => (
  <div className="grid grid-cols-8 gap-1.5 mt-2">
    {colors.map((c, i) => {
      const isActive = selected?.toLowerCase() === c.hex.toLowerCase();
      return (
        <div
          key={i}
          title={c.name}
          onClick={() => onSelect(c.hex)}
          className="swatch aspect-square rounded cursor-pointer border-2 transition-all"
          style={{
            backgroundColor: c.hex,
            borderColor: isActive ? '#00b0f0' : '#e5e7eb',
            boxShadow: isActive ? '0 0 0 2px #fff, 0 0 0 4px #00b0f0' : 'none',
          }}
        />
      );
    })}
  </div>
);

const SecHeader = ({ accent, label, icon, isOpen, onToggle }) => (
  <button
    onClick={onToggle}
    className="w-full flex items-center justify-between px-4 py-3 border-b border-black/5 cursor-pointer outline-none transition-all hover:bg-black/5"
  >
    <div className="flex items-center gap-2">
      <span style={{ color: accent }} className="text-lg">{icon}</span>
      <span className="text-gray-700 text-[10px] font-black tracking-widest uppercase">{label}</span>
    </div>
    <span className={`text-gray-400 text-xs transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}>▶</span>
  </button>
);

const MeshProperties = ({ state, updateProp, accent }) => {
  const [openSections, setOpenSections] = useState(['fill']);
  const toggleSection = (id) => {
    setOpenSections(prev => {
      if (prev.includes(id)) return prev.filter(s => s !== id);
      const next = [...prev, id];
      return next.length > 2 ? next.slice(1) : next;
    });
  };

  if (!state) return <div className="p-10 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">Select a part to edit</div>;

  return (
    <div className="flex flex-col">
      <SecHeader accent={accent} label="Fill Color" icon={<VscSymbolColor />} isOpen={openSections.includes('fill')} onToggle={() => toggleSection('fill')} />
      <div className={`acc-body ${openSections.includes('fill') ? 'open' : ''}`}>
        <div className="p-4 bg-white border-b border-gray-100">
          <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl mb-3">
            <div className="w-10 h-10 rounded-lg border-2 border-white shadow-md flex-shrink-0" style={{ backgroundColor: state.color }} />
            <div>
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Active Material</div>
              <div className="text-[13px] font-bold text-gray-800">{getColorName(state.color)}</div>
            </div>
          </div>
          <ColorGrid selected={state.color} onSelect={(hex) => { updateProp('color', hex); updateProp('isGrad', false); }} />
        </div>
      </div>

      <SecHeader accent={accent} label="Gradient" icon={<HiOutlineSparkles />} isOpen={openSections.includes('grad')} onToggle={() => toggleSection('grad')} />
      <div className={`acc-body ${openSections.includes('grad') ? 'open' : ''}`}>
        <div className="p-4 bg-white border-b border-gray-100">
          <div className="flex gap-2 mb-4">
            <button onClick={() => updateProp('isGrad', false)} className={`flex-1 py-2 rounded-lg text-[9px] font-black border-2 transition-all ${!state.isGrad ? 'border-[#00b0f0] bg-blue-50 text-[#00b0f0]' : 'border-gray-200 text-gray-400'}`}>SOLID</button>
            <button onClick={() => updateProp('isGrad', true)} className={`flex-1 py-2 rounded-lg text-[9px] font-black border-2 transition-all ${state.isGrad ? 'border-[#00b0f0] bg-blue-50 text-[#00b0f0]' : 'border-gray-200 text-gray-400'}`}>GRADIENT</button>
          </div>
          {state.isGrad && (
            <div className="fade-up">
              <div className="h-8 rounded-lg mb-4 border border-gray-200 shadow-inner" style={{ background: `linear-gradient(to right, ${state.grad1}, ${state.grad2})` }} />
              <ColorGrid selected={state.grad1} onSelect={(val) => updateProp('grad1', val)} />
              <div className="h-4" />
              <ColorGrid selected={state.grad2} onSelect={(val) => updateProp('grad2', val)} />
            </div>
          )}
        </div>
      </div>

      <SecHeader accent={accent} label="Pattern Overlay" icon={<HiOutlinePhotograph />} isOpen={openSections.includes('pat')} onToggle={() => toggleSection('pat')} />
      <div className={`acc-body ${openSections.includes('pat') ? 'open' : ''}`}>
        <div className="p-4 bg-white border-b border-gray-100">
          <div className="flex gap-3 mb-4">
            <div onClick={() => updateProp('pUrl', null)} className={`w-14 h-14 rounded-xl border-2 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${!state.pUrl ? 'border-[#00b0f0] bg-blue-50' : 'border-gray-200 text-gray-300'}`}>
              <span className="text-xl">✕</span>
              <span className="text-[7px] font-bold">NONE</span>
            </div>
            <label className="w-14 h-14 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#00b0f0] hover:bg-blue-50 transition-all text-gray-300">
              <span className="text-xl">+</span>
              <span className="text-[7px] font-bold">UPLOAD</span>
              <input type="file" className="hidden" onChange={e => e.target.files?.[0] && updateProp('pUrl', URL.createObjectURL(e.target.files[0]))} />
            </label>
            {state.pUrl && <div className="w-14 h-14 rounded-xl border-2 border-[#00b0f0] bg-cover bg-center shadow-lg" style={{ backgroundImage: `url(${state.pUrl})` }} />}
          </div>
          {state.pUrl && <ColorGrid selected={state.pColor} onSelect={(val) => updateProp('pColor', val)} />}
        </div>
      </div>
    </div>
  );
};

const RightPanel = ({ activeMesh, meshStates, updateMeshProp }) => {
  const [activeTab, setActiveTab] = useState('colors');

  const mainTabs = [
    { id: 'colors', label: 'Colors / Patterns', icon: <BiPalette /> },
    { id: 'names',  label: 'Names / Numbers',   icon: <BiText /> },
    { id: 'logos',  label: 'Logos / Flags',     icon: <BiImage /> },
    { id: 'roster', label: 'Checkout / Roster', icon: <BiCart /> },
  ];

  return (
    <div className="flex h-full w-[420px] flex-shrink-0 border-l border-gray-200 bg-white flex-col z-10">
      
      {/* ── Top Main Tabs ── */}
      <div className="flex border-b border-gray-200 bg-gray-50 flex-shrink-0">
        {mainTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 px-1 flex flex-col items-center gap-1.5 transition-all relative cursor-pointer
              ${activeTab === tab.id ? 'text-[#00b0f0] bg-white' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="text-[7px] font-black uppercase tracking-widest text-center leading-tight">
              {tab.label.split(' / ').map((s,i) => <span key={i} className="block">{s}</span>)}
            </span>
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00b0f0]" />}
          </button>
        ))}
      </div>

      {/* ── Sub Header (Active Mesh Info) ── */}
      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#00b0f0]">
            <BiCube size={20} />
          </div>
          <div>
            <div className="text-[10px] font-black text-gray-800 uppercase tracking-widest">
              {activeMesh ? activeMesh.replace(/_/g, ' ') : 'Select Part'}
            </div>
            <div className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Active Workspace</div>
          </div>
        </div>
        <div className="px-2 py-1 rounded bg-green-50 text-green-600 text-[8px] font-black tracking-widest uppercase">Live Edit</div>
      </div>

      {/* ── Content Area ── */}
      <div className="flex-1 overflow-y-auto right-scroll bg-gray-50">
        {activeTab === 'colors' ? (
          <MeshProperties 
            state={meshStates[activeMesh]} 
            updateProp={(prop, val) => updateMeshProp(activeMesh, prop, val)}
            accent="#00b0f0" 
          />
        ) : (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-300 mb-4">
              {mainTabs.find(t => t.id === activeTab)?.icon}
            </div>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
              {mainTabs.find(t => t.id === activeTab)?.label}
            </h3>
            <p className="text-[10px] text-gray-400 leading-relaxed max-w-[200px]">
              This feature is being integrated into the dynamic mesh system. Stay tuned!
            </p>
          </div>
        )}
      </div>

      {/* ── Bottom Status ── */}
      <div className="px-4 py-2 bg-white border-t border-gray-200 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Connected to 3D Viewport</span>
        </div>
        <button className="px-3 py-1 bg-[#00b0f0] text-white text-[9px] font-black uppercase tracking-widest rounded shadow-sm hover:bg-[#0090d0] transition-colors">
          Next Step
        </button>
      </div>
    </div>
  );
};

export default RightPanel;
