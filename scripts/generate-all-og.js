import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Helper to escape XML entities
function escapeXml(unsafe) {
  if (typeof unsafe !== 'string') return unsafe;
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Helper to generate distinct luxury SVG per page
function renderPageOG({
  badge,
  title,
  subtitle,
  detail,
  badges,
  footerNote,
  accentColor = '#d4af37',
  glowCenter = '20%',
  bgGradStart = '#b45309',
  rightIcon = 'cloche',
}) {
  const safeBadge = escapeXml(badge);
  const safeTitle = escapeXml(title);
  const safeSubtitle = escapeXml(subtitle);
  const safeDetail = escapeXml(detail);
  const safeFooterNote = escapeXml(footerNote || 'Pier 7, The Embarcadero, San Francisco, CA');
  const getMotifSvg = (type) => {
    switch (type) {
      case 'menu':
        // Wine bottle, glass and steak silhouette
        return `
          <circle cx="0" cy="0" r="140" fill="none" stroke="${accentColor}" stroke-width="1.5" stroke-dasharray="6 4" stroke-opacity="0.5"/>
          <circle cx="0" cy="0" r="170" fill="none" stroke="#d4af37" stroke-width="1" stroke-opacity="0.2"/>
          <path d="M -40 70 L -40 -30 Q -40 -60 -25 -70 L -25 -100 L -15 -100 L -15 -70 Q 0 -60 0 -30 L 0 70 Z" fill="url(#goldGradient)" opacity="0.9"/>
          <path d="M 25 70 L 25 20 Q 25 -30 45 -40 L 45 -50 L 55 -50 L 55 20 Q 55 50 45 70 Z" fill="url(#goldGradient)" opacity="0.8"/>
          <circle cx="35" cy="8" r="4" fill="#fef08a"/>
          <text x="0" y="130" text-anchor="middle" font-family="'Cinzel', serif" font-size="14" font-weight="700" fill="#fef08a" letter-spacing="3">TASTING MENU &amp; CELLAR</text>
        `;
      case 'reservation':
        // Elegant table with candlelight
        return `
          <circle cx="0" cy="0" r="140" fill="none" stroke="${accentColor}" stroke-width="1.5" stroke-dasharray="6 4" stroke-opacity="0.5"/>
          <circle cx="0" cy="0" r="170" fill="none" stroke="#d4af37" stroke-width="1" stroke-opacity="0.2"/>
          <ellipse cx="0" cy="40" rx="110" ry="24" fill="#141720" stroke="url(#goldGradient)" stroke-width="2.5"/>
          <line x1="-80" y1="40" x2="-60" y2="90" stroke="${accentColor}" stroke-width="3"/>
          <line x1="80" y1="40" x2="60" y2="90" stroke="${accentColor}" stroke-width="3"/>
          <!-- Candelabra -->
          <rect x="-4" y="-30" width="8" height="60" fill="url(#goldGradient)"/>
          <ellipse cx="0" cy="-42" rx="7" ry="12" fill="#f59e0b" filter="url(#glow)"/>
          <circle cx="0" cy="-42" r="4" fill="#fef08a"/>
          <text x="0" y="130" text-anchor="middle" font-family="'Cinzel', serif" font-size="14" font-weight="700" fill="#fef08a" letter-spacing="3">FIRESIDE TABLE SEATING</text>
        `;
      case 'about':
        // Raging Woodfire Hearth
        return `
          <circle cx="0" cy="0" r="140" fill="none" stroke="${accentColor}" stroke-width="1.5" stroke-dasharray="6 4" stroke-opacity="0.5"/>
          <circle cx="0" cy="0" r="170" fill="none" stroke="#d4af37" stroke-width="1" stroke-opacity="0.2"/>
          <!-- Fire Hearth logs -->
          <rect x="-90" y="45" width="180" height="24" rx="12" fill="#2d1a0e" stroke="url(#goldGradient)" stroke-width="2"/>
          <rect x="-70" y="25" width="140" height="22" rx="11" fill="#3b2313" stroke="url(#goldGradient)" stroke-width="2"/>
          <!-- Dancing Flame shapes -->
          <path d="M 0 30 Q -60 -10 -20 -80 Q -10 -30 0 -110 Q 20 -40 30 -75 Q 60 -10 0 30 Z" fill="url(#fireGradient)" filter="url(#glow)"/>
          <circle cx="0" cy="-40" r="12" fill="#fef08a" filter="url(#glow)"/>
          <text x="0" y="130" text-anchor="middle" font-family="'Cinzel', serif" font-size="14" font-weight="700" fill="#fef08a" letter-spacing="3">LIVING OAK EMBERS</text>
        `;
      case 'chefs':
        // Chef Knife & Hat Toque Crest
        return `
          <circle cx="0" cy="0" r="140" fill="none" stroke="${accentColor}" stroke-width="1.5" stroke-dasharray="6 4" stroke-opacity="0.5"/>
          <circle cx="0" cy="0" r="170" fill="none" stroke="#d4af37" stroke-width="1" stroke-opacity="0.2"/>
          <!-- Chef Toque -->
          <path d="M -50 40 C -70 40, -80 0, -40 -30 C -50 -60, 50 -60, 40 -30 C 80 0, 70 40, 50 40 Z" fill="url(#goldGradient)" opacity="0.9"/>
          <rect x="-45" y="40" width="90" height="20" rx="4" fill="#181c24" stroke="url(#goldGradient)" stroke-width="2"/>
          <circle cx="0" cy="-10" r="6" fill="#fef08a"/>
          <text x="0" y="130" text-anchor="middle" font-family="'Cinzel', serif" font-size="14" font-weight="700" fill="#fef08a" letter-spacing="3">CHEF JULIAN VANCE</text>
        `;
      case 'gallery':
        // Camera / Prism view
        return `
          <circle cx="0" cy="0" r="140" fill="none" stroke="${accentColor}" stroke-width="1.5" stroke-dasharray="6 4" stroke-opacity="0.5"/>
          <circle cx="0" cy="0" r="170" fill="none" stroke="#d4af37" stroke-width="1" stroke-opacity="0.2"/>
          <rect x="-80" y="-30" width="160" height="100" rx="14" fill="#141720" stroke="url(#goldGradient)" stroke-width="2.5"/>
          <rect x="-35" y="-55" width="70" height="25" rx="6" fill="url(#goldGradient)"/>
          <circle cx="0" cy="20" r="32" fill="#08090b" stroke="url(#goldGradient)" stroke-width="3"/>
          <circle cx="0" cy="20" r="18" fill="#f59e0b" filter="url(#glow)" opacity="0.8"/>
          <text x="0" y="130" text-anchor="middle" font-family="'Cinzel', serif" font-size="14" font-weight="700" fill="#fef08a" letter-spacing="3">VISUAL SANCTUARY</text>
        `;
      case 'private-dining':
        // Golden Key & Royal Crest
        return `
          <circle cx="0" cy="0" r="140" fill="none" stroke="${accentColor}" stroke-width="1.5" stroke-dasharray="6 4" stroke-opacity="0.5"/>
          <circle cx="0" cy="0" r="170" fill="none" stroke="#d4af37" stroke-width="1" stroke-opacity="0.2"/>
          <circle cx="0" cy="-45" r="32" fill="none" stroke="url(#goldGradient)" stroke-width="7"/>
          <circle cx="0" cy="-45" r="16" fill="none" stroke="#fef08a" stroke-width="2"/>
          <rect x="-4" y="-15" width="8" height="90" fill="url(#goldGradient)"/>
          <rect x="4" y="45" width="22" height="8" fill="url(#goldGradient)"/>
          <rect x="4" y="62" width="16" height="8" fill="url(#goldGradient)"/>
          <text x="0" y="130" text-anchor="middle" font-family="'Cinzel', serif" font-size="14" font-weight="700" fill="#fef08a" letter-spacing="3">EXCLUSIVE VAULT BUYOUTS</text>
        `;
      case 'blog':
        // Chronicle Scroll / Quill
        return `
          <circle cx="0" cy="0" r="140" fill="none" stroke="${accentColor}" stroke-width="1.5" stroke-dasharray="6 4" stroke-opacity="0.5"/>
          <circle cx="0" cy="0" r="170" fill="none" stroke="#d4af37" stroke-width="1" stroke-opacity="0.2"/>
          <rect x="-65" y="-55" width="130" height="120" rx="8" fill="#141720" stroke="url(#goldGradient)" stroke-width="2.5"/>
          <line x1="-45" y1="-30" x2="45" y2="-30" stroke="#fef08a" stroke-width="2"/>
          <line x1="-45" y1="-10" x2="45" y2="-10" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
          <line x1="-45" y1="10" x2="25" y2="10" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
          <line x1="-45" y1="30" x2="40" y2="30" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
          <text x="0" y="130" text-anchor="middle" font-family="'Cinzel', serif" font-size="14" font-weight="700" fill="#fef08a" letter-spacing="3">THE HEARTH CHRONICLE</text>
        `;
      case 'contact':
        // Compass / Map Location Crest
        return `
          <circle cx="0" cy="0" r="140" fill="none" stroke="${accentColor}" stroke-width="1.5" stroke-dasharray="6 4" stroke-opacity="0.5"/>
          <circle cx="0" cy="0" r="170" fill="none" stroke="#d4af37" stroke-width="1" stroke-opacity="0.2"/>
          <path d="M 0 -70 C -40 -70, -45 -20, 0 45 C 45 -20, 40 -70, 0 -70 Z" fill="url(#goldGradient)"/>
          <circle cx="0" cy="-40" r="14" fill="#08090b"/>
          <circle cx="0" cy="-40" r="7" fill="#fef08a"/>
          <text x="0" y="130" text-anchor="middle" font-family="'Cinzel', serif" font-size="14" font-weight="700" fill="#fef08a" letter-spacing="3">PIER 7 EMBARCADERO</text>
        `;
      case 'offers':
        // Privilege Seal
        return `
          <circle cx="0" cy="0" r="140" fill="none" stroke="${accentColor}" stroke-width="1.5" stroke-dasharray="6 4" stroke-opacity="0.5"/>
          <circle cx="0" cy="0" r="170" fill="none" stroke="#d4af37" stroke-width="1" stroke-opacity="0.2"/>
          <circle cx="0" cy="10" r="60" fill="#141720" stroke="url(#goldGradient)" stroke-width="3"/>
          <circle cx="0" cy="10" r="48" fill="none" stroke="#d4af37" stroke-width="1.5" stroke-dasharray="4 4"/>
          <text x="0" y="2" text-anchor="middle" font-family="'Cinzel', serif" font-size="18" font-weight="700" fill="#fef08a">RESERVE</text>
          <text x="0" y="26" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="600" fill="#e2e8f0">PRIVILEGE</text>
          <text x="0" y="130" text-anchor="middle" font-family="'Cinzel', serif" font-size="14" font-weight="700" fill="#fef08a" letter-spacing="3">DINING ALLOCATIONS</text>
        `;
      case 'events':
      case 'catering':
        // Celebratory Flutes / Banquet Roaster
        return `
          <circle cx="0" cy="0" r="140" fill="none" stroke="${accentColor}" stroke-width="1.5" stroke-dasharray="6 4" stroke-opacity="0.5"/>
          <circle cx="0" cy="0" r="170" fill="none" stroke="#d4af37" stroke-width="1" stroke-opacity="0.2"/>
          <ellipse cx="0" cy="50" rx="90" ry="16" fill="#181c24" stroke="url(#goldGradient)" stroke-width="2.5"/>
          <path d="M -60 50 Q -60 -20 0 -50 Q 60 -20 60 50 Z" fill="url(#fireGradient)" opacity="0.85" filter="url(#glow)"/>
          <circle cx="0" cy="-60" r="8" fill="#fef08a"/>
          <text x="0" y="130" text-anchor="middle" font-family="'Cinzel', serif" font-size="14" font-weight="700" fill="#fef08a" letter-spacing="3">CURATED BANQUETS</text>
        `;
      case 'cloche':
      default:
        return `
          <circle cx="0" cy="0" r="140" fill="none" stroke="${accentColor}" stroke-width="1.5" stroke-dasharray="6 4" stroke-opacity="0.5"/>
          <circle cx="0" cy="0" r="170" fill="none" stroke="#d4af37" stroke-width="1" stroke-opacity="0.2"/>
          <ellipse cx="0" cy="80" rx="120" ry="16" fill="#12151c" stroke="url(#goldGradient)" stroke-width="3"/>
          <ellipse cx="0" cy="74" rx="100" ry="10" fill="#181c24" stroke="#d4af37" stroke-opacity="0.4" stroke-width="1.5"/>
          <path d="M -90 74 C -90 -30, 90 -30, 90 74 Z" fill="url(#goldGradient)" opacity="0.9"/>
          <circle cx="0" cy="-35" r="14" fill="url(#goldGradient)"/>
          <circle cx="0" cy="-35" r="7" fill="#fef08a"/>
          <text x="0" y="130" text-anchor="middle" font-family="'Cinzel', serif" font-size="14" font-weight="700" fill="#fef08a" letter-spacing="3">EST. 2018 · SAN FRANCISCO</text>
        `;
    }
  };

  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGlow" cx="${glowCenter}" cy="75%" r="75%">
      <stop offset="0%" stop-color="${bgGradStart}" stop-opacity="0.4"/>
      <stop offset="45%" stop-color="#19130d" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#08090b" stop-opacity="1"/>
    </radialGradient>
    <radialGradient id="motifGlow" cx="80%" cy="45%" r="40%">
      <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.28"/>
      <stop offset="60%" stop-color="${accentColor}" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#08090b" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="30%" stop-color="#fef08a"/>
      <stop offset="70%" stop-color="#d4af37"/>
      <stop offset="100%" stop-color="#9a6704"/>
    </linearGradient>
    <linearGradient id="fireGradient" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#ef4444"/>
      <stop offset="40%" stop-color="#f97316"/>
      <stop offset="80%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#fef08a"/>
    </linearGradient>
    <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.7"/>
      <stop offset="50%" stop-color="${accentColor}" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#ca8a04" stop-opacity="0.6"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <rect width="1200" height="630" fill="#08090b"/>
  <rect width="1200" height="630" fill="url(#bgGlow)"/>
  <rect width="1200" height="630" fill="url(#motifGlow)"/>

  <!-- Ornate Border Frame -->
  <rect x="36" y="36" width="1128" height="558" rx="16" fill="none" stroke="url(#goldBorder)" stroke-width="2"/>
  <rect x="44" y="44" width="1112" height="542" rx="12" fill="none" stroke="${accentColor}" stroke-opacity="0.15" stroke-width="1"/>

  <!-- Corner Flourishes -->
  <path d="M 36 60 L 60 36 M 36 36 L 50 36 M 36 36 L 36 50" stroke="${accentColor}" stroke-width="2" stroke-linecap="round"/>
  <path d="M 1164 60 L 1140 36 M 1164 36 L 1150 36 M 1164 36 L 1164 50" stroke="${accentColor}" stroke-width="2" stroke-linecap="round"/>
  <path d="M 36 570 L 60 594 M 36 594 L 50 594 M 36 594 L 36 580" stroke="${accentColor}" stroke-width="2" stroke-linecap="round"/>
  <path d="M 1164 570 L 1140 594 M 1164 594 L 1150 594 M 1164 594 L 1164 580" stroke="${accentColor}" stroke-width="2" stroke-linecap="round"/>

  <!-- Left Content -->
  <g transform="translate(84, 96)">
    <!-- Pill Tag -->
    <g>
      <rect x="0" y="0" width="${safeBadge.length * 9.5 + 44}" height="32" rx="16" fill="#18181b" stroke="${accentColor}" stroke-width="1" stroke-opacity="0.5"/>
      <circle cx="16" cy="16" r="4" fill="#f59e0b"/>
      <text x="30" y="21" font-family="'Cinzel', 'Georgia', serif" font-size="12" font-weight="700" fill="#fef08a" letter-spacing="2.2">
        ${safeBadge}
      </text>
    </g>

    <!-- Main Title -->
    <text x="0" y="112" font-family="'Cinzel', 'Cormorant Garamond', 'Georgia', serif" font-size="56" font-weight="700" fill="url(#goldGradient)" letter-spacing="2">
      ${safeTitle}
    </text>

    <!-- Subtitle -->
    <text x="0" y="160" font-family="'Plus Jakarta Sans', -apple-system, sans-serif" font-size="22" font-weight="400" fill="#e2e8f0" letter-spacing="0.5">
      ${safeSubtitle}
    </text>

    <!-- Detail Description -->
    <text x="0" y="196" font-family="'Plus Jakarta Sans', -apple-system, sans-serif" font-size="16" font-weight="400" fill="#94a3b8">
      ${safeDetail}
    </text>

    <!-- Badges Row -->
    <g transform="translate(0, 246)">
      ${badges
        .map((b, idx) => {
          const width = b.length * 10 + 36;
          const prevOffsets = badges.slice(0, idx).reduce((acc, curr) => acc + curr.length * 10 + 48, 0);
          return `
          <g transform="translate(${prevOffsets}, 0)">
            <rect x="0" y="0" width="${width}" height="42" rx="8" fill="#14171f" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1"/>
            <text x="18" y="26" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="${idx === 0 ? '700' : '500'}" fill="${idx === 0 ? '#fef08a' : '#cbd5e1'}">
              ${escapeXml(b)}
            </text>
          </g>`;
        })
        .join('')}
    </g>

    <!-- Footer Note -->
    <g transform="translate(0, 360)">
      <line x1="0" y1="0" x2="560" y2="0" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1"/>
      <text x="0" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="500" fill="${accentColor}">
        ${safeFooterNote}
      </text>
      <text x="360" y="32" font-family="'Cinzel', serif" font-size="13" font-weight="700" fill="#ffffff" letter-spacing="1">
        THE EMBER TABLE
      </text>
    </g>
  </g>

  <!-- Right Visual Motif -->
  <g transform="translate(930, 290)">
    ${getMotifSvg(rightIcon)}
    <!-- Floating Embers / Sparks -->
    <circle cx="-110" cy="-60" r="3.5" fill="#f59e0b" filter="url(#glow)"/>
    <circle cx="-70" cy="-110" r="4.5" fill="#f97316" filter="url(#glow)"/>
    <circle cx="40" cy="-120" r="3" fill="#eab308" filter="url(#glow)"/>
    <circle cx="95" cy="-80" r="5" fill="#f59e0b" filter="url(#glow)"/>
    <circle cx="120" cy="-30" r="3.5" fill="#ef4444" filter="url(#glow)"/>
    <circle cx="-130" cy="20" r="4" fill="#f97316" filter="url(#glow)"/>
    <circle cx="130" cy="30" r="3" fill="#fbbf24" filter="url(#glow)"/>
  </g>
</svg>`;
}

// Pages configuration for batch generation
const pages = [
  {
    filename: 'og-feature-image.png',
    badge: 'MICHELIN GUIDE 2026 · THREE KEYS',
    title: 'THE EMBER TABLE',
    subtitle: 'Crafted for the Senses · Live Woodfire Gastronomy',
    detail: 'Coastal California White Oak Coals · 72h Wild Ferment · Rare Cellar Allocations',
    badges: ['★ 4.9 (1,280+ Reviews)', 'A5 Miyazaki Wagyu', 'Grand Cru Cellar'],
    rightIcon: 'cloche',
  },
  {
    filename: 'og-home.png',
    badge: 'MICHELIN GUIDE 2026 · THREE KEYS',
    title: 'THE EMBER TABLE',
    subtitle: 'Crafted for the Senses · Live Woodfire Gastronomy',
    detail: 'Coastal California White Oak Coals · 72h Wild Ferment · Rare Cellar Allocations',
    badges: ['★ 4.9 (1,280+ Reviews)', 'A5 Miyazaki Wagyu', 'Grand Cru Cellar'],
    rightIcon: 'cloche',
  },
  {
    filename: 'og-menu.png',
    badge: 'CULINARY COMPENDIUM · TASTING MENU',
    title: 'SEASONAL TASTING MENU',
    subtitle: 'White Oak Seared Prime Cuts & Handcrafted Pasta',
    detail: 'A5 Miyazaki Wagyu, 72h Wild Ferment Sourdough & Rare Sommelier Allocations',
    badges: ['★ 4.9 Kitchen Rating', 'A5 Wagyu & Caviar', 'Grand Cru Pairings'],
    rightIcon: 'menu',
    bgGradStart: '#92400e',
  },
  {
    filename: 'og-reservation.png',
    badge: 'FIRESIDE SEATING & CHEF’S COUNTER',
    title: 'RESERVE YOUR TABLE',
    subtitle: 'Intimate Banquettes, Master Hearth & Sommelier Alcove',
    detail: 'Open Hearth Views · Tableside Cloche Revelations · 30 Days Advance Release',
    badges: ['Instant Confirmation', 'Private Valet', 'Personal Concierge'],
    rightIcon: 'reservation',
    bgGradStart: '#78350f',
  },
  {
    filename: 'og-about.png',
    badge: 'HEARTH HERITAGE · LIVING EMBERS',
    title: 'THE EMBER PHILOSOPHY',
    subtitle: 'Ancient Live-Fire Traditions & Zero-Waste Artistry',
    detail: '1,100°F Incandescent Oak Embers · Zero-Kilometer Foraging · Ancestral Dhungar Smoke',
    badges: ['Est. 2018 San Francisco', 'California White Oak', 'Dhungar Charcoal'],
    rightIcon: 'about',
    bgGradStart: '#9a3412',
  },
  {
    filename: 'og-chefs.png',
    badge: 'THE CULINARY BRIGADE · THREE KEYS',
    title: 'MASTERS OF THE HEARTH',
    subtitle: 'Chef Patron Julian Vance & Master Sommeliers',
    detail: 'Directing 3 Live Fire Pits · Michelin-Trained Brigade · Grand Cru Wine Stewards',
    badges: ['Chef Julian Vance', 'Elena Rostova (Baker)', 'Marcus Laurent (Somm)'],
    rightIcon: 'chefs',
    bgGradStart: '#b45309',
  },
  {
    filename: 'og-gallery.png',
    badge: 'VISUAL SANCTUARY · EMBARCADERO',
    title: 'ATMOSPHERE & MOMENTS',
    subtitle: 'Cinematic Woodfire Flames, Cellar Vaults & Tableware',
    detail: 'Hand-Forged Stoneware · Coastal Oak Line · Sunset Embarcadero Bay Views',
    badges: ['High-Res Photography', 'Hearth In Motion', 'Architectural Vaults'],
    rightIcon: 'gallery',
    bgGradStart: '#854d0e',
  },
  {
    filename: 'og-private-dining.png',
    badge: 'PRIVATE CHAMBERS & VAULT BUYOUTS',
    title: 'PRIVATE DINING & GALAS',
    subtitle: 'Discreet Executive Chambers & Sommelier Salon',
    detail: 'Bespoke Multi-Course Menus · Dedicated Maître d’ · Up to 60 Esteemed Guests',
    badges: ['Executive Buyouts', 'Sommelier Cellar', 'Bespoke Degustation'],
    rightIcon: 'private-dining',
    bgGradStart: '#713f12',
  },
  {
    filename: 'og-blog.png',
    badge: 'THE HEARTH CHRONICLE · ESSAYS',
    title: 'FIRE, FLOUR & WINE',
    subtitle: 'Essays on Woodfire Thermodynamics & Wild Fermentation',
    detail: 'Science of 72h Starters · Périgord Truffle Foraging · Grand Cru Terroir Deep Dives',
    badges: ['Oak Thermodynamics', 'Fermentation Science', 'Cellar Fieldnotes'],
    rightIcon: 'blog',
    bgGradStart: '#92400e',
  },
  {
    filename: 'og-contact.png',
    badge: 'CONCIERGE & WATERFRONT LOCATION',
    title: 'CONCIERGE & LOCATION',
    subtitle: 'Pier 7, The Embarcadero · San Francisco Waterfront',
    detail: 'Valet Parking Available · Live Maître d’ Desk · Waterfront Dining Rooms',
    badges: ['Pier 7 Embarcadero', '+1-415-555-0199', 'Valet Parking Available'],
    rightIcon: 'contact',
    bgGradStart: '#78350f',
  },
  {
    filename: 'og-offers.png',
    badge: 'SEASONAL PRIVILEGES & INCENTIVES',
    title: 'DINING PRIVILEGES',
    subtitle: 'Complimentary Grand Cru Pairings & Fireside Incentives',
    detail: 'Exclusive Early Tasting Allocations · Private Reserve Cellar Tastings',
    badges: ['Grand Cru Pairing', 'Early Seating Privileges', 'Sommelier Vouchers'],
    rightIcon: 'offers',
    bgGradStart: '#854d0e',
  },
  {
    filename: 'og-events.png',
    badge: 'CURATED CELEBRATIONS & GALAS',
    title: 'CELEBRATIONS AT EMBER',
    subtitle: 'Weddings, Milestone Banquets & Sommelier Masterclasses',
    detail: 'Custom Candlelit Table Settings · Multi-Course Fire Feasts · Waterfront Receptions',
    badges: ['Milestone Feasts', 'Wine Masterclasses', 'Waterfront Receptions'],
    rightIcon: 'events',
    bgGradStart: '#9a3412',
  },
  {
    filename: 'og-catering.png',
    badge: 'ESTATE & YACHT CATERING',
    title: 'MOBILE HEARTH CATERING',
    subtitle: 'Bringing White Oak Embers to Your Estate or Penthouse',
    detail: 'Mobile Fire Line & Brigade · Whole Animal Roasts · Sommelier Pairings Bay Area',
    badges: ['Estate Woodfire', 'Michelin Brigade', 'Bay Area & Wine Country'],
    rightIcon: 'catering',
    bgGradStart: '#b45309',
  },
];

async function generateAllOGImages() {
  console.log(`Starting generation of ${pages.length} distinct OpenGraph images...`);

  for (const page of pages) {
    const svgContent = renderPageOG(page);
    const destPng = path.resolve(publicDir, page.filename);
    const destSvg = path.resolve(publicDir, page.filename.replace('.png', '.svg'));

    // Save SVG
    fs.writeFileSync(destSvg, svgContent);

    // Render to 1200x630 PNG via sharp
    await sharp(Buffer.from(svgContent))
      .resize(1200, 630)
      .png({ quality: 95, compressionLevel: 8 })
      .toFile(destPng);

    console.log(`✓ Generated ${page.filename} (1200x630)`);
  }

  // Also make sure og-image.png is present (alias for og-feature-image.png)
  fs.copyFileSync(
    path.resolve(publicDir, 'og-feature-image.png'),
    path.resolve(publicDir, 'og-image.png')
  );
  console.log('✓ Synced og-image.png');
}

generateAllOGImages().catch((err) => {
  console.error('Failed batch generation:', err);
  process.exit(1);
});
