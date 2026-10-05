import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { MenuItem, FoodCategory } from '../types';
import { INITIAL_CATEGORIES } from '../data/seedData';
import { FoodCard3D, PlateComposition } from '../components/food3d';
import {
  Search,
  Flame,
  Star,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

export const MenuPage: React.FC = () => {
  const { navigate, addToCart } = useApp();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegetarianOnly, setVegetarianOnly] = useState(false);
  const [chefSpecialOnly, setChefSpecialOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high' | 'rating'>('recommended');
  const [inspectedDish, setInspectedDish] = useState<MenuItem | null>(null);

  useEffect(() => {
    setItems(api.getMenuItems());
  }, []);

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        const matchesCategory =
          selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch =
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.ingredients.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesVeg = !vegetarianOnly || item.isVeg;
        const matchesSpecial = !chefSpecialOnly || item.isChefSpecial;

        return matchesCategory && matchesSearch && matchesVeg && matchesSpecial;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') {
          return (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price);
        }
        if (sortBy === 'price-high') {
          return (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price);
        }
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        return (b.isChefSpecial ? 1 : 0) - (a.isChefSpecial ? 1 : 0);
      });
  }, [items, selectedCategory, searchQuery, vegetarianOnly, chefSpecialOnly, sortBy]);

  // Featured dish for the active category in the 3D Plate Showcase
  const categorySpotlightDish = useMemo(() => {
    if (filteredItems.length > 0) return filteredItems[0];
    return items[0] || null;
  }, [filteredItems, items]);

  return (
    <div className="min-h-screen bg-[#08090b] text-[#e2e8f0] pt-28 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* 3D Menu Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12 glass-card p-6 sm:p-10 rounded-3xl border border-gold-subtle">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              Interactive 3D Menu Explorer
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-white font-light leading-tight">
              The Culinary Compendium
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Every dish is cooked fresh over seasoned hardwood embers. Browse our disciplines below to
              view realistic 3D plate compositions and explore artisanal woodfire preparations.
            </p>
            <div className="pt-2 flex items-center gap-2">
              <span className="text-xs text-slate-400">Viewing Active Discipline:</span>
              <span className="text-xs font-bold text-gold-gradient uppercase font-mono px-3 py-1 rounded bg-white/5 border border-white/10">
                {selectedCategory}
              </span>
            </div>
          </div>

          <div className="lg:col-span-6 flex items-center justify-center">
            {categorySpotlightDish && (
              <PlateComposition
                foodImage={categorySpotlightDish.image}
                threeDFoodImage={categorySpotlightDish.threeDImage}
                alt={categorySpotlightDish.name}
                preset="truffle-pasta"
                plateType="slate"
                size="md"
                caption={categorySpotlightDish.name}
              />
            )}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="glass-card p-4 sm:p-6 rounded-2xl border border-gold-subtle mb-10 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes, truffles, wagyu..."
                className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37] transition-colors"
              />
            </div>

            {/* Quick Dietary and Sort Toggles */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => setVegetarianOnly(!vegetarianOnly)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  vegetarianOnly
                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50'
                    : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'
                }`}
              >
                🌱 Vegetarian
              </button>

              <button
                onClick={() => setChefSpecialOnly(!chefSpecialOnly)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  chefSpecialOnly
                    ? 'bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/50'
                    : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'
                }`}
              >
                ★ Chef Specials
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-400 ml-auto md:ml-0">
                <span className="hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-black/60 border border-white/10 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="recommended">Curated / Recommended</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2 border-t border-white/5">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === 'All'
                  ? 'bg-[#d4af37] text-[#0b0c10] shadow'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              All Offerings ({items.length})
            </button>
            {INITIAL_CATEGORIES.map((cat) => {
              const count = items.filter(
                (i) => i.category.toLowerCase() === cat.name.toLowerCase()
              ).length;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat.name
                      ? 'bg-[#d4af37] text-[#0b0c10] shadow'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* 3D Menu Cards Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-24 glass-card rounded-2xl border border-white/10">
            <p className="font-serif text-xl text-slate-300">No culinary offerings match your filter.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setVegetarianOnly(false);
                setChefSpecialOnly(false);
              }}
              className="mt-4 px-6 py-2.5 bg-[#d4af37] text-[#0b0c10] text-xs font-bold uppercase tracking-wider rounded"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((dish) => (
              <FoodCard3D
                key={dish.id}
                item={dish}
                onInspect={(d) => setInspectedDish(d)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 3D Food Card Quick Modal Inspection */}
      {inspectedDish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="max-w-2xl w-full glass-card p-6 sm:p-8 rounded-2xl border border-gold-subtle shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#d4af37] font-semibold block font-mono">
                  3D Food Presentation
                </span>
                <h3 className="font-serif text-2xl text-white">{inspectedDish.name}</h3>
              </div>
              <button
                onClick={() => setInspectedDish(null)}
                className="text-slate-400 hover:text-white p-1 text-sm font-mono"
              >
                ✕ Close
              </button>
            </div>

            <div className="flex justify-center py-4">
              <PlateComposition
                foodImage={inspectedDish.image}
                threeDFoodImage={inspectedDish.threeDImage}
                alt={inspectedDish.name}
                size="md"
              />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mt-2">
              {inspectedDish.description}
            </p>

            <div className="pt-5 flex items-center justify-between border-t border-white/10 mt-4">
              <div>
                <span className="text-xs text-slate-400 block font-mono">Price</span>
                <span className="text-2xl font-serif font-bold text-gold-gradient tabular-nums">
                  ${(inspectedDish.discountPrice ?? inspectedDish.price).toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    navigate(`/menu/${inspectedDish.slug}`);
                    setInspectedDish(null);
                  }}
                  className="px-4 py-2 glass-dark text-slate-300 hover:text-white text-xs font-semibold rounded border border-white/10"
                >
                  Full Details & Notes
                </button>
                <button
                  onClick={() => {
                    addToCart(inspectedDish, 1);
                    setInspectedDish(null);
                  }}
                  className="px-5 py-2 bg-[#d4af37] hover:bg-[#e5be49] text-[#0b0c10] text-xs font-bold rounded shadow uppercase tracking-wider font-brand"
                >
                  Add to Dining Bag
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
