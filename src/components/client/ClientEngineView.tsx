import React, { useState } from 'react';
import {
  Search,
  Upload,
  UserPlus,
  Phone,
  Mail,
  Clock,
  Edit,
  MoreVertical,
  TrendingUp,
  ShieldCheck,
  Droplet,
  Scissors,
  Sparkles,
  ShoppingBag,
  CheckCircle,
  MessageSquare,
  CalendarPlus,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Filter,
  Check,
  Trash2,
} from 'lucide-react';
import { Client, Stylist } from '../../types/salon';
import { APP_IMAGES } from '../../data/mockData';
import { EditClientModal } from '../modals/EditClientModal';
import { DeleteConfirmModal } from '../modals/DeleteConfirmModal';

interface ClientEngineViewProps {
  clients: Client[];
  stylists: Stylist[];
  onSelectClientForCheckout: (client: Client) => void;
  onOpenNewClient: () => void;
  onUpdateClient?: (client: Client) => void;
  onDeleteClient?: (clientId: string) => void;
  onClearClients?: () => void;
  onLoadSampleClients?: () => void;
  onOpenBookAppointment: () => void;
  onShowToast: (msg: string) => void;
}

export const ClientEngineView: React.FC<ClientEngineViewProps> = ({
  clients,
  stylists,
  onSelectClientForCheckout,
  onOpenNewClient,
  onUpdateClient,
  onDeleteClient,
  onClearClients,
  onLoadSampleClients,
  onOpenBookAppointment,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSegmentFilter, setActiveSegmentFilter] = useState<'all' | 'vip' | 'first' | 'formula' | 'lapsed'>('all');
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
  const [isDeleteClientModalOpen, setIsDeleteClientModalOpen] = useState(false);
  const [smsMessage, setSmsMessage] = useState('Hi, Elena is ready for your toner glaze at Basin 02! See you in 2 minutes.');

  const selectedClient = clients.find((c) => c.id === selectedClientId) || clients[0] || null;

  // Segment counts
  const segmentCounts = {
    all: clients.length,
    vip: clients.filter((c) => Boolean(c.vipTier && c.vipTier.includes('VIP'))).length,
    first: clients.filter((c) => c.totalVisits <= 1).length,
    formula: clients.filter((c) => Boolean(c.baseFormula || c.tonerFormula || c.activeFormulaSnippet)).length,
    lapsed: clients.filter((c) => c.currentStatus === 'Lapsed').length,
  };

  // Filtering logic
  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.activeFormulaSnippet && c.activeFormulaSnippet.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeSegmentFilter === 'vip') return Boolean(c.vipTier && c.vipTier.includes('VIP'));
    if (activeSegmentFilter === 'first') return c.totalVisits <= 1;
    if (activeSegmentFilter === 'formula') return Boolean(c.baseFormula || c.tonerFormula || c.activeFormulaSnippet);
    if (activeSegmentFilter === 'lapsed') return c.currentStatus === 'Lapsed';
    return true;
  });

  return (
    <div className="flex flex-col w-full p-6 space-y-6 pb-20">
      {/* Top Action Bar */}
      <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Field */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone (e.g. 555-0192), email, or formula note..."
              className="w-full min-h-[44px] pl-11 pr-24 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-zinc-900 focus:outline-none focus:bg-white transition-all"
            />
            {searchQuery && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-2 py-0.5 text-[11px] font-semibold text-zinc-500 bg-white border border-zinc-200 rounded shadow-xs hover:text-zinc-900"
                >
                  ESC clear
                </button>
              </div>
            )}
          </div>

          {/* Primary Action Buttons */}
          <div className="flex items-center gap-3 self-end lg:self-auto flex-wrap">
            <button
              onClick={() => onShowToast('CSV Client Importer ready')}
              className="min-h-[44px] px-4 bg-zinc-100 border border-zinc-200 hover:bg-zinc-200 text-zinc-800 transition-colors rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4 text-zinc-600" />
              <span>Import CSV</span>
            </button>
            {onClearClients && (
              <button
                onClick={onClearClients}
                className="min-h-[44px] px-3.5 bg-zinc-100 hover:bg-rose-50 hover:text-rose-700 border border-zinc-200 text-zinc-600 transition-colors rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                title="Clear all client profiles to test creating from scratch"
              >
                <Trash2 className="w-4 h-4 text-zinc-400" />
                <span>Clear Directory</span>
              </button>
            )}
            {clients.length === 0 && onLoadSampleClients && (
              <button
                onClick={onLoadSampleClients}
                className="min-h-[44px] px-3.5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 transition-colors rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <span>Load Sample Guests</span>
              </button>
            )}
            <button
              onClick={onOpenNewClient}
              className="min-h-[44px] px-4 bg-zinc-900 text-white hover:bg-zinc-800 active:bg-black transition-colors rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Add New Client</span>
            </button>
          </div>
        </div>

        {/* Segment Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 whitespace-nowrap">
          <button
            onClick={() => setActiveSegmentFilter('all')}
            className={`min-h-[40px] px-4 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSegmentFilter === 'all'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            <span>All Clients</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeSegmentFilter === 'all' ? 'bg-white/20 text-white' : 'bg-zinc-200 text-zinc-700'
              }`}
            >
              {segmentCounts.all}
            </span>
          </button>

          <button
            onClick={() => setActiveSegmentFilter('vip')}
            className={`min-h-[40px] px-4 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSegmentFilter === 'vip'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>VIP Tier</span>
            <span className="text-[11px] text-zinc-400">{segmentCounts.vip}</span>
          </button>

          <button
            onClick={() => setActiveSegmentFilter('first')}
            className={`min-h-[40px] px-4 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSegmentFilter === 'first'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            <span>First-Time</span>
            <span className="text-[11px] text-zinc-400">{segmentCounts.first}</span>
          </button>

          <button
            onClick={() => setActiveSegmentFilter('formula')}
            className={`min-h-[40px] px-4 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSegmentFilter === 'formula'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            <Droplet className="w-3.5 h-3.5" />
            <span>Formula on File</span>
            <span className="text-[11px] text-zinc-400">{segmentCounts.formula}</span>
          </button>

          <button
            onClick={() => setActiveSegmentFilter('lapsed')}
            className={`min-h-[40px] px-4 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSegmentFilter === 'lapsed'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            <span>Lapsed &gt;60d</span>
            <span className="text-[11px] text-rose-600 font-bold">{segmentCounts.lapsed}</span>
          </button>

          <div className="ml-auto flex items-center gap-2 pl-4 text-zinc-400 text-xs">
            <span>Sort:</span>
            <button
              onClick={() => onShowToast('Sorted by Last Activity (Newest)')}
              className="text-zinc-900 font-semibold flex items-center gap-1 hover:text-black"
            >
              <span>Last Activity</span>
            </button>
          </div>
        </div>
      </div>

      {/* Master-Detail 2-Column Split Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Client Matrix (xl:col-span-5) */}
        <section className="xl:col-span-5 flex flex-col bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden">
          <div className="p-3.5 px-4 flex items-center justify-between bg-zinc-50 border-b border-zinc-200">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-zinc-900">Directory Matrix</h2>
              <span className="text-[11px] bg-zinc-200/70 text-zinc-700 px-2 py-0.5 rounded-full font-medium">
                {filteredClients.length} Active Views
              </span>
            </div>
            <button
              aria-label="Filter Matrix"
              onClick={() => onShowToast('Filter settings expanded')}
              className="min-h-[36px] min-w-[36px] flex items-center justify-center text-zinc-400 hover:text-zinc-900 rounded-lg hover:bg-zinc-200/60"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 text-[11px] uppercase tracking-wider font-semibold text-zinc-400 border-b border-zinc-200">
                  <th className="py-2.5 px-4">Client</th>
                  <th className="py-2.5 px-3">Stylist</th>
                  <th className="py-2.5 px-3 text-right">LTV</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-zinc-100">
                {filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 px-4 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                          <UserPlus className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-semibold text-zinc-800">
                          {clients.length === 0 ? 'Default client registry is cleared' : 'No matching clients found'}
                        </p>
                        <p className="text-[11px] text-zinc-500 max-w-xs">
                          {clients.length === 0
                            ? 'Default data cleared for testing. Click "+ Add New Client" to create your first client profile.'
                            : 'Try adjusting your search query or segment filter.'}
                        </p>
                        {clients.length === 0 && (
                          <div className="flex items-center gap-2 pt-2">
                            <button
                              onClick={onOpenNewClient}
                              className="px-3 py-1.5 bg-zinc-900 text-white rounded-lg text-xs font-semibold hover:bg-zinc-800 cursor-pointer shadow-xs"
                            >
                              + Add New Client
                            </button>
                            {onLoadSampleClients && (
                              <button
                                onClick={onLoadSampleClients}
                                className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-lg text-xs font-semibold border border-zinc-200 cursor-pointer"
                              >
                                Load Sample Guests
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((client) => {
                    const isSelected = client.id === selectedClientId;

                    let statusClasses = 'bg-emerald-100 text-emerald-800';
                    if (client.currentStatus === 'In-Service') statusClasses = 'bg-sky-100 text-sky-800';
                    if (client.currentStatus === 'Waiting') statusClasses = 'bg-amber-100 text-amber-800';
                    if (client.currentStatus === 'Lapsed') statusClasses = 'bg-rose-100 text-rose-800';

                    return (
                      <tr
                        key={client.id}
                        onClick={() => setSelectedClientId(client.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-zinc-100/90 font-medium'
                            : 'hover:bg-zinc-50 text-zinc-900'
                        }`}
                      >
                        <td className="py-3 px-4 min-h-[48px]">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-xs shrink-0 ${
                                isSelected ? 'bg-zinc-900 text-white' : 'bg-zinc-200 text-zinc-800'
                              }`}
                            >
                              {client.initials}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-zinc-900 truncate">
                                  {client.name}
                                </span>
                                {client.vipTier && (
                                  <span className="text-[9px] font-bold text-amber-900 bg-amber-100 px-1.5 py-0.2 rounded uppercase">
                                    {client.vipTier}
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-zinc-500">{client.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-zinc-900">{client.primaryStylist.split(' ')[0]}</span>
                          <span className="block text-[11px] text-zinc-500">
                            {client.currentStation || 'Chair 02'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className="font-bold text-zinc-900 font-mono">
                            ${client.ltv.toLocaleString()}
                          </span>
                          <span className="block text-[11px] text-zinc-500 font-normal">
                            {client.totalVisits} visits
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusClasses}`}
                          >
                            {client.currentStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Footer */}
          <div className="p-3 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-500">
            <span>Showing {filteredClients.length > 0 ? 1 : 0}-{filteredClients.length} of {clients.length} entries</span>
            <div className="flex items-center gap-1">
              <button
                aria-label="Previous Page"
                className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded hover:bg-zinc-200/60 text-zinc-500 hover:text-zinc-900"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 py-1 bg-white border border-zinc-200 rounded font-semibold text-zinc-900 text-xs">
                1
              </span>
              <button
                aria-label="Next Page"
                className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded hover:bg-zinc-200/60 text-zinc-500 hover:text-zinc-900"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Selected Client Deep Profile (xl:col-span-7) */}
        <section className="xl:col-span-7 flex flex-col gap-6">
          {!selectedClient ? (
            <div className="bg-white border border-zinc-200 p-12 rounded-xl shadow-xs text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400">
                <UserPlus className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-zinc-950">No Client Selected</h3>
                <p className="text-xs text-zinc-500 max-w-sm leading-relaxed">
                  Default client registry is cleared for testing. Click "+ Add New Client" to create your first client record and test full CRUD operations.
                </p>
              </div>
              <div className="flex items-center gap-2 pt-1 flex-wrap justify-center">
                <button
                  onClick={onOpenNewClient}
                  className="min-h-[44px] px-5 bg-zinc-900 text-white rounded-lg text-xs font-semibold hover:bg-zinc-800 transition-colors shadow-xs cursor-pointer flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Add New Client</span>
                </button>
                {onLoadSampleClients && (
                  <button
                    onClick={onLoadSampleClients}
                    className="min-h-[44px] px-4 bg-zinc-100 border border-zinc-200 text-zinc-800 rounded-lg text-xs font-semibold hover:bg-zinc-200 transition-colors cursor-pointer"
                  >
                    Load Sample Guests
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Client Hero Profile Card */}
              <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-xs flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-4">
                <div className="relative shrink-0">
                  <img
                    src={selectedClient.avatar || APP_IMAGES.sophiaMillerClient}
                    alt={selectedClient.name}
                    className="w-16 h-16 rounded-full object-cover shadow-sm ring-2 ring-zinc-900"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span
                    className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-sky-500 ring-2 ring-white"
                    title="Currently In-Service"
                  ></span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold text-zinc-950 tracking-tight">
                      {selectedClient.name}
                    </h1>
                    <span className="text-xs bg-zinc-900 text-white px-2.5 py-0.5 rounded-full font-semibold">
                      {selectedClient.vipTier || 'VIP Platinum'}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800">
                      Chair 02 (Wash Basin)
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-zinc-500 text-xs mt-1.5 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      {selectedClient.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      {selectedClient.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Client since {selectedClient.membershipDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Action Options */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  aria-label="Edit Profile"
                  onClick={() => setIsEditClientModalOpen(true)}
                  className="min-h-[44px] min-w-[44px] rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-950 flex items-center justify-center transition-colors cursor-pointer"
                  title="Edit Profile"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  aria-label="Delete Profile"
                  onClick={() => setIsDeleteClientModalOpen(true)}
                  className="min-h-[44px] min-w-[44px] rounded-lg bg-zinc-100 hover:bg-rose-50 text-zinc-600 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                  title="Delete Client Profile"
                >
                  <Trash2 className="w-4 h-4 text-rose-500" />
                </button>
                <button
                  aria-label="More Options"
                  onClick={() => onShowToast(`Client history & GDPR exported`)}
                  className="min-h-[44px] min-w-[44px] rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900 flex items-center justify-center transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-zinc-50 border border-zinc-200 p-3.5 rounded-lg flex flex-col">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Total Visits
                </span>
                <span className="text-2xl font-bold text-zinc-950 mt-0.5">{selectedClient.totalVisits}</span>
                <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-0.5 mt-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> Consistent 5-wk
                </span>
              </div>

              <div className="bg-zinc-50 border border-zinc-200 p-3.5 rounded-lg flex flex-col">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Avg Ticket
                </span>
                <span className="text-2xl font-bold text-zinc-950 mt-0.5 font-mono">
                  ${selectedClient.avgTicket}
                </span>
                <span className="text-[11px] text-zinc-500 mt-0.5">+14% vs avg client</span>
              </div>

              <div className="bg-zinc-50 border border-zinc-200 p-3.5 rounded-lg flex flex-col">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Rebook Rate
                </span>
                <span className="text-2xl font-bold text-zinc-950 mt-0.5">{selectedClient.rebookRate}%</span>
                <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-0.5 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> High Loyalty
                </span>
              </div>

              <div className="bg-zinc-50 border border-zinc-200 p-3.5 rounded-lg flex flex-col">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Primary Stylist
                </span>
                <span className="text-sm font-bold text-zinc-950 mt-1 truncate">
                  {selectedClient.primaryStylist}
                </span>
                <span className="text-[11px] text-zinc-500 mt-0.5">Master Colorist</span>
              </div>
            </div>
          </div>

          {/* Formula & Technical Card */}
          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplet className="w-5 h-5 text-zinc-900" />
                <h2 className="text-base font-semibold text-zinc-950">
                  Color Formula Card & Technical Log
                </h2>
              </div>
              <span className="text-xs bg-zinc-100 border border-zinc-200 text-zinc-600 px-2.5 py-1 rounded">
                Updated Sept 12 by Elena R.
              </span>
            </div>

            {/* Formula Specifications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Base Formula */}
              <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase font-bold text-zinc-500 tracking-wider">
                    Base Retouch & Lift
                  </span>
                  <Scissors className="w-4 h-4 text-zinc-400" />
                </div>
                <p className="text-sm font-semibold text-zinc-950 mt-1">
                  Wella Koleston 7/1 (30g) + 8/38 (15g)
                </p>
                <div className="flex items-center gap-2 text-zinc-500 text-xs mt-1">
                  <span className="bg-white border border-zinc-200 px-2 py-0.5 rounded shadow-2xs font-mono text-[11px]">
                    Developer: 20 Vol Welloxon (45g)
                  </span>
                  <span>•</span>
                  <span>Time: 35 min</span>
                </div>
              </div>

              {/* Gloss & Tone */}
              <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase font-bold text-zinc-500 tracking-wider">
                    Balayage Gloss / Toner
                  </span>
                  <Sparkles className="w-4 h-4 text-zinc-400" />
                </div>
                <p className="text-sm font-semibold text-zinc-950 mt-1">
                  Redken Shades EQ: 09P + 09V (Equal parts, 25g each)
                </p>
                <div className="flex items-center gap-2 text-zinc-500 text-xs mt-1">
                  <span className="bg-white border border-zinc-200 px-2 py-0.5 rounded shadow-2xs font-mono text-[11px]">
                    Processing Solution (50g)
                  </span>
                  <span>•</span>
                  <span>Time: 18 min at basin</span>
                </div>
              </div>
            </div>

            {/* Technical & Sensory Notes */}
            <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200 flex flex-col gap-2">
              <span className="text-[11px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1.5">
                Sensory Preferences & Service Protocols
              </span>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="px-2.5 py-1 bg-white border border-zinc-200 rounded text-zinc-900 text-xs font-medium shadow-2xs flex items-center gap-1.5">
                  Sensitive scalp (no direct bleach on roots)
                </span>
                <span className="px-2.5 py-1 bg-white border border-zinc-200 rounded text-zinc-900 text-xs font-medium shadow-2xs flex items-center gap-1.5">
                  Prefers lukewarm water rinse
                </span>
                <span className="px-2.5 py-1 bg-white border border-zinc-200 rounded text-zinc-900 text-xs font-medium shadow-2xs flex items-center gap-1.5">
                  Chamomile tea with oat milk at station
                </span>
                <span className="px-2.5 py-1 bg-white border border-zinc-200 rounded text-zinc-900 text-xs font-medium shadow-2xs flex items-center gap-1.5">
                  Silent service preferred during processing
                </span>
              </div>
            </div>
          </div>

          {/* Timeline: Appointments & Retail Purchases */}
          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-zinc-950 flex items-center gap-2">
                <Clock className="w-5 h-5 text-zinc-900" />
                Timeline & Retail Ledgers
              </h2>
              <button
                onClick={() => onShowToast('Showing full 18 ledger records')}
                className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors font-medium"
              >
                View All 18 Records
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {/* Timeline Item 1: Active Service Today */}
              <div className="p-4 rounded-lg bg-zinc-100 border border-zinc-200 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
                    <Scissors className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-zinc-950">
                        Full Foil Balayage + Gloss + Blowout
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-100 text-sky-800">
                        In-Service
                      </span>
                    </div>
                    <span className="text-xs text-zinc-500 mt-0.5">
                      Today at 10:15 AM • Chair 02 with Elena Rostova
                    </span>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[11px] bg-white border border-zinc-200 px-2 py-0.5 rounded text-zinc-800 shadow-2xs">
                        Est. Duration: 2h 45m
                      </span>
                      <span className="text-[11px] bg-white border border-zinc-200 px-2 py-0.5 rounded text-zinc-800 shadow-2xs">
                        Terminal Lane 01 Ready
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-base font-bold text-zinc-950 font-mono">$285.00</span>
                  <span className="block text-[11px] text-zinc-400">Unbilled</span>
                </div>
              </div>

              {/* Timeline Item 2: Past Visit August */}
              <div className="p-4 rounded-lg bg-zinc-50 hover:bg-zinc-100/70 border border-zinc-200 transition-colors flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 text-zinc-600 flex items-center justify-center shrink-0 shadow-2xs">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-zinc-950">
                        Custom Gloss Treatment & Precision Trim
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        Completed
                      </span>
                    </div>
                    <span className="text-xs text-zinc-500 mt-0.5">
                      Aug 14, 2024 • Stylist Elena Rostova
                    </span>
                    {/* Attached Retail Item */}
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[11px] bg-white border border-zinc-200 px-2 py-1 rounded text-zinc-800 flex items-center gap-1.5 shadow-2xs">
                        <ShoppingBag className="w-3.5 h-3.5 text-zinc-400" />
                        Oribe Gold Lust Shampoo (250ml) - $49.00
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-base font-bold text-zinc-950 font-mono">$189.00</span>
                  <span className="block text-[11px] text-emerald-700 font-medium">
                    Paid • Visa 9021
                  </span>
                </div>
              </div>

              {/* Timeline Item 3: Past Visit July */}
              <div className="p-4 rounded-lg bg-zinc-50 hover:bg-zinc-100/70 border border-zinc-200 transition-colors flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 text-zinc-600 flex items-center justify-center shrink-0 shadow-2xs">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-zinc-950">
                        Root Touch-Up & Scalp Detox Ritual
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        Completed
                      </span>
                    </div>
                    <span className="text-xs text-zinc-500 mt-0.5">
                      Jul 03, 2024 • Stylist Elena Rostova
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-base font-bold text-zinc-950 font-mono">$145.00</span>
                  <span className="block text-[11px] text-emerald-700 font-medium">
                    Paid • Apple Pay
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Action Dock for Front Desk & Touch Tablet */}
          <div className="sticky bottom-4 z-30 bg-white/95 backdrop-blur-md rounded-xl border border-zinc-200 p-4 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-zinc-900">
                {selectedClient.name} currently at Station 02
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setIsSmsModalOpen(true)}
                className="min-h-[44px] px-4 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-zinc-600" />
                <span>Quick SMS</span>
              </button>

              <button
                onClick={onOpenBookAppointment}
                className="min-h-[44px] px-4 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <CalendarPlus className="w-4 h-4 text-zinc-600" />
                <span>Book Appointment</span>
              </button>

              <button
                onClick={() => onSelectClientForCheckout(selectedClient)}
                className="min-h-[44px] px-5 bg-zinc-900 text-white hover:bg-zinc-800 active:bg-black rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
              >
                <CreditCard className="w-4 h-4" />
                <span>Express Checkout ($285)</span>
              </button>
            </div>
          </div>
            </>
          )}
        </section>
      </div>

      {/* Quick SMS Modal */}
      {selectedClient && isSmsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl border border-zinc-200 shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-zinc-900" />
                <h3 className="text-sm font-semibold text-zinc-900">Send Front Desk SMS</h3>
              </div>
              <button
                onClick={() => setIsSmsModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700"
              >
                ×
              </button>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block mb-1">
                Recipient
              </label>
              <div className="text-xs font-semibold text-zinc-900">
                {selectedClient.name} • {selectedClient.phone}
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block mb-1">
                Message Content
              </label>
              <textarea
                rows={3}
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsSmsModalOpen(false)}
                className="min-h-[44px] px-4 rounded-lg bg-zinc-100 text-zinc-700 hover:bg-zinc-200 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onShowToast(`SMS dispatched to ${selectedClient.name}`);
                  setIsSmsModalOpen(false);
                }}
                className="min-h-[44px] px-5 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-semibold cursor-pointer"
              >
                Send SMS Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Client Profile Modal */}
      {selectedClient && (
        <EditClientModal
          isOpen={isEditClientModalOpen}
          client={selectedClient}
          stylists={stylists}
          onClose={() => setIsEditClientModalOpen(false)}
          onSaveClient={(updated) => {
            if (onUpdateClient) {
              onUpdateClient(updated);
            } else {
              onShowToast(`Profile updated for ${updated.name}`);
            }
          }}
        />
      )}

      {/* Delete Client Confirmation Modal */}
      {selectedClient && (
        <DeleteConfirmModal
          isOpen={isDeleteClientModalOpen}
          title="Delete Client Record"
          message={`Are you sure you want to remove ${selectedClient.name} from the salon client directory? All associated color formulas, history records, and VIP loyalty balances will be permanently archived.`}
          itemIdentifier={`Client: ${selectedClient.name} • Phone: ${selectedClient.phone} • Tier: ${selectedClient.vipTier || 'Standard'}`}
          confirmButtonText="Delete Guest Profile"
          onClose={() => setIsDeleteClientModalOpen(false)}
          onConfirm={() => {
            if (onDeleteClient) {
              onDeleteClient(selectedClient.id);
            } else {
              onShowToast(`Client ${selectedClient.name} removed from registry`);
            }
          }}
        />
      )}
    </div>
  );
};
