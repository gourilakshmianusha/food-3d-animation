import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Calendar, Users, DollarSign, ArrowRight, Sparkles } from 'lucide-react';
import { FoodTilt, PlateComposition } from '../components/food3d';

export const EventsPage: React.FC = () => {
  const { navigate } = useApp();
  const events = api.getEvents();
  const [selectedEventType, setSelectedEventType] = useState<'Wedding' | 'Corporate' | 'Birthday' | 'Party'>('Wedding');

  const eventPreviewImages = {
    Wedding: {
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      foodImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
      tag: 'Grand Banquet Table Setting',
      preset: 'wagyu-hearth' as const,
    },
    Corporate: {
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
      foodImage: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281724?auto=format&fit=crop&w=600&q=80',
      tag: 'Executive Cellar Summit Table',
      preset: 'truffle-pasta' as const,
    },
    Birthday: {
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
      foodImage: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
      tag: 'Celebratory Gold Tier Cake & Dessert',
      preset: 'artisan-dessert' as const,
    },
    Party: {
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
      foodImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
      tag: 'Solstice Hearth Cocktail & Bites',
      preset: 'woodfire-pizza' as const,
    },
  };

  const currentPreview = eventPreviewImages[selectedEventType];

  return (
    <div className="min-h-screen bg-[#08090b] text-[#e2e8f0] pt-28 pb-24 px-6">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold font-mono">
            Gatherings Around The Fire
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-light">
            Curated Events & Milestones
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            From intimate solstice wine tastings to full restaurant buyouts for weddings and executive summits.
          </p>
        </div>

        {/* 3D Event Atmosphere Preview Composition */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-gold-subtle grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              3D Event Setting Composition
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-light">
              Bespoke Banqueting & Décor
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every occasion features custom tableware arrangements, ambient hearthside lighting, and dedicated
              sommelier pairings tailored to your gathering.
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              {(['Wedding', 'Corporate', 'Birthday', 'Party'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedEventType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                    selectedEventType === type
                      ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20 font-bold'
                      : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <button
              onClick={() => navigate('/contact')}
              className="mt-4 px-6 py-2.5 bg-[#d4af37] text-black text-xs font-bold uppercase tracking-wider rounded font-brand hover:bg-[#e5be49] transition-all"
            >
              Inquire About {selectedEventType} Buyout
            </button>
          </div>

          <div className="lg:col-span-7 flex items-center justify-center">
            <PlateComposition
              foodImage={currentPreview.foodImage}
              alt={currentPreview.tag}
              preset={currentPreview.preset}
              plateType="copper"
              size="md"
              caption={`${selectedEventType} · ${currentPreview.tag}`}
            />
          </div>
        </div>

        {/* Events Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((ev) => (
            <FoodTilt key={ev.id} maxRotateX={3} maxRotateY={3} glare={true}>
              <div className="glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between h-full group hover:border-[#d4af37]/40 transition-colors">
                <div className="h-56 overflow-hidden relative">
                  <img
                    src={ev.image}
                    alt={ev.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur px-2.5 py-1 rounded text-[11px] text-[#d4af37] font-semibold font-mono">
                    {ev.category}
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-2xl text-white font-medium">{ev.title}</h3>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">{ev.description}</p>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-white/5 text-xs text-slate-400">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>{ev.date}</span>
                      </span>
                      <span className="flex items-center gap-1.5 font-mono">
                        <Users className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>{ev.capacity}</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-base font-serif font-bold text-gold-gradient">
                        {ev.price}
                      </span>
                      <button
                        onClick={() => navigate('/contact')}
                        className="text-xs font-semibold text-[#d4af37] hover:underline flex items-center gap-1 font-mono uppercase"
                      >
                        <span>Reserve</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
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
