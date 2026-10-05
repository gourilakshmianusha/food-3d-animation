import React from 'react';

interface ShadowLayerProps {
  type?: 'contact' | 'ambient' | 'soft' | 'floating' | 'dramatic';
  intensity?: number; // 0 to 1
  offsetX?: number; // px shift from mouse
  offsetY?: number; // px shift from mouse
  className?: string;
  width?: string | number;
  height?: string | number;
}

export const ShadowLayer: React.FC<ShadowLayerProps> = ({
  type = 'soft',
  intensity = 0.6,
  offsetX = 0,
  offsetY = 0,
  className = '',
  width = '80%',
  height = '24px',
}) => {
  // Compute style based on shadow type
  const shadowStyles: Record<string, string> = {
    contact: `radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, ${0.85 * intensity}) 0%, rgba(0, 0, 0, ${0.4 * intensity}) 40%, transparent 75%)`,
    ambient: `radial-gradient(ellipse at 50% 50%, rgba(20, 15, 10, ${0.65 * intensity}) 0%, rgba(10, 8, 6, ${0.3 * intensity}) 50%, transparent 80%)`,
    soft: `radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, ${0.5 * intensity}) 0%, rgba(0, 0, 0, ${0.2 * intensity}) 50%, transparent 75%)`,
    floating: `radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, ${0.4 * intensity}) 0%, rgba(12, 10, 8, ${0.15 * intensity}) 45%, transparent 70%)`,
    dramatic: `radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, ${0.9 * intensity}) 0%, rgba(180, 83, 9, ${0.15 * intensity}) 35%, transparent 70%)`,
  };

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute left-1/2 -translate-x-1/2 transition-transform duration-300 ease-out ${className}`}
      style={{
        width,
        height,
        background: shadowStyles[type] || shadowStyles.soft,
        filter: type === 'contact' ? 'blur(6px)' : 'blur(16px)',
        transform: `translate(-50%, 0) translate3d(${-offsetX * 0.4}px, ${-offsetY * 0.4}px, 0)`,
        borderRadius: '50%',
      }}
    />
  );
};
