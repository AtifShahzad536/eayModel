import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';

function App() {
  // Dynamic state for all meshes detected in the model
  const [meshes, setMeshes] = useState([]); // List of mesh names
  const [meshStates, setMeshStates] = useState({}); // { meshName: { color, isGrad, grad1, grad2, pUrl, pColor } }
  const [activeMesh, setActiveMesh] = useState(null);

  // Initialize mesh state when a new mesh is detected
  const initMeshState = (meshNames) => {
    setMeshes(meshNames);
    setMeshStates(prev => {
      const newState = { ...prev };
      meshNames.forEach(name => {
        if (!newState[name]) {
          newState[name] = {
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
    if (meshNames.length > 0 && !activeMesh) {
      setActiveMesh(meshNames[0]);
    }
  };

  // Update a specific property for a mesh
  const updateMeshProp = (meshName, prop, value) => {
    setMeshStates(prev => ({
      ...prev,
      [meshName]: {
        ...prev[meshName],
        [prop]: value
      }
    }));
  };

  return (
    <div className="w-screen h-screen bg-white flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1 w-full h-[calc(100vh-2rem)] overflow-hidden">
        <LeftPanel
          meshes={meshes}
          activeMesh={activeMesh}
          setActiveMesh={setActiveMesh}
          meshStates={meshStates}
          onMeshesDetected={initMeshState}
        />
        <RightPanel
          activeMesh={activeMesh}
          meshStates={meshStates}
          updateMeshProp={updateMeshProp}
        />
      </div>
    </div>
  );
}

export default App;
