import React, { useRef, useState, useEffect } from 'react';
import { ShadowLayer } from './ShadowLayer';
import { IngredientLayer, IngredientPreset } from './IngredientLayer';

interface PlateCompositionProps {
  foodImage: string;
  threeDFoodImage?: string;
  plateImage?: string;
  alt: string;
  preset?: IngredientPreset;
  showIngredients?: boolean;
  showPlate?: boolean;
  plateType?: 'slate' | 'porcelain' | 'copper' | 'ceramic';
  caption?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const PlateComposition: React.FC<PlateCompositionProps> = ({
  foodImage,
  threeDFoodImage,
  alt,
  preset = 'wagyu-hearth',
  showIngredients = true,
  showPlate = true,
  plateType = 'slate',
  caption,
  className = '',
  size = 'lg',
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

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const sizeClasses = {
    sm: 'w-64 h-64',
    md: 'w-80 h-80 sm:w-96 sm:h-96',
    lg: 'w-full max-w-lg aspect-square',
    xl: 'w-full max-w-2xl aspect-square',
  }[size];

  // Plate styling textures based on fine dining material
  const plateGradients: Record<string, string> = {
    slate: 'radial-gradient(circle at 45% 45%, #1f2229 0%, #121419 65%, #08090b 100%)',
    porcelain: 'radial-gradient(circle at 45% 45%, #2a2e39 0%, #1a1d24 60%, #0d0f14 100%)',
    copper: 'radial-gradient(circle at 45% 45%, #592e1e 0%, #3d1f14 55%, #180c07 100%)',
    ceramic: 'radial-gradient(circle at 45% 45%, #282420 0%, #191614 65%, #0d0c0a 100%)',
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center select-none ${sizeClasses} ${className}`}
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 1. Deep Atmospheric Background Glow (moves very slightly: 1-2px) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 rounded-full blur-3xl opacity-60 transition-transform duration-500 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.16) 0%, rgba(230, 81, 0, 0.08) 45%, transparent 70%)',
          transform: `translate3d(${mouseX * 2}px, ${mouseY * 2}px, 0)`,
        }}
      />

      {/* 2. Artisanal Charger Plate / Plinth (moves slightly in opposite direction) */}
      {showPlate && (
        <div
          className="absolute inset-8 sm:inset-10 rounded-full transition-transform duration-300 ease-out shadow-[0_30px_60px_rgba(0,0,0,0.85)] border border-white/5"
          style={{
            background: plateGradients[plateType] || plateGradients.slate,
            transform: `translate3d(${-mouseX * 6}px, ${-mouseY * 6}px, 0) rotateX(${-mouseY * 2}deg) rotateY(${mouseX * 2}deg)`,
            boxShadow: `
              inset 0 2px 4px rgba(255, 255, 255, 0.08),
              inset 0 -6px 12px rgba(0, 0, 0, 0.8),
              0 24px 48px rgba(0, 0, 0, 0.9)
            `,
          }}
        >
          {/* Subtle Golden Inner Rim */}
          <div className="absolute inset-3 rounded-full border border-[#d4af37]/20 pointer-events-none" />
        </div>
      )}

      {/* 3. Soft Contact Shadow */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-3/4">
        <ShadowLayer
          type="dramatic"
          offsetX={mouseX * 14}
          offsetY={mouseY * 10}
          intensity={0.8}
          width="85%"
          height="36px"
        />
      </div>

      {/* 4. Main 3D Food Object (slightly rotates ±3-4 deg and moves forward) */}
      <div
        className="w-4/5 h-4/5 relative z-10 flex items-center justify-center transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${-mouseY * 4}deg) rotateY(${mouseX * 5}deg) translate3d(${mouseX * 8}px, ${mouseY * 8}px, ${isHovered ? 25 : 10}px)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <img
          src={threeDFoodImage || foodImage}
          alt={alt}
          loading="lazy"
          className="max-w-full max-h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)] transition-all duration-300"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* 5. Floating Ingredients Layers (move at different parallax speeds) */}
      {showIngredients && (
        <IngredientLayer
          preset={preset}
          mouseX={mouseX}
          mouseY={mouseY}
          className="z-20"
        />
      )}

      {/* Caption or Label if provided */}
      {caption && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-center pointer-events-none z-30">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#d4af37] bg-black/60 backdrop-blur px-3 py-1 rounded border border-white/10">
            {caption}
          </span>
        </div>
      )}
    </div>
  );
};
