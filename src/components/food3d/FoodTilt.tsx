import React, { useRef, useState, useEffect } from 'react';

interface FoodTiltProps {
  children: React.ReactNode;
  maxRotateX?: number; // deg, default 4
  maxRotateY?: number; // deg, default 5
  perspective?: number; // px, default 1000
  glare?: boolean;
  scale?: number;
  className?: string;
  onMouseMoveCoords?: (normX: number, normY: number) => void;
}

export const FoodTilt: React.FC<FoodTiltProps> = ({
  children,
  maxRotateX = 4,
  maxRotateY = 5,
  perspective = 1000,
  glare = true,
  scale = 1.02,
  className = '',
  onMouseMoveCoords,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    // Check reduced motion setting
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const el = containerRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Normalized coordinates from -1 to 1
      const normX = (x / rect.width - 0.5) * 2;
      const normY = (y / rect.height - 0.5) * 2;

      // Clamped rotation
      const rY = Math.max(-maxRotateY, Math.min(maxRotateY, normX * maxRotateY));
      const rX = Math.max(-maxRotateX, Math.min(maxRotateX, -normY * maxRotateX));

      setRotateX(rX);
      setRotateY(rY);

      if (glare) {
        setGlarePos({
          x: Math.round((x / rect.width) * 100),
          y: Math.round((y / rect.height) * 100),
        });
      }

      if (onMouseMoveCoords) {
        onMouseMoveCoords(normX, normY);
      }
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
      setIsHovered(false);
      setRotateX(0);
      setRotateY(0);
      if (onMouseMoveCoords) onMouseMoveCoords(0, 0);
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [maxRotateX, maxRotateY, glare, onMouseMoveCoords]);

  return (
    <div
      ref={containerRef}
      className={`relative will-change-transform ${className}`}
      style={{
        perspective: `${perspective}px`,
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="w-full h-full relative transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? scale : 1})`,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}

        {/* Glare Specular Reflection */}
        {glare && isHovered && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 30%, transparent 70%)`,
              mixBlendMode: 'overlay',
            }}
          />
        )}
      </div>
    </div>
  );
};
