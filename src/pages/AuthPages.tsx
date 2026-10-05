import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Lock,
  LogOut,
  Mail,
  Phone,
  Shield,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface AuthPagesProps {
  view: 'login' | 'register' | 'forgot-password' | 'profile' | 'orders' | 'favorites';
}

export const AuthPages: React.FC<AuthPagesProps> = ({ view }) => {
  const { user, login, logout, register, navigate, favorites, orders, siteSettings } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Active tab in profile
  const [profileTab, setProfileTab] = useState<'details' | 'orders' | 'favorites' | 'addresses'>(
    view === 'orders' ? 'orders' : view === 'favorites' ? 'favorites' : 'details'
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    login(email, 'customer');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    register(name, email, phone);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setResetSent(true);
  };

  // Login View
  if (view === 'login') {
    return (
      <div className="min-h-screen bg-[#08090b] text-[#e2e8f0] pt-28 pb-24 px-6 flex items-center justify-center">
        <div className="max-w-md w-full glass-card p-8 sm:p-10 rounded-2xl border border-gold-subtle space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
              Guest Society
            </span>
            <h1 className="font-serif text-3xl text-white">Sign In to The Hearth</h1>
            <p className="text-xs text-slate-400">
              Access your saved addresses, past cellar orders, and reservation status.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="guest@theembertable.com"
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-slate-400">Password</label>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-[11px] text-[#d4af37] hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#d4af37] hover:bg-[#e5be49] text-[#0b0c10] text-xs font-bold uppercase tracking-widest rounded font-brand transition-all shadow"
            >
              Sign In
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-400 border-t border-white/5 space-y-3">
            <p>
              New to The Ember Table?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-[#d4af37] hover:underline font-semibold"
              >
                Join the Society
              </button>
            </p>
            <p className="text-[11px] text-slate-500">
              Are you an executive staff member?{' '}
              <button
                onClick={() => navigate('/admin/login')}
                className="text-slate-300 hover:text-white underline"
              >
                Executive Portal
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Register View
  if (view === 'register') {
    return (
      <div className="min-h-screen bg-[#08090b] text-[#e2e8f0] pt-28 pb-24 px-6 flex items-center justify-center">
        <div className="max-w-md w-full glass-card p-8 sm:p-10 rounded-2xl border border-gold-subtle space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
              Membership
            </span>
            <h1 className="font-serif text-3xl text-white">Join the Registry</h1>
            <p className="text-xs text-slate-400">
              Enjoy complimentary seasonal dessert privileges and priority table reservations.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Marcus Sterling"
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="marcus@example.com"
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Mobile Telephone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (415) 890-3420"
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#d4af37] hover:bg-[#e5be49] text-[#0b0c10] text-xs font-bold uppercase tracking-widest rounded font-brand shadow"
            >
              Create Society Account
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-400 border-t border-white/5">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-[#d4af37] hover:underline font-semibold"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Forgot Password View
  if (view === 'forgot-password') {
    return (
      <div className="min-h-screen bg-[#08090b] text-[#e2e8f0] pt-28 pb-24 px-6 flex items-center justify-center">
        <div className="max-w-md w-full glass-card p-8 rounded-2xl border border-white/10 space-y-6 text-center">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
            Security
          </span>
          <h1 className="font-serif text-3xl text-white">Reset Credentials</h1>
          {resetSent ? (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                A verification link has been transmitted to <strong className="text-white">{email}</strong>.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2.5 bg-[#d4af37] text-[#0b0c10] text-xs font-bold uppercase rounded font-brand"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4 text-left">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 bg-[#d4af37] hover:bg-[#e5be49] text-[#0b0c10] text-xs font-bold uppercase tracking-wider rounded font-brand"
              >
                Send Password Reset Link
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Profile View (with Orders, Favorites, Addresses Tabs)
  const menuItems = api.getMenuItems();
  const favoriteItems = menuItems.filter((m) => favorites.includes(m.id));

  return (
    <div className="min-h-screen bg-[#08090b] text-[#e2e8f0] pt-28 pb-24 px-6">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#e65100] to-[#d4af37] flex items-center justify-center text-[#0b0c10] text-2xl font-bold font-brand shadow-lg">
              {user ? user.name.charAt(0).toUpperCase() : 'G'}
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-widest text-[#d4af37] font-semibold">
                Ember Registry Member
              </span>
              <h1 className="font-serif text-3xl text-white font-medium">
                {user ? user.name : 'Valued Guest'}
              </h1>
              <span className="text-xs text-slate-400">{user?.email || 'guest@theembertable.com'}</span>
            </div>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2 glass-dark text-slate-400 hover:text-rose-400 rounded text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto">
          {[
            { id: 'details', label: 'Profile Details', icon: User },
            { id: 'orders', label: `Order History (${orders.length})`, icon: ShoppingBag },
            { id: 'favorites', label: `Saved Favorites (${favorites.length})`, icon: Heart },
            { id: 'addresses', label: 'Delivery Residences', icon: MapPin },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setProfileTab(t.id as any)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                  profileTab === t.id
                    ? 'bg-[#d4af37] text-[#0b0c10] shadow'
                    : 'text-slate-400 hover:text-white glass-dark border border-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Profile Details */}
        {profileTab === 'details' && (
          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-gold-subtle max-w-2xl space-y-6">
            <h3 className="font-serif text-2xl text-white font-medium">Account Details</h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  defaultValue={user?.name || 'Julian Guest'}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  defaultValue={user?.email || 'guest@theembertable.com'}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Telephone</label>
                <input
                  type="tel"
                  defaultValue={user?.phone || '+1 (415) 555-0199'}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => alert('Profile credentials updated.')}
                  className="px-6 py-2.5 bg-[#d4af37] text-[#0b0c10] text-xs font-bold uppercase rounded font-brand"
                >
                  Save Profile Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Orders History */}
        {profileTab === 'orders' && (
          <div className="space-y-4">
            <h3 className="font-serif text-2xl text-white font-medium mb-4">Past & Active Orders</h3>
            {orders.length === 0 ? (
              <p className="text-xs text-slate-400">No previous orders recorded.</p>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-base">#{ord.orderNumber}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#d4af37]/20 text-[#d4af37]">
                        {ord.status}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 block">
                      Placed on {new Date(ord.createdAt).toLocaleDateString()} · {ord.paymentMethod}
                    </span>
                    <span className="text-xs text-slate-300 block">
                      {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-0 border-white/5 pt-3 md:pt-0">
                    <span className="font-serif font-bold text-xl text-gold-gradient tabular-nums">
                      ${ord.total.toFixed(2)}
                    </span>
                    <button
                      onClick={() => navigate(`/order-tracking?id=${ord.id}`)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded uppercase tracking-wider transition-colors"
                    >
                      Track Order
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Favorites */}
        {profileTab === 'favorites' && (
          <div className="space-y-4">
            <h3 className="font-serif text-2xl text-white font-medium mb-4">Saved Culinary Selections</h3>
            {favoriteItems.length === 0 ? (
              <p className="text-xs text-slate-400">You haven't saved any dishes yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {favoriteItems.map((dish) => (
                  <div
                    key={dish.id}
                    className="glass-card rounded-xl overflow-hidden border border-white/10 p-4 space-y-3"
                  >
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-36 object-cover rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-serif text-base text-white">{dish.name}</h4>
                      <span className="text-xs text-gold-gradient font-bold tabular-nums">
                        ${dish.discountPrice ?? dish.price}
                      </span>
                    </div>
                    <button
                      onClick={() => navigate(`/menu/${dish.slug}`)}
                      className="w-full py-2 bg-[#d4af37] text-[#0b0c10] text-xs font-bold uppercase rounded font-brand"
                    >
                      View Dish
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Addresses */}
        {profileTab === 'addresses' && (
          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/10 max-w-2xl space-y-6">
            <h3 className="font-serif text-2xl text-white font-medium">Saved Courier Residences</h3>
            <div className="space-y-3">
              {(user?.savedAddresses || ['428 Embarcadero Way, San Francisco, CA']).map((addr, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3 text-slate-200">
                    <MapPin className="w-4 h-4 text-[#d4af37] shrink-0" />
                    <span>{addr}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400">Primary</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
