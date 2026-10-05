import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MenuItem,
  CartItem,
  Order,
  Reservation,
  Offer,
  UserProfile,
  SiteSettings,
} from '../types';
import { api } from '../services/api';

interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  // Navigation
  currentRoute: string;
  navigate: (route: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity?: number, instructions?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  appliedCoupon: Offer | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  deliveryFee: number;
  finalTotal: number;

  // Auth & Profile
  user: UserProfile | null;
  isAdmin: boolean;
  login: (email: string, role?: 'customer' | 'admin') => void;
  logout: () => void;
  register: (name: string, email: string, phone: string) => void;

  // Favorites
  favorites: string[];
  toggleFavorite: (itemId: string) => void;

  // Site Settings
  siteSettings: SiteSettings;
  updateSettings: (settings: Partial<SiteSettings>) => void;

  // Orders & Reservations
  orders: Order[];
  placeOrder: (orderData: Partial<Order>) => Order;
  reservations: Reservation[];
  bookReservation: (resData: Partial<Reservation>) => Reservation;
  refreshData: () => void;

  // Toasts
  toasts: Toast[];
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Simple clean client-side routing
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (route: string) => {
    window.history.pushState({}, '', route);
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ember_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Offer | null>(null);

  useEffect(() => {
    localStorage.setItem('ember_cart', JSON.stringify(cart));
  }, [cart]);

  // User state
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('ember_user');
      return saved
        ? JSON.parse(saved)
        : {
            id: 'guest-1',
            name: 'Julian Guest',
            email: 'guest@theembertable.com',
            phone: '+1 (415) 555-0199',
            role: 'customer',
            savedAddresses: ['450 Mission St, Apt 18B, San Francisco, CA'],
            favoriteItemIds: ['dish-1', 'dish-2', 'dish-7'],
          };
    } catch {
      return null;
    }
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('ember_admin_auth') === 'true';
  });

  // Settings
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(api.getSiteSettings());

  // Orders & Reservations state
  const [orders, setOrders] = useState<Order[]>(api.getOrders());
  const [reservations, setReservations] = useState<Reservation[]>(api.getReservations());

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ember_favs');
      return saved ? JSON.parse(saved) : ['dish-1', 'dish-2', 'dish-7'];
    } catch {
      return ['dish-1', 'dish-2', 'dish-7'];
    }
  });

  const toggleFavorite = (itemId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId];
      localStorage.setItem('ember_favs', JSON.stringify(next));
      showToast(
        prev.includes(itemId) ? 'Removed from Favorites' : 'Saved to Favorites',
        'Your culinary curation has been updated.',
        'info'
      );
      return next;
    });
  };

  // Toast system
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart operations
  const addToCart = (item: MenuItem, quantity: number = 1, instructions?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((ci) => ci.item.id === item.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
          specialInstructions: instructions || next[existingIndex].specialInstructions,
        };
        return next;
      }
      return [...prev, { item, quantity, specialInstructions: instructions }];
    });
    showToast('Added to Cart', `${quantity}x ${item.name} added to your dining order.`, 'success');
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.item.id !== itemId));
    showToast('Item Removed', 'The item was removed from your cart.', 'info');
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((ci) => (ci.item.id === itemId ? { ...ci, quantity } : ci))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Coupon calculations
  const subtotal = cart.reduce((acc, curr) => {
    const price = curr.item.discountPrice ?? curr.item.price;
    return acc + price * curr.quantity;
  }, 0);

  const discountAmount = appliedCoupon
    ? appliedCoupon.discountType === 'percentage'
      ? (subtotal * appliedCoupon.discountValue) / 100
      : appliedCoupon.discountValue
    : 0;

  const afterDiscount = Math.max(0, subtotal - discountAmount);
  const taxAmount = +(afterDiscount * siteSettings.taxRate).toFixed(2);
  const deliveryFee =
    afterDiscount >= siteSettings.freeDeliveryThreshold || cart.length === 0
      ? 0
      : siteSettings.deliveryFee;
  const finalTotal = +(afterDiscount + taxAmount + deliveryFee).toFixed(2);

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const clean = code.trim().toUpperCase();
    const offers = api.getOffers();
    const found = offers.find((o) => o.code.toUpperCase() === clean && o.isActive);

    if (!found) {
      return { success: false, message: 'Invalid or expired privilege coupon code.' };
    }
    if (subtotal < found.minOrderValue) {
      return {
        success: false,
        message: `Minimum order value of $${found.minOrderValue} required for this code.`,
      };
    }
    setAppliedCoupon(found);
    showToast('Privilege Code Applied', `${found.title} activated successfully.`, 'success');
    return { success: true, message: `Privilege code applied: ${found.title}` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Privilege Removed', 'Discount coupon was removed.', 'info');
  };

  // Orders
  const placeOrder = (orderData: Partial<Order>): Order => {
    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber: 'ET-' + Math.floor(1000 + Math.random() * 9000),
      customerName: orderData.customerName || user?.name || 'Valued Guest',
      customerEmail: orderData.customerEmail || user?.email || 'guest@theembertable.com',
      customerPhone: orderData.customerPhone || user?.phone || '+1 (415) 890-3420',
      deliveryAddress: orderData.deliveryAddress || '428 Embarcadero Way, SF',
      items: cart.map((c) => ({
        itemId: c.item.id,
        name: c.item.name,
        price: c.item.discountPrice ?? c.item.price,
        quantity: c.quantity,
        image: c.item.image,
      })),
      subtotal,
      tax: taxAmount,
      deliveryFee,
      discount: discountAmount,
      couponCode: appliedCoupon?.code,
      total: finalTotal,
      status: 'Confirmed',
      paymentMethod: orderData.paymentMethod || 'Credit Card',
      createdAt: new Date().toISOString(),
      estimatedDeliveryTime: '35 - 45 mins',
    };

    const saved = api.createOrder(newOrder);
    setOrders((prev) => [saved, ...prev]);
    clearCart();
    showToast('Order Placed Successfully', `Order #${saved.orderNumber} is now with our culinary brigade!`, 'success');
    return saved;
  };

  // Reservations
  const bookReservation = (resData: Partial<Reservation>): Reservation => {
    const newRes: Reservation = {
      id: 'res-' + Date.now(),
      customerName: resData.customerName || user?.name || 'Valued Guest',
      email: resData.email || user?.email || 'guest@theembertable.com',
      phone: resData.phone || user?.phone || '+1 (415) 890-3420',
      date: resData.date || new Date().toISOString().split('T')[0],
      time: resData.time || '19:00',
      guests: resData.guests || 2,
      specialRequest: resData.specialRequest || '',
      status: 'Confirmed',
      tableNumber: 'Main Hearth View',
      createdAt: new Date().toISOString(),
    };

    const saved = api.createReservation(newRes);
    setReservations((prev) => [saved, ...prev]);
    showToast('Table Reserved', `Your table for ${newRes.guests} on ${newRes.date} at ${newRes.time} is confirmed.`, 'success');
    return saved;
  };

  // Auth
  const login = (email: string, role: 'customer' | 'admin' = 'customer') => {
    if (role === 'admin') {
      setIsAdmin(true);
      localStorage.setItem('ember_admin_auth', 'true');
      showToast('Admin Access Granted', 'Welcome to The Ember Table Executive Console.', 'success');
      navigate('/admin');
      return;
    }

    const newUser: UserProfile = {
      id: 'usr-' + Date.now(),
      name: email.split('@')[0],
      email,
      phone: '+1 (415) 555-0182',
      role: 'customer',
      savedAddresses: ['428 Embarcadero Way, San Francisco, CA'],
      favoriteItemIds: ['dish-1', 'dish-2'],
    };
    setUser(newUser);
    localStorage.setItem('ember_user', JSON.stringify(newUser));
    showToast('Welcome Back', `Signed in as ${email}`, 'success');
    navigate('/profile');
  };

  const register = (name: string, email: string, phone: string) => {
    const newUser: UserProfile = {
      id: 'usr-' + Date.now(),
      name,
      email,
      phone,
      role: 'customer',
      savedAddresses: [],
      favoriteItemIds: [],
    };
    setUser(newUser);
    localStorage.setItem('ember_user', JSON.stringify(newUser));
    showToast('Account Created', 'Welcome to The Ember Table culinary society.', 'success');
    navigate('/profile');
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('ember_user');
    localStorage.removeItem('ember_admin_auth');
    showToast('Signed Out', 'You have been safely signed out.', 'info');
    navigate('/');
  };

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    const updated = api.updateSiteSettings(newSettings);
    setSiteSettings(updated);
    showToast('Settings Updated', 'Restaurant site configuration saved.', 'success');
  };

  const refreshData = () => {
    setOrders(api.getOrders());
    setReservations(api.getReservations());
    setSiteSettings(api.getSiteSettings());
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        navigate,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        discountAmount,
        taxAmount,
        deliveryFee,
        finalTotal,
        user,
        isAdmin,
        login,
        logout,
        register,
        favorites,
        toggleFavorite,
        siteSettings,
        updateSettings,
        orders,
        placeOrder,
        reservations,
        bookReservation,
        refreshData,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
