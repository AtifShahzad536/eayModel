import React, { useState } from 'react';
import { colors, designs } from '../data/designs';
import DesignPreview from './DesignPreview';
import { HiArrowRight, HiViewGrid, HiOutlineCube, HiOutlineLightningBolt, HiOutlineColorSwatch, HiOutlineCursorClick, HiOutlineX } from 'react-icons/hi';
import { VscSymbolColor } from 'react-icons/vsc';

const ColorGrid = ({ label, selected, onSelect, isGrad, onToggleGrad, selected2, onSelect2 }) => (
  <div className="flex flex-col gap-6">
    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
      <div className="flex items-center gap-3">
        <VscSymbolColor className="text-gray-900 text-lg" />
        <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.3em]">{label}</h3>
      </div>
      <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
        <button onClick={() => isGrad && onToggleGrad()} className={`px-3 py-1 rounded-md text-[8px] font-black uppercase tracking-widest transition-all ${!isGrad ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}>Solid</button>
        <button onClick={() => !isGrad && onToggleGrad()} className={`px-3 py-1 rounded-md text-[8px] font-black uppercase tracking-widest transition-all ${isGrad ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}>Gradient</button>
      </div>
    </div>
    <div className="flex flex-col gap-8 py-2">
      <div>
        <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span>Primary Tone</span>
          <div className="h-px flex-1 bg-gray-50" />
        </div>
        <div className="grid grid-cols-10 gap-2">
          {colors.slice(0, 30).map((c, i) => (
            <button key={i} onClick={() => onSelect(c.hex)} className={`w-full aspect-square rounded-lg border-2 transition-all duration-300 hover:scale-110 ${selected === c.hex ? 'border-gray-900 shadow-lg scale-105' : 'border-transparent'}`} style={{ backgroundColor: c.hex }} title={c.name} />
          ))}
        </div>
      </div>
      {isGrad && (
        <div className="fade-up pt-4">
          <div className="text-[8px] font-bold text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span>Transition Tone</span>
            <div className="h-px flex-1 bg-blue-50" />
          </div>
          <div className="grid grid-cols-10 gap-2">
            {colors.slice(0, 30).map((c, i) => (
              <button key={i} onClick={() => onSelect2(c.hex)} className={`w-full aspect-square rounded-lg border-2 transition-all duration-300 hover:scale-110 ${selected2 === c.hex ? 'border-blue-500 shadow-lg scale-105' : 'border-transparent'}`} style={{ backgroundColor: c.hex }} title={c.name} />
            ))}
          </div>
          <div className="mt-6 p-1.5 bg-gray-50 rounded-xl border border-gray-100">
            <div className="h-8 w-full rounded-lg shadow-inner" style={{ background: `linear-gradient(to right, ${selected}, ${selected2})` }} />
          </div>
        </div>
      )}
    </div>
  </div>
);

