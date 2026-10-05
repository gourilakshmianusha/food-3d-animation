import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar as CalendarIcon, Clock, Users, Flame, CheckCircle2, Sparkles, Utensils } from 'lucide-react';
import { TableScene } from '../components/3d/TableScene';

export const ReservationPage: React.FC = () => {
  const { bookReservation, navigate, user } = useApp();

  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('19:30');
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [specialRequest, setSpecialRequest] = useState('');
  const [confirmedReservation, setConfirmedReservation] = useState<any>(null);

  const availableTimeSlots = [
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30',
    '22:00',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      alert('Please fill out all contact fields.');
      return;
    }

    const res = bookReservation({
      customerName: name,
      email,
      phone,
      date,
      time,
      guests,
      specialRequest,
    });
    setConfirmedReservation(res);
  };

  return (
    <div className="min-h-screen bg-[#08090b] text-[#e2e8f0] pt-28 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
            The Fireside Table
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-white font-light mt-1">
            Table Reservations
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-3 leading-relaxed">
            Reserve your seat adjacent to the open hearth. All reservations include our amuse-bouche
            and tableside hickory smoke cloche service.
          </p>
        </div>

        {confirmedReservation ? (
          <div className="glass-card p-8 sm:p-12 rounded-2xl border border-gold-subtle text-center space-y-6 max-w-xl mx-auto animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center mx-auto text-[#d4af37]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block">
                Confirmed & Reserved
              </span>
              <h2 className="font-serif text-3xl text-white font-medium mt-1">
                We Await Your Arrival
              </h2>
              <p className="text-xs text-slate-300 mt-2">
                A formal invitation voucher has been dispatched to{' '}
                <strong className="text-white">{confirmedReservation.email}</strong>.
              </p>
            </div>

            {/* 3D Reserved Table View */}
            <div className="h-64 rounded-xl overflow-hidden glass-dark border border-white/10 relative">
              <TableScene guestCount={confirmedReservation.guests} />
              <div className="absolute bottom-2 left-3 text-[10px] text-[#d4af37] uppercase tracking-wider font-mono">
                Reserved Table Setting · {confirmedReservation.guests} Place Covers
              </div>
            </div>

            <div className="glass-dark p-6 rounded-xl border border-white/10 text-left space-y-3 text-xs">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-400">Date:</span>
                <span className="font-semibold text-white">{confirmedReservation.date}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-400">Time:</span>
                <span className="font-semibold text-gold-gradient">{confirmedReservation.time}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-400">Guests:</span>
                <span className="font-semibold text-white">{confirmedReservation.guests} Guests</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-400">Table:</span>
                <span className="font-semibold text-white">{confirmedReservation.tableNumber || 'Hearth Center'}</span>
              </div>
              {confirmedReservation.specialRequest && (
                <div className="pt-1">
                  <span className="text-slate-400 block mb-0.5">Special Preferences:</span>
                  <p className="text-slate-200 italic">"{confirmedReservation.specialRequest}"</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/menu')}
                className="flex-1 py-3 bg-[#d4af37] hover:bg-[#e5be49] text-[#0b0c10] text-xs font-bold uppercase rounded font-brand"
              >
                Preview Dinner Menu
              </button>
              <button
                onClick={() => setConfirmedReservation(null)}
                className="py-3 px-5 glass-dark text-slate-300 hover:text-white text-xs font-semibold rounded border border-white/10"
              >
                Reserve Another Table
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: 3D Table Setting Visualization */}
            <div className="lg:col-span-5 glass-card p-6 rounded-2xl border border-gold-subtle space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5" />
                  3D Table Ambiance
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {guests} {guests === 1 ? 'Cover' : 'Covers'}
                </span>
              </div>
              <div className="h-64 sm:h-72 rounded-xl overflow-hidden glass-dark border border-white/5 relative">
                <TableScene guestCount={guests} />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed italic">
                * Our handcrafted dark walnut tables feature hand-polished brass candleholders, Belgian linen napkins,
                and crystal glassware configured for your party size.
              </p>
            </div>

            {/* Right Column: Booking Form */}
            <form
              onSubmit={handleSubmit}
              className="lg:col-span-7 glass-card p-6 sm:p-8 rounded-2xl border border-gold-subtle space-y-8"
            >
            {/* Step 1: Date, Time & Guests */}
            <div className="space-y-4">
              <h3 className="font-serif text-xl text-white font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                <span>1. Select Date, Time & Party</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Dining Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Guests *</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Seating Window</label>
                  <div className="px-3.5 py-2.5 bg-black/20 border border-white/5 rounded text-sm text-[#d4af37] font-medium">
                    2 Hours Dining Window
                  </div>
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="text-xs text-slate-400 block mb-2">Available Time Slots *</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {availableTimeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTime(slot)}
                      className={`py-2 px-3 text-xs font-mono font-semibold rounded border transition-all ${
                        time === slot
                          ? 'bg-[#d4af37] text-[#0b0c10] border-[#d4af37] shadow'
                          : 'bg-black/30 border-white/10 text-slate-300 hover:border-white/30'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 2: Guest Details */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="font-serif text-xl text-white font-medium">
                2. Guest Details & Occasion
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Primary Guest Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aurelia Chen"
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. aurelia@design.com"
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (415) 555-0182"
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  Special Requests, Anniversaries or Dietary Dietary Restrictions:
                </label>
                <textarea
                  rows={3}
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  placeholder="e.g. Celebrating 10th anniversary, seating near the open hearth view requested, severe shellfish allergy..."
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#d4af37] resize-none"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-400">
                No prepayment required. Cancellations accepted up to 6 hours before service.
              </span>
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-4 bg-[#d4af37] hover:bg-[#e5be49] text-[#0b0c10] text-xs font-bold uppercase tracking-widest rounded font-brand transition-all shadow-xl hover:shadow-2xl"
              >
                Confirm Table Reservation
              </button>
            </div>
          </form>
        </div>
        )}
      </div>
    </div>
  );
};
