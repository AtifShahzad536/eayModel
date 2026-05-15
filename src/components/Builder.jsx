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

  // Initialize mesh states based on design mapping and global colors
  useEffect(() => {
    if (!design) return;
    const initialStates = {};

    // This is a simplified initialization
    // In a real app, you'd iterate over all meshes once detected
    // For now, we'll wait for meshes to be detected to populate this properly
  }, [design, initialColors]);

  const handleMeshesDetected = (meshList) => {
    setMeshes(meshList);
    if (meshList.length > 0 && !activeMesh) {
      setActiveMesh(meshList[0].id);
    }

    // Populate initial states if not already done
    setMeshStates(prev => {
      const next = { ...prev };
      meshList.forEach(m => {
        if (!next[m.id]) {
          // Detect type from display name (simplified)
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
            grad1: config.color2,
            grad2: config.color,
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
      text: text || (type === 'image' ? 'Logo' : 'TEXT'),
      imageUrl: imageUrl || null,
      color: '#ffffff',
      font: 'Outfit',
      decalScale: type === 'image' ? 0.12 : 0.15,
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
            grad1: config.color2,
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
  }, [meshes, design, initialColors, meshStates, decals]);

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-white">
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
        // Global Configs
        globalPattern={globalPattern}
        materialFinish={materialFinish}
        lightingPreset={lightingPreset}
        mouseFollow={mouseFollow}
      />
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
        // Global Props for new tab
        globalPattern={globalPattern} setGlobalPattern={setGlobalPattern}
        lightingPreset={lightingPreset} setLightingPreset={setLightingPreset}
        materialFinish={materialFinish} setMaterialFinish={setMaterialFinish}
        mouseFollow={mouseFollow} setMouseFollow={setMouseFollow}
        // Roster Props
        roster={roster} setRoster={setRoster}
      />
    </div>
  );
};

export default Builder;
