import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Filter,
  UserPlus,
  Plus,
  Clock,
  Sparkles,
  AlertTriangle,
  Coffee,
  X,
  CreditCard,
  ShoppingBag,
  CalendarCheck,
  Brush,
  ChevronDown,
  Layers,
  ArrowRight,
  CheckCircle,
  Trash2,
  Edit3,
  RotateCcw,
} from 'lucide-react';
import { Appointment, Stylist } from '../../types/salon';
import { APP_IMAGES } from '../../data/mockData';
import {
  WEEK_DAYS_META,
  WEEK_ADDITIONAL_APPOINTMENTS,
  WeekAppointment,
} from '../../data/weekAppointments';
import { EditAppointmentModal } from '../modals/EditAppointmentModal';
import { DeleteConfirmModal } from '../modals/DeleteConfirmModal';

interface DailyDispatchViewProps {
  appointments: Appointment[];
  stylists: Stylist[];
  onSelectAppointmentForCheckout: (appt: Appointment) => void;
  onOpenBookAppointment: () => void;
  onOpenWalkIn: () => void;
  onUpdateAppointment?: (appt: Appointment) => void;
  onDeleteAppointment?: (apptId: string) => void;
  onClearAppointments?: () => void;
  onLoadSampleAppointments?: () => void;
  onShowToast: (msg: string) => void;
}

