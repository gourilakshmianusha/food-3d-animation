import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createFoodModel } from './FoodModel';

interface Timeline3DSceneProps {
  currentStage: number; // 0: Origin/Fire, 1: Ingredients/Herbs, 2: Kitchen/Pan, 3: Chef/Plate, 4: Table/Guest
  className?: string;
}

export const Timeline3DScene: React.FC<Timeline3DSceneProps> = ({
  currentStage = 0,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef(currentStage);

  useEffect(() => {
    stageRef.current = currentStage;
  }, [currentStage]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08090b, 0.05);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      60
    );
    camera.position.set(0, 1.6, 4.4);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    container.appendChild(renderer.domElement);

    const timelineGroup = new THREE.Group();
    scene.add(timelineGroup);

    // 5 Spatial Timeline Stations arranged along a virtual journey
    // Station 0: Origin & Fire Embers
    const fireGroup = new THREE.Group();
    fireGroup.position.set(-3.2, 0, 0);
    const fireMat = new THREE.MeshBasicMaterial({ color: 0xff5722 });
    const embers = new THREE.Mesh(new THREE.DodecahedronGeometry(0.35), fireMat);
    fireGroup.add(embers);
    const fireLight = new THREE.PointLight(0xff5722, 3.0, 5);
    fireGroup.add(fireLight);
    timelineGroup.add(fireGroup);

    // Station 1: Ingredients & Wild Herbs
    const ingredientGroup = new THREE.Group();
    ingredientGroup.position.set(-1.6, 0, 0);
    const herbMat = new THREE.MeshStandardMaterial({ color: 0x388e3c, roughness: 0.4 });
    for (let i = 0; i < 5; i++) {
      const leaf = new THREE.Mesh(new THREE.CircleGeometry(0.18, 7), herbMat);
      leaf.position.set((Math.random() - 0.5) * 0.6, Math.random() * 0.5, (Math.random() - 0.5) * 0.6);
      leaf.rotation.set(Math.random(), Math.random(), Math.random());
      ingredientGroup.add(leaf);
    }
    timelineGroup.add(ingredientGroup);

    // Station 2: Kitchen & Copper Sauté Pan
    const panGroup = new THREE.Group();
    panGroup.position.set(0, 0, 0);
    const copperPan = new THREE.Mesh(
      new THREE.CylinderGeometry(0.7, 0.6, 0.16, 32),
      new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.9, roughness: 0.25 })
    );
    panGroup.add(copperPan);
    timelineGroup.add(panGroup);

    // Station 3: Chef Plating & Wagyu Cut
    const chefGroup = new THREE.Group();
    chefGroup.position.set(1.6, 0, 0);
    const steak = createFoodModel('steak');
    steak.scale.set(0.7, 0.7, 0.7);
    chefGroup.add(steak);
    timelineGroup.add(chefGroup);

    // Station 4: The Guest Table & Golden Cloche
    const guestGroup = new THREE.Group();
    guestGroup.position.set(3.2, 0, 0);
    const cloche = createFoodModel('cloche');
    cloche.scale.set(0.75, 0.75, 0.75);
    guestGroup.add(cloche);
    timelineGroup.add(guestGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffecd0, 2.5);
    dirLight.position.set(2, 4, 3);
    scene.add(dirLight);

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
      const st = stageRef.current; // 0 to 4

      // Camera smoothly travels along the timeline to target station position
      const targetX = (st - 2) * 1.6;
      timelineGroup.position.x += (-targetX - timelineGroup.position.x) * 0.08;

      // Rotate active element
      embers.rotation.y = time * 0.6;
      copperPan.rotation.y = time * 0.4;
      cloche.rotation.y = time * 0.3;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
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
      className={`w-full h-72 sm:h-80 relative pointer-events-none ${className}`}
    />
  );
};