const LandingPage = ({ 
  primaryColor, setPrimaryColor, primaryIsGrad, setPrimaryIsGrad, primaryColor2, setPrimaryColor2,
  secondaryColor, setSecondaryColor, secondaryIsGrad, setSecondaryIsGrad, secondaryColor2, setSecondaryColor2,
  thirdColor, setThirdColor, thirdIsGrad, setThirdIsGrad, thirdColor2, setThirdColor2,
  onSelectDesign,
  globalPattern, setGlobalPattern, lightingPreset, setLightingPreset, materialFinish, setMaterialFinish, mouseFollow, setMouseFollow
}) => {
  const [comparing, setComparing] = useState([]); // Array of design IDs

  const themes = [
    { name: 'STEALTH', p: '#1a1a1a', s: '#333333', t: '#00b0f0' },
    { name: 'VOLCANIC', p: '#ff4d00', s: '#000000', t: '#ffd700' },
    { name: 'OCEANIC', p: '#0047ab', s: '#00ffff', t: '#ffffff' },
    { name: 'ROYALTY', p: '#800080', s: '#ffd700', t: '#ffffff' },
  ];

  const applyTheme = (theme) => {
    setPrimaryColor(theme.p); setPrimaryIsGrad(false);
    setSecondaryColor(theme.s); setSecondaryIsGrad(false);
    setThirdColor(theme.t); setThirdIsGrad(false);
  };

  const toggleCompare = (id) => {
    setComparing(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id].slice(-2));
  };

  return (
    <div className="flex-1 w-full h-full overflow-y-auto bg-white right-scroll font-['Outfit']">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;400;900&family=Playfair+Display:ital,wght@1,900&display=swap');
        .serif-italic { font-family: 'Playfair Display', serif; font-style: italic; }
      `}} />

      <div className="max-w-[1600px] mx-auto px-8 py-20 relative">
        
        {/* ── High-End Hero ── */}
        <div className="flex flex-col mb-24">
          <div className="flex items-center gap-6 mb-12">
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-900 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">EAY SPORTS</span>
            </div>
            <div className="h-px w-12 bg-gray-100" />
            <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.5em]">PRO STUDIO EDITION</span>
          </div>
          <div className="relative">
            <h1 className="text-8xl md:text-[9.5rem] font-black text-gray-900 tracking-tighter leading-[0.75] mb-8 uppercase">
              The <span className="serif-italic text-blue-600 normal-case lowercase tracking-normal px-2">Elite</span> <br />
              Studio
            </h1>
          </div>
        </div>

        {/* ── MASTER CONTROL PANEL (New Section) ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20 p-8 bg-gray-50/50 rounded-[2rem] border border-gray-100">
          
          {/* Fabric Patterns */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-900 uppercase tracking-widest">
              <HiOutlineCube className="text-blue-500" /> Fabric Patterns
            </div>
            <div className="flex flex-wrap gap-2">
              {['none', 'carbon', 'camo', 'dots'].map(p => (
                <button key={p} onClick={() => setGlobalPattern(p === 'none' ? null : p)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${globalPattern === p || (p === 'none' && !globalPattern) ? 'bg-gray-900 text-white border-gray-900 shadow-lg' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-900'}`}>{p}</button>
              ))}
            </div>
          </div>

          {/* Material Finish */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-900 uppercase tracking-widest">
              <HiOutlineColorSwatch className="text-blue-500" /> Material Finish
            </div>
            <div className="flex flex-wrap gap-2">
              {['matte', 'gloss', 'metallic'].map(f => (
                <button key={f} onClick={() => setMaterialFinish(f)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${materialFinish === f ? 'bg-gray-900 text-white border-gray-900 shadow-lg' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-900'}`}>{f}</button>
              ))}
            </div>
          </div>

          {/* Lighting Environment */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-900 uppercase tracking-widest">
              <HiOutlineLightningBolt className="text-blue-500" /> Lighting Rig
            </div>
            <div className="flex flex-wrap gap-2">
              {['city', 'studio', 'night'].map(l => (
                <button key={l} onClick={() => setLightingPreset(l)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${lightingPreset === l ? 'bg-gray-900 text-white border-gray-900 shadow-lg' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-900'}`}>{l}</button>
              ))}
            </div>
          </div>

          {/* Interaction Mode */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-900 uppercase tracking-widest">
              <HiOutlineCursorClick className="text-blue-500" /> Interaction
            </div>
            <button onClick={() => setMouseFollow(!mouseFollow)} className={`w-full py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${mouseFollow ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' : 'bg-white text-gray-400 border-gray-200'}`}>
              360 Mouse Follow: {mouseFollow ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* ── Theme Presets ── */}
        <div className="flex items-center gap-4 mb-20 overflow-x-auto pb-4 scrollbar-hide">
          <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] whitespace-nowrap mr-6">Designer Presets:</span>
          {themes.map(t => (
            <button key={t.name} onClick={() => applyTheme(t)} className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-100 rounded-2xl hover:border-blue-500 transition-all group shrink-0 shadow-sm hover:shadow-md">
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full border border-gray-100" style={{ backgroundColor: t.p }} />
                <div className="w-3 h-3 rounded-full border border-gray-100" style={{ backgroundColor: t.s }} />
              </div>
              <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest group-hover:text-blue-600">{t.name}</span>
            </button>
          ))}
        </div>

        {/* ── Color Configuration ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-40">
          <ColorGrid label="Base Identity" selected={primaryColor} onSelect={setPrimaryColor} isGrad={primaryIsGrad} onToggleGrad={() => setPrimaryIsGrad(!primaryIsGrad)} selected2={primaryColor2} onSelect2={setPrimaryColor2} />
          <ColorGrid label="Secondary Accent" selected={secondaryColor} onSelect={setSecondaryColor} isGrad={secondaryIsGrad} onToggleGrad={() => setSecondaryIsGrad(!secondaryIsGrad)} selected2={secondaryColor2} onSelect2={setSecondaryColor2} />
          <ColorGrid label="Technical Detail" selected={thirdColor} onSelect={setThirdColor} isGrad={thirdIsGrad} onToggleGrad={() => setThirdIsGrad(!thirdIsGrad)} selected2={thirdColor2} onSelect2={setThirdColor2} />
        </div>

        {/* ── Gallery with Compare Mode ── */}
        <div>
          <div className="flex items-center justify-between mb-20">
            <div className="flex items-center gap-6">
              <HiViewGrid className="text-2xl text-gray-900" />
              <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Elite Gallery</h2>
            </div>
            {comparing.length > 0 && (
              <div className="flex items-center gap-4 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 animate-fade-in">
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Compare Mode ({comparing.length}/2)</span>
                <button onClick={() => setComparing([])} className="text-blue-400 hover:text-blue-600"><HiOutlineX /></button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-16">
            {designs.map((design, idx) => (
              <div key={design.id} className={`group cursor-pointer transition-all duration-500 ${comparing.includes(design.id) ? 'scale-105' : ''}`}>
                <div 
                  className={`aspect-[3.5/5] relative bg-[#fcfcfc] rounded-2xl border-2 transition-all duration-500 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.02)] group-hover:shadow-[0_30px_70px_rgba(0,0,0,0.08)] group-hover:-translate-y-2 ${comparing.includes(design.id) ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-gray-100 hover:border-blue-500'}`}
                  onClick={() => onSelectDesign(design)}
                >
                  <DesignPreview 
                    modelUrl={design.modelUrl} mapping={design.mapping} 
                    primaryColor={primaryColor} primaryIsGrad={primaryIsGrad} primaryColor2={primaryColor2}
                    secondaryColor={secondaryColor} secondaryIsGrad={secondaryIsGrad} secondaryColor2={secondaryColor2}
                    thirdColor={thirdColor} thirdIsGrad={thirdIsGrad} thirdColor2={thirdColor2}
                    pattern={globalPattern} lighting={lightingPreset} finish={materialFinish} mouseFollow={mouseFollow}
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-2 py-1 bg-white/80 backdrop-blur-md rounded-lg text-[8px] font-black text-gray-400 border border-gray-100 uppercase tracking-widest">{design.id}</span>
                  </div>
                  
                  {/* Compare Action */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleCompare(design.id); }}
                    className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${comparing.includes(design.id) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white/50 border-white/20 text-gray-900 opacity-0 group-hover:opacity-100'}`}
                  >
                    <HiViewGrid className="text-xs" />
                  </button>

                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <div className="flex items-center gap-3 bg-gray-900 text-white px-6 py-2.5 rounded-full shadow-2xl">
                      <span className="text-[9px] font-black uppercase tracking-widest">Customize</span>
                      <HiArrowRight className="text-xs" />
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex flex-col gap-1 px-1" onClick={() => onSelectDesign(design)}>
                  <h3 className="text-[14px] font-black text-gray-900 uppercase tracking-tighter group-hover:text-blue-600 transition-colors">{design.name.split(' / ')[0]}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-medium text-gray-400 uppercase tracking-[0.2em]">{design.name.split(' / ')[1]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Minimalist Footer ── */}
        <div className="mt-40 pt-16 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-10">
            <div className="flex flex-col gap-1"><span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Engine</span><span className="text-[11px] font-bold text-gray-900 uppercase">GPU Matrix v4.0</span></div>
            <div className="flex flex-col gap-1"><span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Render</span><span className="text-[11px] font-bold text-gray-900 uppercase">High Fidelity</span></div>
          </div>
          <div className="text-[10px] font-black text-gray-200 uppercase tracking-[0.5em]">EAY Studio — PRO EDITION</div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
