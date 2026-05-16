import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Builder from './components/Builder';
import { designs } from './data/designs';

function App() {
  const [view, setView] = useState('landing');
  const [selectedDesign, setSelectedDesign] = useState(designs[0]);

  // Color States
  const [primaryColor, setPrimaryColor] = useState('#ffffff');
  const [primaryIsGrad, setPrimaryIsGrad] = useState(false);
  const [primaryColor2, setPrimaryColor2] = useState('#ffffff');

  const [secondaryColor, setSecondaryColor] = useState('#ffffff');
  const [secondaryIsGrad, setSecondaryIsGrad] = useState(false);
  const [secondaryColor2, setSecondaryColor2] = useState('#ffffff');

  const [thirdColor, setThirdColor] = useState('#ffffff');
  const [thirdIsGrad, setThirdIsGrad] = useState(false);
  const [thirdColor2, setThirdColor2] = useState('#ffffff');

  // NEW: Elite Global Config States
  const [globalPattern, setGlobalPattern] = useState(null); // 'carbon', 'camo', 'dots'
  const [lightingPreset, setLightingPreset] = useState('city'); // 'city', 'studio', 'apartment'
  const [materialFinish, setMaterialFinish] = useState('matte'); // 'matte', 'gloss', 'metallic'
  const [mouseFollow, setMouseFollow] = useState(true);

  // Transition logic
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSelectDesign = (design) => {
    setSelectedDesign(design);
    setView('builder');
  };

  useEffect(() => {
    const handleImport = (e) => {
      setSelectedDesign(prev => ({ ...prev, modelUrl: e.detail, isImported: true }));
      setView('builder');
    };
    window.addEventListener('eay:importModel', handleImport);
    return () => window.removeEventListener('eay:importModel', handleImport);
  }, []);

  return (
    <div className="w-screen h-screen bg-white flex flex-col overflow-hidden">
      <Navbar onBack={view === 'builder' ? () => {
        setView('transition');
        setRefreshKey(prev => prev + 1);
        setTimeout(() => setView('landing'), 150);
      } : null} />

      {view === 'landing' ? (
        <LandingPage
          key={`landing-${refreshKey}`}

          // Original States
          primaryColor={primaryColor} setPrimaryColor={setPrimaryColor}
          primaryIsGrad={primaryIsGrad} setPrimaryIsGrad={setPrimaryIsGrad}
          primaryColor2={primaryColor2} setPrimaryColor2={setPrimaryColor2}

          secondaryColor={secondaryColor} setSecondaryColor={setSecondaryColor}
          secondaryIsGrad={secondaryIsGrad} setSecondaryIsGrad={setSecondaryIsGrad}
          secondaryColor2={secondaryColor2} setSecondaryColor2={setSecondaryColor2}

          thirdColor={thirdColor} setThirdColor={setThirdColor}
          thirdIsGrad={thirdIsGrad} setThirdIsGrad={setThirdIsGrad}
          thirdColor2={thirdColor2} setThirdColor2={setThirdColor2}

          onSelectDesign={handleSelectDesign}

          // NEW Elite Configs
          globalPattern={globalPattern} setGlobalPattern={setGlobalPattern}
          lightingPreset={lightingPreset} setLightingPreset={setLightingPreset}
          materialFinish={materialFinish} setMaterialFinish={setMaterialFinish}
          mouseFollow={mouseFollow} setMouseFollow={setMouseFollow}
        />
      ) : view === 'transition' ? (
        <div className="flex-1 flex items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Clearing GPU Context...</span>
          </div>
        </div>
      ) : (
        <Builder
          design={selectedDesign}
          initialColors={{
            primary: { color: primaryColor, isGrad: primaryIsGrad, color2: primaryColor2 },
            secondary: { color: secondaryColor, isGrad: secondaryIsGrad, color2: secondaryColor2 },
            third: { color: thirdColor, isGrad: thirdIsGrad, color2: thirdColor2 }
          }}
          globalPattern={globalPattern} setGlobalPattern={setGlobalPattern}
          lightingPreset={lightingPreset} setLightingPreset={setLightingPreset}
          materialFinish={materialFinish} setMaterialFinish={setMaterialFinish}
          mouseFollow={mouseFollow} setMouseFollow={setMouseFollow}
        />
      )}
    </div>
  );
}

export default App;
