import React, { useRef, useState, useEffect } from 'react';
import { ShadowLayer } from './ShadowLayer';
import { FloatingIngredient } from './FloatingIngredient';

interface FoodHeroImageProps {
  primaryImage?: string;
  threeDImage?: string;
  className?: string;
  onExploreClick?: () => void;
  onReserveClick?: () => void;
}

export const FoodHeroImage: React.FC<FoodHeroImageProps> = ({
  primaryImage = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=85',
  threeDImage,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const el = containerRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setMouseX(Math.max(-1, Math.min(1, normX)));
      setMouseY(Math.max(-1, Math.min(1, normY)));
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
      setIsHovered(false);
      setMouseX(0);
      setMouseY(0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Subtle tilt limits: rotateY ±4 deg, rotateX ±3 deg
  const rotX = -mouseY * 3.0;
  const rotY = mouseX * 4.0;

  // Active dish image source
  const activeImage = threeDImage || primaryImage;

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-xl lg:max-w-2xl aspect-square flex items-center justify-center select-none ${className}`}
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 1. Large Soft Warm Glow Behind Dish (moves 1–2px only) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute w-[90%] h-[90%] rounded-full blur-3xl opacity-70 transition-transform duration-700 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.22) 0%, rgba(230, 81, 0, 0.12) 40%, rgba(8, 9, 11, 0) 70%)',
          transform: `translate3d(${mouseX * 2}px, ${mouseY * 2}px, 0)`,
        }}
      />

      {/* 2. Artisanal Obsidian Charger Plinth (moves slightly in opposite direction) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute w-[80%] h-[80%] rounded-full transition-transform duration-300 ease-out border border-[#d4af37]/20"
        style={{
          background: 'radial-gradient(circle at 40% 40%, #1c1f26 0%, #0d0f13 70%, #060709 100%)',
          transform: `translate3d(${-mouseX * 5}px, ${-mouseY * 5}px, 0) rotateX(${-mouseY * 1.5}deg) rotateY(${mouseX * 1.5}deg)`,
          boxShadow: `
            inset 0 2px 6px rgba(212, 175, 55, 0.25),
            inset 0 -8px 16px rgba(0, 0, 0, 0.9),
            0 35px 70px rgba(0, 0, 0, 0.95)
          `,
        }}
      >
        {/* Subtle Gold Concentric Groove */}
        <div className="absolute inset-4 rounded-full border border-dashed border-[#d4af37]/15" />
      </div>

      {/* 3. Realistic Soft Shadow Underneath Dish (moves opposite direction of mouse) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-4/5">
        <ShadowLayer
          type="dramatic"
          offsetX={mouseX * 14}
          offsetY={mouseY * 10}
          intensity={0.85}
          width="88%"
          height="40px"
        />
      </div>

      {/* 4. Main 3D Plated Food Render (rotateY ±4 deg, rotateX ±3 deg, gentle translation) */}
      <div
        className="relative z-10 w-[78%] h-[78%] flex items-center justify-center transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) translate3d(${mouseX * 6}px, ${mouseY * 6}px, ${isHovered ? 28 : 12}px)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <img
          src={activeImage}
          alt="A5 Wagyu & Ember Cloche Signature Dish"
          className="w-full h-full object-contain filter drop-shadow-[0_24px_45px_rgba(0,0,0,0.85)] transition-all duration-300"
          loading="eager"
          decoding="async"
          referrerPolicy="no-referrer"
        />

        {/* Dynamic Studio Specular Reflection Sweep */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(${120 + mouseX * 25}deg, rgba(255, 255, 255, 0.12) 0%, transparent 55%)`,
            mixBlendMode: 'overlay',
          }}
        />
      </div>

      {/* 5. 2–4 Floating Ingredients (IMAGE LAYERS with individual parallax speeds) */}
      {/* Herb: Rosemary Sprig (foreground - moves fastest) */}
      <FloatingIngredient
        type="rosemary"
        depth="foreground"
        x={16}
        y={28}
        size={68}
        rotation={-25}
        parallaxMultiplier={1.5}
        mouseX={mouseX}
        mouseY={mouseY}
      />

      {/* Spice: Cracked Tellicherry Peppercorn (middle) */}
      <FloatingIngredient
        type="peppercorn"
        depth="middle"
        x={86}
        y={32}
        size={34}
        rotation={20}
        parallaxMultiplier={1.0}
        mouseX={mouseX}
        mouseY={mouseY}
      />

      {/* Herb: Fresh Genovese Basil Leaf (foreground) */}
      <FloatingIngredient
        type="basil"
        depth="foreground"
        x={82}
        y={76}
        size={58}
        rotation={35}
        parallaxMultiplier={1.6}
        mouseX={mouseX}
        mouseY={mouseY}
      />

      {/* Mineral: Brittany Fleur de Sel (background - moves slow, soft blur) */}
      <FloatingIngredient
        type="salt"
        depth="background"
        x={20}
        y={78}
        size={28}
        rotation={-15}
        parallaxMultiplier={0.5}
        mouseX={mouseX}
        mouseY={mouseY}
      />

      {/* Aromatic: Roasted Garlic Clove (background) */}
      <FloatingIngredient
        type="garlic"
        depth="background"
        x={88}
        y={48}
        size={46}
        rotation={45}
        parallaxMultiplier={0.4}
        mouseX={mouseX}
        mouseY={mouseY}
      />

      {/* Culinary Medal Badge floating in depth */}
      <div
        className="absolute top-4 right-4 z-20 transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${mouseX * 10}px, ${mouseY * 10}px, 35px)`,
        }}
      >
        <div className="glass-card px-3.5 py-1.5 rounded-full border border-[#d4af37]/40 shadow-xl flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#d4af37] font-bold">
            Miyazaki A5 Wagyu · Oak Smoked
          </span>
        </div>
      </div>
    </div>
  );
};
