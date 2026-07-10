import React from 'react';
import { useBusiness } from '../context/BusinessContext';
import { 
  CreditCard, 
  DollarSign, 
  ArrowUpRight, 
  Calendar, 
  Search,
  CheckCircle,
  FileText
} from 'lucide-react';

export const PaymentsView: React.FC = () => {
  const { payments, customers } = useBusiness();

  const getCustomerName = (id: string) => {
    return customers.find(c => c.id === id)?.name || 'Private Client';
  };

  // Stats calculation
  const totalSettled = payments.reduce((sum, p) => sum + p.amount, 0);
  const cardPaymentsCount = payments.filter(p => p.method === 'credit_card').length;
  const bankPaymentsCount = payments.filter(p => p.method === 'bank_transfer').length;

  return (
    <div className="p-6 space-y-6 animate-fade-in text-xs">
      
      {/* 1. MODULE CONTROL BAR */}
      <div className="border-b border-gray-100 pb-4 dark:border-zinc-800">
        <h1 className="text-lg font-bold text-gray-900 dark:text-zinc-50">Settlement Ledger & Payments</h1>
        <p className="text-2xs text-gray-400 dark:text-zinc-500">Audit system deposits, checkout gateways, and transaction references</p>
      </div>

      {/* 2. STATS INDICATORS ROW */}
      <div className="grid gap-6 sm:grid-cols-3">
        {/* Card 1 */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900 flex items-center justify-between">
          <div>
            <span className="text-4xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider block">Gross Capital Settled</span>
            <span className="text-lg font-extrabold text-gray-900 dark:text-white mt-1 block font-mono">
              ${totalSettled.toLocaleString()}
            </span>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 flex items-center justify-center">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900 flex items-center justify-between">
          <div>
            <span className="text-4xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider block">Stripe Card Checkouts</span>
            <span className="text-lg font-extrabold text-gray-900 dark:text-white mt-1 block font-mono">
              {cardPaymentsCount} Transactions
            </span>
          </div>
          <div className="h-10 w-10 rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950/20 dark:text-teal-400 flex items-center justify-center">
            <CreditCard className="h-5 w-5" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900 flex items-center justify-between">
          <div>
            <span className="text-4xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider block">ACH Bank Transfers</span>
            <span className="text-lg font-extrabold text-gray-900 dark:text-white mt-1 block font-mono">
              {bankPaymentsCount} Clearing
            </span>
          </div>
          <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 flex items-center justify-center">
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* 3. PAYMENTS TABLE LIST */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-2xs overflow-hidden dark:border-zinc-800 dark:bg-zinc-900">
        <div className="p-4 border-b border-gray-50 bg-gray-50/50 dark:border-zinc-800 dark:bg-zinc-850">
          <h3 className="font-bold text-gray-850 dark:text-zinc-50 flex items-center gap-1.5">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            <span>Audited Settlement Transactions</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/20 border-b border-gray-100 text-gray-500 dark:border-zinc-800 dark:text-zinc-400">
                <th className="p-4 font-bold">Transaction Reference ID</th>
                <th className="p-4 font-bold">Client Depositor</th>
                <th className="p-4 font-bold">Clearance Date</th>
                <th className="p-4 font-bold">Payment Gateway</th>
                <th className="p-4 font-bold text-right">Settled Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/60 text-gray-700 dark:text-zinc-300">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-400 dark:text-zinc-500">
                    No clearance transactions recorded
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-850/10 transition-colors">
                    <td className="p-4 font-bold font-mono text-gray-900 dark:text-white">
                      {p.reference || `TXN-${p.id.toUpperCase().substring(0, 8)}`}
                    </td>
                    <td className="p-4 font-semibold">
                      {getCustomerName(p.customerId)}
                    </td>
                    <td className="p-4 font-mono">
                      {p.paymentDate}
                    </td>
                    <td className="p-4">
                      <span className="capitalize font-bold px-2 py-0.5 rounded-sm bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {p.method.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-right font-extrabold font-mono text-teal-600 dark:text-teal-400">
                      +${p.amount.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
export default PaymentsView;
