import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Clock,
  DollarSign,
  Percent,
  Save,
  Tag,
  FileText,
  Building,
} from 'lucide-react';
import { TherapyItem } from '../../types/salon';

interface EditTherapyModalProps {
  isOpen: boolean;
  therapy: TherapyItem | null;
  onClose: () => void;
  onSaveTherapy: (updatedTherapy: TherapyItem) => void;
}

const PRESET_CATEGORIES = [
  "Men's Waxing",
  'Scalp & Trichology',
  'Deep Bonding & Repair',
  'Botanical Spa Rituals',
  'Express Basin Gloss',
  'Haircut & Styling',
  'Color & Balayage',
];

export const EditTherapyModal: React.FC<EditTherapyModalProps> = ({
  isOpen,
  therapy,
  onClose,
  onSaveTherapy,
}) => {
  const [category, setCategory] = useState<string>("Men's Waxing");
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [subTreatmentName, setSubTreatmentName] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [price, setPrice] = useState(25);
  const [commissionRate, setCommissionRate] = useState(50);
  const [station, setStation] = useState('Private Grooming Suite 01');
  const [treatmentDetails, setTreatmentDetails] = useState('');
  const [status, setStatus] = useState<TherapyItem['status']>('Active');
  const [onlineBookingEnabled, setOnlineBookingEnabled] = useState(true);

  useEffect(() => {
    if (therapy) {
      setSubTreatmentName(therapy.name);
      if (PRESET_CATEGORIES.includes(therapy.category)) {
        setCategory(therapy.category);
        setIsCustomCategory(false);
        setCustomCategory('');
      } else {
        setCategory(therapy.category);
        setCustomCategory(therapy.category);
        setIsCustomCategory(true);
      }
      setDurationMinutes(therapy.durationMinutes);
      setPrice(therapy.price);
      setCommissionRate(therapy.commissionRate);
      setStation(therapy.station);
      setTreatmentDetails(therapy.treatmentDetails || therapy.protocolBrief || '');
      setStatus(therapy.status);
      setOnlineBookingEnabled(therapy.onlineBookingEnabled);
    }
  }, [therapy, isOpen]);

  if (!isOpen || !therapy) return null;

  const effectiveCategory = isCustomCategory && customCategory.trim() ? customCategory.trim() : category;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subTreatmentName.trim() || !effectiveCategory.trim()) return;

    const updated: TherapyItem = {
      ...therapy,
      name: subTreatmentName.trim(),
      category: effectiveCategory,
      durationMinutes: Number(durationMinutes) || 15,
      price: Number(price) || 25,
      commissionRate: Number(commissionRate) || 50,
      station,
      protocolBrief: treatmentDetails.trim(),
      treatmentDetails: treatmentDetails.trim(),
      status,
      onlineBookingEnabled,
    };

    onSaveTherapy(updated);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-treatment-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-2xl w-full overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 px-6 border-b border-zinc-200 flex items-center justify-between bg-zinc-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 id="edit-treatment-title" className="text-base font-bold text-zinc-950">
                Edit Sub-Treatment Details
              </h3>
              <p className="text-xs text-zinc-500">
                Update category, sub-treatment title, pricing, duration, and treatment details.
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Main Category Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-zinc-600" />
                <span>1. Main Category</span>
              </label>
              <button
                type="button"
                onClick={() => setIsCustomCategory(!isCustomCategory)}
                className="text-xs font-semibold text-zinc-700 hover:text-zinc-950 underline cursor-pointer"
              >
                {isCustomCategory ? 'Choose from list' : '+ Enter custom category'}
              </button>
            </div>

            {isCustomCategory ? (
              <input
                type="text"
                required
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="e.g. Men's Waxing, Laser Aesthetics..."
                className="w-full min-h-[42px] px-3 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none"
              />
            ) : (
              <div className="space-y-2">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full min-h-[42px] px-3 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none cursor-pointer"
                >
                  {PRESET_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <div className="flex flex-wrap gap-1.5">
                  {PRESET_CATEGORIES.map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                        category === cat
                          ? 'bg-zinc-900 text-white'
                          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sub-Treatment Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-zinc-600" />
              <span>2. Sub-Treatment Name</span>
            </label>
            <input
              type="text"
              required
              value={subTreatmentName}
              onChange={(e) => setSubTreatmentName(e.target.value)}
              placeholder="e.g. Men's Waxing - Eyebrow Tidy"
              className="w-full min-h-[42px] px-3 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none font-medium"
            />
          </div>

          {/* Price & Duration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-zinc-600" />
                <span>3. Price ($)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-sm">$</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full min-h-[42px] pl-8 pr-3 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none font-mono font-bold text-sm"
                />
              </div>
              <div className="flex gap-1.5 pt-1">
                {[15, 25, 45, 65, 85, 120].map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPrice(p)}
                    className="px-2 py-0.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded text-[10px] font-mono cursor-pointer"
                  >
                    ${p}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-600" />
                <span>4. Duration (Minutes)</span>
              </label>
              <input
                type="number"
                min="5"
                max="240"
                step="5"
                required
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full min-h-[42px] px-3 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none font-mono font-bold text-sm"
              />
              <div className="flex gap-1.5 pt-1">
                {[15, 30, 45, 60, 90].map((d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => setDurationMinutes(d)}
                    className="px-2 py-0.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded text-[10px] font-mono cursor-pointer"
                  >
                    {d}m
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Details about Treatment */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-zinc-600" />
                <span>5. Details About Treatment</span>
              </label>
              <span className="text-[11px] text-zinc-400">Preparation, protocol, and target area</span>
            </div>
            <textarea
              rows={3}
              required
              value={treatmentDetails}
              onChange={(e) => setTreatmentDetails(e.target.value)}
              placeholder="Provide complete details about this sub-treatment..."
              className="w-full p-3 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Station / Room Allocation & Commission */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-zinc-400" />
                <span>Station / Suite Allocation</span>
              </label>
              <select
                value={station}
                onChange={(e) => setStation(e.target.value)}
                className="w-full min-h-[42px] px-3 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none cursor-pointer"
              >
                <option value="Private Grooming Suite 01">Private Grooming Suite 01</option>
                <option value="Private Spa Suite 02">Private Spa Suite 02</option>
                <option value="Basin 01 & 02 (Wash Suite)">Basin 01 & 02 (Wash Suite)</option>
                <option value="Styling Bay 03 & 04">Styling Bay 03 & 04</option>
                <option value="Private VIP Room A">Private VIP Room A</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-zinc-400" />
                <span>Stylist Commission (%)</span>
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-full min-h-[42px] px-3 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/80 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              <span>Updated Preview</span>
              <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                ${price.toFixed(2)} • {durationMinutes} min
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-zinc-900 text-white">
                  {effectiveCategory || 'CATEGORY'}
                </span>
                <h4 className="text-sm font-bold text-zinc-950">
                  {subTreatmentName || 'Sub-Treatment Name'}
                </h4>
              </div>
              <p className="text-xs text-zinc-600 mt-1.5 line-clamp-2 italic">
                {treatmentDetails || 'Details about this treatment will appear here...'}
              </p>
            </div>
          </div>

          {/* Online Booking Toggle */}
          <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-zinc-900 block">Available for Online Booking</span>
              <span className="text-[11px] text-zinc-500">Allow guests to self-book this sub-treatment</span>
            </div>
            <button
              type="button"
              onClick={() => setOnlineBookingEnabled(!onlineBookingEnabled)}
              className={`w-11 h-6 rounded-full relative inline-flex items-center p-0.5 transition-colors cursor-pointer ${
                onlineBookingEnabled ? 'bg-zinc-900' : 'bg-zinc-300'
              }`}
            >
              <span
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  onlineBookingEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              ></span>
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 px-6 bg-zinc-50 border-t border-zinc-200 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-4 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="min-h-[44px] px-5 rounded-lg bg-zinc-900 hover:bg-zinc-800 active:bg-black text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Sub-Treatment Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
