import React, { useState } from 'react';
import { GalleryItem } from '../../types';
import { Maximize2 } from 'lucide-react';

interface FoodGallery3DProps {
  items: GalleryItem[];
  onSelectImage: (index: number) => void;
  className?: string;
}

export const FoodGallery3D: React.FC<FoodGallery3DProps> = ({
  items,
  onSelectImage,
  className = '',
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Take the first 6-8 spotlight images to showcase in a physical floating perspective composition
  const spotlightItems = items.slice(0, 6);

  // Specific tilt and offset configurations for each floating frame to look like physical photographs arranged in 3D space
  const frameConfigs = [
    { rot: -3, z: 20, y: 0, scale: 1 },
    { rot: 2.5, z: 40, y: -12, scale: 1.04 },
    { rot: -1.8, z: 15, y: 8, scale: 0.98 },
    { rot: 3.2, z: 30, y: -6, scale: 1.02 },
    { rot: -2.2, z: 25, y: 10, scale: 1 },
    { rot: 1.5, z: 35, y: -8, scale: 1.03 },
  ];

  return (
    <div
      className={`relative w-full py-8 px-4 select-none ${className}`}
      style={{
        perspective: '1400px',
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {spotlightItems.map((item, idx) => {
          const cfg = frameConfigs[idx % frameConfigs.length];
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={item.id}
              onClick={() => onSelectImage(idx)}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="relative group cursor-pointer transition-all duration-500 ease-out"
              style={{
                transform: `rotate(${isHovered ? 0 : cfg.rot}deg) translate3d(0, ${
                  isHovered ? -16 : cfg.y
                }px, ${isHovered ? 50 : cfg.z}px) scale(${isHovered ? 1.06 : cfg.scale})`,
                transformStyle: 'preserve-3d',
                zIndex: isHovered ? 40 : 10,
              }}
            >
              {/* Soft Drop Shadow Layer */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-2xl transition-all duration-500"
                style={{
                  boxShadow: isHovered
                    ? '0 30px 60px -12px rgba(0, 0, 0, 0.95), 0 0 40px rgba(212, 175, 55, 0.2)'
                    : '0 20px 40px -15px rgba(0, 0, 0, 0.8)',
                }}
              />

              {/* Physical Picture Frame Border with Gold Trim */}
              <div className="relative rounded-2xl overflow-hidden bg-[#14161f] p-2.5 border border-white/10 group-hover:border-[#d4af37]/60 transition-colors">
                <div className="relative h-64 sm:h-72 w-full rounded-xl overflow-hidden bg-black">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    referrerPolicy="no-referrer"
                  />

                  {/* Elegant Vignette Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* Hover Light Sweep Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Caption & Inspect Icon */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-10">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] font-semibold block">
                        {item.category}
                      </span>
                      <h4 className="font-serif text-sm sm:text-base text-white font-medium line-clamp-1">
                        {item.title}
                      </h4>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <Maximize2 className="w-4 h-4 text-[#d4af37]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
