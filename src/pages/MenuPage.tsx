import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { MenuItem, FoodCategory } from '../types';
import { INITIAL_CATEGORIES } from '../data/seedData';
import { DishModelViewer } from '../components/canvas/DishModelViewer';
import { MenuHero3D } from '../components/3d/MenuHero3D';
import {
  Search,
  SlidersHorizontal,
  Flame,
  Star,
  ShoppingBag,
  Eye,
  Heart,
  Clock,
  Sparkles,
  Info,
  Check,
} from 'lucide-react';

export const MenuPage: React.FC = () => {
  const { navigate, addToCart, favorites, toggleFavorite } = useApp();
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

  return (
    <div className="min-h-screen bg-[#08090b] text-[#e2e8f0] pt-28 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* 3D Menu Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12 glass-card p-6 sm:p-10 rounded-3xl border border-gold-subtle">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
              Interactive 3D Menu Explorer
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-white font-light leading-tight">
              The Culinary Compendium
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Every dish is cooked fresh over seasoned hardwood embers. Change categories below to morph
              the 3D culinary centerpiece and explore custom woodfire finishes.
            </p>
            <div className="pt-2 flex items-center gap-2">
              <span className="text-xs text-slate-400">Viewing Active Discipline:</span>
              <span className="text-xs font-bold text-gold-gradient uppercase font-mono px-2.5 py-1 rounded bg-white/5 border border-white/10">
                {selectedCategory}
              </span>
            </div>
          </div>

          <div className="lg:col-span-6 h-64 sm:h-80 relative rounded-2xl overflow-hidden glass-dark border border-white/5">
            <MenuHero3D category={selectedCategory} />
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

          {/* Category Tabs (Segmented Controls) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-2 scrollbar-thin">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === 'All'
                  ? 'bg-[#d4af37] text-[#0b0c10] shadow'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              All Categories
            </button>
            {INITIAL_CATEGORIES.map((cat) => {
              const active = selectedCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-[#d4af37] text-[#0b0c10] shadow'
                      : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-6 px-1">
          <span>
            Showing <strong className="text-white font-mono">{filteredItems.length}</strong> master dishes
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#d4af37] hover:underline"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Menu Cards Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-24 glass-card rounded-2xl border border-white/10">
            <p className="text-lg font-serif text-slate-300">No dishes match your active filter.</p>
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
            {filteredItems.map((dish) => {
              const isFav = favorites.includes(dish.id);
              return (
                <div
                  key={dish.id}
                  className="glass-card rounded-2xl overflow-hidden border border-gold-subtle flex flex-col group hover:-translate-y-1.5 transition-all duration-300 hover:shadow-2xl"
                >
                  {/* Image slot */}
                  <div className="relative h-60 bg-black/40 overflow-hidden">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e1016] via-transparent to-black/30" />

                    {/* Top status & actions */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#0b0c10]/80 text-[#d4af37] font-medium backdrop-blur">
                          {dish.category}
                        </span>
                        {dish.isChefSpecial && (
                          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#e65100]/80 text-white font-medium backdrop-blur">
                            Chef Special
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setInspectedDish(dish)}
                          className="p-1.5 rounded-full bg-black/60 text-slate-300 hover:text-white backdrop-blur transition-all"
                          title="View in 3D"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleFavorite(dish.id)}
                          className={`p-1.5 rounded-full backdrop-blur transition-all ${
                            isFav ? 'bg-rose-500 text-white' : 'bg-black/60 text-slate-300 hover:text-white'
                          }`}
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    </div>

                    {/* Bottom overlay metadata */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-[#d4af37] fill-current" />
                        <span className="font-semibold text-white">{dish.rating}</span>
                        <span className="text-slate-400">({dish.reviewCount})</span>
                      </div>
                      <span className="text-[11px] text-slate-400">{dish.prepTime}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        onClick={() => navigate(`/menu/${dish.slug}`)}
                        className="font-serif text-xl text-white font-medium hover:text-[#d4af37] cursor-pointer transition-colors"
                      >
                        {dish.name}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mt-1 mb-4">
                        {dish.description}
                      </p>

                      {/* Ingredients metadata with typographic separators */}
                      <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-1.5 mb-5">
                        {dish.ingredients.slice(0, 3).map((ing, idx) => (
                          <React.Fragment key={idx}>
                            <span>{ing}</span>
                            {idx < 2 && <span aria-hidden="true">·</span>}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold font-serif text-gold-gradient tabular-nums">
                          ${dish.discountPrice ?? dish.price}
                        </span>
                        {dish.discountPrice && (
                          <span className="text-xs line-through text-slate-500 tabular-nums">
                            ${dish.price}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setInspectedDish(dish)}
                          className="px-3 py-1.5 text-xs rounded glass-dark text-slate-300 hover:text-white border border-white/10"
                        >
                          3D Model
                        </button>
                        <button
                          onClick={() => addToCart(dish, 1)}
                          className="p-2 bg-[#d4af37] hover:bg-[#e5be49] text-[#0b0c10] rounded transition-all shadow hover:scale-105"
                          title="Add to Dining Bag"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3D Inspection Modal */}
      {inspectedDish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="max-w-2xl w-full glass-card p-6 rounded-2xl border border-gold-subtle shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#d4af37] font-semibold block">
                  3D Interactive Inspection
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

            <DishModelViewer modelType={inspectedDish.model3d || 'cloche'} />

            <div className="pt-5 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Chef's Price</span>
                <span className="text-2xl font-serif font-bold text-gold-gradient tabular-nums">
                  ${inspectedDish.discountPrice ?? inspectedDish.price}
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
                  Tasting Notes & Ingredients
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
