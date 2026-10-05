import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { MenuItem } from '../types';
import { DishModelViewer } from '../components/canvas/DishModelViewer';
import { SEO } from '../components/common/SEO';
import { SocialShareModal } from '../components/common/SocialShareModal';
import {
  ArrowLeft,
  Star,
  Clock,
  Flame,
  ShoppingBag,
  ShieldCheck,
  Heart,
  Plus,
  Minus,
  Sparkles,
  Share2,
} from 'lucide-react';

interface MenuItemDetailPageProps {
  slug: string;
}

export const MenuItemDetailPage: React.FC<MenuItemDetailPageProps> = ({ slug }) => {
  const { navigate, addToCart, favorites, toggleFavorite } = useApp();
  const [dish, setDish] = useState<MenuItem | null>(null);
  const [activeMedia, setActiveMedia] = useState<'photo' | '3d'>('3d');
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    const items = api.getMenuItems();
    const found = items.find((i) => i.slug === slug);
    if (found) {
      setDish(found);
    } else if (items.length > 0) {
      setDish(items[0]);
    }
  }, [slug]);

  if (!dish) {
    return (
      <div className="min-h-screen bg-[#08090b] text-white flex items-center justify-center pt-24">
        <p className="font-serif text-xl">Loading culinary masterpiece...</p>
      </div>
    );
  }

  const isFav = favorites.includes(dish.id);
  const effectivePrice = dish.discountPrice ?? dish.price;

  return (
    <div className="min-h-screen bg-[#08090b] text-[#e2e8f0] pt-28 pb-24 px-6">
      <SEO
        title={`${dish.name} — ${dish.category}`}
        description={`${dish.description} Crafted on live California white oak coals. Order online or reserve tableside.`}
        keywords={`${dish.name}, ${dish.category}, woodfire dining, fine dining dish, San Francisco`}
        ogImage={dish.image}
        ogType="food"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'MenuItem',
          name: dish.name,
          description: dish.description,
          image: dish.image,
          offers: {
            '@type': 'Offer',
            price: (dish.discountPrice ?? dish.price).toString(),
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          },
        }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Back breadcrumb */}
        <button
          onClick={() => navigate('/menu')}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400 hover:text-[#d4af37] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu Compendium</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Visual Media (Photo / 3D Canvas Switcher) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => setActiveMedia('3d')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeMedia === '3d'
                    ? 'bg-[#d4af37] text-[#0b0c10] shadow'
                    : 'glass-dark text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                Interactive 3D View
              </button>
              <button
                onClick={() => setActiveMedia('photo')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeMedia === 'photo'
                    ? 'bg-[#d4af37] text-[#0b0c10] shadow'
                    : 'glass-dark text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                Culinary Photography
              </button>
            </div>

            {activeMedia === '3d' ? (
              <DishModelViewer
                modelType={dish.model3d || 'cloche'}
                title={dish.name}
                className="w-full h-96 sm:h-[460px]"
              />
            ) : (
              <div className="h-96 sm:h-[460px] rounded-2xl overflow-hidden glass-card p-3 border border-gold-subtle relative group">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Micro Details Grid */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="glass-card p-4 rounded-xl text-center border border-white/5">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
                  Preparation
                </span>
                <span className="font-semibold text-white text-sm flex items-center justify-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                  {dish.prepTime}
                </span>
              </div>
              <div className="glass-card p-4 rounded-xl text-center border border-white/5">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
                  Energy Content
                </span>
                <span className="font-semibold text-white text-sm tabular-nums">
                  {dish.calories} kcal
                </span>
              </div>
              <div className="glass-card p-4 rounded-xl text-center border border-white/5">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
                  Woodfire Profile
                </span>
                <span className="font-semibold text-white text-sm flex items-center justify-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-[#e65100]" />
                  Oak Charred
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="lg:col-span-5 glass-card p-8 rounded-2xl border border-gold-subtle space-y-6">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                  {dish.category}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShareModalOpen(true)}
                    className="p-2 rounded-full border border-white/10 text-slate-400 hover:text-[#d4af37] hover:border-[#d4af37]/40 transition-all"
                    title="Share Dish with 3D Card"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleFavorite(dish.id)}
                    className={`p-2 rounded-full border transition-all ${
                      isFav
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/50'
                        : 'border-white/10 text-slate-400 hover:text-white'
                    }`}
                    title="Favorite Dish"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl text-white font-medium">
                {dish.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-[#d4af37]">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1 text-sm font-bold text-white tabular-nums">
                    {dish.rating}
                  </span>
                </div>
                <span className="text-xs text-slate-400">· {dish.reviewCount} Reviews</span>
                {dish.isChefSpecial && (
                  <span className="text-[11px] text-[#ff9100] font-semibold">· Chef Special</span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 pb-4 border-b border-white/5">
              <span className="text-3xl font-serif font-bold text-gold-gradient tabular-nums">
                ${effectivePrice}
              </span>
              {dish.discountPrice && (
                <span className="text-sm line-through text-slate-500 tabular-nums">
                  ${dish.price}
                </span>
              )}
              <span className="text-xs text-emerald-400 ml-auto font-medium">
                Available for Dinner
              </span>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              {dish.description}
            </p>

            {/* Ingredients */}
            <div>
              <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                Heritage Ingredients
              </h4>
              <div className="flex flex-wrap gap-1.5 text-xs text-slate-300">
                {dish.ingredients.map((ing, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded bg-white/5 border border-white/10"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Allergens */}
            {dish.allergens.length > 0 && (
              <div>
                <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  Allergen Transparency
                </h4>
                <p className="text-xs text-slate-400">
                  Contains: {dish.allergens.join(', ')}
                </p>
              </div>
            )}

            {/* Quantity Stepper & Special Instructions */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Portion Quantity:</span>
                <div className="flex items-center gap-3 bg-black/50 border border-white/10 rounded-lg p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1.5 text-slate-400 hover:text-white transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-bold font-mono px-2 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1.5 text-slate-400 hover:text-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  Culinary Notes / Preferences (Optional):
                </label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Extra truffles, dressing on side..."
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              {/* Add to Cart CTA */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => addToCart(dish, quantity, instructions)}
                  className="w-full py-3.5 bg-[#d4af37] hover:bg-[#e5be49] text-[#0b0c10] text-xs font-bold uppercase tracking-wider rounded font-brand shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={() => {
                    addToCart(dish, quantity, instructions);
                    navigate('/cart');
                  }}
                  className="w-full py-3.5 glass-dark hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider rounded border border-white/20 transition-all"
                >
                  Order Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Animated Social Card Modal for Dish */}
      <SocialShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title={dish.name.toUpperCase()}
        subtitle={`${dish.category} · Crafted on Live White Oak Embers`}
        badge="SIGNATURE WOODFIRE DISH"
        ogImageUrl={dish.image}
      />
    </div>
  );
};
