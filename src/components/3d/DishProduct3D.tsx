import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { createFoodModel, FoodType } from './FoodModel';
import { Sparkles, Compass, Eye, RotateCw } from 'lucide-react';

interface DishProduct3DProps {
  foodType: FoodType;
  dishName: string;
  ingredients: string[];
  isExploring?: boolean;
  onToggleExplore?: () => void;
  className?: string;
}

export const DishProduct3D: React.FC<DishProduct3DProps> = ({
  foodType,
  dishName,
  ingredients,
  isExploring = false,
  onToggleExplore,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [internalExploring, setInternalExploring] = useState(isExploring);
  const exploring = isExploring ?? internalExploring;

  useEffect(() => {
    setInternalExploring(isExploring);
  }, [isExploring]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 4.2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 1.2);
    scene.add(ambientLight);

    // Warm key light
    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.8);
    keyLight.position.set(3, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Amber rim light
    const rimLight = new THREE.DirectionalLight(0xd4af37, 2.2);
    rimLight.position.set(-3, 3, -2.5);
    scene.add(rimLight);

    // Subtle blue fill for contrast
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.6);
    fillLight.position.set(0, -2, 2);
    scene.add(fillLight);

    // Center plinth / pedestal
    const pedestalGeo = new THREE.CylinderGeometry(2, 2.2, 0.25, 48);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x111317,
      roughness: 0.35,
      metalness: 0.8,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -0.55;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    // Gold rim on plinth
    const plinthRim = new THREE.Mesh(
      new THREE.TorusGeometry(2.02, 0.025, 16, 48),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.15 })
    );
    plinthRim.rotation.x = Math.PI / 2;
    plinthRim.position.y = -0.42;
    scene.add(plinthRim);

    // The Food Model Group
    const foodGroup = new THREE.Group();
    const model = createFoodModel(foodType);
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    foodGroup.add(model);
    scene.add(foodGroup);

    // Floating Ingredient Particles (micro herbs, gold flakes, sea salt)
    const particleCount = 45;
    const particleGeo = new THREE.DodecahedronGeometry(0.04, 0);
    const goldLeafMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.95,
      roughness: 0.1,
    });
    const herbMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      roughness: 0.8,
    });

    const ingredientParticles: {
      mesh: THREE.Mesh;
      basePos: THREE.Vector3;
      speed: number;
      offset: number;
      orbitRadius: number;
      orbitSpeed: number;
    }[] = [];

    const particlesGroup = new THREE.Group();
    for (let i = 0; i < particleCount; i++) {
      const isGold = i % 2 === 0;
      const mesh = new THREE.Mesh(particleGeo, isGold ? goldLeafMat : herbMat);
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 1.2 + (i % 5) * 0.25;
      const y = -0.2 + (i % 6) * 0.25;
      mesh.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      particlesGroup.add(mesh);

      ingredientParticles.push({
        mesh,
        basePos: mesh.position.clone(),
        speed: 0.5 + Math.random() * 0.8,
        offset: Math.random() * Math.PI * 2,
        orbitRadius: radius,
        orbitSpeed: 0.005 + (i % 3) * 0.003,
      });
    }
    scene.add(particlesGroup);

    // Interactive mouse tracking
    let targetRotY = 0;
    let targetRotX = 0;
    let targetCamDist = 4.2;
    let currentCamDist = 4.2;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetRotY = nx * 0.6;
      targetRotX = -ny * 0.35;
    };

    const handleMouseLeave = () => {
      targetRotY = 0;
      targetRotX = 0;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Camera target distance based on explore mode
      targetCamDist = exploring ? 2.6 : 4.0;
      currentCamDist += (targetCamDist - currentCamDist) * 0.05;

      // Base slow orbit
      const baseAngle = elapsed * 0.25;
      camera.position.x = Math.sin(baseAngle + targetRotY) * currentCamDist;
      camera.position.z = Math.cos(baseAngle + targetRotY) * currentCamDist;
      camera.position.y = (exploring ? 1.1 : 1.6) + targetRotX * 1.2;
      camera.lookAt(0, exploring ? 0.3 : 0.15, 0);

      // Food subtle floating
      foodGroup.position.y = Math.sin(elapsed * 1.5) * 0.04;

      // Floating ingredients behavior
      ingredientParticles.forEach((p, idx) => {
        const time = elapsed * p.speed + p.offset;
        const currentRadius = exploring ? p.orbitRadius * 1.45 : p.orbitRadius;
        const angle = (idx / particleCount) * Math.PI * 2 + elapsed * p.orbitSpeed;
        p.mesh.position.x = Math.cos(angle) * currentRadius;
        p.mesh.position.z = Math.sin(angle) * currentRadius;
        p.mesh.position.y = p.basePos.y + Math.sin(time) * (exploring ? 0.35 : 0.12) + (exploring ? 0.4 : 0);
        p.mesh.rotation.x += 0.015;
        p.mesh.rotation.y += 0.02;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      renderer.dispose();
      scene.clear();
    };
  }, [foodType, exploring]);

  const toggleHandler = () => {
    if (onToggleExplore) {
      onToggleExplore();
    } else {
      setInternalExploring((prev) => !prev);
    }
  };

  return (
    <div className={`relative rounded-3xl overflow-hidden glass-dark border border-gold-subtle shadow-2xl ${className}`}>
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-80 sm:h-[460px] cursor-grab active:cursor-grabbing" />

      {/* Atmospheric Overlays */}
      <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
        <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur border border-gold-subtle text-[11px] text-[#d4af37] font-mono flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#d4af37]" />
          3D Kinetic Plating
        </span>
        <span className="hidden sm:inline-block px-2.5 py-1 rounded bg-black/40 backdrop-blur text-[10px] text-slate-300 font-mono">
          Orbiting at 60 FPS
        </span>
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={toggleHandler}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide flex items-center gap-1.5 transition-all shadow-lg ${
            exploring
              ? 'bg-[#d4af37] text-black font-semibold'
              : 'bg-black/70 backdrop-blur border border-white/20 text-white hover:border-[#d4af37] hover:text-[#d4af37]'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>{exploring ? 'Close Macro View' : 'Explore Dish'}</span>
        </button>
      </div>

      {/* Bottom Interactive Guide */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none text-[11px] text-slate-300">
        <span className="bg-black/60 px-2.5 py-1 rounded backdrop-blur border border-white/10 font-mono">
          {exploring ? '✦ Deconstructed Gastronomy Macro View' : 'Drag mouse to tilt perspective'}
        </span>
        <span className="hidden sm:inline-block bg-black/60 px-2.5 py-1 rounded backdrop-blur border border-white/10 text-[#d4af37] font-mono">
          {dishName}
        </span>
      </div>
    </div>
  );
};
