import React, { useState } from 'react';
import {
  CreditCard,
  Printer,
  MoreVertical,
  Scissors,
  Droplet,
  Split,
  Plus,
  Tag,
  CheckCircle,
  XCircle,
  Lock,
  Smartphone,
  Gift,
  Coins,
  CalendarCheck,
  Check,
  RotateCw,
  Info,
  ChevronDown,
} from 'lucide-react';
import { CheckoutTicket, RetailProduct } from '../../types/salon';
import { INITIAL_TICKETS } from '../../data/mockData';

interface ExpressCheckoutViewProps {
  onShowToast: (msg: string) => void;
  onPaymentSuccess: (ticketNumber: string, amount: number) => void;
}

export const ExpressCheckoutView: React.FC<ExpressCheckoutViewProps> = ({
  onShowToast,
  onPaymentSuccess,
}) => {
  const [tickets] = useState<CheckoutTicket[]>(INITIAL_TICKETS);
  const [currentTicketIndex, setCurrentTicketIndex] = useState(0);
  const [isSwitchMenuOpen, setIsSwitchMenuOpen] = useState(false);

  const activeTicket = tickets[currentTicketIndex] || tickets[0];

  const [retailProducts] = useState<RetailProduct[]>([]);
  const [promoCodeInput, setPromoCodeInput] = useState(activeTicket.promoCode || 'VIP10');
  const [promoApplied, setPromoApplied] = useState(true);
  const [selectedTipPercentage, setSelectedTipPercentage] = useState<number>(20);
  const [customTipAmount, setCustomTipAmount] = useState<number | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'gift' | 'cash' | 'split'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentApproved, setPaymentApproved] = useState(false);
  const [rebookPromptChecked, setRebookPromptChecked] = useState(true);
  const [readerPinging, setReaderPinging] = useState(false);

  // Financial calculations
  const servicesSubtotal = activeTicket.services.reduce((acc, s) => acc + s.price, 0);

  const retailSubtotal = retailProducts.reduce(
    (acc, p) => acc + p.price * p.quantityInCart,
    0
  );

  // VIP10 gives 10% discount on retail
  const discountAmount = promoApplied && promoCodeInput.toUpperCase() === 'VIP10'
    ? retailSubtotal * 0.1
    : 0;

  const preDiscountTotal = servicesSubtotal + retailSubtotal;
  const taxableTotal = servicesSubtotal + (retailSubtotal - discountAmount);
  const stateTax = taxableTotal * 0.08875;

  const tipAmount =
    customTipAmount !== null
      ? customTipAmount
      : (servicesSubtotal * selectedTipPercentage) / 100;

  const grandTotal = taxableTotal + stateTax + tipAmount;

  // Handlers
  const handleApplyPromo = () => {
    if (promoCodeInput.trim().toUpperCase() === 'VIP10') {
      setPromoApplied(true);
      onShowToast('VIP10 applied (-10% on retail products)');
    } else if (promoCodeInput.trim()) {
      onShowToast(`Promo code ${promoCodeInput} applied successfully`);
      setPromoApplied(true);
    }
  };

  const handleClearPromo = () => {
    setPromoApplied(false);
    setPromoCodeInput('');
    onShowToast('Promotion removed');
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentApproved(true);
      onShowToast(`Card authorized: $${grandTotal.toFixed(2)} charged to Terminal Lane 01`);
      onPaymentSuccess(activeTicket.ticketNumber, grandTotal);
    }, 1500);
  };

  const handlePingReader = () => {
    setReaderPinging(true);
    setTimeout(() => {
      setReaderPinging(false);
      onShowToast('Aura Lane-01 Reader: 100% Signal • 98% Battery • Active');
    }, 800);
  };

  return (
    <div className="flex flex-col w-full p-6 space-y-6 max-w-7xl mx-auto pb-20">
      {/* Top Ticket Command Bar */}
      <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-zinc-950">
              Express Checkout #{activeTicket.ticketNumber}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-600 animate-pulse"></span>
              {paymentApproved ? 'Paid & Closed' : activeTicket.status}
            </span>
          </div>

          <div className="h-6 w-px bg-zinc-200 hidden sm:block"></div>

          {/* Active Client & Station Pill */}
          <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-200 px-3.5 py-1.5 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-zinc-200 text-zinc-800 flex items-center justify-center font-bold text-xs">
              {activeTicket.clientInitials}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-zinc-950 leading-tight">
                {activeTicket.clientName}
              </span>
              <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                <span>{activeTicket.stylistName}</span>
                <span>•</span>
                <span className="text-zinc-900 font-semibold">{activeTicket.station}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Utilities */}
        <div className="flex items-center gap-2">
          {/* Switch Ticket Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSwitchMenuOpen(!isSwitchMenuOpen)}
              className="min-h-[44px] px-3.5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Split className="w-4 h-4 text-zinc-500" />
              <span>Switch Ticket ({tickets.length} Open)</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            </button>

            {isSwitchMenuOpen && (
              <div className="absolute right-0 mt-1 w-64 bg-white border border-zinc-200 rounded-xl shadow-lg p-1.5 z-40">
                <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 px-2 py-1">
                  Active POS Tickets
                </div>
                {tickets.map((t, idx) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setCurrentTicketIndex(idx);
                      setIsSwitchMenuOpen(false);
                      setPaymentApproved(false);
                      onShowToast(`Switched to Ticket #${t.ticketNumber} (${t.clientName})`);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-xs text-left ${
                      idx === currentTicketIndex
                        ? 'bg-zinc-100 font-semibold text-zinc-900'
                        : 'text-zinc-600 hover:bg-zinc-50'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-zinc-900">
                        #{t.ticketNumber} - {t.clientName}
                      </div>
                      <div className="text-[11px] text-zinc-500">{t.station}</div>
                    </div>
                    {idx === currentTicketIndex && <Check className="w-4 h-4 text-zinc-900" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => onShowToast(`Printing receipt for ticket #${activeTicket.ticketNumber}...`)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-600 hover:text-zinc-900 transition-colors"
            title="Print preview"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={() => onShowToast('Ticket held in front desk queue')}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg bg-zinc-100 hover:bg-rose-100 hover:text-rose-800 border border-zinc-200 text-zinc-600 transition-colors"
            title="Void or Hold Ticket"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Items, Stylist splits, Retail upsells, Tips (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Billed Services Panel */}
          <div className="bg-white rounded-xl border border-zinc-200 shadow-xs p-5">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <Scissors className="w-5 h-5 text-zinc-500" />
                <h2 className="text-base font-semibold text-zinc-950">Billed Services</h2>
                <span className="bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs px-2.5 py-0.5 rounded-full font-medium ml-1">
                  {activeTicket.services.length} items
                </span>
              </div>
              <button
                onClick={() => onShowToast('Add custom service modal opened')}
                className="min-h-[40px] px-3 text-zinc-900 hover:bg-zinc-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Custom Service</span>
              </button>
            </div>

            <div className="space-y-3">
              {activeTicket.services.map((service) => (
                <div
                  key={service.id}
                  className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 hover:bg-zinc-100/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-800 shrink-0 shadow-2xs">
                      {service.isAddon ? (
                        <Droplet className="w-5 h-5 text-zinc-600" />
                      ) : (
                        <Scissors className="w-5 h-5 text-zinc-600" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-zinc-950 leading-tight">
                        {service.name}
                      </div>
                      <div className="text-xs text-zinc-500 flex items-center gap-2 mt-1">
                        {service.isAddon && (
                          <span className="bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.2 rounded text-[10px]">
                            Add-on
                          </span>
                        )}
                        <span>
                          Stylist:{' '}
                          <strong className="text-zinc-900 font-medium">{service.stylist}</strong> (
                          {service.stylistLevel})
                        </span>
                        <span>•</span>
                        <span>{service.durationMin} min</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-0 border-zinc-200">
                    <button
                      onClick={() => onShowToast(`Split stylist commission opened for ${service.name}`)}
                      className="min-h-[36px] px-2 text-zinc-500 hover:text-zinc-900 text-xs flex items-center gap-1 rounded hover:bg-white"
                    >
                      <Split className="w-3.5 h-3.5" />
                      <span>Split Stylist</span>
                    </button>
                    <div className="text-base font-bold text-zinc-950 font-mono text-right min-w-[70px]">
                      ${service.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Promo / Discount & Tip Matrix */}
          <div className="bg-white rounded-xl border border-zinc-200 shadow-xs p-5 space-y-5">
            {/* Discount Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-zinc-900 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-zinc-500" />
                  Promotions & Loyalty Vouchers
                </label>
                {promoApplied && (
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    VIP10 Active (-10% on Retail)
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                    placeholder="Enter promo code (e.g. VIP10)"
                    className="w-full min-h-[44px] px-4 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white"
                  />
                  {promoCodeInput && (
                    <button
                      onClick={handleClearPromo}
                      className="absolute right-2 top-1/2 -translate-y-1/2 min-h-[36px] px-2 text-zinc-400 hover:text-rose-600 text-xs"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <button
                  onClick={handleApplyPromo}
                  className="min-h-[44px] px-5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-900 rounded-lg text-xs font-semibold transition-colors"
                >
                  Apply Code
                </button>
              </div>
            </div>

            <div className="h-px bg-zinc-200"></div>

            {/* Stylist Tip Selection Matrix (iPad Front Desk Ergonomics) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-zinc-900">
                    Gratuity for Stylist
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Calculated on pre-discount services & treatments
                  </span>
                </div>
                <span className="text-[11px] bg-zinc-100 border border-zinc-200 text-zinc-800 px-2.5 py-1 rounded-full font-medium">
                  {activeTicket.stylistName}
                </span>
              </div>

              {/* Big Touch Targets (Minimum 44px, generous 64px height) */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[18, 20, 22, 25].map((pct) => {
                  const calcTip = (servicesSubtotal * pct) / 100;
                  const isSelected = selectedTipPercentage === pct && customTipAmount === null;
                  return (
                    <button
                      key={pct}
                      onClick={() => {
                        setSelectedTipPercentage(pct);
                        setCustomTipAmount(null);
                      }}
                      className={`min-h-[64px] p-2 rounded-lg flex flex-col items-center justify-center transition-all relative border ${
                        isSelected
                          ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                          : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 text-zinc-900'
                      }`}
                    >
                      {pct === 20 && (
                        <span className="absolute -top-2 px-2 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] rounded-full font-bold">
                          Popular
                        </span>
                      )}
                      <span className={`text-[11px] font-semibold ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                        {pct}%
                      </span>
                      <span className="text-sm font-bold font-mono">${calcTip.toFixed(2)}</span>
                    </button>
                  );
                })}

                {/* Custom Amount */}
                <button
                  onClick={() => {
                    const entered = prompt('Enter custom tip amount ($):', '30');
                    if (entered && !isNaN(Number(entered))) {
                      setCustomTipAmount(Number(entered));
                      onShowToast(`Custom tip set to $${Number(entered).toFixed(2)}`);
                    }
                  }}
                  className={`min-h-[64px] p-2 rounded-lg flex flex-col items-center justify-center transition-all border col-span-2 sm:col-span-1 ${
                    customTipAmount !== null
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 text-zinc-900'
                  }`}
                >
                  <span className="text-[11px] font-semibold">Custom</span>
                  <span className="text-xs font-bold font-mono">
                    {customTipAmount !== null ? `$${customTipAmount.toFixed(2)}` : 'Edit'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Financial Summary & Terminal Checkout (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Financial Summary Card */}
          <div className="bg-white rounded-xl border border-zinc-200 shadow-xs p-5">
            <h2 className="text-base font-semibold text-zinc-950 pb-3 border-b border-zinc-200 flex items-center justify-between">
              <span>Payment Summary</span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400">
                USD Currency
              </span>
            </h2>

            <div className="py-4 space-y-3 text-xs text-zinc-700">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">
                  Services Subtotal ({activeTicket.services.length})
                </span>
                <span className="text-sm font-semibold text-zinc-900 font-mono">
                  ${servicesSubtotal.toFixed(2)}
                </span>
              </div>

              {retailSubtotal > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">
                    Retail Products ({retailProducts.filter((p) => p.quantityInCart > 0).length})
                  </span>
                  <span className="text-sm font-semibold text-zinc-900 font-mono">
                    ${retailSubtotal.toFixed(2)}
                  </span>
                </div>
              )}

              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-emerald-700 font-semibold">
                  <span className="flex items-center gap-1">
                    <span>Promotions (VIP10 -10%)</span>
                  </span>
                  <span className="text-sm font-mono">-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-zinc-500 flex items-center gap-1">
                  <span>State & Local Tax (8.875%)</span>
                  <Info className="w-3.5 h-3.5 text-zinc-400" />
                </span>
                <span className="text-sm font-semibold text-zinc-900 font-mono">
                  ${stateTax.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-500 flex items-center gap-1.5">
                  <span>Gratuity ({selectedTipPercentage}% to {activeTicket.stylistName.split(' ')[0]})</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                </span>
                <span className="text-sm font-semibold text-zinc-900 font-mono">
                  ${tipAmount.toFixed(2)}
                </span>
              </div>

              <div className="h-px bg-zinc-200 my-2"></div>

              <div className="flex justify-between items-baseline pt-1">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-zinc-950">Total Due</span>
                  <span className="text-[11px] text-zinc-400">Includes applicable taxes & tip</span>
                </div>
                <span className="text-3xl font-extrabold text-zinc-950 font-mono tracking-tight">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Payment Options Selector */}
            <div className="mt-2 space-y-3">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400 block mb-1">
                Select Payment Method
              </span>

              {/* Terminal Pay / Card Tap (Active) */}
              <div
                onClick={() => setSelectedPaymentMethod('card')}
                className={`p-3.5 rounded-lg border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  selectedPaymentMethod === 'card'
                    ? 'border-zinc-900 bg-zinc-50'
                    : 'border-zinc-200 bg-white hover:bg-zinc-50'
                }`}
              >
                <div className="min-h-[44px] min-w-[44px] rounded-lg bg-zinc-900 text-white flex items-center justify-center shrink-0">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-950">
                      Credit Card / Tap to Pay
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Terminal #01 Ready
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    Prompting client: Tap Apple Pay, Google Pay, or insert chip card
                  </p>
                </div>
              </div>

              {/* Secondary Tenders Grid */}
              <div className="grid grid-cols-3 gap-2">
                {/* Gift Card */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPaymentMethod('gift');
                    onShowToast('Gift card swipe or redemption active');
                  }}
                  className={`min-h-[48px] p-2.5 rounded-lg text-left transition-colors border flex flex-col justify-center ${
                    selectedPaymentMethod === 'gift'
                      ? 'border-zinc-900 bg-zinc-100'
                      : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900">
                    <Gift className="w-3.5 h-3.5 text-zinc-600" />
                    <span>Gift Card</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 truncate">$50.00 credit</span>
                </button>

                {/* Cash Drawer */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPaymentMethod('cash');
                    onShowToast('Cash drawer opened via Lane-01 pulse signal');
                  }}
                  className={`min-h-[48px] p-2.5 rounded-lg text-left transition-colors border flex flex-col justify-center ${
                    selectedPaymentMethod === 'cash'
                      ? 'border-zinc-900 bg-zinc-100'
                      : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900">
                    <Coins className="w-3.5 h-3.5 text-zinc-600" />
                    <span>Cash Drawer</span>
                  </div>
                  <span className="text-[10px] text-zinc-500">Exact / Change</span>
                </button>

                {/* Split Pay */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPaymentMethod('split');
                    onShowToast('Split payment matrix activated');
                  }}
                  className={`min-h-[48px] p-2.5 rounded-lg text-left transition-colors border flex flex-col justify-center ${
                    selectedPaymentMethod === 'split'
                      ? 'border-zinc-900 bg-zinc-100'
                      : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900">
                    <Split className="w-3.5 h-3.5 text-zinc-600" />
                    <span>Split Pay</span>
                  </div>
                  <span className="text-[10px] text-zinc-500">2+ Tenders</span>
                </button>
              </div>
            </div>

            {/* Big Action CTA Button */}
            <div className="mt-5">
              <button
                onClick={handleProcessPayment}
                disabled={isProcessing || paymentApproved}
                className={`min-h-[52px] w-full py-3.5 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all ${
                  paymentApproved
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                }`}
              >
                {isProcessing ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Authorizing ${grandTotal.toFixed(2)} on Lane 01...</span>
                  </>
                ) : paymentApproved ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-white" />
                    <span>Payment Approved & Receipt Sent!</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Process Payment (${grandTotal.toFixed(2)})</span>
                  </>
                )}
              </button>
            </div>

            {/* Post-pay & Follow Up Directives */}
            <div className="mt-4 pt-4 border-t border-zinc-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-900 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-zinc-500" />
                  Digital Receipt
                </span>
                <span className="text-zinc-500 font-mono text-[11px] truncate max-w-[200px]">
                  {activeTicket.clientEmail}
                </span>
              </div>

              {/* Auto-rebook Quick Toggle */}
              <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded bg-white border border-zinc-200 flex items-center justify-center text-zinc-800">
                    <CalendarCheck className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-zinc-950">
                      Prompt 6-Week Rebooking
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      Gloss & Balayage Refresh • June 12
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={rebookPromptChecked}
                  onChange={(e) => setRebookPromptChecked(e.target.checked)}
                  className="w-4 h-4 rounded text-zinc-900 focus:ring-zinc-900 accent-zinc-900 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Terminal Diagnostics Mini Widget */}
          <div className="bg-white rounded-xl border border-zinc-200 p-3.5 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-zinc-950">Aura Lane-01 Reader</span>
                <span className="text-[11px] text-zinc-400">Battery 98% • Bluetooth Low Energy</span>
              </div>
            </div>
            <button
              onClick={handlePingReader}
              disabled={readerPinging}
              className="min-h-[44px] px-3 rounded text-xs font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
            >
              {readerPinging ? 'Pinging...' : 'Ping Reader'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
