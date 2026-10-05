import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Order } from '../types';
import { CheckCircle2, ArrowRight, Clock, MapPin, Receipt, Sparkles } from 'lucide-react';
import { PlateComposition } from '../components/food3d';

export const OrderSuccessPage: React.FC = () => {
  const { navigate } = useApp();
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);

  useEffect(() => {
    const orders = api.getOrders();
    if (orders.length > 0) {
      setLatestOrder(orders[0]);
    }
  }, []);

  if (!latestOrder) {
    return (
      <div className="min-h-screen bg-[#08090b] text-white flex items-center justify-center pt-24">
        <p className="font-serif text-xl">Loading order confirmation...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090b] text-[#e2e8f0] pt-28 pb-24 px-6 flex items-center justify-center">
      <div className="max-w-xl w-full glass-card p-8 sm:p-10 rounded-3xl border border-gold-subtle text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-500">
        {/* Celebratory 3D Plated Dish Composition */}
        <div className="flex justify-center -mt-2">
          <PlateComposition
            foodImage="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80"
            alt="Celebration Wagyu Dish"
            preset="wagyu-hearth"
            plateType="slate"
            size="sm"
            caption="Order Prepared Under Cloche"
          />
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Order Confirmed & Queued</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-white font-medium">
            The Fire Has Awoken
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            Order <strong className="font-mono text-white">#{latestOrder.orderNumber}</strong> has been
            received by Chef Julian Vance and the hearth brigade.
          </p>
        </div>

        {/* Status Callout */}
        <div className="glass-dark p-4 rounded-xl border border-white/10 text-left space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Estimated Courier Arrival:</span>
            <span className="text-[#d4af37] font-semibold flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5" />
              {latestOrder.estimatedDeliveryTime || '35-45 mins'}
            </span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Destination:</span>
            <span className="text-white truncate max-w-[200px]">{latestOrder.deliveryAddress}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Total Settled:</span>
            <span className="text-white font-mono font-bold">${latestOrder.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => navigate(`/order-tracking?id=${latestOrder.id}`)}
            className="w-full sm:flex-1 py-3.5 bg-[#d4af37] hover:bg-[#e5be49] text-[#0b0c10] text-xs font-bold uppercase tracking-wider rounded font-brand transition-all flex items-center justify-center gap-2 shadow"
          >
            <span>Live Order Tracking</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/menu')}
            className="w-full sm:w-auto px-6 py-3.5 glass-dark text-slate-300 hover:text-white text-xs font-semibold uppercase tracking-wider rounded border border-white/10"
          >
            Return to Menu
          </button>
        </div>
      </div>
    </div>
  );
};
