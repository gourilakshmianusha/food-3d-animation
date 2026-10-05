import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { BlogPost } from '../types';
import { Search, Clock, ArrowRight, BookOpen, Tag, Sparkles } from 'lucide-react';
import { KitchenScene } from '../components/3d/KitchenScene';

export const BlogPage: React.FC = () => {
  const { navigate } = useApp();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setBlogs(api.getBlogs().filter((b) => b.status === 'Published'));
  }, []);

  const categories = [
    'All',
    'Culinary Technique',
    'Ingredients & Sourcing',
    'Pastry & Desserts',
    'Culinary Heritage',
    'Baking & Bread',
    'Mixology & Drinks',
    'Wine & Cellar',
  ];

  const filteredBlogs = blogs.filter((b) => {
    const matchesCat = activeCategory === 'All' || b.category === activeCategory;
    const matchesSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.content.toLowerCase().includes(search.toLowerCase()) ||
      b.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const featured = blogs[0];

  return (
    <div className="min-h-screen bg-[#08090b] text-[#e2e8f0] pt-28 pb-24 px-6">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
            Gastronomy, Fire & Technique
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-light">
            The Hearth Chronicle
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Essays on live woodfire thermodynamics, 72-hour wild fermentation, Périgord truffle hunting,
            and ancestral Dhungar charcoal infusions.
          </p>
        </div>

        {/* 3D Behind-the-Scenes Culinary Workshop */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-gold-subtle grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              3D Live Kitchen Station
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-light">
              From the Chef’s Notebook
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Step inside our test kitchen where recipes are born. Watch the copper sauté pan simmer, aromatic herbs
              meet hand-forged blades, and white oak charcoal infuse delicate broths.
            </p>
            <div className="text-[11px] font-mono text-[#d4af37]">
              Interactive 3D Kitchen: Move mouse to orbit the prep station & steam wisps
            </div>
          </div>

          <div className="lg:col-span-7 h-72 sm:h-80 rounded-2xl overflow-hidden glass-dark border border-white/10 relative">
            <KitchenScene activeStation={1} />
            <div className="absolute bottom-3 left-4 text-[10px] text-[#d4af37] font-mono uppercase tracking-wider bg-black/60 px-2.5 py-1 rounded backdrop-blur">
              The Copper Sauté & White Oak Station
            </div>
          </div>
        </div>

        {/* Featured Article Hero */}
        {featured && !search && activeCategory === 'All' && (
          <div
            onClick={() => navigate(`/blog/${featured.slug}`)}
            className="glass-card rounded-3xl overflow-hidden border border-gold-subtle grid grid-cols-1 lg:grid-cols-12 gap-8 items-center group cursor-pointer hover:shadow-2xl transition-all"
          >
            <div className="lg:col-span-7 h-80 sm:h-[420px] overflow-hidden relative">
              <img
                src={featured.featuredImage}
                alt={featured.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur px-3 py-1 rounded text-xs uppercase tracking-wider text-[#d4af37] font-semibold">
                Editor's Lead Essay
              </div>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-10 space-y-4">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>{featured.category}</span>
                <span>·</span>
                <span>{featured.publishDate}</span>
                <span>·</span>
                <span>{featured.readTime}</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl text-white group-hover:text-[#d4af37] transition-colors leading-snug">
                {featured.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                {featured.excerpt}
              </p>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-[#d4af37] font-semibold uppercase tracking-wider">
                  By {featured.author}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 group-hover:text-white transition-colors">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Search & Categories */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-white/10">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search essays, woodfire, fermentation..."
              className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-[#d4af37] text-[#0b0c10]'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((b) => (
            <div
              key={b.id}
              onClick={() => navigate(`/blog/${b.slug}`)}
              className="glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col group cursor-pointer hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="h-56 overflow-hidden relative">
                <img
                  src={b.featuredImage}
                  alt={b.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur px-2.5 py-1 rounded text-[11px] text-[#d4af37] font-semibold">
                  {b.category}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span>{b.publishDate}</span>
                    <span>·</span>
                    <span>{b.readTime}</span>
                  </div>

                  <h3 className="font-serif text-xl text-white group-hover:text-[#d4af37] transition-colors leading-snug">
                    {b.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {b.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">By {b.author}</span>
                  <span className="text-[#d4af37] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
