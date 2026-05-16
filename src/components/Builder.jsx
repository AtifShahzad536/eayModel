import React, { useState, useEffect } from 'react';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';

const Builder = ({ 
  design, initialColors, 
  globalPattern, setGlobalPattern,
  lightingPreset, setLightingPreset,
  materialFinish, setMaterialFinish,
  mouseFollow, setMouseFollow
}) => {
  const [meshes, setMeshes] = useState([]);
  const [activeMesh, setActiveMesh] = useState(null);
  const [meshStates, setMeshStates] = useState({});
  const [decals, setDecals] = useState([]);
  const [selectedDecalId, setSelectedDecalId] = useState(null);
  const [roster, setRoster] = useState([{ id: Date.now(), name: '', number: '', size: 'L' }]);
  const [isHUDVisible, setIsHUDVisible] = useState(true);

  // Reset state when model changes (e.g. on new import)
  useEffect(() => {
    setMeshStates({});
    setDecals([]);
    setSelectedDecalId(null);
  }, [design.modelUrl]);

  // Handle Navbar Events
  useEffect(() => {
    const handleToggleHUD = () => setIsHUDVisible(prev => !prev);
    window.addEventListener('eay:toggleHUD', handleToggleHUD);
    return () => window.removeEventListener('eay:toggleHUD', handleToggleHUD);
  }, []);

  const handleMeshesDetected = (meshList) => {
    setMeshes(meshList);
    if (meshList.length > 0 && !activeMesh) {
      setActiveMesh(meshList[0].id);
    }

    setMeshStates(prev => {
      const next = { ...prev };
      meshList.forEach(m => {
        if (!next[m.id]) {
          let type = 'Body';
          if (m.display.includes('Neck')) type = 'Neck';
          else if (m.display.includes('Sleeve')) type = m.display.includes('R') ? 'R_Sleeve' : 'L_Sleeve';
          else if (m.display.includes('Front')) type = 'Front';
          else if (m.display.includes('Back')) type = 'Back';

          const colorKey = design.mapping[type] || design.mapping['Body'] || 'primary';
          const config = initialColors[colorKey];

          // Use original GLB color if it's an imported model
          const finalColor = design.isImported ? m.originalColor : config.color;

          next[m.id] = {
            color: finalColor,
            isGrad: design.isImported ? false : config.isGrad,
            grad1: design.isImported ? finalColor : (config.color2 || config.color),
            grad2: finalColor,
            pColor: '#ffffff',
            pUrl: null
          };
        }
      });
      return next;
    });
  };

  const updateMeshProp = (meshId, prop, val) => {
    setMeshStates(prev => ({
      ...prev,
      [meshId]: { ...prev[meshId], [prop]: val }
    }));
  };

  const addDecal = (type, text, imageUrl) => {
    const newDecal = {
      id: Date.now().toString(),
      type: type || 'text',
      text: text || (type === 'image' ? 'Logo' : 'TEAM NAME'),
      imageUrl: imageUrl || null,
      color: '#ffffff',
      font: 'Impact',
      decalScale: type === 'image' ? 0.12 : 0.18,
      // Text Effects Defaults
      outline1Width: 0,
      outline1Color: '#000000',
      outline2Width: 0,
      outline2Color: '#ffffff',
      effect: 'none',
      effectIntensity: 0.5
    };
    setDecals(prev => [...prev, newDecal]);
    setSelectedDecalId(newDecal.id);
  };

  const updateDecal = (id, updates) => {
    setDecals(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const removeDecal = (id) => {
    setDecals(prev => prev.filter(d => d.id !== id));
    if (selectedDecalId === id) setSelectedDecalId(null);
  };

  useEffect(() => {
    const handleMoveDecal = (e) => {
      if (selectedDecalId) {
        setDecals(prev => prev.map(d => d.id === selectedDecalId ? {
          ...d,
          worldPoint: e.detail.point,
          worldNormal: e.detail.normal,
          meshId: e.detail.meshId
        } : d));
      }
    };
    window.addEventListener('eay:moveDecal', handleMoveDecal);
    return () => window.removeEventListener('eay:moveDecal', handleMoveDecal);
  }, [selectedDecalId]);

  useEffect(() => {
    const handleResetAll = () => {
      setMeshStates(prev => {
        const next = { ...prev };
        meshes.forEach(m => {
          let type = 'Body';
          if (m.display.includes('Neck')) type = 'Neck';
          else if (m.display.includes('Sleeve')) type = m.display.includes('R') ? 'R_Sleeve' : 'L_Sleeve';
          else if (m.display.includes('Front')) type = 'Front';
          else if (m.display.includes('Back')) type = 'Back';

          const colorKey = design.mapping[type] || design.mapping['Body'] || 'primary';
          const config = initialColors[colorKey];

          next[m.id] = {
            color: config.color,
            isGrad: config.isGrad,
            grad1: config.color2 || config.color,
            grad2: config.color,
            pColor: '#ffffff',
            pUrl: null
          };
        });
        return next;
      });
      window.dispatchEvent(new CustomEvent('eay:resetCamera'));
    };

    const handleSave = () => {
      console.log('Saving design...', { meshStates, decals });
      alert('Design Saved Successfully!');
    };

    window.addEventListener('eay:resetAll', handleResetAll);
    window.addEventListener('eay:save', handleSave);
    return () => {
      window.removeEventListener('eay:resetAll', handleResetAll);
      window.removeEventListener('eay:save', handleSave);
    };
  }, [meshes, design, initialColors]);

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-white relative h-full min-h-0 overflow-hidden" style={{ minWidth: 0 }}>
      <div className="flex-1 min-h-[350px] md:min-h-0 min-w-0 overflow-hidden">
        <LeftPanel
          modelUrl={design.modelUrl}
          meshes={meshes}
          activeMesh={activeMesh}
          setActiveMesh={setActiveMesh}
          meshStates={meshStates}
          onMeshesDetected={handleMeshesDetected}
          decals={decals}
          selectedDecalId={selectedDecalId}
          setSelectedDecalId={setSelectedDecalId}
          updateDecal={updateDecal}
          removeDecal={removeDecal}
          globalPattern={globalPattern}
          materialFinish={materialFinish}
          lightingPreset={lightingPreset}
          mouseFollow={mouseFollow}
          isHUDVisible={isHUDVisible}
        />
      </div>
      
      <div className={`transition-all duration-500 ease-in-out border-l border-gray-100 bg-white flex-shrink-0
        ${isHUDVisible ? 'w-full md:w-[420px] flex-1 md:flex-none md:h-full opacity-100' : 'w-0 h-0 opacity-0 translate-x-full overflow-hidden border-none'}`}>
        <RightPanel
          activeMesh={activeMesh}
          meshStates={meshStates}
          updateMeshProp={updateMeshProp}
          decals={decals}
          selectedDecalId={selectedDecalId}
          setSelectedDecalId={setSelectedDecalId}
          addDecal={addDecal}
          updateDecal={updateDecal}
          removeDecal={removeDecal}
          globalPattern={globalPattern} setGlobalPattern={setGlobalPattern}
          lightingPreset={lightingPreset} setLightingPreset={setLightingPreset}
          materialFinish={materialFinish} setMaterialFinish={setMaterialFinish}
          mouseFollow={mouseFollow} setMouseFollow={setMouseFollow}
          roster={roster} setRoster={setRoster}
        />
      </div>

      {!isHUDVisible && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none fade-up flex flex-col items-center">
           <span className="text-[8px] font-semibold text-gray-400 uppercase tracking-[1em] mb-1">Cinematic Mode</span>
           <div className="w-12 h-0.5 bg-blue-600/30" />
        </div>
      )}
    </div>
  );
};

export default Builder;
