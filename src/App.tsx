/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { LoadingScreen } from './components/common/LoadingScreen';
import { SEO, ROUTE_SEO } from './components/common/SEO';

// Pages
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { MenuItemDetailPage } from './pages/MenuItemDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { ReservationPage } from './pages/ReservationPage';
import { AboutPage } from './pages/AboutPage';
import { ChefsPage } from './pages/ChefsPage';
import { GalleryPage } from './pages/GalleryPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostDetailPage } from './pages/BlogPostDetailPage';
import { ContactPage } from './pages/ContactPage';
import { OffersPage } from './pages/OffersPage';
import { EventsPage } from './pages/EventsPage';
import { CateringPage } from './pages/CateringPage';
import { PrivateDiningPage } from './pages/PrivateDiningPage';
import { AuthPages } from './pages/AuthPages';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';

const AppContent: React.FC = () => {
  const { currentRoute, navigate } = useApp();
  const [initialLoading, setInitialLoading] = useState(true);

  // Normalize route and extract slug if needed
  const path = currentRoute.split('?')[0];

  const isAdminRoute = path.startsWith('/admin');

  // Enable Lenis Smooth Scroll with GSAP ScrollTrigger for customer routes
  useSmoothScroll(!isAdminRoute);

  const currentSEO = ROUTE_SEO[path] || ROUTE_SEO['/'];

  // Match routes
  const renderRoute = () => {
    if (path === '/' || path === '') return <HomePage />;
    if (path === '/menu') return <MenuPage />;
    if (path.startsWith('/menu/')) {
      const slug = path.replace('/menu/', '');
      return <MenuItemDetailPage slug={slug} />;
    }
    if (path === '/cart') return <CartPage />;
    if (path === '/checkout') return <CheckoutPage />;
    if (path === '/order-success') return <OrderSuccessPage />;
    if (path === '/order-tracking') return <OrderTrackingPage />;
    if (path === '/reservation') return <ReservationPage />;
    if (path === '/about') return <AboutPage />;
    if (path === '/chefs') return <ChefsPage />;
    if (path === '/gallery') return <GalleryPage />;
    if (path === '/blog') return <BlogPage />;
    if (path.startsWith('/blog/')) {
      const slug = path.replace('/blog/', '');
      return <BlogPostDetailPage slug={slug} />;
    }
    if (path === '/contact') return <ContactPage />;
    if (path === '/offers') return <OffersPage />;
    if (path === '/events') return <EventsPage />;
    if (path === '/catering') return <CateringPage />;
    if (path === '/private-dining') return <PrivateDiningPage />;
    if (path === '/login') return <AuthPages view="login" />;
    if (path === '/register') return <AuthPages view="register" />;
    if (path === '/forgot-password') return <AuthPages view="forgot-password" />;
    if (path === '/profile') return <AuthPages view="profile" />;
    if (path === '/orders') return <AuthPages view="orders" />;
    if (path === '/favorites') return <AuthPages view="favorites" />;
    if (path === '/admin/login') return <AdminLogin />;
    if (path === '/admin') return <AdminDashboard />;

    // 404 Fallback
    return (
      <div className="min-h-screen bg-[#08090b] text-[#e2e8f0] pt-36 pb-24 px-6 flex items-center justify-center text-center">
        <div className="max-w-md glass-card p-10 rounded-2xl border border-white/10 space-y-4">
          <span className="font-mono text-4xl text-gold-gradient font-bold">404</span>
          <h2 className="font-serif text-2xl text-white">Course Not Found</h2>
          <p className="text-xs text-slate-400">
            The culinary destination you are seeking has retired from the menu or moved.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-[#d4af37] text-[#0b0c10] text-xs font-bold uppercase rounded font-brand"
          >
            Return to Hearth Home
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#08090b] text-[#e2e8f0] selection:bg-[#d4af37]/30 selection:text-white">
      {/* Dynamic SEO Meta Tags & OpenGraph Synchronizer */}
      <SEO
        title={currentSEO.title}
        description={currentSEO.description}
        keywords={currentSEO.keywords}
        ogImage={currentSEO.ogImage}
      />

      {/* Premium Initial Loading Experience */}
      {initialLoading && <LoadingScreen onComplete={() => setInitialLoading(false)} />}

      {/* Navigation Header (Client Facing Only) */}
      {!isAdminRoute && <Navbar />}

      {/* Main View Port */}
      <div className="flex-1">{renderRoute()}</div>

      {/* Footer (Client Facing Only) */}
      {!isAdminRoute && <Footer />}

      {/* Floating System Toasts */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
