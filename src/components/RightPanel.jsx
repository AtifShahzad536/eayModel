import React, { useState, useEffect } from 'react';
import { 
  HiOutlineColorSwatch, HiOutlineTemplate, HiOutlineCloudUpload, HiOutlineTrash, 
  HiOutlineChevronDown, HiOutlineCube, HiOutlineLightningBolt, HiOutlineCursorClick, 
  HiOutlinePlus, HiOutlineMinus, HiOutlineSparkles, HiOutlinePhotograph
} from 'react-icons/hi';
import { VscSymbolColor, VscLayers, VscSettingsGear } from 'react-icons/vsc';
import { BiCube, BiPalette, BiText, BiImage, BiCart, BiWater, BiFlag, BiFootball, BiTrash, BiBug, BiStar, BiGhost, BiUserCircle } from 'react-icons/bi';
import { FaPaw, FaCat, FaCrow, FaHippo, FaHorse } from 'react-icons/fa';

const colors = [
  { name: 'BLACK', hex: '#111111' },
  { name: 'GRAPHITE', hex: '#555555' },
  { name: 'GRAY', hex: '#999999' },
  { name: 'SILVER', hex: '#c0c0c0' },
  { name: 'WHITE', hex: '#ffffff' },
  { name: 'NAVY', hex: '#002080' },
  { name: 'ROYAL BLUE', hex: '#1a56db' },
  { name: 'SKY BLUE', hex: '#0070c0' },
  { name: 'CYAN', hex: '#00b0f0' },
  { name: 'TEAL', hex: '#009688' },
  { name: 'FOREST', hex: '#228b22' },
  { name: 'EMERALD', hex: '#4caf50' },
  { name: 'OPTIC YELLOW', hex: '#ccff00' },
  { name: 'GOLD', hex: '#ffd700' },
  { name: 'ORANGE', hex: '#ff9800' },
  { name: 'RED', hex: '#e00000' },
  { name: 'CRIMSON', hex: '#990000' },
  { name: 'MAGENTA', hex: '#cc00cc' },
  { name: 'PURPLE', hex: '#6236ff' },
  { name: 'HOT PINK', hex: '#ff4081' },
  { name: 'LIGHT PINK', hex: '#ffb6c1' },
  { name: 'BROWN', hex: '#8b4513' },
  { name: 'TAUPE', hex: '#b38b6d' },
  { name: 'CREAM', hex: '#fffdd0' },
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
          className={`swatch aspect-square rounded-none cursor-pointer border transition-all
            ${isActive ? 'border-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.2)] scale-105 z-10' : 'border-gray-100 hover:border-gray-300'}`}
          style={{ backgroundColor: c.hex }}
        >
          {isActive && <div className="w-full h-full border-[3px] border-white/30" />}
        </div>
      );
    })}
  </div>
);

