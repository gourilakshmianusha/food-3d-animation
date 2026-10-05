import React, { useRef, useState, useEffect } from 'react';
import { ShadowLayer } from './ShadowLayer';
import { IngredientLayer } from './IngredientLayer';
import { Sparkles, Sun, Flame, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface FoodImageViewerProps {
  image: string;
  threeDImage?: string;
  alt: string;
  className?: string;
}

export const FoodImageViewer: React.FC<FoodImageViewerProps> = ({
  image,
  threeDImage,
  alt,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [lightingMode, setLightingMode] = useState<'warm' | 'ember' | 'studio'>('warm');
  const [showGarnish, setShowGarnish] = useState(true);

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

    const handleMouseLeave = () => {
      setMouseX(0);
      setMouseY(0);
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const lightingGlows = {
    warm: 'radial-gradient(circle, rgba(212, 175, 55, 0.22) 0%, rgba(20, 16, 12, 0.05) 55%, transparent 75%)',
    ember: 'radial-gradient(circle, rgba(230, 81, 0, 0.28) 0%, rgba(180, 50, 0, 0.08) 50%, transparent 75%)',
    studio: 'radial-gradient(circle, rgba(255, 255, 255, 0.18) 0%, rgba(148, 163, 184, 0.05) 55%, transparent 75%)',
  };

  const activeSrc = threeDImage || image;

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* 3D Visualizer Viewport */}
      <div
        ref={containerRef}
        className="w-full aspect-square max-w-lg relative rounded-3xl overflow-hidden glass-card border border-gold-subtle flex items-center justify-center cursor-crosshair"
        style={{
          perspective: '1200px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Dynamic Studio Lighting Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 blur-3xl opacity-80 transition-all duration-700"
          style={{
            background: lightingGlows[lightingMode],
            transform: `translate3d(${mouseX * 12}px, ${mouseY * 12}px, 0)`,
          }}
        />

        {/* Charger Slate Plinth */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute w-3/4 h-3/4 rounded-full border border-white/5 transition-transform duration-300 ease-out"
          style={{
            background: 'radial-gradient(circle at 40% 40%, #1c1f26 0%, #0d0f14 65%, #050608 100%)',
            transform: `translate3d(${-mouseX * 6}px, ${-mouseY * 6}px, 0) rotateX(${-mouseY * 2}deg) rotateY(${mouseX * 2}deg)`,
            boxShadow: '0 25px 50px rgba(0,0,0,0.9), inset 0 2px 4px rgba(255,255,255,0.06)',
          }}
        />

        {/* Realistic Contact Shadow Layer */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-4/5">
          <ShadowLayer
            type="dramatic"
            offsetX={mouseX * 15}
            offsetY={mouseY * 10}
            intensity={0.8}
            width="85%"
            height="36px"
          />
        </div>

        {/* 3D Food Render with Interactive Tilt and Zoom */}
        <div
          className="relative z-10 w-3/4 h-3/4 flex items-center justify-center transition-transform duration-300 ease-out"
          style={{
            transform: `rotateX(${-mouseY * 5}deg) rotateY(${mouseX * 6}deg) scale(${zoomLevel}) translate3d(${mouseX * 8}px, ${mouseY * 8}px, 20px)`,
            transformStyle: 'preserve-3d',
          }}
        >
          <img
            src={activeSrc}
            alt={alt}
            className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] transition-all duration-300"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Optional Floating Garnish Layers */}
        {showGarnish && (
          <IngredientLayer
            preset="truffle-pasta"
            mouseX={mouseX}
            mouseY={mouseY}
            className="z-20"
          />
        )}

        {/* Top-Right Active Lighting Badge */}
        <div className="absolute top-4 right-4 z-30">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] bg-black/60 backdrop-blur px-2.5 py-1 rounded border border-white/10">
            {lightingMode} Lighting
          </span>
        </div>
      </div>

      {/* Control Bar: Zoom & Lighting Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-4 w-full max-w-lg mt-4 px-2 text-xs">
        {/* Lighting Modes */}
        <div className="flex items-center gap-1.5 bg-black/50 p-1.5 rounded-xl border border-white/10">
          <button
            onClick={() => setLightingMode('warm')}
            className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
              lightingMode === 'warm' ? 'bg-[#d4af37] text-black font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Warm Ambient"
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Warm</span>
          </button>
          <button
            onClick={() => setLightingMode('ember')}
            className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
              lightingMode === 'ember' ? 'bg-[#e65100] text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Hearth Ember"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Ember</span>
          </button>
          <button
            onClick={() => setLightingMode('studio')}
            className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
              lightingMode === 'studio' ? 'bg-slate-200 text-black font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Studio Spotlight"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Studio</span>
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-black/50 p-1.5 rounded-xl border border-white/10">
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.85, z - 0.15))}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[11px] px-1 text-slate-300">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.15))}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setZoomLevel(1);
              setMouseX(0);
              setMouseY(0);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 ml-1"
            title="Reset Perspective"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
