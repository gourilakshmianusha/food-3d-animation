import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createFoodModel } from './FoodModel';
import { useApp } from '../../context/AppContext';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export const SignatureDishScroll3D: React.FC = () => {
  const { navigate, addToCart } = useApp();
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeDishIndex, setActiveDishIndex] = useState(0);

  const dishes = [
    {
      id: 'dish-1',
      name: 'Smoked Woodfire Wagyu Ribeye',
      type: 'steak' as const,
      price: 94,
      desc: 'A5 Miyazaki Wagyu ribeye seared over white oak coals with bone marrow emulsion and rosemary smoke.',
      tag: '01 / PRIME BEEF',
    },
    {
      id: 'dish-2',
      name: 'Périgord Black Truffle Tagliolini',
      type: 'pasta' as const,
      price: 48,
      desc: 'Handmade saffron tagliolini in 36-month Parmigiano Reggiano butter with fresh French winter truffles.',
      tag: '02 / ARTISAN PASTA',
    },
    {
      id: 'dish-7',
      name: 'Valrhona Chocolate Sphere & Caramel',
      type: 'dessert' as const,
      price: 26,
      desc: '70% Guanaja chocolate with 24k gold leaf, Tahitian vanilla gelato and tableside smoked salted caramel.',
      tag: '03 / DESSERT FINALE',
    },
  ];

  const activeDishIndexRef = useRef(activeDishIndex);
  useEffect(() => {
    activeDishIndexRef.current = activeDishIndex;
  }, [activeDishIndex]);

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

    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    // 3 Dishes placed in spatial carousel
    const dishModels: THREE.Group[] = [];
    dishes.forEach((d, i) => {
      const model = createFoodModel(d.type);
      model.position.set((i - 1) * 3.2, 0, 0);
      stageGroup.add(model);
      dishModels.push(model);
    });

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffe082, 3.0);
    keyLight.position.set(3, 5, 3);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x7da4ff, 1.5);
    rimLight.position.set(-3, 2, -3);
    scene.add(rimLight);

    const hearthGlow = new THREE.PointLight(0xff6f00, 2.5, 6);
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

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      const currentIdx = activeDishIndexRef.current;

      targetX += (mouseX - targetX) * 0.05;

      // Translate stageGroup smoothly to focus on active dish
      const targetStageX = -(currentIdx - 1) * 3.2;
      stageGroup.position.x += (targetStageX - stageGroup.position.x) * 0.08;

      // Rotate individual models
      dishModels.forEach((m, idx) => {
        if (idx === currentIdx) {
          m.rotation.y = time * 0.45 + targetX * 0.4;
          m.scale.lerp(new THREE.Vector3(1, 1, 1), 0.08);
        } else {
          m.rotation.y = time * 0.2;
          m.scale.lerp(new THREE.Vector3(0.7, 0.7, 0.7), 0.08);
        }
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

  const currentDish = dishes[activeDishIndex];

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-12 border border-gold-subtle grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden">
      {/* 3D Viewport on Left/Center */}
      <div className="lg:col-span-7 h-[380px] sm:h-[460px] relative">
        <div ref={mountRef} className="w-full h-full pointer-events-none" />

        {/* Carousel selector indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {dishes.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveDishIndex(i)}
              className={`h-2 rounded-full transition-all ${
                activeDishIndex === i ? 'w-8 bg-[#d4af37]' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Select dish ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Narrative Card on Right */}
      <div className="lg:col-span-5 space-y-6">
        <div>
          <span className="font-mono text-xs font-bold text-[#d4af37] tracking-widest block">
            {currentDish.tag}
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl text-white font-medium mt-1">
            {currentDish.name}
          </h3>
          <span className="font-serif text-2xl font-bold text-gold-gradient tabular-nums block mt-2">
            ${currentDish.price}
          </span>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed">{currentDish.desc}</p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() =>
              addToCart({
                id: currentDish.id,
                name: currentDish.name,
                slug: currentDish.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                category: 'Continental',
                description: currentDish.desc,
                price: currentDish.price,
                image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
                isVeg: false,
                spicyLevel: 1,
                isBestseller: true,
                isChefSpecial: true,
                isAvailable: true,
                ingredients: ['Signature Wagyu', 'White Oak Embers'],
                allergens: [],
                prepTime: '20 mins',
                calories: 650,
                tags: ['Signature'],
                rating: 4.95,
                reviewCount: 120,
              })
            }
            className="px-6 py-3.5 bg-[#d4af37] hover:bg-[#e5be49] text-[#0b0c10] text-xs font-bold uppercase tracking-wider rounded font-brand flex items-center gap-2 shadow"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Order Dish</span>
          </button>

          <button
            onClick={() =>
              setActiveDishIndex((prev) => (prev + 1) % dishes.length)
            }
            className="px-5 py-3.5 glass-dark hover:bg-white/10 text-white text-xs font-semibold uppercase tracking-wider rounded border border-white/10"
          >
            Next Signature Dish →
          </button>
        </div>
      </div>
    </div>
  );
};
