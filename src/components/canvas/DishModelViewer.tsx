import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Sparkles, Sun, Flame } from 'lucide-react';

interface DishModelViewerProps {
  modelType?: 'cloche' | 'steak' | 'burger' | 'pizza' | 'pasta' | 'dessert' | 'beverage' | 'coffee';
  title?: string;
  className?: string;
  autoRotate?: boolean;
}

export const DishModelViewer: React.FC<DishModelViewerProps> = ({
  modelType = 'cloche',
  title = 'Culinary 3D Inspection',
  className = '',
  autoRotate = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lightingMode, setLightingMode] = useState<'hearth' | 'studio' | 'candle'>('hearth');
  const [isRotating, setIsRotating] = useState(autoRotate);
  const lightRef = useRef<{ hearth: THREE.PointLight; key: THREE.DirectionalLight; rim: THREE.DirectionalLight } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0c10, 0.05);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.2, 3.4);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    container.appendChild(renderer.domElement);

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // ==========================================
    // PROCEDURAL MODEL GENERATION ACCORDING TO TYPE
    // ==========================================
    if (modelType === 'burger') {
      // Bottom Bun
      const bBunGeo = new THREE.CylinderGeometry(0.85, 0.8, 0.35, 32);
      const bunMat = new THREE.MeshStandardMaterial({ color: 0xd99b45, roughness: 0.6 });
      const bBun = new THREE.Mesh(bBunGeo, bunMat);
      bBun.position.y = -0.4;
      modelGroup.add(bBun);

      // Beef Patties (Double)
      const pattyGeo = new THREE.CylinderGeometry(0.88, 0.88, 0.22, 32);
      const pattyMat = new THREE.MeshStandardMaterial({ color: 0x3d2015, roughness: 0.8 });
      const patty1 = new THREE.Mesh(pattyGeo, pattyMat);
      patty1.position.y = -0.15;
      modelGroup.add(patty1);

      // Cheese Melt
      const cheeseGeo = new THREE.BoxGeometry(1.6, 0.06, 1.6);
      const cheeseMat = new THREE.MeshStandardMaterial({ color: 0xffa000, roughness: 0.3 });
      const cheese = new THREE.Mesh(cheeseGeo, cheeseMat);
      cheese.position.y = -0.01;
      cheese.rotation.y = 0.4;
      modelGroup.add(cheese);

      const patty2 = new THREE.Mesh(pattyGeo, pattyMat);
      patty2.position.y = 0.14;
      modelGroup.add(patty2);

      // Lettuce Ruffles
      const lettuceGeo = new THREE.TorusGeometry(0.85, 0.08, 12, 32);
      const lettuceMat = new THREE.MeshStandardMaterial({ color: 0x66bb6a, roughness: 0.5 });
      const lettuce = new THREE.Mesh(lettuceGeo, lettuceMat);
      lettuce.rotation.x = Math.PI / 2;
      lettuce.position.y = 0.28;
      modelGroup.add(lettuce);

      // Top Bun (Dome)
      const tBunGeo = new THREE.SphereGeometry(0.88, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2);
      const tBun = new THREE.Mesh(tBunGeo, bunMat);
      tBun.position.y = 0.32;
      modelGroup.add(tBun);

      // Sesame Seeds
      const seedGeo = new THREE.ConeGeometry(0.02, 0.04, 6);
      const seedMat = new THREE.MeshStandardMaterial({ color: 0xfff3e0, roughness: 0.5 });
      for (let i = 0; i < 28; i++) {
        const seed = new THREE.Mesh(seedGeo, seedMat);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * (Math.PI / 3);
        seed.position.set(
          0.88 * Math.sin(phi) * Math.cos(theta),
          0.32 + 0.88 * Math.cos(phi),
          0.88 * Math.sin(phi) * Math.sin(theta)
        );
        seed.rotation.x = phi;
        seed.rotation.y = theta;
        modelGroup.add(seed);
      }
    } else if (modelType === 'pizza') {
      // Crust (Torus)
      const crustGeo = new THREE.TorusGeometry(1.2, 0.16, 16, 48);
      const crustMat = new THREE.MeshStandardMaterial({ color: 0xc88f4b, roughness: 0.7 });
      const crust = new THREE.Mesh(crustGeo, crustMat);
      crust.rotation.x = Math.PI / 2;
      modelGroup.add(crust);

      // Pizza Base with sauce & melted cheese
      const baseGeo = new THREE.CylinderGeometry(1.18, 1.18, 0.08, 48);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0xffcc80, roughness: 0.35 });
      const base = new THREE.Mesh(baseGeo, baseMat);
      modelGroup.add(base);

      // Burrata in Center
      const burrataGeo = new THREE.SphereGeometry(0.38, 24, 18);
      const burrataMat = new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.2 });
      const burrata = new THREE.Mesh(burrataGeo, burrataMat);
      burrata.position.y = 0.25;
      modelGroup.add(burrata);

      // Basil Leaves on Pizza
      const bLeafGeo = new THREE.CircleGeometry(0.14, 8);
      const bLeafMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.4, side: THREE.DoubleSide });
      for (let i = 0; i < 6; i++) {
        const leaf = new THREE.Mesh(bLeafGeo, bLeafMat);
        const angle = (i / 6) * Math.PI * 2 + 0.2;
        leaf.position.set(Math.cos(angle) * 0.75, 0.06, Math.sin(angle) * 0.75);
        leaf.rotation.x = -Math.PI / 2;
        leaf.rotation.z = Math.random();
        modelGroup.add(leaf);
      }
    } else if (modelType === 'dessert') {
      // Charcoal Slate
      const slateGeo = new THREE.BoxGeometry(2.2, 0.08, 2.2);
      const slateMat = new THREE.MeshStandardMaterial({ color: 0x18191c, roughness: 0.3 });
      const slate = new THREE.Mesh(slateGeo, slateMat);
      slate.position.y = -0.4;
      modelGroup.add(slate);

      // Dark Chocolate Sphere
      const sphereGeo = new THREE.SphereGeometry(0.7, 48, 36);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: 0x2b1810,
        roughness: 0.2,
        metalness: 0.1,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.y = 0.3;
      modelGroup.add(sphere);

      // Gold Leaf Flakes
      const goldFlakeGeo = new THREE.CircleGeometry(0.08, 6);
      const goldFlakeMat = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 0.95,
        roughness: 0.15,
        side: THREE.DoubleSide,
      });
      for (let i = 0; i < 8; i++) {
        const flake = new THREE.Mesh(goldFlakeGeo, goldFlakeMat);
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = 0.71;
        flake.position.set(r * Math.sin(phi) * Math.cos(theta), 0.3 + r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
        flake.lookAt(0, 0.3, 0);
        modelGroup.add(flake);
      }
    } else if (modelType === 'beverage') {
      // Rocks Glass
      const glassGeo = new THREE.CylinderGeometry(0.65, 0.55, 1.2, 32, 1, true);
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.92,
        opacity: 1,
        transparent: true,
        roughness: 0.05,
        ior: 1.5,
      });
      const glass = new THREE.Mesh(glassGeo, glassMat);
      modelGroup.add(glass);

      // Amber Liquid
      const liquidGeo = new THREE.CylinderGeometry(0.62, 0.52, 0.7, 32);
      const liquidMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.1,
        transparent: true,
        opacity: 0.85,
      });
      const liquid = new THREE.Mesh(liquidGeo, liquidMat);
      liquid.position.y = -0.22;
      modelGroup.add(liquid);

      // Carved Ice Sphere
      const iceGeo = new THREE.SphereGeometry(0.38, 24, 24);
      const iceMat = new THREE.MeshPhysicalMaterial({
        color: 0xe0f7fa,
        transmission: 0.9,
        transparent: true,
        roughness: 0.08,
      });
      const ice = new THREE.Mesh(iceGeo, iceMat);
      ice.position.y = -0.05;
      modelGroup.add(ice);
    } else {
      // Signature Dish & Cloche Default
      const plateGeo = new THREE.CylinderGeometry(1.4, 1.2, 0.1, 48);
      const plateMat = new THREE.MeshStandardMaterial({ color: 0x14161a, roughness: 0.3, metalness: 0.7 });
      const plate = new THREE.Mesh(plateGeo, plateMat);
      plate.position.y = -0.2;
      modelGroup.add(plate);

      const clocheGeo = new THREE.SphereGeometry(0.95, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2);
      const clocheMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.16,
        metalness: 0.92,
      });
      const cloche = new THREE.Mesh(clocheGeo, clocheMat);
      cloche.position.y = -0.12;
      modelGroup.add(cloche);

      const stemGeo = new THREE.CylinderGeometry(0.04, 0.06, 0.2, 16);
      const stem = new THREE.Mesh(stemGeo, clocheMat);
      stem.position.y = 0.92;
      modelGroup.add(stem);

      const ballGeo = new THREE.SphereGeometry(0.1, 16, 16);
      const ball = new THREE.Mesh(ballGeo, clocheMat);
      ball.position.y = 1.05;
      modelGroup.add(ball);
    }

    // ==========================================
    // LIGHTING SYSTEM
    // ==========================================
    const ambientLight = new THREE.AmbientLight(0xfff5eb, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffecd0, 2.5);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x82b1ff, 1.2);
    rimLight.position.set(-3, 2, -3);
    scene.add(rimLight);

    const hearthLight = new THREE.PointLight(0xff5722, 2.0, 6);
    hearthLight.position.set(0, -0.6, 0.5);
    scene.add(hearthLight);

    lightRef.current = { hearth: hearthLight, key: keyLight, rim: rimLight };

    // Mouse drag orbit controls
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      modelGroup.rotation.y += deltaX * 0.01;
      modelGroup.rotation.x = Math.max(-0.5, Math.min(0.8, modelGroup.rotation.x + deltaY * 0.01));

      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch orbit support for mobile
    let touchStart = { x: 0, y: 0 };
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - touchStart.x;
        const deltaY = e.touches[0].clientY - touchStart.y;
        modelGroup.rotation.y += deltaX * 0.015;
        modelGroup.rotation.x = Math.max(-0.5, Math.min(0.8, modelGroup.rotation.x + deltaY * 0.015));
        touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    domEl.addEventListener('touchstart', onTouchStart, { passive: true });
    domEl.addEventListener('touchmove', onTouchMove, { passive: true });

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (isRotating && !isDragging) {
        modelGroup.rotation.y += delta * 0.45;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domEl.removeEventListener('touchstart', onTouchStart);
      domEl.removeEventListener('touchmove', onTouchMove);
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelType, isRotating]);

  // Adjust lights based on selected preset
  useEffect(() => {
    if (!lightRef.current) return;
    const { hearth, key, rim } = lightRef.current;
    if (lightingMode === 'hearth') {
      hearth.intensity = 2.8;
      hearth.color.setHex(0xff5722);
      key.intensity = 2.2;
      rim.intensity = 1.0;
    } else if (lightingMode === 'studio') {
      hearth.intensity = 0.5;
      key.intensity = 3.5;
      key.color.setHex(0xffffff);
      rim.intensity = 2.0;
    } else {
      // Candlelight
      hearth.intensity = 3.2;
      hearth.color.setHex(0xff8f00);
      key.intensity = 1.2;
      rim.intensity = 0.4;
    }
  }, [lightingMode]);

  return (
    <div className={`relative rounded-xl overflow-hidden glass-dark border border-gold-subtle ${className}`}>
      {/* 3D Canvas Container */}
      <div ref={containerRef} className="w-full h-72 md:h-80 cursor-grab active:cursor-grabbing" />

      {/* Control Overlay HUD */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
        <span className="text-xs uppercase tracking-widest text-[#d4af37] font-medium bg-black/50 px-2.5 py-1 rounded backdrop-blur">
          3D Interactive • Drag to Rotate
        </span>
        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`p-1.5 rounded transition-colors text-xs flex items-center gap-1 ${
            isRotating ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-white/10 text-slate-300'
          }`}
          title="Toggle Auto Rotation"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Lighting Preset Switcher Bottom */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
        <span className="text-[11px] text-slate-400">Lighting Mood:</span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setLightingMode('hearth')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
              lightingMode === 'hearth' ? 'bg-[#e65100] text-white shadow-sm' : 'hover:text-white'
            }`}
          >
            Hearth Fire
          </button>
          <button
            onClick={() => setLightingMode('candle')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
              lightingMode === 'candle' ? 'bg-[#ff8f00] text-white shadow-sm' : 'hover:text-white'
            }`}
          >
            Candlelight
          </button>
          <button
            onClick={() => setLightingMode('studio')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
              lightingMode === 'studio' ? 'bg-slate-700 text-white shadow-sm' : 'hover:text-white'
            }`}
          >
            Daylight Studio
          </button>
        </div>
      </div>
    </div>
  );
};
