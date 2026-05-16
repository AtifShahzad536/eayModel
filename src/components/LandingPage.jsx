import React, { useState } from 'react';
import { colors, designs } from '../data/designs';
import DesignPreview from './DesignPreview';
import { HiArrowRight, HiViewGrid, HiOutlineCube, HiOutlineLightningBolt, HiOutlineColorSwatch, HiOutlineCursorClick, HiOutlineX, HiOutlineViewGrid } from 'react-icons/hi';

const ColorGrid = ({ label, selected, onSelect, isGrad, onToggleGrad, selected2, onSelect2 }) => (
  <div className="flex flex-col gap-4 sm:p-6 p-4 bg-white rounded-none border border-gray-900 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] transition-all group h-full">
    <div className="flex flex-col gap-4 border-b border-gray-100 pb-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-[11px] font-semibold text-gray-900 uppercase tracking-[0.3em]">{label}</h3>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-gray-900" />
          <span className="text-[8px] font-semibold text-gray-400 uppercase tracking-widest">{isGrad ? 'Dual Tone Map' : 'Monochrome Tone'}</span>
        </div>
      </div>
      <div className="flex border border-gray-900 p-0.5 bg-gray-50 rounded-none w-fit">
        <button onClick={() => isGrad && onToggleGrad()} className={`px-4 py-1.5 rounded-none text-[8px] font-semibold uppercase tracking-widest transition-all ${!isGrad ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:text-gray-900'}`}>Solid</button>
        <button onClick={() => !isGrad && onToggleGrad()} className={`px-4 py-1.5 rounded-none text-[8px] font-semibold uppercase tracking-widest transition-all ${isGrad ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:text-gray-900'}`}>Grad</button>
      </div>
    </div>

    <div className="flex flex-col gap-4 sm:p-6 flex-1">
      <div className="relative">
        <div 
          className="h-20 w-full rounded-none border border-gray-900 shadow-inner transition-all duration-500 overflow-hidden relative"
          style={{ background: isGrad ? `linear-gradient(to right, ${selected}, ${selected2})` : selected }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
          <div className="absolute bottom-2 left-3 flex flex-col">
            <span className="text-[7px] font-semibold text-white/60 uppercase tracking-widest">Active Material</span>
            <span className="text-[9px] font-semibold text-white uppercase tracking-widest">{selected.toUpperCase()} {isGrad ? `→ ${selected2.toUpperCase()}` : ''}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HiOutlineColorSwatch className="text-[10px] text-gray-400" />
            <span className="text-[8px] font-semibold text-gray-400 uppercase tracking-widest">{isGrad ? 'Start Color' : 'Core Identity'}</span>
          </div>
          <div className="relative w-6 h-6 rounded-none border border-gray-900 overflow-hidden shadow-sm hover:scale-110 transition-transform">
             <input type="color" value={selected} onChange={(e) => onSelect(e.target.value)} className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer border-none p-0" />
          </div>
        </div>
        <div className="grid grid-cols-8 gap-1.5">
          {colors.slice(0, 24).map((c, i) => (
            <button key={i} onClick={() => onSelect(c.hex)} className={`w-full aspect-square rounded-none border transition-all hover:scale-110 ${selected === c.hex ? 'border-blue-600 scale-105 z-10 shadow-md shadow-blue-500/20' : 'border-transparent'}`} style={{ backgroundColor: c.hex }} />
          ))}
        </div>
      </div>

      {isGrad && (
        <div className="fade-up pt-4 flex flex-col gap-4 border-t border-gray-100 mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HiOutlineColorSwatch className="text-[10px] text-gray-400" />
              <span className="text-[8px] font-semibold text-gray-400 uppercase tracking-widest">Transition End</span>
            </div>
            <div className="relative w-6 h-6 rounded-none border border-gray-900 overflow-hidden shadow-sm hover:scale-110 transition-transform">
               <input type="color" value={selected2} onChange={(e) => onSelect2(e.target.value)} className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer border-none p-0" />
            </div>
          </div>
          <div className="grid grid-cols-8 gap-1.5">
            {colors.slice(0, 24).map((c, i) => (
              <button key={i} onClick={() => onSelect2(c.hex)} className={`w-full aspect-square rounded-none border transition-all hover:scale-110 ${selected2 === c.hex ? 'border-gray-900 scale-105 z-10' : 'border-transparent'}`} style={{ backgroundColor: c.hex }} />
            ))}
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
  return (
    <div className="flex-1 w-full h-full overflow-y-auto bg-white right-scroll font-['Outfit'] select-none">
      <div className="max-w-[1800px] mx-auto px-6 sm:px-12 py-12 sm:py-24">
        
        {/* ── 01. ELITE HERO ── */}
        <div className="flex flex-col mb-32 relative">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-12 h-px bg-blue-600" />
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.5em]">EAY Studio Edition</span>
          </div>
          <h1 className="text-7xl md:text-[10rem] font-black text-gray-900 tracking-tighter leading-[0.8] uppercase flex flex-col">
            The Elite
            <span className="text-blue-600 italic">Configurator</span>
          </h1>
          <div className="mt-12 max-w-xl">
             <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest leading-relaxed">High-fidelity 3D garment visualization for elite athletic organizations. Precision engineering for the digital athlete.</p>
          </div>
        </div>

        {/* ── 02. GLOBAL ENVIRONMENT CONTROLS ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-24">
          <div className="p-6 bg-gray-50 border border-gray-100 flex flex-col gap-4">
             <span className="text-[8px] font-semibold text-gray-300 uppercase tracking-widest">01 / Environment</span>
             <h4 className="text-[10px] font-semibold text-gray-900 uppercase tracking-widest">Fabric Pattern</h4>
             <div className="flex flex-wrap gap-1.5">
                {['none', 'carbon', 'camo', 'dots'].map(p => (
                  <button key={p} onClick={() => setGlobalPattern(p === 'none' ? null : p)} className={`px-4 py-2 text-[9px] font-semibold uppercase tracking-widest border transition-all ${globalPattern === p || (p === 'none' && !globalPattern) ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-900'}`}>{p}</button>
                ))}
             </div>
          </div>
          <div className="col-span-1 md:col-span-2 p-6 bg-gray-50 border border-gray-100 grid grid-cols-2 gap-8">
             <div className="flex flex-col gap-4">
                <span className="text-[8px] font-semibold text-gray-300 uppercase tracking-widest">02 / Material Palette</span>
                <h4 className="text-[10px] font-semibold text-gray-900 uppercase tracking-widest">Identity</h4>
                <div className="flex gap-2">
                   <div className="w-10 h-10 border border-gray-900" style={{ backgroundColor: primaryColor }} />
                   <div className="w-10 h-10 border border-gray-900" style={{ backgroundColor: secondaryColor }} />
                   <div className="w-10 h-10 border border-gray-900" style={{ backgroundColor: thirdColor }} />
                </div>
             </div>
             <div className="flex flex-col gap-4">
                <span className="text-[8px] font-semibold text-gray-300 uppercase tracking-widest">03 / Studio Rig</span>
                <h4 className="text-[10px] font-semibold text-gray-900 uppercase tracking-widest">Technical Finish</h4>
                <div className="flex flex-wrap gap-1.5">
                   {['matte', 'gloss', 'metallic'].map(f => (
                     <button key={f} onClick={() => setMaterialFinish(f)} className={`px-4 py-2 text-[9px] font-semibold uppercase tracking-widest border transition-all ${materialFinish === f ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-900'}`}>{f}</button>
                   ))}
                </div>
             </div>
          </div>
          <div className="p-6 bg-gray-50 border border-gray-100 flex flex-col gap-4">
             <span className="text-[8px] font-semibold text-gray-300 uppercase tracking-widest">04 / Viewport</span>
             <h4 className="text-[10px] font-semibold text-gray-900 uppercase tracking-widest">Ray Tracing</h4>
             <button onClick={() => setMouseFollow(!mouseFollow)} className={`w-full py-2 text-[9px] font-semibold uppercase tracking-widest border transition-all ${mouseFollow ? 'bg-gray-900 text-white' : 'bg-white text-gray-400 border-gray-100'}`}>
                Interactive View: {mouseFollow ? 'ACTIVE' : 'FIXED'}
             </button>
          </div>
        </div>

        {/* ── 03. MATERIAL CONFIGURATION ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-48">
          <ColorGrid label="Primary Layer" selected={primaryColor} onSelect={setPrimaryColor} isGrad={primaryIsGrad} onToggleGrad={() => setPrimaryIsGrad(!primaryIsGrad)} selected2={primaryColor2} onSelect2={setPrimaryColor2} />
          <ColorGrid label="Secondary Layer" selected={secondaryColor} onSelect={setSecondaryColor} isGrad={secondaryIsGrad} onToggleGrad={() => setSecondaryIsGrad(!secondaryIsGrad)} selected2={secondaryColor2} onSelect2={setSecondaryColor2} />
          <ColorGrid label="Technical Accents" selected={thirdColor} onSelect={setThirdColor} isGrad={thirdIsGrad} onToggleGrad={() => setThirdIsGrad(!thirdIsGrad)} selected2={thirdColor2} onSelect2={setThirdColor2} />
        </div>

        {/* ── 04. COMPONENT LIBRARY ── */}
        <div className="flex flex-col gap-20">
          <div className="flex items-center justify-between border-b border-gray-100 pb-8">
            <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Asset Library</h2>
            <div className="flex items-center gap-4 text-gray-300">
               <span className="text-[10px] font-semibold uppercase tracking-widest">Source: High Fidelity .glb</span>
               <div className="w-px h-4 bg-gray-100" />
               <HiOutlineViewGrid className="text-xl" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
            {designs.map((design) => (
              <div key={design.id} className="group flex flex-col gap-6 cursor-pointer" onClick={() => onSelectDesign(design)}>
                <div className="aspect-[4/5] relative bg-gray-50 border border-gray-100 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.02)] transition-all duration-700 group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] group-hover:-translate-y-2">
                  <DesignPreview 
                    modelUrl={design.modelUrl} mapping={design.mapping} 
                    primaryColor={primaryColor} primaryIsGrad={primaryIsGrad} primaryColor2={primaryColor2}
                    secondaryColor={secondaryColor} secondaryIsGrad={secondaryIsGrad} secondaryColor2={secondaryColor2}
                    thirdColor={thirdColor} thirdIsGrad={thirdIsGrad} thirdColor2={thirdColor2}
                    pattern={globalPattern} lighting={lightingPreset} finish={materialFinish} mouseFollow={mouseFollow}
                  />
                  <div className="absolute inset-0 bg-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <div className="flex items-center gap-2.5 bg-white text-gray-900 px-6 py-2.5 rounded-none shadow-xl font-semibold text-[9px] uppercase tracking-[0.2em] border border-gray-900 group-hover:bg-gray-900 group-hover:text-white transition-all duration-300">
                      Customize <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1 px-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[15px] font-bold text-gray-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{design.name.split(' / ')[0]}</h3>
                    <div className="w-1.5 h-1.5 rounded-none bg-gray-200 group-hover:bg-blue-600 transition-colors" />
                  </div>
                  <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-[0.2em]">{design.name.split(' / ')[1]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 05. STUDIO FOOTER ── */}
        <div className="mt-48 pt-20 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-12 text-gray-300">
          <div className="flex items-center gap-12">
            <div className="flex flex-col gap-1.5"><span className="text-[8px] font-semibold uppercase tracking-widest">Engine</span><span className="text-[11px] font-bold text-gray-400 uppercase">GPU Matrix v5.0</span></div>
            <div className="flex flex-col gap-1.5"><span className="text-[8px] font-semibold uppercase tracking-widest">Render</span><span className="text-[11px] font-bold text-gray-400 uppercase">Hyper Fidelity</span></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-none bg-gray-900 animate-pulse" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.5em]">EAY Studio — PRO EDITION</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
