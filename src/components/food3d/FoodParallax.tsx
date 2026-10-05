import React, { useRef, useState, useEffect } from 'react';

interface FoodParallaxProps {
  children: React.ReactNode;
  speed?: number; // default 0.15
  direction?: 'up' | 'down';
  className?: string;
}

export const FoodParallax: React.FC<FoodParallaxProps> = ({
  children,
  speed = 0.12,
  direction = 'up',
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (!ref.current) return;
          const rect = ref.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          // Only calculate when near or inside viewport
          if (rect.top < windowHeight && rect.bottom > 0) {
            const centerProgress = (rect.top + rect.height / 2 - windowHeight / 2) / (windowHeight / 2);
            const shift = centerProgress * 40 * speed;
            setOffsetY(direction === 'up' ? -shift : shift);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, direction]);

  return (
    <div
      ref={ref}
      className={`will-change-transform ${className}`}
      style={{
        transform: `translate3d(0, ${offsetY.toFixed(1)}px, 0)`,
        transition: 'transform 0.1s cubic-bezier(0.2, 0.9, 0.3, 1)',
      }}
    >
      {children}
    </div>
  );
};
