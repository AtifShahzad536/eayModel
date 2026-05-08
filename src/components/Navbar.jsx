import React, { useState, useRef, useEffect } from 'react';
import { HiOutlineFolderOpen, HiOutlineSaveAs, HiOutlineDownload, HiOutlineCubeTransparent } from 'react-icons/hi';
import { VscHistory, VscEdit } from 'react-icons/vsc';

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const barRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (barRef.current && !barRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const menuData = [
    {
      label: 'File',
      icon: <HiOutlineFolderOpen className="text-lg" />,
      items: [
        { label: 'Import Model (.glb)', icon: <HiOutlineCubeTransparent />, action: () => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.glb,.gltf';
          input.click();
        }},
        { label: 'Save Design', icon: <HiOutlineSaveAs />, action: () => window.dispatchEvent(new CustomEvent('eay:save')) },
        { label: 'Export PNG', icon: <HiOutlineDownload />, action: () => window.dispatchEvent(new CustomEvent('eay:export')) },
      ]
    },
    {
      label: 'Edit',
      icon: <VscEdit className="text-lg" />,
      items: [
        { label: 'Reset All Colors', icon: <VscHistory />, action: () => window.dispatchEvent(new CustomEvent('eay:resetAll')) },
      ]
    }
  ];

  return (
    <div
      ref={barRef}
      className="w-full h-8 bg-[#f5f5f5] border-b border-[#e0e0e0] flex items-stretch select-none z-50 flex-shrink-0"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* App Branding */}
      <div className="flex items-center px-4 gap-2 border-r border-[#e0e0e0]">
        <div className="w-4 h-4 bg-[#00b0f0] rounded-sm flex items-center justify-center">
          <span className="text-white font-black text-[9px] leading-none">E</span>
        </div>
        <span className="text-[11px] font-bold text-[#222] tracking-tight">EAY Builder</span>
      </div>

      {/* Menus */}
      {menuData.map((menu) => (
        <div key={menu.label} className="relative flex items-stretch">
          <button
            className={`px-3.5 h-full text-[12px] font-medium tracking-tight flex items-center gap-2 transition-colors duration-100 outline-none
              ${activeMenu === menu.label ? 'bg-[#00b0f0] text-white' : 'text-[#333] hover:bg-[#e8e8e8]'}`}
            onMouseDown={() => setActiveMenu(prev => prev === menu.label ? null : menu.label)}
            onMouseEnter={() => activeMenu && setActiveMenu(menu.label)}
          >
            {menu.label}
          </button>

          {activeMenu === menu.label && (
            <div className="absolute top-full left-0 mt-0 w-56 bg-white border border-[#e0e0e0] rounded-b-lg shadow-xl z-50 py-1 fade-up">
              {menu.items.map((item, i) => (
                <button
                  key={i}
                  onClick={() => { item.action(); setActiveMenu(null); }}
                  className="w-full text-left px-4 py-2 text-[12px] text-[#333] hover:bg-[#f0f9ff] hover:text-[#00b0f0] flex items-center gap-3 transition-colors duration-100"
                >
                  <span className="text-base text-[#888]">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="ml-auto flex items-center gap-3 px-4 border-l border-[#e0e0e0]">
        <span className="text-[10px] text-[#aaa] font-medium uppercase tracking-widest">v1.0.4 · Stable</span>
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
      </div>
    </div>
  );
};

export default Navbar;
