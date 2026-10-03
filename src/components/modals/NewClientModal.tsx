import React, { useState } from 'react';
import { X, UserPlus, Phone, Mail } from 'lucide-react';
import { Client, Stylist } from '../../types/salon';

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  stylists: Stylist[];
  onAddClient: (newClient: Client) => void;
}

export const NewClientModal: React.FC<NewClientModalProps> = ({
  isOpen,
  onClose,
  stylists,
  onAddClient,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [vipTier, setVipTier] = useState<'Standard' | 'VIP' | 'VIP Platinum'>('Standard');
  const [primaryStylist, setPrimaryStylist] = useState(stylists[0]?.name || 'Elena Rostova');
  const [sensoryPref, setSensoryPref] = useState('Silent service preferred during processing');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const names = name.trim().split(' ');
    const initials =
      names.length > 1
        ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
        : names[0].slice(0, 2).toUpperCase();

    const client: Client = {
      id: `client-${Date.now()}`,
      name: name.trim(),
      initials,
      phone: phone || '(555) 000-0000',
      email: email || `${names[0].toLowerCase()}@example.com`,
      membershipDate: 'October 2026',
      vipTier: vipTier === 'Standard' ? undefined : vipTier,
      currentStatus: 'Active',
      primaryStylist,
      totalVisits: 1,
      avgTicket: 160,
      rebookRate: 85,
      ltv: 160,
      sensoryNotes: sensoryPref ? [sensoryPref] : [],
      history: [
        {
          id: `hist-${Date.now()}`,
          title: 'Initial Consultation & Designer Cut',
          date: 'Today',
          stylist: primaryStylist,
          status: 'Completed',
          paymentMethod: 'Paid • Card',
          totalAmount: 160.0,
        },
      ],
    };

    onAddClient(client);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl border border-zinc-200 shadow-2xl max-w-md w-full overflow-hidden">
        <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-zinc-900" />
            <h3 className="text-base font-semibold text-zinc-900">Add New Salon Client</h3>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vivienne Westwood"
              className="w-full min-h-[44px] px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                Phone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(415) 555-0199"
                  className="w-full min-h-[44px] pl-9 pr-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full min-h-[44px] pl-9 pr-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                Loyalty Tier
              </label>
              <select
                value={vipTier}
                onChange={(e) => setVipTier(e.target.value as any)}
                className="w-full min-h-[44px] px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
              >
                <option value="Standard">Standard Guest</option>
                <option value="VIP">VIP Tier</option>
                <option value="VIP Platinum">VIP Platinum</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                Primary Stylist
              </label>
              <select
                value={primaryStylist}
                onChange={(e) => setPrimaryStylist(e.target.value)}
                className="w-full min-h-[44px] px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
              >
                {stylists.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
              Sensory / Hospitality Protocol Note
            </label>
            <input
              type="text"
              value={sensoryPref}
              onChange={(e) => setSensoryPref(e.target.value)}
              placeholder="e.g. Sensitive scalp, Chamomile tea with oat milk"
              className="w-full min-h-[44px] px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
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
              Save Client Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
