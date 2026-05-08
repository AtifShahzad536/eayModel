import React, { Suspense, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows, Center } from '@react-three/drei';
import * as THREE from 'three';

function Model({ 
  url, shirtColor, isGradientActive, gradientColor1, gradientColor2, patternUrl, patternColor,
  l2ShirtColor, l2IsGradientActive, l2GradientColor1, l2GradientColor2, l2PatternUrl, l2PatternColor,
  l3ShirtColor, l3IsGradientActive, l3GradientColor1, l3GradientColor2, l3PatternUrl, l3PatternColor,
  l4ShirtColor, l4IsGradientActive, l4GradientColor1, l4GradientColor2, l4PatternUrl, l4PatternColor
}) {
  const { scene } = useGLTF(url);
  
  const patternTexture = useMemo(() => {
    if (!patternUrl) return null;
    const loader = new THREE.TextureLoader();
    const tex = loader.load(patternUrl);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [patternUrl]);

  const l2PatternTexture = useMemo(() => {
    if (!l2PatternUrl) return null;
    const loader = new THREE.TextureLoader();
    const tex = loader.load(l2PatternUrl);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [l2PatternUrl]);

  const l3PatternTexture = useMemo(() => {
    if (!l3PatternUrl) return null;
    const loader = new THREE.TextureLoader();
    const tex = loader.load(l3PatternUrl);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [l3PatternUrl]);

  const l4PatternTexture = useMemo(() => {
    if (!l4PatternUrl) return null;
    const loader = new THREE.TextureLoader();
    const tex = loader.load(l4PatternUrl);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [l4PatternUrl]);

  useEffect(() => {
    // Get the bounding box of the whole scene to determine thresholds
    const wholeBox = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    wholeBox.getSize(size);
    const topThreshold = wholeBox.max.y - (size.y * 0.22); // Top section for collar
    const shoulderThreshold = wholeBox.max.y - (size.y * 0.45); // Upper section for shoulders/panels
    const sideThreshold = size.x * 0.2; 

    scene.traverse((child) => {
      if (child.isMesh) {
        const name = child.name.toLowerCase();
        child.geometry.computeBoundingBox();
        const meshCenter = new THREE.Vector3();
        child.geometry.boundingBox.getCenter(meshCenter);
        child.updateMatrixWorld();
        meshCenter.applyMatrix4(child.matrixWorld);

        // Advanced Detection Logic
        const isSleeve = Math.abs(meshCenter.x) > sideThreshold * 1.5 || name.includes('sleeve') || name.includes('arm');
        const isCollar = (meshCenter.y > topThreshold && Math.abs(meshCenter.x) < sideThreshold * 0.5) || 
                         name.includes('collar') || name.includes('neck') || name.includes('rib') || name.includes('binding');
        
        // Location 4: Shoulders or Side Panels
        const isShoulder = (meshCenter.y > shoulderThreshold && !isCollar && !isSleeve) || 
                           name.includes('shoulder') || name.includes('insert') || name.includes('yoke') || 
                           name.includes('stripe') || name.includes('panel') || name.includes('side');

        let locName = "TORSO (Loc 1)";
        let config = {
          color: shirtColor,
          isGrad: isGradientActive,
          grad1: gradientColor1,
          grad2: gradientColor2,
          pUrl: patternUrl,
          pColor: patternColor,
          pTex: patternTexture
        };

        if (isCollar) {
          locName = "COLLAR (Loc 3)";
          config = {
            color: l3ShirtColor,
            isGrad: l3IsGradientActive,
            grad1: l3GradientColor1,
            grad2: l3GradientColor2,
            pUrl: l3PatternUrl,
            pColor: l3PatternColor,
            pTex: l3PatternTexture
          };
        } else if (isShoulder) {
          locName = "SHOULDER (Loc 4)";
          config = {
            color: l4ShirtColor,
            isGrad: l4IsGradientActive,
            grad1: l4GradientColor1,
            grad2: l4GradientColor2,
            pUrl: l4PatternUrl,
            pColor: l4PatternColor,
            pTex: l4PatternTexture
          };
        } else if (isSleeve) {
          locName = "SLEEVE (Loc 2)";
          config = {
            color: l2ShirtColor,
            isGrad: l2IsGradientActive,
            grad1: l2GradientColor1,
            grad2: l2GradientColor2,
            pUrl: l2PatternUrl,
            pColor: l2PatternColor,
            pTex: l2PatternTexture
          };
        }

        console.log(`%c Targeting ${child.name} as ${locName}`, "color: #00ff00; font-weight: bold;");

        if (!child.userData.originalMaterial) {
          child.userData.originalMaterial = child.material;
        }
        
        const mat = child.userData.originalMaterial.clone();

        mat.onBeforeCompile = (shader) => {
          shader.uniforms.uShirtColor = { value: new THREE.Color(config.color).convertSRGBToLinear() };
          shader.uniforms.uIsGradient = { value: config.isGrad ? 1.0 : 0.0 };
          shader.uniforms.uColor1 = { value: new THREE.Color(config.grad1).convertSRGBToLinear() };
          shader.uniforms.uColor2 = { value: new THREE.Color(config.grad2).convertSRGBToLinear() };
          shader.uniforms.uPatternColor = { value: new THREE.Color(config.pColor).convertSRGBToLinear() };
          shader.uniforms.uHasPattern = { value: config.pTex ? 1.0 : 0.0 };
          shader.uniforms.uPatternTexture = { value: config.pTex };
          
          shader.uniforms.uMinY = { value: child.geometry.boundingBox.min.y };
          shader.uniforms.uMaxY = { value: child.geometry.boundingBox.max.y };

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
            uniform vec3 uShirtColor;
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
            vec3 baseColor = uShirtColor;
            if (uIsGradient > 0.5) {
              float t = (vLocalPos.y - uMinY) / (uMaxY - uMinY);
              t = clamp(t, 0.0, 1.0);
              t = smoothstep(0.2, 0.8, t);
              baseColor = mix(uColor2, uColor1, t);
            }
            
            vec3 finalColor = baseColor;
            
            if (uHasPattern > 0.5) {
              vec3 blending = abs(vLocalNormal);
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
          ).replace(`#include <map_fragment>`, `/* Handled */`);
        };
        
        mat.customProgramCacheKey = () => `loc7_${child.name}_${config.color}_${config.isGrad}_${config.pUrl ? 'y' : 'n'}_${config.pColor}`;
        mat.needsUpdate = true;
        child.material = mat;
      }
    });
  }, [scene, shirtColor, isGradientActive, gradientColor1, gradientColor2, patternUrl, patternColor, patternTexture, l2ShirtColor, l2IsGradientActive, l2GradientColor1, l2GradientColor2, l2PatternUrl, l2PatternColor, l2PatternTexture, l3ShirtColor, l3IsGradientActive, l3GradientColor1, l3GradientColor2, l3PatternUrl, l3PatternColor, l3PatternTexture, l4ShirtColor, l4IsGradientActive, l4GradientColor1, l4GradientColor2, l4PatternUrl, l4PatternColor, l4PatternTexture]);

  return <primitive object={scene} scale={2} position={[0, -1, 0]} />;
}

const ModelViewer = ({ 
  shirtColor, isGradientActive, gradientColor1, gradientColor2, patternUrl, patternColor,
  l2ShirtColor, l2IsGradientActive, l2GradientColor1, l2GradientColor2, l2PatternUrl, l2PatternColor,
  l3ShirtColor, l3IsGradientActive, l3GradientColor1, l3GradientColor2, l3PatternUrl, l3PatternColor,
  l4ShirtColor, l4IsGradientActive, l4GradientColor1, l4GradientColor2, l4PatternUrl, l4PatternColor
}) => {
  return (
    <div className="flex-1 w-full bg-white relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} style={{ width: '100%', height: '100%' }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Suspense fallback={null}>
          <Center>
            <Model 
              url="/src/assets/shirt.glb" 
              shirtColor={shirtColor} 
              isGradientActive={isGradientActive} 
              gradientColor1={gradientColor1} 
              gradientColor2={gradientColor2} 
              patternUrl={patternUrl}
              patternColor={patternColor}
              l2ShirtColor={l2ShirtColor}
              l2IsGradientActive={l2IsGradientActive}
              l2GradientColor1={l2GradientColor1}
              l2GradientColor2={l2GradientColor2}
              l2PatternUrl={l2PatternUrl}
              l2PatternColor={l2PatternColor}
              l3ShirtColor={l3ShirtColor}
              l3IsGradientActive={l3IsGradientActive}
              l3GradientColor1={l3GradientColor1}
              l3GradientColor2={l3GradientColor2}
              l3PatternUrl={l3PatternUrl}
              l3PatternColor={l3PatternColor}
              l4ShirtColor={l4ShirtColor}
              l4IsGradientActive={l4IsGradientActive}
              l4GradientColor1={l4GradientColor1}
              l4GradientColor2={l4GradientColor2}
              l4PatternUrl={l4PatternUrl}
              l4PatternColor={l4PatternColor}
            />
          </Center>
          <Environment preset="city" />
          <ContactShadows position={[0, -1.5, 0]} opacity={0.5} scale={10} blur={2} far={4} />
        </Suspense>
        <OrbitControls autoRotate={false} enableZoom={true} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 2} />
      </Canvas>
    </div>
  );
};

export default ModelViewer;
