import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../../components/brand/Logo';
import { Shield, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { login, navigate } = useApp();
  const [email, setEmail] = useState('executive@theembertable.com');
  const [passcode, setPasscode] = useState('ember2026');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && passcode === 'ember2026') {
      login(email, 'admin');
    } else {
      setError('Invalid executive credentials. Default passcode is ember2026.');
    }
  };

  return (
    <div className="min-h-screen bg-[#060709] text-[#e2e8f0] flex items-center justify-center p-6">
      <div className="max-w-md w-full glass-card p-8 sm:p-10 rounded-2xl border border-gold-subtle space-y-6 shadow-2xl">
        <div className="text-center space-y-3">
          <div className="inline-block mx-auto mb-2">
            <Logo size="md" variant="badge" />
          </div>
          <span className="text-[11px] uppercase tracking-widest text-[#d4af37] font-semibold block">
            Executive Operations Console
          </span>
          <h1 className="font-serif text-3xl text-white">Management Portal</h1>
          <p className="text-xs text-slate-400">
            Secure administrative control over orders, reservations, live menu items, and culinary journals.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Administrative Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Access Passcode</label>
            <input
              type="password"
              required
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Default development passcode: <strong className="text-slate-300">ember2026</strong>
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#d4af37] hover:bg-[#e5be49] text-[#0b0c10] text-xs font-bold uppercase tracking-widest rounded font-brand transition-all shadow-xl flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>Authenticate Executive Session</span>
          </button>
        </form>

        <div className="pt-4 border-t border-white/5 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Return to Public Dining Website
          </button>
        </div>
      </div>
    </div>
  );
};
