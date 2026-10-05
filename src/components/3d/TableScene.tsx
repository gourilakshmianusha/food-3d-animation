import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createFoodModel } from './FoodModel';

interface TableSceneProps {
  className?: string;
  guestCount?: number;
  interactive?: boolean;
}

export const TableScene: React.FC<TableSceneProps> = ({
  className = '',
  guestCount = 2,
  interactive = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08090b, 0.06);

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      50
    );
    camera.position.set(0, 1.8, 3.8);

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

    const tableGroup = new THREE.Group();
    scene.add(tableGroup);

    // 1. Walnut Dining Table Top
    const tableGeo = new THREE.CylinderGeometry(2.2, 2.2, 0.12, 48);
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x1a1512,
      roughness: 0.4,
      metalness: 0.2,
    });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.y = -0.4;
    tableGroup.add(table);

    // Table Runner Cloth
    const runnerGeo = new THREE.BoxGeometry(1.2, 0.02, 2.3);
    const runnerMat = new THREE.MeshStandardMaterial({
      color: 0x0f1115,
      roughness: 0.8,
    });
    const runner = new THREE.Mesh(runnerGeo, runnerMat);
    runner.position.y = -0.33;
    tableGroup.add(runner);

    // Centerpiece: Glowing Candle with flickering flame
    const candleStand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.16, 0.25, 24),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 })
    );
    candleStand.position.set(0, -0.2, 0);
    tableGroup.add(candleStand);

    const candleWax = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.4, 24),
      new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.3 })
    );
    candleWax.position.set(0, 0.12, 0);
    tableGroup.add(candleWax);

    const flameMat = new THREE.MeshBasicMaterial({ color: 0xffa000 });
    const flame = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), flameMat);
    flame.scale.set(0.7, 1.8, 0.7);
    flame.position.set(0, 0.38, 0);
    tableGroup.add(flame);

    const candleLight = new THREE.PointLight(0xffb74d, 2.8, 6);
    candleLight.position.set(0, 0.42, 0);
    tableGroup.add(candleLight);

    // Table Place Settings (Based on guest count)
    const settingsCount = Math.min(4, Math.max(1, guestCount));
    for (let i = 0; i < settingsCount; i++) {
      const angle = (i / settingsCount) * Math.PI * 2;
      const radius = 1.35;
      const settingGroup = new THREE.Group();
      settingGroup.position.set(Math.cos(angle) * radius, -0.32, Math.sin(angle) * radius);
      settingGroup.rotation.y = -angle + Math.PI / 2;

      // Porcelain Plate
      const plate = createFoodModel('plate');
      plate.scale.set(0.65, 0.65, 0.65);
      settingGroup.add(plate);

      // Wine Glass
      const glass = createFoodModel('wine');
      glass.scale.set(0.55, 0.55, 0.55);
      glass.position.set(0.4, 0.25, -0.2);
      settingGroup.add(glass);

      // Cutlery Set
      const cutlery = createFoodModel('cutlery');
      cutlery.scale.set(0.45, 0.45, 0.45);
      cutlery.position.set(0, 0.05, 0);
      settingGroup.add(cutlery);

      tableGroup.add(settingGroup);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffe082, 2.0);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x7da4ff, 1.2);
    rimLight.position.set(-3, 3, -3);
    scene.add(rimLight);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
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
      targetY += (mouseY - targetY) * 0.05;

      tableGroup.rotation.y = time * 0.15 + targetX * 0.4;
      camera.position.y = 1.8 + targetY * 0.2;
      camera.lookAt(0, -0.1, 0);

      // Candle flicker
      flame.scale.y = 1.6 + Math.sin(time * 12) * 0.3;
      flame.position.x = Math.sin(time * 15) * 0.015;
      candleLight.intensity = 2.5 + Math.sin(time * 10) * 0.5;

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
  }, [guestCount, interactive]);

  return (
    <div
      ref={mountRef}
      className={`w-full h-full relative pointer-events-none ${className}`}
      style={{ minHeight: '380px' }}
    />
  );
};
