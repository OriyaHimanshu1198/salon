import React from 'react';
import {
  TrendingUp,
  Download,
  Calendar,
  Users,
  DollarSign,
  Award,
  Scissors,
  ArrowUpRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Stylist } from '../../types/salon';

interface PerformanceReportsViewProps {
  stylists: Stylist[];
  onShowToast: (msg: string) => void;
}

export const PerformanceReportsView: React.FC<PerformanceReportsViewProps> = ({
  stylists,
  onShowToast,
}) => {
  const kpis = [
    { title: 'Gross Revenue (Month)', value: '$94,280.00', change: '+18.4% MoM', positive: true },
    { title: 'Average Ticket Value', value: '$186.50', change: '+$24 vs Q3', positive: true },
    { title: 'Retail Product Attach', value: '34.2%', change: '+5.1% uplift', positive: true },
    { title: 'Overall Rebooking Rate', value: '89.4%', change: 'Industry Top 5%', positive: true },
  ];

  return (
    <div className="flex flex-col w-full p-6 space-y-6 max-w-[1720px] mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white border border-zinc-200 p-6 rounded-xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-zinc-400 text-xs uppercase tracking-wider font-semibold">
            <span>Executive Analytics</span>
            <span>/</span>
            <span className="text-zinc-900 font-semibold">Financial & Staff Ledger</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight mt-1">
            Performance & Reports
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Comprehensive audit logs, retail velocity charts, stylist commission splits, and client retention cohorts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-zinc-100 border border-zinc-200 px-3.5 min-h-[44px] rounded-lg text-xs font-semibold text-zinc-900 gap-2">
            <Calendar className="w-4 h-4 text-zinc-400" />
            <span>October 2026 (Month-to-Date)</span>
          </div>
          <button
            onClick={() => onShowToast('Full Excel accounting export ready')}
            className="min-h-[44px] px-4 bg-zinc-900 text-white hover:bg-zinc-800 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Executive PDF/CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="bg-white border border-zinc-200 p-4 rounded-xl shadow-xs flex flex-col justify-between"
          >
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              {kpi.title}
            </span>
            <div className="mt-2 text-2xl font-bold text-zinc-950 font-mono">{kpi.value}</div>
            <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-700">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{kpi.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Category Breakdown & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Department Revenue Share (lg:col-span-6) */}
        <div className="lg:col-span-6 bg-white border border-zinc-200 rounded-xl p-5 shadow-xs space-y-4">
          <h2 className="text-base font-semibold text-zinc-950 flex items-center justify-between">
            <span>Revenue by Department</span>
            <span className="text-xs text-zinc-400 font-mono font-normal">October Total: $94,280</span>
          </h2>

          <div className="space-y-3 pt-2 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-zinc-900 mb-1">
                <span>Color & Chemical Transformations (48%)</span>
                <span className="font-mono">$45,254.40</span>
              </div>
              <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
                <div className="bg-zinc-900 h-full rounded-full" style={{ width: '48%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-zinc-900 mb-1">
                <span>Couture Haircuts & Designer Styling (24%)</span>
                <span className="font-mono">$22,627.20</span>
              </div>
              <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
                <div className="bg-zinc-700 h-full rounded-full" style={{ width: '24%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-zinc-900 mb-1">
                <span>Headspa & Bond Repair Rituals (16%)</span>
                <span className="font-mono">$15,084.80</span>
              </div>
              <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '16%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-zinc-900 mb-1">
                <span>Boutique Retail Take-Home (12%)</span>
                <span className="font-mono">$11,313.60</span>
              </div>
              <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
                <div className="bg-sky-600 h-full rounded-full" style={{ width: '12%' }}></div>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg flex items-center justify-between text-xs mt-4">
            <span className="text-zinc-600">VIP Client Contribution</span>
            <span className="font-bold text-zinc-900 font-mono">68.4% of Gross Sales</span>
          </div>
        </div>

        {/* Right: Stylist Revenue Leaderboard (lg:col-span-6) */}
        <div className="lg:col-span-6 bg-white border border-zinc-200 rounded-xl p-5 shadow-xs space-y-4">
          <h2 className="text-base font-semibold text-zinc-950 flex items-center justify-between">
            <span>Stylist Production Leaderboard</span>
            <span className="text-xs text-emerald-700 font-medium">All Rostered</span>
          </h2>

          <div className="space-y-2.5">
            {stylists.map((st, i) => (
              <div
                key={st.id}
                className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-zinc-400 w-4 font-mono">#{i + 1}</span>
                  <img
                    src={st.avatar}
                    alt={st.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-200"
                  />
                  <div>
                    <div className="font-bold text-zinc-900">{st.name}</div>
                    <div className="text-[11px] text-zinc-400">{st.tier}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-zinc-950 font-mono">
                    ${(st.serviceRevenue * 4.2).toFixed(2)}
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono">
                    Comm: ${(st.estimatedCommission * 4.2).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
