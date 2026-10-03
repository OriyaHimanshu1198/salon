import React, { useState, useEffect } from 'react';
import { X, UserCheck, Save } from 'lucide-react';
import { Client, Stylist } from '../../types/salon';

interface EditClientModalProps {
  isOpen: boolean;
  client: Client | null;
  stylists: Stylist[];
  onClose: () => void;
  onSaveClient: (updatedClient: Client) => void;
}

export const EditClientModal: React.FC<EditClientModalProps> = ({
  isOpen,
  client,
  stylists,
  onClose,
  onSaveClient,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [vipTier, setVipTier] = useState<Client['vipTier']>('Standard');
  const [currentStatus, setCurrentStatus] = useState<Client['currentStatus']>('Active');
  const [primaryStylist, setPrimaryStylist] = useState('');
  const [baseFormulaText, setBaseFormulaText] = useState('');
  const [tonerFormulaText, setTonerFormulaText] = useState('');
  const [sensoryPref, setSensoryPref] = useState('');

  useEffect(() => {
    if (client) {
      setName(client.name);
      setPhone(client.phone);
      setEmail(client.email);
      setVipTier(client.vipTier || 'Standard');
      setCurrentStatus(client.currentStatus);
      setPrimaryStylist(client.primaryStylist);
      setBaseFormulaText(client.baseFormula?.details || '');
      setTonerFormulaText(client.tonerFormula?.details || '');
      setSensoryPref(client.sensoryNotes?.[0] || '');
    }
  }, [client, isOpen]);

  if (!isOpen || !client) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const names = name.trim().split(' ');
    const initials =
      names.length > 1
        ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
        : names[0].slice(0, 2).toUpperCase();

    const updated: Client = {
      ...client,
      name: name.trim(),
      initials,
      phone: phone.trim(),
      email: email.trim(),
      vipTier: vipTier === 'Standard' ? undefined : vipTier,
      currentStatus,
      primaryStylist,
      baseFormula: baseFormulaText.trim()
        ? {
            title: client.baseFormula?.title || 'Base Regrowth Formula',
            details: baseFormulaText.trim(),
            developer: client.baseFormula?.developer || '20 Vol (6%)',
            time: client.baseFormula?.time || '35 mins',
          }
        : client.baseFormula,
      tonerFormula: tonerFormulaText.trim()
        ? {
            title: client.tonerFormula?.title || 'Toner Glaze Formula',
            details: tonerFormulaText.trim(),
            solution: client.tonerFormula?.solution || 'Processing Solution 1:1',
            time: client.tonerFormula?.time || '15 mins',
          }
        : client.tonerFormula,
      activeFormulaSnippet: baseFormulaText.trim() || client.activeFormulaSnippet,
      sensoryNotes: sensoryPref ? [sensoryPref] : client.sensoryNotes,
    };

    onSaveClient(updated);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-client-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-xl w-full overflow-hidden my-8 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 px-6 border-b border-zinc-200 flex items-center justify-between bg-zinc-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-xs">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 id="edit-client-title" className="text-base font-bold text-zinc-950">
                Edit Client Profile
              </h3>
              <p className="text-xs text-zinc-500">Update guest contact, formulas, tier, and assigned stylist.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full min-h-[42px] px-3 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Mobile Phone</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full min-h-[42px] px-3 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full min-h-[42px] px-3 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">VIP Membership Tier</label>
              <select
                value={vipTier}
                onChange={(e) => setVipTier(e.target.value as Client['vipTier'])}
                className="w-full min-h-[42px] px-3 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none cursor-pointer"
              >
                <option value="Standard">Standard Guest</option>
                <option value="VIP Gold">VIP Gold</option>
                <option value="VIP Platinum">VIP Platinum</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Salon Status</label>
              <select
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value as any)}
                className="w-full min-h-[42px] px-3 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="In-Service">In-Service</option>
                <option value="Waiting">Waiting</option>
                <option value="Lapsed">Lapsed</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Primary Stylist</label>
              <select
                value={primaryStylist}
                onChange={(e) => setPrimaryStylist(e.target.value)}
                className="w-full min-h-[42px] px-3 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none cursor-pointer"
              >
                {stylists.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700">Base Technical Formula</label>
            <input
              type="text"
              value={baseFormulaText}
              onChange={(e) => setBaseFormulaText(e.target.value)}
              placeholder="e.g. Wella Koleston 6/0 (30g) + 6/71 (15g) + 20 Vol (45g)"
              className="w-full min-h-[42px] px-3 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700">Toner & Gloss Formula</label>
            <input
              type="text"
              value={tonerFormulaText}
              onChange={(e) => setTonerFormulaText(e.target.value)}
              placeholder="e.g. Redken Shades EQ 09P (20g) + 09V (20g) + Clear (20g)"
              className="w-full min-h-[42px] px-3 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700">Sensory & Hospitality Preference</label>
            <input
              type="text"
              value={sensoryPref}
              onChange={(e) => setSensoryPref(e.target.value)}
              placeholder="e.g. Sparkling water with lemon, silent service preference"
              className="w-full min-h-[42px] px-3 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 px-6 bg-zinc-50 border-t border-zinc-200 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-4 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="min-h-[44px] px-5 rounded-lg bg-zinc-900 hover:bg-zinc-800 active:bg-black text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};
