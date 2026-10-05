import React from 'react';
import { FloatingIngredient, IngredientType } from './FloatingIngredient';

export type IngredientPreset =
  | 'wagyu-hearth'
  | 'truffle-pasta'
  | 'woodfire-pizza'
  | 'artisan-dessert'
  | 'fresh-herbs'
  | 'seafood-crudo';

interface IngredientLayerProps {
  preset?: IngredientPreset;
  mouseX?: number;
  mouseY?: number;
  className?: string;
}

interface IngredientItemConfig {
  type: IngredientType;
  depth: 'foreground' | 'middle' | 'background';
  x: number;
  y: number;
  size: number;
  rotation: number;
  parallaxMultiplier: number;
}

const PRESET_CONFIGS: Record<IngredientPreset, IngredientItemConfig[]> = {
  'wagyu-hearth': [
    { type: 'rosemary', depth: 'foreground', x: 18, y: 32, size: 56, rotation: -25, parallaxMultiplier: 1.4 },
    { type: 'peppercorn', depth: 'middle', x: 28, y: 78, size: 28, rotation: 15, parallaxMultiplier: 1.0 },
    { type: 'garlic', depth: 'background', x: 82, y: 26, size: 48, rotation: 35, parallaxMultiplier: 0.5 },
    { type: 'salt', depth: 'middle', x: 85, y: 70, size: 24, rotation: -12, parallaxMultiplier: 0.9 },
    { type: 'peppercorn', depth: 'foreground', x: 74, y: 84, size: 32, rotation: 40, parallaxMultiplier: 1.5 },
    { type: 'rosemary', depth: 'background', x: 88, y: 44, size: 38, rotation: 65, parallaxMultiplier: 0.4 },
  ],
  'truffle-pasta': [
    { type: 'truffle', depth: 'foreground', x: 16, y: 28, size: 52, rotation: -18, parallaxMultiplier: 1.5 },
    { type: 'basil', depth: 'middle', x: 84, y: 32, size: 44, rotation: 30, parallaxMultiplier: 1.1 },
    { type: 'peppercorn', depth: 'background', x: 22, y: 74, size: 26, rotation: 10, parallaxMultiplier: 0.6 },
    { type: 'salt', depth: 'middle', x: 80, y: 76, size: 26, rotation: 45, parallaxMultiplier: 0.8 },
    { type: 'basil', depth: 'foreground', x: 76, y: 82, size: 40, rotation: -40, parallaxMultiplier: 1.4 },
  ],
  'woodfire-pizza': [
    { type: 'basil', depth: 'foreground', x: 14, y: 36, size: 54, rotation: -30, parallaxMultiplier: 1.6 },
    { type: 'garlic', depth: 'middle', x: 86, y: 30, size: 46, rotation: 25, parallaxMultiplier: 1.0 },
    { type: 'chili', depth: 'foreground', x: 80, y: 78, size: 58, rotation: 45, parallaxMultiplier: 1.5 },
    { type: 'peppercorn', depth: 'background', x: 26, y: 80, size: 28, rotation: 0, parallaxMultiplier: 0.5 },
  ],
  'artisan-dessert': [
    { type: 'saffron', depth: 'foreground', x: 18, y: 32, size: 42, rotation: -15, parallaxMultiplier: 1.3 },
    { type: 'truffle', depth: 'background', x: 82, y: 28, size: 46, rotation: 25, parallaxMultiplier: 0.6 },
    { type: 'salt', depth: 'middle', x: 78, y: 78, size: 24, rotation: 40, parallaxMultiplier: 1.0 },
    { type: 'saffron', depth: 'middle', x: 24, y: 76, size: 36, rotation: 60, parallaxMultiplier: 0.9 },
  ],
  'fresh-herbs': [
    { type: 'rosemary', depth: 'foreground', x: 15, y: 25, size: 60, rotation: -35, parallaxMultiplier: 1.5 },
    { type: 'basil', depth: 'middle', x: 85, y: 35, size: 48, rotation: 20, parallaxMultiplier: 1.0 },
    { type: 'garlic', depth: 'background', x: 20, y: 80, size: 42, rotation: 15, parallaxMultiplier: 0.5 },
    { type: 'peppercorn', depth: 'middle', x: 80, y: 75, size: 30, rotation: 45, parallaxMultiplier: 0.8 },
  ],
  'seafood-crudo': [
    { type: 'basil', depth: 'foreground', x: 18, y: 30, size: 46, rotation: -20, parallaxMultiplier: 1.4 },
    { type: 'salt', depth: 'middle', x: 82, y: 34, size: 28, rotation: 30, parallaxMultiplier: 0.9 },
    { type: 'peppercorn', depth: 'background', x: 24, y: 75, size: 26, rotation: 10, parallaxMultiplier: 0.5 },
    { type: 'chili', depth: 'foreground', x: 78, y: 78, size: 50, rotation: 35, parallaxMultiplier: 1.3 },
  ],
};

export const IngredientLayer: React.FC<IngredientLayerProps> = ({
  preset = 'wagyu-hearth',
  mouseX = 0,
  mouseY = 0,
  className = '',
}) => {
  const items = PRESET_CONFIGS[preset] || PRESET_CONFIGS['wagyu-hearth'];

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-visible ${className}`}>
      {items.map((item, idx) => (
        <FloatingIngredient
          key={`${item.type}-${idx}`}
          type={item.type}
          depth={item.depth}
          x={item.x}
          y={item.y}
          size={item.size}
          rotation={item.rotation}
          parallaxMultiplier={item.parallaxMultiplier}
          mouseX={mouseX}
          mouseY={mouseY}
        />
      ))}
    </div>
  );
};
