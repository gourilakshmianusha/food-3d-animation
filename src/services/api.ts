import {
  MenuItem,
  Order,
  Reservation,
  Chef,
  BlogPost,
  GalleryItem,
  Testimonial,
  Offer,
  EventItem,
  CateringPackage,
  ContactMessage,
  SiteSettings,
  UserProfile,
  Food3DAsset,
} from '../types';
import {
  INITIAL_MENU_ITEMS,
  INITIAL_CHEFS,
  INITIAL_BLOG_POSTS,
  INITIAL_GALLERY,
  INITIAL_TESTIMONIALS,
  INITIAL_OFFERS,
  INITIAL_EVENTS,
  INITIAL_CATERING_PACKAGES,
  INITIAL_SITE_SETTINGS,
} from '../data/seedData';

// Local storage keys
const STORAGE_PREFIX = 'ember_table_';

function getStored<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Storage get error', e);
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage set error', e);
  }
}

// Initial seed orders
const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1041',
    orderNumber: 'ET-8924',
    customerName: 'Marcus Sterling',
    customerEmail: 'marcus@sterlingcritics.com',
    customerPhone: '+1 (415) 309-8812',
    deliveryAddress: '742 Montgomery St, Penthouse B, San Francisco, CA',
    items: [
      { itemId: 'dish-1', name: 'Smoked Woodfire Wagyu Ribeye', price: 94, quantity: 2, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80' },
      { itemId: 'dish-8', name: 'Glacier Smoked Ember Old Fashioned', price: 22, quantity: 2, image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80' },
    ],
    subtotal: 232,
    tax: 19.14,
    deliveryFee: 0,
    discount: 15,
    couponCode: 'EMBERFIRST',
    total: 236.14,
    status: 'Preparing',
    paymentMethod: 'Credit Card',
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    estimatedDeliveryTime: '30-40 mins',
  },
  {
    id: 'ord-1040',
    orderNumber: 'ET-8923',
    customerName: 'Elena Rostova',
    customerEmail: 'elena@sweetember.io',
    customerPhone: '+1 (415) 991-4450',
    deliveryAddress: '120 Green St, Apt 4C, San Francisco, CA',
    items: [
      { itemId: 'dish-2', name: 'Perigord Black Truffle Tagliolini', price: 48, quantity: 1, image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281724?auto=format&fit=crop&w=400&q=80' },
      { itemId: 'dish-7', name: 'Valrhona Chocolate Sphere', price: 26, quantity: 1, image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80' },
    ],
    subtotal: 74,
    tax: 6.11,
    deliveryFee: 6.5,
    discount: 0,
    total: 86.61,
    status: 'Out for Delivery',
    paymentMethod: 'Apple Pay',
    createdAt: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
    estimatedDeliveryTime: 'Arriving in 10 mins',
  },
];

const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-501',
    customerName: 'Aurelia Chen',
    email: 'aurelia@chenstudios.design',
    phone: '+1 (415) 552-9844',
    date: '2026-10-10',
    time: '19:30',
    guests: 4,
    specialRequest: 'Seating near the open hearth view if possible, celebrating an anniversary.',
    status: 'Confirmed',
    tableNumber: 'Hearth Table 4',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'res-502',
    customerName: 'Dr. Vikram Malhotra',
    email: 'malhotra@oxfordheritage.edu',
    phone: '+1 (415) 880-1290',
    date: '2026-10-12',
    time: '20:00',
    guests: 2,
    specialRequest: 'Wine sommelier pairing requested.',
    status: 'Confirmed',
    tableNumber: 'Wine Alcove 2',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'res-503',
    customerName: 'Jonathan Davis',
    email: 'jdavis@venturecap.com',
    phone: '+1 (415) 774-2100',
    date: '2026-10-15',
    time: '18:00',
    guests: 8,
    specialRequest: 'Private dining room tasting menu inquiry.',
    status: 'Pending',
    createdAt: new Date().toISOString(),
  },
];

