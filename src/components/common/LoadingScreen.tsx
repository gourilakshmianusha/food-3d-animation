import React, { useEffect, useState } from 'react';
import { Logo } from '../brand/Logo';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [fadeState, setFadeState] = useState<'visible' | 'fading' | 'hidden'>('visible');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setFadeState('fading');
          setTimeout(() => {
            setFadeState('hidden');
            onComplete();
          }, 600);
          return 100;
        }
        const step = Math.floor(Math.random() * 15) + 10;
        return Math.min(100, prev + step);
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (fadeState === 'hidden') return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#08090b] transition-opacity duration-700 ${
        fadeState === 'fading' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center max-w-sm px-6 text-center animate-in fade-in duration-500">
        {/* Animated Brand Medallion */}
        <div className="mb-6 transform transition-transform duration-700 hover:scale-105">
          <Logo size="lg" variant="badge" />
        </div>

        <h2 className="font-brand text-2xl font-bold tracking-wider text-gold-gradient uppercase mb-2">
          The Ember Table
        </h2>

        <p className="text-xs uppercase tracking-[0.25em] text-[#d4af37]/80 font-medium mb-8">
          Preparing your sensory experience...
        </p>

        {/* Progress Bar */}
        <div className="w-56 h-[3px] bg-white/10 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-[#e65100] via-[#d4af37] to-[#fff2b2] transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-[11px] text-slate-500 font-mono mt-3 tabular-nums">
          {progress}%
        </span>
      </div>
    </div>
  );
};
