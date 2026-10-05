import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Hero3DCanvasProps {
  className?: string;
  scrollY?: number;
}

export const Hero3DCanvas: React.FC<Hero3DCanvasProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08090b, 0.05);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.8, 4.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Group for the culinary centerpiece
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // ==========================================
    // GEOMETRIES & MATERIALS: CULINARY CLOCHE & HEARTH DISH
    // ==========================================
    // 1. Serving Charger Plate (Obsidian Slate with Gold Rim)
    const plateGeo = new THREE.CylinderGeometry(1.65, 1.45, 0.12, 64);
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x14161a,
      roughness: 0.25,
      metalness: 0.65,
    });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.position.y = -0.06;
    plate.receiveShadow = true;
    mainGroup.add(plate);

    // Gold Rim on Plate
    const rimGeo = new THREE.TorusGeometry(1.64, 0.035, 16, 64);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.15,
      metalness: 0.95,
      envMapIntensity: 1.5,
    });
    const rim = new THREE.Mesh(rimGeo, goldMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0;
    mainGroup.add(rim);

    // Inner Dish Plinth
    const innerDishGeo = new THREE.CylinderGeometry(1.2, 1.15, 0.05, 48);
    const innerDishMat = new THREE.MeshStandardMaterial({
      color: 0x1f2229,
      roughness: 0.3,
      metalness: 0.4,
    });
    const innerDish = new THREE.Mesh(innerDishGeo, innerDishMat);
    innerDish.position.y = 0.03;
    mainGroup.add(innerDish);

    // 2. The Golden Dome Cloche
    const clocheGroup = new THREE.Group();
    mainGroup.add(clocheGroup);

    // Hemispherical Dome
    const domeGeo = new THREE.SphereGeometry(1.05, 48, 28, 0, Math.PI * 2, 0, Math.PI / 2);
    const clocheMat = new THREE.MeshStandardMaterial({
      color: 0xe0b43f,
      roughness: 0.18,
      metalness: 0.92,
      envMapIntensity: 2.0,
    });
    const dome = new THREE.Mesh(domeGeo, clocheMat);
    dome.position.y = 0.06;
    dome.castShadow = true;
    dome.receiveShadow = true;
    clocheGroup.add(dome);

    // Cloche Rim Base
    const clocheBaseGeo = new THREE.TorusGeometry(1.05, 0.05, 16, 48);
    const clocheBase = new THREE.Mesh(clocheBaseGeo, goldMat);
    clocheBase.rotation.x = Math.PI / 2;
    clocheBase.position.y = 0.06;
    clocheGroup.add(clocheBase);

    // Cloche Handle Stem & Crown Ball
    const handleStemGeo = new THREE.CylinderGeometry(0.045, 0.07, 0.22, 24);
    const handleStem = new THREE.Mesh(handleStemGeo, goldMat);
    handleStem.position.y = 1.18;
    clocheGroup.add(handleStem);

    const handleRingGeo = new THREE.TorusGeometry(0.12, 0.035, 16, 32);
    const handleRing = new THREE.Mesh(handleRingGeo, goldMat);
    handleRing.position.y = 1.34;
    handleRing.rotation.y = Math.PI / 4;
    clocheGroup.add(handleRing);

    // Subtle Laurel Leaves accents on Cloche
    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, 0);
    leafShape.quadraticCurveTo(0.15, 0.15, 0.1, 0.35);
    leafShape.quadraticCurveTo(-0.05, 0.2, 0, 0);
    const extrudeSettings = { depth: 0.02, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.01, bevelThickness: 0.01 };
    const leafGeo = new THREE.ExtrudeGeometry(leafShape, extrudeSettings);
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x4caf50,
      roughness: 0.35,
      metalness: 0.15,
    });

    for (let i = 0; i < 4; i++) {
      const leafMesh = new THREE.Mesh(leafGeo, leafMat);
      const angle = (i * Math.PI) / 2 + 0.3;
      leafMesh.position.set(Math.cos(angle) * 1.02, 0.18, Math.sin(angle) * 1.02);
      leafMesh.rotation.y = -angle;
      leafMesh.rotation.z = 0.3;
      clocheGroup.add(leafMesh);
    }

    // ==========================================
    // FLOATING EMBER PARTICLES & AMBIENT FIRE DUST
    // ==========================================
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);
    const particleVelocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 6;
      particlePositions[i * 3 + 1] = Math.random() * 4 - 0.5;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 5;

      particleVelocities[i * 3] = (Math.random() - 0.5) * 0.003;
      particleVelocities[i * 3 + 1] = 0.004 + Math.random() * 0.008; // float upward
      particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.003;

      particleScales[i] = Math.random() * 0.06 + 0.02;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Custom Canvas Texture for Glowing Ember Dot
    const emberCanvas = document.createElement('canvas');
    emberCanvas.width = 64;
    emberCanvas.height = 64;
    const ctx = emberCanvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 230, 150, 1)');
    grad.addColorStop(0.3, 'rgba(255, 120, 20, 0.85)');
    grad.addColorStop(0.7, 'rgba(212, 80, 0, 0.4)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const emberTexture = new THREE.CanvasTexture(emberCanvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.15,
      map: emberTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ==========================================
    // STUDIO & HEARTH LIGHTING
    // ==========================================
    // 1. Ambient Warm Hearth Fill
    const ambientLight = new THREE.AmbientLight(0xffecd0, 0.9);
    scene.add(ambientLight);

    // 2. Key Light (Warm Amber Golden Directional from top-right)
    const keyLight = new THREE.DirectionalLight(0xffe29a, 3.2);
    keyLight.position.set(4, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // 3. Rim / Counter Light (Cool Obsidian Indigo from rear-left)
    const rimLight = new THREE.DirectionalLight(0x7da4ff, 1.8);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    // 4. Glowing Hearth Point Light underneath
    const emberLight = new THREE.PointLight(0xff5722, 2.5, 6);
    emberLight.position.set(0, -0.4, 0.5);
    scene.add(emberLight);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX = (e.clientX / innerWidth - 0.5) * 2;
      mouseY = (e.clientY / innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Base idle rotation + interactive reaction
      mainGroup.rotation.y = elapsedTime * 0.25 + targetX * 0.6;
      mainGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.06 + targetY * 0.3;
      mainGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.06;

      // Cloche subtle breathing float
      clocheGroup.position.y = Math.sin(elapsedTime * 1.8) * 0.02;

      // Animate floating embers
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += particleVelocities[i * 3 + 1];
        positions[i * 3] += particleVelocities[i * 3] + Math.sin(elapsedTime + i) * 0.001;

        // Reset if drifted above scene
        if (positions[i * 3 + 1] > 3.5) {
          positions[i * 3 + 1] = -0.6;
          positions[i * 3] = (Math.random() - 0.5) * 5;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Pulse ember light
      emberLight.intensity = 2.0 + Math.sin(elapsedTime * 3.5) * 0.6;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      plateGeo.dispose();
      plateMat.dispose();
      domeGeo.dispose();
      clocheMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      emberTexture.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`w-full h-full relative pointer-events-none ${className}`}
      style={{ minHeight: '480px' }}
    />
  );
};
