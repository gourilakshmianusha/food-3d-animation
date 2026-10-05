import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Book3DSceneProps {
  className?: string;
  scrollProgress?: number;
}

export const Book3DScene: React.FC<Book3DSceneProps> = ({ className = '', scrollProgress = 0 }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const progRef = useRef(scrollProgress);

  useEffect(() => {
    progRef.current = scrollProgress;
  }, [scrollProgress]);

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
    camera.position.set(0, 1.4, 3.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    container.appendChild(renderer.domElement);

    const bookGroup = new THREE.Group();
    scene.add(bookGroup);

    // Book Cover & Spine (Leather embossed with gold)
    const coverMat = new THREE.MeshStandardMaterial({ color: 0x1f1915, roughness: 0.6 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });

    // Left Cover
    const leftCover = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.04, 1.7), coverMat);
    leftCover.position.set(-0.62, 0, 0);
    bookGroup.add(leftCover);

    // Right Cover
    const rightCover = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.04, 1.7), coverMat);
    rightCover.position.set(0.62, 0, 0);
    bookGroup.add(rightCover);

    // Spine
    const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.7, 16), goldMat);
    spine.rotation.x = Math.PI / 2;
    bookGroup.add(spine);

    // Inner Parchment Pages
    const paperMat = new THREE.MeshStandardMaterial({ color: 0xf5eedb, roughness: 0.5 });
    const leftPages = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.08, 1.62), paperMat);
    leftPages.position.set(-0.6, 0.05, 0);
    bookGroup.add(leftPages);

    const rightPages = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.08, 1.62), paperMat);
    rightPages.position.set(0.6, 0.05, 0);
    bookGroup.add(rightPages);

    // Turning Page (Dynamic leaf that flips across)
    const turningPageGroup = new THREE.Group();
    turningPageGroup.position.set(0, 0.08, 0);
    const turningPage = new THREE.Mesh(new THREE.BoxGeometry(1.14, 0.005, 1.6), paperMat);
    turningPage.position.set(0.57, 0, 0);
    turningPageGroup.add(turningPage);
    bookGroup.add(turningPageGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.85);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffecd0, 3.2, 8, Math.PI / 3);
    spotLight.position.set(2, 4, 3);
    scene.add(spotLight);

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

      targetX += (mouseX - targetX) * 0.05;

      // Floating gentle tilt
      bookGroup.rotation.y = Math.sin(time * 0.4) * 0.15 + targetX * 0.3;
      bookGroup.rotation.x = 0.4 + Math.sin(time * 0.6) * 0.04;
      bookGroup.position.y = Math.sin(time * 1.2) * 0.05;

      // Dynamic page turn simulation based on scroll or time
      const pageAngle = -Math.PI + ((Math.sin(time * 0.8) + 1) / 2) * Math.PI;
      turningPageGroup.rotation.z = pageAngle;

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
