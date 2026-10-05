import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createFoodModel } from './FoodModel';

interface EventSceneProps {
  className?: string;
  eventType?: 'Birthday' | 'Corporate' | 'Private Dining' | 'Wedding' | 'Party';
}

export const EventScene: React.FC<EventSceneProps> = ({ className = '', eventType = 'Birthday' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef(eventType);

  useEffect(() => {
    typeRef.current = eventType;
  }, [eventType]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08090b, 0.05);

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      50
    );
    camera.position.set(0, 1.6, 4.0);

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

    const eventGroup = new THREE.Group();
    scene.add(eventGroup);

    // Event Plinth
    const plinthMat = new THREE.MeshStandardMaterial({ color: 0x14161a, roughness: 0.35 });
    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 0.14, 48), plinthMat);
    plinth.position.y = -0.4;
    eventGroup.add(plinth);

    // 1. Birthday Setup (Tiered Cake + Floating Golden Balloons)
    const birthdayGroup = new THREE.Group();
    const cake = createFoodModel('cake');
    cake.position.set(0, 0, 0);
    birthdayGroup.add(cake);

    // Floating metallic balloons
    const balloonMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.15,
    });
    for (let i = 0; i < 5; i++) {
      const balloon = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 24), balloonMat);
      const angle = (i / 5) * Math.PI * 2;
      balloon.position.set(Math.cos(angle) * 1.1, 0.9 + Math.random() * 0.4, Math.sin(angle) * 1.1);
      birthdayGroup.add(balloon);
    }
    eventGroup.add(birthdayGroup);

    // 2. Corporate Setup (Conference plinth + crystal glasses)
    const corporateGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const glass = createFoodModel('wine');
      glass.position.set(Math.cos(angle) * 0.8, -0.1, Math.sin(angle) * 0.8);
      glass.scale.set(0.6, 0.6, 0.6);
      corporateGroup.add(glass);
    }
    const centerDecanter = createFoodModel('beverage');
    centerDecanter.position.set(0, 0, 0);
    centerDecanter.scale.set(0.8, 0.8, 0.8);
    corporateGroup.add(centerDecanter);
    eventGroup.add(corporateGroup);

    // 3. Wedding / Party Setup (Center Cloche + Ring of Cutlery and Petals)
    const partyGroup = new THREE.Group();
    const cloche = createFoodModel('cloche');
    cloche.position.set(0, -0.1, 0);
    partyGroup.add(cloche);

    const petalMat = new THREE.MeshStandardMaterial({ color: 0xe91e63, roughness: 0.3 });
    for (let i = 0; i < 12; i++) {
      const petal = new THREE.Mesh(new THREE.CircleGeometry(0.08, 6), petalMat);
      petal.rotation.x = -Math.PI / 2;
      petal.position.set((Math.random() - 0.5) * 1.8, -0.32, (Math.random() - 0.5) * 1.8);
      partyGroup.add(petal);
    }
    eventGroup.add(partyGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.9);
    scene.add(ambientLight);

    const warmLight = new THREE.PointLight(0xffa726, 3.2, 8);
    warmLight.position.set(0, 1.8, 0);
    scene.add(warmLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(3, 4, 3);
    scene.add(dirLight);

    let mouseX = 0;
    let targetX = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 1.2;
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
      const currentType = typeRef.current;

      targetX += (mouseX - targetX) * 0.05;
      eventGroup.rotation.y = time * 0.2 + targetX * 0.4;

      // Visibility based on type
      const isBirthday = currentType === 'Birthday';
      const isCorporate = currentType === 'Corporate';
      const isParty = currentType === 'Wedding' || currentType === 'Party' || currentType === 'Private Dining';

      birthdayGroup.scale.lerp(new THREE.Vector3(isBirthday ? 1 : 0.001, isBirthday ? 1 : 0.001, isBirthday ? 1 : 0.001), 0.1);
      corporateGroup.scale.lerp(new THREE.Vector3(isCorporate ? 1 : 0.001, isCorporate ? 1 : 0.001, isCorporate ? 1 : 0.001), 0.1);
      partyGroup.scale.lerp(new THREE.Vector3(isParty ? 1 : 0.001, isParty ? 1 : 0.001, isParty ? 1 : 0.001), 0.1);

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
