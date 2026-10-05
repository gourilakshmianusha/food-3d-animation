import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createFoodModel, FoodType } from './FoodModel';

interface MenuHero3DProps {
  category: string;
  onSelectCategory?: (category: string) => void;
  className?: string;
}

export const MenuHero3D: React.FC<MenuHero3DProps> = ({
  category,
  onSelectCategory,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const currentCategoryRef = useRef(category);

  useEffect(() => {
    currentCategoryRef.current = category;
  }, [category]);

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

    container.appendChild(renderer.domElement);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Map culinary category to 3D food model type
    const categoryToFoodMap: Record<string, FoodType> = {
      Continental: 'steak',
      'Main Course': 'steak',
      Starters: 'cloche',
      Italian: 'pasta',
      Pasta: 'pasta',
      Pizza: 'pizza',
      Burgers: 'burger',
      Desserts: 'dessert',
      Beverages: 'beverage',
      Coffee: 'coffee',
      Indian: 'cloche',
      Soups: 'cloche',
      Salads: 'cloche',
      'Special Offers': 'cloche',
    };

    let activeModelGroup: THREE.Group | null = null;

    const switchDishModel = (cat: string) => {
      if (activeModelGroup) {
        mainGroup.remove(activeModelGroup);
      }
      const foodType = categoryToFoodMap[cat] || 'cloche';
      activeModelGroup = createFoodModel(foodType);
      activeModelGroup.scale.set(0.9, 0.9, 0.9);
      mainGroup.add(activeModelGroup);
    };

    switchDishModel(category);

    // Three-point Lighting
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffecd0, 2.5);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x7da4ff, 1.2);
    rimLight.position.set(-3, 2, -3);
    scene.add(rimLight);

    const hearthGlow = new THREE.PointLight(0xff6f00, 2.2, 6);
    hearthGlow.position.set(0, -0.4, 0);
    scene.add(hearthGlow);

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

    let previousCat = category;
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Check for category change
      if (currentCategoryRef.current !== previousCat) {
        previousCat = currentCategoryRef.current;
        switchDishModel(previousCat);
        // Animate camera pulse on category switch
        camera.position.z = 4.4;
      }

      camera.position.z += (4.0 - camera.position.z) * 0.05;

      targetX += (mouseX - targetX) * 0.05;
      mainGroup.rotation.y = time * 0.35 + targetX * 0.5;
      mainGroup.position.y = Math.sin(time * 1.5) * 0.04;

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
      className={`w-full h-72 sm:h-96 relative pointer-events-none ${className}`}
    />
  );
};
