import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { GalleryItem, GalleryCategory } from '../types';
import { Maximize2, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { FoodGallery3D } from '../components/food3d';

export const GalleryPage: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    setItems(api.getGallery());
  }, []);

  const categories: (GalleryCategory | 'All')[] = [
    'All',
    'Food',
    'Restaurant',
    'Kitchen',
    'Events',
    'Chefs',
    'Behind the scenes',
  ];

  const filteredItems = items.filter(
    (item) => activeCategory === 'All' || item.category === activeCategory
  );

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
  };

  const prevImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <div className="min-h-screen bg-[#08090b] text-[#e2e8f0] pt-28 pb-24 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold font-mono">
            Visual Storytelling
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-light">
            The Visual Sanctuary
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Moments captured around the live hearth, the private cellar, and tableside smoke rituals.
          </p>
        </div>

        {/* 3D Physical Photo Gallery Spotlight */}
        {items.length > 0 && (
          <FoodGallery3D
            items={items}
            onSelectImage={(idx) => openLightbox(idx)}
            className="mb-8"
          />
        )}

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-[#d4af37] text-[#0b0c10] shadow font-bold'
                  : 'glass-dark text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry / Grid Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => openLightbox(index)}
              className="glass-card rounded-2xl overflow-hidden border border-white/10 group cursor-pointer relative transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-[#d4af37]/40"
            >
              <div className="h-64 sm:h-72 overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#d4af37] font-semibold block">
                      {item.category}
                    </span>
                    <h3 className="font-serif text-base text-white font-medium line-clamp-1">
                      {item.title}
                    </h3>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {lightboxIndex !== null && filteredItems[lightboxIndex] && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={prevImage}
              className="absolute left-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="max-w-4xl max-h-[80vh] flex flex-col items-center">
              <img
                src={filteredItems[lightboxIndex].image}
                alt={filteredItems[lightboxIndex].title}
                className="max-h-[70vh] max-w-full object-contain rounded-xl shadow-2xl border border-white/10"
                referrerPolicy="no-referrer"
              />
              <div className="mt-4 text-center">
                <span className="text-xs uppercase tracking-widest text-[#d4af37] font-mono">
                  {filteredItems[lightboxIndex].category}
                </span>
                <h4 className="font-serif text-xl text-white font-medium mt-1">
                  {filteredItems[lightboxIndex].title}
                </h4>
                {filteredItems[lightboxIndex].description && (
                  <p className="text-xs text-slate-300 mt-1 max-w-lg">
                    {filteredItems[lightboxIndex].description}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={nextImage}
              className="absolute right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
