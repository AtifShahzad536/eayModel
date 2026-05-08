import React, { useState } from 'react';

const RightPanel = ({ 
  shirtColor, setShirtColor, isGradientActive, setIsGradientActive, gradientColor1, setGradientColor1, gradientColor2, setGradientColor2, patternUrl, setPatternUrl, patternColor, setPatternColor,
  l2ShirtColor, setL2ShirtColor, l2IsGradientActive, setL2IsGradientActive, l2GradientColor1, setL2GradientColor1, l2GradientColor2, setL2GradientColor2, l2PatternUrl, setL2PatternUrl, l2PatternColor, setL2PatternColor,
  l3ShirtColor, setL3ShirtColor, l3IsGradientActive, setL3IsGradientActive, l3GradientColor1, setL3GradientColor1, l3GradientColor2, setL3GradientColor2, l3PatternUrl, setL3PatternUrl, l3PatternColor, setL3PatternColor,
  l4ShirtColor, setL4ShirtColor, l4IsGradientActive, setL4IsGradientActive, l4GradientColor1, setL4GradientColor1, l4GradientColor2, setL4GradientColor2, l4PatternUrl, setL4PatternUrl, l4PatternColor, setL4PatternColor
}) => {
  const tabs = ['COLORS / PATTERNS', 'NAMES / NUMBERS', 'LOGOS / FLAGS', 'CHECKOUT / ROSTER'];
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const colors = [
    { hex: '#555555', name: 'GRAPHITE' }, { hex: '#00bcd4', name: 'CYAN' }, { hex: '#8D6E63', name: 'BROWN' }, { hex: '#9e9e9e', name: 'GREY' },
    { hex: '#bcaaa4', name: 'LIGHT BROWN' }, { hex: '#673ab7', name: 'DEEP PURPLE' }, { hex: '#9c27b0', name: 'PURPLE' }, { hex: '#0d47a1', name: 'DARK BLUE' },
    { hex: '#1976d2', name: 'BLUE' }, { hex: '#03a9f4', name: 'LIGHT BLUE' }, { hex: '#4caf50', name: 'GREEN' }, { hex: '#388e3c', name: 'DARK GREEN' },
    { hex: '#2e7d32', name: 'FOREST GREEN' }, { hex: '#009688', name: 'TEAL' }, { hex: '#00796b', name: 'DARK TEAL' }, { hex: '#cddc39', name: 'LIME' },
    { hex: '#8bc34a', name: 'LIGHT GREEN' }, { hex: '#ffeb3b', name: 'OPTIC YELLOW' }, { hex: '#ffc107', name: 'AMBER' }, { hex: '#ff9800', name: 'ORANGE' },
    { hex: '#ff5722', name: 'DEEP ORANGE' }, { hex: '#f44336', name: 'RED' }, { hex: '#d32f2f', name: 'DARK RED' }, { hex: '#c2185b', name: 'PINK' },
    { hex: '#e91e63', name: 'LIGHT PINK' }, { hex: '#f8bbd0', name: 'PALE PINK' }, { hex: '#ffe0b2', name: 'PEACH' }, { hex: '#fff9c4', name: 'PALE YELLOW' },
    { hex: '#d7ccc8', name: 'BEIGE' }, { hex: '#795548', name: 'BROWN' }, { hex: '#5d4037', name: 'DARK BROWN' }, { hex: '#3e2723', name: 'DEEP BROWN' }
  ];

  const getColorName = (hex) => {
    const found = colors.find(c => c.hex.toLowerCase() === hex.toLowerCase());
    return found ? found.name : hex;
  };

  return (
    <div className="flex-[4] flex flex-col border border-[#ccc] rounded-md overflow-hidden">
      <div className="font-bold text-base px-5 py-3.5 border-b border-[#ccc]">JBST8LS</div>
      
      <div className="flex border-b border-[#ccc]">
        {tabs.map((tab, idx) => (
          <div 
            key={tab} 
            className={`flex-1 text-center px-1.5 py-2.5 text-[10px] font-bold cursor-pointer ${idx !== tabs.length - 1 ? 'border-r border-dotted border-[#ccc]' : ''} ${
              activeTab === tab 
                ? (tab.includes('CHECKOUT') ? 'bg-black text-white' : 'text-[#00b0f0] border-b-[3px] border-[#00b0f0]') 
                : (tab.includes('CHECKOUT') ? 'bg-black text-white' : 'text-[#777]')
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      {activeTab === 'COLORS / PATTERNS' && (
        <>
          <div className="flex flex-wrap gap-2 p-5 border-b border-[#eee]">
            {colors.slice(0, 14).map((color, idx) => (
              <div 
                key={idx} 
                className="w-6 h-6 border border-[#ccc] cursor-pointer hover:border-black" 
                style={{ backgroundColor: color.hex }}
                onClick={() => setShirtColor(color.hex)}
                title={color.name}
              ></div>
            ))}
          </div>

          <div className="flex flex-col flex-1 overflow-y-auto p-2.5">
            <AccordionItem title="GRADIENT" isOpen={true}>
              <div className="p-3.5 bg-white border-b border-[#eee]">
                
                {/* Gradient Type Selectors */}
                <div className="flex gap-4 mb-5">
                  <div className="flex flex-col items-center">
                    <div 
                      className={`w-10 h-10 border-2 cursor-pointer mb-1 ${!isGradientActive ? 'border-[#00b0f0]' : 'border-[#ccc]'}`}
                      style={{
                        backgroundImage: 'conic-gradient(#ccc 90deg, #fff 90deg 180deg, #ccc 180deg 270deg, #fff 270deg)',
                        backgroundSize: '10px 10px'
                      }}
                      onClick={() => setIsGradientActive(false)}
                    ></div>
                    <span className="text-[10px] text-[#555]">None</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div 
                      className={`w-10 h-10 border-2 cursor-pointer mb-1 ${isGradientActive ? 'border-[#00b0f0]' : 'border-[#ccc]'}`}
                      style={{ background: 'linear-gradient(to bottom, #000, #fff)' }}
                      onClick={() => setIsGradientActive(true)}
                    ></div>
                    <span className="text-[10px] text-[#555]">Gradient</span>
                  </div>
                </div>

                {isGradientActive && (
                  <>
                    {/* Gradient Color 1 */}
                    <div className="mb-4">
                      <div className="text-[10px] text-[#888] mb-1">Location 1: Gradient Color 1</div>
                      <div className="text-xs font-bold text-[#333] mb-2">{getColorName(gradientColor1)}</div>
                      <div className="flex flex-wrap gap-1">
                        {colors.map((color, idx) => (
                          <div 
                            key={`g1-${idx}`} 
                            className={`w-5 h-5 border cursor-pointer hover:border-black ${gradientColor1 === color.hex ? 'border-2 border-[#00b0f0]' : 'border-[#ccc]'}`} 
                            style={{ backgroundColor: color.hex }}
                            onClick={() => setGradientColor1(color.hex)}
                            title={color.name}
                          ></div>
                        ))}
                      </div>
                    </div>

                    {/* Gradient Color 2 */}
                    <div>
                      <div className="text-[10px] text-[#888] mb-1">Location 1: Gradient Color 2</div>
                      <div className="text-xs font-bold text-[#333] mb-2">{getColorName(gradientColor2)}</div>
                      <div className="flex flex-wrap gap-1">
                        {colors.map((color, idx) => (
                          <div 
                            key={`g2-${idx}`} 
                            className={`w-5 h-5 border cursor-pointer hover:border-black ${gradientColor2 === color.hex ? 'border-2 border-[#00b0f0]' : 'border-[#ccc]'}`} 
                            style={{ backgroundColor: color.hex }}
                            onClick={() => setGradientColor2(color.hex)}
                            title={color.name}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                
              </div>
            </AccordionItem>
            <AccordionItem title="PATTERN" isOpen={true}>
              <div className="p-3.5 bg-white border-b border-[#eee]">
                <div className="text-[10px] text-[#888] mb-2">Location 1: Pattern</div>
                
                <div className="flex gap-4 mb-5 items-center">
                  <div className="flex flex-col items-center">
                    <div 
                      className={`w-10 h-10 border-2 cursor-pointer mb-1 ${!patternUrl ? 'border-[#00b0f0]' : 'border-[#ccc]'}`}
                      style={{
                        backgroundImage: 'conic-gradient(#ccc 90deg, #fff 90deg 180deg, #ccc 180deg 270deg, #fff 270deg)',
                        backgroundSize: '10px 10px'
                      }}
                      onClick={() => setPatternUrl(null)}
                    ></div>
                    <span className="text-[10px] text-[#555]">None</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <label className="w-10 h-10 border-2 border-dashed border-[#888] cursor-pointer mb-1 flex justify-center items-center hover:bg-gray-100">
                      <span className="text-xl text-[#888]">+</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const url = URL.createObjectURL(e.target.files[0]);
                            setPatternUrl(url);
                          }
                        }}
                      />
                    </label>
                    <span className="text-[10px] text-[#555]">Upload</span>
                  </div>
                  
                  {patternUrl && (
                    <div className="flex flex-col items-center">
                      <div 
                        className="w-10 h-10 border-2 border-[#00b0f0] cursor-pointer mb-1 bg-center bg-cover"
                        style={{ backgroundImage: `url(${patternUrl})` }}
                        onClick={() => setPatternUrl(patternUrl)}
                      ></div>
                      <span className="text-[10px] text-[#555]">Custom</span>
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-[#888] mb-1">Location 1: Pattern Color</div>
                <div className="text-xs font-bold text-[#333] mb-2">{getColorName(patternColor)}</div>
                <div className="flex flex-wrap gap-1">
                  {colors.map((color, idx) => (
                    <div 
                      key={`p-${idx}`} 
                      className={`w-5 h-5 border cursor-pointer hover:border-black ${patternColor === color.hex ? 'border-2 border-[#00b0f0]' : 'border-[#ccc]'}`} 
                      style={{ backgroundColor: color.hex }}
                      onClick={() => setPatternColor(color.hex)}
                      title={color.name}
                    ></div>
                  ))}
                </div>
              </div>
            </AccordionItem>
            
            <div className="text-[10px] font-bold text-[#888] pt-3.5 px-1.5 pb-1">LOCATION 2</div>
            <AccordionItem title="FILL">
              <div className="p-3.5 bg-white border-b border-[#eee]">
                <div className="text-[10px] text-[#888] mb-1">Location 2: Fill Color</div>
                <div className="text-xs font-bold text-[#333] mb-2">{getColorName(l2ShirtColor)}</div>
                <div className="flex flex-wrap gap-1">
                  {colors.map((color, idx) => (
                    <div 
                      key={`l2f-${idx}`} 
                      className={`w-5 h-5 border cursor-pointer hover:border-black ${l2ShirtColor === color.hex ? 'border-2 border-[#00b0f0]' : 'border-[#ccc]'}`} 
                      style={{ backgroundColor: color.hex }}
                      onClick={() => {
                        setL2ShirtColor(color.hex);
                        setL2IsGradientActive(false);
                      }}
                      title={color.name}
                    ></div>
                  ))}
                </div>
              </div>
            </AccordionItem>
            <AccordionItem title="GRADIENT">
              <div className="p-3.5 bg-white border-b border-[#eee]">
                <div className="text-[10px] text-[#888] mb-2">Location 2: Gradient</div>
                <div className="flex gap-4 mb-5">
                  <div className="flex flex-col items-center">
                    <div 
                      className={`w-10 h-10 border-2 cursor-pointer mb-1 ${!l2IsGradientActive ? 'border-[#00b0f0]' : 'border-[#ccc]'}`}
                      style={{ backgroundColor: '#fff' }}
                      onClick={() => setL2IsGradientActive(false)}
                    ></div>
                    <span className="text-[10px] text-[#555]">None</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div 
                      className={`w-10 h-10 border-2 cursor-pointer mb-1 ${l2IsGradientActive ? 'border-[#00b0f0]' : 'border-[#ccc]'}`}
                      style={{ backgroundImage: `linear-gradient(to bottom, ${l2GradientColor1}, ${l2GradientColor2})` }}
                      onClick={() => setL2IsGradientActive(true)}
                    ></div>
                    <span className="text-[10px] text-[#555]">Gradient</span>
                  </div>
                </div>

                {l2IsGradientActive && (
                  <>
                    <div className="mb-4">
                      <div className="text-[10px] text-[#888] mb-1">Location 2: Gradient Color 1</div>
                      <div className="text-xs font-bold text-[#333] mb-2">{getColorName(l2GradientColor1)}</div>
                      <div className="flex flex-wrap gap-1">
                        {colors.map((color, idx) => (
                          <div 
                            key={`l2g1-${idx}`} 
                            className={`w-5 h-5 border cursor-pointer hover:border-black ${l2GradientColor1 === color.hex ? 'border-2 border-[#00b0f0]' : 'border-[#ccc]'}`} 
                            style={{ backgroundColor: color.hex }}
                            onClick={() => setL2GradientColor1(color.hex)}
                            title={color.name}
                          ></div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#888] mb-1">Location 2: Gradient Color 2</div>
                      <div className="text-xs font-bold text-[#333] mb-2">{getColorName(l2GradientColor2)}</div>
                      <div className="flex flex-wrap gap-1">
                        {colors.map((color, idx) => (
                          <div 
                            key={`l2g2-${idx}`} 
                            className={`w-5 h-5 border cursor-pointer hover:border-black ${l2GradientColor2 === color.hex ? 'border-2 border-[#00b0f0]' : 'border-[#ccc]'}`} 
                            style={{ backgroundColor: color.hex }}
                            onClick={() => setL2GradientColor2(color.hex)}
                            title={color.name}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </AccordionItem>
            <AccordionItem title="PATTERN">
              <div className="p-3.5 bg-white border-b border-[#eee]">
                <div className="text-[10px] text-[#888] mb-2">Location 2: Pattern</div>
                <div className="flex gap-4 mb-5 items-center">
                  <div className="flex flex-col items-center">
                    <div 
                      className={`w-10 h-10 border-2 cursor-pointer mb-1 ${!l2PatternUrl ? 'border-[#00b0f0]' : 'border-[#ccc]'}`}
                      style={{
                        backgroundImage: 'conic-gradient(#ccc 90deg, #fff 90deg 180deg, #ccc 180deg 270deg, #fff 270deg)',
                        backgroundSize: '10px 10px'
                      }}
                      onClick={() => setL2PatternUrl(null)}
                    ></div>
                    <span className="text-[10px] text-[#555]">None</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <label className="w-10 h-10 border-2 border-dashed border-[#888] cursor-pointer mb-1 flex justify-center items-center hover:bg-gray-100">
                      <span className="text-xl text-[#888]">+</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const url = URL.createObjectURL(e.target.files[0]);
                            setL2PatternUrl(url);
                          }
                        }}
                      />
                    </label>
                    <span className="text-[10px] text-[#555]">Upload</span>
                  </div>
                  {l2PatternUrl && (
                    <div className="flex flex-col items-center">
                      <div 
                        className="w-10 h-10 border-2 border-[#00b0f0] cursor-pointer mb-1 bg-center bg-cover"
                        style={{ backgroundImage: `url(${l2PatternUrl})` }}
                        onClick={() => setL2PatternUrl(l2PatternUrl)}
                      ></div>
                      <span className="text-[10px] text-[#555]">Custom</span>
                    </div>
                  )}
                </div>
                <div className="text-[10px] text-[#888] mb-1">Location 2: Pattern Color</div>
                <div className="text-xs font-bold text-[#333] mb-2">{getColorName(l2PatternColor)}</div>
                <div className="flex flex-wrap gap-1">
                  {colors.map((color, idx) => (
                    <div 
                      key={`l2p-${idx}`} 
                      className={`w-5 h-5 border cursor-pointer hover:border-black ${l2PatternColor === color.hex ? 'border-2 border-[#00b0f0]' : 'border-[#ccc]'}`} 
                      style={{ backgroundColor: color.hex }}
                      onClick={() => setL2PatternColor(color.hex)}
                      title={color.name}
                    ></div>
                  ))}
                </div>
              </div>
            </AccordionItem>
            
            <div className="text-[10px] font-bold text-[#888] pt-3.5 px-1.5 pb-1">LOCATION 3</div>
            <AccordionItem title="FILL">
              <div className="p-3.5 bg-white border-b border-[#eee]">
                <div className="text-[10px] text-[#888] mb-1">Location 3: Fill Color</div>
                <div className="text-xs font-bold text-[#333] mb-2">{getColorName(l3ShirtColor)}</div>
                <div className="flex flex-wrap gap-1">
                  {colors.map((color, idx) => (
                    <div 
                      key={`l3f-${idx}`} 
                      className={`w-5 h-5 border cursor-pointer hover:border-black ${l3ShirtColor === color.hex ? 'border-2 border-[#00b0f0]' : 'border-[#ccc]'}`} 
                      style={{ backgroundColor: color.hex }}
                      onClick={() => {
                        setL3ShirtColor(color.hex);
                        setL3IsGradientActive(false);
                      }}
                      title={color.name}
                    ></div>
                  ))}
                </div>
              </div>
            </AccordionItem>
            <AccordionItem title="GRADIENT">
              <div className="p-3.5 bg-white border-b border-[#eee]">
                <div className="text-[10px] text-[#888] mb-2">Location 3: Gradient</div>
                <div className="flex gap-4 mb-5">
                  <div className="flex flex-col items-center">
                    <div 
                      className={`w-10 h-10 border-2 cursor-pointer mb-1 ${!l3IsGradientActive ? 'border-[#00b0f0]' : 'border-[#ccc]'}`}
                      style={{ backgroundColor: '#fff' }}
                      onClick={() => setL3IsGradientActive(false)}
                    ></div>
                    <span className="text-[10px] text-[#555]">None</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div 
                      className={`w-10 h-10 border-2 cursor-pointer mb-1 ${l3IsGradientActive ? 'border-[#00b0f0]' : 'border-[#ccc]'}`}
                      style={{ backgroundImage: `linear-gradient(to bottom, ${l3GradientColor1}, ${l3GradientColor2})` }}
                      onClick={() => setL3IsGradientActive(true)}
                    ></div>
                    <span className="text-[10px] text-[#555]">Gradient</span>
                  </div>
                </div>

                {l3IsGradientActive && (
                  <>
                    <div className="mb-4">
                      <div className="text-[10px] text-[#888] mb-1">Location 3: Gradient Color 1</div>
                      <div className="text-xs font-bold text-[#333] mb-2">{getColorName(l3GradientColor1)}</div>
                      <div className="flex flex-wrap gap-1">
                        {colors.map((color, idx) => (
                          <div 
                            key={`l3g1-${idx}`} 
                            className={`w-5 h-5 border cursor-pointer hover:border-black ${l3GradientColor1 === color.hex ? 'border-2 border-[#00b0f0]' : 'border-[#ccc]'}`} 
                            style={{ backgroundColor: color.hex }}
                            onClick={() => setL3GradientColor1(color.hex)}
                            title={color.name}
                          ></div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#888] mb-1">Location 3: Gradient Color 2</div>
                      <div className="text-xs font-bold text-[#333] mb-2">{getColorName(l3GradientColor2)}</div>
                      <div className="flex flex-wrap gap-1">
                        {colors.map((color, idx) => (
                          <div 
                            key={`l3g2-${idx}`} 
                            className={`w-5 h-5 border cursor-pointer hover:border-black ${l3GradientColor2 === color.hex ? 'border-2 border-[#00b0f0]' : 'border-[#ccc]'}`} 
                            style={{ backgroundColor: color.hex }}
                            onClick={() => setL3GradientColor2(color.hex)}
                            title={color.name}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </AccordionItem>
            <AccordionItem title="PATTERN">
              <div className="p-3.5 bg-white border-b border-[#eee]">
                <div className="text-[10px] text-[#888] mb-2">Location 3: Pattern</div>
                <div className="flex gap-4 mb-5 items-center">
                  <div className="flex flex-col items-center">
                    <div 
                      className={`w-10 h-10 border-2 cursor-pointer mb-1 ${!l3PatternUrl ? 'border-[#00b0f0]' : 'border-[#ccc]'}`}
                      style={{
                        backgroundImage: 'conic-gradient(#ccc 90deg, #fff 90deg 180deg, #ccc 180deg 270deg, #fff 270deg)',
                        backgroundSize: '10px 10px'
                      }}
                      onClick={() => setL3PatternUrl(null)}
                    ></div>
                    <span className="text-[10px] text-[#555]">None</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <label className="w-10 h-10 border-2 border-dashed border-[#888] cursor-pointer mb-1 flex justify-center items-center hover:bg-gray-100">
                      <span className="text-xl text-[#888]">+</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const url = URL.createObjectURL(e.target.files[0]);
                            setL3PatternUrl(url);
                          }
                        }}
                      />
                    </label>
                    <span className="text-[10px] text-[#555]">Upload</span>
                  </div>
                  {l3PatternUrl && (
                    <div className="flex flex-col items-center">
                      <div 
                        className="w-10 h-10 border-2 border-[#00b0f0] cursor-pointer mb-1 bg-center bg-cover"
                        style={{ backgroundImage: `url(${l3PatternUrl})` }}
                        onClick={() => setL3PatternUrl(l3PatternUrl)}
                      ></div>
                      <span className="text-[10px] text-[#555]">Custom</span>
                    </div>
                  )}
                </div>
                <div className="text-[10px] text-[#888] mb-1">Location 3: Pattern Color</div>
                <div className="text-xs font-bold text-[#333] mb-2">{getColorName(l3PatternColor)}</div>
                <div className="flex flex-wrap gap-1">
                  {colors.map((color, idx) => (
                    <div 
                      key={`l3p-${idx}`} 
                      className={`w-5 h-5 border cursor-pointer hover:border-black ${l3PatternColor === color.hex ? 'border-2 border-[#00b0f0]' : 'border-[#ccc]'}`} 
                      style={{ backgroundColor: color.hex }}
                      onClick={() => setL3PatternColor(color.hex)}
                      title={color.name}
                    ></div>
                  ))}
                </div>
              </div>
            </AccordionItem>
            
            <div className="text-[10px] font-bold text-[#888] pt-3.5 px-1.5 pb-1">LOCATION 4</div>
            <AccordionItem title="FILL">
              <div className="p-3.5 bg-white border-b border-[#eee]">
                <div className="text-[10px] text-[#888] mb-1">Location 4: Fill Color</div>
                <div className="text-xs font-bold text-[#333] mb-2">{getColorName(l4ShirtColor)}</div>
                <div className="flex flex-wrap gap-1">
                  {colors.map((color, idx) => (
                    <div 
                      key={`l4f-${idx}`} 
                      className={`w-5 h-5 border cursor-pointer hover:border-black ${l4ShirtColor === color.hex ? 'border-2 border-[#00b0f0]' : 'border-[#ccc]'}`} 
                      style={{ backgroundColor: color.hex }}
                      onClick={() => {
                        setL4ShirtColor(color.hex);
                        setL4IsGradientActive(false);
                      }}
                      title={color.name}
                    ></div>
                  ))}
                </div>
              </div>
            </AccordionItem>
            <AccordionItem title="GRADIENT">
              <div className="p-3.5 bg-white border-b border-[#eee]">
                <div className="text-[10px] text-[#888] mb-2">Location 4: Gradient</div>
                <div className="flex gap-4 mb-5">
                  <div className="flex flex-col items-center">
                    <div 
                      className={`w-10 h-10 border-2 cursor-pointer mb-1 ${!l4IsGradientActive ? 'border-[#00b0f0]' : 'border-[#ccc]'}`}
                      style={{ backgroundColor: '#fff' }}
                      onClick={() => setL4IsGradientActive(false)}
                    ></div>
                    <span className="text-[10px] text-[#555]">None</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div 
                      className={`w-10 h-10 border-2 cursor-pointer mb-1 ${l4IsGradientActive ? 'border-[#00b0f0]' : 'border-[#ccc]'}`}
                      style={{ backgroundImage: `linear-gradient(to bottom, ${l4GradientColor1}, ${l4GradientColor2})` }}
                      onClick={() => setL4IsGradientActive(true)}
                    ></div>
                    <span className="text-[10px] text-[#555]">Gradient</span>
                  </div>
                </div>

                {l4IsGradientActive && (
                  <>
                    <div className="mb-4">
                      <div className="text-[10px] text-[#888] mb-1">Location 4: Gradient Color 1</div>
                      <div className="text-xs font-bold text-[#333] mb-2">{getColorName(l4GradientColor1)}</div>
                      <div className="flex flex-wrap gap-1">
                        {colors.map((color, idx) => (
                          <div 
                            key={`l4g1-${idx}`} 
                            className={`w-5 h-5 border cursor-pointer hover:border-black ${l4GradientColor1 === color.hex ? 'border-2 border-[#00b0f0]' : 'border-[#ccc]'}`} 
                            style={{ backgroundColor: color.hex }}
                            onClick={() => setL4GradientColor1(color.hex)}
                            title={color.name}
                          ></div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#888] mb-1">Location 4: Gradient Color 2</div>
                      <div className="text-xs font-bold text-[#333] mb-2">{getColorName(l4GradientColor2)}</div>
                      <div className="flex flex-wrap gap-1">
                        {colors.map((color, idx) => (
                          <div 
                            key={`l4g2-${idx}`} 
                            className={`w-5 h-5 border cursor-pointer hover:border-black ${l4GradientColor2 === color.hex ? 'border-2 border-[#00b0f0]' : 'border-[#ccc]'}`} 
                            style={{ backgroundColor: color.hex }}
                            onClick={() => setL4GradientColor2(color.hex)}
                            title={color.name}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </AccordionItem>
            <AccordionItem title="PATTERN">
              <div className="p-3.5 bg-white border-b border-[#eee]">
                <div className="text-[10px] text-[#888] mb-2">Location 4: Pattern</div>
                <div className="flex gap-4 mb-5 items-center">
                  <div className="flex flex-col items-center">
                    <div 
                      className={`w-10 h-10 border-2 cursor-pointer mb-1 ${!l4PatternUrl ? 'border-[#00b0f0]' : 'border-[#ccc]'}`}
                      style={{
                        backgroundImage: 'conic-gradient(#ccc 90deg, #fff 90deg 180deg, #ccc 180deg 270deg, #fff 270deg)',
                        backgroundSize: '10px 10px'
                      }}
                      onClick={() => setL4PatternUrl(null)}
                    ></div>
                    <span className="text-[10px] text-[#555]">None</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <label className="w-10 h-10 border-2 border-dashed border-[#888] cursor-pointer mb-1 flex justify-center items-center hover:bg-gray-100">
                      <span className="text-xl text-[#888]">+</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const url = URL.createObjectURL(e.target.files[0]);
                            setL4PatternUrl(url);
                          }
                        }}
                      />
                    </label>
                    <span className="text-[10px] text-[#555]">Upload</span>
                  </div>
                  {l4PatternUrl && (
                    <div className="flex flex-col items-center">
                      <div 
                        className="w-10 h-10 border-2 border-[#00b0f0] cursor-pointer mb-1 bg-center bg-cover"
                        style={{ backgroundImage: `url(${l4PatternUrl})` }}
                        onClick={() => setL4PatternUrl(l4PatternUrl)}
                      ></div>
                      <span className="text-[10px] text-[#555]">Custom</span>
                    </div>
                  )}
                </div>
                <div className="text-[10px] text-[#888] mb-1">Location 4: Pattern Color</div>
                <div className="text-xs font-bold text-[#333] mb-2">{getColorName(l4PatternColor)}</div>
                <div className="flex flex-wrap gap-1">
                  {colors.map((color, idx) => (
                    <div 
                      key={`l4p-${idx}`} 
                      className={`w-5 h-5 border cursor-pointer hover:border-black ${l4PatternColor === color.hex ? 'border-2 border-[#00b0f0]' : 'border-[#ccc]'}`} 
                      style={{ backgroundColor: color.hex }}
                      onClick={() => setL4PatternColor(color.hex)}
                      title={color.name}
                    ></div>
                  ))}
                </div>
              </div>
            </AccordionItem>
          </div>
        </>
      )}

      {activeTab === 'NAMES / NUMBERS' && (
        <div className="flex flex-col flex-1 overflow-y-auto p-2.5">
          <AccordionItem title="TEAM NAME" isOpen={true}>
            <div className="p-3.5 bg-white border-b border-[#eee]">
              <button className="w-full bg-[#222] text-white p-2.5 border-none rounded-full font-bold cursor-pointer">ADD TEXT</button>
            </div>
          </AccordionItem>
          <AccordionItem title="FONT & COLOR" />
          <AccordionItem title="OUTLINE" />
          <AccordionItem title="OUTLINE 2" />
          <AccordionItem title="EFFECT" />
          <AccordionItem title="TAIL" />
          <AccordionItem title="FRONT NUMBER" />
          <AccordionItem title="PLAYER NAME" />
          <AccordionItem title="BACK NUMBER" />
          <AccordionItem title="RIGHT SLEEVE NUMBER" />
          <AccordionItem title="LEFT SLEEVE NUMBER" />
          <AccordionItem title="ADD TEXT" />
        </div>
      )}

      {activeTab === 'LOGOS / FLAGS' && (
        <div className="flex flex-col flex-1 overflow-y-auto p-2.5">
          <AccordionItem title="ADD LOGO" isOpen={true}>
            <div className="p-3.5 bg-white border-b border-[#eee] text-center">
              <button className="w-full bg-[#888] text-white p-2.5 border-none rounded-md font-bold cursor-pointer mb-1.5">
                ↑ UPLOAD IMAGE
              </button>
              <div className="text-[10px] text-[#888] italic">
                Preferred file formats: .AI, .PDF
              </div>
            </div>
          </AccordionItem>
          <AccordionItem title="TAIL SWEEP" />
          <AccordionItem title="FLAGS & SYMBOLS" />
          <AccordionItem title="SPORT BALLS & ICONS" />
          <AccordionItem title="WOLVES & DOGS" />
          <AccordionItem title="CATS" />
          <AccordionItem title="PEOPLE" />
          <AccordionItem title="BIRDS & THINGS WITH WINGS" />
          <AccordionItem title="BEARS & TUSKS" />
          <AccordionItem title="REPTILES & SEA CREATURES" />
          <AccordionItem title="HORSES & HOOVES" />
          <AccordionItem title="MISC. LOGOS" />
          <AccordionItem title="WATERMARKS" />
        </div>
      )}
    </div>
  );
};

const AccordionItem = ({ title, isOpen = false, children }) => {
  const [open, setOpen] = useState(isOpen);
  return (
    <div className="mb-1">
      <div 
        className="flex justify-between items-center bg-[#e0e0e0] px-3.5 py-3 mb-0 font-bold text-xs text-[#555] cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <span>{title}</span>
        <span className="bg-white rounded-full w-4 h-4 flex justify-center items-center text-sm text-[#999]">{open ? '⊖' : '⊕'}</span>
      </div>
      {open && children && (
        <div>
          {children}
        </div>
      )}
    </div>
  );
};

export default RightPanel;
