import React from 'react';
import { X, Share2, Twitter, Facebook, MessageSquare, Linkedin, Link, Download } from 'lucide-react';
import { OGFeatureCard3D } from '../3d/OGFeatureCard3D';
import { useApp } from '../../context/AppContext';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  url?: string;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  title = 'THE EMBER TABLE',
  subtitle = 'Crafted for the Senses · Live Woodfire Gastronomy',
  url,
}) => {
  const { showToast } = useApp();
  if (!isOpen) return null;

  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://theembertable.com');
  const encodedUrl = encodeURIComponent(currentUrl);
  const shareText = encodeURIComponent('Experience Michelin-caliber woodfire gastronomy at The Ember Table on the San Francisco Embarcadero.');

  const socialLinks = [
    {
      name: 'X (Twitter)',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`,
      color: 'hover:text-sky-400 hover:border-sky-400/40',
    },
    {
      name: 'WhatsApp',
      icon: MessageSquare,
      href: `https://api.whatsapp.com/send?text=${shareText}%20${encodedUrl}`,
      color: 'hover:text-emerald-400 hover:border-emerald-400/40',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:text-blue-400 hover:border-blue-400/40',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'hover:text-blue-500 hover:border-blue-500/40',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl glass-card rounded-2xl border border-gold-subtle p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full glass-dark text-slate-400 hover:text-white border border-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 pr-10">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5" />
            Social Card &amp; OpenGraph Preview
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-white font-medium">
            3D Animated Social Feature Card
          </h2>
          <p className="text-xs text-slate-400">
            Preview how The Ember Table appears when shared on iMessage, Slack, Twitter/X, Discord, and Facebook.
          </p>
        </div>

        {/* 3D Animated Card Component */}
        <OGFeatureCard3D
          title={title}
          subtitle={subtitle}
          pageUrl={currentUrl}
        />

        {/* Direct Social Share Buttons */}
        <div className="pt-2 border-t border-white/10 space-y-3">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
            Direct Social Broadcast
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {socialLinks.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 glass-dark border border-white/10 rounded-lg text-xs font-semibold text-slate-200 transition-all ${s.color}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{s.name}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
