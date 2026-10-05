import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Chef } from '../types';
import { Award, Flame, Utensils, Star, ArrowRight, Sparkles } from 'lucide-react';
import { FoodTilt, ShadowLayer } from '../components/food3d';

export const ChefsPage: React.FC = () => {
  const { navigate } = useApp();
  const [chefs, setChefs] = useState<Chef[]>([]);

  useEffect(() => {
    setChefs(api.getChefs());
  }, []);

  return (
    <div className="min-h-screen bg-[#08090b] text-[#e2e8f0] pt-28 pb-24 px-6">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold font-mono">
            Masters of Hearth & Heritage
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-light">
            Our Culinary Brigade
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            The Ember Table is guided by five visionary chefs blending French molecular patisserie,
            Awadhi clay tandoors, Italian sourdough traditions, and wood-smoked mixology.
          </p>
        </div>

        {/* Chefs 3D Cards Grid */}
        <div className="space-y-16">
          {chefs.map((chef, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <FoodTilt key={chef.id} maxRotateX={3} maxRotateY={3} glare={true} scale={1.01}>
                <div
                  className={`glass-card rounded-3xl p-6 sm:p-10 border border-gold-subtle grid grid-cols-1 lg:grid-cols-12 gap-10 items-center transition-all ${
                    !isEven ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Photo Plinth with 3D Depth */}
                  <div className={`lg:col-span-5 ${!isEven ? 'lg:order-2' : ''} relative`}>
                    <div className="h-96 sm:h-[420px] rounded-2xl overflow-hidden relative group shadow-2xl">
                      <img
                        src={chef.photo}
                        alt={chef.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="text-[11px] uppercase tracking-wider text-[#d4af37] font-semibold block font-mono">
                          Tenure & Acclaim
                        </span>
                        <span className="text-sm font-semibold text-white">{chef.experience}</span>
                      </div>
                    </div>
                  </div>

                  {/* Chef Narrative & Credentials */}
                  <div className={`lg:col-span-7 space-y-5 ${!isEven ? 'lg:order-1' : ''}`}>
                    <div>
                      <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold font-mono block">
                        {chef.designation}
                      </span>
                      <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium mt-1">
                        {chef.name}
                      </h2>
                    </div>

                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                      {chef.biography}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="glass-dark p-4 rounded-xl border border-white/5 space-y-1">
                        <span className="text-[11px] text-slate-400 uppercase tracking-wider block flex items-center gap-1.5 font-mono">
                          <Flame className="w-3.5 h-3.5 text-[#ff7043]" />
                          Signature Discipline
                        </span>
                        <span className="text-sm font-semibold text-white block">
                          {chef.specialization}
                        </span>
                      </div>

                      <div className="glass-dark p-4 rounded-xl border border-white/5 space-y-1">
                        <span className="text-[11px] text-slate-400 uppercase tracking-wider block flex items-center gap-1.5 font-mono">
                          <Award className="w-3.5 h-3.5 text-[#d4af37]" />
                          Acclaim & Awards
                        </span>
                        <span className="text-sm font-semibold text-gold-gradient block truncate">
                          {chef.awards.join(' · ')}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-4">
                      <button
                        onClick={() => navigate('/menu')}
                        className="px-6 py-3 bg-[#d4af37] hover:bg-[#e5be49] text-[#0b0c10] text-xs font-bold uppercase tracking-wider rounded font-brand transition-all flex items-center gap-2 shadow"
                      >
                        <Utensils className="w-4 h-4" />
                        <span>Taste Chef's Selections</span>
                      </button>
                    </div>
                  </div>
                </div>
              </FoodTilt>
            );
          })}
        </div>
      </div>
    </div>
  );
};
