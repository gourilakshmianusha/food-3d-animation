import React, { useRef, useState, useEffect } from 'react';
import { MenuItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { ShoppingBag, Star, Flame, Eye, Heart, Check } from 'lucide-react';
import { ShadowLayer } from './ShadowLayer';

interface FoodCard3DProps {
  item: MenuItem;
  onInspect?: (item: MenuItem) => void;
  className?: string;
}

export const FoodCard3D: React.FC<FoodCard3DProps> = ({
  item,
  onInspect,
  className = '',
}) => {
  const { addToCart, navigate, favorites, toggleFavorite } = useApp();
  const cardRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const isFav = favorites.includes(item.id);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const el = cardRef.current;
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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(item);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const handleOpenDetail = () => {
    if (onInspect) {
      onInspect(item);
    } else {
      navigate(`/menu/${item.slug}`);
    }
  };

  // Subtle tilt: card lifts, image rotates 2-3 deg, shadow deepens
  const rotX = isHovered ? -mouseY * 4 : 0;
  const rotY = isHovered ? mouseX * 5 : 0;
  const imgRot = isHovered ? mouseX * 2.5 : 0;

  return (
    <div
      ref={cardRef}
      onClick={handleOpenDetail}
      className={`relative group cursor-pointer rounded-2xl p-5 border transition-all duration-300 ${
        isHovered
          ? 'bg-[#14161d]/90 border-[#d4af37]/45 shadow-[0_25px_50px_rgba(0,0,0,0.85)] -translate-y-2'
          : 'bg-[#0f1117]/80 border-white/10 shadow-lg'
      } ${className}`}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
      }}
    >
      {/* Background Warm Amber Glow on Hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl blur-xl transition-opacity duration-500 ease-out"
        style={{
          background: `radial-gradient(circle at ${50 + mouseX * 20}% ${40 + mouseY * 20}%, rgba(212, 175, 55, 0.14) 0%, transparent 70%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Top Badges & Actions */}
      <div className="flex items-center justify-between mb-3 relative z-20">
        <div className="flex items-center gap-1.5 flex-wrap">
          {item.isChefSpecial && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/35 uppercase">
              Chef Special
            </span>
          )}
          {item.isBestseller && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
              Bestseller
            </span>
          )}
          <span
            className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? 'bg-emerald-400' : 'bg-red-400'}`}
            title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
          />
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(item.id);
          }}
          className="p-1.5 rounded-full bg-black/40 hover:bg-white/10 text-slate-400 hover:text-rose-400 transition-colors"
          title="Save to favorites"
        >
          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      {/* 3D Food Image Stage */}
      <div
        className="relative h-48 sm:h-52 w-full flex items-center justify-center mb-4 overflow-visible"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Soft Contact Shadow beneath dish */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4/5">
          <ShadowLayer
            type="soft"
            offsetX={mouseX * 8}
            offsetY={mouseY * 6}
            intensity={isHovered ? 0.75 : 0.45}
            width="85%"
            height="26px"
          />
        </div>

        {/* Food Image with Z-Elevation and 2-3° rotation */}
        <div
          className="w-full h-full relative z-10 flex items-center justify-center transition-transform duration-300 ease-out"
          style={{
            transform: `translate3d(${mouseX * 4}px, ${mouseY * 4}px, ${isHovered ? 26 : 0}px) rotate(${imgRot}deg) scale(${isHovered ? 1.05 : 1})`,
            transformStyle: 'preserve-3d',
          }}
        >
          <img
            src={item.threeDImage || item.image}
            alt={item.name}
            loading="lazy"
            className="max-h-full max-w-[90%] object-contain filter drop-shadow-[0_15px_22px_rgba(0,0,0,0.7)] transition-all duration-300"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Content Info */}
      <div className="space-y-2 relative z-20">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-serif text-lg font-medium text-white group-hover:text-gold-gradient transition-colors line-clamp-1">
            {item.name}
          </h4>
          <div className="text-right shrink-0">
            <span className="font-mono text-base font-bold text-white block">
              ${(item.discountPrice ?? item.price).toFixed(2)}
            </span>
            {item.discountPrice && (
              <span className="text-[11px] text-slate-400 line-through block font-mono">
                ${item.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {item.description}
        </p>

        {/* Rating and Ingredients Pill */}
        <div className="flex items-center justify-between pt-1 text-xs text-slate-400">
          <div className="flex items-center gap-1 text-amber-400 font-mono text-[11px]">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="font-bold text-white">{item.rating}</span>
            <span className="text-slate-400">({item.reviewCount})</span>
          </div>

          <span className="text-[11px] text-slate-400 font-mono">
            {item.prepTime}
          </span>
        </div>

        {/* Action Button */}
        <div className="pt-3 flex items-center gap-2">
          <button
            onClick={handleAddToCart}
            disabled={!item.isAvailable}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider font-brand transition-all flex items-center justify-center gap-1.5 shadow-md ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#d4af37] hover:bg-[#e5be49] text-[#0b0c10]'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Bag</span>
              </>
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenDetail();
            }}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
            title="Inspect 3D Product Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
