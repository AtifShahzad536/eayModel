import React, { Suspense, useEffect, useMemo, useRef, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows, Center, useProgress, Html } from '@react-three/drei';
import * as THREE from 'three';
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js';

const whiteTex = new THREE.CanvasTexture(document.createElement('canvas'));

// ─── TEXT CANVAS HELPER (renders text as a texture) ──────────────────────────
// ─── TEXT CANVAS HELPER (renders text as a texture with full styling) ────────
function createTextCanvas(decal) {
  const { text, color, font, outline1Color, outline1Width, outline2Color, outline2Width, effect, effectIntensity } = decal;

  const canvas = document.createElement('canvas');
  canvas.width = 1024; // High res
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const fontSize = 120;
  ctx.font = `bold ${fontSize}px ${font || 'Arial'}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const x = canvas.width / 2;
  const y = canvas.height / 2;

  // Function to draw text or arched text
  const drawPass = (isStroke, strokeWidth, strokeColor) => {
    ctx.fillStyle = strokeColor || color;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth * 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    const drawText = (tx, ty) => {
      if (isStroke) ctx.strokeText(text, tx, ty);
      else ctx.fillText(text, tx, ty);
    };

    const drawTail = (tx, ty) => {
      if (decal.tail === 'swoosh') {
        const textWidth = ctx.measureText(text).width;
        ctx.beginPath();
        ctx.moveTo(tx - textWidth / 2, ty + 20);
        ctx.quadraticCurveTo(tx, ty + 60, tx + textWidth / 2 + 20, ty + 10);
        ctx.lineTo(tx + textWidth / 2 + 15, ty + 20);
        ctx.quadraticCurveTo(tx, ty + 70, tx - textWidth / 2 - 10, ty + 25);
        ctx.closePath();
        if (isStroke) ctx.stroke();
        else ctx.fill();
      }
    };

    if (effect === 'arch') {
      const radius = 400 / (effectIntensity || 0.5);
      const characters = text.split('');
      const totalWidth = ctx.measureText(text).width;
      const anglePerPixel = 1 / radius;
      const totalAngle = totalWidth * anglePerPixel;

      let currentAngle = -totalAngle / 2;

      ctx.save();
      ctx.translate(x, y + radius - 20);

      characters.forEach(char => {
        const charWidth = ctx.measureText(char).width;
        const charAngle = charWidth * anglePerPixel;
        ctx.save();
        ctx.rotate(currentAngle + charAngle / 2);
        if (isStroke) ctx.strokeText(char, 0, -radius);
        else ctx.fillText(char, 0, -radius);
        ctx.restore();
        currentAngle += charAngle;
      });
      ctx.restore();
    } else {
      drawText(x, y - 10);
      drawTail(x, y - 10);
    }
  };

  // 1. Draw Outline 2 (Bottom-most)
  if (outline2Width > 0) {
    drawPass(true, (outline1Width || 0) + (outline2Width || 0), outline2Color);
  }

  // 2. Draw Outline 1
  if (outline1Width > 0) {
    drawPass(true, outline1Width, outline1Color);
  }

  // 3. Draw Fill (Top-most)
  drawPass(false);

  return canvas;
}

// ─── IMAGE CANVAS HELPER (renders an image as a decal texture) ───────────────
function createImageCanvas(imageUrl) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 512, 512);
  // placeholder: will be updated after image loads
  ctx.fillStyle = 'rgba(200,200,200,0.3)';
  ctx.fillRect(100, 100, 312, 312);
  ctx.font = 'bold 40px Arial';
  ctx.fillStyle = '#aaa';
  ctx.textAlign = 'center';
  ctx.fillText('LOADING...', 256, 270);
  return canvas;
}

// Image cache to avoid reloading
const imageCache = {};
function loadImageToCanvas(imageUrl) {
  return new Promise((resolve) => {
    if (imageCache[imageUrl]) {
      resolve(imageCache[imageUrl]);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, 512, 512);
      // Fit image maintaining aspect ratio, centered
      const scale = Math.min(512 / img.width, 512 / img.height) * 0.85;
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, (512 - w) / 2, (512 - h) / 2, w, h);
      imageCache[imageUrl] = canvas;
      resolve(canvas);
    };
    img.onerror = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512; canvas.height = 512;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ff000033';
      ctx.fillRect(0, 0, 512, 512);
      ctx.font = 'bold 30px Arial'; ctx.fillStyle = '#f00'; ctx.textAlign = 'center';
      ctx.fillText('ERROR', 256, 260);
      resolve(canvas);
    };
    img.src = imageUrl;
  });
}

// ─── LOADER ──────────────────────────────────────────────────────────────────
function CoolLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center gap-6 select-none pointer-events-none">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="w-6 h-6 bg-[#00b0f0] rounded flex items-center justify-center animate-pulse shadow-[0_0_15px_rgba(0,176,240,0.5)]">
            <span className="text-white text-[8px] font-black">E</span>
          </div>
          <div className="absolute inset-0 rounded-full border-b-2 border-l-2 border-[#00b0f0] animate-spin" style={{ animationDuration: '1.2s' }} />
          <div className="absolute inset-[-6px] rounded-full border-t border-r border-[#00b0f0]/30 animate-spin" style={{ animationDuration: '2.5s', animationDirection: 'reverse' }} />
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <div className="text-[9px] font-black text-[#00b0f0] uppercase tracking-[0.4em] opacity-80">Initializing</div>
          <div className="text-[14px] font-bold text-gray-400 tabular-nums">{Math.round(progress)}%</div>
        </div>
      </div>
    </Html>
  );
}

// ─── CAMERA CONTROLLER ───────────────────────────────────────────────────────
function CameraController({ mouseFollow }) {
  const { camera } = useThree();
  const controlsRef = useRef();
  useEffect(() => {
    const onReset = () => {
      camera.position.set(0, 0, 2.5);
      camera.updateProjectionMatrix();
      if (controlsRef.current) controlsRef.current.reset();
    };
    const onZoom = (e) => {
      camera.position.z = Math.max(1.5, Math.min(8, camera.position.z + e.detail));
      camera.updateProjectionMatrix();
    };
    const onExport = () => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return;
      const link = document.createElement('a');
      link.download = `eay-capture-${new Date().getTime()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    window.addEventListener('eay:resetCamera', onReset);
    window.addEventListener('eay:zoom', onZoom);
    window.addEventListener('eay:export', onExport);
    return () => {
      window.removeEventListener('eay:resetCamera', onReset);
      window.removeEventListener('eay:zoom', onZoom);
      window.removeEventListener('eay:export', onExport);
    };
  }, [camera]);
  return <OrbitControls ref={controlsRef} enabled={!mouseFollow} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.8} />;
}

