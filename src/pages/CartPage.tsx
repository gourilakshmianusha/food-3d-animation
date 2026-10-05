import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Tag,
  Check,
  X,
  ShieldCheck,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discountAmount,
    taxAmount,
    deliveryFee,
    finalTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    navigate,
    siteSettings,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#08090b] text-[#e2e8f0] pt-32 pb-24 px-6 flex items-center justify-center">
        <div className="max-w-md w-full text-center glass-card p-10 rounded-2xl border border-white/10 space-y-6">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#d4af37]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-3xl text-white">Your Dining Bag is Empty</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Our woodfire hearth is ablaze. Explore our curated compendium of steaks, truffles, and
            artisanal pastas.
          </p>
          <button
            onClick={() => navigate('/menu')}
            className="w-full py-3.5 bg-[#d4af37] hover:bg-[#e5be49] text-[#0b0c10] text-xs font-bold uppercase tracking-wider rounded font-brand transition-all shadow"
          >
            Explore the Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090b] text-[#e2e8f0] pt-28 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
              Review Selections
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-white font-light mt-1">
              Your Dining Bag
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
          >
            Clear Entire Bag
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-7 space-y-4">
            {cart.map(({ item, quantity, specialInstructions }) => {
              const price = item.discountPrice ?? item.price;
              return (
                <div
                  key={item.id}
                  className="glass-card p-4 sm:p-5 rounded-xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover border border-white/10 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#d4af37] font-medium block">
                        {item.category}
                      </span>
                      <h3
                        onClick={() => navigate(`/menu/${item.slug}`)}
                        className="font-serif text-lg text-white font-medium hover:text-[#d4af37] cursor-pointer"
                      >
                        {item.name}
                      </h3>
                      <div className="text-sm font-serif font-bold text-gold-gradient tabular-nums">
                        ${price}{' '}
                        <span className="text-xs font-normal text-slate-400 font-sans">
                          each
                        </span>
                      </div>
                      {specialInstructions && (
                        <p className="text-[11px] text-slate-400 italic mt-0.5">
                          Note: "{specialInstructions}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quantity Stepper & Removal */}
                  <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-white/5">
                    <div className="flex items-center gap-2 bg-black/60 border border-white/10 rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.id, quantity - 1)}
                        className="p-1 text-slate-400 hover:text-white transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold font-mono px-2 tabular-nums">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, quantity + 1)}
                        className="p-1 text-slate-400 hover:text-white transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-serif font-bold text-white tabular-nums block">
                        ${(price * quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-500 hover:text-rose-400 text-xs transition-colors mt-0.5"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="pt-2">
              <button
                onClick={() => navigate('/menu')}
                className="text-xs uppercase tracking-wider text-[#d4af37] hover:underline font-semibold"
              >
                + Add More Dishes from Menu
              </button>
            </div>
          </div>

          {/* Right Column: Order Summary & Coupon */}
          <div className="lg:col-span-5 glass-card p-6 sm:p-8 rounded-2xl border border-gold-subtle space-y-6">
            <h3 className="font-serif text-2xl text-white font-medium">Order Summary</h3>

            {/* Privilege Coupon */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
                Privilege Code
              </label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#d4af37]/10 border border-[#d4af37]/30 text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#d4af37]" />
                    <span className="font-mono font-bold text-[#d4af37]">
                      {appliedCoupon.code}
                    </span>
                    <span className="text-slate-300">({appliedCoupon.title})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-slate-400 hover:text-white p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Try code: EMBERFIRST"
                    className="flex-1 px-3 py-2 bg-black/40 border border-white/10 rounded text-xs text-white uppercase placeholder:normal-case placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded uppercase tracking-wider transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-xs text-rose-400 mt-1">{couponError}</p>}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-3 pt-3 border-t border-white/10 text-sm">
              <div className="flex items-center justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-mono text-white tabular-nums">${subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-400">
                  <span>Privilege Discount</span>
                  <span className="font-mono tabular-nums">-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-slate-400">
                <span>Estimated Tax ({(siteSettings.taxRate * 100).toFixed(2)}%)</span>
                <span className="font-mono text-white tabular-nums">${taxAmount.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span>Hearth Courier Delivery</span>
                <span className="font-mono text-white tabular-nums">
                  {deliveryFee === 0 ? 'COMPLIMENTARY' : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>

              {subtotal < siteSettings.freeDeliveryThreshold && (
                <p className="text-[11px] text-slate-500">
                  Add ${(siteSettings.freeDeliveryThreshold - subtotal).toFixed(2)} more for complimentary delivery.
                </p>
              )}

              <div className="pt-3 border-t border-white/10 flex items-baseline justify-between text-lg font-bold">
                <span className="text-white">Total</span>
                <span className="font-serif text-2xl text-gold-gradient tabular-nums">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-[#d4af37] hover:bg-[#e5be49] text-[#0b0c10] text-xs font-bold uppercase tracking-widest rounded font-brand transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Directly transmitted to executive line chefs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
