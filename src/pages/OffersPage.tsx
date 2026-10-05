import React from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Tag, Copy, Check, ArrowRight, Sparkles } from 'lucide-react';
import { Celebration3D } from '../components/3d/Celebration3D';

export const OffersPage: React.FC = () => {
  const { navigate, showToast } = useApp();
  const offers = api.getOffers();

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    showToast('Privilege Code Copied', `Code ${code} copied to clipboard! Paste in your Dining Bag.`, 'success');
  };

  return (
    <div className="min-h-screen bg-[#08090b] text-[#e2e8f0] pt-28 pb-24 px-6">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
            Seasonal Privileges & Tastings
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-light">
            Exclusive Dining Privileges
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Special invitations, early-evening fireside discounts, and complimentary reserve wine pairings.
          </p>
        </div>

        {/* 3D Celebration Privilege Banner */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-gold-subtle grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              The Sommelier’s Gift
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-light">
              Elevated Dining Vouchers
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every code below is honored tableside and across all online orders. Copy any voucher code to redeem
              complimentary sommelier pairings or percentage savings on orders over $50.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/menu')}
                className="px-6 py-2.5 bg-[#d4af37] hover:bg-[#e5be49] text-[#0b0c10] text-xs font-bold uppercase tracking-wider rounded font-brand shadow-lg"
              >
                Apply Voucher on Menu
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 h-64 sm:h-72 rounded-2xl overflow-hidden glass-dark border border-white/10 relative">
            <Celebration3D />
            <div className="absolute bottom-3 left-4 text-[10px] text-[#d4af37] font-mono uppercase tracking-wider bg-black/60 px-2.5 py-1 rounded backdrop-blur">
              Celebratory Golden Cloche Unveil
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="glass-card rounded-2xl overflow-hidden border border-gold-subtle flex flex-col justify-between group hover:-translate-y-1.5 transition-all"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={offer.bannerImage}
                  alt={offer.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1016] via-transparent to-black/30" />
                <div className="absolute top-3 right-3 bg-[#d4af37] text-[#0b0c10] text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase">
                  {offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `$${offer.discountValue} OFF`}
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-2xl text-white font-medium">{offer.title}</h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{offer.description}</p>
                  <span className="text-[11px] text-slate-400 block mt-3">
                    Valid on orders above ${offer.minOrderValue} · Expires {offer.expiryDate}
                  </span>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                  <div className="font-mono font-bold text-sm text-[#d4af37] bg-white/5 border border-[#d4af37]/30 px-3 py-1.5 rounded">
                    {offer.code}
                  </div>
                  <button
                    onClick={() => handleCopy(offer.code)}
                    className="p-2 glass-dark hover:text-white text-slate-300 rounded border border-white/10 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                    title="Copy Privilege Code"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-8">
          <button
            onClick={() => navigate('/menu')}
            className="px-8 py-4 bg-[#d4af37] hover:bg-[#e5be49] text-[#0b0c10] text-xs font-bold uppercase tracking-widest rounded font-brand"
          >
            Apply Code on Menu
          </button>
        </div>
      </div>
    </div>
  );
};