// ─── MESH PART (handles color/pattern shaders) ──────────────────────────────
function MeshPart({ node, state, finish, globalPattern }) {
  const materialRef = useRef();

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
      uPatternType: { value: 0.0 }, // 0: none, 1: carbon, 2: camo, 3: dots
      uMinY: { value: 0 },
      uMaxY: { value: 1 }
    };

    mat.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, mat.userData.uniforms);

      shader.vertexShader = `
        varying vec3 vLocalPos;
        varying vec3 vLocalNormal;
        varying vec2 vUv;
        ${shader.vertexShader}
      `.replace(
        `#include <begin_vertex>`,
        `#include <begin_vertex>
         vLocalPos = position;
         vLocalNormal = normal;
         vUv = uv;`
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
        uniform float uPatternType;
        varying vec3 vLocalPos;
        varying vec3 vLocalNormal;
        varying vec2 vUv;

        // Procedural Noise for Camo
        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
        float noise(vec2 p) {
          vec2 i = floor(p); vec2 f = fract(p);
          f = f*f*(3.0-2.0*f);
          return mix(mix(hash(i + vec2(0,0)), hash(i + vec2(1,0)), f.x),
                     mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x), f.y);
        }

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
        
        // 1. Procedural Global Patterns
        float patStrength = 0.0;
        if (uPatternType > 0.5 && uPatternType < 1.5) { // CARBON
          vec2 grid = fract(vUv * 40.0);
          patStrength = step(0.5, grid.x) == step(0.5, grid.y) ? 0.1 : -0.1;
        } else if (uPatternType > 1.5 && uPatternType < 2.5) { // CAMO
          patStrength = (noise(vUv * 10.0) - 0.5) * 0.4;
        } else if (uPatternType > 2.5) { // DOTS
          vec2 grid = fract(vUv * 30.0) - 0.5;
          patStrength = length(grid) < 0.3 ? -0.2 : 0.0;
        }
        finalColor += patStrength;

        // 2. Mesh-Specific Custom Patterns
        if (uHasPattern > 0.5) {
          vec3 blending = abs(normalize(vLocalNormal));
          blending = pow(blending, vec3(16.0));
          blending /= (blending.x + blending.y + blending.z);
          
          float scale = 12.0; 
          vec4 xTex = texture2D(uPatternTexture, vLocalPos.yz * scale);
          vec4 yTex = texture2D(uPatternTexture, vLocalPos.xz * scale);
          vec4 zTex = texture2D(uPatternTexture, vLocalPos.xy * scale);
          vec4 patternSample = xTex * blending.x + yTex * blending.y + zTex * blending.z;
          
          vec4 cornerSample = texture2D(uPatternTexture, vec2(0.01, 0.01));
          float isBgWhite = step(0.5, cornerSample.r);
          
          if (isBgWhite > 0.5) {
            finalColor = mix(uPatternColor, finalColor, patternSample.r);
          } else {
            finalColor = mix(finalColor, uPatternColor, patternSample.r);
          }
        }
        vec4 diffuseColor = vec4( finalColor, opacity );
        `
      );
      materialRef.current = shader;
    };
    return mat;
  }, [node]);

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

    // Apply material finish (gloss/metallic/matte)
    const roughness = finish === 'gloss' ? 0.1 : finish === 'metallic' ? 0.2 : 0.8;
    const metalness = finish === 'metallic' ? 0.8 : 0.0;
    material.roughness = roughness;
    material.metalness = metalness;

    // Handle Pattern (Combine global and local)
    const pType = globalPattern === 'carbon' ? 1.0 : globalPattern === 'camo' ? 2.0 : globalPattern === 'dots' ? 3.0 : 0.0;
    u.uPatternType.value = pType;

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
  }, [state, material, node, finish, globalPattern]);

  return <primitive object={node} material={material} />;
}

// ─── MODEL (with DecalGeometry-based text system from script1.js) ────────────
function Model({ url, meshStates, onMeshesDetected, decals, selectedDecalId, setSelectedDecalId, updateDecal, removeDecal, finish, globalPattern, mouseFollow }) {
  const { scene: rootScene, viewport } = useThree();
  const { scene } = useGLTF(url);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const decalMeshesRef = useRef({});
  const meshRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!mouseFollow) return;
    const handleMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [mouseFollow]);


  useFrame((state) => {
    if (!meshRef.current) return;
    if (mouseFollow) {
      const targetX = mouse.current.x * 0.8;
      const targetY = mouse.current.y * 0.3;
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetX, 0.05);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -targetY, 0.05);
    } else {
      // Gentle auto-rotation when mouse follow is OFF
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, 0.05);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, 0.05);
    }
  });

  const meshes = useMemo(() => {
    const list = [];
    clonedScene.traverse(c => { if (c.isMesh) list.push(c); });
    return list;
  }, [clonedScene]);

  // Detect meshes
  useEffect(() => {
    // 1. Get the overall bounding box of all meshes combined
    const fullBox = new THREE.Box3();
    meshes.forEach(m => {
      fullBox.expandByObject(m);
    });
    const fullCenter = new THREE.Vector3();
    fullBox.getCenter(fullCenter);
    const fullSize = new THREE.Vector3();
    fullBox.getSize(fullSize);

    const nameCounts = {};
    const finalMeshInfo = meshes.map(m => {
      // 2. Calculate relative spatial position to determine the part name dynamically
      const box = new THREE.Box3().setFromObject(m);
      const center = new THREE.Vector3();
      box.getCenter(center);
      
      // Normalized coordinates from -0.5 to 0.5 relative to the whole model
      const nx = fullSize.x > 0 ? (center.x - fullCenter.x) / fullSize.x : 0;
      const ny = fullSize.y > 0 ? (center.y - fullCenter.y) / fullSize.y : 0;
      const nz = fullSize.z > 0 ? (center.z - fullCenter.z) / fullSize.z : 0;

      let partName = "Body Panel";
      if (ny > 0.3) partName = "Collar"; // Top 20%
      else if (Math.abs(nx) > 0.25) partName = nx > 0 ? "Right Sleeve" : "Left Sleeve"; // Outer sides
      else if (nz > 0.1) partName = "Front Body";
      else if (nz < -0.1) partName = "Back Body";
      else partName = "Side Panel";

      nameCounts[partName] = (nameCounts[partName] || 0) + 1;
      const finalName = nameCounts[partName] > 1
        ? `${partName} ${nameCounts[partName]}`
        : partName;
      
      const originalHex = `#${m.material.color.getHexString()}`;
      return { id: m.name, display: finalName, originalColor: originalHex };
    });
    onMeshesDetected(finalMeshInfo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meshes]);

  // ─── Click-to-Place: dispatch world-space hit info (same as script1.js) ────
  const handleMeshClick = useCallback((e) => {
    e.stopPropagation();
    if (!e.face) return;

    // First: check if click is near any existing text (distance-based, very reliable)
    const clickPoint = e.point.clone();
    let closestDecal = null;
    let closestDist = 0.08; // detection radius

    decals.forEach(d => {
      if (!d.worldPoint) return;
      const decalPos = new THREE.Vector3().fromArray(d.worldPoint);
      const dist = clickPoint.distanceTo(decalPos);
      if (dist < closestDist) {
        closestDist = dist;
        closestDecal = d;
      }
    });

    if (closestDecal) {
      setSelectedDecalId(closestDecal.id);
      return; // Select, don't move
    }

    const worldPoint = e.point.clone();
    const worldNormal = e.face.normal.clone()
      .transformDirection(e.object.matrixWorld)
      .normalize();

    window.dispatchEvent(new CustomEvent('eay:moveDecal', {
      detail: {
        point: [worldPoint.x, worldPoint.y, worldPoint.z],
        normal: [worldNormal.x, worldNormal.y, worldNormal.z],
        meshId: e.object.name
      }
    }));
  }, [setSelectedDecalId, decals]);

  // ─── Auto-place new decals on the front of the shirt ───────────────────────
  useEffect(() => {
    const pending = decals.filter(d => !d.worldPoint);
    if (pending.length === 0 || meshes.length === 0) return;

    pending.forEach(d => {
      let targetMesh = meshes.find(m => m.name === d.meshId) || meshes[0];

      // Raycast from front (same as script1.js autoPlaceFront)
      const box = new THREE.Box3().setFromObject(targetMesh);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      const raycaster = new THREE.Raycaster();
      const origin = new THREE.Vector3(center.x, center.y + size.y * 0.1, box.max.z + 1);
      raycaster.set(origin, new THREE.Vector3(0, 0, -1));

      const hits = raycaster.intersectObject(targetMesh, true);
      if (hits.length > 0) {
        const hit = hits[0];
        const wn = hit.face.normal.clone()
          .transformDirection(hit.object.matrixWorld)
          .normalize();

        updateDecal(d.id, {
          worldPoint: [hit.point.x, hit.point.y, hit.point.z],
          worldNormal: [wn.x, wn.y, wn.z],
          meshId: hit.object.name
        });
      }
    });
  }, [decals, meshes, updateDecal]);

  // ─── DecalGeometry Management (exact script1.js approach) ──────────────────
  useEffect(() => {
    const currentIds = new Set(decals.map(d => d.id));

    // Remove deleted decals
    Object.keys(decalMeshesRef.current).forEach(id => {
      if (!currentIds.has(id)) {
        const m = decalMeshesRef.current[id];
        rootScene.remove(m);
        m.geometry.dispose();
        m.material.dispose();
        delete decalMeshesRef.current[id];
      }
    });

    // Create / update decals
    decals.forEach(d => {
      if (!d.worldPoint || !d.worldNormal) return;

      const targetMesh = meshes.find(m => m.name === d.meshId);
      if (!targetMesh) return;

      // Version check — only recreate if something changed
      const version = `${d.type}_${d.text}_${d.imageUrl || ''}_${d.worldPoint.join(',')}_${d.color}_${d.decalScale || 0.15}_${d.font}_${d.outline1Color}_${d.outline1Width}_${d.outline2Color}_${d.outline2Width}_${d.effect}_${d.effectIntensity}_${d.tail}_${d.v || 0}`;
      const existing = decalMeshesRef.current[d.id];
      if (existing && existing.userData._v === version) return;

      // Remove old version
      if (existing) {
        rootScene.remove(existing);
        existing.geometry.dispose();
        existing.material.dispose();
      }

      try {
        // Create texture canvas based on type
        let canvas;
        if (d.type === 'image' && d.imageUrl) {
          canvas = createImageCanvas(d.imageUrl);
        } else {
          canvas = createTextCanvas(d);
        }
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;

        // Build orientation from normal
        const point = new THREE.Vector3().fromArray(d.worldPoint);
        const normal = new THREE.Vector3().fromArray(d.worldNormal);

        const up = Math.abs(normal.y) < 0.95
          ? new THREE.Vector3(0, 1, 0)
          : new THREE.Vector3(1, 0, 0);
        const right = new THREE.Vector3().crossVectors(up, normal).normalize();
        const newUp = new THREE.Vector3().crossVectors(normal, right).normalize();
        const m4 = new THREE.Matrix4().makeBasis(right, newUp, normal);
        const orientation = new THREE.Euler().setFromRotationMatrix(m4);

        const s = d.decalScale || 0.15;
        // Images are square, text is wide
        const decalSize = d.type === 'image'
          ? new THREE.Vector3(s, s, s * 3)
          : new THREE.Vector3(s, s * 0.25, s * 3);

        const geo = new DecalGeometry(targetMesh, point, orientation, decalSize);
        const mat = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          depthTest: true,
          depthWrite: false,
          polygonOffset: true,
          polygonOffsetFactor: -4,
          polygonOffsetUnits: -4,
        });
        const decalMesh = new THREE.Mesh(geo, mat);
        decalMesh.renderOrder = 999;
        decalMesh.userData._v = version;
        decalMesh.userData.decalId = d.id;
        rootScene.add(decalMesh);
        decalMeshesRef.current[d.id] = decalMesh;

        // For image decals: async load real image, then update texture
        if (d.type === 'image' && d.imageUrl) {
          loadImageToCanvas(d.imageUrl).then(imgCanvas => {
            if (decalMeshesRef.current[d.id] === decalMesh) {
              texture.image = imgCanvas;
              texture.needsUpdate = true;
            }
          });
        }
      } catch (err) {
        console.error('DecalGeometry error:', err);
      }
    });
  }, [decals, meshes, rootScene]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(decalMeshesRef.current).forEach(m => {
        rootScene.remove(m);
        m.geometry.dispose();
        m.material.dispose();
      });
      decalMeshesRef.current = {};
    };
  }, [rootScene]);

  // Explicitly cleanup decal GPU memory when component unmounts
  // We DO NOT dispose of the main scene geometries because they are cached by useGLTF
  useEffect(() => {
    return () => {
      Object.values(decalMeshesRef.current).forEach(m => {
        rootScene.remove(m);
        m.geometry.dispose();
        m.material.dispose();
      });
      decalMeshesRef.current = {};
    };
  }, [rootScene]);

  return (
    <group ref={meshRef} scale={1.8} onPointerDown={handleMeshClick}>
      {meshes.map(m => (
        <MeshPart key={m.uuid} node={m} state={meshStates[m.name]} finish={finish} globalPattern={globalPattern} />
      ))}
    </group>
  );
}

