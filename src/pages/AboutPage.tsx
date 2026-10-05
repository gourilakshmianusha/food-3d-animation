import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PlateComposition, FloatingIngredient, ShadowLayer, FoodTilt } from '../components/food3d';
import { Award, Flame, HeartHandshake, Sparkles, Clock, ArrowRight, Utensils, Users, BookOpen } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigate } = useApp();
  const [activeEra, setActiveEra] = useState(0);

  const timeline = [
    {
      year: '2018',
      title: 'The Spark Kindled',
      desc: 'Chef Julian Vance founded our hearth sanctuary in an abandoned historic brick warehouse along the San Francisco waterfront.',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      foodType: 'wagyu-hearth' as const,
    },
    {
      year: '2020',
      title: 'The 72-Hour Sourdough Mother',
      desc: 'Creation of ‘Vesta’, our wild mother fermentation starter that today anchors every pizza crust and hearth loaf.',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      foodType: 'woodfire-pizza' as const,
    },
    {
      year: '2022',
      title: 'First Michelin Guide Acclaim',
      desc: 'Honored with Michelin Guide recommendation for master woodfire craftsmanship and sustainable zero-kilometer sourcing.',
      image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281724?auto=format&fit=crop&w=800&q=80',
      foodType: 'truffle-pasta' as const,
    },
    {
      year: '2024',
      title: 'The Private Ember Cellar',
      desc: 'Unveiling our underground architectural wine sanctuary featuring 1,400+ volcanic and low-intervention reserve labels.',
      image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80',
      foodType: 'artisan-dessert' as const,
    },
    {
      year: '2026',
      title: 'Interactive Sensory Dining',
      desc: 'Merging ancient live charcoal Dhungar infusions with modern tableside theatrical cloche reveals.',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      foodType: 'wagyu-hearth' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-[#08090b] text-[#e2e8f0] pt-28 pb-24 px-6">
      <div className="max-w-6xl mx-auto space-y-28">
        {/* ========================================================
            1. OUR STORY: Hero Section
        ======================================================== */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold font-mono">
            01 · Our Story
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-white font-light leading-tight">
            The Soul of Live Embers
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            In an era of hyper-processed convenience and cold automation, The Ember Table was born out of
            a passionate reverence for mankind’s oldest culinary element: hardwood embers glowing in the dark.
          </p>
        </section>

        {/* ========================================================
            2. OUR PHILOSOPHY: Chef Portrait + Floating Plate Composition
            Layered image composition: Chef image + floating plate + ingredients + shadow
        ======================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold font-mono">
              02 · Our Philosophy
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-light">
              "We do not cook over fire to show off; we cook over fire to listen."
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              When white oak catches fire, it roars. But when it subsides into deep crimson embers, it whispers.
              Infrared heat cooks from the core outward without scorching the fragile surface fats.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Every timber we burn is sourced from sustainable fallen trees in Mendocino and Sonoma. No gas
              accelerants, no artificial pellets. Only clean hardwood, Himalayan sea salt, and patient hands.
            </p>
            <div className="pt-2">
              <span className="font-serif italic text-lg text-gold-gradient block">Julian Vance</span>
              <span className="text-xs text-slate-400 uppercase tracking-widest font-mono">
                Executive Chef & Founder
              </span>
            </div>
          </div>

          {/* Layered Composition: Chef Portrait + Floating Plate + Ingredients + Shadows */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Background Texture & Chef Card */}
            <div className="relative w-full max-w-md h-[440px] rounded-3xl overflow-hidden glass-card p-2.5 border border-gold-subtle shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80"
                alt="Chef Julian Vance by the woodfire"
                className="w-full h-full object-cover rounded-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
            </div>

            {/* Overlapping Floating Plate Layer in 3D Depth */}
            <div className="absolute -bottom-8 -left-6 sm:-left-10 z-20 w-64 h-64 sm:w-72 sm:h-72">
              <PlateComposition
                foodImage="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80"
                alt="A5 Wagyu on Plate"
                preset="wagyu-hearth"
                plateType="slate"
                size="sm"
              />
            </div>
          </div>
        </section>

        {/* ========================================================
            3. OUR INGREDIENTS: Pillars of Earth & Sea
        ======================================================== */}
        <section className="space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold font-mono">
              03 · Our Ingredients
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-light">
              Purity of the Source
            </h2>
            <p className="text-xs text-slate-400">
              Zero shortcuts. Every raw ingredient is traced directly to its grower, forager, or diver.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-2xl border border-white/10 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#e65100]/20 flex items-center justify-center text-[#ff7043]">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-white">Pure Oak Hearth</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zero electricity or gas burners in our main hot kitchen line. Everything from 36-hour slow-simmered
                lentils to 90-second charred sourdough pizza is crafted with radiant live wood.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl border border-white/10 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37]">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-white">Ancient Dhungar</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Revering the 300-year royal Indian method of infusing hot clarified ghee vapor from glowing
                hardwood charcoal directly into gravies and compound finishing butters.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl border border-white/10 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-white">Wild Foraging</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Wild herbs, river valley watercress, and seasonal chanterelles gathered bi-weekly before dawn,
                honoring zero-kilometer regional seasonality.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================
            4. OUR KITCHEN & 5. OUR CHEFS: The Brigade & Historic Milestones
        ======================================================== */}
        <section className="space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold font-mono">
              04 · Our Kitchen & Milestones
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-light">
              The Historical Chronicle
            </h2>
            <p className="text-xs text-slate-400">
              Follow our evolution through five eras of culinary woodfire innovation.
            </p>
          </div>

          {/* Interactive Era Showcase with 3D Plate & Photography */}
          <div className="glass-card p-6 sm:p-10 rounded-3xl border border-gold-subtle grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="flex gap-2 mb-3">
                {timeline.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveEra(idx)}
                    className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                      activeEra === idx
                        ? 'bg-[#d4af37] text-black font-bold shadow-lg shadow-[#d4af37]/20'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.year}
                  </button>
                ))}
              </div>

              <span className="text-xs font-mono font-bold text-[#d4af37] uppercase tracking-widest">
                Era {timeline[activeEra].year}
              </span>
              <h3 className="font-serif text-3xl text-white font-light">
                {timeline[activeEra].title}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {timeline[activeEra].desc}
              </p>
            </div>

            <div className="lg:col-span-6 flex items-center justify-center">
              <PlateComposition
                foodImage={timeline[activeEra].image}
                alt={timeline[activeEra].title}
                preset={timeline[activeEra].foodType}
                plateType="copper"
                size="md"
              />
            </div>
          </div>
        </section>

        {/* ========================================================
            6. OUR RESTAURANT & 7. OUR GUESTS: Invitation CTA
        ======================================================== */}
        <section className="glass-card p-10 sm:p-14 rounded-3xl border border-gold-subtle text-center space-y-6">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold font-mono">
            05 · Our Restaurant & Guests
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-white font-light">
            Taste the Woodfire Tradition
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            Join us for an evening of warmth, live smoke infusions, and unhurried conversation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('/reservation')}
              className="px-8 py-4 bg-[#d4af37] hover:bg-[#e5be49] text-[#0b0c10] text-xs font-bold uppercase tracking-widest rounded font-brand shadow-lg"
            >
              Book a Table
            </button>
            <button
              onClick={() => navigate('/menu')}
              className="px-8 py-4 glass-dark text-white hover:bg-white/10 text-xs font-semibold uppercase tracking-widest rounded border border-white/10"
            >
              Explore Menu
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
