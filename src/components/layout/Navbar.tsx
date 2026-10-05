import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../brand/Logo';
import { ShoppingBag, Calendar, User, Menu as MenuIcon, X, Shield } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentRoute, navigate, cart, user, isAdmin } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  const navLinks = [
    { label: 'Menu', route: '/menu' },
    { label: 'About', route: '/about' },
    { label: 'Chefs', route: '/chefs' },
    { label: 'Gallery', route: '/gallery' },
    { label: 'Journal', route: '/blog' },
    { label: 'Private Dining', route: '/private-dining' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#08090b]/90 backdrop-blur-md border-b border-white/5 py-3 shadow-2xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark / Emblem Logo */}
        <div
          onClick={() => navigate('/')}
          className="cursor-pointer transition-opacity hover:opacity-90 flex items-center"
        >
          <Logo size="sm" showSubtitle={false} />
        </div>

        {/* Zone 2: 4-6 Clean Text Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium tracking-wide text-slate-300">
          {navLinks.map((link) => {
            const isActive = currentRoute === link.route;
            return (
              <button
                key={link.route}
                onClick={() => navigate(link.route)}
                className={`relative py-1 transition-colors whitespace-nowrap ${
                  isActive ? 'text-[#d4af37]' : 'hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#d4af37] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 Primary Actions & Controls */}
        <div className="flex items-center gap-3">
          {/* Cart Affordance */}
          <button
            onClick={() => navigate('/cart')}
            className="relative p-2 text-slate-200 hover:text-[#d4af37] transition-colors rounded-lg hover:bg-white/5 flex items-center gap-1.5"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#d4af37] text-[#0b0c10] text-[11px] font-bold w-4 h-4 rounded-full flex items-center justify-center tabular-nums">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Table Reservation CTA */}
          <button
            onClick={() => navigate('/reservation')}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wider uppercase text-[#0b0c10] bg-[#d4af37] hover:bg-[#e5be49] transition-all rounded shadow-md hover:shadow-lg hover:scale-[1.02] whitespace-nowrap"
          >
            <Calendar className="w-3.5 h-3.5" />
            Reserve Table
          </button>

          {/* User / Profile or Admin shortcut */}
          <button
            onClick={() => {
              if (isAdmin) navigate('/admin');
              else if (user) navigate('/profile');
              else navigate('/login');
            }}
            className="p-2 text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5 hidden md:flex items-center gap-1"
            title={isAdmin ? 'Admin Console' : user ? user.name : 'Sign In'}
          >
            {isAdmin ? <Shield className="w-4 h-4 text-[#d4af37]" /> : <User className="w-4 h-4" />}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bg-[#0b0c10]/95 backdrop-blur-xl border-b border-white/10 px-6 py-6 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-4">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <button
                key={link.route}
                onClick={() => {
                  navigate(link.route);
                  setMobileMenuOpen(false);
                }}
                className={`text-left text-base font-medium py-2 transition-colors ${
                  currentRoute === link.route ? 'text-[#d4af37]' : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => {
                navigate('/contact');
                setMobileMenuOpen(false);
              }}
              className="text-left text-base font-medium py-2 text-slate-300 hover:text-white"
            >
              Contact & Hours
            </button>
            <button
              onClick={() => {
                navigate('/offers');
                setMobileMenuOpen(false);
              }}
              className="text-left text-base font-medium py-2 text-slate-300 hover:text-white"
            >
              Exclusive Offers
            </button>
            <button
              onClick={() => {
                navigate('/events');
                setMobileMenuOpen(false);
              }}
              className="text-left text-base font-medium py-2 text-slate-300 hover:text-white"
            >
              Private Events
            </button>
            <button
              onClick={() => {
                navigate('/catering');
                setMobileMenuOpen(false);
              }}
              className="text-left text-base font-medium py-2 text-slate-300 hover:text-white"
            >
              Luxury Catering
            </button>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <button
              onClick={() => {
                navigate('/reservation');
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 text-center text-xs font-semibold tracking-wider uppercase text-[#0b0c10] bg-[#d4af37] rounded font-brand"
            >
              Book a Table
            </button>
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <button
                onClick={() => {
                  navigate(isAdmin ? '/admin' : user ? '/profile' : '/login');
                  setMobileMenuOpen(false);
                }}
                className="hover:text-white flex items-center gap-1.5"
              >
                {isAdmin ? 'Admin Console' : user ? `Account: ${user.name}` : 'Sign In / Register'}
              </button>
              <button
                onClick={() => {
                  navigate('/admin/login');
                  setMobileMenuOpen(false);
                }}
                className="text-[#d4af37]/80 hover:text-[#d4af37]"
              >
                Executive Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
