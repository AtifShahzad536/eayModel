import React from 'react';
import ModelViewer from './ModelViewer';
import { HiOutlineCamera, HiOutlineZoomIn, HiOutlineZoomOut } from 'react-icons/hi';
import { BiCube } from 'react-icons/bi';

const ToolBtn = ({ icon, label, onClick, active = false }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 w-full py-3 px-1 transition-all cursor-pointer border-l-2 
      ${active ? 'bg-[#00b0f0] border-[#00b0f0] text-white' : 'border-transparent text-[#888] hover:bg-[#e8e8e8] hover:text-[#333]'}`}
  >
    <span className="text-xl">{icon}</span>
    <span className="text-[7px] font-black tracking-widest uppercase truncate w-full text-center px-1">{label}</span>
  </button>
);

const LeftPanel = ({ 
  modelUrl, 
  meshes, 
  activeMesh, 
  setActiveMesh, 
  meshStates, 
  onMeshesDetected,
  decals,
  selectedDecalId,
  setSelectedDecalId,
  updateDecal,
  removeDecal
}) => {
  return (
    <div className="flex-shrink-0 md:flex-1 flex flex-col md:flex-row overflow-hidden h-[45vh] md:h-full relative bg-white">
      {/* ── Dynamic Mesh Toolbar ── */}
      <div className="w-full h-14 md:w-24 md:h-full flex md:flex-col items-center bg-[#f5f5f5] border-b md:border-r border-[#e0e0e0] py-1 md:py-2 flex-shrink-0 overflow-x-auto md:overflow-y-auto right-scroll">
        <div className="hidden md:block text-[6px] font-black text-[#ccc] tracking-[0.2em] mb-2 uppercase">Meshes</div>
        {meshes.map((info) => {
          const isActive = activeMesh === info.id;
          return (
            <button
              key={info.id}
              onClick={() => setActiveMesh(info.id)}
              className={`flex-shrink-0 w-10 h-10 md:w-16 md:h-16 flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-300 mx-1 md:mx-0 md:mb-2 border-2 
                ${isActive ? 'bg-[#00b0f0] border-[#00b0f0] text-white shadow-lg scale-105' : 'bg-white border-[#eee] text-[#888] hover:border-[#00b0f0] hover:text-[#00b0f0]'}`}
            >
              <div className="text-xl md:text-2xl"><BiCube /></div>
              <span className="text-[6px] md:text-[8px] font-black uppercase tracking-tighter truncate w-full px-1">{info.display}</span>
            </button>
          );
        })}

        <div className="hidden md:block w-full h-px bg-[#e0e0e0] my-2" />
        <div className="hidden md:block text-[6px] font-black text-[#ccc] tracking-[0.2em] my-2 uppercase">View</div>
        <ToolBtn icon={<HiOutlineCamera />} label="Reset" onClick={() => window.dispatchEvent(new CustomEvent('eay:resetCamera'))} />
        <ToolBtn icon={<HiOutlineZoomIn />} label="Zoom +" onClick={() => window.dispatchEvent(new CustomEvent('eay:zoom', { detail: -0.5 }))} />
        <ToolBtn icon={<HiOutlineZoomOut />} label="Zoom -" onClick={() => window.dispatchEvent(new CustomEvent('eay:zoom', { detail: 0.5 }))} />
      </div>

      {/* ── 3D Viewport ── */}
      <div className="flex-1 relative bg-white">
        <ModelViewer 
          modelUrl={modelUrl} 
          meshStates={meshStates} 
          onMeshesDetected={onMeshesDetected}
          decals={decals}
          selectedDecalId={selectedDecalId}
          setSelectedDecalId={setSelectedDecalId}
          updateDecal={updateDecal}
          removeDecal={removeDecal}
        />
        
        {/* Helper overlay */}
        <div className="absolute top-4 left-4 pointer-events-none select-none z-10">
          <div className="flex items-center gap-3 p-1.5 bg-white/80 backdrop-blur-md rounded-full border border-black/5 shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00b0f0] animate-pulse" />
            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest pr-2">3D Workspace · {meshes.length} Parts</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
