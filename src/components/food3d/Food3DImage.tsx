import React, { useState, useRef, useEffect } from 'react';
import { ShadowLayer } from './ShadowLayer';

export interface Food3DImageProps {
  src: string;
  threeDImage?: string; // Transparent background 3D-rendered asset
  alt: string;
  depth?: boolean;
  shadow?: boolean;
  shadowType?: 'contact' | 'ambient' | 'soft' | 'floating' | 'dramatic';
  tilt?: boolean;
  floating?: boolean;
  scale?: number;
  rotation?: number;
  glow?: boolean;
  glowColor?: string;
  className?: string;
  imageClassName?: string;
  aspectRatio?: 'square' | 'wide' | 'auto';
  onClick?: () => void;
  priority?: boolean;
}

export const Food3DImage: React.FC<Food3DImageProps> = ({
  src,
  threeDImage,
  alt,
  depth = true,
  shadow = true,
  shadowType = 'soft',
  tilt = true,
  floating = false,
  scale = 1,
  rotation = 0,
  glow = true,
  glowColor = 'rgba(212, 175, 55, 0.18)',
  className = '',
  imageClassName = '',
  aspectRatio = 'square',
  onClick,
  priority = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [primaryLoaded, setPrimaryLoaded] = useState(false);

  // Active image: prefer transparent 3D render if provided and not errored, else fallback to standard image
  const displaySrc = (!imgError && threeDImage) ? threeDImage : src;

  useEffect(() => {
    if (!tilt) return;
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
  }, [tilt]);

  // Subtle 3D tilt angles: max ±3 deg X, ±4 deg Y
  const rotX = tilt ? -mouseY * 3.5 : 0;
  const rotY = tilt ? mouseX * 4.5 : 0;
  const transZ = isHovered ? 18 : 0;

  // Aspect ratio classes
  const aspectClasses = {
    square: 'aspect-square',
    wide: 'aspect-[4/3]',
    auto: 'h-auto',
  }[aspectRatio];

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className={`relative group will-change-transform ${aspectClasses} ${className}`}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Background Ambient Radial Glow */}
      {glow && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -m-6 rounded-full blur-2xl transition-opacity duration-500 ease-out"
          style={{
            background: `radial-gradient(circle at ${50 + mouseX * 10}% ${50 + mouseY * 10}%, ${glowColor} 0%, rgba(20, 16, 12, 0.05) 50%, transparent 70%)`,
            opacity: isHovered ? 1 : 0.65,
          }}
        />
      )}

      {/* Shadow Layer Beneath Object */}
      {shadow && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4/5">
          <ShadowLayer
            type={shadowType}
            offsetX={mouseX * 12}
            offsetY={mouseY * 8}
            intensity={isHovered ? 0.75 : 0.55}
            width="90%"
            height="32px"
          />
        </div>
      )}

      {/* Main 3D Tilted Food Image Plinth */}
      <div
        className={`w-full h-full relative flex items-center justify-center transition-transform duration-300 ease-out ${
          floating ? 'animate-food-float' : ''
        }`}
        style={{
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) rotate(${rotation}deg) scale(${
            isHovered ? scale * 1.03 : scale
          }) translate3d(${mouseX * 4}px, ${mouseY * 4}px, ${transZ}px)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <img
          src={displaySrc}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setPrimaryLoaded(true)}
          onError={() => {
            if (!imgError && threeDImage) {
              setImgError(true);
            }
          }}
          className={`max-w-full max-h-full object-contain filter drop-shadow-[0_18px_25px_rgba(0,0,0,0.65)] transition-all duration-500 ${
            primaryLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          } ${imageClassName}`}
          referrerPolicy="no-referrer"
        />

        {/* Specular Rim Light Shimmer */}
        {depth && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `linear-gradient(${135 + mouseX * 20}deg, rgba(255, 255, 255, 0.08) 0%, transparent 60%)`,
              mixBlendMode: 'overlay',
            }}
          />
        )}
      </div>
    </div>
  );
};
