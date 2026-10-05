import React, { useEffect } from 'react';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'restaurant' | 'article' | 'food';
  canonical?: string;
  structuredData?: Record<string, any>;
}

// Base Brand Defaults
export const SITE_NAME = 'The Ember Table';
export const DEFAULT_OG_IMAGE = '/og-feature-image.png';
export const DEFAULT_SITE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://theembertable.com';

export const SEO: React.FC<SEOProps> = ({
  title,
  description = 'Experience Michelin-caliber woodfire gastronomy, tableside cloche reveals, and artisanal wine pairings on the San Francisco Embarcadero.',
  keywords = 'The Ember Table, fine dining San Francisco, woodfire restaurant, Michelin star dining, A5 Wagyu, live reservations, tasting menu',
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'restaurant',
  canonical,
  structuredData,
}) => {
  useEffect(() => {
    // 1. Page Title
    const formattedTitle = title
      ? `${title} | ${SITE_NAME}`
      : `${SITE_NAME} — Live Woodfire Fine Dining & Reserve Cellar`;
    document.title = formattedTitle;

    // Helper to set or create meta tag
    const setMeta = (nameOrProperty: string, value: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${nameOrProperty}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, nameOrProperty);
        document.head.appendChild(element);
      }
      element.setAttribute('content', value);
    };

    // Helper for link tags (canonical)
    const setLink = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    const currentUrl = typeof window !== 'undefined'
      ? window.location.origin + window.location.pathname
      : 'https://theembertable.com';
    const canonicalUrl = canonical || currentUrl;

    const fullImageUrl = ogImage.startsWith('http')
      ? ogImage
      : `${typeof window !== 'undefined' ? window.location.origin : 'https://theembertable.com'}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`;

    // Standard Meta
    setMeta('description', description);
    setMeta('keywords', keywords);
    setLink('canonical', canonicalUrl);

    // OpenGraph
    setMeta('og:site_name', SITE_NAME, true);
    setMeta('og:type', ogType, true);
    setMeta('og:locale', 'en_US', true);
    setMeta('og:title', formattedTitle, true);
    setMeta('og:description', description, true);
    setMeta('og:url', canonicalUrl, true);
    setMeta('og:image', fullImageUrl, true);
    setMeta('og:image:secure_url', fullImageUrl, true);
    setMeta('og:image:type', fullImageUrl.endsWith('.png') ? 'image/png' : fullImageUrl.endsWith('.svg') ? 'image/svg+xml' : 'image/jpeg', true);
    setMeta('og:image:width', '1200', true);
    setMeta('og:image:height', '630', true);
    setMeta('og:image:alt', `${formattedTitle} - The Ember Table Fine Dining`, true);

    // Twitter / X
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', formattedTitle);
    setMeta('twitter:description', description);
    setMeta('twitter:image', fullImageUrl);
    setMeta('twitter:image:alt', `${formattedTitle} - The Ember Table Fine Dining`);

    // Schema.org Structured Data (JSON-LD)
    if (structuredData) {
      let script = document.getElementById('schema-jsonld') as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = 'schema-jsonld';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData, null, 2);
    }

    return () => {
      // Cleanup if needed
    };
  }, [title, description, keywords, ogImage, ogType, canonical, structuredData]);

  return null;
};

// Route-Specific SEO Metadata Map
export interface RouteSEOItem {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  badge?: string;
  subtitle?: string;
}

