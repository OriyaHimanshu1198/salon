import React, { useState } from 'react';
import {
  Tag,
  Download,
  Plus,
  Receipt,
  TrendingUp,
  Percent,
  Calendar,
  CheckCircle,
  Clock,
  Search,
  ChevronDown,
  Sliders,
  Eye,
  ShieldCheck,
  Zap,
  ShoppingBag,
  RotateCcw,
  BadgePercent,
  ChevronLeft,
  ChevronRight,
  Tablet,
  Save,
  PauseCircle,
  PlayCircle,
  Edit3,
  Trash2,
} from 'lucide-react';
import { OfferCampaign } from '../../types/salon';
import { INITIAL_OFFERS } from '../../data/mockData';
import { CreateOfferModal } from '../modals/CreateOfferModal';
import { EditOfferModal } from '../modals/EditOfferModal';
import { DeleteConfirmModal } from '../modals/DeleteConfirmModal';

interface ManageOffersViewProps {
  offers?: OfferCampaign[];
  setOffers?: React.Dispatch<React.SetStateAction<OfferCampaign[]>>;
  onShowToast: (msg: string) => void;
}

export const ManageOffersView: React.FC<ManageOffersViewProps> = ({
  offers: propOffers,
  setOffers: propSetOffers,
  onShowToast,
}) => {
  const [localOffers, setLocalOffers] = useState<OfferCampaign[]>([]);
  const offers = propOffers !== undefined ? propOffers : localOffers;
  const setOffers = propSetOffers !== undefined ? propSetOffers : setLocalOffers;

  const [selectedOfferId, setSelectedOfferId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'All' | 'Active' | 'Scheduled' | 'Expiring Soon' | 'Archived'>('All');
  const [searchFilter, setSearchFilter] = useState('');
  const [incentiveTypeFilter, setIncentiveTypeFilter] = useState('all');
  const [isCreateOfferModalOpen, setIsCreateOfferModalOpen] = useState(false);
  const [isEditOfferModalOpen, setIsEditOfferModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<OfferCampaign | null>(null);
  const [deletingOffer, setDeletingOffer] = useState<OfferCampaign | null>(null);

  const selectedOffer = offers.find((o) => o.id === selectedOfferId) || offers[0] || null;

  const handleCreateOffer = (newOffer: OfferCampaign) => {
    setOffers((prev) => [newOffer, ...prev]);
    setSelectedOfferId(newOffer.id);
    onShowToast(`Campaign ${newOffer.code} created & activated on POS`);
  };

  const handleUpdateOffer = (updatedOffer: OfferCampaign) => {
    setOffers((prev) => prev.map((o) => (o.id === updatedOffer.id ? updatedOffer : o)));
    onShowToast(`Campaign ${updatedOffer.code} updated & synchronized with POS`);
  };

  const handleDeleteOffer = (offerId: string) => {
    const target = offers.find((o) => o.id === offerId);
    setOffers((prev) => {
      const remaining = prev.filter((o) => o.id !== offerId);
      if (selectedOfferId === offerId && remaining.length > 0) {
        setSelectedOfferId(remaining[0].id);
      }
      return remaining;
    });
    if (target) {
      onShowToast(`Campaign ${target.code} removed from registry`);
    }
  };

  const handleToggleOfferStatus = (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) => {
        if (o.id !== offerId) return o;
        const newStatus = o.status === 'Archived' ? 'Active' : 'Archived';
        onShowToast(`Campaign ${o.code} marked as ${newStatus}`);
        return { ...o, status: newStatus };
      })
    );
  };

  const handleTogglePosActive = (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, activeOnPos: !o.activeOnPos } : o))
    );
    onShowToast(`POS availability updated for ${selectedOffer?.code || 'campaign'}`);
  };

  const tabCounts = {
    All: offers.length,
    Active: offers.filter((o) => o.status === 'Active').length,
    Scheduled: offers.filter((o) => o.status === 'Scheduled').length,
    'Expiring Soon': offers.filter((o) => o.status === 'Expiring Soon').length,
    Archived: offers.filter((o) => o.status === 'Archived').length,
  };

  const filteredOffers = offers.filter((o) => {
    if (activeTab !== 'All' && o.status !== activeTab) return false;
    if (
      searchFilter &&
      !o.code.toLowerCase().includes(searchFilter.toLowerCase()) &&
      !o.title.toLowerCase().includes(searchFilter.toLowerCase()) &&
      !o.targetEligibility.toLowerCase().includes(searchFilter.toLowerCase())
    ) {
      return false;
    }
    if (incentiveTypeFilter !== 'all' && o.incentiveType !== incentiveTypeFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full p-6 space-y-6 max-w-[1720px] mx-auto pb-20">
      {/* Top Operational Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white border border-zinc-200 p-6 rounded-xl shadow-xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-zinc-400 text-xs uppercase tracking-wider font-semibold">
            <span>Salon Marketing</span>
            <span>/</span>
            <span className="text-zinc-900 font-semibold">Promotions & Loyalty</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight">
            Manage Offers & Loyalty Vouchers
          </h1>
          <p className="text-xs text-zinc-500 max-w-3xl">
            Create and govern promotional campaign codes, membership perks, retail bundles, and seasonal salon service packages across all POS terminals.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => onShowToast('Promotions ledger downloaded as CSV')}
            className="min-h-[44px] px-4 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 transition-colors rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-zinc-500" />
            <span>Export Ledger</span>
          </button>
          <button
            onClick={() => {
              setOffers([]);
              setSelectedOfferId('');
              onShowToast('All promotional offers cleared for testing');
            }}
            className="min-h-[44px] px-3.5 bg-zinc-100 hover:bg-rose-50 hover:text-rose-700 border border-zinc-200 text-zinc-600 transition-colors rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            title="Clear all data to test creating from scratch"
          >
            <Trash2 className="w-4 h-4 text-zinc-400" />
            <span>Clear Data</span>
          </button>
          {offers.length === 0 && (
            <button
              onClick={() => {
                setOffers(INITIAL_OFFERS);
                setSelectedOfferId(INITIAL_OFFERS[0].id);
                onShowToast('Sample demo offers loaded');
              }}
              className="min-h-[44px] px-3.5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 transition-colors rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-zinc-500" />
              <span>Load Sample Offers</span>
            </button>
          )}
          <button
            onClick={() => setIsCreateOfferModalOpen(true)}
            className="min-h-[44px] px-4 bg-zinc-900 text-white hover:bg-zinc-800 active:bg-black transition-colors rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Offer</span>
          </button>
        </div>
      </div>

      {/* Performance KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] uppercase tracking-wider font-semibold">
              Active Campaigns
            </span>
            <Tag className="w-4 h-4" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-zinc-950">{tabCounts.Active} Live Offers</div>
            <p className="text-xs text-zinc-500 mt-0.5">{tabCounts.All} Total Registered Campaigns</p>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-emerald-700 text-xs font-semibold">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Fully synced across 4 lanes</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] uppercase tracking-wider font-semibold">
              Redemption Rate
            </span>
            <Receipt className="w-4 h-4" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-zinc-950 font-mono">31.4%</div>
            <p className="text-xs text-zinc-500 mt-0.5">418 redemptions this month</p>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-sky-700 text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+4.8% vs previous 30 days</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] uppercase tracking-wider font-semibold">
              Promotional Revenue Lift
            </span>
            <BadgePercent className="w-4 h-4" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-zinc-950 font-mono">$28,940.00</div>
            <p className="text-xs text-zinc-500 mt-0.5">$68.50 avg uplift per ticket</p>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-emerald-700 text-xs font-semibold">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>High take-home retail attach</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] uppercase tracking-wider font-semibold">
              Client Rebooking Retention
            </span>
            <Calendar className="w-4 h-4" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-zinc-950">88.2%</div>
            <p className="text-xs text-zinc-500 mt-0.5">With 6-Week Balayage Voucher</p>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-amber-700 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Average return: 38 days</span>
          </div>
        </div>
      </div>

      {/* Main Workspace Split-Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Panel: Campaign Registry (lg:col-span-8) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Controls: Status Tabs & Filter Bar */}
          <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-xs space-y-4">
            {/* Status Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { id: 'All', label: 'All Offers', count: tabCounts.All },
                { id: 'Active', label: 'Active', count: tabCounts.Active },
                { id: 'Scheduled', label: 'Scheduled', count: tabCounts.Scheduled },
                { id: 'Expiring Soon', label: 'Expiring Soon', count: tabCounts['Expiring Soon'] },
                { id: 'Archived', label: 'Archived', count: tabCounts.Archived },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`min-h-[40px] px-3.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-zinc-900 text-white shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      activeTab === tab.id
                        ? 'bg-white/20 text-white'
                        : tab.id === 'Expiring Soon'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-zinc-100 text-zinc-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search & Select Filter Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-8 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter by promo code, therapy name, or brand keyword..."
                  className="w-full min-h-[40px] pl-9 pr-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              <div className="md:col-span-4 relative">
                <select
                  value={incentiveTypeFilter}
                  onChange={(e) => setIncentiveTypeFilter(e.target.value)}
                  className="w-full min-h-[40px] px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer appearance-none pr-8"
                >
                  <option value="all">All Incentive Types</option>
                  <option value="pct">Percentage Discount (%)</option>
                  <option value="fixed">Fixed $ Off Service</option>
                  <option value="therapy">Free Add-on Therapy</option>
                  <option value="retail">Retail Take-Home Bundle</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Offers Table Card */}
          <div className="bg-white border border-zinc-200 rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-zinc-50 text-zinc-400 text-[11px] uppercase tracking-wider font-semibold border-b border-zinc-200">
                    <th className="py-3 px-4">Offer Code & Title</th>
                    <th className="py-3 px-4">Incentive Details</th>
                    <th className="py-3 px-4">Target Eligibility</th>
                    <th className="py-3 px-4">Redemptions</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-xs">
                  {filteredOffers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 px-4 text-center">
                        <div className="flex flex-col items-center justify-center max-w-md mx-auto space-y-3">
                          <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400">
                            <Tag className="w-6 h-6" />
                          </div>
                          <div className="text-base font-bold text-zinc-950">No Promotional Campaigns</div>
                          <p className="text-xs text-zinc-500 leading-relaxed">
                            Default data has been cleared for testing. Click "+ Create Offer" below to create and test a new campaign, or reload demo data anytime.
                          </p>
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => setIsCreateOfferModalOpen(true)}
                              className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-semibold hover:bg-zinc-800 active:bg-black transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Create Offer</span>
                            </button>
                            <button
                              onClick={() => {
                                setOffers(INITIAL_OFFERS);
                                setSelectedOfferId(INITIAL_OFFERS[0].id);
                                onShowToast('Sample demo offers loaded');
                              }}
                              className="px-4 py-2 bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-zinc-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                            >
                              Load Sample Offers
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredOffers.map((offer) => {
                    const isSelected = offer.id === selectedOfferId;

                    let statusBadge = 'bg-emerald-100 text-emerald-800';
                    let dotColor = 'bg-emerald-500';
                    if (offer.status === 'Expiring Soon') {
                      statusBadge = 'bg-amber-100 text-amber-800';
                      dotColor = 'bg-amber-500';
                    } else if (offer.status === 'Scheduled') {
                      statusBadge = 'bg-sky-100 text-sky-800';
                      dotColor = 'bg-sky-500';
                    }

                    return (
                      <tr
                        key={offer.id}
                        onClick={() => setSelectedOfferId(offer.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-zinc-100/90 font-medium' : 'hover:bg-zinc-50'
                        }`}
                      >
                        <td className="py-4 px-4 min-w-[200px]">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-2 h-2 rounded-full ${dotColor} shrink-0`}></div>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-zinc-950 font-mono">
                                  {offer.code}
                                </span>
                                {offer.activeOnPos && (
                                  <span className="px-1.5 py-0.2 rounded bg-zinc-200 text-[9px] font-mono text-zinc-700">
                                    POS AUTO
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-zinc-500 mt-0.5 truncate max-w-[220px]">
                                {offer.title}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 min-w-[170px]">
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-zinc-950">
                              {offer.incentiveHeadline}
                            </span>
                            <span className="text-[11px] text-zinc-400">{offer.incentiveSub}</span>
                          </div>
                        </td>

                        <td className="py-4 px-4 font-medium text-zinc-800">
                          {offer.targetEligibility}
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-zinc-900">
                              {offer.redemptionsUsed}{' '}
                              {typeof offer.poolLimit === 'number'
                                ? `/ ${offer.poolLimit} used`
                                : 'used'}
                            </span>
                            {typeof offer.poolLimit === 'number' ? (
                              <div className="w-24 h-1.5 bg-zinc-100 rounded-full overflow-hidden mt-1">
                                <div
                                  className={`h-full rounded-full ${
                                    offer.status === 'Expiring Soon'
                                      ? 'bg-amber-500'
                                      : 'bg-zinc-900'
                                  }`}
                                  style={{
                                    width: `${(offer.redemptionsUsed / offer.poolLimit) * 100}%`,
                                  }}
                                ></div>
                              </div>
                            ) : (
                              <span className="text-[10px] text-zinc-400">Unlimited Pool</span>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full ${statusBadge}`}
                          >
                            {offer.status}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingOffer(offer);
                                setIsEditOfferModalOpen(true);
                              }}
                              className="min-h-[36px] min-w-[36px] flex items-center justify-center text-zinc-400 hover:text-zinc-900 rounded-lg hover:bg-zinc-200/60 transition-colors"
                              title="Edit Campaign"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeletingOffer(offer);
                                setIsDeleteConfirmOpen(true);
                              }}
                              className="min-h-[36px] min-w-[36px] flex items-center justify-center text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                              title="Delete Campaign"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onShowToast(`View redemption audit log for ${offer.code}`);
                              }}
                              className="min-h-[36px] min-w-[36px] flex items-center justify-center text-zinc-400 hover:text-zinc-900 rounded-lg hover:bg-zinc-200/60 transition-colors"
                              title="Audit Log"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }))}
                </tbody>
              </table>
            </div>

            {/* Table Bottom Pagination */}
            <div className="bg-zinc-50 border-t border-zinc-200 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-zinc-500 text-xs">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400">
                Displaying {filteredOffers.length} of {offers.length} registered salon campaigns
              </span>
              <div className="flex items-center gap-1">
                <button
                  aria-label="Previous Page"
                  className="min-h-[36px] min-w-[36px] rounded-lg flex items-center justify-center hover:bg-zinc-200/60 text-zinc-500 hover:text-zinc-900"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="min-h-[36px] min-w-[36px] rounded-lg bg-white border border-zinc-200 font-bold text-zinc-900 flex items-center justify-center">
                  1
                </button>
                <button className="min-h-[36px] min-w-[36px] rounded-lg hover:bg-zinc-200/60 text-zinc-500 hover:text-zinc-900 flex items-center justify-center font-medium">
                  2
                </button>
                <button
                  aria-label="Next Page"
                  className="min-h-[36px] min-w-[36px] rounded-lg flex items-center justify-center hover:bg-zinc-200/60 text-zinc-500 hover:text-zinc-900"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Offer Builder & Live POS Terminal Preview (lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {!selectedOffer ? (
            <div className="bg-white border border-zinc-200 p-8 rounded-xl shadow-xs text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-zinc-950">No Campaign Selected</h3>
              <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
                Default data cleared for testing. Click "+ Create Offer" to create your first promotion code, or load sample data.
              </p>
              <button
                onClick={() => setIsCreateOfferModalOpen(true)}
                className="min-h-[40px] px-4 bg-zinc-900 text-white rounded-lg text-xs font-semibold hover:bg-zinc-800 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create Offer</span>
              </button>
            </div>
          ) : (
            <>
              {/* Configuration Card */}
              <div className="bg-white border border-zinc-200 p-5 rounded-xl shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                  Target Code Inspector
                </span>
                <h2 className="text-base font-bold text-zinc-950">{selectedOffer.code} Configuration</h2>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setEditingOffer(selectedOffer);
                    setIsEditOfferModalOpen(true);
                  }}
                  className="min-h-[32px] px-2.5 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Edit Offer Campaign"
                >
                  <Edit3 className="w-3.5 h-3.5 text-zinc-600" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDeletingOffer(selectedOffer);
                    setIsDeleteConfirmOpen(true);
                  }}
                  className="min-h-[32px] px-2 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-rose-50 text-zinc-600 hover:text-rose-600 text-xs font-semibold flex items-center transition-colors cursor-pointer"
                  title="Delete Campaign"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <span
                  className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${
                    selectedOffer.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedOffer.status === 'Archived'
                      ? 'bg-zinc-200 text-zinc-700'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {selectedOffer.status}
                </span>
              </div>
            </div>

            {/* Quick POS Toggle */}
            <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-zinc-950">Active on Express POS</span>
                <span className="text-[11px] text-zinc-500">Instantly callable on front desk iPads</span>
              </div>
              <button
                type="button"
                onClick={() => handleTogglePosActive(selectedOffer.id)}
                className={`w-11 h-6 rounded-full relative inline-flex items-center p-0.5 transition-colors ${
                  selectedOffer.activeOnPos ? 'bg-zinc-900' : 'bg-zinc-300'
                }`}
              >
                <span
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    selectedOffer.activeOnPos ? 'translate-x-5' : 'translate-x-0'
                  }`}
                ></span>
              </button>
            </div>

            {/* Rule Set Overview */}
            <div className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                  Discount Value
                </label>
                <div className="min-h-[40px] px-3.5 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-between text-zinc-900 font-semibold">
                  <span>{selectedOffer.discountValueDescription}</span>
                  <Percent className="w-4 h-4 text-zinc-400" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                  Inventory Scope
                </label>
                <div className="min-h-[40px] px-3.5 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-between text-zinc-900 font-semibold">
                  <span>{selectedOffer.inventoryScope}</span>
                  <ShoppingBag className="w-4 h-4 text-zinc-400" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                  Stylist Commission Treatment
                </label>
                <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-900">
                      100% Commission Protected
                    </span>
                    <span className="text-[11px] text-zinc-500 leading-tight">
                      Stylist commission calculated from full gross MSRP price.
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                  Checkout Trigger Mechanism
                </label>
                <div className="min-h-[40px] px-3.5 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-between text-zinc-900 font-semibold">
                  <span>{selectedOffer.checkoutTrigger}</span>
                  <Zap className="w-4 h-4 text-zinc-400" />
                </div>
              </div>
            </div>

            {/* Live Terminal Mock Preview Card */}
            <div className="space-y-2 pt-1 border-t border-zinc-100">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 flex items-center gap-1">
                  <Tablet className="w-3.5 h-3.5" /> Terminal 01 Live Simulation
                </span>
                <span className="text-[10px] text-emerald-700 font-mono font-bold">
                  LANE 01 VERIFIED
                </span>
              </div>

              <div className="p-4 rounded-xl bg-zinc-100 border border-zinc-200 space-y-2 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-zinc-300 text-zinc-900 flex items-center justify-center font-bold text-[10px]">
                      {selectedOffer.liveSimulation.client.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-zinc-900 block leading-tight">
                        {selectedOffer.liveSimulation.client}
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        {selectedOffer.liveSimulation.vipTier}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-zinc-900 text-white px-2 py-0.5 rounded font-mono">
                    {selectedOffer.liveSimulation.ticketNum}
                  </span>
                </div>

                <div className="space-y-1 font-mono text-[11px] text-zinc-800">
                  <div className="flex justify-between">
                    <span>{selectedOffer.liveSimulation.service}</span>
                    <span>${selectedOffer.liveSimulation.servicePrice.toFixed(2)}</span>
                  </div>
                  {selectedOffer.liveSimulation.retailPrice > 0 && (
                    <div className="flex justify-between">
                      <span>{selectedOffer.liveSimulation.retailItem}</span>
                      <span>${selectedOffer.liveSimulation.retailPrice.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>
                      {selectedOffer.code} Active ({selectedOffer.discountValueDescription})
                    </span>
                    <span>{selectedOffer.liveSimulation.discountAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-200 flex justify-between font-bold text-sm text-zinc-950 font-mono">
                  <span>Current Total</span>
                  <span>${selectedOffer.liveSimulation.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-1 flex flex-col gap-2">
              <button
                onClick={() => {
                  setEditingOffer(selectedOffer);
                  setIsEditOfferModalOpen(true);
                }}
                className="w-full min-h-[44px] bg-zinc-900 text-white hover:bg-zinc-800 active:bg-black transition-colors rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Campaign Rules & Values</span>
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleToggleOfferStatus(selectedOffer.id)}
                  className={`w-full min-h-[44px] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-colors cursor-pointer ${
                    selectedOffer.status === 'Archived'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                      : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  {selectedOffer.status === 'Archived' ? (
                    <>
                      <PlayCircle className="w-4 h-4 text-emerald-600" />
                      <span>Activate</span>
                    </>
                  ) : (
                    <>
                      <PauseCircle className="w-4 h-4 text-zinc-500" />
                      <span>Deactivate</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setDeletingOffer(selectedOffer);
                    setIsDeleteConfirmOpen(true);
                  }}
                  className="w-full min-h-[44px] bg-white hover:bg-rose-50 hover:text-rose-700 border border-zinc-200 text-zinc-600 transition-colors rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 text-rose-500" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stylist Tip & Commission Quick Card */}
          <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-800">
                <Receipt className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-zinc-900">Technician Allocation</span>
                <span className="text-[11px] text-zinc-500">Master Stylist: Elena Rostova</span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded">
              100% Protected
            </span>
          </div>
            </>
          )}
        </div>
      </div>

      {/* Create Offer Popup Form Modal */}
      <CreateOfferModal
        isOpen={isCreateOfferModalOpen}
        onClose={() => setIsCreateOfferModalOpen(false)}
        onCreateOffer={handleCreateOffer}
      />

      {/* Edit Offer Modal */}
      <EditOfferModal
        isOpen={isEditOfferModalOpen}
        offer={editingOffer || selectedOffer}
        onClose={() => {
          setIsEditOfferModalOpen(false);
          setEditingOffer(null);
        }}
        onSaveOffer={handleUpdateOffer}
      />

      {/* Delete Offer Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteConfirmOpen}
        title="Delete Promotional Campaign"
        message={`Are you sure you want to permanently delete promotional offer code "${deletingOffer?.code || selectedOffer?.code}"? It will be immediately unlinked from all active lanes and POS tablets.`}
        itemIdentifier={`Code: ${deletingOffer?.code || selectedOffer?.code} • Title: ${deletingOffer?.title || selectedOffer?.title}`}
        confirmButtonText="Delete Campaign"
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setDeletingOffer(null);
        }}
        onConfirm={() => {
          if (deletingOffer) {
            handleDeleteOffer(deletingOffer.id);
          } else if (selectedOffer) {
            handleDeleteOffer(selectedOffer.id);
          }
        }}
      />
    </div>
  );
};
