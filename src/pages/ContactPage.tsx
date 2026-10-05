import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import { FoodTilt } from '../components/food3d';

export const ContactPage: React.FC = () => {
  const { siteSettings, showToast } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please complete all required fields.');
      return;
    }

    api.submitContactMessage({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject || 'General Inquiry',
      message: formData.message,
    });

    setIsSubmitted(true);
    showToast('Inquiry Transmitted', 'Our maître d’ will respond within 24 hours.', 'success');
  };

  return (
    <div className="min-h-screen bg-[#08090b] text-[#e2e8f0] pt-28 pb-24 px-6">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold font-mono">
            At Your Service
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-light">
            Contact & Concierge
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Reach our dining room stewards for custom event inquiries, cellar buyouts, or press requests.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7 glass-card p-6 sm:p-10 rounded-2xl border border-gold-subtle space-y-6">
            <h2 className="font-serif text-2xl text-white font-medium">Send a Message to the Line</h2>

            {isSubmitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center mx-auto text-[#d4af37]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl text-white">Inquiry Received</h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Thank you, <strong className="text-white">{formData.name}</strong>. Our lead concierge will
                  review your dispatch and respond within one solar cycle.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 px-6 py-2 glass-dark text-slate-300 hover:text-white text-xs rounded border border-white/10"
                >
                  Send Another Dispatch
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Lady Katherine Vance"
                      className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="katherine@domain.com"
                      className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (415) 000-0000"
                      className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Private Dining Inquiry"
                      className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your inquiry or occasion..."
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#d4af37] hover:bg-[#e5be49] text-[#0b0c10] text-xs font-bold uppercase tracking-widest rounded font-brand shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Inquiry to Maître D’</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Physical Details & Location Card */}
          <div className="lg:col-span-5 space-y-6">
            {/* Restaurant Exterior/Interior Architecture Card */}
            <FoodTilt maxRotateX={3} maxRotateY={3} glare={true}>
              <div className="glass-card p-3 rounded-2xl border border-gold-subtle overflow-hidden">
                <div className="h-60 rounded-xl overflow-hidden relative group">
                  <img
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
                    alt="The Ember Table Embarcadero Pavilion"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] font-semibold block">
                      Historic Embarcadero Waterfront
                    </span>
                    <h4 className="font-serif text-base text-white font-medium">
                      The Ember Table Sanctuary
                    </h4>
                  </div>
                </div>
              </div>
            </FoodTilt>

            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-gold-subtle space-y-6">
              <h3 className="font-serif text-xl text-white font-medium">Hearth Location</h3>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Street Address</span>
                    <span className="text-slate-400 leading-relaxed">{siteSettings.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Service Hours</span>
                    <span className="text-slate-400 leading-relaxed">{siteSettings.openingHours}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Direct Telephone</span>
                    <a href={`tel:${siteSettings.phone}`} className="text-slate-400 hover:text-white">
                      {siteSettings.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Concierge Email</span>
                    <a href={`mailto:${siteSettings.email}`} className="text-slate-400 hover:text-white">
                      {siteSettings.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp CTA */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${siteSettings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-[#25D366]/20 border border-[#25D366]/40 hover:bg-[#25D366]/30 text-[#25D366] text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors font-mono"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Direct Concierge on WhatsApp</span>
                </a>
              </div>

              {/* Google Maps Link */}
              <div className="pt-2">
                <a
                  href={siteSettings.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center py-2.5 glass-dark text-slate-300 hover:text-white text-xs font-semibold rounded border border-white/10 font-mono uppercase tracking-wider"
                >
                  Open in Google Maps ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
