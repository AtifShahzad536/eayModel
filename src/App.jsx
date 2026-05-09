import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import * as THREE from 'three';

function App() {
  // Dynamic state for all meshes detected in the model
  const [modelUrl, setModelUrl] = useState('/shirt.glb');
  const [meshes, setMeshes] = useState([]); // List of mesh names
  const [meshStates, setMeshStates] = useState({}); // { meshName: { color, isGrad, grad1, grad2, pUrl, pColor } }
  const [activeMesh, setActiveMesh] = useState(null);
  const [decals, setDecals] = useState([]); // List of { id, text, type, position, rotation, scale, color, font, ... }
  const [selectedDecalId, setSelectedDecalId] = useState(null);

  useEffect(() => {
    const handleImport = (e) => {
      setModelUrl(e.detail);
      setMeshes([]); // Reset meshes for new model
      setActiveMesh(null);
    };

    const handleSave = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(meshStates));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "config.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    };

    const handleResetAll = () => {
      setMeshStates({});
    };

    window.addEventListener('eay:importModel', handleImport);
    window.addEventListener('eay:save', handleSave);
    window.addEventListener('eay:resetAll', handleResetAll);
    return () => {
      window.removeEventListener('eay:importModel', handleImport);
      window.removeEventListener('eay:save', handleSave);
      window.removeEventListener('eay:resetAll', handleResetAll);
    };
  }, [meshStates]);

  // Initialize mesh state when a new mesh is detected
  const initMeshState = (meshList) => {
    setMeshes(meshList); // meshList is [{ id, display }]
    setMeshStates(prev => {
      const newState = { ...prev };
      meshList.forEach(info => {
        if (!newState[info.id]) {
          newState[info.id] = {
            color: '#ffffff',
            isGrad: false,
            grad1: '#555555',
            grad2: '#ccff00',
            pUrl: null,
            pColor: '#ccff00'
          };
        }
      });
      return newState;
    });
    if (meshList.length > 0 && !activeMesh) {
      setActiveMesh(meshList[0].id);
    }
  };

  // Update a specific property for a mesh
  const updateMeshProp = (meshId, prop, value) => {
    setMeshStates(prev => ({
      ...prev,
      [meshId]: {
        ...prev[meshId],
        [prop]: value
      }
    }));
  };

  // Decal Management — supports 'text' and 'image' types
  const addDecal = (type = 'text', content = 'TEAM NAME', imageUrl = null) => {
    const id = Date.now().toString();
    const newDecal = {
      id,
      type,
      text: type === 'image' ? (content || 'Logo') : content,
      imageUrl: imageUrl || null,
      color: '#111111',
      font: 'Arial',
      outline1Color: '#ffffff',
      outline1Width: type === 'image' ? 0 : 4,
      outline2Color: '#00b0f0',
      outline2Width: 0,
      effect: 'none',
      effectIntensity: 0.5,
      tail: 'none',
      opacity: 1.0,
      decalScale: type === 'image' ? 0.12 : 0.15,
      meshId: activeMesh || '',
      worldPoint: null,
      worldNormal: null,
      v: Date.now()
    };
    setDecals(prev => [...prev, newDecal]);
    setSelectedDecalId(id);
  };

  const updateDecal = useCallback((id, updates) => {
    setDecals(prev => prev.map(d => d.id === id ? { ...d, ...updates, v: Date.now() } : d));
  }, []);

  const removeDecal = (id) => {
    setDecals(prev => prev.filter(d => d.id !== id));
    if (selectedDecalId === id) setSelectedDecalId(null);
  };

  // Handle Decal Placement on Model Click
  useEffect(() => {
    const handleMove = (e) => {
      if (!selectedDecalId) return;
      const { point, normal, meshId } = e.detail;
      
      updateDecal(selectedDecalId, { 
        worldPoint: point,
        worldNormal: normal,
        meshId: meshId
      });
    };
    window.addEventListener('eay:moveDecal', handleMove);
    return () => window.removeEventListener('eay:moveDecal', handleMove);
  }, [selectedDecalId, updateDecal]);

  return (
    <div className="w-screen h-screen bg-white flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-col md:flex-row flex-1 w-full h-[calc(100vh-2rem)] overflow-hidden">
        <LeftPanel
          modelUrl={modelUrl}
          meshes={meshes}
          activeMesh={activeMesh}
          setActiveMesh={setActiveMesh}
          meshStates={meshStates}
          onMeshesDetected={initMeshState}
          decals={decals}
          selectedDecalId={selectedDecalId}
          setSelectedDecalId={setSelectedDecalId}
          updateDecal={updateDecal}
          removeDecal={removeDecal}
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
        />
      </div>
    </div>
  );
}

export default App;
