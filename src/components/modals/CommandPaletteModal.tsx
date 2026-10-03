import React, { useState } from 'react';
import { Search, X, User, Calendar, CreditCard, Sparkles, ArrowRight, Tag } from 'lucide-react';
import { ViewMode, Client, Appointment } from '../../types/salon';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  appointments: Appointment[];
  onNavigate: (view: ViewMode) => void;
  onSelectClient: (client: Client) => void;
  onSelectAppointment: (appt: Appointment) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  clients,
  appointments,
  onNavigate,
  onSelectClient,
  onSelectAppointment,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.phone.includes(query) ||
      c.email.toLowerCase().includes(query.toLowerCase())
  );

  const filteredAppointments = appointments.filter(
    (a) =>
      a.clientName.toLowerCase().includes(query.toLowerCase()) ||
      a.serviceName.toLowerCase().includes(query.toLowerCase()) ||
      a.stylistName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-zinc-950/40 backdrop-blur-xs animate-in fade-in duration-100">
      <div className="bg-white rounded-xl border border-zinc-200 shadow-2xl max-w-xl w-full overflow-hidden">
        {/* Search Input */}
        <div className="p-3 border-b border-zinc-200 flex items-center gap-3 bg-zinc-50">
          <Search className="w-5 h-5 text-zinc-400 shrink-0 ml-1" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, client name, service, or #ticket..."
            className="w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-3">
          {/* Quick Nav Suggestions */}
          <div>
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-2 py-1">
              Quick Navigation
            </div>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <button
                onClick={() => {
                  onNavigate('daily-dispatch');
                  onClose();
                }}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 text-zinc-700 font-medium text-left"
              >
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-zinc-500" /> Daily Dispatch
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
              </button>
              <button
                onClick={() => {
                  onNavigate('client-engine');
                  onClose();
                }}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 text-zinc-700 font-medium text-left"
              >
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4 text-zinc-500" /> Client Engine
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
              </button>
              <button
                onClick={() => {
                  onNavigate('express-checkout-pos');
                  onClose();
                }}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 text-zinc-700 font-medium text-left"
              >
                <span className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-zinc-500" /> Express POS
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
              </button>
              <button
                onClick={() => {
                  onNavigate('manage-therapies');
                  onClose();
                }}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 text-zinc-700 font-medium text-left"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-zinc-500" /> Manage Therapies
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
              </button>
              <button
                onClick={() => {
                  onNavigate('manage-offers');
                  onClose();
                }}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 text-zinc-700 font-medium text-left col-span-2"
              >
                <span className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-zinc-500" /> Manage Offers & Promotions
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
              </button>
            </div>
          </div>

          {/* Matching Clients */}
          {filteredClients.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-2 py-1">
                Clients
              </div>
              <div className="space-y-1">
                {filteredClients.slice(0, 4).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectClient(c);
                      onNavigate('client-engine');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 text-left transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-zinc-200 text-zinc-800 flex items-center justify-center text-xs font-semibold">
                        {c.initials}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-zinc-900">{c.name}</div>
                        <div className="text-[11px] text-zinc-500">{c.phone} • {c.primaryStylist}</div>
                      </div>
                    </div>
                    {c.vipTier && (
                      <span className="text-[10px] bg-zinc-900 text-white px-2 py-0.5 rounded font-semibold">
                        {c.vipTier}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matching Appointments */}
          {filteredAppointments.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-2 py-1">
                Active & Upcoming Appointments
              </div>
              <div className="space-y-1">
                {filteredAppointments.slice(0, 3).map((a) => (
                  <button
                    key={a.id}
                    onClick={() => {
                      onSelectAppointment(a);
                      onNavigate('daily-dispatch');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 text-left transition-colors"
                  >
                    <div>
                      <div className="text-xs font-semibold text-zinc-900">
                        {a.clientName} — {a.serviceName}
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        {a.startTime} - {a.endTime} • {a.stylistName} • {a.station}
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-zinc-900">${a.subtotal}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between text-[11px] text-zinc-400">
          <span>Navigate with arrow keys or click</span>
          <span>ESC to exit</span>
        </div>
      </div>
    </div>
  );
};
