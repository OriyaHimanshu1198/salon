import React from 'react';
import {
  Calendar,
  Users,
  CreditCard,
  Scissors,
  Sparkles,
  Tag,
  BarChart3,
  Wifi,
  Settings,
  PanelLeftClose,
} from 'lucide-react';
import { ViewMode } from '../../types/salon';
import { APP_IMAGES } from '../../data/mockData';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  onOpenTerminalSettings: () => void;
  terminalOnline: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  currentView,
  onSelectView,
  onOpenTerminalSettings,
  terminalOnline,
}) => {
  const navItems: { id: ViewMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'daily-dispatch', label: 'Daily Dispatch', icon: Calendar },
    { id: 'client-engine', label: 'Client Engine', icon: Users },
    { id: 'express-checkout-pos', label: 'Express Checkout & POS', icon: CreditCard },
    { id: 'stylists-stations', label: 'Stylists & Stations', icon: Scissors },
    { id: 'manage-therapies', label: 'Manage Therapies', icon: Sparkles },
    { id: 'manage-offers', label: 'Manage Offers', icon: Tag },
    { id: 'performance-reports', label: 'Performance & Reports', icon: BarChart3 },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-full w-72 bg-white border-r border-zinc-200 z-50 flex flex-col justify-between select-none transition-transform duration-200 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex flex-col flex-1">
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-zinc-200">
          <div className="flex items-center gap-3">
            <img
              src={APP_IMAGES.logo}
              alt="Aura Suite Logo"
              className="h-8 w-8 rounded-lg object-contain bg-black p-0.5 shadow-sm"
              onError={(e) => {
                // fallback styled badge if external image fails
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <div className="flex flex-col">
              <span className="text-base font-semibold text-zinc-950 tracking-tight leading-none">
                Aura Suite
              </span>
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mt-0.5">
                Salon OS
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded border border-zinc-200">
              Studio 04
            </span>
            <button
              onClick={onToggle}
              title="Turn side navbar off (hide)"
              aria-label="Turn side navbar off"
              className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="p-4">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400 px-3 mb-2">
            Operations & Services
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  className={`min-h-[44px] w-full flex items-center gap-3 px-3.5 rounded-lg text-sm font-medium transition-colors text-left ${
                    isActive
                      ? 'bg-zinc-900 text-white shadow-sm font-medium'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Terminal Linked Card */}
      <div className="p-4 border-t border-zinc-200 bg-white">
        <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 border border-zinc-200">
          <div className="flex items-center gap-2.5">
            <Wifi className="w-5 h-5 text-zinc-400" />
            <div className="flex flex-col">
              <span className="text-xs text-zinc-900 font-semibold leading-tight">
                Terminal Linked
              </span>
              <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${terminalOnline ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`}></span>
                Lane 01 Active
              </span>
            </div>
          </div>
          <button
            onClick={onOpenTerminalSettings}
            aria-label="Terminal Settings"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 rounded-md transition-colors"
            title="Terminal Hardware Diagnostic"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
