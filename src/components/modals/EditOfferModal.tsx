import React, { useState, useEffect } from 'react';
import {
  X,
  Tag,
  Percent,
  DollarSign,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  CheckCircle,
  Tablet,
  Calendar,
  Save,
} from 'lucide-react';
import { OfferCampaign } from '../../types/salon';

interface EditOfferModalProps {
  isOpen: boolean;
  offer: OfferCampaign | null;
  onClose: () => void;
  onSaveOffer: (updatedOffer: OfferCampaign) => void;
}

export const EditOfferModal: React.FC<EditOfferModalProps> = ({
  isOpen,
  offer,
  onClose,
  onSaveOffer,
}) => {
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [incentiveType, setIncentiveType] = useState<'pct' | 'fixed' | 'therapy' | 'retail'>('pct');
  const [discountValue, setDiscountValue] = useState('15');
  const [targetEligibility, setTargetEligibility] = useState('All Salon Guests');
  const [inventoryScope, setInventoryScope] = useState('Retail Inventory Only (Oribe, Olaplex)');
  const [poolType, setPoolType] = useState<'unlimited' | 'capped'>('unlimited');
  const [poolCount, setPoolCount] = useState('100');
  const [status, setStatus] = useState<'Active' | 'Scheduled' | 'Expiring Soon' | 'Archived'>('Active');
  const [commissionProtection, setCommissionProtection] = useState(true);
  const [activeOnPos, setActiveOnPos] = useState(true);
  const [checkoutTrigger, setCheckoutTrigger] = useState('Manual Code Entry at Register');

  useEffect(() => {
    if (offer) {
      setCode(offer.code);
      setTitle(offer.title);
      setSubtitle(offer.subtitle || '');
      setIncentiveType(offer.incentiveType);
      // Extract numeric value from description if possible
      const match = offer.discountValueDescription.match(/\d+/);
      setDiscountValue(match ? match[0] : '15');
      setTargetEligibility(offer.targetEligibility);
      setInventoryScope(offer.inventoryScope);
      if (typeof offer.poolLimit === 'number') {
        setPoolType('capped');
        setPoolCount(String(offer.poolLimit));
      } else {
        setPoolType('unlimited');
        setPoolCount('100');
      }
      setStatus(offer.status);
      setCommissionProtection(offer.commissionProtection);
      setActiveOnPos(offer.activeOnPos);
      setCheckoutTrigger(offer.checkoutTrigger);
    }
  }, [offer, isOpen]);

  if (!isOpen || !offer) return null;

  const getIncentiveHeadline = () => {
    if (incentiveType === 'pct') return `${discountValue}% Percentage Off`;
    if (incentiveType === 'fixed') return `$${discountValue} Fixed Dollar Off`;
    if (incentiveType === 'therapy') return 'Complimentary Scalp / Bond Therapy';
    return 'Retail Gift with Purchase Bundle';
  };

  const getDiscountDescription = () => {
    if (incentiveType === 'pct') return `${discountValue}% Off ${inventoryScope.split(' ')[0]} Items`;
    if (incentiveType === 'fixed') return `$${discountValue}.00 Off Eligible Services`;
    if (incentiveType === 'therapy') return `100% Free Therapy Add-on ($${discountValue || 45} value)`;
    return `Complimentary Retail Miniature with $${discountValue || 120}+ Ticket`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !title.trim()) return;

    const cleanCode = code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');

    const updated: OfferCampaign = {
      ...offer,
      code: cleanCode,
      title: title.trim(),
      subtitle: subtitle.trim() || `${cleanCode} Campaign Program`,
      incentiveType,
      incentiveHeadline: getIncentiveHeadline(),
      incentiveSub: inventoryScope,
      targetEligibility,
      poolLimit: poolType === 'unlimited' ? 'Unlimited' : Number(poolCount) || 100,
      status,
      discountValueDescription: getDiscountDescription(),
      inventoryScope,
      commissionProtection,
      checkoutTrigger,
      activeOnPos,
      liveSimulation: {
        ...offer.liveSimulation,
        vipTier: targetEligibility.includes('VIP') ? 'VIP Platinum Guest' : 'Verified Guest',
        discountAmount:
          incentiveType === 'pct'
            ? -((offer.liveSimulation.retailPrice * (Number(discountValue) || 15)) / 100)
            : incentiveType === 'fixed'
            ? -(Number(discountValue) || 25)
            : -45.0,
      },
    };

    onSaveOffer(updated);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-offer-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-4xl w-full overflow-hidden my-8 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 px-6 border-b border-zinc-200 flex items-center justify-between bg-zinc-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-xs">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="edit-offer-title" className="text-base font-bold text-zinc-950">
                  Edit Campaign: {offer.code}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-zinc-200 text-zinc-800">
                  ID: {offer.id}
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Modify promotional discount values, redemption rules, POS availability, and guest eligibility.
              </p>
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status & Code Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4 space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Promo Code (All Caps)</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full min-h-[42px] px-3 font-mono font-bold uppercase tracking-wider text-sm bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none"
              />
            </div>

            <div className="md:col-span-5 space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Campaign Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full min-h-[42px] px-3 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none"
              />
            </div>

            <div className="md:col-span-3 space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Lifecycle Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full min-h-[42px] px-3 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none cursor-pointer"
              >
                <option value="Active">Active (Live)</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Expiring Soon">Expiring Soon</option>
                <option value="Archived">Archived (Disabled)</option>
              </select>
            </div>
          </div>

          {/* Subtitle */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700">Description / Subtitle</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Internal campaign description or client-facing voucher note"
              className="w-full min-h-[40px] px-3 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none"
            />
          </div>

          {/* Incentive Type Segmented */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700">Incentive Architecture</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'pct', label: 'Percent Off (%)', icon: Percent },
                { id: 'fixed', label: 'Fixed Cash Off ($)', icon: DollarSign },
                { id: 'therapy', label: 'Free Add-on Ritual', icon: Sparkles },
                { id: 'retail', label: 'Retail Bundle Perk', icon: ShoppingBag },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = incentiveType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIncentiveType(item.id as any)}
                    className={`min-h-[44px] p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      isSelected
                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                        : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Discount Value & Inventory Scope */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                {incentiveType === 'pct'
                  ? 'Discount Percentage (%)'
                  : incentiveType === 'fixed'
                  ? 'Dollar Value ($ off)'
                  : 'Approx. Retail Value ($)'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  className="w-full min-h-[42px] px-3 pr-10 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">
                  {incentiveType === 'pct' ? '%' : '$'}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Target Eligibility</label>
              <select
                value={targetEligibility}
                onChange={(e) => setTargetEligibility(e.target.value)}
                className="w-full min-h-[42px] px-3 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none cursor-pointer"
              >
                <option value="All Salon Guests">All Salon Guests</option>
                <option value="VIP Platinum & Gold">VIP Platinum & Gold Only</option>
                <option value="First-Time Guests Only">First-Time Guests Only</option>
                <option value="Chemical Color Clients">Chemical Color & Balayage Clients</option>
                <option value="Lapsed Clients (90+ Days)">Lapsed Clients (90+ Days)</option>
              </select>
            </div>
          </div>

          {/* Inventory Scope & Trigger */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Applicable Scope</label>
              <input
                type="text"
                value={inventoryScope}
                onChange={(e) => setInventoryScope(e.target.value)}
                className="w-full min-h-[42px] px-3 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">POS Trigger Rule</label>
              <select
                value={checkoutTrigger}
                onChange={(e) => setCheckoutTrigger(e.target.value)}
                className="w-full min-h-[42px] px-3 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none cursor-pointer"
              >
                <option value="Manual Code Entry at Register">Manual Code Entry at Register</option>
                <option value="Auto-Apply on VIP Client Detection">Auto-Apply on VIP Client Detection</option>
                <option value="Auto-Apply on First-Time Guest Profile">Auto-Apply on First-Time Guest Profile</option>
                <option value="When Balayage or Full Highlights Selected">When Balayage or Full Highlights Selected</option>
              </select>
            </div>
          </div>

          {/* Limits & POS switches */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-zinc-100">
            {/* Pool Limit */}
            <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-900">Redemption Pool Cap</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPoolType('unlimited')}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                      poolType === 'unlimited' ? 'bg-zinc-900 text-white' : 'bg-zinc-200 text-zinc-700'
                    }`}
                  >
                    Unlimited
                  </button>
                  <button
                    type="button"
                    onClick={() => setPoolType('capped')}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                      poolType === 'capped' ? 'bg-zinc-900 text-white' : 'bg-zinc-200 text-zinc-700'
                    }`}
                  >
                    Capped
                  </button>
                </div>
              </div>
              {poolType === 'capped' && (
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs text-zinc-500">Max Vouchers:</span>
                  <input
                    type="number"
                    value={poolCount}
                    onChange={(e) => setPoolCount(e.target.value)}
                    className="w-24 min-h-[36px] px-2 text-xs bg-white border border-zinc-300 rounded font-mono font-bold"
                  />
                  <span className="text-[11px] text-zinc-400">Current used: {offer.redemptionsUsed}</span>
                </div>
              )}
            </div>

            {/* POS Sync Toggle */}
            <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/70 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-zinc-900 block">Instant POS Express Sync</span>
                <span className="text-[11px] text-zinc-500">Callable across all front-desk terminals</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveOnPos(!activeOnPos)}
                className={`w-11 h-6 rounded-full relative inline-flex items-center p-0.5 transition-colors cursor-pointer ${
                  activeOnPos ? 'bg-zinc-900' : 'bg-zinc-300'
                }`}
              >
                <span
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    activeOnPos ? 'translate-x-5' : 'translate-x-0'
                  }`}
                ></span>
              </button>
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="p-4 px-6 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-zinc-500 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Updated changes will sync immediately to POS ledger</span>
          </div>

          <div className="flex items-center gap-3">
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
              <span>Save Campaign Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
