import React, { useState } from 'react';
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
  Layers,
  ArrowRight,
} from 'lucide-react';
import { OfferCampaign } from '../../types/salon';

interface CreateOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateOffer: (offer: OfferCampaign) => void;
}

export const CreateOfferModal: React.FC<CreateOfferModalProps> = ({
  isOpen,
  onClose,
  onCreateOffer,
}) => {
  // Form fields
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [incentiveType, setIncentiveType] = useState<'pct' | 'fixed' | 'therapy' | 'retail'>('pct');
  const [discountValue, setDiscountValue] = useState('15');
  const [targetEligibility, setTargetEligibility] = useState('All Salon Guests');
  const [inventoryScope, setInventoryScope] = useState('Retail Inventory Only (Oribe, Olaplex)');
  const [poolType, setPoolType] = useState<'unlimited' | 'capped'>('unlimited');
  const [poolCount, setPoolCount] = useState('100');
  const [status, setStatus] = useState<'Active' | 'Scheduled' | 'Expiring Soon'>('Active');
  const [commissionProtection, setCommissionProtection] = useState(true);
  const [activeOnPos, setActiveOnPos] = useState(true);
  const [checkoutTrigger, setCheckoutTrigger] = useState('Manual Code Entry at Register');

  if (!isOpen) return null;

  // Preset Template Quick-fills
  const handleApplyPreset = (preset: {
    code: string;
    title: string;
    subtitle: string;
    type: 'pct' | 'fixed' | 'therapy' | 'retail';
    val: string;
    eligibility: string;
    scope: string;
    trigger: string;
  }) => {
    setCode(preset.code);
    setTitle(preset.title);
    setSubtitle(preset.subtitle);
    setIncentiveType(preset.type);
    setDiscountValue(preset.val);
    setTargetEligibility(preset.eligibility);
    setInventoryScope(preset.scope);
    setCheckoutTrigger(preset.trigger);
  };

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

    const newOffer: OfferCampaign = {
      id: `offer-${Date.now()}`,
      code: cleanCode,
      title: title.trim(),
      subtitle: subtitle.trim() || `${cleanCode} Campaign Program`,
      incentiveType,
      incentiveHeadline: getIncentiveHeadline(),
      incentiveSub: inventoryScope,
      targetEligibility,
      redemptionsUsed: 0,
      poolLimit: poolType === 'unlimited' ? 'Unlimited' : Number(poolCount) || 100,
      status: status as 'Active' | 'Scheduled' | 'Expiring Soon',
      discountValueDescription: getDiscountDescription(),
      inventoryScope,
      commissionProtection,
      checkoutTrigger,
      activeOnPos,
      liveSimulation: {
        client: 'Elena Rostova (Client)',
        vipTier: targetEligibility.includes('VIP') ? 'VIP Platinum Guest' : 'Verified Guest',
        ticketNum: `#TK-${Math.floor(1000 + Math.random() * 9000)}`,
        service: 'Designer Cut & Gloss Refresh',
        servicePrice: 180.0,
        retailItem: 'Oribe Gold Lust Nourishing Oil',
        retailPrice: 56.0,
        discountAmount:
          incentiveType === 'pct'
            ? -((56.0 * (Number(discountValue) || 15)) / 100)
            : incentiveType === 'fixed'
            ? -(Number(discountValue) || 25)
            : -45.0,
        totalAmount:
          incentiveType === 'pct'
            ? 180.0 + 56.0 - (56.0 * (Number(discountValue) || 15)) / 100
            : incentiveType === 'fixed'
            ? Math.max(0, 180.0 + 56.0 - (Number(discountValue) || 25))
            : 180.0 + 56.0 - 45.0,
      },
    };

    onCreateOffer(newOffer);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-offer-title"
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
              <h3 id="create-offer-title" className="text-base font-bold text-zinc-950">
                Create Promotional Offer & Voucher
              </h3>
              <p className="text-xs text-zinc-500">
                Configure campaign rules, discount values, eligible guest tiers, and instant POS terminal synchronization.
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

        {/* Modal Body - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick-Fill Preset Templates */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Quick-Start Campaign Templates
              </label>
              <span className="text-[11px] text-zinc-400">1-click configuration presets</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() =>
                  handleApplyPreset({
                    code: 'VIP15-RETAIL',
                    title: 'VIP Client Tier: 15% Off All Take-Home Products',
                    subtitle: 'Exclusive Retail Appreciation Benefit',
                    type: 'pct',
                    val: '15',
                    eligibility: 'VIP Platinum & Gold',
                    scope: 'Retail Inventory Only (Oribe, Olaplex)',
                    trigger: 'Auto-Apply on VIP Client Detection',
                  })
                }
                className="p-3 text-left rounded-xl border border-zinc-200 bg-zinc-50/70 hover:bg-zinc-100/80 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between font-mono text-xs font-bold text-zinc-900">
                  <span>VIP15-RETAIL</span>
                  <Percent className="w-3.5 h-3.5 text-zinc-500" />
                </div>
                <div className="text-[11px] text-zinc-600 mt-1 line-clamp-1">
                  15% Off Luxury Retail Take-Home
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleApplyPreset({
                    code: 'GLAZE-REFRESH-25',
                    title: 'Mid-Season Toner & Acidic Glaze Perk',
                    subtitle: 'Color Maintenance Support',
                    type: 'fixed',
                    val: '25',
                    eligibility: 'Chemical Color Clients',
                    scope: 'Service Add-on Tier',
                    trigger: 'When Balayage or Full Highlights Selected',
                  })
                }
                className="p-3 text-left rounded-xl border border-zinc-200 bg-zinc-50/70 hover:bg-zinc-100/80 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between font-mono text-xs font-bold text-zinc-900">
                  <span>GLAZE-REFRESH-25</span>
                  <DollarSign className="w-3.5 h-3.5 text-zinc-500" />
                </div>
                <div className="text-[11px] text-zinc-600 mt-1 line-clamp-1">
                  $25 Off Glaze & Bonding Wash
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleApplyPreset({
                    code: 'HEADSPA-DETOX',
                    title: 'First-Visit Botanical Headspa Ritual',
                    subtitle: 'Scalp & Cuticle Health Welcome',
                    type: 'therapy',
                    val: '45',
                    eligibility: 'First-Time Guests Only',
                    scope: 'Botanical Spa Rituals & Basin Add-ons',
                    trigger: 'Auto-Apply on First-Time Guest Profile',
                  })
                }
                className="p-3 text-left rounded-xl border border-zinc-200 bg-zinc-50/70 hover:bg-zinc-100/80 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between font-mono text-xs font-bold text-zinc-900">
                  <span>HEADSPA-DETOX</span>
                  <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
                </div>
                <div className="text-[11px] text-zinc-600 mt-1 line-clamp-1">
                  Free 20-min Basin Scrub ($45 val)
                </div>
              </button>
            </div>
          </div>

          <div className="h-px bg-zinc-200"></div>

          {/* Section 1: Campaign Identity & Voucher Code */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-zinc-500" />
              <span>1. Campaign Identification & Voucher Code</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-4">
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Voucher / Promo Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. VIP20"
                  className="w-full min-h-[44px] px-3.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 font-mono font-bold tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
                />
                <span className="text-[11px] text-zinc-400 mt-1 block">
                  Uppercase alphanumeric code entered at POS
                </span>
              </div>

              <div className="md:col-span-8">
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Campaign Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Autumn Scalp Recovery & Hydration Benefit"
                  className="w-full min-h-[44px] px-3.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
                />
              </div>

              <div className="md:col-span-12">
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Campaign Subtitle / Marketing Program
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Luxury Hair Wellness Initiative · Valid on All Stations"
                  className="w-full min-h-[44px] px-3.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-zinc-200"></div>

          {/* Section 2: Incentive Type & Discount Calculation */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
              <Percent className="w-4 h-4 text-zinc-500" />
              <span>2. Incentive Type & Value</span>
            </h4>

            {/* Segmented Type Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-zinc-100 p-1.5 rounded-xl border border-zinc-200">
              <button
                type="button"
                onClick={() => setIncentiveType('pct')}
                className={`min-h-[40px] px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  incentiveType === 'pct'
                    ? 'bg-white text-zinc-950 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                <Percent className="w-4 h-4" />
                <span>Percentage Off</span>
              </button>
              <button
                type="button"
                onClick={() => setIncentiveType('fixed')}
                className={`min-h-[40px] px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  incentiveType === 'fixed'
                    ? 'bg-white text-zinc-950 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Fixed Amount ($)</span>
              </button>
              <button
                type="button"
                onClick={() => setIncentiveType('therapy')}
                className={`min-h-[40px] px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  incentiveType === 'therapy'
                    ? 'bg-white text-zinc-950 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Free Treatment</span>
              </button>
              <button
                type="button"
                onClick={() => setIncentiveType('retail')}
                className={`min-h-[40px] px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  incentiveType === 'retail'
                    ? 'bg-white text-zinc-950 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Retail Gift</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  {incentiveType === 'pct'
                    ? 'Percentage Discount (%)'
                    : incentiveType === 'fixed'
                    ? 'Dollar Value ($)'
                    : 'Estimated Treatment / Perk Value ($)'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max={incentiveType === 'pct' ? '100' : '1000'}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full min-h-[44px] pl-4 pr-10 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">
                    {incentiveType === 'pct' ? '%' : '$'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Inventory & Service Scope
                </label>
                <select
                  value={inventoryScope}
                  onChange={(e) => setInventoryScope(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white"
                >
                  <option value="Retail Inventory Only (Oribe, Olaplex)">
                    Retail Inventory Only (Oribe, K18, Olaplex)
                  </option>
                  <option value="Service Add-on Tier">Service Add-on Tier (Toners, Gloss, Deep Bond)</option>
                  <option value="All Color & Chemical Services">All Color & Chemical Transformations</option>
                  <option value="Botanical Spa Rituals & Basin Add-ons">
                    Botanical Spa Rituals & Basin Treatments
                  </option>
                  <option value="Full Salon Services & Retail">Full Salon Storewide (Services & Products)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="h-px bg-zinc-200"></div>

          {/* Section 3: Audience Eligibility & Pool Limits */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-zinc-500" />
              <span>3. Target Audience & Redemption Pool</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Target Eligibility
                </label>
                <select
                  value={targetEligibility}
                  onChange={(e) => setTargetEligibility(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white"
                >
                  <option value="All Salon Guests">All Salon Guests</option>
                  <option value="VIP Platinum & Gold">VIP Platinum & Gold Guests</option>
                  <option value="First-Time Guests Only">First-Time Guests Only</option>
                  <option value="Chemical Color Clients">Chemical Color & Highlights Clients</option>
                  <option value="Lapsed Guests (>60d)">Lapsed Guests (&gt;60 Days Inactive)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Redemption Pool Limit
                </label>
                <div className="flex gap-2">
                  <select
                    value={poolType}
                    onChange={(e) => setPoolType(e.target.value as any)}
                    className="w-1/2 min-h-[44px] px-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  >
                    <option value="unlimited">Unlimited</option>
                    <option value="capped">Capped Pool</option>
                  </select>
                  {poolType === 'capped' ? (
                    <input
                      type="number"
                      min="1"
                      value={poolCount}
                      onChange={(e) => setPoolCount(e.target.value)}
                      placeholder="e.g. 100"
                      className="w-1/2 min-h-[44px] px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-mono font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    />
                  ) : (
                    <div className="w-1/2 min-h-[44px] px-3 bg-zinc-100 border border-zinc-200 rounded-lg text-xs text-zinc-500 flex items-center justify-center font-medium">
                      No Limit
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Initial Campaign Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full min-h-[44px] px-3.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white"
                >
                  <option value="Active">Active (Immediately Live)</option>
                  <option value="Scheduled">Scheduled (Upcoming)</option>
                  <option value="Expiring Soon">Expiring Soon</option>
                </select>
              </div>
            </div>
          </div>

          <div className="h-px bg-zinc-200"></div>

          {/* Section 4: POS Behavior & Commission Protections */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
              <Tablet className="w-4 h-4 text-zinc-500" />
              <span>4. POS Terminal Rules & Staff Commission Safeguards</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* POS Active Switch */}
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                    <Tablet className="w-4 h-4 text-zinc-600" />
                    <span>Active on Express POS</span>
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    Instantly available on front desk registers and iPads
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveOnPos(!activeOnPos)}
                  className={`w-12 h-6 rounded-full relative inline-flex items-center p-0.5 transition-colors ${
                    activeOnPos ? 'bg-zinc-900' : 'bg-zinc-300'
                  }`}
                >
                  <span
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      activeOnPos ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </button>
              </div>

              {/* Commission Protection Switch */}
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Stylist Commission Protection</span>
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    Calculates commission on full gross MSRP before discounts
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCommissionProtection(!commissionProtection)}
                  className={`w-12 h-6 rounded-full relative inline-flex items-center p-0.5 transition-colors ${
                    commissionProtection ? 'bg-zinc-900' : 'bg-zinc-300'
                  }`}
                >
                  <span
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      commissionProtection ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Checkout Trigger Mechanism
              </label>
              <select
                value={checkoutTrigger}
                onChange={(e) => setCheckoutTrigger(e.target.value)}
                className="w-full min-h-[44px] px-3.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white"
              >
                <option value="Manual Code Entry at Register">
                  Manual Code Entry at Register (Front Desk / Client)
                </option>
                <option value="Auto-Apply on VIP Client Detection">
                  Automatic: VIP Guest Profile Detected
                </option>
                <option value="When Balayage or Full Highlights Selected">
                  Automatic: Qualifying Color Service in Ticket
                </option>
                <option value="When Ticket Subtotal Exceeds $150">
                  Automatic: Ticket Subtotal &gt; $150 Threshold
                </option>
              </select>
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="p-4 rounded-xl bg-zinc-900 text-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                Live Terminal Preview Simulation
              </span>
              <span className="text-[10px] font-mono font-semibold bg-white/10 px-2 py-0.5 rounded text-zinc-300">
                CODE: {code ? code.toUpperCase() : 'CODE-PREVIEW'}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-white/10">
              <div>
                <div className="text-sm font-bold text-white">
                  {title || 'Campaign Title Preview'}
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">
                  {getDiscountDescription()} · {targetEligibility}
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {incentiveType === 'pct' ? `-${discountValue}% off` : `-$${discountValue || 25}`}
                </span>
                <span className="text-[10px] text-zinc-400 block">
                  {commissionProtection ? '100% Comm. Protected' : 'Discount Subsidized'}
                </span>
              </div>
            </div>
          </div>
        </form>

        {/* Modal Footer Actions */}
        <div className="p-4 px-6 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-xs font-semibold text-zinc-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!code.trim() || !title.trim()}
            className="min-h-[44px] px-6 rounded-lg bg-zinc-900 hover:bg-zinc-800 active:bg-black text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Create Campaign & Push to POS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
