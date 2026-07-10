import React, { useState } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { 
  BarChart, 
  TrendingUp, 
  Users, 
  CheckSquare, 
  Download, 
  Calendar,
  Sparkles
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { invoices, customers, tasks, appointments } = useBusiness();
  const [reportPeriod, setReportPeriod] = useState<'30_days' | '90_days' | 'year'>('30_days');

  // Operational intelligence calculations
  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0);
  const outstandingRevenue = invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.total, 0);
  const completedTaskRate = tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0;
  
  // Custom CSV exporter simulation
  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Invoice Ref,Customer,Issue Date,Total Amount,Status", 
         ...invoices.map(i => `${i.invoiceNumber},${customers.find(c => c.id === i.customerId)?.name || 'Unknown'},${i.issueDate},${i.total},${i.status}`)
        ].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `velora_financial_report_${reportPeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Custom PDF print simulation
  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in text-xs">
      
      {/* 1. HEADER CONTROLLER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 dark:border-zinc-800">
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-zinc-50 font-sans">Strategic Analytics & Reports</h1>
          <p className="text-2xs text-gray-400 dark:text-zinc-500">Formulate visual charts and intelligence sheets of business capital flows</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="report-export-csv"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-150 hover:bg-gray-50 text-gray-700 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 font-semibold"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            id="report-export-pdf"
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-3xs dark:bg-teal-500 dark:hover:bg-teal-600"
          >
            <BarChart className="h-3.5 w-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* 2. DYNAMIC SUMMARY PANEL */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Gross Paid Revenue */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between text-gray-400 dark:text-zinc-500">
            <span className="text-3xs uppercase font-bold tracking-wider">Cleared Revenue</span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <span className="text-lg font-extrabold text-gray-950 dark:text-white mt-2 block font-mono">
            ${totalRevenue.toLocaleString()}
          </span>
          <p className="text-3xs text-gray-400 dark:text-zinc-500 mt-1">Stripe & ACH clearings</p>
        </div>

        {/* Outstanding Invoices */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between text-gray-400 dark:text-zinc-500">
            <span className="text-3xs uppercase font-bold tracking-wider">Accounts Receivable</span>
            <Calendar className="h-4 w-4 text-amber-500" />
          </div>
          <span className="text-lg font-extrabold text-gray-950 dark:text-white mt-2 block font-mono">
            ${outstandingRevenue.toLocaleString()}
          </span>
          <p className="text-3xs text-gray-400 dark:text-zinc-500 mt-1">Pending client presentation</p>
        </div>

        {/* Deliverables Rate */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between text-gray-400 dark:text-zinc-500">
            <span className="text-3xs uppercase font-bold tracking-wider">Task Clearance Rate</span>
            <CheckSquare className="h-4 w-4 text-blue-500" />
          </div>
          <span className="text-lg font-extrabold text-gray-950 dark:text-white mt-2 block font-mono">
            {completedTaskRate}%
          </span>
          <p className="text-3xs text-gray-400 dark:text-zinc-500 mt-1">Operational clearance index</p>
        </div>

        {/* Consultation Density */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between text-gray-400 dark:text-zinc-500">
            <span className="text-3xs uppercase font-bold tracking-wider">Active Retainers</span>
            <Users className="h-4 w-4 text-purple-500" />
          </div>
          <span className="text-lg font-extrabold text-gray-950 dark:text-white mt-2 block font-mono">
            {customers.length} Clients
          </span>
          <p className="text-3xs text-gray-400 dark:text-zinc-500 mt-1">Total active registrations</p>
        </div>

      </div>

      {/* 3. CHARTS LAYOUT WITH DETAILED HISTOGRAMS (Using elegant pixel-perfect SVGs) */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* SVG Histogram chart: Revenue Distributions */}
        <div className="lg:col-span-2 rounded-xl border border-gray-100 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="font-bold text-gray-800 dark:text-zinc-200 mb-4 flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-teal-500" />
            <span>Capital Inflow Distribution (Monthly)</span>
          </h3>

          {/* SVG representation of highly responsive chart */}
          <div className="h-64 w-full flex items-end justify-between gap-3 pt-6 font-mono text-3xs text-gray-400 select-none">
            {/* Histogram Bars */}
            {[
              { month: 'Jan', val: 12000, h: 'h-1/4' },
              { month: 'Feb', val: 18000, h: 'h-2/5' },
              { month: 'Mar', val: 15000, h: 'h-1/3' },
              { month: 'Apr', val: 24000, h: 'h-3/5' },
              { month: 'May', val: 32000, h: 'h-4/5' },
              { month: 'Jun', val: 45000, h: 'h-full' },
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer h-full justify-end">
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-950 text-white rounded px-1.5 py-0.5 mb-1 text-4xs font-bold dark:bg-zinc-100 dark:text-zinc-950">
                  ${bar.val.toLocaleString()}
                </div>
                <div className={`w-full rounded-t-md bg-teal-500/20 group-hover:bg-teal-500/45 transition-colors ${bar.h}`} />
                <span className="font-semibold text-gray-600 dark:text-zinc-400 font-sans">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Client LTV spends analysis */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="font-bold text-gray-800 dark:text-zinc-200 mb-4 flex items-center gap-1.5">
            <Users className="h-4 w-4 text-teal-500" />
            <span>Top Accounts Spent (LTV)</span>
          </h3>

          <div className="space-y-4">
            {customers.slice(0, 4).map((c) => {
              const spentPct = Math.min(100, Math.round((c.totalSpent / 25000) * 100));
              return (
                <div key={c.id} className="space-y-1">
                  <div className="flex justify-between items-center text-3xs font-semibold text-gray-600 dark:text-zinc-400">
                    <span>{c.name}</span>
                    <span className="font-mono">${c.totalSpent.toLocaleString()}</span>
                  </div>
                  {/* Progress Line */}
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden dark:bg-zinc-800">
                    <div 
                      className="bg-teal-500 h-1.5 rounded-full" 
                      style={{ width: `${spentPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
export default ReportsView;
