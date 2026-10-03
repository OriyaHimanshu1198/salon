import React, { useState, useEffect } from 'react';
import { ViewMode, Client, Appointment, Stylist } from './types/salon';
import {
  INITIAL_STYLISTS,
  INITIAL_CLIENTS,
  INITIAL_APPOINTMENTS,
} from './data/mockData';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DailyDispatchView } from './components/dispatch/DailyDispatchView';
import { ClientEngineView } from './components/client/ClientEngineView';
import { ExpressCheckoutView } from './components/checkout/ExpressCheckoutView';
import { StylistsStationsView } from './components/stylists/StylistsStationsView';
import { ManageTherapiesView } from './components/therapies/ManageTherapiesView';
import { ManageOffersView } from './components/offers/ManageOffersView';
import { PerformanceReportsView } from './components/reports/PerformanceReportsView';
import { NewAppointmentModal } from './components/modals/NewAppointmentModal';
import { WalkInModal } from './components/modals/WalkInModal';
import { CommandPaletteModal } from './components/modals/CommandPaletteModal';
import { NewClientModal } from './components/modals/NewClientModal';
import { CheckCircle, Info, X } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('daily-dispatch');
  const [stylists, setStylists] = useState<Stylist[]>(INITIAL_STYLISTS);
  // Default data cleared for testing as requested by user
  const [clients, setClients] = useState<Client[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isTestBannerDismissed, setIsTestBannerDismissed] = useState(false);

  // Sidebar toggle state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Modals state
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [isWalkInOpen, setIsWalkInOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [isTerminalModalOpen, setIsTerminalModalOpen] = useState(false);
  const [terminalOnline, setTerminalOnline] = useState(true);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Global keyboard shortcuts: Cmd+K (Command Palette) & Cmd+B (Toggle Sidebar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarOpen((prev) => {
          const nextState = !prev;
          showToast(nextState ? 'Side navbar turned ON' : 'Side navbar turned OFF');
          return nextState;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const handleCreateAppointment = (newApptData: {
    clientName: string;
    stylistId: string;
    serviceName: string;
    startTime: string;
    durationMinutes: number;
    price: number;
    formulaNote?: string;
  }) => {
    const stylist = stylists.find((s) => s.id === newApptData.stylistId) || stylists[0];
    const newAppt: Appointment = {
      id: `appt-${Date.now()}`,
      clientId: `client-${Date.now()}`,
      clientName: newApptData.clientName,
      stylistId: stylist.id,
      stylistName: stylist.name,
      serviceName: newApptData.serviceName,
      station: stylist.station,
      startTime: newApptData.startTime,
      endTime: `${parseInt(newApptData.startTime.split(':')[0]) + 1}:30`,
      durationMinutes: newApptData.durationMinutes,
      status: 'confirmed',
      basePrice: newApptData.price,
      formulaNote: newApptData.formulaNote,
      subtotal: newApptData.price,
      gridColumn: stylists.findIndex((s) => s.id === stylist.id) % 5,
      topPx: 200,
      heightPx: 120,
    };

    setAppointments((prev) => [newAppt, ...prev]);
    showToast(`Appointment booked for ${newApptData.clientName} with ${stylist.name}`);
  };

  const handleWalkInCheckIn = (walkIn: {
    clientName: string;
    stylistId: string;
    serviceName: string;
    beverageChoice: string;
    estimatedWaitMins: number;
  }) => {
    const stylist = stylists.find((s) => s.id === walkIn.stylistId) || stylists[0];
    const newAppt: Appointment = {
      id: `appt-${Date.now()}`,
      clientId: `client-${Date.now()}`,
      clientName: walkIn.clientName,
      stylistId: stylist.id,
      stylistName: stylist.name,
      serviceName: walkIn.serviceName,
      station: 'Lounge Sofa B',
      startTime: '10:45',
      endTime: '11:45',
      durationMinutes: 60,
      status: 'waiting',
      basePrice: 85,
      subtotal: 85,
      gridColumn: 1,
      topPx: 180,
      heightPx: 92,
    };

    setAppointments((prev) => [newAppt, ...prev]);
    showToast(`Walk-in ${walkIn.clientName} checked in. Serving ${walkIn.beverageChoice}.`);
  };

  const handleAddNewClient = (newClient: Client) => {
    setClients((prev) => [newClient, ...prev]);
    showToast(`Client profile created for ${newClient.name}`);
  };

  const handleUpdateClient = (updatedClient: Client) => {
    setClients((prev) => prev.map((c) => (c.id === updatedClient.id ? updatedClient : c)));
    showToast(`Profile updated for ${updatedClient.name}`);
  };

  const handleDeleteClient = (clientId: string) => {
    const target = clients.find((c) => c.id === clientId);
    setClients((prev) => prev.filter((c) => c.id !== clientId));
    if (target) {
      showToast(`Client ${target.name} removed from registry`);
    }
  };

  const handleUpdateAppointment = (updatedAppt: Appointment) => {
    setAppointments((prev) => prev.map((a) => (a.id === updatedAppt.id ? updatedAppt : a)));
    showToast(`Appointment booking updated for ${updatedAppt.clientName}`);
  };

  const handleDeleteAppointment = (apptId: string) => {
    const target = appointments.find((a) => a.id === apptId);
    setAppointments((prev) => prev.filter((a) => a.id !== apptId));
    if (target) {
      showToast(`Appointment for ${target.clientName} removed from dispatch`);
    }
  };

  const handleClearClients = () => {
    setClients([]);
    showToast('Client directory cleared for testing');
  };

  const handleLoadSampleClients = () => {
    setClients(INITIAL_CLIENTS);
    showToast('Sample client directory loaded');
  };

  const handleClearAppointments = () => {
    setAppointments([]);
    showToast('Appointment dispatch cleared for testing');
  };

  const handleLoadSampleAppointments = () => {
    setAppointments(INITIAL_APPOINTMENTS);
    showToast('Sample appointments loaded');
  };

  const handleLoadAllSampleData = () => {
    setClients(INITIAL_CLIENTS);
    setAppointments(INITIAL_APPOINTMENTS);
    showToast('Sample clients & appointments loaded');
  };

  const handleSelectAppointmentForCheckout = (appt: Appointment) => {
    setCurrentView('express-checkout-pos');
    showToast(`Checkout loaded for ${appt.clientName} (${appt.serviceName})`);
  };

  const handleSelectClientForCheckout = (client: Client) => {
    setCurrentView('express-checkout-pos');
    showToast(`Checkout loaded for ${client.name}`);
  };

  const handlePaymentSuccess = (ticketNumber: string, amount: number) => {
    showToast(`Ticket #${ticketNumber} paid: $${amount.toFixed(2)} charged`);
  };

  return (
    <div className="bg-zinc-50 min-h-screen text-zinc-900 font-sans antialiased selection:bg-zinc-900 selection:text-white">
      {/* Mobile/Tablet Backdrop when sidebar is open on small screens */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-2xs transition-opacity"
        />
      )}

      {/* Fixed Sidebar with On/Off State */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => {
          setIsSidebarOpen((prev) => {
            const nextState = !prev;
            showToast(nextState ? 'Side navbar turned ON' : 'Side navbar turned OFF');
            return nextState;
          });
        }}
        currentView={currentView}
        onSelectView={(view) => setCurrentView(view)}
        onOpenTerminalSettings={() => setIsTerminalModalOpen(true)}
        terminalOnline={terminalOnline}
      />

      {/* Main Content Area */}
      <div
        className={`${
          isSidebarOpen ? 'pl-72' : 'pl-0'
        } flex flex-col min-h-screen transition-[padding] duration-200 ease-in-out`}
      >
        {/* Fixed Header */}
        <Header
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => {
            setIsSidebarOpen((prev) => {
              const nextState = !prev;
              showToast(nextState ? 'Side navbar turned ON' : 'Side navbar turned OFF');
              return nextState;
            });
          }}
          onOpenNewAppointment={() => setIsNewAppointmentOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onShowToast={showToast}
        />

        {/* View Content Port */}
        <main className="flex-1 pt-16 bg-zinc-50 flex flex-col">
          {/* Test Mode Banner when default data is cleared */}
          {clients.length === 0 && appointments.length === 0 && !isTestBannerDismissed && (
            <div className="mx-6 mt-4 p-3 bg-zinc-900 text-white rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                <span className="text-xs font-semibold">Test Mode Active:</span>
                <span className="text-xs text-zinc-300">Default clients & bookings cleared as requested. Create, edit, and delete records to test CRUD operations.</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLoadAllSampleData}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Load Sample Data
                </button>
                <button
                  onClick={() => setIsTestBannerDismissed(true)}
                  className="text-zinc-400 hover:text-white p-1 cursor-pointer"
                  aria-label="Dismiss banner"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {currentView === 'daily-dispatch' && (
            <DailyDispatchView
              appointments={appointments}
              stylists={stylists}
              onSelectAppointmentForCheckout={handleSelectAppointmentForCheckout}
              onOpenBookAppointment={() => setIsNewAppointmentOpen(true)}
              onOpenWalkIn={() => setIsWalkInOpen(true)}
              onUpdateAppointment={handleUpdateAppointment}
              onDeleteAppointment={handleDeleteAppointment}
              onClearAppointments={handleClearAppointments}
              onLoadSampleAppointments={handleLoadSampleAppointments}
              onShowToast={showToast}
            />
          )}

          {currentView === 'client-engine' && (
            <ClientEngineView
              clients={clients}
              stylists={stylists}
              onSelectClientForCheckout={handleSelectClientForCheckout}
              onOpenNewClient={() => setIsNewClientOpen(true)}
              onUpdateClient={handleUpdateClient}
              onDeleteClient={handleDeleteClient}
              onClearClients={handleClearClients}
              onLoadSampleClients={handleLoadSampleClients}
              onOpenBookAppointment={() => setIsNewAppointmentOpen(true)}
              onShowToast={showToast}
            />
          )}

          {currentView === 'express-checkout-pos' && (
            <ExpressCheckoutView
              onShowToast={showToast}
              onPaymentSuccess={handlePaymentSuccess}
            />
          )}

          {currentView === 'stylists-stations' && (
            <StylistsStationsView
              stylists={stylists}
              onShowToast={showToast}
            />
          )}

          {currentView === 'manage-therapies' && (
            <ManageTherapiesView onShowToast={showToast} />
          )}

          {currentView === 'manage-offers' && (
            <ManageOffersView onShowToast={showToast} />
          )}

          {currentView === 'performance-reports' && (
            <PerformanceReportsView stylists={stylists} onShowToast={showToast} />
          )}
        </main>
      </div>

      {/* Modals */}
      <NewAppointmentModal
        isOpen={isNewAppointmentOpen}
        onClose={() => setIsNewAppointmentOpen(false)}
        stylists={stylists}
        onSave={handleCreateAppointment}
      />

      <WalkInModal
        isOpen={isWalkInOpen}
        onClose={() => setIsWalkInOpen(false)}
        stylists={stylists}
        onCheckIn={handleWalkInCheckIn}
      />

      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        clients={clients}
        appointments={appointments}
        onNavigate={(view) => setCurrentView(view)}
        onSelectClient={(client) => {
          showToast(`Navigated to profile of ${client.name}`);
        }}
        onSelectAppointment={(appt) => {
          showToast(`Selected appointment for ${appt.clientName}`);
        }}
      />

      <NewClientModal
        isOpen={isNewClientOpen}
        onClose={() => setIsNewClientOpen(false)}
        stylists={stylists}
        onAddClient={handleAddNewClient}
      />

      {/* Terminal Hardware Diagnostic Modal */}
      {isTerminalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl border border-zinc-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <h3 className="text-sm font-bold text-zinc-950">Aura Terminal Diagnostic</h3>
              </div>
              <button
                onClick={() => setIsTerminalModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 flex justify-between">
                <span className="text-zinc-500">Hardware ID</span>
                <span className="font-mono font-bold text-zinc-900">AURA-LANE-01-BTLE</span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 flex justify-between">
                <span className="text-zinc-500">Pairing State</span>
                <span className="font-semibold text-emerald-700">Connected (BLE 5.3)</span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 flex justify-between">
                <span className="text-zinc-500">Battery Level</span>
                <span className="font-mono font-bold text-zinc-900">98% (Charging Dock)</span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 flex justify-between">
                <span className="text-zinc-500">EMV / NFC Firmware</span>
                <span className="font-mono text-zinc-700">v4.12.0-PCI-PTS-6.0</span>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                onClick={() => {
                  setTerminalOnline(!terminalOnline);
                  showToast(terminalOnline ? 'Terminal Lane 01 paused' : 'Terminal Lane 01 reconnected');
                }}
                className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 underline"
              >
                {terminalOnline ? 'Pause Terminal Link' : 'Reconnect Terminal'}
              </button>
              <button
                onClick={() => setIsTerminalModalOpen(false)}
                className="min-h-[44px] px-5 bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-semibold rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-zinc-900 text-white text-xs font-medium rounded-xl shadow-2xl border border-zinc-800 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-zinc-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
