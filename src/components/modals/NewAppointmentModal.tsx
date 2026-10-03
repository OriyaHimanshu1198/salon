import React, { useState } from 'react';
import { X, Calendar, Clock, User, Scissors, DollarSign } from 'lucide-react';
import { Stylist } from '../../types/salon';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  stylists: Stylist[];
  onSave: (appt: {
    clientName: string;
    stylistId: string;
    serviceName: string;
    startTime: string;
    durationMinutes: number;
    price: number;
    formulaNote?: string;
  }) => void;
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  isOpen,
  onClose,
  stylists,
  onSave,
}) => {
  const [clientName, setClientName] = useState('');
  const [stylistId, setStylistId] = useState(stylists[0]?.id || 'stylist-elena');
  const [serviceName, setServiceName] = useState('Balayage & Gloss');
  const [startTime, setStartTime] = useState('11:00');
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [price, setPrice] = useState(240);
  const [formulaNote, setFormulaNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;
    onSave({
      clientName,
      stylistId,
      serviceName,
      startTime,
      durationMinutes: Number(durationMinutes),
      price: Number(price),
      formulaNote,
    });
    onClose();
  };

  const services = [
    { name: 'Balayage & Gloss', price: 240, duration: 120 },
    { name: 'Full Foil Highlights', price: 310, duration: 150 },
    { name: 'Single Process Touchup', price: 120, duration: 60 },
    { name: 'Signature Cut & Style', price: 95, duration: 60 },
    { name: 'Keratin Smoothing', price: 300, duration: 90 },
    { name: 'Tape-in Extensions Install', price: 650, duration: 180 },
    { name: 'Gloss & Blowdry', price: 110, duration: 60 },
  ];

  const handleServiceChange = (name: string) => {
    setServiceName(name);
    const s = services.find((srv) => srv.name === name);
    if (s) {
      setPrice(s.price);
      setDurationMinutes(s.duration);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl border border-zinc-200 shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-zinc-900" />
            <h3 className="text-base font-semibold text-zinc-900">Book New Appointment</h3>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
              Client Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Jessica Taylor"
                className="w-full min-h-[44px] pl-10 pr-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                Stylist & Station
              </label>
              <select
                value={stylistId}
                onChange={(e) => setStylistId(e.target.value)}
                className="w-full min-h-[44px] px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
              >
                {stylists.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.role.split(' ')[0]})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                Service Package
              </label>
              <select
                value={serviceName}
                onChange={(e) => handleServiceChange(e.target.value)}
                className="w-full min-h-[44px] px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
              >
                {services.map((srv) => (
                  <option key={srv.name} value={srv.name}>
                    {srv.name} (${srv.price})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                Start Time
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full min-h-[44px] pl-9 pr-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                Duration (min)
              </label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full min-h-[44px] px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                Base Fee ($)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full min-h-[44px] pl-8 pr-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
              Formulation / Technical Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={formulaNote}
              onChange={(e) => setFormulaNote(e.target.value)}
              placeholder="e.g. Redken 09V + 09GI equal parts with Processing Solution"
              className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 rounded-lg bg-zinc-100 text-zinc-700 hover:bg-zinc-200 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-5 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 text-sm font-medium transition-colors shadow-xs"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