const SecHeader = ({ label, icon, isOpen, onToggle }) => (
  <button
    onClick={onToggle}
    className="w-full flex items-center justify-between px-5 py-3.5 border-b border-gray-50 cursor-pointer outline-none transition-all hover:bg-gray-50/50 bg-white group"
  >
    <div className="flex items-center gap-3">
      <span className={`text-xl transition-colors ${isOpen ? 'text-blue-600' : 'text-gray-400'}`}>{icon}</span>
      <span className={`text-[10px] font-semibold tracking-[0.15em] uppercase transition-colors ${isOpen ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
    </div>
    <HiOutlineChevronDown className={`text-gray-300 text-sm transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
  </button>
);

const MeshProperties = ({ state, updateProp }) => {
  const [openSections, setOpenSections] = useState(['fill']);
  const toggleSection = (id) => {
    setOpenSections(prev => {
      if (prev.includes(id)) return prev.filter(s => s !== id);
      return [...prev, id];
    });
  };

  if (!state) return <div className="p-10 text-center text-gray-400 font-semibold uppercase tracking-widest text-[10px]">Select a part to edit</div>;

  return (
    <div className="flex flex-col bg-white">
      <SecHeader label="Fill Color" icon={<VscSymbolColor />} isOpen={openSections.includes('fill')} onToggle={() => toggleSection('fill')} />
      {openSections.includes('fill') && (
        <div className="p-5 bg-white border-b border-gray-50 animate-in fade-in duration-300">
          <div className="flex items-center gap-4 p-3 bg-gray-50 border border-gray-100 rounded-none mb-4">
            <div className="w-10 h-10 rounded-none border border-white shadow-sm flex-shrink-0" style={{ backgroundColor: state.color }} />
            <div>
              <div className="text-[8px] font-semibold text-gray-400 uppercase tracking-widest">Active Material</div>
              <div className="text-[12px] font-semibold text-gray-800 tracking-wider">{getColorName(state.color)}</div>
            </div>
          </div>
          <ColorGrid selected={state.color} onSelect={(hex) => { updateProp('color', hex); updateProp('isGrad', false); }} />
        </div>
      )}

      <SecHeader label="Gradient Engine" icon={<HiOutlineSparkles />} isOpen={openSections.includes('grad')} onToggle={() => toggleSection('grad')} />
      {openSections.includes('grad') && (
        <div className="p-5 bg-white border-b border-gray-50 animate-in fade-in duration-300">
          <div className="flex gap-2 mb-5">
            <button onClick={() => updateProp('isGrad', false)} className={`flex-1 py-2 rounded-none text-[9px] font-semibold tracking-widest border transition-all ${!state.isGrad ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm' : 'border-gray-100 text-gray-400'}`}>SOLID</button>
            <button onClick={() => updateProp('isGrad', true)} className={`flex-1 py-2 rounded-none text-[9px] font-semibold tracking-widest border transition-all ${state.isGrad ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm' : 'border-gray-100 text-gray-400'}`}>GRADIENT</button>
          </div>
          {state.isGrad && (
            <div className="fade-up space-y-5">
              <div className="h-6 rounded-none border border-gray-100 shadow-inner" style={{ background: `linear-gradient(to right, ${state.grad1}, ${state.grad2})` }} />
              <div className="text-[8px] font-semibold text-gray-400 uppercase tracking-widest">Start Color</div>
              <ColorGrid selected={state.grad1} onSelect={(val) => updateProp('grad1', val)} />
              <div className="text-[8px] font-semibold text-gray-400 uppercase tracking-widest">End Color</div>
              <ColorGrid selected={state.grad2} onSelect={(val) => updateProp('grad2', val)} />
            </div>
          )}
        </div>
      )}

      <SecHeader label="Pattern Overlay" icon={<HiOutlinePhotograph />} isOpen={openSections.includes('pat')} onToggle={() => toggleSection('pat')} />
      {openSections.includes('pat') && (
        <div className="p-5 bg-white border-b border-gray-50 animate-in fade-in duration-300">
          <div className="flex gap-3 mb-5">
            <div onClick={() => updateProp('pUrl', null)} className={`w-14 h-14 rounded-none border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${!state.pUrl ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-300'}`}>
              <HiOutlineMinus className="text-lg" />
              <span className="text-[7px] font-semibold">NONE</span>
            </div>
            <label className="w-14 h-14 rounded-none border border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-all text-gray-300 group">
              <HiOutlinePlus className="text-lg group-hover:text-blue-600" />
              <span className="text-[7px] font-semibold group-hover:text-blue-600 uppercase">Upload</span>
              <input type="file" className="hidden" onChange={e => e.target.files?.[0] && updateProp('pUrl', URL.createObjectURL(e.target.files[0]))} />
            </label>
            {state.pUrl && <div className="w-14 h-14 rounded-none border border-blue-600 bg-cover bg-center shadow-lg" style={{ backgroundImage: `url(${state.pUrl})` }} />}
          </div>
          {state.pUrl && (
            <div className="space-y-4">
              <div className="text-[8px] font-semibold text-gray-400 uppercase tracking-widest">Pattern Color</div>
              <ColorGrid selected={state.pColor} onSelect={(val) => updateProp('pColor', val)} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const NamesNumbersTab = ({ decals, selectedDecalId, setSelectedDecalId, addDecal, updateDecal, removeDecal }) => {
  const selected = decals.find(d => d.id === selectedDecalId);
  const [localText, setLocalText] = useState('');
  const [openSection, setOpenSection] = useState('font');
  const isLocked = !selected;

  useEffect(() => {
    if (selected && selected.type === 'text') setLocalText(selected.text);
    else setLocalText('');
  }, [selectedDecalId]);

  const fonts = ['Arial', 'Impact', 'Verdana', 'Georgia', 'Courier New'];

  const safeUpdate = (updates) => {
    if (!selected) return;
    updateDecal(selected.id, updates);
  };

  const renderColorGrid = (targetProp) => (
    <div className="flex flex-wrap gap-2">
      {colors.map((c, i) => (
        <button
          key={c.hex + i}
          onClick={() => safeUpdate({ [targetProp]: c.hex })}
          className={`w-7 h-7 rounded-none border cursor-pointer transition-all hover:scale-110 ${selected?.[targetProp] === c.hex ? 'border-blue-600 shadow-lg ring-1 ring-blue-100 z-10' : 'border-gray-200 hover:border-gray-400'}`}
          style={{ backgroundColor: c.hex }}
        />
      ))}
    </div>
  );

  const renderSection = (id, label, content) => {
    const isOpen = openSection === id;
    return (
      <div key={id} className={`bg-white border-b border-gray-100 ${isLocked || selected?.type !== 'text' ? 'opacity-40 pointer-events-none' : ''}`}>
        <button
          onClick={() => { if (!isLocked) setOpenSection(isOpen ? null : id); }}
          className={`w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${isOpen ? 'bg-gray-50' : ''}`}
        >
          <span className={`text-[10px] font-semibold uppercase tracking-widest ${isOpen ? 'text-blue-600' : 'text-gray-700'}`}>{label}</span>
          <HiOutlineChevronDown size={14} className={`text-gray-300 transition-transform ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
        </button>
        {isOpen && <div className="p-5">{content}</div>}
      </div>
    );
  };

  return (
    <div className="flex flex-col bg-white">
      {/* ADD TEXT INPUT */}
      <div className="p-6 bg-white border-b border-gray-50">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="TYPE TEXT HERE..."
            className="flex-1 bg-gray-50 border border-gray-100 rounded-none px-4 py-3 text-[10px] font-semibold uppercase tracking-widest focus:border-blue-600 focus:bg-white outline-none transition-all"
            onChange={(e) => {
              const val = e.target.value.toUpperCase();
              setLocalText(val);
              if (selected && selected.type === 'text') safeUpdate({ text: val });
            }}
            onKeyDown={(e) => { if (e.key === 'Enter') addDecal('text', localText || 'TEAM NAME'); }}
            value={localText}
          />
          <button
            onClick={() => addDecal('text', localText || 'TEAM NAME')}
            className="px-6 bg-gray-800 text-white rounded-none text-[10px] font-semibold uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95"
          >
            ADD
          </button>
        </div>
      </div>

      {/* TEXT LAYERS LIST */}
      <div className="p-6 bg-white border-b border-gray-50">
        <h3 className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mb-4">Active Text Layers</h3>
        <div className="space-y-1.5">
          {decals.filter(d => d.type === 'text').map((d) => (
            <div
              key={d.id}
              onClick={() => setSelectedDecalId(d.id)}
              className={`p-3.5 rounded-none border transition-all flex items-center justify-between bg-white cursor-pointer
                ${selectedDecalId === d.id ? 'border-blue-600 bg-blue-50/20' : 'border-gray-50 hover:border-gray-100'}`}
            >
              <div className="flex flex-col">
                <span className={`text-[10px] font-semibold tracking-widest ${selectedDecalId === d.id ? 'text-gray-900' : 'text-gray-500'}`}>{d.text}</span>
                <span className="text-[7px] font-semibold text-gray-300 uppercase mt-0.5">{d.font} • SCALE {((d.decalScale || 0.15) * 100).toFixed(0)}%</span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); removeDecal(d.id); }} className="text-gray-200 hover:text-red-500"><HiOutlineTrash /></button>
            </div>
          ))}
        </div>
      </div>

      {/* TEXT CONTROLS */}
      <div className="flex-1">
        {renderSection('font', 'Font & Color', (
          <div className="space-y-6">
            <div>
              <p className="text-[9px] font-semibold text-gray-400 uppercase mb-3">Text Color</p>
              {renderColorGrid('color')}
            </div>
            <div>
              <p className="text-[9px] font-semibold text-gray-400 uppercase mb-3">Sports Typography</p>
              <div className="grid grid-cols-2 gap-2">
                {fonts.map(f => (
                  <button
                    key={f}
                    onClick={() => safeUpdate({ font: f })}
                    className={`py-3 rounded-none border text-[10px] font-semibold cursor-pointer transition-all ${selected?.font === f ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-500 hover:border-gray-300'}`}
                    style={{ fontFamily: f }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}

        {renderSection('outline', 'Outline Effects', (
          <div className="space-y-5">
            <div className="flex items-center justify-between bg-gray-50 p-3">
              <p className="text-[9px] font-semibold text-gray-400 uppercase">Outline 1 Width</p>
              <span className="text-[10px] font-semibold text-blue-600">{selected?.outline1Width || 0}PX</span>
            </div>
            <input type="range" min="0" max="10" step="1" className="w-full h-1.5 bg-gray-200 rounded-none appearance-none cursor-pointer accent-blue-600" value={selected?.outline1Width || 0} onChange={(e) => safeUpdate({ outline1Width: parseInt(e.target.value) })} />
            <div className="text-[8px] font-semibold text-gray-400 uppercase">Outline 1 Color</div>
            {renderColorGrid('outline1Color')}
            
            <div className="h-px bg-gray-50 w-full" />
            
            <div className="flex items-center justify-between bg-gray-50 p-3">
              <p className="text-[9px] font-semibold text-gray-400 uppercase">Outline 2 Width</p>
              <span className="text-[10px] font-semibold text-blue-600">{selected?.outline2Width || 0}PX</span>
            </div>
            <input type="range" min="0" max="10" step="1" className="w-full h-1.5 bg-gray-200 rounded-none appearance-none cursor-pointer accent-blue-600" value={selected?.outline2Width || 0} onChange={(e) => safeUpdate({ outline2Width: parseInt(e.target.value) })} />
            <div className="text-[8px] font-semibold text-gray-400 uppercase">Outline 2 Color</div>
            {renderColorGrid('outline2Color')}
          </div>
        ))}

        {renderSection('curv', 'Text Curvature', (
          <div className="space-y-4">
             <div className="flex items-center justify-between p-3 border border-gray-100">
                <span className="text-[10px] font-semibold text-gray-700 uppercase">Enable Arch</span>
                <button onClick={() => safeUpdate({ effect: selected?.effect === 'arch' ? 'none' : 'arch' })} className={`w-10 h-5 rounded-full relative transition-colors ${selected?.effect === 'arch' ? 'bg-blue-600' : 'bg-gray-200'}`}><div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-all ${selected?.effect === 'arch' ? 'translate-x-5' : ''}`} /></button>
             </div>
             {selected?.effect === 'arch' && (
                <div className="space-y-3 p-3 bg-gray-50">
                   <div className="flex items-center justify-between"><span className="text-[9px] font-semibold text-gray-400 uppercase">Intensity</span><span className="text-[10px] font-semibold text-blue-600">{((selected?.effectIntensity || 0.5) * 100).toFixed(0)}%</span></div>
                   <input type="range" min="0.1" max="1.5" step="0.1" className="w-full h-1 bg-gray-200 appearance-none cursor-pointer accent-blue-600" value={selected?.effectIntensity || 0.5} onChange={(e) => safeUpdate({ effectIntensity: parseFloat(e.target.value) })} />
                </div>
             )}
          </div>
        ))}

        {renderSection('scale', 'Transform Scale', (
          <div className="space-y-4">
            <div className="flex items-center justify-between"><span className="text-[9px] font-semibold text-gray-400 uppercase">Global Scale</span><span className="text-[10px] font-semibold text-blue-600">{((selected?.decalScale || 0.15) * 100).toFixed(0)}%</span></div>
            <input type="range" min="0.05" max="0.5" step="0.01" className="w-full h-1.5 bg-gray-200 rounded-none appearance-none cursor-pointer accent-blue-600" value={selected?.decalScale || 0.15} onChange={(e) => safeUpdate({ decalScale: parseFloat(e.target.value) })} />
          </div>
        ))}
      </div>
    </div>
  );
};

const logoCategories = [
  { name: 'SWEEPS', icon: <BiWater />, items: [{ name: 'Classic Swoosh', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/wind.svg' }, { name: 'Wave Sweep', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/water.svg' }] },
  { name: 'FLAGS', icon: <BiFlag />, items: [{ name: 'USA', url: 'https://flagcdn.com/us.svg' }, { name: 'UK', url: 'https://flagcdn.com/gb.svg' }] },
  { name: 'ANIMALS', icon: <FaPaw />, items: [{ name: 'Wolf', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/dog.svg' }, { name: 'Paw', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/paw.svg' }] },
];

const LogosFlagsTab = ({ decals, selectedDecalId, setSelectedDecalId, addDecal, updateDecal, removeDecal }) => {
  const selected = decals.find(d => d.id === selectedDecalId);
  const [expandedCat, setExpandedCat] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    addDecal('image', file.name.replace(/\.[^.]+$/, ''), url);
  };

  return (
    <div className="flex flex-col bg-white">
      <div className="p-6 bg-white border-b border-gray-50">
        <h3 className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mb-4">Injection Pipeline</h3>
        <label className="flex flex-col items-center justify-center py-10 border border-dashed border-gray-200 rounded-none bg-gray-50 hover:bg-blue-50 hover:border-blue-600 transition-all cursor-pointer">
          <HiOutlineCloudUpload size={24} className="text-gray-400 mb-4" />
          <p className="text-[10px] font-semibold text-gray-900 uppercase tracking-widest">Upload Artwork</p>
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </label>
      </div>

      <div className="p-6 bg-white border-b border-gray-50">
        <h3 className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mb-4">Active Logos</h3>
        <div className="space-y-1.5">
          {decals.filter(d => d.type === 'image').map(d => (
            <div key={d.id} onClick={() => setSelectedDecalId(d.id)} className={`p-3.5 border transition-all flex items-center justify-between cursor-pointer ${selectedDecalId === d.id ? 'border-blue-600 bg-blue-50/20' : 'border-gray-50 hover:border-gray-100'}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-cover bg-center border border-gray-100" style={{ backgroundImage: `url(${d.imageUrl})` }} />
                <span className="text-[10px] font-semibold uppercase truncate max-w-[150px]">{d.text}</span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); removeDecal(d.id); }} className="text-gray-200 hover:text-red-500"><HiOutlineTrash /></button>
            </div>
          ))}
        </div>
        {selected?.type === 'image' && (
           <div className="mt-6 p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-2"><span className="text-[9px] font-semibold text-gray-400 uppercase">Scale</span><span className="text-[10px] font-semibold text-blue-600">{((selected.decalScale || 0.12) * 100).toFixed(0)}%</span></div>
              <input type="range" min="0.03" max="0.3" step="0.01" className="w-full h-1 bg-gray-200 appearance-none cursor-pointer accent-blue-600" value={selected.decalScale || 0.12} onChange={(e) => updateDecal(selected.id, { decalScale: parseFloat(e.target.value) })} />
           </div>
        )}
      </div>

      <div className="flex-1">
        {logoCategories.map((cat, i) => (
          <div key={cat.name} className="border-b border-gray-50">
            <button onClick={() => setExpandedCat(expandedCat === i ? null : i)} className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3"><span className="text-xl text-gray-400">{cat.icon}</span><span className="text-[10px] font-semibold uppercase tracking-widest text-gray-700">{cat.name}</span></div>
              <HiOutlineChevronDown size={14} className={`text-gray-300 transition-transform ${expandedCat === i ? 'rotate-180 text-blue-600' : ''}`} />
            </button>
            {expandedCat === i && (
              <div className="p-4 grid grid-cols-3 gap-2 bg-white">
                {cat.items.map((item, idx) => (
                  <button key={idx} onClick={() => addDecal('image', item.name, item.url)} className="aspect-square bg-gray-50 border border-gray-100 p-2 hover:border-blue-600 transition-all">
                    <img src={item.url} alt={item.name} className="w-full h-full object-contain opacity-60 hover:opacity-100" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const CheckoutRosterTab = ({ roster, setRoster }) => {
  const addRow = () => setRoster([...roster, { id: Date.now(), name: '', number: '', size: 'L' }]);
  const updateRow = (id, field, value) => setRoster(roster.map(r => r.id === id ? { ...r, [field]: value } : r));
  const removeRow = (id) => roster.length > 1 && setRoster(roster.filter(r => r.id !== id));

  return (
    <div className="flex flex-col bg-white h-full">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between">
        <div><h3 className="text-[10px] font-semibold uppercase tracking-widest text-gray-800">Order Roster</h3><p className="text-[8px] font-semibold text-gray-400 uppercase mt-1">{roster.length} Total Units</p></div>
        <button onClick={addRow} className="px-3 py-2 bg-blue-600 text-white text-[9px] font-semibold uppercase tracking-widest shadow-lg shadow-blue-500/10">Add Player</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar" data-lenis-prevent>
        {roster.map((row, index) => (
          <div key={row.id} className="bg-white border border-gray-50 p-3 flex items-center gap-3">
             <div className="w-6 h-6 bg-gray-50 border border-gray-100 flex items-center justify-center text-[9px] font-bold text-gray-400">{index + 1}</div>
             <div className="flex-1 grid grid-cols-12 gap-2">
                <input className="col-span-6 bg-gray-50 border-none px-2 py-2 text-[10px] font-semibold outline-none" value={row.name} onChange={e => updateRow(row.id, 'name', e.target.value.toUpperCase())} placeholder="NAME" />
                <input className="col-span-3 bg-gray-50 border-none px-2 py-2 text-[10px] font-semibold text-center outline-none" value={row.number} onChange={e => updateRow(row.id, 'number', e.target.value)} placeholder="00" maxLength={3} />
                <select className="col-span-3 bg-gray-50 border-none px-2 py-2 text-[10px] font-semibold outline-none appearance-none" value={row.size} onChange={e => updateRow(row.id, 'size', e.target.value)}>
                   {['YS', 'YM', 'YL', 'S', 'M', 'L', 'XL', '2XL', '3XL'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
             </div>
             <button onClick={() => removeRow(row.id)} className="text-gray-200 hover:text-red-500"><HiOutlineTrash /></button>
          </div>
        ))}
      </div>
      <div className="p-6 border-t border-gray-100"><button className="w-full bg-blue-600 text-white py-4 text-[11px] font-semibold uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all">Finalize Checkout</button></div>
    </div>
  );
};

const RightPanel = (props) => {
  const [activeTab, setActiveTab] = useState('colors');
  const mainTabs = [
    { id: 'colors', label: 'Colors Patterns', icon: <BiPalette /> },
    { id: 'names', label: 'Names Numbers', icon: <BiText /> },
    { id: 'logos', label: 'Logos Flags', icon: <BiImage /> },
    { id: 'config', label: 'Studio Config', icon: <VscSettingsGear /> },
    { id: 'roster', label: 'Checkout Roster', icon: <BiCart /> },
  ];

  return (
    <div className="flex flex-1 md:flex-none w-full md:w-[420px] h-full flex-col bg-white overflow-hidden shadow-[-20px_0_60px_rgba(0,0,0,0.02)] z-10 font-['Outfit'] border-l border-gray-100 relative min-h-0">
      <div className="flex bg-white border-b border-gray-100 overflow-x-auto no-scrollbar">
        {mainTabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 min-w-[80px] py-4 flex flex-col items-center gap-2 transition-all relative cursor-pointer ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400 hover:text-gray-900'}`}>
            <span className="text-xl">{tab.icon}</span>
            <span className="text-[7px] font-semibold uppercase tracking-widest text-center leading-tight">
               {tab.label.split(' ').map((s, i) => <span key={i} className="block">{s}</span>)}
            </span>
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]" />}
          </button>
        ))}
      </div>

      <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100"><BiCube size={22} /></div>
          <div>
            <div className="text-[10px] font-semibold text-gray-900 uppercase tracking-widest">{props.activeMesh ? props.activeMesh.replace(/_/g, ' ') : 'Select Part'}</div>
            <div className="text-[8px] font-semibold text-gray-400 uppercase tracking-widest mt-0.5">Active Workspace</div>
          </div>
        </div>
        <div className="px-2 py-1 border border-green-200 bg-green-50 text-green-600 text-[8px] font-semibold tracking-widest uppercase">Live View</div>
      </div>

      <div className="flex-1 relative min-h-0">
        <div className="absolute inset-0 overflow-y-auto overflow-x-hidden touch-auto custom-scrollbar" data-lenis-prevent onWheel={(e) => e.stopPropagation()} style={{ WebkitOverflowScrolling: 'touch' }}>
          {activeTab === 'colors' ? (
            <MeshProperties state={props.meshStates[props.activeMesh]} updateProp={(prop, val) => props.updateMeshProp(props.activeMesh, prop, val)} />
          ) : activeTab === 'names' ? (
            <NamesNumbersTab {...props} />
          ) : activeTab === 'logos' ? (
            <LogosFlagsTab {...props} />
          ) : activeTab === 'config' ? (
            <StudioConfigTab {...props} />
          ) : (
            <CheckoutRosterTab roster={props.roster} setRoster={props.setRoster} />
          )}
        </div>
      </div>

      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            <span className="text-[8px] font-semibold text-gray-400 uppercase tracking-widest">Workspace Connected</span>
         </div>
         <span className="text-[8px] font-bold text-gray-300 uppercase tracking-[0.2em]">Elite Studio Engine v1.0.4</span>
      </div>
    </div>
  );
};

const StudioConfigTab = ({ globalPattern, setGlobalPattern, lightingPreset, setLightingPreset, materialFinish, setMaterialFinish, mouseFollow, setMouseFollow }) => {
  const [openSection, setOpenSection] = useState('pattern');
  const renderSection = (id, label, icon, content) => {
    const isOpen = openSection === id;
    return (
      <div className="bg-white border-b border-gray-50">
        <button onClick={() => setOpenSection(isOpen ? null : id)} className={`w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${isOpen ? 'bg-gray-50' : ''}`}>
          <div className="flex items-center gap-3"><span className={`text-lg transition-colors ${isOpen ? 'text-blue-600' : 'text-gray-400'}`}>{icon}</span><span className={`text-[10px] font-semibold uppercase tracking-widest ${isOpen ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span></div>
          <HiOutlineChevronDown size={14} className={`text-gray-300 transition-transform ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
        </button>
        {isOpen && <div className="p-5 animate-in fade-in duration-300">{content}</div>}
      </div>
    );
  };

  return (
    <div className="flex flex-col bg-white h-full">
      {renderSection('pattern', 'Fabric Options', <HiOutlineCube />, (
        <div className="grid grid-cols-2 gap-2">
          {['none', 'carbon', 'camo', 'dots'].map(p => (
            <button key={p} onClick={() => setGlobalPattern(p === 'none' ? null : p)} className={`py-3 text-[9px] font-semibold uppercase tracking-widest border transition-all ${globalPattern === p || (p === 'none' && !globalPattern) ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-400 hover:border-gray-300'}`}>{p}</button>
          ))}
        </div>
      ))}
      {renderSection('finish', 'Material Finish', <HiOutlineColorSwatch />, (
        <div className="grid grid-cols-3 gap-2">
          {['matte', 'gloss', 'metallic'].map(f => (
            <button key={f} onClick={() => setMaterialFinish(f)} className={`py-3 text-[9px] font-semibold uppercase tracking-widest border transition-all ${materialFinish === f ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-400 hover:border-gray-300'}`}>{f}</button>
          ))}
        </div>
      ))}
      {renderSection('lighting', 'Studio Lighting', <HiOutlineLightningBolt />, (
        <div className="grid grid-cols-3 gap-2">
          {['city', 'studio', 'night'].map(l => (
            <button key={l} onClick={() => setLightingPreset(l)} className={`py-3 text-[9px] font-semibold uppercase tracking-widest border transition-all ${lightingPreset === l ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-400 hover:border-gray-300'}`}>{l}</button>
          ))}
        </div>
      ))}
      {renderSection('interaction', 'Viewport Settings', <HiOutlineCursorClick />, (
        <button onClick={() => setMouseFollow(!mouseFollow)} className={`w-full py-3.5 text-[10px] font-semibold uppercase tracking-widest border transition-all flex items-center justify-center gap-3 ${mouseFollow ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-400 border-gray-100 hover:border-blue-600'}`}>
          360 Mouse Follow: {mouseFollow ? 'ACTIVE' : 'OFF'}
        </button>
      ))}
    </div>
  );
};

export default RightPanel;
