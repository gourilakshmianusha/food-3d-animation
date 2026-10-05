import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Award, Flame, HeartHandshake, Sparkles, Clock, ArrowRight, ChevronRight } from 'lucide-react';
import { Timeline3DScene } from '../components/3d/Timeline3DScene';

export const AboutPage: React.FC = () => {
  const { navigate } = useApp();
  const [activeStage, setActiveStage] = useState(0);

  const timeline = [
    {
      year: '2018',
      title: 'The Spark Kindled',
      desc: 'Chef Julian Vance founded our hearth sanctuary in an abandoned historic brick warehouse along the San Francisco waterfront.',
      stage: 0,
      stationName: 'Fire Embers & Hardwood',
    },
    {
      year: '2020',
      title: 'The 72-Hour Sourdough Mother',
      desc: 'Creation of ‘Vesta’, our wild mother fermentation starter that today anchors every pizza crust and hearth loaf.',
      stage: 1,
      stationName: 'Wild Foraged Flora',
    },
    {
      year: '2022',
      title: 'First Michelin Guide Acclaim',
      desc: 'Honored with Michelin Guide recommendation for master woodfire craftsmanship and sustainable zero-kilometer sourcing.',
      stage: 2,
      stationName: 'Hand-Forged Copper Pan',
    },
    {
      year: '2024',
      title: 'The Private Ember Cellar',
      desc: 'Unveiling our underground architectural wine sanctuary featuring 1,400+ volcanic and low-intervention reserve labels.',
      stage: 3,
      stationName: 'A5 Wagyu & Iron Craft',
    },
    {
      year: '2026',
      title: 'Interactive Sensory Dining',
      desc: 'Merging ancient live charcoal Dhungar infusions with modern tableside theatrical cloche reveals.',
      stage: 4,
      stationName: 'The Tableside Cloche',
    },
  ];

  return (
    <div className="min-h-screen bg-[#08090b] text-[#e2e8f0] pt-28 pb-24 px-6">
      <div className="max-w-6xl mx-auto space-y-24">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
            Our Heritage & Philosophy
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-white font-light leading-tight">
            The Soul of Live Embers
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            In an era of hyper-processed convenience and cold automation, The Ember Table was born out of
            a passionate reverence for mankind’s oldest culinary element: hardwood embers glowing in the dark.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
              The Founder’s Creed
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
              <span className="text-xs text-slate-400 uppercase tracking-widest">
                Culinary Director & Founder
              </span>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden glass-card p-3 border border-gold-subtle">
            <img
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1000&q=80"
              alt="Chef Julian Vance by the woodfire"
              className="w-full h-[440px] object-cover rounded-xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Pillars of Craft */}
        <div className="space-y-10">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
              The Three Tenets
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-light mt-1">
              Culinary Pillars
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-2xl border border-white/10 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#e65100]/20 flex items-center justify-center text-[#ff7043]">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-white">Pure Oak Hearth</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zero electricity or gas burners in our main hot kitchen. Everything from 36-hour slow-simmered
                lentils to 90-second charred Neapolitan pizza is crafted with radiant live wood.
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
        </div>

        {/* Interactive 3D Spatial Timeline */}
        <div className="space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
              The Journey
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-light mt-1">
              Historical Timeline
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              Select an era below to travel our 3D spatial timeline from raw charcoal embers to tableside cloche.
            </p>
          </div>

          {/* 3D Timeline Visualizer */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-gold-subtle relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Active Era:</span>
                <span className="text-xs font-bold text-gold-gradient font-mono px-3 py-1 rounded bg-white/5 border border-white/10">
                  {timeline[activeStage].year} — {timeline[activeStage].stationName}
                </span>
              </div>
              <div className="flex gap-2">
                {timeline.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStage(idx)}
                    className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                      activeStage === idx
                        ? 'bg-[#d4af37] text-black font-bold shadow-lg shadow-[#d4af37]/20'
                        : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {item.year}
                  </button>
                ))}
              </div>
            </div>

            <Timeline3DScene currentStage={activeStage} />
          </div>

          <div className="relative border-l border-white/10 pl-6 sm:pl-10 space-y-10 max-w-2xl mx-auto">
            {timeline.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setActiveStage(idx)}
                className={`relative group cursor-pointer p-4 rounded-xl transition-all ${
                  activeStage === idx ? 'bg-white/5 border border-[#d4af37]/40' : 'hover:bg-white/5'
                }`}
              >
                <div
                  className={`absolute -left-[31px] sm:-left-[47px] top-4 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    activeStage === idx
                      ? 'bg-[#d4af37] text-black ring-4 ring-[#d4af37]/40 scale-125'
                      : 'bg-slate-700 text-white group-hover:bg-[#d4af37]'
                  }`}
                />
                <span className="font-mono text-xs font-bold text-[#d4af37] tracking-wider block">
                  {item.year} · {item.stationName}
                </span>
                <h4 className="font-serif text-xl text-white font-medium mt-0.5">{item.title}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="glass-card p-10 sm:p-14 rounded-3xl border border-gold-subtle text-center space-y-6">
          <h2 className="font-serif text-3xl sm:text-5xl text-white font-light">
            Taste the Woodfire Tradition
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto">
            Join us for an evening of warmth, live smoke infusions, and unhurried conversation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('/reservation')}
              className="px-8 py-4 bg-[#d4af37] hover:bg-[#e5be49] text-[#0b0c10] text-xs font-bold uppercase tracking-widest rounded font-brand"
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
        </div>
      </div>
    </div>
  );
};
