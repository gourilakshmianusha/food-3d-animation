import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Location3DSceneProps {
  className?: string;
}

export const Location3DScene: React.FC<Location3DSceneProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

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
    camera.position.set(0, 2.2, 4.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    container.appendChild(renderer.domElement);

    const cityGroup = new THREE.Group();
    scene.add(cityGroup);

    // Dark slate cobblestone plaza base
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x16181f, roughness: 0.8 });
    const plaza = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 0.12, 48), baseMat);
    plaza.position.y = -0.3;
    cityGroup.add(plaza);

    // Architectural Restaurant Pavilion (Historic Embarcadero brick structure)
    const buildingMat = new THREE.MeshStandardMaterial({ color: 0x2b1e19, roughness: 0.65 });
    const building = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.4, 1.4), buildingMat);
    building.position.set(0, 0.45, -0.2);
    cityGroup.add(building);

    // Gold Arched Entrance Doorway
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });
    const arch = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.04, 16, 24, Math.PI), goldMat);
    arch.position.set(0, 0.35, 0.52);
    cityGroup.add(arch);

    const entranceGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(0.5, 0.6),
      new THREE.MeshBasicMaterial({ color: 0xffa726 })
    );
    entranceGlow.position.set(0, 0.05, 0.51);
    cityGroup.add(entranceGlow);

    // Exterior Street Lanterns with glowing light
    for (let i = -1; i <= 1; i += 2) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.8, 12), goldMat);
      pole.position.set(i * 1.3, 0.1, 0.5);
      cityGroup.add(pole);

      const lamp = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xffd54f })
      );
      lamp.position.set(i * 1.3, 0.52, 0.5);
      cityGroup.add(lamp);

      const light = new THREE.PointLight(0xffb74d, 1.8, 4);
      light.position.set(i * 1.3, 0.52, 0.5);
      cityGroup.add(light);
    }

    // Floating Map Pin Beacon
    const pinGroup = new THREE.Group();
    pinGroup.position.set(0, 1.45, 0);

    const pinHead = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), goldMat);
    pinGroup.add(pinHead);

    const pinTip = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.28, 16), goldMat);
    pinTip.rotation.x = Math.PI;
    pinTip.position.y = -0.16;
    pinGroup.add(pinTip);

    cityGroup.add(pinGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff3e0, 2.2);
    dirLight.position.set(3, 5, 3);
    scene.add(dirLight);

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
      cityGroup.rotation.y = time * 0.2 + targetX * 0.5;

      // Pin hovering bounce
      pinGroup.position.y = 1.45 + Math.sin(time * 2.5) * 0.08;

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
      className={`w-full h-72 sm:h-80 relative pointer-events-none ${className}`}
    />
  );
};
