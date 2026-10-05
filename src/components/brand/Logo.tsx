import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  variant?: 'full' | 'compact' | 'badge';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  variant = 'full',
}) => {
  const sizeMap = {
    sm: { width: 36, height: 36, text: 'text-base', sub: 'text-[9px]' },
    md: { width: 48, height: 48, text: 'text-xl', sub: 'text-[10px]' },
    lg: { width: 72, height: 72, text: 'text-2xl', sub: 'text-xs' },
    xl: { width: 140, height: 140, text: 'text-4xl', sub: 'text-sm' },
  };

  const current = sizeMap[size];

  if (variant === 'badge') {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <svg
          width={current.width}
          height={current.height}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="filter drop-shadow-[0_4px_12px_rgba(212,175,55,0.35)]"
        >
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2B2" />
              <stop offset="35%" stopColor="#DFB248" />
              <stop offset="70%" stopColor="#9C6F19" />
              <stop offset="100%" stopColor="#F5D372" />
            </linearGradient>
            <linearGradient id="emberDark" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1C1815" />
              <stop offset="100%" stopColor="#0B0907" />
            </linearGradient>
            <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#689F38" />
              <stop offset="100%" stopColor="#33691E" />
            </linearGradient>
            <radialGradient id="clocheGlow" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFF7CC" />
              <stop offset="60%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#7E550B" />
            </radialGradient>
          </defs>

          {/* Outer Ring */}
          <circle cx="100" cy="100" r="92" fill="url(#emberDark)" stroke="url(#goldGrad)" strokeWidth="4" />
          <circle cx="100" cy="100" r="85" stroke="url(#goldGrad)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

          {/* Fork (Left) */}
          <path
            d="M52 115 L52 75 C52 70 54 68 56 68 C58 68 60 70 60 75 L60 115"
            stroke="url(#goldGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path d="M56 68 L56 60 M52 64 L52 60 M60 64 L60 60" stroke="url(#goldGrad)" strokeWidth="2" strokeLinecap="round" />
          <path d="M56 115 L56 142" stroke="url(#goldGrad)" strokeWidth="3" strokeLinecap="round" />

          {/* Knife (Right) */}
          <path
            d="M144 60 C144 60 148 68 148 85 C148 102 144 115 144 115 L144 142"
            stroke="url(#goldGrad)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Chef Hat (Top) */}
          <path
            d="M80 65 C70 58 72 42 85 44 C88 34 105 32 112 40 C122 36 130 46 125 58 C132 64 125 72 118 70 L82 70 Z"
            fill="url(#goldGrad)"
            opacity="0.95"
          />
          <rect x="84" y="68" width="32" height="6" rx="2" fill="url(#goldGrad)" />

          {/* Serving Cloche (Center) */}
          <path
            d="M74 112 C74 90 85 80 100 80 C115 80 126 90 126 112 Z"
            fill="url(#clocheGlow)"
          />
          <circle cx="100" cy="78" r="4" fill="url(#goldGrad)" />
          <line x1="68" y1="112" x2="132" y2="112" stroke="url(#goldGrad)" strokeWidth="4" strokeLinecap="round" />

          {/* Steam Swirls */}
          <path
            d="M96 74 C94 68 98 64 96 58 M104 74 C106 68 102 64 104 58"
            stroke="url(#goldGrad)"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Green Leaves */}
          <path d="M64 125 C60 115 70 112 75 118 C72 128 65 127 64 125 Z" fill="url(#leafGrad)" />
          <path d="M136 125 C140 115 130 112 125 118 C128 128 135 127 136 125 Z" fill="url(#leafGrad)" />

          {/* Bottom Brand Ribbon */}
          <path
            d="M45 138 Q100 148 155 138 L150 162 Q100 172 50 162 Z"
            fill="#120e0a"
            stroke="url(#goldGrad)"
            strokeWidth="1.5"
          />
          <text
            x="100"
            y="155"
            textAnchor="middle"
            fill="url(#goldGrad)"
            fontSize="10"
            fontFamily="'Cinzel', serif"
            fontWeight="bold"
            letterSpacing="2"
          >
            EMBER TABLE
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Visual Logo Crest */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={current.width}
          height={current.height}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-500 hover:scale-105 filter drop-shadow-[0_4px_16px_rgba(212,175,55,0.4)]"
        >
          <defs>
            <linearGradient id="goldGradFull" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2B2" />
              <stop offset="35%" stopColor="#E5B84A" />
              <stop offset="70%" stopColor="#9C6F19" />
              <stop offset="100%" stopColor="#FBE089" />
            </linearGradient>
            <linearGradient id="clocheGradFull" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFF9DC" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#7E550B" />
            </linearGradient>
            <linearGradient id="leafGradFull" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7CB342" />
              <stop offset="100%" stopColor="#33691E" />
            </linearGradient>
          </defs>

          {/* Outer Gold Embellished Circle */}
          <circle cx="100" cy="100" r="92" fill="#0c0c0e" stroke="url(#goldGradFull)" strokeWidth="3.5" />
          <circle cx="100" cy="100" r="85" stroke="url(#goldGradFull)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

          {/* Fork */}
          <path
            d="M50 115 L50 78 C50 72 52 70 55 70 C58 70 60 72 60 78 L60 115 M55 70 L55 60 M51 65 L51 60 M59 65 L59 60 M55 115 L55 145"
            stroke="url(#goldGradFull)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Knife */}
          <path
            d="M145 62 C145 62 150 72 150 90 C150 108 145 120 145 120 L145 145"
            stroke="url(#goldGradFull)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Chef Hat */}
          <path
            d="M80 62 C68 56 70 38 84 40 C88 28 108 26 114 36 C124 32 134 42 128 56 C134 62 126 70 120 68 L80 68 Z"
            fill="url(#goldGradFull)"
            opacity="0.95"
          />
          <rect x="83" y="66" width="34" height="6" rx="2" fill="url(#goldGradFull)" />

          {/* Cloche Dome */}
          <path
            d="M72 110 C72 86 84 76 100 76 C116 76 128 86 128 110 Z"
            fill="url(#clocheGradFull)"
          />
          <circle cx="100" cy="74" r="4.5" fill="url(#goldGradFull)" />
          <line x1="66" y1="110" x2="134" y2="110" stroke="url(#goldGradFull)" strokeWidth="4.5" strokeLinecap="round" />

          {/* Steam Wisps */}
          <path
            d="M95 70 C93 64 97 60 95 54 M105 70 C107 64 103 60 105 54"
            stroke="url(#goldGradFull)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.75"
          />

          {/* Green Herb Leaves */}
          <path d="M62 122 C56 112 68 110 74 116 C70 126 63 125 62 122 Z" fill="url(#leafGradFull)" />
          <path d="M138 122 C144 112 132 110 126 116 C130 126 137 125 138 122 Z" fill="url(#leafGradFull)" />

          {/* Ember Table banner text */}
          <path d="M48 136 Q100 148 152 136 L148 160 Q100 172 52 160 Z" fill="#15120e" stroke="url(#goldGradFull)" strokeWidth="1.5" />
          <text
            x="100"
            y="152"
            textAnchor="middle"
            fill="url(#goldGradFull)"
            fontSize="10"
            fontFamily="'Cinzel', serif"
            fontWeight="bold"
            letterSpacing="1.5"
          >
            EMBER TABLE
          </text>
        </svg>
      </div>

      {/* Typography Brand Lockup */}
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1.5 leading-none">
          <span className="font-serif italic text-gold-gradient text-xs font-light">The</span>
          <span className={`font-brand font-bold tracking-wider text-gold-gradient uppercase ${current.text}`}>
            Ember<span className="text-[#ff9100]">T</span>able
          </span>
        </div>
        {showSubtitle && (
          <div className={`tracking-[0.25em] text-[#d4af37]/80 uppercase font-sans font-medium mt-1 ${current.sub}`}>
            Food · People · Good Times
          </div>
        )}
      </div>
    </div>
  );
};
