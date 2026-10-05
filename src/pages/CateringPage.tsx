import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Users, CheckCircle2, Flame, ArrowRight, Utensils, Sparkles, Check } from 'lucide-react';
import { PlateComposition, FoodTilt } from '../components/food3d';

export const CateringPage: React.FC = () => {
  const { navigate, showToast } = useApp();
  const packages = api.getCateringPackages();
  const [selectedStage, setSelectedStage] = useState(2);

  const [inquiryData, setInquiryData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '30',
    date: '',
    packageId: packages[0]?.id || '',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryData.name || !inquiryData.email) {
      alert('Please fill out all contact fields.');
      return;
    }
    setSubmitted(true);
    showToast('Catering Inquiry Dispatched', 'Our catering director will curate your proposal within 24 hours.', 'success');
  };

  const tierPresentations = [
    {
      stage: 1,
      title: 'Tier 1: Woodfire Hearth Roast',
      desc: 'Whole slow-roasted dry-aged prime cuts over Mendocino white oak coals with charred seasonal vegetables.',
      foodImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      preset: 'wagyu-hearth' as const,
    },
    {
      stage: 2,
      title: 'Tier 2: Dual Course & Truffle Cloche',
      desc: 'Plated Wagyu ribeye accompanied by tableside French Périgord black truffle pasta and woodfire sourdough.',
      foodImage: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281724?auto=format&fit=crop&w=800&q=80',
      preset: 'truffle-pasta' as const,
    },
    {
      stage: 3,
      title: 'Tier 3: Grand Hearth Estate Banquet',
      desc: 'Mobile charcoal pits, Neapolitan sourdough pizza station, whole Chilean sea bass, and sommelier reserve wine wall.',
      foodImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      preset: 'woodfire-pizza' as const,
    },
    {
      stage: 4,
      title: 'Tier 4: Royal Sommelier Feast',
      desc: '7-course bespoke tasting menu, 24k gold Valrhona chocolate sphere reveals, caviar service, and vintage champagnes.',
      foodImage: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
      preset: 'artisan-dessert' as const,
    },
  ];

  const currentTier = tierPresentations[selectedStage - 1] || tierPresentations[1];

  return (
    <div className="min-h-screen bg-[#08090b] text-[#e2e8f0] pt-28 pb-24 px-6">
      <div className="max-w-6xl mx-auto space-y-20">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold font-mono">
            The Mobile Hearth
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-light">
            Luxury Estate Catering
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            We transport our custom hand-forged charcoal grills, seasoned white oak timber, and full
            sommelier brigade to your vineyard, estate, or private retreat.
          </p>
        </div>

        {/* 3D Catering Banquet Buffet Composition */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-gold-subtle grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              3D Live Banquet Course Tier
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-light">
              Interactive Table Presentation
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Explore how our mobile hearth banquet expands with each tier—from hardwood embers and charred roasts
              to ceremonial cloche service and pastry stations.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {tierPresentations.map((tier) => (
                <button
                  key={tier.stage}
                  onClick={() => setSelectedStage(tier.stage)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedStage === tier.stage
                      ? 'bg-[#d4af37] text-black font-bold shadow-lg shadow-[#d4af37]/20'
                      : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
                  }`}
                >
                  Tier {tier.stage}
                </button>
              ))}
            </div>

            <p className="text-xs text-slate-300 italic pt-2">
              "{currentTier.desc}"
            </p>
          </div>

          <div className="lg:col-span-7 flex items-center justify-center">
            <PlateComposition
              foodImage={currentTier.foodImage}
              alt={currentTier.title}
              preset={currentTier.preset}
              plateType="copper"
              size="md"
              caption={currentTier.title}
            />
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <FoodTilt key={pkg.id} maxRotateX={3} maxRotateY={3} glare={true}>
              <div className="glass-card rounded-2xl overflow-hidden border border-gold-subtle flex flex-col justify-between h-full group hover:shadow-2xl transition-all">
                <div className="h-52 overflow-hidden relative">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-[#d4af37] font-semibold block">
                        Estate Tier
                      </span>
                      <h4 className="font-serif text-lg text-white font-medium">{pkg.name}</h4>
                    </div>
                    <span className="font-mono text-base font-bold text-white">${pkg.pricePerPerson}/guest</span>
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-300 leading-relaxed">{pkg.description}</p>

                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                      Package Includes:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {(pkg.itemsIncluded || []).map((inc: string, i: number) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <button
                      onClick={() => {
                        setInquiryData({ ...inquiryData, packageId: pkg.id });
                        const formEl = document.getElementById('catering-inquiry-form');
                        formEl?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full py-2.5 bg-white/5 hover:bg-[#d4af37] hover:text-black border border-white/10 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors font-mono"
                    >
                      Select This Package
                    </button>
                  </div>
                </div>
              </div>
            </FoodTilt>
          ))}
        </div>

        {/* Inquiry Form */}
        <div id="catering-inquiry-form" className="glass-card p-8 sm:p-12 rounded-3xl border border-gold-subtle max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold font-mono">
              Inquire With Our Director
            </span>
            <h3 className="font-serif text-3xl text-white font-light">Custom Catering Proposal</h3>
          </div>

          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#d4af37] mx-auto" />
              <h4 className="font-serif text-2xl text-white">Proposal Dispatched</h4>
              <p className="text-xs text-slate-400">Our catering director will reply within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={inquiryData.name}
                    onChange={(e) => setInquiryData({ ...inquiryData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={inquiryData.email}
                    onChange={(e) => setInquiryData({ ...inquiryData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Phone</label>
                  <input
                    type="tel"
                    value={inquiryData.phone}
                    onChange={(e) => setInquiryData({ ...inquiryData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Guests</label>
                  <input
                    type="number"
                    value={inquiryData.guests}
                    onChange={(e) => setInquiryData({ ...inquiryData, guests: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Date</label>
                  <input
                    type="date"
                    value={inquiryData.date}
                    onChange={(e) => setInquiryData({ ...inquiryData, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Event Notes & Venue Location</label>
                <textarea
                  rows={3}
                  value={inquiryData.notes}
                  onChange={(e) => setInquiryData({ ...inquiryData, notes: e.target.value })}
                  placeholder="e.g. Sonoma winery estate, 40 guests, outdoor woodfire preferred..."
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#d4af37] hover:bg-[#e5be49] text-black text-xs font-bold uppercase tracking-widest rounded font-brand transition-all shadow-lg"
              >
                Submit Catering Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
