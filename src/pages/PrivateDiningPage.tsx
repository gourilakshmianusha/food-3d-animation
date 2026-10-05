import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TableScene } from '../components/3d/TableScene';
import { Wine, Users, Calendar, Sparkles, Shield, ArrowRight } from 'lucide-react';

export const PrivateDiningPage: React.FC = () => {
  const { navigate } = useApp();
  const [activeSuiteIdx, setActiveSuiteIdx] = useState(0);

  const suites = [
    {
      name: 'The Obsidian Cellar Vault',
      capacity: 'Up to 14 Guests',
      guestCovers: 8,
      image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1000&q=80',
      description:
        'Enclosed subterranean sanctuary carved into historic stone foundation walls, surrounded by rare vintage verticals. Dedicated lead sommelier and live acoustic privacy.',
      minimum: '$3,200 Food & Beverage Minimum',
    },
    {
      name: 'The Glass Hearth Mezzanine',
      capacity: 'Up to 28 Guests',
      guestCovers: 12,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
      description:
        'Suspended above the main dining room with panoramic sightlines directly into the woodfire kitchen line. Includes private cocktail bar station and custom printed menus.',
      minimum: '$6,000 Food & Beverage Minimum',
    },
    {
      name: 'The Grand Hearth Courtyard',
      capacity: 'Up to 75 Guests',
      guestCovers: 6,
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=80',
      description:
        'Full open-air terrace framed by olive trees and glowing stone fire pits. Ideal for milestone celebrations, rehearsal dinners, and executive galas.',
      minimum: 'Custom Buyout Proposal',
    },
  ];

  return (
    <div className="min-h-screen bg-[#08090b] text-[#e2e8f0] pt-28 pb-24 px-6">
      <div className="max-w-6xl mx-auto space-y-24">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
            Unrivaled Intimacy & Gastronomy
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-white font-light leading-tight">
            The Private Ember Suites
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Reserved for celebrations demanding exceptional discretion, bespoke 7-course tasting menus,
            and sommelier library pairings.
          </p>
        </div>

        {/* 3D Private Chamber Setting Visualizer */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-gold-subtle grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              3D Private Chamber Setting
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-light">
              Atmospheric Table Setting
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every private dining booking configures custom heirloom linen, hand-crafted candle holders,
              and dedicated sommelier glassware. Toggle the chamber below to explore.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {suites.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSuiteIdx(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeSuiteIdx === idx
                      ? 'bg-[#d4af37] text-black font-bold shadow-lg shadow-[#d4af37]/20'
                      : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
                  }`}
                >
                  {s.name.split(' ')[1]} ({s.guestCovers} Covers)
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 h-72 sm:h-80 rounded-2xl overflow-hidden glass-dark border border-white/10 relative">
            <TableScene guestCount={suites[activeSuiteIdx].guestCovers} />
            <div className="absolute bottom-3 left-4 text-[10px] text-[#d4af37] font-mono uppercase tracking-wider bg-black/60 px-2.5 py-1 rounded backdrop-blur">
              {suites[activeSuiteIdx].name} · {suites[activeSuiteIdx].guestCovers} Place Covers
            </div>
          </div>
        </div>

        {/* Suites Showcase */}
        <div className="space-y-16">
          {suites.map((suite, idx) => (
            <div
              key={idx}
              className="glass-card rounded-3xl overflow-hidden border border-gold-subtle grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-7 h-80 sm:h-[420px] overflow-hidden relative">
                <img
                  src={suite.image}
                  alt={suite.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur px-3 py-1 rounded text-xs text-[#d4af37] font-semibold">
                  {suite.capacity}
                </div>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-10 space-y-5">
                <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                  Private Chamber
                </span>
                <h2 className="font-serif text-3xl text-white font-medium">{suite.name}</h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {suite.description}
                </p>
                <div className="pt-2 text-xs font-mono text-gold-gradient font-bold">
                  {suite.minimum}
                </div>

                <div className="pt-3">
                  <button
                    onClick={() => navigate('/contact')}
                    className="w-full sm:w-auto px-6 py-3.5 bg-[#d4af37] hover:bg-[#e5be49] text-[#0b0c10] text-xs font-bold uppercase tracking-wider rounded font-brand shadow transition-all"
                  >
                    Inquire Availability
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bespoke Tasting Menu Teaser */}
        <div className="glass-card p-10 sm:p-14 rounded-3xl border border-gold-subtle text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#d4af37]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Private Sommelier Consultation</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl text-white">
            Curate a One-of-a-Kind Culinary Narrative
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Our culinary director works directly with you to craft custom wine pairings and bespoke
            dishes honoring personal milestones and dietary preferences.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/contact')}
              className="px-8 py-4 bg-[#d4af37] hover:bg-[#e5be49] text-[#0b0c10] text-xs font-bold uppercase tracking-widest rounded font-brand"
            >
              Contact Private Events Concierge
            </button>
            <button
              onClick={() => navigate('/reservation')}
              className="px-8 py-4 glass-dark text-white hover:bg-white/10 text-xs font-semibold uppercase tracking-widest rounded border border-white/10"
            >
              Book Standard Table
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
