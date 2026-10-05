import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Order, OrderStatus } from '../types';
import { DeliveryTrack3D } from '../components/3d/DeliveryTrack3D';
import {
  Flame,
  CheckCircle2,
  Clock,
  Bike,
  PackageCheck,
  Search,
  MapPin,
  Phone,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export const OrderTrackingPage: React.FC = () => {
  const { navigate } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchNum, setSearchNum] = useState('');

  const reloadOrders = () => {
    const list = api.getOrders();
    setOrders(list);
    if (!selectedOrder && list.length > 0) {
      setSelectedOrder(list[0]);
    } else if (selectedOrder) {
      const updated = list.find((o) => o.id === selectedOrder.id);
      if (updated) setSelectedOrder(updated);
    }
  };

  useEffect(() => {
    reloadOrders();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchNum.trim()) return;
    const clean = searchNum.trim().toUpperCase();
    const found = orders.find(
      (o) => o.orderNumber.toUpperCase() === clean || o.id.toUpperCase() === clean
    );
    if (found) {
      setSelectedOrder(found);
    } else {
      alert('Order not found. Please verify the order reference number.');
    }
  };

  const steps: { status: OrderStatus; label: string; desc: string; icon: any }[] = [
    { status: 'Confirmed', label: 'Order Confirmed', desc: 'Received & prioritized by culinary dispatcher', icon: CheckCircle2 },
    { status: 'Preparing', label: 'Over Woodfire Embers', desc: 'Seared on white oak coals & slow simmered', icon: Flame },
    { status: 'Ready', label: 'Plated & Inspected', desc: 'Quality certified & packed in thermal cloche', icon: PackageCheck },
    { status: 'Out for Delivery', label: 'Courier En Route', desc: 'White-glove climate-controlled courier', icon: Bike },
    { status: 'Delivered', label: 'Served', desc: 'Delivered to your residence or table', icon: CheckCircle2 },
  ];

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'Cancelled') return -1;
    if (status === 'Pending') return 0;
    const idx = steps.findIndex((s) => s.status === status);
    return idx >= 0 ? idx : 0;
  };

  const currentStepIdx = selectedOrder ? getStepIndex(selectedOrder.status) : 0;

  return (
    <div className="min-h-screen bg-[#08090b] text-[#e2e8f0] pt-28 pb-24 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
            Real-Time Line Telemetry
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-white font-light mt-1">
            Hearth Order Tracker
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            Watch your culinary selections transition from raw harvest to woodfire finish.
          </p>
        </div>

        {/* Search Order Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchNum}
              onChange={(e) => setSearchNum(e.target.value)}
              placeholder="Enter Order # (e.g. ET-8924)"
              className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 uppercase focus:outline-none focus:border-[#d4af37]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#d4af37] text-[#0b0c10] text-xs font-bold uppercase rounded"
          >
            Track
          </button>
        </form>

        {selectedOrder ? (
          <div className="glass-card p-6 sm:p-10 rounded-2xl border border-gold-subtle space-y-8">
            {/* Top Bar with Number & ETA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400">Order Reference</span>
                <h3 className="font-mono text-2xl font-bold text-white">
                  #{selectedOrder.orderNumber}
                </h3>
                <span className="text-xs text-slate-400">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="sm:text-right">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
                  Estimated Arrival
                </span>
                <span className="text-xl font-serif font-bold text-gold-gradient tabular-nums">
                  {selectedOrder.estimatedDeliveryTime || '30-40 mins'}
                </span>
                <span className="text-xs text-emerald-400 block font-medium">
                  Current Status: {selectedOrder.status}
                </span>
              </div>
            </div>

            {/* 3D Real-Time Journey Visualization */}
            <div className="rounded-2xl overflow-hidden glass-dark border border-white/10 p-4 space-y-2">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  3D Courier & Dispatch Pathway
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Real-time Milestone: {selectedOrder.status}
                </span>
              </div>
              <div className="h-64 sm:h-72 rounded-xl overflow-hidden relative">
                <DeliveryTrack3D status={selectedOrder.status} />
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="space-y-6">
              <h4 className="text-xs uppercase tracking-wider text-slate-300 font-semibold">
                Culinary Brigade Progress
              </h4>
              <div className="relative pl-6 sm:pl-8 space-y-8 border-l border-white/10 ml-2">
                {steps.map((st, idx) => {
                  const isDone = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  const Icon = st.icon;

                  return (
                    <div key={st.status} className="relative group">
                      <div
                        className={`absolute -left-[31px] sm:-left-[39px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${
                          isCurrent
                            ? 'bg-[#e65100] text-white ring-4 ring-[#e65100]/20 animate-pulse'
                            : isDone
                            ? 'bg-[#d4af37] text-[#0b0c10]'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>

                      <div>
                        <h5
                          className={`text-sm font-semibold transition-colors ${
                            isCurrent
                              ? 'text-[#ff9100]'
                              : isDone
                              ? 'text-white'
                              : 'text-slate-500'
                          }`}
                        >
                          {st.label}
                        </h5>
                        <p className="text-xs text-slate-400 mt-0.5">{st.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Itemized Order Recap */}
            <div className="pt-6 border-t border-white/10 space-y-4">
              <h4 className="text-xs uppercase tracking-wider text-slate-300 font-semibold">
                Dishes in this Order
              </h4>
              <div className="space-y-3">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded object-cover border border-white/10"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="font-semibold text-white block">{item.name}</span>
                        <span className="text-slate-400 font-mono">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-mono text-white tabular-nums">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-3 text-sm font-bold">
                <span className="text-slate-300">Total Settled</span>
                <span className="font-serif text-xl text-gold-gradient tabular-nums">
                  ${selectedOrder.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 glass-card rounded-2xl border border-white/10">
            <p className="text-sm text-slate-400">No active order loaded.</p>
          </div>
        )}
      </div>
    </div>
  );
};
