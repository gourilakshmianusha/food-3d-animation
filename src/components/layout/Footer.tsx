import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../brand/Logo';
import { MapPin, Phone, Mail, Clock, ArrowRight, Instagram, Facebook, Twitter, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate, siteSettings, showToast } = useApp();
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      showToast('Invalid Email', 'Please enter a valid email address.', 'error');
      return;
    }
    setSubscribed(true);
    showToast('Subscribed to Culinary Gazette', 'You will receive our seasonal reserve tasting invitations.', 'success');
    setEmailInput('');
  };

  return (
    <footer className="bg-[#060709] border-t border-white/10 text-slate-300 pt-20 pb-12 relative overflow-hidden">
      {/* Subtle background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-[#d4af37]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-white/5">
          {/* Col 1 & 2: Brand & Story */}
          <div className="lg:col-span-2 space-y-6">
            <div onClick={() => navigate('/')} className="cursor-pointer inline-block">
              <Logo size="md" showSubtitle={true} />
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              An open-hearth culinary sanctuary devoted to live woodfire embers, artisanal fermentation,
              and multi-sensory hospitality. Where ancient fire techniques meet modern culinary artistry.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-3">
                Join the Fireside Registry
              </span>
              <form onSubmit={handleSubscribe} className="flex max-w-md gap-2">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email address..."
                  className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37] transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#d4af37] hover:bg-[#e5be49] text-[#0b0c10] font-semibold text-xs tracking-wider uppercase rounded transition-all flex items-center gap-1.5 shrink-0"
                >
                  {subscribed ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  <span>{subscribed ? 'Joined' : 'Join'}</span>
                </button>
              </form>
              <span className="text-[11px] text-slate-500 mt-2 block">
                Exclusive cellar releases and seasonal tasting invitations only. No spam.
              </span>
            </div>
          </div>

          {/* Col 3: Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-slate-200 font-semibold">
              The Experience
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => navigate('/menu')} className="hover:text-[#d4af37] transition-colors">
                  Seasonal Menu
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-[#d4af37] transition-colors">
                  Hearth Philosophy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/chefs')} className="hover:text-[#d4af37] transition-colors">
                  Culinary Brigade
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/private-dining')} className="hover:text-[#d4af37] transition-colors">
                  Private Ember Cellar
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/catering')} className="hover:text-[#d4af37] transition-colors">
                  Estate Catering
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/events')} className="hover:text-[#d4af37] transition-colors">
                  Curated Events
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Dining & Services */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-slate-200 font-semibold">
              Guest Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => navigate('/reservation')} className="hover:text-[#d4af37] transition-colors">
                  Reserve a Table
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/cart')} className="hover:text-[#d4af37] transition-colors">
                  Dining Bag & Checkout
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/order-tracking')} className="hover:text-[#d4af37] transition-colors">
                  Live Order Tracker
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/offers')} className="hover:text-[#d4af37] transition-colors">
                  Privileges & Offers
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/blog')} className="hover:text-[#d4af37] transition-colors">
                  Culinary Journal
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/gallery')} className="hover:text-[#d4af37] transition-colors">
                  Visual Gallery
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact & Location */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-slate-200 font-semibold">
              Concierge
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>{siteSettings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#d4af37] shrink-0" />
                <a href={`tel:${siteSettings.phone}`} className="hover:text-white transition-colors">
                  {siteSettings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#d4af37] shrink-0" />
                <a href={`mailto:${siteSettings.email}`} className="hover:text-white transition-colors">
                  {siteSettings.email}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>{siteSettings.openingHours}</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={siteSettings.socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-[#d4af37] hover:border-[#d4af37]/30 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={siteSettings.socialLinks.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-[#d4af37] hover:border-[#d4af37]/30 transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={siteSettings.socialLinks.twitter}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-[#d4af37] hover:border-[#d4af37]/30 transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-3">
            <span>© {new Date().getFullYear()} The Ember Table Hospitality Group. All rights reserved.</span>
            <span>·</span>
            <button
              onClick={() => navigate('/admin/login')}
              className="hover:text-slate-300 transition-colors"
            >
              Executive Portal
            </button>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[#d4af37]/70 font-serif italic text-sm">
              Food · People · Good Times
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
