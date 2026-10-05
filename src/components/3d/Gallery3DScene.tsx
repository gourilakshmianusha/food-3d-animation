import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GalleryItem } from '../../types';

interface Gallery3DSceneProps {
  items: GalleryItem[];
  onSelectImage: (index: number) => void;
  className?: string;
}

export const Gallery3DScene: React.FC<Gallery3DSceneProps> = ({
  items,
  onSelectImage,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef(items);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08090b, 0.04);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      60
    );
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    container.appendChild(renderer.domElement);

    const galleryGroup = new THREE.Group();
    scene.add(galleryGroup);

    // Create 3D floating picture frames in a curving amphitheater formation
    const textureLoader = new THREE.TextureLoader();
    const frameMeshes: THREE.Mesh[] = [];
    const displayCount = Math.min(items.length, 12);

    for (let i = 0; i < displayCount; i++) {
      const item = items[i];
      const angle = (i / displayCount) * Math.PI * 2;
      const radius = 3.6;

      const frameGeo = new THREE.BoxGeometry(1.6, 1.1, 0.06);

      // Frame texture or placeholder
      const texture = textureLoader.load(item.image);
      const mat = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.2,
      });

      const frame = new THREE.Mesh(frameGeo, mat);
      frame.position.set(Math.cos(angle) * radius, (Math.random() - 0.5) * 0.8, Math.sin(angle) * radius);
      frame.lookAt(0, frame.position.y * 0.3, 0);

      // Gold rim border
      const border = new THREE.Mesh(
        new THREE.BoxGeometry(1.66, 1.16, 0.04),
        new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.2 })
      );
      frame.add(border);

      frame.userData = { index: i };
      galleryGroup.add(frame);
      frameMeshes.push(frame);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const centerGlow = new THREE.PointLight(0xffe082, 3.0, 10);
    centerGlow.position.set(0, 0, 0);
    scene.add(centerGlow);

    // Raycasting for clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

      mouseX = mouse.x * 1.5;
      mouseY = mouse.y * 0.6;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(frameMeshes, false);
      if (intersects.length > 0) {
        const idx = intersects[0].object.userData.index;
        if (typeof idx === 'number') {
          onSelectImage(idx);
        }
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleClick);

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

      galleryGroup.rotation.y = time * 0.12 + targetX * 0.5;
      camera.position.y = targetY * 0.8;
      camera.lookAt(0, 0, 0);

      // Subtle float
      frameMeshes.forEach((f, idx) => {
        f.position.y += Math.sin(time * 1.5 + idx) * 0.001;
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [items]);

  return (
    <div
      ref={mountRef}
      className={`w-full h-80 sm:h-96 rounded-2xl overflow-hidden glass-card border border-gold-subtle relative cursor-pointer ${className}`}
    >
      <div className="absolute top-3 left-4 text-xs font-semibold uppercase tracking-wider text-[#d4af37] bg-black/60 px-3 py-1 rounded backdrop-blur">
        3D Spatial Gallery · Click any frame to inspect
      </div>
    </div>
  );
};
