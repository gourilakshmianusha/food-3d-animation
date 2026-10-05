import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrderStatus } from '../../types';

interface DeliveryTrack3DProps {
  status: OrderStatus;
  className?: string;
}

export const DeliveryTrack3D: React.FC<DeliveryTrack3DProps> = ({ status, className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef(status);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

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
    camera.position.set(0, 2.5, 4.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    container.appendChild(renderer.domElement);

    const trackGroup = new THREE.Group();
    scene.add(trackGroup);

    // Create a smooth winding 3D path curve
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.2, 0, -1.0),
      new THREE.Vector3(-1.0, 0, 0.8),
      new THREE.Vector3(0.4, 0, -0.6),
      new THREE.Vector3(1.4, 0, 0.6),
      new THREE.Vector3(2.4, 0, -0.2),
    ]);

    const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.08, 12, false);
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.2 });
    const road = new THREE.Mesh(tubeGeo, tubeMat);
    trackGroup.add(road);

    // Waypoint milestones along curve
    const milestoneMat = new THREE.MeshStandardMaterial({ color: 0xffa000, roughness: 0.3 });
    for (let i = 0; i <= 4; i++) {
      const point = curve.getPointAt(i / 4);
      const milestone = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.05, 16), milestoneMat);
      milestone.position.copy(point);
      trackGroup.add(milestone);
    }

    // Moving Cloche Courier Vehicle / Carrier Box
    const carrierGroup = new THREE.Group();
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x1f232b, roughness: 0.4 });
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.3), boxMat);
    carrierGroup.add(box);

    const clocheMiniMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });
    const clocheMini = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), clocheMiniMat);
    clocheMini.position.y = 0.15;
    carrierGroup.add(clocheMini);

    const beaconLight = new THREE.PointLight(0xff9100, 2.0, 3);
    beaconLight.position.y = 0.3;
    carrierGroup.add(beaconLight);

    trackGroup.add(carrierGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff3e0, 2.0);
    dirLight.position.set(2, 4, 3);
    scene.add(dirLight);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    const statusProgressMap: Record<OrderStatus, number> = {
      Pending: 0.05,
      Confirmed: 0.25,
      Preparing: 0.5,
      Ready: 0.75,
      'Out for Delivery': 0.9,
      Delivered: 1.0,
      Cancelled: 0.0,
    };

    let currentProgress = 0.2;
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      const targetProgress = statusProgressMap[statusRef.current] ?? 0.5;
      currentProgress += (targetProgress - currentProgress) * 0.05;

      const pos = curve.getPointAt(Math.max(0.01, Math.min(0.99, currentProgress)));
      carrierGroup.position.copy(pos);
      carrierGroup.position.y += 0.16 + Math.sin(time * 8) * 0.02;

      // Slight camera rotation
      trackGroup.rotation.y = Math.sin(time * 0.3) * 0.1;
      camera.lookAt(0, 0.2, 0);

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
      className={`w-full h-56 sm:h-64 rounded-xl overflow-hidden glass-card border border-gold-subtle relative ${className}`}
    >
      <div className="absolute top-2 left-3 text-[10px] uppercase font-bold tracking-widest text-[#d4af37] bg-black/60 px-2 py-0.5 rounded">
        Hearth Transit Telemetry
      </div>
    </div>
  );
};
