import React from 'react';

export type IngredientType =
  | 'basil'
  | 'rosemary'
  | 'chili'
  | 'garlic'
  | 'peppercorn'
  | 'salt'
  | 'truffle'
  | 'parsley'
  | 'saffron';

interface FloatingIngredientProps {
  type: IngredientType;
  depth?: 'foreground' | 'middle' | 'background'; // depth layer
  x?: number; // percentage from left
  y?: number; // percentage from top
  size?: number; // px
  rotation?: number; // deg
  blur?: number; // px for depth of field
  parallaxMultiplier?: number;
  mouseX?: number;
  mouseY?: number;
  className?: string;
  customImage?: string;
}

// Built-in realistic SVG/render graphics for ingredients with rich realistic styling
const INGREDIENT_GRAPHICS: Record<IngredientType, React.ReactNode> = {
  basil: (
    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-md">
      <path
        d="M20,80 C25,45 45,20 85,15 C80,55 55,75 20,80 Z"
        fill="url(#basilGrad)"
      />
      <path
        d="M25,75 C45,55 60,35 80,20"
        stroke="#4ade80"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M40,58 C50,56 60,54 70,52"
        stroke="#4ade80"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.4"
      />
      <defs>
        <linearGradient id="basilGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#15803d" />
          <stop offset="50%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>
      </defs>
    </svg>
  ),
  rosemary: (
    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-md">
      <path d="M20,90 Q50,50 80,10" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M40,65 Q30,55 25,50" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
      <path d="M48,55 Q62,45 70,42" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
      <path d="M58,42 Q48,32 40,28" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
      <path d="M68,30 Q80,22 85,18" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
      <path d="M75,18 Q72,8 70,5" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  chili: (
    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-lg">
      <path
        d="M25,85 C28,60 45,35 75,25 C82,23 85,28 82,35 C70,60 50,75 25,85 Z"
        fill="url(#chiliGrad)"
      />
      <path d="M78,25 C82,18 86,15 90,12" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="65" cy="38" rx="8" ry="2.5" fill="#fca5a5" opacity="0.4" transform="rotate(-30 65 38)" />
      <defs>
        <linearGradient id="chiliGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="60%" stopColor="#b91c1c" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>
      </defs>
    </svg>
  ),
  garlic: (
    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-md">
      <path
        d="M50,15 C65,15 78,35 78,58 C78,78 65,88 50,88 C35,88 22,78 22,58 C22,35 35,15 50,15 Z"
        fill="url(#garlicGrad)"
      />
      <path d="M50,15 Q50,55 50,88" stroke="#f3e8ff" strokeWidth="1" opacity="0.6" />
      <path d="M50,15 Q36,50 32,75" stroke="#e9d5ff" strokeWidth="0.8" opacity="0.5" />
      <path d="M50,15 Q64,50 68,75" stroke="#e9d5ff" strokeWidth="0.8" opacity="0.5" />
      <defs>
        <linearGradient id="garlicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#faf5ff" />
          <stop offset="60%" stopColor="#f3e8ff" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
      </defs>
    </svg>
  ),
  peppercorn: (
    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-md">
      <circle cx="50" cy="50" r="32" fill="url(#pepperGrad)" />
      <circle cx="42" cy="42" r="6" fill="#64748b" opacity="0.5" />
      <circle cx="58" cy="58" r="4" fill="#0f172a" />
      <defs>
        <radialGradient id="pepperGrad" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="40%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#090d16" />
        </radialGradient>
      </defs>
    </svg>
  ),
  salt: (
    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-sm">
      <polygon points="50,15 80,35 75,75 45,85 20,60 25,25" fill="#f8fafc" opacity="0.9" />
      <polygon points="50,15 80,35 60,55 35,45" fill="#ffffff" />
      <polygon points="45,85 75,75 60,55 30,65" fill="#e2e8f0" opacity="0.7" />
    </svg>
  ),
  truffle: (
    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-lg">
      <path
        d="M30,30 Q60,15 75,35 Q90,60 70,80 Q40,92 25,75 Q10,50 30,30 Z"
        fill="url(#truffleGrad)"
      />
      <circle cx="40" cy="45" r="3" fill="#1c1917" />
      <circle cx="60" cy="55" r="4" fill="#292524" />
      <circle cx="50" cy="70" r="2.5" fill="#1c1917" />
      <defs>
        <radialGradient id="truffleGrad" cx="40%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#44403c" />
          <stop offset="55%" stopColor="#292524" />
          <stop offset="100%" stopColor="#0c0a09" />
        </radialGradient>
      </defs>
    </svg>
  ),
  parsley: (
    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-sm">
      <path d="M50,85 C50,60 50,40 50,20" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
      <circle cx="35" cy="30" r="14" fill="#22c55e" opacity="0.85" />
      <circle cx="65" cy="30" r="14" fill="#16a34a" opacity="0.85" />
      <circle cx="50" cy="20" r="16" fill="#15803d" />
    </svg>
  ),
  saffron: (
    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-sm">
      <path d="M20,80 Q40,40 70,20 Q85,10 90,15 Q80,30 45,75 Z" fill="#ea580c" />
      <path d="M25,85 Q45,50 75,25" stroke="#facc15" strokeWidth="1" opacity="0.8" />
    </svg>
  ),
};

export const FloatingIngredient: React.FC<FloatingIngredientProps> = ({
  type,
  depth = 'middle',
  x = 50,
  y = 50,
  size = 40,
  rotation = 0,
  blur = 0,
  parallaxMultiplier = 1,
  mouseX = 0,
  mouseY = 0,
  className = '',
  customImage,
}) => {
  // Speed multiplier based on depth: foreground moves fastest, background moves subtly
  const depthFactor = depth === 'foreground' ? 1.6 : depth === 'middle' ? 1.0 : 0.45;
  const computedBlur = blur || (depth === 'foreground' ? 1.2 : depth === 'background' ? 2.5 : 0);

  // Parallax translation
  const tx = mouseX * 24 * depthFactor * parallaxMultiplier;
  const ty = mouseY * 20 * depthFactor * parallaxMultiplier;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute transition-transform duration-200 ease-out ${className}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        transform: `translate(-50%, -50%) translate3d(${tx}px, ${ty}px, 0) rotate(${rotation}deg)`,
        filter: computedBlur > 0 ? `blur(${computedBlur}px)` : undefined,
        zIndex: depth === 'foreground' ? 30 : depth === 'middle' ? 15 : 5,
        opacity: depth === 'background' ? 0.7 : 0.95,
      }}
    >
      {customImage ? (
        <img
          src={customImage}
          alt={type}
          className="w-full h-full object-contain drop-shadow-lg"
          loading="lazy"
        />
      ) : (
        INGREDIENT_GRAPHICS[type]
      )}
    </div>
  );
};
