import React, { useState } from 'react';
import {
  Calendar,
  PlusCircle,
  Table,
  Badge,
  TrendingUp,
  CreditCard,
  ShoppingBag,
  Sliders,
  ArrowLeftRight,
  UserPlus,
  Download,
  Receipt,
  MoreVertical,
  DoorOpen,
} from 'lucide-react';
import { Stylist } from '../../types/salon';
import { APP_IMAGES } from '../../data/mockData';

interface StylistsStationsViewProps {
  stylists: Stylist[];
  onShowToast: (msg: string) => void;
}

export const StylistsStationsView: React.FC<StylistsStationsViewProps> = ({
  stylists,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'grid' | 'roster'>('grid');
  const [isFloaterModalOpen, setIsFloaterModalOpen] = useState(false);
  const [selectedStationForSwap, setSelectedStationForSwap] = useState<string | null>(null);

  const stationsData = [
    {
      id: 'st-01',
      stationNum: 'Station 01',
      name: 'Color Bay Alpha',
      status: 'In-Service',
      stylistName: 'Elena Rostova',
      stylistRole: 'Master Colorist',
      avatar: APP_IMAGES.elenaRostova,
      activeClient: 'Sophia Miller',
      serviceNote: 'Balayage • until 11:30',
      utilization: 92,
    },
    {
      id: 'st-02',
      stationNum: 'Station 02',
      name: 'Main Styling Wing',
      status: 'In-Service',
      stylistName: 'Marcus Vance',
      stylistRole: 'Senior Stylist',
      avatar: APP_IMAGES.marcusVance,
      activeClient: 'Alexander Wright',
      serviceNote: 'Precision Cut • until 12:00',
      utilization: 85,
    },
    {
      id: 'st-03',
      stationNum: 'Station 03',
      name: 'Texture Suite',
      status: 'In-Service',
      stylistName: 'Maya Lin',
      stylistRole: 'Extension Specialist',
      avatar: APP_IMAGES.mayaLin,
      activeClient: 'Jessica Taylor',
      serviceNote: 'Tape-In Install • until 13:00',
      utilization: 96,
    },
    {
      id: 'st-04',
      stationNum: 'Station 04',
      name: 'Color Bay Beta',
      status: 'In-Service',
      stylistName: 'David Kim',
      stylistRole: 'Color Specialist',
      avatar: APP_IMAGES.davidKim,
      activeClient: 'Harper Brooks',
      serviceNote: 'Full Foil Gloss • until 13:00',
      utilization: 78,
    },
    {
      id: 'st-05',
      stationNum: 'Station 05',
      name: 'Styling Station B',
      status: 'Available / Ready',
      stylistName: 'Zoe Alvarez',
      stylistRole: 'Junior Stylist',
      avatar: APP_IMAGES.zoeAlvarez,
      activeClient: 'Keisha Cole (12:00)',
      serviceNote: 'Sanitized & Ready',
      utilization: 70,
    },
    {
      id: 'st-06',
      stationNum: 'Station 06',
      name: 'Barber & Grooming',
      status: 'On Break',
      stylistName: 'Leo Chen',
      stylistRole: 'Master Barber',
      avatar: APP_IMAGES.leoChen,
      activeClient: 'Next: Beard Sculpt',
      serviceNote: 'Break until 11:45',
      utilization: 82,
    },
    {
      id: 'st-07',
      stationNum: 'Station 07',
      name: 'VIP Private Room',
      status: 'Available',
      stylistName: 'Station Open',
      stylistRole: 'Unassigned',
      avatar: '',
      activeClient: 'Open for Booking',
      serviceNote: 'Floater / Bridal Suite',
      utilization: 0,
      isVacant: true,
    },
  ];

  return (
    <div className="flex flex-col w-full p-6 space-y-6 max-w-[1720px] mx-auto pb-20">
      {/* Top Command & Filter Bar */}
      <section className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-zinc-400 text-xs uppercase tracking-wider font-semibold">
            <span>Salon Operations</span>
            <span>/</span>
            <span className="text-zinc-900">Chairs & Staff</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight">
            Stylists & Stations Management
          </h1>
          <p className="text-sm text-zinc-500 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-medium text-zinc-900">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              6 Active Chairs
            </span>
            <span>•</span>
            <span className="font-medium text-zinc-500">1 Vacant</span>
            <span>•</span>
            <span className="font-medium text-zinc-500">2 Floaters Logged</span>
          </p>
        </div>

        {/* Actions & Context Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-white border border-zinc-200 p-1 rounded-lg shadow-xs">
            <button
              onClick={() => setActiveTab('grid')}
              className={`min-h-[40px] px-4 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'grid'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <Table className="w-4 h-4" />
              <span>Station Grid</span>
            </button>
            <button
              onClick={() => setActiveTab('roster')}
              className={`min-h-[40px] px-4 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'roster'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <Badge className="w-4 h-4" />
              <span>Commission Matrix</span>
            </button>
          </div>

          <div className="flex items-center bg-white border border-zinc-200 px-4 min-h-[44px] rounded-lg shadow-xs text-xs text-zinc-900 gap-2">
            <Calendar className="w-4 h-4 text-zinc-400" />
            <span className="font-semibold">Today, Oct 24</span>
            <span className="text-zinc-400 font-normal">(Shift A • 08:30 - 18:00)</span>
          </div>

          <button
            onClick={() => onShowToast('+ Add Stylist / Station modal opened')}
            className="min-h-[44px] px-4 bg-zinc-900 text-white hover:bg-zinc-800 active:bg-black transition-colors rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add Stylist / Station</span>
          </button>
        </div>
      </section>

      {/* Live Floor Utilization Gauge Banner */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Floor Occupancy
            </span>
            <span className="text-2xl font-bold text-zinc-950 mt-1">85.7%</span>
            <span className="text-xs text-emerald-700 font-semibold mt-0.5">+8% vs yesterday</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center">
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-zinc-200"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
              />
              <path
                className="text-emerald-500"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray="86, 100"
                strokeLinecap="round"
                strokeWidth="3.5"
              />
            </svg>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Today's Service Run
            </span>
            <span className="text-2xl font-bold text-zinc-950 mt-1 font-mono">$3,900.00</span>
            <span className="text-xs text-zinc-500 mt-0.5">27 total appointments</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Retail Cross-Sell
            </span>
            <span className="text-2xl font-bold text-zinc-950 mt-1 font-mono">$405.00</span>
            <span className="text-xs text-emerald-700 font-semibold mt-0.5">10.3% attach rate</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Est. Salon Commission
            </span>
            <span className="text-2xl font-bold text-zinc-950 mt-1 font-mono">$2,139.75</span>
            <span className="text-xs text-zinc-500 mt-0.5">Average split 49.2%</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </section>

      {/* Station Grid (Workstations visual layout) */}
      {activeTab === 'grid' && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-zinc-950">Live Floor Workstations</h2>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-zinc-100 text-zinc-800">
                7 Dedicated Bays
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                <span>In-Service</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>Break</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {stationsData.map((bay) => {
              let badgeColor = 'bg-sky-100 text-sky-800';
              if (bay.status.includes('Available') || bay.status.includes('Ready')) {
                badgeColor = 'bg-emerald-100 text-emerald-800';
              } else if (bay.status.includes('Break')) {
                badgeColor = 'bg-amber-100 text-amber-800';
              }

              if (bay.isVacant) {
                return (
                  <div
                    key={bay.id}
                    className="bg-white border-2 border-dashed border-zinc-200 rounded-xl p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                            {bay.stationNum}
                          </span>
                          <h3 className="text-sm font-semibold text-zinc-950">{bay.name}</h3>
                        </div>
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                          Available
                        </span>
                      </div>

                      <div className="p-4 bg-zinc-50 rounded-lg flex flex-col items-center justify-center text-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-500">
                          <DoorOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-zinc-900 block">Station Open</span>
                          <span className="text-[11px] text-zinc-400">Unassigned for remainder of shift</span>
                        </div>
                      </div>

                      <p className="text-xs text-zinc-500 text-center leading-relaxed">
                        Floater assignment open for booked bridal party or specialty service.
                      </p>
                    </div>

                    <div className="pt-4 border-t border-zinc-100 mt-4">
                      <button
                        onClick={() => {
                          setIsFloaterModalOpen(true);
                          onShowToast('Floater assignment panel opened for Station 07');
                        }}
                        className="w-full min-h-[44px] px-4 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Assign Floater</span>
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={bay.id}
                  className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                          {bay.stationNum}
                        </span>
                        <h3 className="text-sm font-semibold text-zinc-950">{bay.name}</h3>
                      </div>
                      <span className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full ${badgeColor}`}>
                        {bay.status}
                      </span>
                    </div>

                    {/* Stylist snippet */}
                    <div className="flex items-center gap-3 p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg">
                      <img
                        src={bay.avatar}
                        alt={bay.stylistName}
                        className="w-10 h-10 rounded-full object-cover shadow-2xs ring-1 ring-zinc-200"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-zinc-900 truncate">
                          {bay.stylistName}
                        </span>
                        <span className="text-[11px] text-zinc-500">{bay.stylistRole}</span>
                      </div>
                    </div>

                    {/* Active Work Info */}
                    <div className="space-y-1.5 text-xs text-zinc-600">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Active Client:</span>
                        <span className="font-semibold text-zinc-900">{bay.activeClient}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Service & Finish:</span>
                        <span className="font-semibold text-zinc-900">{bay.serviceNote}</span>
                      </div>

                      <div className="pt-2">
                        <div className="flex justify-between items-center text-[11px] mb-1">
                          <span className="text-zinc-400">Chair Utilization</span>
                          <span className="font-bold text-zinc-900 font-mono">{bay.utilization}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                          <div
                            className="bg-zinc-900 h-full rounded-full"
                            style={{ width: `${bay.utilization}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-zinc-100 mt-4">
                    <button
                      onClick={() => onShowToast(`Schedule editor opened for ${bay.stylistName}`)}
                      className="flex-1 min-h-[44px] px-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Schedule</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedStationForSwap(bay.name);
                        onShowToast(`Swap station requested for ${bay.stationNum}`);
                      }}
                      className="flex-1 min-h-[44px] px-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                      <span>Swap</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Performance & Commission Matrix */}
      {(activeTab === 'roster' || activeTab === 'grid') && (
        <section className="bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-zinc-950">
                Stylist Performance & Commission Tracking
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Real-time daily service splits, retail incentives, and shift operational status.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onShowToast('Payroll CSV exported to downloads')}
                className="min-h-[44px] px-4 rounded-lg bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4 text-zinc-600" />
                <span>Export Payroll CSV</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 text-zinc-400 text-[11px] uppercase tracking-wider font-semibold border-b border-zinc-200">
                  <th className="py-3 px-4">Stylist Name</th>
                  <th className="py-3 px-4">Tier</th>
                  <th className="py-3 px-4 text-center">Bookings</th>
                  <th className="py-3 px-4 text-right">Service Rev</th>
                  <th className="py-3 px-4 text-right">Retail Sold</th>
                  <th className="py-3 px-4 text-center">Rate</th>
                  <th className="py-3 px-4 text-right">Est. Comm.</th>
                  <th className="py-3 px-4 text-center">Day Status</th>
                  <th className="py-3 px-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs">
                {stylists.map((st) => (
                  <tr key={st.id} className="hover:bg-zinc-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={st.avatar}
                          alt={st.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-200 shadow-2xs"
                        />
                        <span className="font-bold text-zinc-900">{st.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-zinc-500 uppercase text-[11px] font-medium">
                      {st.tier}
                    </td>
                    <td className="py-3 px-4 text-center font-medium">{st.bookingsCount} Appts</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-zinc-950">
                      ${st.serviceRevenue.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-medium text-zinc-800">
                      ${st.retailSold.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 text-xs font-semibold rounded bg-zinc-100 text-zinc-800">
                        {st.commissionRate}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-zinc-950">
                      ${st.estimatedCommission.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full ${
                          st.status === 'In-Service'
                            ? 'bg-sky-100 text-sky-800'
                            : st.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {st.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onShowToast(`Commission breakdown ledger for ${st.name}`)}
                          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors"
                          title="View Commission Details"
                        >
                          <Receipt className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onShowToast(`Shift timing modified for ${st.name}`)}
                          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors"
                          title="Adjust Schedule"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Matrix Summary Footer */}
          <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
            <div className="flex items-center gap-3">
              <span>Displaying 6 of 6 rostered personnel</span>
              <span>•</span>
              <span>Standard daily payout batch auto-runs at 21:00 EST</span>
            </div>
            <div className="flex items-center gap-6 font-medium text-zinc-900">
              <span>
                Total Service: <strong className="font-bold font-mono">$3,900.00</strong>
              </span>
              <span>
                Total Commission Due: <strong className="font-bold font-mono">$2,139.75</strong>
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Floater Assignment Modal */}
      {isFloaterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl border border-zinc-200 shadow-2xl max-w-md w-full p-5 space-y-4">
            <h3 className="text-sm font-bold text-zinc-900">Assign Floater to Station 07 (VIP Room)</h3>
            <p className="text-xs text-zinc-500">
              Select an available floating technician or bridal specialist to activate Station 07.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  onShowToast('Claire Fontaine assigned to Station 07');
                  setIsFloaterModalOpen(false);
                }}
                className="w-full p-3 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-left flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-zinc-900">Claire Fontaine</div>
                  <div className="text-zinc-500">Bridal Updo & Couture Styling Floater</div>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                  Available Now
                </span>
              </button>
              <button
                onClick={() => {
                  onShowToast('Jordan Reed assigned to Station 07');
                  setIsFloaterModalOpen(false);
                }}
                className="w-full p-3 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-left flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-zinc-900">Jordan Reed</div>
                  <div className="text-zinc-500">Trichology Headspa Specialist</div>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                  Available Now
                </span>
              </button>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsFloaterModalOpen(false)}
                className="min-h-[44px] px-4 rounded-lg bg-zinc-100 text-zinc-700 text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
