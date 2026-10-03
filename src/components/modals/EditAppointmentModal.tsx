import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Scissors, DollarSign, Save, Trash2, CheckCircle2 } from 'lucide-react';
import { Appointment, Stylist } from '../../types/salon';

interface EditAppointmentModalProps {
  isOpen: boolean;
  appointment: Appointment | null;
  stylists: Stylist[];
  onClose: () => void;
  onSave: (appt: Appointment) => void;
  onDelete?: (apptId: string) => void;
}

export const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({
  isOpen,
  appointment,
  stylists,
  onClose,
  onSave,
  onDelete,
}) => {
  const [clientName, setClientName] = useState('');
  const [stylistId, setStylistId] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [price, setPrice] = useState(100);
  const [status, setStatus] = useState<Appointment['status']>('confirmed');
  const [formulaNote, setFormulaNote] = useState('');
  const [station, setStation] = useState('');

  useEffect(() => {
    if (appointment) {
      setClientName(appointment.clientName);
      setStylistId(appointment.stylistId);
      setServiceName(appointment.serviceName);
      setStartTime(appointment.startTime);
      setDurationMinutes(appointment.durationMinutes);
      setPrice(appointment.basePrice);
      setStatus(appointment.status);
      setFormulaNote(appointment.formulaNote || '');
      setStation(appointment.station || '');
    }
  }, [appointment]);

  if (!isOpen || !appointment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    const chosenStylist = stylists.find((s) => s.id === stylistId) || stylists[0];
    const [startH, startM] = startTime.split(':').map(Number);
    const totalMinutes = startH * 60 + startM + Number(durationMinutes);
    const endH = Math.floor(totalMinutes / 60) % 24;
    const endM = totalMinutes % 60;
    const computedEndTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

    const updatedAppt: Appointment = {
      ...appointment,
      clientName: clientName.trim(),
      stylistId: chosenStylist ? chosenStylist.id : stylistId,
      stylistName: chosenStylist ? chosenStylist.name : appointment.stylistName,
      station: station || (chosenStylist ? chosenStylist.station : appointment.station),
      serviceName: serviceName.trim(),
      startTime,
      endTime: computedEndTime,
      durationMinutes: Number(durationMinutes),
      status,
      basePrice: Number(price),
      subtotal: Number(price),
      formulaNote: formulaNote.trim() || undefined,
    };

    onSave(updatedAppt);
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
    { name: "Gentleman's Grooming", price: 85, duration: 60 },
    { name: 'Japanese Head Spa & Scalp Detox', price: 120, duration: 45 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl border border-zinc-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50 shrink-0">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-zinc-900" />
            <div>
              <h3 className="text-base font-semibold text-zinc-900">Edit Appointment Booking</h3>
              <p className="text-[11px] text-zinc-500 font-mono">ID: {appointment.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
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
                className="w-full min-h-[44px] pl-10 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                Stylist & Chair
              </label>
              <select
                value={stylistId}
                onChange={(e) => setStylistId(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
              >
                {stylists.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Appointment['status'])}
                className="w-full min-h-[44px] px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
              >
                <option value="confirmed">Confirmed</option>
                <option value="in-service">In-Service</option>
                <option value="waiting">Waiting in Lounge</option>
                <option value="completed">Completed</option>
                <option value="no-show">No-Show</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
              Service / Ritual Name
            </label>
            <div className="relative">
              <Scissors className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                required
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="w-full min-h-[44px] pl-10 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
            {/* Quick preset chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {services.slice(0, 4).map((s) => (
                <button
                  type="button"
                  key={s.name}
                  onClick={() => {
                    setServiceName(s.name);
                    setPrice(s.price);
                    setDurationMinutes(s.duration);
                  }}
                  className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 rounded text-[11px] font-medium text-zinc-700 cursor-pointer"
                >
                  {s.name} (${s.price})
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                Start Time
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full min-h-[44px] pl-10 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                Duration (Min)
              </label>
              <input
                type="number"
                min={15}
                step={15}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full min-h-[44px] px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                Base Price ($)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="number"
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full min-h-[44px] pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
              Technical Color Formula & Notes
            </label>
            <textarea
              rows={2}
              value={formulaNote}
              onChange={(e) => setFormulaNote(e.target.value)}
              placeholder="e.g. Wella Koleston 7/1 (30g) + 20 Vol Welloxon (45g)"
              className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>

          <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-3">
            {onDelete ? (
              <button
                type="button"
                onClick={() => {
                  onDelete(appointment.id);
                  onClose();
                }}
                className="min-h-[44px] px-3 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Booking</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] px-4 rounded-lg bg-zinc-100 text-zinc-700 hover:bg-zinc-200 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="min-h-[44px] px-5 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-semibold cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
