import React, { useState } from 'react';
import {
  Store,
  ChevronDown,
  Search,
  Plus,
  Bell,
  Check,
  Building,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { APP_IMAGES } from '../../data/mockData';

interface HeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenNewAppointment: () => void;
  onOpenCommandPalette: () => void;
  onShowToast: (msg: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isSidebarOpen,
  onToggleSidebar,
  onOpenNewAppointment,
  onOpenCommandPalette,
  onShowToast,
}) => {
  const [selectedLocation, setSelectedLocation] = useState('Downtown Flagship - Floor 1');
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);

  const locations = [
    'Downtown Flagship - Floor 1',
    'Downtown Flagship - Floor 2 (VIP Suites)',
    'SoHo Studio - Color Bay',
    'Beverly Hills Pavilion',
  ];

  const notifications = [
    {
      id: 'notif-1',
      title: 'Station 01 Wash Complete',
      time: '2 mins ago',
      desc: 'Sophia Miller is ready for toner check at Basin 02.',
    },
    {
      id: 'notif-2',
      title: 'Walk-in Registered',
      time: '12 mins ago',
      desc: 'Emma Watson arrived early for 13:30 Keratin Smoothing.',
    },
    {
      id: 'notif-3',
      title: 'Terminal 01 Connected',
      time: '45 mins ago',
      desc: 'Aura Lane-01 contactless card reader synchronized successfully.',
    },
  ];

  return (
    <header
      className={`fixed top-0 ${
        isSidebarOpen ? 'left-72' : 'left-0'
      } right-0 h-16 bg-white/95 backdrop-blur-md border-b border-zinc-200 z-40 px-6 flex items-center justify-between gap-4 transition-[left] duration-200 ease-in-out`}
    >
      {/* Left: Sidebar toggle button + Location dropdown & search bar */}
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        {/* Side Navbar On/Off Toggle Button */}
        <button
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? 'Turn side navbar off' : 'Turn side navbar on'}
          title={isSidebarOpen ? 'Turn side navbar off (Cmd+B)' : 'Turn side navbar on (Cmd+B)'}
          className={`min-h-[44px] px-3 flex items-center gap-2 rounded-lg border text-xs font-semibold transition-all ${
            isSidebarOpen
              ? 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-700'
              : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-900 text-white shadow-xs'
          }`}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="w-4 h-4 text-zinc-600" />
          ) : (
            <PanelLeftOpen className="w-4 h-4 text-white" />
          )}
          <span>{isSidebarOpen ? 'Nav On' : 'Nav Off'}</span>
        </button>

        {/* Location Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsLocationMenuOpen(!isLocationMenuOpen)}
            className="min-h-[44px] px-3 flex items-center gap-2 text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors text-sm font-medium"
          >
            <Store className="w-5 h-5 text-zinc-500" />
            <span className="truncate max-w-[200px]">{selectedLocation}</span>
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          </button>

          {isLocationMenuOpen && (
            <div className="absolute left-0 mt-1 w-64 bg-white border border-zinc-200 rounded-xl shadow-lg p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Select Floor / Studio
              </div>
              {locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setSelectedLocation(loc);
                    setIsLocationMenuOpen(false);
                    onShowToast(`Switched view to ${loc}`);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-left transition-colors ${
                    selectedLocation === loc
                      ? 'bg-zinc-100 font-semibold text-zinc-900'
                      : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-zinc-400" />
                    {loc}
                  </span>
                  {selectedLocation === loc && <Check className="w-3.5 h-3.5 text-zinc-900" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            readOnly
            onClick={onOpenCommandPalette}
            placeholder="Cmd + K search client or appointment..."
            className="w-full min-h-[40px] pl-10 pr-14 py-2 bg-zinc-100/80 border border-zinc-200 rounded-lg text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-500 bg-white border border-zinc-200 rounded shadow-xs pointer-events-none">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Action Cluster */}
      <div className="flex items-center gap-4">
        {/* New Appointment Button */}
        <button
          onClick={onOpenNewAppointment}
          className="min-h-[44px] px-4 bg-zinc-900 text-white hover:bg-zinc-800 active:bg-black transition-colors rounded-lg text-sm font-medium flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Appointment</span>
        </button>

        <div className="h-6 w-px bg-zinc-200"></div>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setHasUnreadNotifications(false);
            }}
            aria-label="Notifications"
            className="relative min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {hasUnreadNotifications && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-1 w-80 bg-white border border-zinc-200 rounded-xl shadow-xl p-3 z-50 animate-in fade-in duration-100">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100 mb-2">
                <span className="text-xs font-semibold text-zinc-900">Floor Alerts</span>
                <span className="text-[11px] text-zinc-400">Live WebSockets</span>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-lg bg-zinc-50 hover:bg-zinc-100/80 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-900">{n.title}</span>
                      <span className="text-[10px] text-zinc-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-zinc-600 mt-0.5">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Lockup */}
        <div className="flex items-center gap-2.5 pl-1">
          <img
            src={APP_IMAGES.sarahJenkins}
            alt="Sarah Jenkins"
            className="w-9 h-9 rounded-full object-cover ring-1 ring-zinc-200 shadow-xs"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-semibold text-zinc-900 leading-tight">Sarah Jenkins</span>
            <span className="text-[11px] text-zinc-500">Front Desk Lead</span>
          </div>
        </div>
      </div>
    </header>
  );
};
