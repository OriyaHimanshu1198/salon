import React, { useState } from 'react';
import {
  Sparkles,
  Upload,
  Plus,
  TrendingUp,
  Award,
  CreditCard,
  Search,
  Check,
  Copy,
  FileText,
  Sliders,
  ExternalLink,
  Printer,
  Bath,
  Mic,
  Tag,
  Clock,
  MapPin,
  Edit3,
  Trash2,
} from 'lucide-react';
import { TherapyItem } from '../../types/salon';
import { INITIAL_THERAPIES } from '../../data/mockData';
import { CreateTherapyModal } from '../modals/CreateTherapyModal';
import { EditTherapyModal } from '../modals/EditTherapyModal';
import { DeleteConfirmModal } from '../modals/DeleteConfirmModal';

interface ManageTherapiesViewProps {
  therapies?: TherapyItem[];
  setTherapies?: React.Dispatch<React.SetStateAction<TherapyItem[]>>;
  onShowToast: (msg: string) => void;
}

export const ManageTherapiesView: React.FC<ManageTherapiesViewProps> = ({
  therapies: propTherapies,
  setTherapies: propSetTherapies,
  onShowToast,
}) => {
  const [localTherapies, setLocalTherapies] = useState<TherapyItem[]>([]);
  const therapies = propTherapies !== undefined ? propTherapies : localTherapies;
  const setTherapies = propSetTherapies !== undefined ? propSetTherapies : setLocalTherapies;

  const [selectedTherapyId, setSelectedTherapyId] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingTherapy, setEditingTherapy] = useState<TherapyItem | null>(null);
  const [deletingTherapy, setDeletingTherapy] = useState<TherapyItem | null>(null);

  const selectedTherapy =
    therapies.find((t) => t.id === selectedTherapyId) || therapies[0] || null;

  const handleCreateTherapy = (newTherapy: TherapyItem) => {
    setTherapies((prev) => [newTherapy, ...prev]);
    setSelectedTherapyId(newTherapy.id);
    onShowToast(`Sub-treatment ${newTherapy.name} added under ${newTherapy.category}`);
  };

  const handleUpdateTherapy = (updated: TherapyItem) => {
    setTherapies((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    onShowToast(`Sub-treatment ${updated.name} updated`);
  };

  const handleDeleteTherapy = (id: string) => {
    const target = therapies.find((t) => t.id === id);
    setTherapies((prev) => {
      const remaining = prev.filter((t) => t.id !== id);
      if (selectedTherapyId === id && remaining.length > 0) {
        setSelectedTherapyId(remaining[0].id);
      }
      return remaining;
    });
    if (target) {
      onShowToast(`Treatment ${target.name} removed from catalog`);
    }
  };

  const handleToggleOnline = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTherapies((prev) =>
      prev.map((t) => (t.id === id ? { ...t, onlineBookingEnabled: !t.onlineBookingEnabled } : t))
    );
    onShowToast('Online booking availability updated');
  };

  // Dynamic Categories from data with Men's Waxing prioritized
  const uniqueCategories = Array.from(
    new Set([
      'All',
      "Men's Waxing",
      'Scalp & Trichology',
      'Deep Bonding & Repair',
      'Botanical Spa Rituals',
      'Express Basin Gloss',
      ...therapies.map((t) => t.category),
    ])
  );

  const filteredTherapies = therapies.filter((t) => {
    if (activeCategory !== 'All' && t.category.toLowerCase() !== activeCategory.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesName = t.name.toLowerCase().includes(q);
      const matchesCat = t.category.toLowerCase().includes(q);
      const matchesDetails =
        t.protocolBrief.toLowerCase().includes(q) ||
        (t.treatmentDetails && t.treatmentDetails.toLowerCase().includes(q));
      if (!matchesName && !matchesCat && !matchesDetails) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full p-6 space-y-6 max-w-[1720px] mx-auto pb-20">
      {/* Top Breadcrumbs & Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-zinc-400 text-xs uppercase tracking-wider font-semibold">
            <span>Salon Services</span>
            <span>/</span>
            <span className="text-zinc-900 font-semibold">Protocol Catalog</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight">
            Manage Therapies & Rituals
          </h1>
          <p className="text-xs text-zinc-500 max-w-3xl">
            Configure technical formulas, treatment durations, station allocations, and service pricing for salon hair, scalp, and aesthetic therapies.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => onShowToast('Treatment protocol menu file uploaded')}
            className="min-h-[44px] px-4 bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-50 active:bg-zinc-100 transition-colors rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Upload className="w-4 h-4 text-zinc-500" />
            <span>Import Menu</span>
          </button>
          <button
            onClick={() => {
              setTherapies([]);
              setSelectedTherapyId('');
              onShowToast('All service rituals cleared for testing');
            }}
            className="min-h-[44px] px-3.5 bg-zinc-100 hover:bg-rose-50 hover:text-rose-700 border border-zinc-200 text-zinc-600 transition-colors rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            title="Clear all data to test creating from scratch"
          >
            <Trash2 className="w-4 h-4 text-zinc-400" />
            <span>Clear Catalog</span>
          </button>
          {therapies.length === 0 && (
            <button
              onClick={() => {
                setTherapies(INITIAL_THERAPIES);
                setSelectedTherapyId(INITIAL_THERAPIES[0].id);
                onShowToast('Sample demo therapies loaded');
              }}
              className="min-h-[44px] px-3.5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 transition-colors rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <span>Load Sample Rituals</span>
            </button>
          )}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="min-h-[44px] px-4 bg-zinc-900 text-white hover:bg-zinc-800 active:bg-black transition-colors rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Therapy</span>
          </button>
        </div>
      </div>

      {/* 4 Operational Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-zinc-200 rounded-xl p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[11px] uppercase tracking-wider font-semibold">
              Active Therapies
            </span>
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-2xl font-bold text-zinc-950">{therapies.length} Active Rituals</div>
            <div className="text-xs text-zinc-500 mt-1 truncate">
              4 Categories: Scalp Detox, Molecular, Keratin, Gloss
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-zinc-200 rounded-xl p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[11px] uppercase tracking-wider font-semibold">
              Avg Add-On Rate
            </span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-zinc-950">42.8%</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                +65 avg lift
              </span>
            </div>
            <div className="text-xs text-zinc-500 mt-1">
              4 out of 10 color appointments include therapy
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-zinc-200 rounded-xl p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[11px] uppercase tracking-wider font-semibold">
              Top Performed Therapy
            </span>
            <Award className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-bold text-zinc-950 truncate">K18 Peptide Mist</div>
            <div className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
              <strong className="text-zinc-900 font-bold">148 sessions</strong>
              <span>logged this month</span>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-zinc-200 rounded-xl p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[11px] uppercase tracking-wider font-semibold">
              Monthly Service Run
            </span>
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-zinc-950 font-mono">$18,420.00</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                +14% MoM
              </span>
            </div>
            <div className="text-xs text-zinc-500 mt-1">
              Direct treatment room & basin revenue
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Split-Pane: 65% Catalog List & Filters / 35% Quick Protocol Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT SIDE: Catalog & Formulas (lg:col-span-8) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Category Filters & Search Bar */}
          <div className="bg-white border border-zinc-200 rounded-xl p-4 space-y-4 shadow-xs">
            {/* Horizontal Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-zinc-200">
              {[
                { id: 'All', label: 'All (24)' },
                { id: 'Scalp & Trichology', label: 'Scalp & Trichology (6)' },
                { id: 'Deep Bonding & Repair', label: 'Deep Bonding & Repair (7)' },
                { id: 'Botanical Spa Rituals', label: 'Botanical Spa Rituals (5)' },
                { id: 'Express Basin Gloss', label: 'Express Basin Gloss (6)' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`min-h-[40px] px-3.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                    activeCategory === cat.id
                      ? 'bg-zinc-900 text-white shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Quick Filters: Chair type & Duration */}
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter formula, active agent, station..."
                  className="w-full min-h-[40px] pl-9 pr-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                <div className="flex items-center bg-zinc-100 border border-zinc-200 rounded-lg p-0.5">
                  <button
                    onClick={() => setStationFilter('all')}
                    className={`min-h-[34px] px-2.5 text-xs font-semibold rounded ${
                      stationFilter === 'all' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500'
                    }`}
                  >
                    All Stations
                  </button>
                  <button
                    onClick={() => setStationFilter('basin')}
                    className={`min-h-[34px] px-2.5 text-xs font-semibold rounded ${
                      stationFilter === 'basin' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500'
                    }`}
                  >
                    Wash Basin
                  </button>
                  <button
                    onClick={() => setStationFilter('bay')}
                    className={`min-h-[34px] px-2.5 text-xs font-semibold rounded ${
                      stationFilter === 'bay' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500'
                    }`}
                  >
                    Styling Bay
                  </button>
                </div>

                <div className="flex items-center bg-zinc-100 border border-zinc-200 rounded-lg p-0.5">
                  <button
                    onClick={() => setDurationFilter('all')}
                    className={`min-h-[34px] px-2.5 text-xs font-semibold rounded ${
                      durationFilter === 'all' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500'
                    }`}
                  >
                    Any Duration
                  </button>
                  <button
                    onClick={() => setDurationFilter('15')}
                    className={`min-h-[34px] px-2.5 text-xs font-semibold rounded ${
                      durationFilter === '15' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500'
                    }`}
                  >
                    15-20m
                  </button>
                  <button
                    onClick={() => setDurationFilter('30')}
                    className={`min-h-[34px] px-2.5 text-xs font-semibold rounded ${
                      durationFilter === '30' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500'
                    }`}
                  >
                    30m+
                  </button>
                  <button
                    onClick={() => setDurationFilter('45')}
                    className={`min-h-[34px] px-2.5 text-xs font-semibold rounded ${
                      durationFilter === '45' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500'
                    }`}
                  >
                    45m+
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* High-Density Protocol Cards List */}
          <div className="space-y-3">
            {filteredTherapies.length === 0 ? (
              <div className="p-12 rounded-xl bg-white border border-zinc-200 shadow-xs flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="text-base font-bold text-zinc-950">No Treatment Protocols</div>
                <p className="text-xs text-zinc-500 max-w-md leading-relaxed">
                  Default service protocols have been cleared for testing. Click "+ Add New Therapy" to configure a custom ritual, pricing, and consumables, or reload sample protocols.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-semibold hover:bg-zinc-800 active:bg-black transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Therapy</span>
                  </button>
                  <button
                    onClick={() => {
                      setTherapies(INITIAL_THERAPIES);
                      setSelectedTherapyId(INITIAL_THERAPIES[0].id);
                      onShowToast('Sample demo therapies loaded');
                    }}
                    className="px-4 py-2 bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-zinc-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Load Sample Protocols
                  </button>
                </div>
              </div>
            ) : (
              filteredTherapies.map((therapy) => {
              const isSelected = therapy.id === selectedTherapyId;
              return (
                <div
                  key={therapy.id}
                  onClick={() => setSelectedTherapyId(therapy.id)}
                  className={`p-4 rounded-xl bg-white border transition-all cursor-pointer shadow-xs ${
                    isSelected
                      ? 'border-2 border-zinc-900 shadow-md'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-zinc-950">
                          {therapy.name}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 text-[10px] font-semibold rounded-full ${
                            therapy.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {therapy.status}
                        </span>
                        {therapy.isPopular && (
                          <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-sky-100 text-sky-800">
                            Popular Add-On
                          </span>
                        )}
                        <span className="px-2 py-0.2 text-[10px] font-mono text-zinc-400 bg-zinc-100 rounded">
                          ID: {therapy.id.toUpperCase()}
                        </span>
                      </div>

                      <div className="text-xs text-zinc-500 flex items-center gap-3 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5 text-zinc-400" /> {therapy.category}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5 text-zinc-400" /> {therapy.durationMinutes} min duration
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-zinc-400" /> {therapy.station}
                        </span>
                      </div>
                    </div>

                    <div className="text-right sm:self-center flex sm:flex-col items-center sm:items-end justify-between gap-1">
                      <span className="text-lg font-bold text-zinc-950 font-mono">
                        ${therapy.price.toFixed(2)}
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        Commission: {therapy.commissionRate}% ($
                        {((therapy.price * therapy.commissionRate) / 100).toFixed(2)})
                      </span>
                    </div>
                  </div>

                  {/* Protocol Brief Line */}
                  <div className="bg-zinc-50 border border-zinc-200 p-2 rounded-lg px-3 text-zinc-800 text-xs flex items-center justify-between mt-3">
                    <span className="truncate">
                      <strong className="font-semibold text-zinc-900">Protocol:</strong>{' '}
                      {therapy.protocolBrief}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-bold uppercase text-zinc-900 tracking-wider shrink-0 ml-2">
                        Selected
                      </span>
                    )}
                  </div>

                  {/* Action Strip */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-100 mt-2 text-zinc-500">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTherapy(therapy);
                          setIsEditModalOpen(true);
                        }}
                        className="min-h-[36px] px-2.5 text-zinc-800 hover:bg-zinc-100 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Edit Therapy Protocol"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-zinc-700" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingTherapy(therapy);
                          setIsDeleteModalOpen(true);
                        }}
                        className="min-h-[36px] px-2.5 text-zinc-600 hover:text-rose-600 hover:bg-rose-50 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Delete Therapy Protocol"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        <span>Delete</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onShowToast(`Duplicated ${therapy.name}`);
                        }}
                        className="min-h-[36px] px-2 text-zinc-700 hover:bg-zinc-100 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" /> Duplicate
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onShowToast(`Downloading technical protocols PDF for ${therapy.name}`);
                        }}
                        className="min-h-[36px] px-2 text-zinc-700 hover:bg-zinc-100 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" /> Protocols (PDF)
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-zinc-400">Online Booking</span>
                      <button
                        type="button"
                        onClick={(e) => handleToggleOnline(therapy.id, e)}
                        className={`w-9 h-5 rounded-full relative inline-flex items-center p-0.5 transition-colors ${
                          therapy.onlineBookingEnabled ? 'bg-zinc-900' : 'bg-zinc-300'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 bg-white rounded-full transition-transform ${
                            therapy.onlineBookingEnabled ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        ></span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            }))}
          </div>
        </div>

        {/* RIGHT SIDE: Quick Edit / Protocol Inspector (lg:col-span-4) */}
        <div className="lg:col-span-4 sticky top-20 flex flex-col gap-4">
          {!selectedTherapy ? (
            <div className="bg-white border border-zinc-200 p-8 rounded-xl shadow-xs text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-zinc-950">No Ritual Selected</h3>
              <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
                Default data cleared for testing. Click "+ Add New Therapy" to register a ritual, or reload sample protocols.
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="min-h-[40px] px-4 bg-zinc-900 text-white rounded-lg text-xs font-semibold hover:bg-zinc-800 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Therapy</span>
              </button>
            </div>
          ) : (
            <div className="bg-white border border-zinc-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
            {/* Inspector Header */}
            <div className="p-4 border-b border-zinc-200 bg-zinc-50 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-100 text-emerald-800">
                    Active Ritual
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">{selectedTherapy.id.toUpperCase()}</span>
                </div>
                <h2 className="text-base font-bold text-zinc-950 mt-1">{selectedTherapy.name}</h2>
                <span className="text-xs text-zinc-500">Protocol & Dispensing Inspector</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setEditingTherapy(selectedTherapy);
                    setIsEditModalOpen(true);
                  }}
                  aria-label="Edit Protocol"
                  className="min-h-[36px] min-w-[36px] flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/60 rounded-lg transition-colors cursor-pointer"
                  title="Edit Protocol"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDeletingTherapy(selectedTherapy);
                    setIsDeleteModalOpen(true);
                  }}
                  aria-label="Delete Protocol"
                  className="min-h-[36px] min-w-[36px] flex items-center justify-center text-zinc-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete Protocol"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onShowToast(`Inspecting full protocol logs for ${selectedTherapy.name}`)}
                  aria-label="Inspect Full Screen"
                  className="min-h-[36px] min-w-[36px] flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200/60 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Inspector Body / Technical Form */}
            <div className="p-4 space-y-4">
              {/* Technical Formulation & Consumables */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    Consumables & Formula Mix
                  </span>
                  <button
                    onClick={() => onShowToast('Add stock inventory item opened')}
                    className="text-zinc-900 hover:underline text-xs font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Stock Item
                  </button>
                </div>

                <div className="bg-zinc-50 rounded-lg p-3 space-y-2 border border-zinc-200">
                  {selectedTherapy.consumables.map((c, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <div className="h-px bg-zinc-200"></div>}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex flex-col">
                          <span className="font-semibold text-zinc-900">{c.name}</span>
                          <span className="text-zinc-500 text-[11px]">{c.brand}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-medium text-zinc-900">{c.amount}</span>
                          <span className="block text-zinc-400 text-[11px] font-mono">
                            ${c.cost.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>

                {/* Consumable Cost & Net Service Margin */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 bg-zinc-50 rounded-lg border border-zinc-200">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                      Consumable Cost
                    </span>
                    <span className="text-sm font-bold text-zinc-950 font-mono">
                      ${selectedTherapy.consumableCost.toFixed(2)}{' '}
                      <span className="text-xs text-zinc-500 font-normal">/ session</span>
                    </span>
                  </div>
                  <div className="p-2.5 bg-zinc-50 rounded-lg border border-zinc-200">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                      Net Service Margin
                    </span>
                    <span className="text-sm font-bold text-emerald-700 font-mono">
                      {selectedTherapy.netMarginPercent}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Required Equipment & Station Allocation */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Station & Device Pairing
                </span>
                <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                  <Bath className="w-6 h-6 text-zinc-900 shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-zinc-900">
                      {selectedTherapy.stationDevice}
                    </span>
                    <span className="text-[11px] text-zinc-500 leading-tight">
                      {selectedTherapy.deviceDetails}
                    </span>
                  </div>
                </div>
              </div>

              {/* Add-on Compatibility / Pairing Analysis */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Service Add-On Pairing
                </span>
                <div className="space-y-2 text-xs">
                  {selectedTherapy.addOnPairings.map((pair, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-zinc-800">{pair.serviceName}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-zinc-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-zinc-900 h-full rounded-full"
                            style={{ width: `${pair.percentage}%` }}
                          ></div>
                        </div>
                        <span className="font-mono text-zinc-600 text-xs font-bold w-9 text-right">
                          +{pair.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Front Desk Client Recommendation Script */}
              <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 space-y-1">
                <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-semibold uppercase tracking-wider">
                  <Mic className="w-3.5 h-3.5 text-zinc-600" />
                  <span>Front Desk Script</span>
                </div>
                <p className="text-xs text-zinc-800 italic leading-relaxed">
                  {selectedTherapy.frontDeskScript}
                </p>
              </div>

              {/* Action Buttons for Inspector */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingTherapy(selectedTherapy);
                    setIsEditModalOpen(true);
                  }}
                  className="min-h-[44px] w-full bg-zinc-900 text-white hover:bg-zinc-800 active:bg-black transition-colors rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Protocol Details</span>
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onShowToast(`Printed station technical card for ${selectedTherapy.stationDevice}`)}
                    className="min-h-[44px] w-full bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50 transition-colors rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-zinc-500" />
                    <span>Print Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeletingTherapy(selectedTherapy);
                      setIsDeleteModalOpen(true);
                    }}
                    className="min-h-[44px] w-full bg-white text-zinc-700 hover:text-rose-700 border border-zinc-200 hover:bg-rose-50 transition-colors rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 text-rose-500" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Create Therapy Modal */}
      <CreateTherapyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTherapy={handleCreateTherapy}
      />

      {/* Edit Therapy Modal */}
      <EditTherapyModal
        isOpen={isEditModalOpen}
        therapy={editingTherapy || selectedTherapy}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTherapy(null);
        }}
        onSaveTherapy={handleUpdateTherapy}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Treatment Protocol"
        message={`Are you sure you want to remove ritual "${deletingTherapy?.name || selectedTherapy?.name}" from the active service catalog? Guests will no longer be able to book this online or at the styling bay.`}
        itemIdentifier={`Protocol: ${deletingTherapy?.name || selectedTherapy?.name} • Category: ${deletingTherapy?.category || selectedTherapy?.category}`}
        confirmButtonText="Delete Ritual"
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingTherapy(null);
        }}
        onConfirm={() => {
          if (deletingTherapy) {
            handleDeleteTherapy(deletingTherapy.id);
          } else if (selectedTherapy) {
            handleDeleteTherapy(selectedTherapy.id);
          }
        }}
      />
    </div>
  );
};
