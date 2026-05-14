import React, { useState, useEffect } from 'react';
import { BiCube, BiPalette, BiText, BiImage, BiCart } from 'react-icons/bi';
import { HiOutlineSparkles, HiOutlinePhotograph, HiOutlineCube, HiOutlineLightningBolt, HiOutlineColorSwatch, HiOutlineCursorClick, HiOutlineAdjustments, HiOutlineUserAdd, HiOutlineTrash, HiOutlinePlus, HiOutlineMinus, HiOutlineChevronDown } from 'react-icons/hi';
import { VscSymbolColor } from 'react-icons/vsc';

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

const NamesNumbersTab = ({ decals, selectedDecalId, setSelectedDecalId, addDecal, updateDecal, removeDecal }) => {
  const selected = decals.find(d => d.id === selectedDecalId);
  const [localText, setLocalText] = useState('');
  const [openSection, setOpenSection] = useState('font');
  const isLocked = !selected;

  useEffect(() => {
    if (selected) setLocalText(selected.text);
  }, [selectedDecalId]);

  const fonts = ['Arial', 'Impact', 'Verdana', 'Georgia', 'Courier New'];

  // Safe update helper — prevents crash if nothing selected
  const safeUpdate = (updates) => {
    if (!selected) return;
    console.log('[EAY] Updating decal', selected.id, updates);
    updateDecal(selected.id, updates);
  };

  // Render a color grid inline (NO component — avoids React remount bug)
  const renderColorGrid = (targetProp) => (
    <div className="flex flex-wrap gap-2">
      {colors.map((c, i) => (
        <button
          key={c.hex + i}
          onClick={() => safeUpdate({ [targetProp]: c.hex })}
          className={`w-7 h-7 rounded-full border-2 cursor-pointer transition-all hover:scale-125 active:scale-90 ${selected?.[targetProp] === c.hex ? 'border-[#00b0f0] scale-110 shadow-lg ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-400'}`}
          style={{ backgroundColor: c.hex }}
          title={c.name}
        />
      ))}
    </div>
  );

  // Render an accordion section inline (NO component)
  const renderSection = (id, label, content) => {
    const isOpen = openSection === id;
    return (
      <div key={id} className={`bg-white border-b border-gray-100 ${isLocked ? 'opacity-40 pointer-events-none' : ''}`}>
        <button
          onClick={() => { if (!isLocked) setOpenSection(isOpen ? null : id); }}
          className={`w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${isOpen ? 'bg-gray-50' : ''}`}
        >
          <span className={`text-[10px] font-black uppercase tracking-widest ${isOpen ? 'text-[#00b0f0]' : 'text-gray-700'}`}>{label}</span>
          <span className={`text-[10px] transition-transform duration-300 ${isOpen ? 'rotate-45 text-[#00b0f0]' : 'text-gray-300'}`}>＋</span>
        </button>
        {isOpen && (
          <div className="p-5">
            {content}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col bg-gray-50 h-full overflow-y-auto right-scroll">

      {/* 1. LAYER LIST */}
      <div className="p-5 bg-white border-b border-gray-100">
        <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center justify-between">
          <span>Active Text Layers</span>
          <span className="text-[8px] bg-gray-100 px-2 py-0.5 rounded text-gray-500">{decals.length} TOTAL</span>
        </h3>
        <div className="space-y-2">
          {decals.map(d => (
            <div
              key={d.id}
              onClick={() => setSelectedDecalId(d.id)}
              className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between bg-white ${selectedDecalId === d.id ? 'border-[#00b0f0] shadow-md scale-[1.02]' : 'border-gray-100 hover:border-gray-200'}`}
            >
              <div className="flex flex-col">
                <span className="text-xs font-black truncate">{d.text || 'EMPTY'}</span>
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">{d.font} • SIZE {((d.decalScale || 0.15) * 100).toFixed(0)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-gray-100" style={{ backgroundColor: d.color }} />
                <button onClick={(e) => { e.stopPropagation(); removeDecal(d.id); }} className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">✕</button>
              </div>
            </div>
          ))}
          {decals.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
              <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">Add your first text below</p>
            </div>
          )}
        </div>
      </div>

      {/* 2. ADD TEXT */}
      <div className="bg-white p-5 border-b border-gray-100 shadow-sm relative z-10">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="TYPE HERE..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-xs font-bold focus:border-[#00b0f0] outline-none transition-all"
            onChange={(e) => {
              const val = e.target.value.toUpperCase();
              setLocalText(val);
              if (selected) safeUpdate({ text: val });
            }}
            onKeyDown={(e) => { if (e.key === 'Enter') addDecal('text', localText || 'TEAM NAME'); }}
            value={localText}
          />
          <button
            onClick={() => addDecal('text', localText || 'TEAM NAME')}
            className="px-6 bg-gray-800 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95"
          >
            ADD
          </button>
        </div>
        {!selected && decals.length > 0 && (
          <div className="animate-pulse flex items-center justify-center gap-2 py-2 bg-blue-50 rounded-lg border border-blue-100 mt-2">
            <span className="text-[9px] font-black text-[#00b0f0] uppercase tracking-widest">↑ Select a layer above to edit ↑</span>
          </div>
        )}
      </div>

      {/* 3. STYLING */}
      <div className="flex-1">

        {/* Font & Color */}
        {renderSection('font', 'Font & Color', (
          <div className="space-y-6">
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase mb-3">Primary Color</p>
              {renderColorGrid('color')}
            </div>
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase mb-3">Sports Typography</p>
              <div className="grid grid-cols-2 gap-2">
                {fonts.map(f => (
                  <button
                    key={f}
                    onClick={() => safeUpdate({ font: f })}
                    className={`py-3 rounded-lg border-2 text-[10px] font-black cursor-pointer transition-all ${selected?.font === f ? 'border-[#00b0f0] bg-blue-50 text-[#00b0f0]' : 'border-gray-100 text-gray-500 hover:border-gray-300'}`}
                    style={{ fontFamily: f }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Outline 1 */}
        {renderSection('outline', 'Outline Layer 1', (
          <div className="space-y-5">
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <p className="text-[9px] font-black text-gray-400 uppercase">Thickness</p>
              <span className="text-[10px] font-black text-[#00b0f0] bg-white px-2 py-1 rounded shadow-sm">{selected?.outline1Width || 0}PX</span>
            </div>
            <input type="range" min="0" max="12" step="1" className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00b0f0]" value={selected?.outline1Width || 0} onChange={(e) => safeUpdate({ outline1Width: parseInt(e.target.value) })} />
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase mb-3">Outline Color</p>
              {renderColorGrid('outline1Color')}
            </div>
          </div>
        ))}

        {/* Outline 2 */}
        {renderSection('outline2', 'Outline Layer 2', (
          <div className="space-y-5">
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <p className="text-[9px] font-black text-gray-400 uppercase">Outer Thickness</p>
              <span className="text-[10px] font-black text-[#00b0f0] bg-white px-2 py-1 rounded shadow-sm">{selected?.outline2Width || 0}PX</span>
            </div>
            <input type="range" min="0" max="12" step="1" className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00b0f0]" value={selected?.outline2Width || 0} onChange={(e) => safeUpdate({ outline2Width: parseInt(e.target.value) })} />
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase mb-3">Outer Color</p>
              {renderColorGrid('outline2Color')}
            </div>
          </div>
        ))}

        {/* Curvature */}
        {renderSection('effect', 'Text Curvature', (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
              <span className="text-[10px] font-black text-gray-700 uppercase tracking-wider">Arch Effect</span>
              <button
                onClick={() => safeUpdate({ effect: selected?.effect === 'arch' ? 'none' : 'arch' })}
                className={`w-12 h-6 rounded-full transition-colors relative shadow-inner cursor-pointer ${selected?.effect === 'arch' ? 'bg-[#00b0f0]' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-md transition-all ${selected?.effect === 'arch' ? 'translate-x-6' : ''}`} />
              </button>
            </div>
            {selected?.effect === 'arch' && (
              <div className="p-4 bg-white rounded-xl border border-gray-100 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-black text-gray-400 uppercase">Bend Intensity</p>
                  <span className="text-[10px] font-bold text-[#00b0f0]">{((selected?.effectIntensity || 0.5) * 100).toFixed(0)}%</span>
                </div>
                <input type="range" min="0.1" max="1.5" step="0.1" className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00b0f0]" value={selected?.effectIntensity || 0.5} onChange={(e) => safeUpdate({ effectIntensity: parseFloat(e.target.value) })} />
              </div>
            )}
          </div>
        ))}

        {/* Swoosh */}
        {renderSection('tail', 'Sports Swoosh', (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => safeUpdate({ tail: 'none' })} className={`py-3 rounded-xl border-2 text-[10px] font-black cursor-pointer transition-all ${selected?.tail === 'none' ? 'border-[#00b0f0] bg-blue-50 text-[#00b0f0]' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}>NONE</button>
              <button onClick={() => safeUpdate({ tail: 'swoosh' })} className={`py-3 rounded-xl border-2 text-[10px] font-black cursor-pointer transition-all ${selected?.tail === 'swoosh' ? 'border-[#00b0f0] bg-blue-50 text-[#00b0f0]' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}>SWOOSH</button>
            </div>
            {selected?.tail === 'swoosh' && (
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 border-dashed text-center">
                <p className="text-[8px] text-[#00b0f0] font-black uppercase tracking-widest leading-relaxed">Tail inherits your primary color</p>
              </div>
            )}
          </div>
        ))}

      </div>
    </div>
  );
};

// ─── LOGOS & FLAGS TAB ─────────────────────────────────────────────────────────
import {
  BiImageAdd, BiFlag, BiFootball, BiChevronRight, BiPlus, BiTrash,
  BiWater, BiMapAlt, BiDna, BiBug, BiCamera, BiUserCircle, BiGhost, BiStar, BiHeart
} from 'react-icons/bi';
import { FaPaw, FaCat, FaCrow, FaHippo, FaHorse } from 'react-icons/fa';

const logoCategories = [
  {
    name: 'TAIL SWEEP', icon: <BiWater />,
    items: [
      { name: 'Classic Swoosh', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/wind.svg' },
      { name: 'Wave Sweep', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/water.svg' },
      { name: 'Power Line', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/bolt.svg' }
    ]
  },
  {
    name: 'FLAGS & SYMBOLS', icon: <BiFlag />,
    items: [
      { name: 'USA Flag', url: 'https://flagcdn.com/us.svg' },
      { name: 'UK Flag', url: 'https://flagcdn.com/gb.svg' },
      { name: 'Golden Star', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/star.svg' },
      { name: 'Shield', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/shield-halved.svg' }
    ]
  },
  {
    name: 'SPORT BALLS & ICONS', icon: <BiFootball />,
    items: [
      { name: 'Basketball', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/basketball.svg' },
      { name: 'Soccer Ball', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/futbol.svg' },
      { name: 'Baseball', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/baseball.svg' },
      { name: 'Trophy', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/trophy.svg' }
    ]
  },
  {
    name: 'WOLVES & DOGS', icon: <FaPaw />,
    items: [
      { name: 'Wolf Head', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/dog.svg' },
      { name: 'Paw Print', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/paw.svg' }
    ]
  },
  { name: 'CATS', icon: <FaCat />, items: [{ name: 'Cat Icon', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/cat.svg' }] },
  { name: 'PEOPLE', icon: <BiUserCircle />, items: [{ name: 'Athlete', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/user-ninja.svg' }] },
  { name: 'BIRDS & THINGS WITH WINGS', icon: <FaCrow />, items: [{ name: 'Eagle', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/crow.svg' }] },
  { name: 'BEARS & TUSKS', icon: <FaHippo />, items: [{ name: 'Bear', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/hippo.svg' }] },
  { name: 'REPTILES & SEA CREATURES', icon: <BiBug />, items: [{ name: 'Dragon', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/dragon.svg' }] },
  { name: 'HORSES & HOOVES', icon: <FaHorse />, items: [{ name: 'Horse', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/horse.svg' }] },
  { name: 'MISC. LOGOS', icon: <BiStar />, items: [{ name: 'Crown', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/crown.svg' }] },
  { name: 'WATERMARKS', icon: <BiGhost />, items: [{ name: 'Ghost', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/ghost.svg' }] },
];

const LogosFlagsTab = ({ decals, selectedDecalId, setSelectedDecalId, addDecal, updateDecal, removeDecal }) => {
  const imageDecals = decals.filter(d => d.type === 'image');
  const selected = imageDecals.find(d => d.id === selectedDecalId);
  const [expandedCat, setExpandedCat] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    addDecal('image', file.name.replace(/\.[^.]+$/, ''), url);
    e.target.value = '';
  };

  const safeUpdate = (updates) => {
    if (!selected) return;
    updateDecal(selected.id, updates);
  };

  return (
    <div className="flex flex-col bg-gray-50 h-full overflow-y-auto right-scroll">

      {/* ADD LOGO */}
      <div className="p-5 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Add Logo</h3>
        </div>
        <label className="flex flex-col items-center justify-center gap-2 py-5 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#00b0f0] hover:bg-blue-50/30 transition-all group">
          <span className="text-2xl text-gray-300 group-hover:text-[#00b0f0] transition-colors">📤</span>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-[#00b0f0]">Upload Image</span>
          <span className="text-[8px] text-gray-300">Preferred formats: PNG, SVG, JPG</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </label>
      </div>

      {/* ACTIVE LOGOS LIST */}
      {imageDecals.length > 0 && (
        <div className="p-5 bg-white border-b border-gray-100">
          <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center justify-between">
            <span>Active Logos</span>
            <span className="text-[8px] bg-gray-100 px-2 py-0.5 rounded text-gray-500">{imageDecals.length}</span>
          </h3>
          <div className="space-y-2">
            {imageDecals.map(d => (
              <div
                key={d.id}
                onClick={() => setSelectedDecalId(d.id)}
                className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between bg-white ${selectedDecalId === d.id ? 'border-[#00b0f0] shadow-md scale-[1.02]' : 'border-gray-100 hover:border-gray-200'}`}
              >
                <div className="flex items-center gap-3">
                  {d.imageUrl && (
                    <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 bg-cover bg-center flex-shrink-0" style={{ backgroundImage: `url(${d.imageUrl})` }} />
                  )}
                  <div className="flex flex-col">
                    <span className="text-xs font-black truncate max-w-[150px]">{d.text || 'Logo'}</span>
                    <span className="text-[8px] font-bold text-gray-400 uppercase">SIZE {((d.decalScale || 0.12) * 100).toFixed(0)}%</span>
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); removeDecal(d.id); }} className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">✕</button>
              </div>
            ))}
          </div>

          {/* Scale control for selected logo */}
          {selected && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[9px] font-black text-gray-400 uppercase">Logo Size</p>
                <span className="text-[10px] font-black text-[#00b0f0]">{((selected.decalScale || 0.12) * 100).toFixed(0)}%</span>
              </div>
              <input type="range" min="0.03" max="0.3" step="0.01" className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00b0f0]" value={selected.decalScale || 0.12} onChange={(e) => safeUpdate({ decalScale: parseFloat(e.target.value) })} />
            </div>
          )}
        </div>
      )}

      {/* LOGO CATEGORIES */}
      <div className="flex-1">
        {logoCategories.map((cat, i) => (
          <div key={cat.name} className="border-b border-gray-100 bg-white">
            <button
              onClick={() => setExpandedCat(expandedCat === i ? null : i)}
              className={`w-full flex items-center justify-between px-5 py-3 transition-colors cursor-pointer hover:bg-gray-50 ${expandedCat === i ? 'bg-gray-50' : ''}`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-base ${expandedCat === i ? 'text-[#00b0f0]' : 'text-gray-400'}`}>{cat.icon}</span>
                <span className={`text-[9px] font-black uppercase tracking-widest ${expandedCat === i ? 'text-[#00b0f0]' : 'text-gray-700'}`}>{cat.name}</span>
              </div>
              <span className={`text-[10px] transition-transform duration-300 ${expandedCat === i ? 'rotate-45 text-[#00b0f0]' : 'text-gray-300'}`}>＋</span>
            </button>
            {expandedCat === i && (
              <div className="p-4 bg-white border-t border-gray-50">
                <div className="grid grid-cols-3 gap-2">
                  {cat.items?.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => addDecal('image', item.name, item.url)}
                      className="aspect-square bg-gray-50 border border-gray-100 rounded-lg p-2 hover:border-[#00b0f0] hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-1 group cursor-pointer"
                    >
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-contain opacity-60 group-hover:opacity-100 transition-opacity"
                        loading="lazy"
                      />
                      <span className="text-[6px] font-black text-gray-400 uppercase truncate w-full text-center group-hover:text-[#00b0f0]">{item.name}</span>
                    </button>
                  ))}
                </div>
                {(!cat.items || cat.items.length === 0) && (
                  <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Library Integration Pending</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── STUDIO CONFIG TAB (NEW) ──────────────────────────────────────────────────
const StudioConfigTab = ({ 
  globalPattern, setGlobalPattern, 
  lightingPreset, setLightingPreset, 
  materialFinish, setMaterialFinish, 
  mouseFollow, setMouseFollow 
}) => {
  const [openSection, setOpenSection] = useState('pattern');

  const renderSection = (id, label, icon, content) => {
    const isOpen = openSection === id;
    return (
      <div className="bg-white border-b border-gray-100">
        <button
          onClick={() => setOpenSection(isOpen ? null : id)}
          className={`w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${isOpen ? 'bg-gray-50' : ''}`}
        >
          <div className="flex items-center gap-3">
            <span className={`text-lg ${isOpen ? 'text-[#00b0f0]' : 'text-gray-400'}`}>{icon}</span>
            <span className={`text-[10px] font-black uppercase tracking-widest ${isOpen ? 'text-[#00b0f0]' : 'text-gray-700'}`}>{label}</span>
          </div>
          <span className={`text-[10px] transition-transform duration-300 ${isOpen ? 'rotate-45 text-[#00b0f0]' : 'text-gray-300'}`}>＋</span>
        </button>
        {isOpen && <div className="p-5 bg-white animate-fade-in">{content}</div>}
      </div>
    );
  };

  return (
    <div className="flex flex-col bg-gray-50 h-full overflow-y-auto right-scroll">
      
      {renderSection('pattern', 'Fabric Patterns', <HiOutlineCube />, (
        <div className="grid grid-cols-2 gap-2">
          {['none', 'carbon', 'camo', 'dots'].map(p => (
            <button 
              key={p} 
              onClick={() => setGlobalPattern(p === 'none' ? null : p)} 
              className={`py-3 rounded-md text-[9px] font-black uppercase tracking-widest border-2 transition-all ${globalPattern === p || (p === 'none' && !globalPattern) ? 'border-[#00b0f0] bg-blue-50 text-[#00b0f0] shadow-sm' : 'border-gray-100 text-gray-400 hover:border-gray-300'}`}
            >
              {p}
            </button>
          ))}
        </div>
      ))}

      {renderSection('finish', 'Material Finish', <HiOutlineColorSwatch />, (
        <div className="grid grid-cols-3 gap-2">
          {['matte', 'gloss', 'metallic'].map(f => (
            <button 
              key={f} 
              onClick={() => setMaterialFinish(f)} 
              className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 transition-all ${materialFinish === f ? 'border-[#00b0f0] bg-blue-50 text-[#00b0f0] shadow-sm' : 'border-gray-100 text-gray-400 hover:border-gray-300'}`}
            >
              {f}
            </button>
          ))}
        </div>
      ))}

      {renderSection('lighting', 'Lighting Rig', <HiOutlineLightningBolt />, (
        <div className="grid grid-cols-3 gap-2">
          {['city', 'studio', 'night'].map(l => (
            <button 
              key={l} 
              onClick={() => setLightingPreset(l)} 
              className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 transition-all ${lightingPreset === l ? 'border-[#00b0f0] bg-blue-50 text-[#00b0f0] shadow-sm' : 'border-gray-100 text-gray-400 hover:border-gray-300'}`}
            >
              {l}
            </button>
          ))}
        </div>
      ))}

      {renderSection('interaction', 'Interaction', <HiOutlineCursorClick />, (
        <div className="space-y-4">
          <button 
            onClick={() => setMouseFollow(!mouseFollow)} 
            className={`w-full py-4 rounded-lg text-[10px] font-black uppercase tracking-widest border-2 transition-all flex items-center justify-center gap-3 ${mouseFollow ? 'bg-[#00b0f0] text-white border-[#00b0f0] shadow-lg shadow-blue-500/20' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'}`}
          >
            <div className={`w-2 h-2 rounded-full ${mouseFollow ? 'bg-white animate-pulse' : 'bg-gray-200'}`} />
            360 Mouse Follow: {mouseFollow ? 'ON' : 'OFF'}
          </button>
          <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest text-center px-4 leading-relaxed">
            When ON, the model will follow your cursor for a dynamic 360 preview experience.
          </p>
        </div>
      ))}

    </div>
  );
};

// ─── ROSTER / CHECKOUT TAB (NEW) ──────────────────────────────────────────────
const CheckoutRosterTab = ({ roster, setRoster }) => {
  const [isPersonalized, setIsPersonalized] = useState(true);

  const addRow = () => {
    setRoster([...roster, { id: Date.now(), name: '', number: '', size: 'L' }]);
  };

  const removeRow = (id) => {
    if (roster.length <= 1) return;
    setRoster(roster.filter(r => r.id !== id));
  };

  const updateRow = (id, field, value) => {
    setRoster(roster.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
      <div className="p-5 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-800">Order Roster</h3>
            <p className="text-[8px] font-bold text-gray-400 uppercase mt-0.5">{roster.length} Total Units</p>
          </div>
          <button 
            onClick={addRow}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#00b0f0] text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-[#0089bb] transition-colors shadow-lg shadow-blue-500/10"
          >
            <HiOutlineUserAdd /> Add Unit
          </button>
        </div>

        {/* Personalization Toggle */}
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${isPersonalized ? 'bg-blue-100 text-[#00b0f0]' : 'bg-gray-200 text-gray-400'}`}>
              <BiText />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-700">Personalization</p>
              <p className="text-[7px] font-bold text-gray-400 uppercase">Names & Numbers</p>
            </div>
          </div>
          <button 
            onClick={() => setIsPersonalized(!isPersonalized)}
            className={`w-10 h-5 rounded-full relative transition-all duration-300 ${isPersonalized ? 'bg-[#00b0f0]' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${isPersonalized ? 'left-6' : 'left-1'}`} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 right-scroll">
        {roster.map((row, index) => (
          <div key={row.id} className="bg-white rounded-lg border border-gray-100 p-3 shadow-sm relative group animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-[9px] font-black text-gray-400 border border-gray-100 flex-shrink-0">
                {index + 1}
              </div>
              
              <div className="flex-1 grid grid-cols-12 gap-2">
                {isPersonalized ? (
                  <>
                    <div className="col-span-6">
                      <label className="text-[7px] font-black uppercase tracking-widest text-gray-400 block mb-1 ml-1">Name</label>
                      <input 
                        type="text" 
                        value={row.name}
                        onChange={(e) => updateRow(row.id, 'name', e.target.value.toUpperCase())}
                        placeholder="PLAYER NAME"
                        className="w-full bg-gray-50 border-none rounded-lg px-2 py-2 text-[10px] font-bold text-gray-700 placeholder:text-gray-300 focus:ring-1 focus:ring-[#00b0f0] transition-all"
                      />
                    </div>
                    
                    <div className="col-span-3">
                      <label className="text-[7px] font-black uppercase tracking-widest text-gray-400 block mb-1 ml-1">No.</label>
                      <input 
                        type="text" 
                        value={row.number}
                        onChange={(e) => updateRow(row.id, 'number', e.target.value)}
                        placeholder="00"
                        maxLength={3}
                        className="w-full bg-gray-50 border-none rounded-lg px-2 py-2 text-[10px] font-bold text-gray-700 text-center placeholder:text-gray-300 focus:ring-1 focus:ring-[#00b0f0] transition-all"
                      />
                    </div>

                    <div className="col-span-3">
                      <label className="text-[7px] font-black uppercase tracking-widest text-gray-400 block mb-1 ml-1">Size</label>
                      <div className="relative">
                        <select 
                          value={row.size}
                          onChange={(e) => updateRow(row.id, 'size', e.target.value)}
                          className="w-full bg-gray-50 border-none rounded-lg px-2 py-2 text-[10px] font-bold text-gray-700 appearance-none focus:ring-1 focus:ring-[#00b0f0] transition-all cursor-pointer"
                        >
                          {['YS', 'YM', 'YL', 'S', 'M', 'L', 'XL', '2XL', '3XL'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <HiOutlineChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[8px]" />
                      </div>
                    </div>
                  </>
                ) : (
                    <div className="col-span-12 flex items-center justify-between bg-gray-50 rounded-md px-4 py-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Unit Size</span>
                    <div className="flex items-center gap-4">
                      <div className="relative min-w-[80px]">
                        <select 
                          value={row.size}
                          onChange={(e) => updateRow(row.id, 'size', e.target.value)}
                          className="w-full bg-transparent border-none py-1 text-[12px] font-black text-[#00b0f0] appearance-none focus:ring-0 cursor-pointer text-right"
                        >
                          {['YS', 'YM', 'YL', 'S', 'M', 'L', 'XL', '2XL', '3XL'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <HiOutlineChevronDown className="absolute -right-2 top-1/2 -translate-y-1/2 text-[#00b0f0] pointer-events-none text-[8px]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={() => removeRow(row.id)}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
              >
                <HiOutlineTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-5 bg-white border-t border-gray-100">
        <button className="w-full bg-[#00b0f0] text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
          Finalize & Checkout
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        </button>
        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest text-center mt-3 opacity-60">
          Review your 3D design before proceeding
        </p>
      </div>
    </div>
  );
};

// ─── MAIN RIGHT PANEL ──────────────────────────────────────────────────────────
const RightPanel = ({
  activeMesh,
  meshStates,
  updateMeshProp,
  decals,
  selectedDecalId,
  setSelectedDecalId,
  addDecal,
  updateDecal,
  removeDecal,
  // Global Props
  globalPattern, setGlobalPattern,
  lightingPreset, setLightingPreset,
  materialFinish, setMaterialFinish,
  mouseFollow, setMouseFollow,
  // Roster Props
  roster, setRoster
}) => {
  const [activeTab, setActiveTab] = useState('colors');

  const mainTabs = [
    { id: 'colors', label: 'Colors / Patterns', icon: <BiPalette /> },
    { id: 'names', label: 'Names / Numbers', icon: <BiText /> },
    { id: 'logos', label: 'Logos / Flags', icon: <BiImage /> },
    { id: 'config', label: 'Studio / Config', icon: <HiOutlineAdjustments /> },
    { id: 'roster', label: 'Checkout / Roster', icon: <BiCart /> },
  ];

  return (
    <div className="flex flex-1 md:flex-none h-full w-full md:w-[420px] flex-shrink-0 border-t md:border-t-0 md:border-l border-gray-200 bg-white flex-col z-50 relative overflow-hidden">

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
              {tab.label.split(' / ').map((s, i) => <span key={i} className="block">{s}</span>)}
            </span>
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00b0f0]" />}
          </button>
        ))}
      </div>

      {/* ── Sub Header ── */}
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
        ) : activeTab === 'names' ? (
          <NamesNumbersTab
            decals={decals}
            selectedDecalId={selectedDecalId}
            setSelectedDecalId={setSelectedDecalId}
            addDecal={addDecal}
            updateDecal={updateDecal}
            removeDecal={removeDecal}
          />
        ) : activeTab === 'logos' ? (
          <LogosFlagsTab
            decals={decals}
            selectedDecalId={selectedDecalId}
            setSelectedDecalId={setSelectedDecalId}
            addDecal={addDecal}
            updateDecal={updateDecal}
            removeDecal={removeDecal}
          />
        ) : activeTab === 'config' ? (
          <StudioConfigTab
            globalPattern={globalPattern} setGlobalPattern={setGlobalPattern}
            lightingPreset={lightingPreset} setLightingPreset={setLightingPreset}
            materialFinish={materialFinish} setMaterialFinish={setMaterialFinish}
            mouseFollow={mouseFollow} setMouseFollow={setMouseFollow}
          />
        ) : (
          <CheckoutRosterTab roster={roster} setRoster={setRoster} />
        )}
      </div>

      {/* ── Bottom Status ── */}
      <div className="px-4 py-2 bg-white border-t border-gray-200 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Connected to 3D Viewport</span>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
