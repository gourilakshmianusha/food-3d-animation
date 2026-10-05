import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { MenuItem } from '../types';
import { Hero3DCanvas } from '../components/canvas/Hero3DCanvas';
import { Story3DCanvas } from '../components/canvas/Story3DCanvas';
import { DishModelViewer } from '../components/canvas/DishModelViewer';
import { SignatureDishScroll3D } from '../components/3d/SignatureDishScroll3D';
import { ChefSection3D } from '../components/3d/ChefSection3D';
import { TableScene } from '../components/3d/TableScene';
import {
  Calendar,
  ArrowRight,
  Flame,
  Sparkles,
  ShoppingBag,
  Star,
  Award,
  ChevronRight,
  Clock,
  Heart,
  Eye,
  Check,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigate, addToCart, favorites, toggleFavorite } = useApp();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeStoryStage, setActiveStoryStage] = useState<number>(0);
  const [inspectedDish, setInspectedDish] = useState<MenuItem | null>(null);

  useEffect(() => {
    setMenuItems(api.getMenuItems());
  }, []);

  const signatureDishes = menuItems.filter((i) => i.isChefSpecial || i.isBestseller).slice(0, 6);
  const popularDishes = menuItems.filter((i) => i.rating >= 4.9).slice(0, 8);
  const chefs = api.getChefs().slice(0, 3);
  const blogs = api.getBlogs().slice(0, 3);
  const testimonials = api.getTestimonials().slice(0, 3);
  const galleryItems = api.getGallery().slice(0, 6);

  const storyStages = [
    {
      stage: 0,
      title: 'The Living Hearth',
      subtitle: 'White Oak & Incandescent Embers',
      description:
        'Every culinary journey begins before sunrise. We kindle seasoned California white oak and cherry timber until the raw flame yields to glowing, radiant embers at 1,100°F.',
      tag: '01. FOUNDATION',
    },
    {
      stage: 1,
      title: 'Purity of the Elements',
      subtitle: 'Zero-Kilometer Foraging & Rare Spices',
      description:
        'Hand-harvested sea salt crystals from Brittany, cracked Sarawak peppercorns, wild river valley herbs, and 300-year Awadhi saffron are curated in sacred harmony.',
      tag: '02. SOURCING',
    },
    {
      stage: 2,
      title: 'The Searing Iron',
      subtitle: 'Cast Iron Met With Radiant Heat',
      description:
        'A5 Miyazaki Wagyu and day-boat seafood touch blistering hand-forged skillets. The caramelized crust locks in luscious marbled juices while natural woodsmoke perfumes each bite.',
      tag: '03. ALCHEMY',
    },
    {
      stage: 3,
      title: 'The Tableside Cloche',
      subtitle: 'Aromatic Vapor & 24k Gold Accents',
      description:
        'Presented under our bespoke golden bell. As our server lifts the cloche at your table, a fragrant plume of hickory steam billows into the room, commencing the sensory feast.',
      tag: '04. REVELATION',
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#08090b] text-[#e2e8f0] overflow-hidden">
      {/* ========================================================
          1. 3D HERO SECTION: "CRAFTED FOR THE SENSES"
      ======================================================== */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Full-Screen 3D Three.js Centerpiece */}
        <div className="absolute inset-0 z-0">
          <Hero3DCanvas />
        </div>

        {/* Ambient Radial Gradients */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-b from-[#e65100]/10 via-[#d4af37]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Hero DOM Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pointer-events-auto mt-28 md:mt-36">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 animate-in fade-in slide-in-from-bottom-3 duration-700">
            <Flame className="w-3.5 h-3.5 text-[#ff7043]" />
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-medium">
              Michelin Guide Recommended · 2026
            </span>
          </div>

          <h1 className="font-brand text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gold-gradient uppercase leading-[1.05] mb-6 drop-shadow-2xl">
            Crafted For The Senses
          </h1>

          <p className="font-serif italic text-xl sm:text-2xl md:text-3xl text-slate-300 font-light max-w-2xl mx-auto mb-10 leading-relaxed text-wrap-balance">
            Experience food differently. Where ancestral woodfire embers awaken extraordinary culinary textures.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <button
              onClick={() => navigate('/menu')}
              className="w-full sm:w-auto px-8 py-4 bg-[#d4af37] hover:bg-[#e5be49] text-[#0b0c10] font-bold text-xs uppercase tracking-widest rounded shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 group font-brand"
            >
              <span>Explore Menu</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => navigate('/reservation')}
              className="w-full sm:w-auto px-8 py-4 glass-dark hover:bg-white/10 text-white font-semibold text-xs uppercase tracking-widest rounded border border-white/20 hover:border-[#d4af37] transition-all flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#d4af37]" />
              <span>Book a Table</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 mt-12 border-t border-white/10 text-center max-w-3xl mx-auto">
            <div>
              <span className="block text-2xl font-serif text-gold-gradient font-bold tabular-nums">1,100°F</span>
              <span className="text-[11px] uppercase tracking-wider text-slate-400">White Oak Hearth</span>
            </div>
            <div>
              <span className="block text-2xl font-serif text-gold-gradient font-bold tabular-nums">72-Hour</span>
              <span className="text-[11px] uppercase tracking-wider text-slate-400">Cold Fermentation</span>
            </div>
            <div>
              <span className="block text-2xl font-serif text-gold-gradient font-bold tabular-nums">A5 Grade</span>
              <span className="text-[11px] uppercase tracking-wider text-slate-400">Miyazaki Wagyu</span>
            </div>
            <div>
              <span className="block text-2xl font-serif text-gold-gradient font-bold tabular-nums">1,400+</span>
              <span className="text-[11px] uppercase tracking-wider text-slate-400">Cellar Reserves</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. RESTAURANT INTRODUCTION & WOODFIRE PHILOSOPHY
      ======================================================== */}
      <section className="py-28 px-6 relative border-t border-white/5 bg-[#0a0c10]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
              The Woodfire Sanctuary
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-tight">
              Where fire is not merely heat, but our seventh ingredient.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              At The Ember Table, we believe that modern cooking has traded soul for speed. We have chosen
              the deliberate, patient path of open hardwood embers.
            </p>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Every cut of meat, every hand-extruded strand of saffron pasta, and every seasonal mushroom
              is treated as a canvas for radiant infrared heat. We do not mask nature; we reveal its innermost depth.
            </p>

            <div className="pt-4 flex items-center gap-6">
              <button
                onClick={() => navigate('/about')}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#d4af37] hover:text-[#fff2b2] font-semibold transition-colors group"
              >
                <span>Read Our Full Story</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Interactive Feature Showcase with Video/Visual Plinth */}
          <div className="relative rounded-2xl overflow-hidden glass-card p-4 border border-gold-subtle group">
            <div className="relative h-96 sm:h-[450px] rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"
                alt="Woodfire Kitchen Hearth at The Ember Table"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[11px] uppercase tracking-widest text-[#d4af37] font-semibold block mb-1">
                  The Open Hearth Brigade
                </span>
                <h3 className="font-serif text-2xl text-white font-medium">
                  Chef Julian Vance & Masters of Fire
                </h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                  Operating 3 distinct fire pits fueled exclusively with hand-split aged oak and fruitwoods.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. SCROLL-DRIVEN 3D STORYTELLING SECTION
      ======================================================== */}
      <section className="py-28 px-6 bg-[#07080a] relative border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
              Sensory Odyssey
            </span>
            <h2 className="font-brand text-3xl sm:text-4xl lg:text-5xl font-bold text-gold-gradient uppercase mt-2">
              From Timber to Platter
            </h2>
            <p className="text-slate-400 text-sm mt-3">
              Explore the four sacred stages of our open-hearth cooking process in interactive 3D space.
            </p>
          </div>

          {/* Interactive Stage Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {storyStages.map((st) => (
              <button
                key={st.stage}
                onClick={() => setActiveStoryStage(st.stage)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeStoryStage === st.stage
                    ? 'bg-[#d4af37] text-[#0b0c10] shadow-lg scale-105'
                    : 'glass-dark text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {st.tag}
              </button>
            ))}
          </div>

          {/* 3D Story Canvas & Narrative Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center glass-card p-6 sm:p-10 rounded-2xl border border-gold-subtle">
            <div className="lg:col-span-7 h-[420px] sm:h-[480px] rounded-xl overflow-hidden relative">
              <Story3DCanvas currentStage={activeStoryStage} progress={activeStoryStage / 3} />
            </div>

            <div className="lg:col-span-5 space-y-5">
              <div className="inline-block px-3 py-1 rounded bg-[#d4af37]/10 text-[#d4af37] text-xs font-bold font-mono">
                {storyStages[activeStoryStage].tag}
              </div>
              <h3 className="font-serif text-3xl text-white font-medium">
                {storyStages[activeStoryStage].title}
              </h3>
              <h4 className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold">
                {storyStages[activeStoryStage].subtitle}
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                {storyStages[activeStoryStage].description}
              </p>

              <div className="pt-4 flex items-center gap-3">
                <button
                  onClick={() =>
                    setActiveStoryStage((prev) => (prev + 1) % storyStages.length)
                  }
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-semibold tracking-wider uppercase transition-colors"
                >
                  Next Chapter →
                </button>
                <button
                  onClick={() => navigate('/menu')}
                  className="px-5 py-2.5 bg-[#d4af37] hover:bg-[#e5be49] text-[#0b0c10] rounded text-xs font-semibold tracking-wider uppercase transition-colors"
                >
                  Taste the Result
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. SIGNATURE DISHES — SCROLL-DRIVEN 3D SECTION
      ======================================================== */}
      <section className="py-28 px-6 bg-[#0a0c10] border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                Curated by Executive Chef Julian Vance
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-light mt-2">
                Signature Culinary Creations
              </h2>
            </div>
            <button
              onClick={() => navigate('/menu')}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#d4af37] hover:text-white font-semibold transition-colors"
            >
              <span>View Complete 20+ Dish Menu</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive 3D Signature Dish Carousel */}
          <SignatureDishScroll3D />
        </div>
      </section>

      {/* ========================================================
          5. CHEF BRIGADE — THE ART BEHIND THE PLATE (3D)
      ======================================================== */}
      <section className="py-28 px-6 bg-[#08090b] border-t border-white/5">
        <div className="max-w-7xl mx-auto space-y-12">
          <ChefSection3D />
        </div>
      </section>

      {/* ========================================================
          6. THE VISUAL SANCTUARY (GALLERY PREVIEW)
      ======================================================== */}
      <section className="py-24 px-6 bg-[#0a0c10] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                Atmosphere & Craft
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-white font-light mt-1">
                Scenes From The Hearth
              </h2>
            </div>
            <button
              onClick={() => navigate('/gallery')}
              className="text-xs uppercase tracking-wider text-[#d4af37] hover:underline font-semibold"
            >
              View All 12 Gallery Frames →
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {galleryItems.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate('/gallery')}
                className="relative h-48 rounded-xl overflow-hidden group cursor-pointer border border-white/5"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] text-white font-medium drop-shadow block truncate">
                    {item.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          7. GUEST TESTIMONIALS & CRITIC ACCLAIM
      ======================================================== */}
      <section className="py-24 px-6 bg-[#07080a] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
              The Critical Consensus
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-light mt-1">
              Guest Impressions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="glass-card p-8 rounded-2xl border border-gold-subtle flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 mb-4 text-[#d4af37]">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="font-serif italic text-base text-slate-200 leading-relaxed mb-6">
                    "{t.review}"
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                  <img
                    src={t.image}
                    alt={t.customerName}
                    className="w-10 h-10 rounded-full object-cover border border-[#d4af37]/40"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-white">{t.customerName}</h4>
                    <span className="text-xs text-slate-400">{t.designation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          8. JOURNAL & CULINARY ESSAYS PREVIEW
      ======================================================== */}
      <section className="py-24 px-6 bg-[#0a0c10] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                The Hearth Chronicle
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-white font-light mt-1">
                Culinary Journal
              </h2>
            </div>
            <button
              onClick={() => navigate('/blog')}
              className="text-xs uppercase tracking-wider text-[#d4af37] hover:underline font-semibold"
            >
              Read All 10 Essays →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map((b) => (
              <div
                key={b.id}
                onClick={() => navigate(`/blog/${b.slug}`)}
                className="glass-card rounded-2xl overflow-hidden border border-white/10 group cursor-pointer hover:-translate-y-1 transition-all"
              >
                <div className="h-52 overflow-hidden relative">
                  <img
                    src={b.featuredImage}
                    alt={b.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur px-2.5 py-1 rounded text-[11px] text-[#d4af37] font-medium">
                    {b.category}
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span>{b.publishDate}</span>
                    <span>·</span>
                    <span>{b.readTime}</span>
                  </div>
                  <h3 className="font-serif text-xl text-white group-hover:text-[#d4af37] transition-colors leading-snug">
                    {b.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {b.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          9. RESERVATION CALL TO ACTION — 3D TABLE SCENE
      ======================================================== */}
      <section className="py-24 px-6 bg-gradient-to-b from-[#08090b] via-[#120f0c] to-[#08090b] border-t border-white/5 relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          {/* 3D Table Scene */}
          <div className="lg:col-span-6 h-80 sm:h-96 relative rounded-2xl overflow-hidden glass-card border border-gold-subtle">
            <TableScene guestCount={2} interactive={true} />
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 text-[#d4af37] text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              <span>Limited Seating Nightly</span>
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-light leading-tight">
              Your Table Is Waiting
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Fine porcelain, crystal stems, and flickering candlelight awaiting your presence.
              Reservations are released 30 days in advance.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => navigate('/reservation')}
                className="w-full sm:w-auto px-8 py-4 bg-[#d4af37] hover:bg-[#e5be49] text-[#0b0c10] font-bold text-xs uppercase tracking-widest rounded shadow-xl hover:scale-105 transition-all font-brand"
              >
                Book Your Table
              </button>
              <button
                onClick={() => navigate('/private-dining')}
                className="w-full sm:w-auto px-8 py-4 glass-dark hover:bg-white/10 text-white font-semibold text-xs uppercase tracking-widest rounded border border-white/20 transition-all"
              >
                Inquire Private Dining
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Model Modal Inspection for Dishes */}
      {inspectedDish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="max-w-2xl w-full glass-card p-6 rounded-2xl border border-gold-subtle shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#d4af37] font-semibold block">
                  3D Food Inspection
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
                  Full Details & Tasting Notes
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