// ─── MAIN VIEWER ─────────────────────────────────────────────────────────────
const ModelViewer = ({ modelUrl, meshStates, onMeshesDetected, decals, selectedDecalId, setSelectedDecalId, updateDecal, removeDecal, globalPattern, materialFinish, lightingPreset, mouseFollow }) => {
  const selectedDecal = decals.find(d => d.id === selectedDecalId);

  return (
    <div className="flex-1 w-full bg-white relative" style={{ height: '100%' }}>
      <Canvas camera={{ position: [0, 0, 2.5], fov: 42 }} gl={{ preserveDrawingBuffer: true, antialias: true }} onPointerMissed={() => setSelectedDecalId(null)}>
        <ambientLight intensity={lightingPreset === 'night' ? 0.2 : 0.8} />
        <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={lightingPreset === 'studio' ? 2.5 : 1.5} />
        <directionalLight position={[-5, 5, -5]} intensity={lightingPreset === 'night' ? 0.1 : 0.5} />
        <Suspense fallback={<CoolLoader />}>
          <Center>
            <Model
              url={modelUrl}
              meshStates={meshStates}
              onMeshesDetected={onMeshesDetected}
              decals={decals}
              selectedDecalId={selectedDecalId}
              setSelectedDecalId={setSelectedDecalId}
              updateDecal={updateDecal}
              removeDecal={removeDecal}
              finish={materialFinish}
              globalPattern={globalPattern}
              mouseFollow={mouseFollow}
            />
          </Center>

          {/* Floating Controls — theme-matched, just above text */}
          {selectedDecal && selectedDecal.worldPoint && (
            <Html
              position={[selectedDecal.worldPoint[0], selectedDecal.worldPoint[1] + 0.06, selectedDecal.worldPoint[2] + 0.02]}
              center
              style={{ pointerEvents: 'none' }}
              zIndexRange={[100, 0]}
            >
              <div className="flex items-center gap-0.5 bg-white rounded-full shadow-lg border border-gray-100 px-1 py-0.5" style={{ whiteSpace: 'nowrap', pointerEvents: 'auto' }}>
                <button
                  onClick={(ev) => { ev.stopPropagation(); updateDecal(selectedDecalId, { decalScale: Math.max(0.03, (selectedDecal.decalScale || 0.15) - 0.02) }); }}
                  className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-[#00b0f0]/10 text-[#00b0f0] text-[11px] font-bold transition-colors"
                >−</button>
                <button
                  onClick={(ev) => { ev.stopPropagation(); updateDecal(selectedDecalId, { decalScale: (selectedDecal.decalScale || 0.15) + 0.02 }); }}
                  className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-[#00b0f0]/10 text-[#00b0f0] text-[11px] font-bold transition-colors"
                >+</button>
                <div className="w-px h-3 bg-gray-200" />
                <button
                  onClick={(ev) => { ev.stopPropagation(); removeDecal(selectedDecalId); }}
                  className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-50 text-red-400 text-[10px] transition-colors"
                >✕</button>
              </div>
            </Html>
          )}

          <Environment preset={lightingPreset || "city"} />
          <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={15} blur={2.5} far={4} />
        </Suspense>
        <CameraController mouseFollow={mouseFollow} />
      </Canvas>
    </div>
  );
};

export default ModelViewer;
