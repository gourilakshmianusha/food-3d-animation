import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Users, CheckCircle2, Flame, ArrowRight, Utensils, Sparkles } from 'lucide-react';
import { CateringScene } from '../components/3d/CateringScene';

export const CateringPage: React.FC = () => {
  const { navigate, showToast } = useApp();
  const packages = api.getCateringPackages();
  const [selectedStage, setSelectedStage] = useState(3);

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

  return (
    <div className="min-h-screen bg-[#08090b] text-[#e2e8f0] pt-28 pb-24 px-6">
      <div className="max-w-6xl mx-auto space-y-20">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
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

        {/* 3D Banquet Buffet Stage Interactive Showcase */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-gold-subtle grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold flex items-center gap-1.5">
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
              {[
                { label: 'Tier 1: Hearth Roast', stage: 1 },
                { label: 'Tier 2: Dual Main + Cloche', stage: 2 },
                { label: 'Tier 3: Grand Hearth Banquet', stage: 3 },
                { label: 'Tier 4: Royal Sommelier Feast', stage: 4 },
              ].map((tier) => (
                <button
                  key={tier.stage}
                  onClick={() => setSelectedStage(tier.stage)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedStage === tier.stage
                      ? 'bg-[#d4af37] text-black font-bold shadow-lg shadow-[#d4af37]/20'
                      : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 h-72 sm:h-80 rounded-2xl overflow-hidden glass-dark border border-white/10 relative">
            <CateringScene stage={selectedStage} />
            <div className="absolute bottom-3 left-4 text-[10px] text-[#d4af37] font-mono uppercase tracking-wider bg-black/60 px-2.5 py-1 rounded backdrop-blur">
              Banquet Setting · Course Tier {selectedStage}
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="glass-card rounded-2xl overflow-hidden border border-gold-subtle flex flex-col justify-between group hover:-translate-y-1.5 transition-all"
            >
              <div className="h-52 overflow-hidden relative">
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3 bg-[#d4af37] text-[#0b0c10] text-xs font-mono font-bold px-2.5 py-1 rounded">
                  ${pkg.pricePerPerson} / Person
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-2xl text-white font-medium">{pkg.name}</h3>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    Minimum {pkg.minGuests} Guests
                  </span>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{pkg.description}</p>
                </div>

                <div className="space-y-2 pt-4 border-t border-white/5">
                  <span className="text-[11px] uppercase tracking-wider text-[#d4af37] font-semibold block">
                    Curated Inclusions:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {pkg.itemsIncluded.map((item, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Inquiry Form Section */}
        <div className="glass-card p-8 sm:p-12 rounded-3xl border border-gold-subtle max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-serif text-3xl text-white font-medium">
              Inquire About Estate Catering
            </h2>
            <p className="text-xs text-slate-400">
              Custom proposals with wine pairings and mobile kitchen layouts.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#d4af37] mx-auto" />
              <h3 className="font-serif text-2xl text-white">Inquiry Received</h3>
              <p className="text-xs text-slate-300">
                Our estate events director will contact you directly to formulate your custom menu.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={inquiryData.name}
                    onChange={(e) => setInquiryData({ ...inquiryData, name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={inquiryData.email}
                    onChange={(e) => setInquiryData({ ...inquiryData, email: e.target.value })}
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
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
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Estimated Guests</label>
                  <input
                    type="number"
                    value={inquiryData.guests}
                    onChange={(e) => setInquiryData({ ...inquiryData, guests: e.target.value })}
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Target Date</label>
                  <input
                    type="date"
                    value={inquiryData.date}
                    onChange={(e) => setInquiryData({ ...inquiryData, date: e.target.value })}
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Event Venue & Notes</label>
                <textarea
                  rows={3}
                  value={inquiryData.notes}
                  onChange={(e) => setInquiryData({ ...inquiryData, notes: e.target.value })}
                  placeholder="e.g. Napa Valley private vineyard estate, outdoor woodfire reception..."
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#d4af37] hover:bg-[#e5be49] text-[#0b0c10] text-xs font-bold uppercase tracking-widest rounded font-brand"
              >
                Submit Catering Request
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
