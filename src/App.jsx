import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';

function App() {
  const [shirtColor, setShirtColor] = useState('#ffffff');
  const [isGradientActive, setIsGradientActive] = useState(false);
  const [gradientColor1, setGradientColor1] = useState('#555555'); // Graphite
  const [gradientColor2, setGradientColor2] = useState('#FFEB3B'); // Optic Yellow
  
  const [patternUrl, setPatternUrl] = useState(null);
  const [patternColor, setPatternColor] = useState('#FFEB3B');

  // Location 2 (Sleeves)
  const [l2ShirtColor, setL2ShirtColor] = useState('#ffffff');
  const [l2IsGradientActive, setL2IsGradientActive] = useState(false);
  const [l2GradientColor1, setL2GradientColor1] = useState('#555555');
  const [l2GradientColor2, setL2GradientColor2] = useState('#FFEB3B');
  const [l2PatternUrl, setL2PatternUrl] = useState(null);
  const [l2PatternColor, setL2PatternColor] = useState('#FFEB3B');

  // Location 3 (Collar)
  const [l3ShirtColor, setL3ShirtColor] = useState('#ffffff');
  const [l3IsGradientActive, setL3IsGradientActive] = useState(false);
  const [l3GradientColor1, setL3GradientColor1] = useState('#555555');
  const [l3GradientColor2, setL3GradientColor2] = useState('#FFEB3B');
  const [l3PatternUrl, setL3PatternUrl] = useState(null);
  const [l3PatternColor, setL3PatternColor] = useState('#FFEB3B');

  // Location 4 (Shoulders)
  const [l4ShirtColor, setL4ShirtColor] = useState('#ffffff');
  const [l4IsGradientActive, setL4IsGradientActive] = useState(false);
  const [l4GradientColor1, setL4GradientColor1] = useState('#555555');
  const [l4GradientColor2, setL4GradientColor2] = useState('#FFEB3B');
  const [l4PatternUrl, setL4PatternUrl] = useState(null);
  const [l4PatternColor, setL4PatternColor] = useState('#FFEB3B');

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <Navbar />
      <div className="flex gap-[30px] px-5">
        <LeftPanel 
          shirtColor={shirtColor} 
          isGradientActive={isGradientActive} 
          gradientColor1={gradientColor1} 
          gradientColor2={gradientColor2} 
          patternUrl={patternUrl}
          patternColor={patternColor}
          // Pass Location 2 to LeftPanel
          l2ShirtColor={l2ShirtColor}
          l2IsGradientActive={l2IsGradientActive}
          l2GradientColor1={l2GradientColor1}
          l2GradientColor2={l2GradientColor2}
          l2PatternUrl={l2PatternUrl}
          l2PatternColor={l2PatternColor}
          // Pass Location 3
          l3ShirtColor={l3ShirtColor}
          l3IsGradientActive={l3IsGradientActive}
          l3GradientColor1={l3GradientColor1}
          l3GradientColor2={l3GradientColor2}
          l3PatternUrl={l3PatternUrl}
          l3PatternColor={l3PatternColor}
          // Pass Location 4
          l4ShirtColor={l4ShirtColor}
          l4IsGradientActive={l4IsGradientActive}
          l4GradientColor1={l4GradientColor1}
          l4GradientColor2={l4GradientColor2}
          l4PatternUrl={l4PatternUrl}
          l4PatternColor={l4PatternColor}
        />
        <RightPanel 
          shirtColor={shirtColor}
          setShirtColor={setShirtColor} 
          isGradientActive={isGradientActive} 
          setIsGradientActive={setIsGradientActive} 
          gradientColor1={gradientColor1} 
          setGradientColor1={setGradientColor1}
          gradientColor2={gradientColor2} 
          setGradientColor2={setGradientColor2}
          patternUrl={patternUrl}
          setPatternUrl={setPatternUrl}
          patternColor={patternColor}
          setPatternColor={setPatternColor}
          // Pass Location 2 to RightPanel
          l2ShirtColor={l2ShirtColor}
          setL2ShirtColor={setL2ShirtColor}
          l2IsGradientActive={l2IsGradientActive}
          setL2IsGradientActive={setL2IsGradientActive}
          l2GradientColor1={l2GradientColor1}
          setL2GradientColor1={setL2GradientColor1}
          l2GradientColor2={l2GradientColor2}
          setL2GradientColor2={setL2GradientColor2}
          l2PatternUrl={l2PatternUrl}
          setL2PatternUrl={setL2PatternUrl}
          l2PatternColor={l2PatternColor}
          setL2PatternColor={setL2PatternColor}
          // Pass Location 3
          l3ShirtColor={l3ShirtColor}
          setL3ShirtColor={setL3ShirtColor}
          l3IsGradientActive={l3IsGradientActive}
          setL3IsGradientActive={setL3IsGradientActive}
          l3GradientColor1={l3GradientColor1}
          setL3GradientColor1={setL3GradientColor1}
          l3GradientColor2={l3GradientColor2}
          setL3GradientColor2={setL3GradientColor2}
          l3PatternUrl={l3PatternUrl}
          setL3PatternUrl={setL3PatternUrl}
          l3PatternColor={l3PatternColor}
          setL3PatternColor={setL3PatternColor}
          // Pass Location 4
          l4ShirtColor={l4ShirtColor}
          setL4ShirtColor={setL4ShirtColor}
          l4IsGradientActive={l4IsGradientActive}
          setL4IsGradientActive={setL4IsGradientActive}
          l4GradientColor1={l4GradientColor1}
          setL4GradientColor1={setL4GradientColor1}
          l4GradientColor2={l4GradientColor2}
          setL4GradientColor2={setL4GradientColor2}
          l4PatternUrl={l4PatternUrl}
          setL4PatternUrl={setL4PatternUrl}
          l4PatternColor={l4PatternColor}
          setL4PatternColor={setL4PatternColor}
        />
      </div>
    </div>
  );
}

export default App;
