import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows, Center } from '@react-three/drei';
import * as THREE from 'three';

const whiteTex = new THREE.CanvasTexture(document.createElement('canvas')); // Dummy white tex

function CameraController() {
  const { camera } = useThree();
  const controlsRef = useRef();
  useEffect(() => {
    const onReset = () => {
      camera.position.set(0, 0.5, 3.5);
      camera.updateProjectionMatrix();
      if (controlsRef.current) controlsRef.current.reset();
    };
    const onZoom = (e) => {
      camera.position.z = Math.max(1.5, Math.min(8, camera.position.z + e.detail));
      camera.updateProjectionMatrix();
    };
    window.addEventListener('eay:resetCamera', onReset);
    window.addEventListener('eay:zoom', onZoom);
    return () => {
      window.removeEventListener('eay:resetCamera', onReset);
      window.removeEventListener('eay:zoom', onZoom);
    };
  }, [camera]);
  return <OrbitControls ref={controlsRef} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.8} />;
}

function MeshPart({ node, state }) {
  const materialRef = useRef();

  // Initialize Material with custom shader logic
  const material = useMemo(() => {
    const mat = node.material.clone();
    mat.userData.uniforms = {
      uColor: { value: new THREE.Color('#ffffff') },
      uIsGradient: { value: 0.0 },
      uColor1: { value: new THREE.Color('#ffffff') },
      uColor2: { value: new THREE.Color('#ffffff') },
      uHasPattern: { value: 0.0 },
      uPatternColor: { value: new THREE.Color('#ffffff') },
      uPatternTexture: { value: whiteTex },
      uMinY: { value: 0 },
      uMaxY: { value: 1 }
    };

    mat.onBeforeCompile = (shader) => {
      // Link our custom uniforms to the actual shader uniforms
      Object.assign(shader.uniforms, mat.userData.uniforms);

      shader.vertexShader = `
        varying vec3 vLocalPos;
        varying vec3 vLocalNormal;
        ${shader.vertexShader}
      `.replace(
        `#include <begin_vertex>`,
        `#include <begin_vertex>
         vLocalPos = position;
         vLocalNormal = normal;`
      );

      shader.fragmentShader = `
        uniform vec3 uColor;
        uniform float uIsGradient;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform float uMinY;
        uniform float uMaxY;
        uniform float uHasPattern;
        uniform vec3 uPatternColor;
        uniform sampler2D uPatternTexture;
        varying vec3 vLocalPos;
        varying vec3 vLocalNormal;
        ${shader.fragmentShader}
      `.replace(
        `vec4 diffuseColor = vec4( diffuse, opacity );`,
        `
        vec3 baseColor = uColor;
        if (uIsGradient > 0.5) {
          float t = (vLocalPos.y - uMinY) / (uMaxY - uMinY);
          t = clamp(t, 0.0, 1.0);
          t = smoothstep(0.1, 0.9, t);
          baseColor = mix(uColor2, uColor1, t);
        }
        
        vec3 finalColor = baseColor;
        if (uHasPattern > 0.5) {
          vec3 blending = abs(normalize(vLocalNormal));
          blending /= (blending.x + blending.y + blending.z);
          float scale = 12.0; 
          vec4 xTex = texture2D(uPatternTexture, vLocalPos.yz * scale);
          vec4 yTex = texture2D(uPatternTexture, vLocalPos.xz * scale);
          vec4 zTex = texture2D(uPatternTexture, vLocalPos.xy * scale);
          vec4 patternSample = xTex * blending.x + yTex * blending.y + zTex * blending.z;
          finalColor = mix(baseColor, uPatternColor, patternSample.r);
        }
        vec4 diffuseColor = vec4( finalColor, opacity );
        `
      );
      materialRef.current = shader;
    };
    return mat;
  }, [node]);

  // Sync React state to Three.js uniforms
  useEffect(() => {
    if (!state) return;
    const u = material.userData.uniforms;
    u.uColor.value.set(state.color).convertSRGBToLinear();
    u.uIsGradient.value = state.isGrad ? 1.0 : 0.0;
    u.uColor1.value.set(state.grad1).convertSRGBToLinear();
    u.uColor2.value.set(state.grad2).convertSRGBToLinear();
    u.uPatternColor.value.set(state.pColor).convertSRGBToLinear();
    
    node.geometry.computeBoundingBox();
    u.uMinY.value = node.geometry.boundingBox.min.y;
    u.uMaxY.value = node.geometry.boundingBox.max.y;

    if (state.pUrl) {
      new THREE.TextureLoader().load(state.pUrl, (tex) => {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.colorSpace = THREE.SRGBColorSpace;
        u.uPatternTexture.value = tex;
        u.uHasPattern.value = 1.0;
      });
    } else {
      u.uHasPattern.value = 0.0;
    }
  }, [state, material, node]);

  return <primitive object={node} material={material} />;
}

function Model({ url, meshStates, onMeshesDetected }) {
  const { scene } = useGLTF(url);
  const meshes = useMemo(() => {
    const list = [];
    scene.traverse(c => { if (c.isMesh) list.push(c); });
    return list;
  }, [scene]);

  useEffect(() => {
    onMeshesDetected(meshes.map(m => m.name));
  }, [meshes, onMeshesDetected]);

  return (
    <group scale={2} position={[0, -1, 0]}>
      {meshes.map(m => (
        <MeshPart key={m.uuid} node={m} state={meshStates[m.name]} />
      ))}
    </group>
  );
}

const ModelViewer = ({ meshStates, onMeshesDetected }) => {
  return (
    <div className="flex-1 w-full bg-white relative" style={{ height: '100%' }}>
      <Canvas camera={{ position: [0, 0.5, 3.5], fov: 42 }} gl={{ preserveDrawingBuffer: true, antialias: true }}>
        <ambientLight intensity={0.8} />
        <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={2} />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />
        <Suspense fallback={null}>
          <Center>
            <Model url="/shirt.glb" meshStates={meshStates} onMeshesDetected={onMeshesDetected} />
          </Center>
          <Environment preset="city" />
          <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={15} blur={2.5} far={4} />
        </Suspense>
        <CameraController />
      </Canvas>
    </div>
  );
};

export default ModelViewer;
