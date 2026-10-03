import React, { useState } from 'react';
import { X, UserPlus, Sparkles } from 'lucide-react';
import { Stylist } from '../../types/salon';

interface WalkInModalProps {
  isOpen: boolean;
  onClose: () => void;
  stylists: Stylist[];
  onCheckIn: (walkIn: {
    clientName: string;
    stylistId: string;
    serviceName: string;
    beverageChoice: string;
    estimatedWaitMins: number;
  }) => void;
}

export const WalkInModal: React.FC<WalkInModalProps> = ({
  isOpen,
  onClose,
  stylists,
  onCheckIn,
}) => {
  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [stylistId, setStylistId] = useState(stylists[0]?.id || 'stylist-marcus');
  const [serviceName, setServiceName] = useState("Gentleman's Grooming");
  const [beverageChoice, setBeverageChoice] = useState('Oat Milk Latte');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;
    onCheckIn({
      clientName,
      stylistId,
      serviceName,
      beverageChoice,
      estimatedWaitMins: 10,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl border border-zinc-200 shadow-2xl max-w-md w-full overflow-hidden">
        <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-zinc-900" />
            <h3 className="text-base font-semibold text-zinc-900">Walk-in Client Check-in</h3>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
              Client Name
            </label>
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. Taylor Barnes"
              className="w-full min-h-[44px] px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
              Contact Phone (for SMS Ready alert)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 000-0000"
              className="w-full min-h-[44px] px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
              Requested Service
            </label>
            <select
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="w-full min-h-[44px] px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
            >
              <option value="Blowout & Style">Blowout & Style ($75)</option>
              <option value="Gentleman's Grooming">Gentleman's Grooming ($85)</option>
              <option value="Single Process Touchup">Single Process Touchup ($120)</option>
              <option value="Beard Sculpt">Beard Sculpt ($45)</option>
              <option value="Scalp Detox Treatment">Scalp Detox Treatment ($95)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
              Assigned First Available Stylist
            </label>
            <select
              value={stylistId}
              onChange={(e) => setStylistId(e.target.value)}
              className="w-full min-h-[44px] px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
            >
              {stylists.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
              Lounge Beverage Preference
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['Oat Milk Latte', 'Chamomile Tea', 'Sparkling Lime', 'Iced Matcha'].map((bev) => (
                <button
                  type="button"
                  key={bev}
                  onClick={() => setBeverageChoice(bev)}
                  className={`p-2.5 rounded-lg border text-left font-medium transition-colors ${
                    beverageChoice === bev
                      ? 'border-zinc-900 bg-zinc-900 text-white'
                      : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  {bev}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Estimated wait: 10 minutes at Lounge Sofa B. Stylist notified.</span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 rounded-lg bg-zinc-100 text-zinc-700 hover:bg-zinc-200 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-5 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 text-sm font-medium shadow-xs"
            >
              Check-in to Lounge
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
