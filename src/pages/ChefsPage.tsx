import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Chef } from '../types';
import { Award, Flame, Utensils, Star, ArrowRight } from 'lucide-react';
import { ChefSection3D } from '../components/3d/ChefSection3D';

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
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
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

        {/* 3D Master Chef Interactive Spotlight */}
        <div className="rounded-3xl overflow-hidden glass-card border border-gold-subtle p-2">
          <ChefSection3D />
        </div>

        {/* Chefs Grid */}
        <div className="space-y-16">
          {chefs.map((chef, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={chef.id}
                className={`glass-card rounded-3xl p-6 sm:p-10 border border-gold-subtle grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${
                  !isEven ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Photo Plinth */}
                <div className={`lg:col-span-5 ${!isEven ? 'lg:order-2' : ''}`}>
                  <div className="h-96 sm:h-[420px] rounded-2xl overflow-hidden relative group">
                    <img
                      src={chef.photo}
                      alt={chef.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-[11px] uppercase tracking-wider text-[#d4af37] font-semibold block">
                        Experience
                      </span>
                      <span className="text-sm font-semibold text-white">{chef.experience}</span>
                    </div>
                  </div>
                </div>

                {/* Narrative Details */}
                <div className={`lg:col-span-7 space-y-6 ${!isEven ? 'lg:order-1' : ''}`}>
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block">
                      {chef.designation}
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium mt-1">
                      {chef.name}
                    </h2>
                    <span className="text-xs text-slate-400 font-medium block mt-1">
                      Specialization: <strong className="text-slate-200">{chef.specialization}</strong>
                    </span>
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed">{chef.biography}</p>

                  {/* Accolades & Awards */}
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>Accolades & Recognition</span>
                    </h4>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {chef.awards.map((award, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                          <span>{award}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Signature Dishes */}
                  <div className="pt-2">
                    <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
                      <Utensils className="w-3.5 h-3.5 text-[#e65100]" />
                      <span>Hallmark Signature Creations</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {chef.signatureDishes.map((dish, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-[#d4af37]"
                        >
                          {dish}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => navigate('/reservation')}
                      className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#d4af37] hover:underline font-semibold"
                    >
                      <span>Reserve Table for Chef's Service</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
