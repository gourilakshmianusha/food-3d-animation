import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Wine, Users, Calendar, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { FoodTilt, PlateComposition } from '../components/food3d';

export const PrivateDiningPage: React.FC = () => {
  const { navigate } = useApp();
  const [activeSuiteIdx, setActiveSuiteIdx] = useState(0);

  const suites = [
    {
      name: 'The Obsidian Cellar Vault',
      capacity: 'Up to 14 Guests',
      guestCovers: 8,
      image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1000&q=80',
      foodImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      description:
        'Enclosed subterranean sanctuary carved into historic stone foundation walls, surrounded by rare vintage verticals. Dedicated lead sommelier and live acoustic privacy.',
      minimum: '$3,200 Food & Beverage Minimum',
      preset: 'wagyu-hearth' as const,
    },
    {
      name: 'The Glass Hearth Mezzanine',
      capacity: 'Up to 28 Guests',
      guestCovers: 12,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
      foodImage: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281724?auto=format&fit=crop&w=800&q=80',
      description:
        'Suspended above the main dining room with panoramic sightlines directly into the woodfire kitchen line. Includes private cocktail bar station and custom printed menus.',
      minimum: '$6,000 Food & Beverage Minimum',
      preset: 'truffle-pasta' as const,
    },
    {
      name: 'The Grand Hearth Courtyard',
      capacity: 'Up to 75 Guests',
      guestCovers: 6,
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=80',
      foodImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      description:
        'Full open-air terrace framed by olive trees and glowing stone fire pits. Ideal for milestone celebrations, rehearsal dinners, and executive galas.',
      minimum: 'Custom Buyout Proposal',
      preset: 'woodfire-pizza' as const,
    },
  ];

  const currentSuite = suites[activeSuiteIdx];

  return (
    <div className="min-h-screen bg-[#08090b] text-[#e2e8f0] pt-28 pb-24 px-6">
      <div className="max-w-6xl mx-auto space-y-24">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold font-mono">
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

        {/* 3D Private Chamber Setting Composition */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-gold-subtle grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold flex items-center gap-1.5 font-mono">
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

            <div className="pt-2">
              <span className="text-xs font-mono text-gold-gradient font-bold block">
                {currentSuite.minimum}
              </span>
              <button
                onClick={() => navigate('/contact')}
                className="mt-4 px-6 py-2.5 bg-[#d4af37] text-black text-xs font-bold uppercase tracking-wider rounded font-brand hover:bg-[#e5be49] transition-all"
              >
                Inquire For {currentSuite.name}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 flex items-center justify-center">
            <PlateComposition
              foodImage={currentSuite.foodImage}
              alt={currentSuite.name}
              preset={currentSuite.preset}
              plateType="copper"
              size="md"
              caption={`${currentSuite.name} · ${currentSuite.capacity}`}
            />
          </div>
        </div>

        {/* Suites Showcase */}
        <div className="space-y-16">
          {suites.map((suite, idx) => (
            <FoodTilt key={idx} maxRotateX={3} maxRotateY={3} glare={true}>
              <div className="glass-card rounded-3xl overflow-hidden border border-gold-subtle grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full">
                <div className="lg:col-span-7 h-80 sm:h-[420px] overflow-hidden relative">
                  <img
                    src={suite.image}
                    alt={suite.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur px-3 py-1 rounded text-xs text-[#d4af37] font-semibold font-mono">
                    {suite.capacity}
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 sm:p-10 space-y-5">
                  <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold font-mono">
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
                      className="px-6 py-3 bg-[#d4af37] hover:bg-[#e5be49] text-[#0b0c10] text-xs font-bold uppercase tracking-wider rounded font-brand shadow transition-all flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Inquire Chamber Reservation</span>
                    </button>
                  </div>
                </div>
              </div>
            </FoodTilt>
          ))}
        </div>
      </div>
    </div>
  );
};
