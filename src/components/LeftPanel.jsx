import React from 'react';
import ModelViewer from './ModelViewer';
import { Md360 } from 'react-icons/md';

const LeftPanel = ({ 
  shirtColor, isGradientActive, gradientColor1, gradientColor2, patternUrl, patternColor,
  l2ShirtColor, l2IsGradientActive, l2GradientColor1, l2GradientColor2, l2PatternUrl, l2PatternColor,
  l3ShirtColor, l3IsGradientActive, l3GradientColor1, l3GradientColor2, l3PatternUrl, l3PatternColor,
  l4ShirtColor, l4IsGradientActive, l4GradientColor1, l4GradientColor2, l4PatternUrl, l4PatternColor
}) => {
  return (
    <div className="flex-[6] flex flex-col">
      <div className="font-bold text-base mb-2.5">
        CUSTOM BUILDER (JBST8LS: TACKLE / J-0030)
      </div>
      
      <div className="border border-[#ccc] relative h-[500px] flex flex-col mb-5">
        <button className="absolute top-2.5 right-2.5 bg-[#333] text-white border-none px-3.5 py-1 text-xs cursor-pointer z-10">
          View Back
        </button>
        <div className="absolute bottom-10 left-5 z-10 flex flex-col items-center opacity-50 text-black">
          <Md360 size={40} />
          <span className="text-[10px] font-bold">360 view</span>
        </div>
        
        <ModelViewer 
          shirtColor={shirtColor} 
          isGradientActive={isGradientActive} 
          gradientColor1={gradientColor1} 
          gradientColor2={gradientColor2} 
          patternUrl={patternUrl}
          patternColor={patternColor}
          // Location 2
          l2ShirtColor={l2ShirtColor}
          l2IsGradientActive={l2IsGradientActive}
          l2GradientColor1={l2GradientColor1}
          l2GradientColor2={l2GradientColor2}
          l2PatternUrl={l2PatternUrl}
          l2PatternColor={l2PatternColor}
          // Location 3
          l3ShirtColor={l3ShirtColor}
          l3IsGradientActive={l3IsGradientActive}
          l3GradientColor1={l3GradientColor1}
          l3GradientColor2={l3GradientColor2}
          l3PatternUrl={l3PatternUrl}
          l3PatternColor={l3PatternColor}
          // Location 4
          l4ShirtColor={l4ShirtColor}
          l4IsGradientActive={l4IsGradientActive}
          l4GradientColor1={l4GradientColor1}
          l4GradientColor2={l4GradientColor2}
          l4PatternUrl={l4PatternUrl}
          l4PatternColor={l4PatternColor}
        />
        
        <div className="bg-[#333] text-white text-center p-2.5 font-bold text-sm">
          TACKLE / J-0030
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-1.5">
        <button className="bg-[#1565C0] px-3.5 py-2.5 border-none text-white font-bold cursor-pointer text-center text-sm">SAVE</button>
        <button className="bg-[#90CAF9] px-3.5 py-2.5 border-none text-white font-bold cursor-pointer text-center text-sm">SAVE AS</button>
        <button className="bg-[#1565C0] px-3.5 py-2.5 border-none text-white font-bold cursor-pointer text-center text-sm">SHARE DESIGN</button>
        <button className="bg-[#90CAF9] px-3.5 py-2.5 border-none text-white font-bold cursor-pointer text-center text-sm">MY DESIGNS</button>
        
        <button className="col-span-2 bg-[#1565C0] px-3.5 py-2.5 border-none text-white font-bold cursor-pointer text-center text-sm">DOWNLOAD PDF</button>
        <button className="col-span-2 bg-[#1565C0] px-3.5 py-2.5 border-none text-white font-bold cursor-pointer text-center text-sm">DOWNLOAD ROSTER</button>
      </div>
    </div>
  );
};

export default LeftPanel;
