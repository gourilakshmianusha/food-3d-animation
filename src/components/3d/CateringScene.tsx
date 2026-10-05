import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createFoodModel } from './FoodModel';

interface CateringSceneProps {
  className?: string;
  stage?: number; // 1 to 4
}

export const CateringScene: React.FC<CateringSceneProps> = ({ className = '', stage = 1 }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef(stage);

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

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
    camera.position.set(0, 1.8, 4.4);

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

    // Banquet Buffet Table with Dark Linen
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x14161b, roughness: 0.7 });
    const table = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.2, 1.6), tableMat);
    table.position.y = -0.4;
    tableGroup.add(table);

    // Gold Trim runner
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });
    const runner = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.02, 0.5), goldMat);
    runner.position.set(0, -0.28, 0);
    tableGroup.add(runner);

    // 4 Progressive Banquet Dishes
    // Dish 1: Seared Wagyu Roast (Left)
    const dish1 = createFoodModel('steak');
    dish1.position.set(-1.5, -0.15, 0);
    dish1.scale.set(0.85, 0.85, 0.85);
    tableGroup.add(dish1);

    // Dish 2: Centerpiece Cloche (Center)
    const dish2 = createFoodModel('cloche');
    dish2.position.set(0, -0.15, 0);
    dish2.scale.set(0.9, 0.9, 0.9);
    tableGroup.add(dish2);

    // Dish 3: Neapolitan Pizza / Sourdough (Right)
    const dish3 = createFoodModel('pizza');
    dish3.position.set(1.5, -0.15, 0);
    dish3.scale.set(0.8, 0.8, 0.8);
    tableGroup.add(dish3);

    // Dish 4: Artisanal Dessert / Drinks (Flanking)
    const dish4 = createFoodModel('dessert');
    dish4.position.set(0.7, -0.15, -0.4);
    dish4.scale.set(0.65, 0.65, 0.65);
    tableGroup.add(dish4);

    const dishList = [dish1, dish2, dish3, dish4];

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.8);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xfff3e0, 3.5, 10, Math.PI / 4, 0.4);
    spotLight.position.set(0, 4, 3);
    scene.add(spotLight);

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
      const currentStage = stageRef.current;

      targetX += (mouseX - targetX) * 0.05;
      tableGroup.rotation.y = Math.sin(time * 0.25) * 0.15 + targetX * 0.3;

      // Progressive reveal and scale of dishes based on stage
      dishList.forEach((d, idx) => {
        const visible = idx + 1 <= currentStage;
        const targetScale = visible ? 1 : 0.001;
        d.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
      });

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