export const api = {
  // Menu CRUD
  getMenuItems: (): MenuItem[] => getStored('menu_items', INITIAL_MENU_ITEMS),
  saveMenuItem: (item: MenuItem): MenuItem => {
    const list = api.getMenuItems();
    const index = list.findIndex((i) => i.id === item.id);
    let updated: MenuItem[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = item;
    } else {
      updated = [item, ...list];
    }
    setStored('menu_items', updated);
    return item;
  },
  deleteMenuItem: (id: string): void => {
    const list = api.getMenuItems().filter((i) => i.id !== id);
    setStored('menu_items', list);
  },

  // Orders CRUD
  getOrders: (): Order[] => getStored('orders', INITIAL_ORDERS),
  createOrder: (order: Order): Order => {
    const list = api.getOrders();
    const updated = [order, ...list];
    setStored('orders', updated);
    return order;
  },
  updateOrderStatus: (orderId: string, status: Order['status']): Order | null => {
    const list = api.getOrders();
    const index = list.findIndex((o) => o.id === orderId);
    if (index === -1) return null;
    list[index].status = status;
    setStored('orders', list);
    return list[index];
  },

  // Reservations CRUD
  getReservations: (): Reservation[] => getStored('reservations', INITIAL_RESERVATIONS),
  createReservation: (res: Reservation): Reservation => {
    const list = api.getReservations();
    const updated = [res, ...list];
    setStored('reservations', updated);
    return res;
  },
  updateReservationStatus: (id: string, status: Reservation['status'], tableNumber?: string): Reservation | null => {
    const list = api.getReservations();
    const index = list.findIndex((r) => r.id === id);
    if (index === -1) return null;
    list[index].status = status;
    if (tableNumber) list[index].tableNumber = tableNumber;
    setStored('reservations', list);
    return list[index];
  },

  // Chefs CRUD
  getChefs: (): Chef[] => getStored('chefs', INITIAL_CHEFS),
  saveChef: (chef: Chef): Chef => {
    const list = api.getChefs();
    const index = list.findIndex((c) => c.id === chef.id);
    let updated: Chef[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = chef;
    } else {
      updated = [...list, chef];
    }
    setStored('chefs', updated);
    return chef;
  },
  deleteChef: (id: string): void => {
    setStored('chefs', api.getChefs().filter((c) => c.id !== id));
  },

  // Blogs CRUD
  getBlogs: (): BlogPost[] => getStored('blogs', INITIAL_BLOG_POSTS),
  saveBlog: (blog: BlogPost): BlogPost => {
    const list = api.getBlogs();
    const index = list.findIndex((b) => b.id === blog.id);
    let updated: BlogPost[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = blog;
    } else {
      updated = [blog, ...list];
    }
    setStored('blogs', updated);
    return blog;
  },
  deleteBlog: (id: string): void => {
    setStored('blogs', api.getBlogs().filter((b) => b.id !== id));
  },

  // Gallery CRUD
  getGallery: (): GalleryItem[] => getStored('gallery', INITIAL_GALLERY),
  saveGalleryItem: (item: GalleryItem): GalleryItem => {
    const list = api.getGallery();
    const index = list.findIndex((g) => g.id === item.id);
    let updated: GalleryItem[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = item;
    } else {
      updated = [item, ...list];
    }
    setStored('gallery', updated);
    return item;
  },
  deleteGalleryItem: (id: string): void => {
    setStored('gallery', api.getGallery().filter((g) => g.id !== id));
  },

  // Testimonials CRUD
  getTestimonials: (): Testimonial[] => getStored('testimonials', INITIAL_TESTIMONIALS),
  saveTestimonial: (item: Testimonial): Testimonial => {
    const list = api.getTestimonials();
    const index = list.findIndex((t) => t.id === item.id);
    let updated: Testimonial[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = item;
    } else {
      updated = [item, ...list];
    }
    setStored('testimonials', updated);
    return item;
  },
  deleteTestimonial: (id: string): void => {
    setStored('testimonials', api.getTestimonials().filter((t) => t.id !== id));
  },

  // Offers CRUD
  getOffers: (): Offer[] => getStored('offers', INITIAL_OFFERS),
  saveOffer: (offer: Offer): Offer => {
    const list = api.getOffers();
    const index = list.findIndex((o) => o.id === offer.id);
    let updated: Offer[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = offer;
    } else {
      updated = [offer, ...list];
    }
    setStored('offers', updated);
    return offer;
  },
  deleteOffer: (id: string): void => {
    setStored('offers', api.getOffers().filter((o) => o.id !== id));
  },

  // Events CRUD
  getEvents: (): EventItem[] => getStored('events', INITIAL_EVENTS),
  saveEvent: (event: EventItem): EventItem => {
    const list = api.getEvents();
    const index = list.findIndex((e) => e.id === event.id);
    let updated: EventItem[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = event;
    } else {
      updated = [event, ...list];
    }
    setStored('events', updated);
    return event;
  },
  deleteEvent: (id: string): void => {
    setStored('events', api.getEvents().filter((e) => e.id !== id));
  },

  // Catering
  getCateringPackages: (): CateringPackage[] => getStored('catering', INITIAL_CATERING_PACKAGES),

  // Site Settings
  getSiteSettings: (): SiteSettings => getStored('site_settings', INITIAL_SITE_SETTINGS),
  updateSiteSettings: (settings: Partial<SiteSettings>): SiteSettings => {
    const current = api.getSiteSettings();
    const updated = { ...current, ...settings };
    setStored('site_settings', updated);
    return updated;
  },

  // Contact Messages
  getContactMessages: (): ContactMessage[] => getStored('contact_messages', [
    {
      id: 'msg-1',
      name: 'Lady Eleanor Vance',
      email: 'eleanor@vanceestate.co.uk',
      phone: '+44 20 7946 0912',
      subject: 'Private buy-out for charity gala in November',
      message: 'We would love to discuss reserving the full dining room and courtyard for 80 guests.',
      date: '2026-10-02',
      status: 'Unread',
    }
  ]),
  submitContactMessage: (msg: Omit<ContactMessage, 'id' | 'date' | 'status'>): ContactMessage => {
    const current = api.getContactMessages();
    const newMsg: ContactMessage = {
      ...msg,
      id: 'msg-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: 'Unread',
    };
    setStored('contact_messages', [newMsg, ...current]);
    return newMsg;
  },

  // 3D Image Library CRUD (Section 31)
  get3DAssets: (): Food3DAsset[] => getStored('food_3d_assets', [
    {
      id: 'asset-1',
      title: 'A5 Miyazaki Wagyu Plated Cut',
      category: 'Steak & Meats',
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      type: 'dish',
      shadowType: 'dramatic',
      scale: 1,
      rotation: 0,
      isTransparent: true,
    },
    {
      id: 'asset-2',
      title: 'Perigord Black Truffle Tagliolini',
      category: 'Pasta',
      imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281724?auto=format&fit=crop&w=800&q=80',
      type: 'dish',
      shadowType: 'soft',
      scale: 1,
      rotation: 0,
      isTransparent: true,
    },
    {
      id: 'asset-3',
      title: 'Oak-Charred Neapolitan Pizza',
      category: 'Pizza',
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      type: 'dish',
      shadowType: 'contact',
      scale: 1,
      rotation: 0,
      isTransparent: true,
    },
    {
      id: 'asset-4',
      title: 'The Ember Smoked Gold Burger',
      category: 'Burgers',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      type: 'dish',
      shadowType: 'soft',
      scale: 1,
      rotation: 0,
      isTransparent: true,
    },
    {
      id: 'asset-5',
      title: 'Smoked Valrhona Chocolate Sphere',
      category: 'Desserts',
      imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
      type: 'dish',
      shadowType: 'dramatic',
      scale: 1,
      rotation: 0,
      isTransparent: true,
    },
    {
      id: 'asset-6',
      title: 'Wood-Grilled Chilean Sea Bass',
      category: 'Continental',
      imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
      type: 'dish',
      shadowType: 'soft',
      scale: 1,
      rotation: 0,
      isTransparent: true,
    },
  ]),
  save3DAsset: (asset: Food3DAsset): Food3DAsset => {
    const list = api.get3DAssets();
    const idx = list.findIndex((a) => a.id === asset.id);
    let updated: Food3DAsset[];
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = asset;
    } else {
      updated = [asset, ...list];
    }
    setStored('food_3d_assets', updated);
    return asset;
  },
  delete3DAsset: (id: string): void => {
    setStored('food_3d_assets', api.get3DAssets().filter((a) => a.id !== id));
  },
  assign3DImageToMenuItem: (menuItemId: string, threeDImageUrl: string): void => {
    const items = api.getMenuItems();
    const item = items.find((i) => i.id === menuItemId);
    if (item) {
      item.threeDImage = threeDImageUrl;
      api.saveMenuItem(item);
    }
  },
};
