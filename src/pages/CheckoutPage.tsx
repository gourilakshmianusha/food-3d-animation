import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CreditCard, ShieldCheck, ArrowLeft, CheckCircle2, Lock } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { cart, finalTotal, subtotal, discountAmount, taxAmount, deliveryFee, placeOrder, navigate, user } = useApp();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.savedAddresses[0] || '',
    city: 'San Francisco',
    postalCode: '94105',
    instructions: '',
    paymentMethod: 'Credit Card' as 'Credit Card' | 'Apple Pay' | 'Google Pay' | 'Cash on Delivery',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      alert('Please fill out all required contact and delivery fields.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const order = placeOrder({
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        deliveryAddress: `${formData.address}, ${formData.city} ${formData.postalCode}`,
        paymentMethod: formData.paymentMethod,
      });
      setIsSubmitting(false);
      navigate(`/order-success?id=${order.id}`);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#08090b] text-[#e2e8f0] pt-28 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/cart')}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400 hover:text-[#d4af37] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dining Bag</span>
        </button>

        <div className="mb-8">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
            Secure Transaction
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-white font-light mt-1">
            Checkout & Courier Dispatch
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Delivery & Payment Details */}
          <div className="lg:col-span-7 space-y-8">
            {/* Contact & Destination */}
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-gold-subtle space-y-4">
              <h2 className="font-serif text-xl text-white font-medium flex items-center gap-2">
                <span>1. Guest Contact & Residence</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Marcus Sterling"
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="marcus@example.com"
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (415) 890-3420"
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Delivery Address *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street address, building, suite/apartment"
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-gold-subtle space-y-4">
              <h2 className="font-serif text-xl text-white font-medium">
                2. Method of Settlement
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'Credit Card', label: 'Credit Card', icon: '💳' },
                  { id: 'Apple Pay', label: 'Apple Pay', icon: '' },
                  { id: 'Google Pay', label: 'Google Pay', icon: 'G' },
                  { id: 'Cash on Delivery', label: 'Pay on Arrival', icon: '💵' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        paymentMethod: m.id as any,
                      })
                    }
                    className={`p-3 rounded-xl border text-center transition-all ${
                      formData.paymentMethod === m.id
                        ? 'bg-[#d4af37]/20 border-[#d4af37] text-white shadow-md'
                        : 'border-white/10 bg-black/30 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-lg block mb-1">{m.icon}</span>
                    <span className="text-xs font-semibold block">{m.label}</span>
                  </button>
                ))}
              </div>

              {formData.paymentMethod === 'Credit Card' && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="•••• •••• •••• 4242"
                      defaultValue="4242 •••• •••• 9821"
                      className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37] font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Expiry</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        defaultValue="12/28"
                        className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37] font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">CVC</label>
                      <input
                        type="text"
                        placeholder="CVC"
                        defaultValue="891"
                        className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37] font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Recapitulation */}
          <div className="lg:col-span-5 glass-card p-6 sm:p-8 rounded-2xl border border-gold-subtle space-y-6">
            <h3 className="font-serif text-2xl text-white font-medium">Your Selection</h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map(({ item, quantity }) => (
                <div key={item.id} className="flex items-center justify-between text-xs py-2 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[#d4af37] font-bold">{quantity}x</span>
                    <span className="text-white truncate max-w-[180px]">{item.name}</span>
                  </div>
                  <span className="font-mono text-slate-300 tabular-nums">
                    ${((item.discountPrice ?? item.price) * quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-white tabular-nums">${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span className="font-mono tabular-nums">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-mono text-white tabular-nums">${taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="font-mono text-white tabular-nums">
                  {deliveryFee === 0 ? 'Complimentary' : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                <span>Total Amount</span>
                <span className="font-serif text-2xl text-gold-gradient tabular-nums">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#d4af37] hover:bg-[#e5be49] text-[#0b0c10] text-xs font-bold uppercase tracking-widest rounded font-brand transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{isSubmitting ? 'Transmitting Order...' : `Authorize & Order $${finalTotal.toFixed(2)}`}</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Encrypted 256-bit culinary transmission</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
