import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
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
  ContactMessage,
  SiteSettings,
  OrderStatus,
} from '../../types';
import { INITIAL_CATEGORIES } from '../../data/seedData';
import { Logo } from '../../components/brand/Logo';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Calendar,
  BookOpen,
  Image,
  Award,
  Star,
  Tag,
  Mail,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Search,
  Eye,
  DollarSign,
  Users,
} from 'lucide-react';

type AdminTab =
  | 'overview'
  | 'orders'
  | 'menu'
  | 'reservations'
  | 'blogs'
  | 'gallery'
  | 'chefs'
  | 'testimonials'
  | 'offers'
  | 'messages'
  | 'settings';

export const AdminDashboard: React.FC = () => {
  const { isAdmin, logout, navigate, siteSettings, updateSettings, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Live state
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Modals state
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [isAddingMenu, setIsAddingMenu] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [isAddingBlog, setIsAddingBlog] = useState(false);

  const loadAll = () => {
    setMenuItems(api.getMenuItems());
    setOrders(api.getOrders());
    setReservations(api.getReservations());
    setBlogs(api.getBlogs());
    setGallery(api.getGallery());
    setChefs(api.getChefs());
    setTestimonials(api.getTestimonials());
    setOffers(api.getOffers());
    setMessages(api.getContactMessages());
  };

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }
    loadAll();
  }, [isAdmin]);

  // Order status updater
  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    api.updateOrderStatus(orderId, status);
    loadAll();
    showToast('Order Status Updated', `Order ${orderId} marked as ${status}.`, 'success');
  };

  // Reservation status updater
  const handleUpdateReservation = (id: string, status: Reservation['status']) => {
    api.updateReservationStatus(id, status);
    loadAll();
    showToast('Reservation Updated', `Reservation marked as ${status}.`, 'success');
  };

  // Delete dish
  const handleDeleteDish = (id: string) => {
    if (confirm('Are you sure you want to remove this dish from the menu?')) {
      api.deleteMenuItem(id);
      loadAll();
      showToast('Dish Removed', 'The item was deleted from the active menu.', 'info');
    }
  };

  // Save dish
  const handleSaveDish = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const item: MenuItem = {
      id: editingMenuItem ? editingMenuItem.id : 'dish-' + Date.now(),
      name: fd.get('name') as string,
      slug: (fd.get('name') as string).toLowerCase().replace(/[^a-z0-9]/g, '-'),
      category: fd.get('category') as any,
      description: fd.get('description') as string,
      price: Number(fd.get('price')),
      discountPrice: fd.get('discountPrice') ? Number(fd.get('discountPrice')) : undefined,
      image: (fd.get('image') as string) || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      model3d: fd.get('model3d') as any,
      isVeg: fd.get('isVeg') === 'on',
      spicyLevel: Number(fd.get('spicyLevel') || 0) as any,
      isBestseller: fd.get('isBestseller') === 'on',
      isChefSpecial: fd.get('isChefSpecial') === 'on',
      isAvailable: fd.get('isAvailable') === 'on',
      ingredients: (fd.get('ingredients') as string).split(',').map((s) => s.trim()),
      allergens: (fd.get('allergens') as string).split(',').map((s) => s.trim()).filter(Boolean),
      prepTime: (fd.get('prepTime') as string) || '20 mins',
      calories: Number(fd.get('calories') || 500),
      tags: ['Chef Curated'],
      rating: editingMenuItem ? editingMenuItem.rating : 5.0,
      reviewCount: editingMenuItem ? editingMenuItem.reviewCount : 1,
    };

    api.saveMenuItem(item);
    loadAll();
    setEditingMenuItem(null);
    setIsAddingMenu(false);
    showToast('Menu Item Saved', `${item.name} has been published to live menu.`, 'success');
  };

  // Save Blog
  const handleSaveBlog = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const post: BlogPost = {
      id: editingBlog ? editingBlog.id : 'blog-' + Date.now(),
      title: fd.get('title') as string,
      slug: (fd.get('title') as string).toLowerCase().replace(/[^a-z0-9]/g, '-'),
      featuredImage: (fd.get('featuredImage') as string) || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      content: fd.get('content') as string,
      excerpt: fd.get('excerpt') as string,
      author: (fd.get('author') as string) || 'Chef Julian Vance',
      category: (fd.get('category') as string) || 'Culinary Technique',
      tags: (fd.get('tags') as string).split(',').map((s) => s.trim()),
      seoTitle: fd.get('title') as string,
      seoDescription: fd.get('excerpt') as string,
      keywords: ['woodfire', 'culinary'],
      publishDate: new Date().toISOString().split('T')[0],
      status: (fd.get('status') as any) || 'Published',
      readTime: '5 min read',
    };

    api.saveBlog(post);
    loadAll();
    setEditingBlog(null);
    setIsAddingBlog(false);
    showToast('Essay Saved', `${post.title} has been updated.`, 'success');
  };

  // Financial Stats
  const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending' || o.status === 'Confirmed' || o.status === 'Preparing');
  const confirmedReservations = reservations.filter((r) => r.status === 'Confirmed');

  return (
    <div className="min-h-screen bg-[#07080a] text-[#e2e8f0] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0a0c10] border-r border-white/5 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Logo in Admin Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div onClick={() => navigate('/')} className="cursor-pointer">
              <Logo size="sm" showSubtitle={false} />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-[#d4af37]/20 text-[#d4af37]">
              Admin
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 text-xs font-semibold">
            {[
              { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
              { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
              { id: 'menu', label: `Menu Items (${menuItems.length})`, icon: UtensilsCrossed },
              { id: 'reservations', label: `Reservations (${reservations.length})`, icon: Calendar },
              { id: 'blogs', label: `Journal & Blog (${blogs.length})`, icon: BookOpen },
              { id: 'gallery', label: `Media Gallery (${gallery.length})`, icon: Image },
              { id: 'chefs', label: `Chefs Brigade (${chefs.length})`, icon: Award },
              { id: 'testimonials', label: `Testimonials (${testimonials.length})`, icon: Star },
              { id: 'offers', label: `Offers & Coupons (${offers.length})`, icon: Tag },
              { id: 'messages', label: `Inquiries (${messages.length})`, icon: Mail },
              { id: 'settings', label: 'Site & Hearth Settings', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                    activeTab === tab.id
                      ? 'bg-[#d4af37] text-[#0b0c10] shadow'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <button
            onClick={() => navigate('/')}
            className="w-full py-2 glass-dark hover:bg-white/10 text-xs text-slate-300 rounded flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Public Dining Site</span>
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={logout}
            className="w-full py-2 text-rose-400 hover:bg-rose-500/10 text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* ========================================================
            TAB 1: EXECUTIVE OVERVIEW & CHARTS
        ======================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                Operational Telemetry
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-white font-medium mt-1">
                Executive Overview
              </h1>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-card p-6 rounded-2xl border border-white/10">
                <span className="text-xs text-slate-400 uppercase tracking-wider block">
                  Gross Revenue
                </span>
                <span className="text-3xl font-serif font-bold text-gold-gradient tabular-nums block mt-2">
                  ${totalRevenue.toFixed(2)}
                </span>
                <span className="text-[11px] text-emerald-400 mt-1 block">
                  ↑ 18.4% vs last week
                </span>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/10">
                <span className="text-xs text-slate-400 uppercase tracking-wider block">
                  Orders Total
                </span>
                <span className="text-3xl font-serif font-bold text-white tabular-nums block mt-2">
                  {orders.length}
                </span>
                <span className="text-[11px] text-[#ff9100] mt-1 block">
                  {pendingOrders.length} In-Flight Preparation
                </span>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/10">
                <span className="text-xs text-slate-400 uppercase tracking-wider block">
                  Confirmed Seats
                </span>
                <span className="text-3xl font-serif font-bold text-white tabular-nums block mt-2">
                  {confirmedReservations.length}
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Next service: 5:00 PM Tonight
                </span>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/10">
                <span className="text-xs text-slate-400 uppercase tracking-wider block">
                  Menu Items Active
                </span>
                <span className="text-3xl font-serif font-bold text-white tabular-nums block mt-2">
                  {menuItems.length}
                </span>
                <span className="text-[11px] text-emerald-400 mt-1 block">
                  100% Hearth Sourced
                </span>
              </div>
            </div>

            {/* Recent Orders & Reservations Quick View */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl text-white font-medium">Recent Dining Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#d4af37] hover:underline"
                  >
                    View All →
                  </button>
                </div>

                <div className="space-y-3">
                  {orders.slice(0, 4).map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-mono font-bold text-white">#{ord.orderNumber}</span>
                        <span className="text-slate-400 block">{ord.customerName}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-gold-gradient block">
                          ${ord.total.toFixed(2)}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-[#d4af37]">
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl text-white font-medium">Upcoming Table Reservations</h3>
                  <button
                    onClick={() => setActiveTab('reservations')}
                    className="text-xs text-[#d4af37] hover:underline"
                  >
                    View All →
                  </button>
                </div>

                <div className="space-y-3">
                  {reservations.slice(0, 4).map((res) => (
                    <div
                      key={res.id}
                      className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-semibold text-white block">{res.customerName}</span>
                        <span className="text-slate-400">
                          {res.date} at {res.time} · {res.guests} Guests
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400">
                        {res.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: ORDERS MANAGEMENT
        ======================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                  Kitchen Dispatch
                </span>
                <h1 className="font-serif text-3xl text-white font-medium mt-1">Orders Management</h1>
              </div>
            </div>

            <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 border-b border-white/10 text-slate-400 uppercase font-semibold">
                    <tr>
                      <th className="p-4">Order #</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Dishes</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Current Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-white/[0.02]">
                        <td className="p-4 font-mono font-bold text-white">#{ord.orderNumber}</td>
                        <td className="p-4">
                          <span className="font-semibold text-white block">{ord.customerName}</span>
                          <span className="text-slate-400 text-[11px]">{ord.customerPhone}</span>
                        </td>
                        <td className="p-4 max-w-xs truncate text-slate-300">
                          {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                        </td>
                        <td className="p-4 font-mono font-bold text-gold-gradient tabular-nums">
                          ${ord.total.toFixed(2)}
                        </td>
                        <td className="p-4 text-slate-400">{ord.paymentMethod}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#d4af37]/20 text-[#d4af37]">
                            {ord.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-1 whitespace-nowrap">
                          <select
                            value={ord.status}
                            onChange={(e) =>
                              handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus)
                            }
                            className="bg-black/60 border border-white/10 rounded px-2 py-1 text-xs text-slate-200"
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Ready">Ready</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: MENU ITEMS CRUD
        ======================================================== */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                  Culinary Roster
                </span>
                <h1 className="font-serif text-3xl text-white font-medium mt-1">Live Menu Management</h1>
              </div>

              <button
                onClick={() => {
                  setEditingMenuItem(null);
                  setIsAddingMenu(true);
                }}
                className="px-4 py-2.5 bg-[#d4af37] hover:bg-[#e5be49] text-[#0b0c10] text-xs font-bold uppercase rounded font-brand flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Culinary Dish</span>
              </button>
            </div>

            <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 border-b border-white/10 text-slate-400 uppercase font-semibold">
                    <tr>
                      <th className="p-4">Dish</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">3D Model</th>
                      <th className="p-4">Dietary</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {menuItems.map((dish) => (
                      <tr key={dish.id} className="hover:bg-white/[0.02]">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={dish.image}
                            alt={dish.name}
                            className="w-10 h-10 rounded object-cover border border-white/10"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-serif font-bold text-white text-sm block">
                              {dish.name}
                            </span>
                            <span className="text-slate-400 text-[11px] truncate max-w-xs block">
                              {dish.description}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-300">{dish.category}</td>
                        <td className="p-4 font-mono font-bold text-gold-gradient tabular-nums">
                          ${dish.discountPrice ?? dish.price}
                        </td>
                        <td className="p-4 font-mono text-[#d4af37]">{dish.model3d || 'None'}</td>
                        <td className="p-4 text-slate-400">
                          {dish.isVeg ? '🌱 Veg' : '🥩 Non-Veg'}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              dish.isAvailable
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-rose-500/20 text-rose-400'
                            }`}
                          >
                            {dish.isAvailable ? 'In Stock' : 'Sold Out'}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingMenuItem(dish);
                              setIsAddingMenu(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-white transition-colors"
                            title="Edit Dish"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDish(dish.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Delete Dish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Add / Edit Dish */}
        {isAddingMenu && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
            <div className="max-w-2xl w-full glass-card p-6 sm:p-8 rounded-2xl border border-gold-subtle shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <h3 className="font-serif text-2xl text-white">
                  {editingMenuItem ? 'Edit Culinary Creation' : 'Add New Culinary Creation'}
                </h3>
                <button
                  onClick={() => setIsAddingMenu(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveDish} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 block mb-1">Dish Name *</label>
                    <input
                      name="name"
                      required
                      defaultValue={editingMenuItem?.name}
                      placeholder="e.g. Smoked Woodfire Wagyu Ribeye"
                      className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Category *</label>
                    <select
                      name="category"
                      defaultValue={editingMenuItem?.category || 'Continental'}
                      className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
                    >
                      {INITIAL_CATEGORIES.map((cat) => (
                        <option key={cat.name} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Culinary Description *</label>
                  <textarea
                    name="description"
                    required
                    rows={2}
                    defaultValue={editingMenuItem?.description}
                    placeholder="Rich description of ingredients and woodfire technique..."
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="text-slate-400 block mb-1">Price ($) *</label>
                    <input
                      name="price"
                      type="number"
                      required
                      defaultValue={editingMenuItem?.price || 45}
                      className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Privilege Price ($)</label>
                    <input
                      name="discountPrice"
                      type="number"
                      defaultValue={editingMenuItem?.discountPrice}
                      className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">3D Model Preset</label>
                    <select
                      name="model3d"
                      defaultValue={editingMenuItem?.model3d || 'cloche'}
                      className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded text-sm text-white"
                    >
                      <option value="cloche">Golden Cloche</option>
                      <option value="steak">Wagyu Steak</option>
                      <option value="burger">Ember Burger</option>
                      <option value="pizza">Stone Oven Pizza</option>
                      <option value="pasta">Truffle Pasta</option>
                      <option value="dessert">Chocolate Sphere</option>
                      <option value="beverage">Smoked Cocktail</option>
                      <option value="coffee">Geisha Coffee</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Prep Time</label>
                    <input
                      name="prepTime"
                      defaultValue={editingMenuItem?.prepTime || '20 mins'}
                      className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded text-sm text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Image URL</label>
                  <input
                    name="image"
                    defaultValue={editingMenuItem?.image}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded text-sm text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 block mb-1">Ingredients (comma-separated)</label>
                    <input
                      name="ingredients"
                      defaultValue={editingMenuItem?.ingredients.join(', ')}
                      placeholder="Wagyu Ribeye, White Oak, Sea Salt"
                      className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Allergens (comma-separated)</label>
                    <input
                      name="allergens"
                      defaultValue={editingMenuItem?.allergens.join(', ')}
                      placeholder="Dairy, Gluten, Eggs"
                      className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded text-sm text-white"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      name="isVeg"
                      type="checkbox"
                      defaultChecked={editingMenuItem?.isVeg}
                    />
                    <span>Vegetarian</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      name="isChefSpecial"
                      type="checkbox"
                      defaultChecked={editingMenuItem?.isChefSpecial}
                    />
                    <span>Chef Special</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      name="isBestseller"
                      type="checkbox"
                      defaultChecked={editingMenuItem?.isBestseller}
                    />
                    <span>Bestseller</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      name="isAvailable"
                      type="checkbox"
                      defaultChecked={editingMenuItem ? editingMenuItem.isAvailable : true}
                    />
                    <span>Available Now</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddingMenu(false)}
                    className="px-4 py-2 glass-dark text-slate-300 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#d4af37] text-[#0b0c10] font-bold uppercase rounded font-brand"
                  >
                    Save & Deploy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: RESERVATIONS MANAGEMENT
        ======================================================== */}
        {activeTab === 'reservations' && (
          <div className="space-y-6">
            <h1 className="font-serif text-3xl text-white font-medium">Table Reservations Management</h1>

            <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 border-b border-white/10 text-slate-400 uppercase font-semibold">
                    <tr>
                      <th className="p-4">Guest</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Date & Time</th>
                      <th className="p-4">Guests</th>
                      <th className="p-4">Assigned Table</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {reservations.map((res) => (
                      <tr key={res.id} className="hover:bg-white/[0.02]">
                        <td className="p-4 font-semibold text-white">{res.customerName}</td>
                        <td className="p-4 text-slate-400">
                          <span>{res.email}</span>
                          <span className="block">{res.phone}</span>
                        </td>
                        <td className="p-4 font-mono">
                          <span className="text-white block">{res.date}</span>
                          <span className="text-[#d4af37]">{res.time}</span>
                        </td>
                        <td className="p-4 font-mono font-bold text-white">{res.guests} Guests</td>
                        <td className="p-4 text-slate-300">{res.tableNumber || 'Hearth Line'}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              res.status === 'Confirmed'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : res.status === 'Rejected'
                                ? 'bg-rose-500/20 text-rose-400'
                                : 'bg-[#d4af37]/20 text-[#d4af37]'
                            }`}
                          >
                            {res.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-1 whitespace-nowrap">
                          <button
                            onClick={() => handleUpdateReservation(res.id, 'Confirmed')}
                            className="px-2.5 py-1 bg-emerald-600/30 text-emerald-300 rounded hover:bg-emerald-600/50"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleUpdateReservation(res.id, 'Completed')}
                            className="px-2.5 py-1 bg-white/10 text-slate-300 rounded hover:bg-white/20"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => handleUpdateReservation(res.id, 'Rejected')}
                            className="px-2.5 py-1 bg-rose-500/20 text-rose-300 rounded hover:bg-rose-500/40"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: BLOGS & JOURNAL CRUD
        ======================================================== */}
        {activeTab === 'blogs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="font-serif text-3xl text-white font-medium">Culinary Essays & Blog</h1>
              <button
                onClick={() => {
                  setEditingBlog(null);
                  setIsAddingBlog(true);
                }}
                className="px-4 py-2 bg-[#d4af37] text-[#0b0c10] text-xs font-bold uppercase rounded font-brand flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Write New Essay</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogs.map((b) => (
                <div key={b.id} className="glass-card p-6 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="text-[#d4af37] font-semibold">{b.category}</span>
                    <span>{b.publishDate}</span>
                  </div>
                  <h3 className="font-serif text-xl text-white font-medium">{b.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{b.excerpt}</p>
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-slate-400">By {b.author}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingBlog(b);
                          setIsAddingBlog(true);
                        }}
                        className="p-1 text-slate-300 hover:text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this essay?')) {
                            api.deleteBlog(b.id);
                            loadAll();
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal: Write / Edit Blog */}
        {isAddingBlog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
            <div className="max-w-2xl w-full glass-card p-6 sm:p-8 rounded-2xl border border-gold-subtle shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <h3 className="font-serif text-2xl text-white">
                  {editingBlog ? 'Edit Culinary Essay' : 'Write New Culinary Essay'}
                </h3>
                <button onClick={() => setIsAddingBlog(false)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveBlog} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Essay Title *</label>
                  <input
                    name="title"
                    required
                    defaultValue={editingBlog?.title}
                    placeholder="e.g. Sourcing Périgord Truffles in Autumn"
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded text-sm text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 block mb-1">Author</label>
                    <input
                      name="author"
                      defaultValue={editingBlog?.author || 'Chef Julian Vance'}
                      className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Category</label>
                    <input
                      name="category"
                      defaultValue={editingBlog?.category || 'Culinary Technique'}
                      className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded text-sm text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Featured Image URL</label>
                  <input
                    name="featuredImage"
                    defaultValue={editingBlog?.featuredImage}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded text-sm text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Excerpt *</label>
                  <textarea
                    name="excerpt"
                    required
                    rows={2}
                    defaultValue={editingBlog?.excerpt}
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded text-sm text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Full Essay Content *</label>
                  <textarea
                    name="content"
                    required
                    rows={6}
                    defaultValue={editingBlog?.content}
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded text-sm text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Tags (comma-separated)</label>
                  <input
                    name="tags"
                    defaultValue={editingBlog?.tags.join(', ')}
                    placeholder="Woodfire, Truffles, Technique"
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded text-sm text-white"
                  />
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddingBlog(false)}
                    className="px-4 py-2 glass-dark text-slate-300 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#d4af37] text-[#0b0c10] font-bold uppercase rounded font-brand"
                  >
                    Publish Essay
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 6: GALLERY MANAGEMENT
        ======================================================== */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <h1 className="font-serif text-3xl text-white font-medium">Media Gallery Management</h1>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {gallery.map((g) => (
                <div key={g.id} className="relative glass-card rounded-xl overflow-hidden group">
                  <img
                    src={g.image}
                    alt={g.title}
                    className="w-full h-40 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="p-2 text-xs">
                    <span className="font-semibold text-white block truncate">{g.title}</span>
                    <span className="text-[10px] text-slate-400">{g.category}</span>
                  </div>
                  <button
                    onClick={() => {
                      api.deleteGalleryItem(g.id);
                      loadAll();
                    }}
                    className="absolute top-2 right-2 p-1 bg-black/60 text-rose-400 hover:text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 7: CHEFS MANAGEMENT
        ======================================================== */}
        {activeTab === 'chefs' && (
          <div className="space-y-6">
            <h1 className="font-serif text-3xl text-white font-medium">Chefs Brigade Management</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {chefs.map((c) => (
                <div key={c.id} className="glass-card p-6 rounded-2xl border border-white/10 flex gap-4">
                  <img
                    src={c.photo}
                    alt={c.name}
                    className="w-20 h-24 rounded-lg object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1 text-xs">
                    <h3 className="font-serif text-xl text-white">{c.name}</h3>
                    <span className="text-[#d4af37] font-semibold block">{c.designation}</span>
                    <p className="text-slate-400 line-clamp-2">{c.biography}</p>
                    <span className="text-slate-500 block">{c.specialization}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 8: TESTIMONIALS
        ======================================================== */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <h1 className="font-serif text-3xl text-white font-medium">Testimonials Management</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((t) => (
                <div key={t.id} className="glass-card p-6 rounded-2xl border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-sm">{t.customerName}</span>
                    <span className="text-[#d4af37]">★ {t.rating}.0</span>
                  </div>
                  <span className="text-slate-400">{t.designation}</span>
                  <p className="text-slate-300 italic">"{t.review}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 9: OFFERS & COUPONS
        ======================================================== */}
        {activeTab === 'offers' && (
          <div className="space-y-6">
            <h1 className="font-serif text-3xl text-white font-medium">Privilege Coupons Management</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {offers.map((o) => (
                <div key={o.id} className="glass-card p-6 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-base font-bold text-[#d4af37]">{o.code}</span>
                    <h4 className="font-serif text-lg text-white font-medium">{o.title}</h4>
                    <span className="text-xs text-slate-400">
                      {o.discountType === 'percentage' ? `${o.discountValue}%` : `$${o.discountValue}`} Off (Min ${o.minOrderValue})
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 10: INQUIRIES & MESSAGES
        ======================================================== */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <h1 className="font-serif text-3xl text-white font-medium">Contact Form Inquiries</h1>
            <div className="space-y-4">
              {messages.map((m) => (
                <div key={m.id} className="glass-card p-6 rounded-2xl border border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-white text-sm">{m.name}</span>
                    <span className="text-slate-400">{m.date}</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    <span>{m.email}</span> · <span>{m.phone}</span>
                  </div>
                  <h4 className="font-serif text-base text-gold-gradient font-medium">{m.subject}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{m.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 11: SETTINGS
        ======================================================== */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-3xl">
            <h1 className="font-serif text-3xl text-white font-medium">Restaurant Site Settings</h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                updateSettings({
                  restaurantName: fd.get('restaurantName') as string,
                  phone: fd.get('phone') as string,
                  email: fd.get('email') as string,
                  address: fd.get('address') as string,
                  openingHours: fd.get('openingHours') as string,
                  deliveryFee: Number(fd.get('deliveryFee')),
                  taxRate: Number(fd.get('taxRate')),
                });
              }}
              className="glass-card p-8 rounded-2xl border border-gold-subtle space-y-4 text-xs"
            >
              <div>
                <label className="text-slate-400 block mb-1">Restaurant Name</label>
                <input
                  name="restaurantName"
                  defaultValue={siteSettings.restaurantName}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">Concierge Telephone</label>
                  <input
                    name="phone"
                    defaultValue={siteSettings.phone}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Concierge Email</label>
                  <input
                    name="email"
                    defaultValue={siteSettings.email}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Address</label>
                <input
                  name="address"
                  defaultValue={siteSettings.address}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Service Hours</label>
                <input
                  name="openingHours"
                  defaultValue={siteSettings.openingHours}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">Courier Delivery Fee ($)</label>
                  <input
                    name="deliveryFee"
                    type="number"
                    step="0.5"
                    defaultValue={siteSettings.deliveryFee}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Tax Rate (e.g. 0.0825)</label>
                  <input
                    name="taxRate"
                    type="number"
                    step="0.0001"
                    defaultValue={siteSettings.taxRate}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#d4af37] text-[#0b0c10] font-bold uppercase rounded font-brand"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};
