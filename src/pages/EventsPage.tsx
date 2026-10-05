import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Calendar, Users, DollarSign, ArrowRight, Sparkles } from 'lucide-react';
import { EventScene } from '../components/3d/EventScene';

export const EventsPage: React.FC = () => {
  const { navigate } = useApp();
  const events = api.getEvents();
  const [selectedEventType, setSelectedEventType] = useState<'Wedding' | 'Corporate' | 'Birthday' | 'Party'>('Wedding');

  const eventTypes: ('Wedding' | 'Corporate' | 'Birthday' | 'Party')[] = [
    'Wedding',
    'Corporate',
    'Birthday',
    'Party',
  ];

  return (
    <div className="min-h-screen bg-[#08090b] text-[#e2e8f0] pt-28 pb-24 px-6">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
            Gatherings Around The Fire
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-light">
            Curated Events & Milestones
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            From intimate solstice wine tastings to full restaurant buyouts for weddings and executive summits.
          </p>
        </div>

        {/* 3D Event Atmosphere Preview */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-gold-subtle grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              3D Event Setting Preview
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-light">
              Bespoke Banqueting & Décor
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every occasion features custom tableware arrangements, ambient hearthside lighting, and dedicated
              sommelier pairings tailored to your gathering.
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              {eventTypes.map((type) => (
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

          <div className="lg:col-span-7 h-72 sm:h-80 rounded-2xl overflow-hidden glass-dark border border-white/10 relative">
            <EventScene eventType={selectedEventType} />
            <div className="absolute bottom-3 left-4 text-[10px] text-[#d4af37] font-mono uppercase tracking-wider bg-black/60 px-2.5 py-1 rounded backdrop-blur">
              Visualizing {selectedEventType} Ambience
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between group hover:-translate-y-1 transition-all"
            >
              <div className="h-56 overflow-hidden relative">
                <img
                  src={ev.image}
                  alt={ev.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur px-2.5 py-1 rounded text-[11px] text-[#d4af37] font-semibold">
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
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>{ev.date}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>{ev.capacity}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-serif font-bold text-gold-gradient">
                      {ev.price}
                    </span>
                    <button
                      onClick={() => navigate('/contact')}
                      className="px-4 py-2 bg-[#d4af37] hover:bg-[#e5be49] text-[#0b0c10] text-xs font-bold uppercase rounded font-brand"
                    >
                      Inquire Booking
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