export const DailyDispatchView: React.FC<DailyDispatchViewProps> = ({
  appointments,
  stylists,
  onSelectAppointmentForCheckout,
  onOpenBookAppointment,
  onOpenWalkIn,
  onUpdateAppointment,
  onDeleteAppointment,
  onClearAppointments,
  onLoadSampleAppointments,
  onShowToast,
}) => {
  const [selectedDate, setSelectedDate] = useState('Tuesday, Oct 24, 2024');
  const [activeSegmentView, setActiveSegmentView] = useState<'matrix' | 'week' | 'flow'>('matrix');
  const [selectedStylistFilter, setSelectedStylistFilter] = useState('all');
  const [isStylistFilterOpen, setIsStylistFilterOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>('appt-1');
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [isEditApptModalOpen, setIsEditApptModalOpen] = useState(false);
  const [isDeleteApptModalOpen, setIsDeleteApptModalOpen] = useState(false);
  const [editingAppt, setEditingAppt] = useState<Appointment | null>(null);
  const [deletingAppt, setDeletingAppt] = useState<Appointment | null>(null);

  // Combine today's live appointments with week dataset
  const todayWeekAppointments: WeekAppointment[] = appointments.map((a) => ({
    ...a,
    dayIndex: 1,
    dayName: 'Tuesday',
  }));

  const allWeekAppointments: WeekAppointment[] = [
    ...todayWeekAppointments,
    ...WEEK_ADDITIONAL_APPOINTMENTS,
  ];

  const allAvailableAppointments = [
    ...appointments,
    ...WEEK_ADDITIONAL_APPOINTMENTS,
  ];

  const selectedAppointment =
    allAvailableAppointments.find((a) => a.id === selectedAppointmentId) ||
    appointments[0] ||
    null;

  const filteredAppointments = appointments.filter((a) => {
    if (selectedStylistFilter === 'all') return true;
    return a.stylistId === selectedStylistFilter;
  });

  const filteredWeekAppointments = allWeekAppointments.filter((a) => {
    if (selectedStylistFilter === 'all') return true;
    return a.stylistId === selectedStylistFilter;
  });

  const chairFlowStations = [
    {
      id: 'stn-01',
      stationNum: '01',
      name: 'Station 01',
      title: 'Master Color & Formulation Bay',
      stylist: 'Elena Rostova',
      stylistAvatar: APP_IMAGES.elenaRostova,
      client: 'Sophia Miller',
      isVip: true,
      service: 'Balayage & Signature Gloss',
      phase: 'Glossing & Basin Check',
      timeWindow: '09:00 - 11:30',
      elapsedMinutes: 105,
      totalMinutes: 150,
      timeLeft: '25 min left',
      status: 'in-service',
      nextUp: 'Beatrice Potter (12:00)',
      formula: 'Redken Shades EQ: 09V + 09GI (equal parts)',
    },
    {
      id: 'stn-02',
      stationNum: '02',
      name: 'Station 02',
      title: 'Precision Grooming Chair',
      stylist: 'Marcus Vance',
      stylistAvatar: APP_IMAGES.marcusVance,
      client: 'Alexander Wright',
      isVip: false,
      service: "Gentleman's Grooming",
      phase: 'Rinse & Hot Towel Polish',
      timeWindow: '11:00 - 12:00',
      elapsedMinutes: 45,
      totalMinutes: 60,
      timeLeft: '15 min left',
      status: 'in-service',
      nextUp: 'Liam Davies (12:30)',
      formula: 'Tea Tree Scalp Detox & Eucalyptus Tonic',
    },
    {
      id: 'stn-03',
      stationNum: '03',
      name: 'Station 03',
      title: 'Texture & Extensions Suite',
      stylist: 'Maya Lin',
      stylistAvatar: APP_IMAGES.mayaLin,
      client: 'Jessica Taylor',
      isVip: false,
      service: 'Tape-in Extensions Install',
      phase: 'Row 3 Placement',
      timeWindow: '10:00 - 13:00',
      elapsedMinutes: 120,
      totalMinutes: 180,
      timeLeft: '60 min left',
      status: 'in-service',
      nextUp: 'Emma Watson (13:30 - Lounge)',
      formula: '22" Remy Russian Silk Wefts in Buttercream',
    },
    {
      id: 'stn-04',
      stationNum: '04',
      name: 'Station 04',
      title: 'Styling & Cutting Bay',
      stylist: 'David Kim',
      stylistAvatar: APP_IMAGES.davidKim,
      client: 'Natalie Portman',
      isVip: true,
      service: 'Precision Bob Cut',
      phase: 'Final Styling & Blowout',
      timeWindow: '10:00 - 11:00',
      elapsedMinutes: 55,
      totalMinutes: 60,
      timeLeft: '5 min left',
      status: 'finishing',
      nextUp: 'Lucas Scott (11:30)',
      formula: 'Blunt Perimeter & Dry Texturizing Shear',
    },
    {
      id: 'stn-05',
      stationNum: '05',
      name: 'Station 05',
      title: 'Scalp Spa & Blowout Suite',
      stylist: 'Zoe Alvarez',
      stylistAvatar: APP_IMAGES.zoeAlvarez,
      client: 'Keisha Cole',
      isVip: false,
      service: 'Silk Press & Scalp Care',
      phase: 'Thermal Steamer Infusion',
      timeWindow: '12:00 - 13:15',
      elapsedMinutes: 30,
      totalMinutes: 75,
      timeLeft: '45 min left',
      status: 'in-service',
      nextUp: 'Chloe Vance (13:30)',
      formula: 'K18 Peptide Prep + Ultrasonic Micro-Mist',
    },
    {
      id: 'stn-06',
      stationNum: '06',
      name: 'Station 06',
      title: 'Barber & Express Styling',
      stylist: 'Leo Chen',
      stylistAvatar: APP_IMAGES.leoChen,
      client: 'Ready for Guest',
      isVip: false,
      service: 'Chair Sanitized & Available',
      phase: 'Turnover Complete • Ready',
      timeWindow: 'Turnover Complete',
      elapsedMinutes: 0,
      totalMinutes: 60,
      timeLeft: 'Turnover Ready',
      status: 'available',
      nextUp: 'Ryan Sterling (11:30)',
      formula: 'Station Sterilized • Clean Cape Deployed',
    },
  ];

  const timeSlots = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
  ];

  const displayedStylists = stylists.slice(0, 5);

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Top Command & Filter Bar */}
      <div className="p-6 pb-0 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Date Navigator & View Switcher */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center bg-white rounded-lg border border-zinc-200 shadow-xs p-1">
              <button
                onClick={() => {
                  if (activeSegmentView === 'week') {
                    onShowToast('Showing Previous Week (Oct 16 – Oct 22)');
                  } else {
                    onShowToast('Showing Monday, Oct 23, 2024');
                  }
                }}
                aria-label="Previous day or week"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 px-3 min-h-[44px]">
                <Calendar className="w-4 h-4 text-zinc-400" />
                <span className="text-sm font-semibold text-zinc-900 whitespace-nowrap">
                  {activeSegmentView === 'week' ? 'Week of Oct 23 – Oct 29, 2024' : selectedDate}
                </span>
              </div>
              <button
                onClick={() => {
                  if (activeSegmentView === 'week') {
                    onShowToast('Showing Next Week (Oct 30 – Nov 05)');
                  } else {
                    onShowToast('Showing Wednesday, Oct 25, 2024');
                  }
                }}
                aria-label="Next day or week"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setSelectedDate('Tuesday, Oct 24, 2024');
                  onShowToast(activeSegmentView === 'week' ? 'Reset to Current Week' : 'Reset to Today');
                }}
                className="min-h-[36px] px-3 ml-1 rounded text-xs font-semibold text-zinc-800 bg-zinc-100 hover:bg-zinc-200 transition-colors"
              >
                {activeSegmentView === 'week' ? 'Current Week' : 'Today'}
              </button>
            </div>

            {/* View Segmented Controls */}
            <div className="flex items-center bg-white rounded-lg border border-zinc-200 shadow-xs p-1">
              <button
                onClick={() => {
                  setActiveSegmentView('matrix');
                  onShowToast('Switched to Day Matrix view');
                }}
                className={`min-h-[40px] px-4 rounded text-xs font-semibold transition-all ${
                  activeSegmentView === 'matrix'
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                Day (Matrix)
              </button>
              <button
                onClick={() => {
                  setActiveSegmentView('week');
                  onShowToast('Switched to Week Matrix (7 Days)');
                }}
                className={`min-h-[40px] px-4 rounded text-xs font-semibold transition-all ${
                  activeSegmentView === 'week'
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                Week (Matrix)
              </button>
              <button
                onClick={() => {
                  setActiveSegmentView('flow');
                  onShowToast('Switched to Chair Flow timeline view');
                }}
                className={`min-h-[40px] px-4 rounded text-xs font-semibold transition-all ${
                  activeSegmentView === 'flow'
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                Chair Flow
              </button>
            </div>
          </div>

          {/* Quick Actions and Operational Controls */}
          <div className="flex items-center gap-3">
            {/* Filter by Stylist */}
            <div className="relative">
              <button
                onClick={() => setIsStylistFilterOpen(!isStylistFilterOpen)}
                className="min-h-[44px] px-3.5 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-900 rounded-lg shadow-xs flex items-center gap-2 text-xs font-semibold transition-colors"
              >
                <Filter className="w-4 h-4 text-zinc-400" />
                <span>
                  {selectedStylistFilter === 'all'
                    ? `All Stylists (${stylists.length})`
                    : stylists.find((s) => s.id === selectedStylistFilter)?.name || 'Filtered'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {isStylistFilterOpen && (
                <div className="absolute right-0 mt-1 w-52 bg-white border border-zinc-200 rounded-xl shadow-lg p-1.5 z-40">
                  <button
                    onClick={() => {
                      setSelectedStylistFilter('all');
                      setIsStylistFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg ${
                      selectedStylistFilter === 'all'
                        ? 'bg-zinc-100 font-semibold text-zinc-900'
                        : 'text-zinc-600 hover:bg-zinc-50'
                    }`}
                  >
                    All Stylists ({stylists.length})
                  </button>
                  {stylists.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => {
                        setSelectedStylistFilter(st.id);
                        setIsStylistFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs rounded-lg ${
                        selectedStylistFilter === st.id
                          ? 'bg-zinc-100 font-semibold text-zinc-900'
                          : 'text-zinc-600 hover:bg-zinc-50'
                      }`}
                    >
                      {st.name} ({st.role.split(' ')[0]})
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Walk-in Check-in */}
            <button
              onClick={onOpenWalkIn}
              className="min-h-[44px] px-4 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-900 rounded-lg shadow-xs text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-zinc-600" />
              <span>Walk-in Check-in</span>
            </button>

            {onClearAppointments && (
              <button
                onClick={onClearAppointments}
                className="min-h-[44px] px-3.5 bg-white hover:bg-rose-50 hover:text-rose-700 border border-zinc-200 text-zinc-600 rounded-lg shadow-xs text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Clear all appointment bookings for testing"
              >
                <Trash2 className="w-4 h-4 text-zinc-400" />
                <span>Clear Bookings</span>
              </button>
            )}

            {appointments.length === 0 && onLoadSampleAppointments && (
              <button
                onClick={onLoadSampleAppointments}
                className="min-h-[44px] px-3.5 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-800 rounded-lg shadow-xs text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-zinc-500" />
                <span>Load Sample Bookings</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats Metric Band */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          {/* Stat 1 */}
          <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                {activeSegmentView === 'week' ? "Week Bookings" : "Today's Bookings"}
              </span>
              <Calendar className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-zinc-950">
                {activeSegmentView === 'week' ? "247" : appointments.length}
              </span>
              <span className="text-xs text-zinc-500">total bookings</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 pt-1 text-xs">
              {activeSegmentView === 'week' ? (
                <>
                  <span className="px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800 text-[11px]">
                    28 Done
                  </span>
                  <span className="px-2 py-0.5 rounded-full font-semibold bg-sky-100 text-sky-800 text-[11px]">
                    8 In-Service
                  </span>
                  <span className="px-2 py-0.5 rounded-full font-semibold bg-zinc-100 text-zinc-800 text-[11px]">
                    211 Upcoming
                  </span>
                </>
              ) : (
                <>
                  <span className="px-2 py-0.5 rounded-full font-semibold bg-sky-100 text-sky-800 text-[11px]">
                    8 In-Service
                  </span>
                  <span className="px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800 text-[11px]">
                    14 Done
                  </span>
                  <span className="px-2 py-0.5 rounded-full font-semibold bg-zinc-100 text-zinc-800 text-[11px]">
                    16 Left
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Stat 2 */}
          <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                {activeSegmentView === 'week' ? "Weekly Staffing" : "Active Stylists"}
              </span>
              <Sparkles className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-zinc-950">
                {activeSegmentView === 'week' ? "7 / 7" : "6 / 7"}
              </span>
              <span className="text-xs font-semibold text-emerald-700">
                {activeSegmentView === 'week' ? "91% week capacity" : "85% deployed"}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
              <span>{activeSegmentView === 'week' ? "Full Roster Active Mon–Sun" : "Stations 01-05 Occupied"}</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 font-semibold">
                {activeSegmentView === 'week' ? "Peak: Fri & Sat" : "1 on break"}
              </span>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                {activeSegmentView === 'week' ? "Estimated Week Revenue" : "Estimated Revenue"}
              </span>
              <CreditCard className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-zinc-950">
                {activeSegmentView === 'week' ? "$31,920" : "$4,820"}
              </span>
              <span className="text-xs text-zinc-500">
                {activeSegmentView === 'week' ? "target $32k" : "target $5k"}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs font-semibold">
              <span className="text-emerald-700">
                {activeSegmentView === 'week' ? "$12,410 collected" : "$3,150 collected"}
              </span>
              <span className="text-amber-700">
                {activeSegmentView === 'week' ? "$19,510 pending" : "$1,670 pending"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Dispatch Matrix & Inspector Layout */}
      <div className="p-6 flex gap-6 items-start overflow-hidden">
        {/* Schedule Canvas Section */}
        <div className="flex-1 bg-white border border-zinc-200 rounded-xl shadow-xs overflow-hidden flex flex-col min-w-0">
          {/* ========================================================================= */}
          {/* VIEW MODE 1: WEEK MATRIX VIEW (7 Days: Mon 23 - Sun 29) */}
          {/* ========================================================================= */}
          {activeSegmentView === 'week' && (
            <>
              {/* Live Status Subheader for Week */}
              <div className="px-4 py-3 bg-zinc-50/80 border-b border-zinc-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-semibold text-zinc-900">
                      Week Matrix (7 Operating Days)
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-400">
                    {selectedStylistFilter === 'all'
                      ? 'Floor Overview • 7 Columns'
                      : `Filtered to: ${stylists.find((s) => s.id === selectedStylistFilter)?.name || 'Stylist'}`}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-zinc-500 font-medium">
                    {filteredWeekAppointments.length} Bookings this week
                  </span>
                  <div className="h-4 w-px bg-zinc-200"></div>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Peak: Fri & Sat (96% booked)
                  </span>
                </div>
              </div>

              {/* Week Matrix Grid Container */}
              <div className="overflow-x-auto relative">
                {/* 7 Days Column Headers */}
                <div className="min-w-[1180px] grid grid-cols-[80px_repeat(7,1fr)] border-b border-zinc-200 bg-zinc-50/90">
                  <div className="p-3 bg-zinc-50 text-center text-xs font-semibold uppercase tracking-wider text-zinc-400 sticky left-0 z-20 border-r border-zinc-200 flex items-center justify-center">
                    Timeline
                  </div>

                  {WEEK_DAYS_META.map((day) => {
                    const dayApptsCount = filteredWeekAppointments.filter(
                      (a) => a.dayIndex === day.dayIndex
                    ).length;
                    return (
                      <div
                        key={day.dayIndex}
                        className={`p-3 flex flex-col justify-between border-r border-zinc-200 last:border-r-0 transition-colors ${
                          day.isToday ? 'bg-zinc-100/90 ring-1 ring-inset ring-zinc-300' : 'bg-zinc-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-xs font-bold ${
                                day.isToday ? 'text-zinc-950 font-black' : 'text-zinc-800'
                              }`}
                            >
                              {day.short} {day.date.split(' ')[1]}
                            </span>
                            {day.isToday && (
                              <span className="bg-zinc-900 text-white text-[10px] font-bold px-1.5 py-0.2 rounded shadow-2xs">
                                Today
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono font-semibold text-zinc-500">
                            {day.estRev}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1 text-[11px] text-zinc-500">
                          <span>{dayApptsCount} appts</span>
                          <span className="text-zinc-400 text-[10px]">Peak: {day.peakHour}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Week Matrix Body */}
                <div className="min-w-[1180px] grid grid-cols-[80px_repeat(7,1fr)] relative bg-white min-h-[768px]">
                  {/* Today (Day 1 / Tuesday) Live Time Indicator Line (approx 10:45 AM) */}
                  <div
                    className="absolute z-30 pointer-events-none flex items-center"
                    style={{
                      top: '168px',
                      left: 'calc(80px + (100% - 80px) * (1 / 7))',
                      width: 'calc((100% - 80px) / 7)',
                    }}
                  >
                    <span className="bg-zinc-900 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow ml-1">
                      10:45 AM
                    </span>
                    <div className="flex-1 h-[2px] bg-zinc-900 opacity-70"></div>
                  </div>

                  {/* Time Column Sidebar */}
                  <div className="bg-zinc-50/60 border-r border-zinc-200 flex flex-col text-right text-xs font-mono text-zinc-400 select-none sticky left-0 z-10">
                    {timeSlots.map((slot, i) => (
                      <div
                        key={slot}
                        className={`h-24 pr-3 pt-2.5 border-b border-zinc-100 ${
                          i % 2 === 1 ? 'bg-zinc-100/30' : ''
                        }`}
                      >
                        {slot}
                      </div>
                    ))}
                  </div>

                  {/* 7 Columns for Monday - Sunday */}
                  {WEEK_DAYS_META.map((day) => {
                    const dayAppts = filteredWeekAppointments.filter(
                      (a) => a.dayIndex === day.dayIndex
                    );

                    return (
                      <div
                        key={day.dayIndex}
                        className={`relative min-h-[768px] p-1.5 border-r border-zinc-100 last:border-r-0 ${
                          day.isToday ? 'bg-zinc-50/50' : day.dayIndex % 2 === 1 ? 'bg-zinc-50/20' : 'bg-white'
                        }`}
                      >
                        {/* Hour slot guidelines with Quick-Add '+' button */}
                        {timeSlots.map((slot, i) => (
                          <div
                            key={slot}
                            className="absolute left-0 right-0 h-24 border-b border-zinc-100/80 group pointer-events-auto"
                            style={{ top: `${i * 96}px` }}
                          >
                            <button
                              onClick={onOpenBookAppointment}
                              title={`Book appointment on ${day.name} at ${slot}`}
                              className="opacity-0 group-hover:opacity-100 absolute right-1.5 top-1.5 p-1 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-opacity z-10 text-[10px] flex items-center gap-0.5 font-medium shadow-2xs"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        ))}

                        {/* Day Appointments */}
                        {dayAppts.map((appt) => {
                          const isSelected = selectedAppointment?.id === appt.id;

                          let statusClasses = 'bg-sky-100 text-sky-800 border-sky-300';
                          let statusBadge = 'bg-sky-700 text-white';
                          let statusLabel = 'In-Service';

                          if (appt.status === 'completed') {
                            statusClasses = 'bg-emerald-100 text-emerald-800 border-emerald-300';
                            statusBadge = 'bg-emerald-700 text-white';
                            statusLabel = 'Paid';
                          } else if (appt.status === 'waiting') {
                            statusClasses = 'bg-amber-100 text-amber-800 border-amber-300';
                            statusBadge = 'bg-amber-700 text-white';
                            statusLabel = 'Waiting';
                          } else if (appt.status === 'confirmed') {
                            statusClasses = 'bg-zinc-100 text-zinc-800 border-zinc-300';
                            statusBadge = 'bg-zinc-800 text-white';
                            statusLabel = 'Confirmed';
                          } else if (appt.status === 'no-show') {
                            statusClasses = 'bg-rose-100 text-rose-800 border-rose-300';
                            statusBadge = 'bg-rose-700 text-white';
                            statusLabel = 'No-Show';
                          }

                          return (
                            <div
                              key={appt.id}
                              onClick={() => {
                                setSelectedAppointmentId(appt.id);
                                setIsInspectorOpen(true);
                              }}
                              className={`absolute left-1 right-1 rounded-lg p-2 flex flex-col justify-between cursor-pointer transition-all border shadow-2xs hover:brightness-95 select-none ${statusClasses} ${
                                isSelected ? 'ring-2 ring-zinc-900 border-transparent shadow-md z-20' : ''
                              }`}
                              style={{
                                top: `${appt.topPx}px`,
                                height: `${appt.heightPx}px`,
                              }}
                            >
                              <div>
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-[10px] font-mono font-bold tracking-tight">
                                    {appt.startTime} - {appt.endTime}
                                  </span>
                                  <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-full ${statusBadge}`}>
                                    {statusLabel}
                                  </span>
                                </div>
                                <h4 className="font-semibold text-zinc-950 text-xs mt-1 leading-tight line-clamp-1">
                                  {appt.serviceName}
                                </h4>
                                <div className="text-[11px] font-medium text-zinc-800 mt-0.5 flex items-center justify-between">
                                  <span className="truncate">{appt.clientName}</span>
                                  {appt.isVip && (
                                    <span className="text-[9px] font-bold bg-white text-zinc-900 px-1 rounded border border-zinc-200 shrink-0">
                                      VIP
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-1 border-t border-black/10 text-[10px]">
                                <span className="font-medium text-zinc-600 truncate max-w-[80px]">
                                  {appt.stylistName.split(' ')[0]}
                                </span>
                                <span className="font-bold text-zinc-950 font-mono">
                                  ${appt.subtotal || appt.basePrice}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* ========================================================================= */}
          {/* VIEW MODE 2: CHAIR FLOW TIMELINE VIEW */}
          {/* ========================================================================= */}
          {activeSegmentView === 'flow' && (
            <>
              {/* Live Status Subheader for Chair Flow */}
              <div className="px-4 py-3 bg-zinc-50/80 border-b border-zinc-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-semibold text-zinc-900">
                      Live Chair & Wash Basin Floor State
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-400">
                    5 of 6 Stations Active • Synchronized Live
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Turnover Velocity: 8.5 min avg
                  </span>
                </div>
              </div>

              {/* Station Flow Grid */}
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {chairFlowStations.map((stn) => {
                  const isAvailable = stn.status === 'available';
                  return (
                    <div
                      key={stn.id}
                      className="bg-zinc-50/60 border border-zinc-200 rounded-xl p-4 flex flex-col justify-between hover:bg-zinc-50 transition-colors shadow-2xs"
                    >
                      <div>
                        {/* Header */}
                        <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-zinc-200">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={stn.stylistAvatar}
                              alt={stn.stylist}
                              className="w-9 h-9 rounded-full object-cover ring-1 ring-zinc-300"
                            />
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-zinc-950">
                                {stn.name}
                              </span>
                              <span className="text-[11px] text-zinc-500">
                                {stn.stylist} • {stn.title.split(' ')[0]}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              isAvailable
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-sky-100 text-sky-800'
                            }`}
                          >
                            {isAvailable ? 'Available' : 'In Chair'}
                          </span>
                        </div>

                        {/* Client & Service */}
                        <div className="mt-3 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-zinc-950 flex items-center gap-1.5">
                              {stn.client}
                              {stn.isVip && (
                                <span className="text-[9px] font-bold bg-zinc-900 text-white px-1.5 py-0.2 rounded">
                                  VIP
                                </span>
                              )}
                            </span>
                            <span className="text-[11px] font-mono font-medium text-zinc-500">
                              {stn.timeWindow}
                            </span>
                          </div>

                          <div className="text-xs font-medium text-zinc-700">
                            {stn.service}
                          </div>

                          <div className="text-[11px] text-zinc-500 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-zinc-400" />
                            <span>{stn.phase}</span>
                          </div>

                          {/* Progress Bar */}
                          {!isAvailable && (
                            <div className="mt-2.5 space-y-1">
                              <div className="flex justify-between text-[10px] text-zinc-500">
                                <span>{stn.elapsedMinutes}m elapsed</span>
                                <span className="font-semibold text-zinc-800">{stn.timeLeft}</span>
                              </div>
                              <div className="w-full bg-zinc-200 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className="bg-zinc-900 h-1.5 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${Math.min(
                                      100,
                                      (stn.elapsedMinutes / stn.totalMinutes) * 100
                                    )}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Station Bottom Directives */}
                      <div className="mt-4 pt-3 border-t border-zinc-200/80 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-zinc-400 truncate max-w-[160px]">
                          Next: {stn.nextUp}
                        </span>
                        <button
                          onClick={() => {
                            if (isAvailable) {
                              onOpenBookAppointment();
                            } else {
                              onShowToast(`Station ${stn.stationNum} notification sent to assistant`);
                            }
                          }}
                          className="px-2.5 py-1 rounded bg-white hover:bg-zinc-100 border border-zinc-200 font-semibold text-[11px] text-zinc-800 transition-colors shadow-2xs"
                        >
                          {isAvailable ? 'Book Station' : 'Alert Assist'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ========================================================================= */}
          {/* VIEW MODE 3: DAY MATRIX VIEW (Original 5 Stylist Columns for Today) */}
          {/* ========================================================================= */}
          {activeSegmentView === 'matrix' && (
            <>
              {/* Live Status Subheader */}
              <div className="px-4 py-3 bg-zinc-50/80 border-b border-zinc-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-semibold text-zinc-900">Live Floor State</span>
                  </div>
                  <span className="text-[11px] text-zinc-400">Synchronized 18s ago</span>
                </div>
              </div>

              {/* Stylists Matrix Grid (Scrollable Container) */}
              <div className="overflow-x-auto relative">
                {/* Column Headers */}
                <div className="min-w-[1020px] grid grid-cols-[80px_repeat(5,1fr)] border-b border-zinc-200">
                  <div className="p-3 bg-zinc-50 text-center text-xs font-semibold uppercase tracking-wider text-zinc-400 sticky left-0 z-20 border-r border-zinc-200">
                    Timeline
                  </div>

                  {displayedStylists.map((stylist) => (
                    <div
                      key={stylist.id}
                      className="p-3 bg-zinc-50 flex items-center gap-2.5 border-r border-zinc-100 last:border-r-0"
                    >
                      <img
                        src={stylist.avatar}
                        alt={stylist.name}
                        className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-zinc-200"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-zinc-900 truncate">
                          {stylist.name}
                        </span>
                        <span className="text-[11px] text-zinc-500 truncate">
                          {stylist.tier} • Stn {stylist.station.includes('01') ? '01' : stylist.station.includes('02') ? '02' : stylist.station.includes('03') ? '03' : stylist.station.includes('04') ? '04' : '05'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Matrix Body with Hour Slots */}
                <div className="min-w-[1020px] grid grid-cols-[80px_repeat(5,1fr)] relative bg-white min-h-[768px]">
                  {/* Current Time Indicator Line (approx 10:45 AM) */}
                  <div
                    className="absolute left-0 right-0 top-[168px] z-30 pointer-events-none flex items-center"
                    style={{ top: '168px' }}
                  >
                    <span className="bg-zinc-900 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow ml-2">
                      10:45 AM
                    </span>
                    <div className="flex-1 h-[2px] bg-zinc-900 opacity-60"></div>
                  </div>

                  {/* Time Column Sidebar */}
                  <div className="bg-zinc-50/60 border-r border-zinc-200 flex flex-col text-right text-xs font-mono text-zinc-400 select-none sticky left-0 z-10">
                    {timeSlots.map((slot, i) => (
                      <div
                        key={slot}
                        className={`h-24 pr-3 pt-2.5 border-b border-zinc-100 ${
                          i % 2 === 1 ? 'bg-zinc-100/30' : ''
                        }`}
                      >
                        {slot}
                      </div>
                    ))}
                  </div>

                  {/* 5 Columns for Appointments */}
                  {[0, 1, 2, 3, 4].map((colIndex) => {
                    const colAppts = filteredAppointments.filter((a) => a.gridColumn === colIndex);
                    return (
                      <div
                        key={colIndex}
                        className={`relative min-h-[768px] p-2 border-r border-zinc-100 last:border-r-0 ${
                          colIndex % 2 === 1 ? 'bg-zinc-50/30' : 'bg-white'
                        }`}
                      >
                        {colAppts.map((appt) => {
                          const isSelected = selectedAppointment?.id === appt.id;

                          let statusClasses = 'bg-sky-100 text-sky-800 border-sky-300';
                          let statusBadge = 'bg-sky-700 text-white';
                          let statusLabel = 'In-Service';

                          if (appt.status === 'completed') {
                            statusClasses = 'bg-emerald-100 text-emerald-800 border-emerald-300';
                            statusBadge = 'bg-emerald-700 text-white';
                            statusLabel = 'Paid';
                          } else if (appt.status === 'waiting') {
                            statusClasses = 'bg-amber-100 text-amber-800 border-amber-300';
                            statusBadge = 'bg-amber-700 text-white';
                            statusLabel = 'Waiting';
                          } else if (appt.status === 'confirmed') {
                            statusClasses = 'bg-emerald-100 text-emerald-800 border-emerald-300';
                            statusBadge = 'bg-emerald-700 text-white';
                            statusLabel = 'Confirmed';
                          } else if (appt.status === 'no-show') {
                            statusClasses = 'bg-rose-100 text-rose-800 border-rose-300';
                            statusBadge = 'bg-rose-700 text-white';
                            statusLabel = 'No-Show';
                          }

                          return (
                            <div
                              key={appt.id}
                              onClick={() => {
                                setSelectedAppointmentId(appt.id);
                                setIsInspectorOpen(true);
                              }}
                              className={`absolute left-1.5 right-1.5 rounded-lg p-3 flex flex-col justify-between cursor-pointer transition-all border shadow-xs hover:brightness-95 ${statusClasses} ${
                                isSelected ? 'ring-2 ring-zinc-900 border-transparent shadow-md z-20' : ''
                              }`}
                              style={{
                                top: `${appt.topPx}px`,
                                height: `${appt.heightPx}px`,
                              }}
                            >
                              <div>
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase">
                                    {appt.startTime} - {appt.endTime}
                                  </span>
                                  <span
                                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusBadge}`}
                                  >
                                    {statusLabel}
                                  </span>
                                </div>
                                <h4 className="text-xs font-semibold text-zinc-950 mt-1 leading-tight line-clamp-1">
                                  {appt.serviceName}
                                </h4>
                                <p className="text-xs font-medium text-zinc-900 mt-0.5 flex items-center gap-1.5">
                                  <span className="truncate">{appt.clientName}</span>
                                  {appt.isVip && (
                                    <span className="text-[10px] font-bold bg-white text-zinc-900 px-1.5 py-0.2 rounded border border-zinc-200">
                                      VIP
                                    </span>
                                  )}
                                </p>
                              </div>

                              <div className="flex items-center justify-between pt-1.5 border-t border-black/10 text-xs">
                                <span className="text-[11px] font-medium truncate flex items-center gap-1">
                                  {appt.station}
                                </span>
                                <span className="font-bold text-zinc-950 font-mono">
                                  ${appt.subtotal || appt.basePrice}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Slide-in / Inspector Card: Selected Client Deep-Dive */}
        {isInspectorOpen && selectedAppointment && (
          <div className="w-96 bg-white border border-zinc-200 rounded-xl shadow-lg flex flex-col shrink-0 select-none overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-4 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-zinc-500" />
                <span className="text-sm font-semibold text-zinc-950">Appointment Details</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setEditingAppt(selectedAppointment);
                    setIsEditApptModalOpen(true);
                  }}
                  aria-label="Edit Booking"
                  className="min-h-[36px] min-w-[36px] rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/60 transition-colors cursor-pointer"
                  title="Edit Booking"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setDeletingAppt(selectedAppointment);
                    setIsDeleteApptModalOpen(true);
                  }}
                  aria-label="Delete Booking"
                  className="min-h-[36px] min-w-[36px] rounded-lg flex items-center justify-center text-zinc-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Cancel / Delete Booking"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsInspectorOpen(false)}
                  aria-label="Close Inspector"
                  className="min-h-[36px] min-w-[36px] rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-5 flex flex-col gap-4">
              {/* Client Profile Snippet */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={APP_IMAGES.sophiaMillerDaily}
                    alt={selectedAppointment.clientName}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-zinc-100 shadow-xs"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-bold text-zinc-950 truncate">
                      {selectedAppointment.clientName}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-zinc-900 text-white font-bold">
                      VIP
                    </span>
                  </div>
                  <span className="text-xs text-zinc-500">+1 (555) 382-9012</span>
                  <span className="text-[11px] text-zinc-400 mt-0.5">Member since March 2022</span>
                </div>
              </div>

              {/* Warning / Medical Tags Banner */}
              <div className="flex flex-wrap gap-2 p-2.5 rounded-lg bg-zinc-50 border border-zinc-200">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-rose-100 text-rose-800">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
                  Allergy: Ammonia-Free
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-white border border-zinc-200 text-zinc-800">
                  <Coffee className="w-3.5 h-3.5 text-zinc-500" />
                  Oat Milk Latte
                </span>
              </div>

              {/* Appointment Core Breakdown */}
              <div className="flex flex-col gap-2 pt-1 border-t border-zinc-100 text-xs">
                <div className="flex justify-between items-center text-zinc-500">
                  <span>Status</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
                      selectedAppointment.status === 'in-service'
                        ? 'bg-sky-100 text-sky-800'
                        : selectedAppointment.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedAppointment.status === 'waiting'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-zinc-100 text-zinc-800'
                    }`}
                  >
                    {selectedAppointment.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-zinc-500">
                  <span>Service</span>
                  <span className="font-semibold text-zinc-900">{selectedAppointment.serviceName}</span>
                </div>
                <div className="flex justify-between items-center text-zinc-500">
                  <span>Stylist</span>
                  <span className="font-semibold text-zinc-900">{selectedAppointment.stylistName}</span>
                </div>
                <div className="flex justify-between items-center text-zinc-500">
                  <span>Station</span>
                  <span className="font-medium text-zinc-800">{selectedAppointment.station}</span>
                </div>
                <div className="flex justify-between items-center text-zinc-500">
                  <span>Time Window</span>
                  <span className="font-mono text-zinc-900">
                    {selectedAppointment.startTime} - {selectedAppointment.endTime} ({selectedAppointment.durationMinutes} min)
                  </span>
                </div>
              </div>

              {/* Active Formula Micro Card */}
              <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-900 uppercase tracking-wider text-[11px]">
                    Technical Formula
                  </span>
                  <span className="text-[11px] text-zinc-400">Technical Log</span>
                </div>
                <p className="text-xs text-zinc-700 leading-relaxed">
                  {selectedAppointment.formulaNote || 'Redken Shades EQ: 09V + 09GI equal parts with Processing Solution. 35 volume on ends.'}
                </p>
              </div>

              {/* Pricing Summary */}
              <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 flex flex-col gap-1.5 text-xs">
                <div className="flex justify-between text-zinc-500">
                  <span>Service Base</span>
                  <span className="text-zinc-900 font-medium">
                    ${selectedAppointment.basePrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Scalp & Molecular Addon</span>
                  <span className="text-zinc-900 font-medium">$35.00</span>
                </div>
                <div className="pt-2 border-t border-zinc-200 flex justify-between items-baseline">
                  <span className="text-xs font-semibold text-zinc-900">Subtotal Due</span>
                  <span className="text-lg font-bold text-zinc-950 font-mono">
                    ${(selectedAppointment.subtotal || selectedAppointment.basePrice).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Front Desk Quick Action Buttons (Min 44px hit-targets) */}
              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={() => onSelectAppointmentForCheckout(selectedAppointment)}
                  className="min-h-[44px] w-full px-4 bg-zinc-900 text-white hover:bg-zinc-800 active:bg-black rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Send to Checkout</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onShowToast(`Retail shelf opened for ${selectedAppointment.clientName}`);
                      onSelectAppointmentForCheckout(selectedAppointment);
                    }}
                    className="min-h-[44px] px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4 text-zinc-600" />
                    <span>Add Retail</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingAppt(selectedAppointment);
                      setIsEditApptModalOpen(true);
                    }}
                    className="min-h-[44px] px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <CalendarCheck className="w-4 h-4 text-zinc-600" />
                    <span>Modify</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    setDeletingAppt(selectedAppointment);
                    setIsDeleteApptModalOpen(true);
                  }}
                  className="min-h-[44px] w-full px-4 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200/80 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 text-rose-500" />
                  <span>Cancel / Delete Booking</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State Inspector when no booking selected or appointments cleared */}
        {isInspectorOpen && !selectedAppointment && (
          <div className="w-96 bg-white border border-zinc-200 rounded-xl shadow-lg flex flex-col shrink-0 select-none overflow-hidden animate-in slide-in-from-right duration-200 p-8 text-center items-center justify-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400">
              <Calendar className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-zinc-950">No Booking Selected</h3>
              <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
                Default appointments are cleared for testing. Click "+ New Booking" to book an appointment and test full CRUD operations.
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full pt-1">
              <button
                onClick={onOpenBookAppointment}
                className="min-h-[44px] w-full px-4 bg-zinc-900 text-white rounded-lg text-xs font-semibold hover:bg-zinc-800 transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ New Booking</span>
              </button>
              {onLoadSampleAppointments && (
                <button
                  onClick={onLoadSampleAppointments}
                  className="min-h-[44px] w-full px-4 bg-zinc-100 border border-zinc-200 text-zinc-800 rounded-lg text-xs font-semibold hover:bg-zinc-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4 text-zinc-500" />
                  <span>Load Sample Bookings</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit Appointment Modal */}
      {editingAppt && (
        <EditAppointmentModal
          isOpen={isEditApptModalOpen}
          appointment={editingAppt}
          stylists={stylists}
          onClose={() => {
            setIsEditApptModalOpen(false);
            setEditingAppt(null);
          }}
          onSave={(updated) => {
            if (onUpdateAppointment) {
              onUpdateAppointment(updated);
            } else {
              onShowToast(`Appointment updated for ${updated.clientName}`);
            }
          }}
          onDelete={(id) => {
            if (onDeleteAppointment) {
              onDeleteAppointment(id);
            }
          }}
        />
      )}

      {/* Delete Appointment Confirmation Modal */}
      {deletingAppt && (
        <DeleteConfirmModal
          isOpen={isDeleteApptModalOpen}
          title="Delete Appointment Booking"
          message={`Are you sure you want to cancel and remove the appointment for ${deletingAppt.clientName} (${deletingAppt.serviceName})?`}
          itemIdentifier={`Booking: ${deletingAppt.clientName} • Stylist: ${deletingAppt.stylistName} • Time: ${deletingAppt.startTime}`}
          confirmButtonText="Delete Reservation"
          onClose={() => {
            setIsDeleteApptModalOpen(false);
            setDeletingAppt(null);
          }}
          onConfirm={() => {
            if (onDeleteAppointment) {
              onDeleteAppointment(deletingAppt.id);
            } else {
              onShowToast(`Booking for ${deletingAppt.clientName} cancelled`);
            }
          }}
        />
      )}
    </div>
  );
};
