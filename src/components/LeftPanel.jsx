import React from 'react';
import ModelViewer from './ModelViewer';
import { HiOutlineCamera, HiOutlineZoomIn, HiOutlineZoomOut } from 'react-icons/hi';
import { BiCube } from 'react-icons/bi';
import { Md360 } from 'react-icons/md';

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

const Divider = () => <div className="w-full h-px bg-[#e0e0e0] my-1" />;

const LeftPanel = ({ meshes, activeMesh, setActiveMesh, meshStates, onMeshesDetected }) => {
  return (
    <div className="flex-1 flex overflow-hidden">
      {/* ── Dynamic Mesh Toolbar ── */}
      <div className="w-16 flex flex-col items-center bg-[#f5f5f5] border-r border-[#e0e0e0] py-2 flex-shrink-0 overflow-y-auto right-scroll">
        
        <div className="text-[6px] font-black text-[#ccc] tracking-[0.2em] mb-2 uppercase">Meshes</div>
        {meshes.map((name) => (
          <ToolBtn 
            key={name}
            icon={<BiCube />} 
            label={name.replace(/_/g, ' ')} 
            active={activeMesh === name}
            onClick={() => setActiveMesh(name)} 
          />
        ))}

        <Divider />
        
        <div className="text-[6px] font-black text-[#ccc] tracking-[0.2em] my-2 uppercase">View</div>
        <ToolBtn icon={<HiOutlineCamera />} label="Reset" onClick={() => window.dispatchEvent(new CustomEvent('eay:resetCamera'))} />
        <ToolBtn icon={<HiOutlineZoomIn />} label="Zoom In" onClick={() => window.dispatchEvent(new CustomEvent('eay:zoom', { detail: -0.5 }))} />
        <ToolBtn icon={<HiOutlineZoomOut />} label="Zoom Out" onClick={() => window.dispatchEvent(new CustomEvent('eay:zoom', { detail: 0.5 }))} />
      </div>

      {/* ── Viewport ── */}
      <div className="flex-1 relative bg-[#fcfcfc] overflow-hidden">
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-white border border-[#e0e0e0] rounded-lg shadow-sm">
          <div className="w-2 h-2 rounded-full bg-[#00b0f0]" />
          <span className="text-[10px] font-bold text-[#555] tracking-widest uppercase">Parts Detected: {meshes.length}</span>
        </div>

        <ModelViewer meshStates={meshStates} onMeshesDetected={onMeshesDetected} />

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <div className="flex items-center gap-3 px-5 py-2.5 bg-[#1e293b]/90 backdrop-blur rounded-full text-white shadow-2xl">
            <Md360 size={20} className="text-[#00b0f0]" />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">Left Click to Rotate · Scroll to Zoom</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
