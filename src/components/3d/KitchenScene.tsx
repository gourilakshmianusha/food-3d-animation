import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface KitchenSceneProps {
  className?: string;
  activeStation?: number;
}

export const KitchenScene: React.FC<KitchenSceneProps> = ({ className = '', activeStation = 0 }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const stationRef = useRef(activeStation);

  useEffect(() => {
    stationRef.current = activeStation;
  }, [activeStation]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08090b, 0.05);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      50
    );
    camera.position.set(0, 1.4, 4.0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    container.appendChild(renderer.domElement);

    const kitchenGroup = new THREE.Group();
    scene.add(kitchenGroup);

    // 1. Stainless Steel Cooking Counter
    const counterMat = new THREE.MeshStandardMaterial({
      color: 0x22262e,
      roughness: 0.35,
      metalness: 0.85,
    });
    const counter = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.15, 1.8), counterMat);
    counter.position.y = -0.3;
    kitchenGroup.add(counter);

    // 2. Copper Sauté Pan
    const copperMat = new THREE.MeshStandardMaterial({
      color: 0xb87333,
      roughness: 0.25,
      metalness: 0.9,
    });
    const pan = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.7, 0.18, 36), copperMat);
    pan.position.set(-1.1, -0.14, 0);
    kitchenGroup.add(pan);

    const panHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.1, 16), counterMat);
    panHandle.position.set(-1.1, -0.05, 0.9);
    panHandle.rotation.x = Math.PI / 2.2;
    kitchenGroup.add(panHandle);

    // 3. Wooden Butcher Block
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x5d4037,
      roughness: 0.7,
      metalness: 0.1,
    });
    const block = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.14, 0.9), woodMat);
    block.position.set(0.9, -0.15, 0);
    kitchenGroup.add(block);

    // Chef's Damascus Knife on Board
    const knifeMat = new THREE.MeshStandardMaterial({ color: 0xe0e0e0, metalness: 0.95, roughness: 0.1 });
    const knifeBlade = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.015, 0.7), knifeMat);
    knifeBlade.position.set(0.9, -0.06, 0);
    knifeBlade.rotation.y = 0.3;
    kitchenGroup.add(knifeBlade);

    // Fresh Rosemary / Herb sprigs
    const herbMat = new THREE.MeshStandardMaterial({ color: 0x388e3c, roughness: 0.4 });
    for (let i = 0; i < 4; i++) {
      const herb = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.45, 8), herbMat);
      herb.position.set(0.6 + i * 0.15, -0.06, 0.2);
      herb.rotation.z = Math.PI / 4;
      kitchenGroup.add(herb);
    }

    // 4. Steam particles rising from the pan
    const steamCount = 35;
    const steamGeo = new THREE.BufferGeometry();
    const steamPos = new Float32Array(steamCount * 3);
    for (let i = 0; i < steamCount; i++) {
      steamPos[i * 3] = -1.1 + (Math.random() - 0.5) * 0.7;
      steamPos[i * 3 + 1] = 0.1 + Math.random() * 1.5;
      steamPos[i * 3 + 2] = (Math.random() - 0.5) * 0.7;
    }
    steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPos, 3));
    const steamMat = new THREE.PointsMaterial({
      size: 0.12,
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
    });
    const steam = new THREE.Points(steamGeo, steamMat);
    kitchenGroup.add(steam);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffecd0, 0.8);
    scene.add(ambientLight);

    const warmHearthLight = new THREE.PointLight(0xff6f00, 3.0, 7);
    warmHearthLight.position.set(-1.1, -0.1, 0);
    scene.add(warmHearthLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(2, 4, 3);
    scene.add(keyLight);

    let mouseX = 0;
    let targetX = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 1.5;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      targetX += (mouseX - targetX) * 0.05;

      // Animate camera according to active chef station (0 to 4)
      const targetCamX = (stationRef.current - 2) * 0.6 + targetX * 0.5;
      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.lookAt(0, 0, 0);

      // Steam float
      const pos = steamGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < steamCount; i++) {
        pos[i * 3 + 1] += 0.006;
        if (pos[i * 3 + 1] > 1.8) {
          pos[i * 3 + 1] = 0.1;
          pos[i * 3] = -1.1 + (Math.random() - 0.5) * 0.6;
        }
      }
      steamGeo.attributes.position.needsUpdate = true;

      // Pan gentle warmth flicker
      warmHearthLight.intensity = 2.4 + Math.sin(time * 6) * 0.6;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`w-full h-full relative pointer-events-none ${className}`}
      style={{ minHeight: '380px' }}
    />
  );
};
