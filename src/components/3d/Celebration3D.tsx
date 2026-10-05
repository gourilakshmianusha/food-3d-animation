import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Celebration3DProps {
  className?: string;
}

export const Celebration3D: React.FC<Celebration3DProps> = ({ className = '' }) => {
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
    camera.position.set(0, 1.4, 3.6);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Plate Plinth
    const plateMat = new THREE.MeshStandardMaterial({ color: 0x14161a, roughness: 0.3, metalness: 0.7 });
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.2, 0.1, 48), plateMat);
    plate.position.y = -0.3;
    group.add(plate);

    // Golden Cloche Dome that rises upward celebrating
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.95,
      roughness: 0.15,
    });
    const cloche = new THREE.Mesh(
      new THREE.SphereGeometry(0.95, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2),
      goldMat
    );
    group.add(cloche);

    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.2, 16), goldMat);
    stem.position.y = 1.0;
    cloche.add(stem);

    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), goldMat);
    ball.position.y = 1.15;
    cloche.add(ball);

    // Swirling golden particle vortex inside
    const particleCount = 70;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.8;
      particlePos[i * 3] = Math.cos(angle) * radius;
      particlePos[i * 3 + 1] = Math.random() * 1.2 - 0.2;
      particlePos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.08,
      color: 0xffd54f,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    const vortex = new THREE.Points(particleGeo, particleMat);
    group.add(vortex);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.85);
    scene.add(ambientLight);

    const goldPoint = new THREE.PointLight(0xffb300, 3.5, 6);
    goldPoint.position.set(0, 0.3, 0);
    group.add(goldPoint);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
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

      // Lift cloche up and hover
      cloche.position.y = 0.4 + Math.sin(time * 2) * 0.1;
      group.rotation.y = time * 0.35;

      // Swirl vortex
      vortex.rotation.y = -time * 1.2;

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
      className={`w-full h-52 sm:h-60 relative pointer-events-none ${className}`}
    />
  );
};