export const ROUTE_SEO: Record<string, RouteSEOItem> = {
  '/': {
    title: 'Live Woodfire Fine Dining & Reserve Cellar',
    description: 'Experience Michelin-caliber woodfire gastronomy, tableside cloche reveals, and artisanal wine pairings on the San Francisco Embarcadero.',
    keywords: 'The Ember Table, fine dining San Francisco, woodfire restaurant, Michelin dining, A5 Wagyu, Embarcadero waterfront',
    ogImage: '/og-home.png',
    badge: 'MICHELIN GUIDE 2026 · THREE KEYS',
    subtitle: 'Crafted for the Senses · Live Woodfire Gastronomy',
  },
  '/menu': {
    title: 'Seasonal Tasting Menu & Reserve Allocations',
    description: 'Explore California white oak seared prime cuts, 72-hour wild ferment sourdough, and rare vintage wine pairings. Available tableside and online dispatch.',
    keywords: 'The Ember Table menu, woodfire steak, A5 wagyu, handmade tagliolini, tasting menu, luxury food delivery San Francisco',
    ogImage: '/og-menu.png',
    badge: 'CULINARY COMPENDIUM · TASTING MENU',
    subtitle: 'White Oak Seared Prime Cuts & Handcrafted Pasta',
  },
  '/reservation': {
    title: 'Reserve a Table — Fireside & Chef’s Counter',
    description: 'Secure your dining experience at The Ember Table. Choose from intimate fireside banquettes, the Master Hearth counter, or the Sommelier’s alcove.',
    keywords: 'book restaurant table, reservations San Francisco, fine dining booking, Embarcadero dinner reservation',
    ogImage: '/og-reservation.png',
    badge: 'FIRESIDE SEATING & CHEF’S COUNTER',
    subtitle: 'Intimate Banquettes, Master Hearth & Sommelier Alcove',
  },
  '/about': {
    title: 'Our Heritage — The Philosophy of Living Embers',
    description: 'Discover our culinary lineage from coastal California white oak embers to ancestral Dhungar smoke infusions and zero-waste whole-animal gastronomy.',
    keywords: 'The Ember Table heritage, culinary philosophy, live woodfire technique, Chef Julian Vance',
    ogImage: '/og-about.png',
    badge: 'HEARTH HERITAGE · LIVING EMBERS',
    subtitle: 'Ancient Live-Fire Traditions & Zero-Waste Artistry',
  },
  '/chefs': {
    title: 'The Culinary Brigade & Master Sommelier',
    description: 'Meet Chef Patron Julian Vance, Head Baker Elena Rostova, and Master Sommelier Marcus Laurent shaping live-fire gastronomy in San Francisco.',
    keywords: 'Julian Vance chef, culinary team, master sommelier, woodfire culinary brigade',
    ogImage: '/og-chefs.png',
    badge: 'THE CULINARY BRIGADE · THREE KEYS',
    subtitle: 'Chef Patron Julian Vance & Master Sommeliers',
  },
  '/gallery': {
    title: 'Visual Sanctuary & Hearth Photography',
    description: 'Gaze into our live woodfire line, private cellar vaults, hand-forged tableware, and tableside vapor presentations in high resolution.',
    keywords: 'restaurant photography, luxury restaurant interior, woodfire cooking photos, San Francisco fine dining gallery',
    ogImage: '/og-gallery.png',
    badge: 'VISUAL SANCTUARY · EMBARCADERO',
    subtitle: 'Cinematic Woodfire Flames, Cellar Vaults & Tableware',
  },
  '/private-dining': {
    title: 'Private Dining Chambers & Cellar Buyouts',
    description: 'Host discreet executive galas, intimate celebrations, and full hearth buyouts with bespoke multi-course menus and dedicated sommelier service.',
    keywords: 'private dining room San Francisco, executive dinner buyout, private event venue Embarcadero',
    ogImage: '/og-private-dining.png',
    badge: 'PRIVATE CHAMBERS & VAULT BUYOUTS',
    subtitle: 'Discreet Executive Chambers & Sommelier Salon',
  },
  '/events': {
    title: 'Curated Celebrations & Fireside Receptions',
    description: 'From candlelit wedding banquets to milestone birthdays and sommelier masterclasses, elevate your special gatherings at The Ember Table.',
    keywords: 'events venue San Francisco, wedding reception, birthday dining, corporate wine tasting',
    ogImage: '/og-events.png',
    badge: 'CURATED CELEBRATIONS & GALAS',
    subtitle: 'Weddings, Milestone Banquets & Masterclasses',
  },
  '/catering': {
    title: 'Luxury Estate Catering & Live Hearth Roasts',
    description: 'Bring our white oak mobile hearth and Michelin-trained brigade to your estate, penthouse, or winery for extraordinary outdoor banquets.',
    keywords: 'luxury catering San Francisco, private chef catering, estate woodfire roast, wedding catering Bay Area',
    ogImage: '/og-catering.png',
    badge: 'ESTATE & YACHT CATERING',
    subtitle: 'Bringing White Oak Embers to Your Estate or Penthouse',
  },
  '/contact': {
    title: 'Concierge & Location — Embarcadero Waterfront',
    description: 'Direct inquiries to our maître d’ and cellar stewards. Located at Pier 7, The Embarcadero with waterfront bay views and private valet.',
    keywords: 'The Ember Table location, address, phone, contact maître d, Pier 7 Embarcadero',
    ogImage: '/og-contact.png',
    badge: 'CONCIERGE & WATERFRONT LOCATION',
    subtitle: 'Pier 7, The Embarcadero · San Francisco Waterfront',
  },
  '/blog': {
    title: 'The Hearth Chronicle — Gastronomy Essays & Firecraft',
    description: 'In-depth essays on white oak thermodynamics, wild fermentation starters, Périgord truffle hunting, and ancestral Dhungar charcoal infusions.',
    keywords: 'culinary blog, food essays, sourdough fermentation science, woodfire cooking guides',
    ogImage: '/og-blog.png',
    badge: 'THE HEARTH CHRONICLE · ESSAYS',
    subtitle: 'Essays on Woodfire Thermodynamics & Wild Fermentation',
  },
  '/offers': {
    title: 'Seasonal Dining Privileges & Sommelier Vouchers',
    description: 'Exclusive fireside incentives, early evening tasting promotions, and complimentary reserve wine pairings for our distinguished patrons.',
    keywords: 'restaurant vouchers, fine dining discount code, wine pairing offer, Ember Table privileges',
    ogImage: '/og-offers.png',
    badge: 'SEASONAL PRIVILEGES & INCENTIVES',
    subtitle: 'Complimentary Grand Cru Pairings & Fireside Incentives',
  },
  '/cart': {
    title: 'Your Dining Selections — The Ember Table Bag',
    description: 'Review your chosen woodfire specialties, vintage bottles, and thermal packaging options before final dispatch.',
    keywords: 'dining bag, food order review, online order cart',
    ogImage: '/og-menu.png',
    badge: 'YOUR DINING SELECTIONS',
    subtitle: 'Woodfire Specialties & Thermal Packaging',
  },
  '/checkout': {
    title: 'Secure Settlement & Delivery Dispatch',
    description: 'Complete your luxury dining order with climate-controlled white-glove courier dispatch to your residence or hotel suite.',
    keywords: 'order checkout, luxury food delivery, secure payment',
    ogImage: '/og-reservation.png',
    badge: 'SECURE DISPATCH',
    subtitle: 'Climate-Controlled White Glove Delivery',
  },
  '/order-tracking': {
    title: 'Live Order Dispatch & Courier Tracker',
    description: 'Follow your culinary selections in real-time from the white oak embers through packaging to your front door.',
    keywords: 'live food tracker, order status, courier dispatch tracker',
    ogImage: '/og-home.png',
    badge: 'LIVE DISPATCH TRACKER',
    subtitle: 'Real-Time Hearth to Door Monitoring',
  },
};
