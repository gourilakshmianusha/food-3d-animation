import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useApp } from '../../context/AppContext';
import { Award, ArrowRight } from 'lucide-react';

export const ChefSection3D: React.FC = () => {
  const { navigate } = useApp();
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
    camera.position.set(0, 0, 4.2);

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

    // Floating Golden Chef Hat and Cutlery floating in 3D depth around the portrait
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.2,
    });

    // Golden Toque
    const hat = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.35, 0.6, 24),
      goldMat
    );
    hat.position.set(-1.4, 0.6, 0.5);
    hat.rotation.z = -0.3;
    group.add(hat);

    // Golden Tasting Spoon
    const spoonStem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.2, 12), goldMat);
    spoonStem.position.set(1.4, -0.4, 0.4);
    spoonStem.rotation.z = Math.PI / 4;
    group.add(spoonStem);

    const spoonBowl = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), goldMat);
    spoonBowl.scale.set(1, 1.6, 0.5);
    spoonBowl.position.set(1.8, 0, 0.4);
    group.add(spoonBowl);

    // Floating Golden Embers/Spices
    const particleCount = 40;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 5;
      particlePos[i * 3 + 1] = (Math.random() - 0.5) * 3;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.07,
      color: 0xffd54f,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    group.add(particles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffecd0, 2.5);
    dirLight.position.set(3, 4, 3);
    scene.add(dirLight);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 1.5;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 1.0;
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

      group.rotation.y = time * 0.2 + targetX * 0.4;
      group.rotation.x = targetY * 0.2;

      hat.position.y = 0.6 + Math.sin(time * 1.5) * 0.08;
      spoonStem.rotation.y = time * 0.5;

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
    <div className="relative glass-card rounded-3xl p-6 sm:p-12 border border-gold-subtle overflow-hidden">
      {/* 3D background overlay */}
      <div ref={mountRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Main Content Layout */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Large Chef Portrait with 3D Depth Frame */}
        <div className="lg:col-span-5 relative group">
          <div className="relative h-96 sm:h-[450px] rounded-2xl overflow-hidden border border-gold-subtle shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
            <img
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80"
              alt="Executive Chef Julian Vance"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <span className="text-[11px] uppercase tracking-widest text-[#d4af37] font-semibold block">
                Executive Chef & Founder
              </span>
              <h3 className="font-serif text-2xl text-white font-medium">Julian Vance</h3>
              <p className="text-xs text-slate-300 mt-1">
                22 Years Open-Hearth Fine Dining · James Beard Nominee 2024
              </p>
            </div>
          </div>
        </div>

        {/* Narrative */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block">
              The Art Behind The Plate
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-white font-light mt-1">
              Where Fire Submits to Mastery
            </h2>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">
            "Cooking over live coals is an unrelenting dance with nature. There are no temperature dials
            or digital timers. You must judge the infrared glow with your eyes, listen for the frequency of the sear,
            and breathe in the perfume of the white oak smoke."
          </p>

          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Chef Julian Vance leads our 14-member culinary brigade, orchestrating four custom fire pits fueled
            exclusively with aged orchard hardwoods. Every plate presented in the dining room has passed under his personal inspection.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
            <div>
              <span className="block text-2xl font-serif text-gold-gradient font-bold tabular-nums">22</span>
              <span className="text-xs text-slate-400">Years Line Heritage</span>
            </div>
            <div>
              <span className="block text-2xl font-serif text-gold-gradient font-bold tabular-nums">3 Pits</span>
              <span className="text-xs text-slate-400">Hand-Forged Hearth Stations</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => navigate('/chefs')}
              className="px-6 py-3.5 bg-[#d4af37] hover:bg-[#e5be49] text-[#0b0c10] text-xs font-bold uppercase tracking-wider rounded font-brand flex items-center gap-2 shadow"
            >
              <span>Explore All 5 Brigade Masters</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
