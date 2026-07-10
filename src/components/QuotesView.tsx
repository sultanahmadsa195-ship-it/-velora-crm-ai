import React, { useState } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { 
  Plus, 
  Trash2, 
  SlidersHorizontal, 
  CheckCircle, 
  X, 
  ArrowRight,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';

export const QuotesView: React.FC = () => {
  const { quotes, customers, services, createQuote, updateQuote, convertQuoteToInvoice, deleteQuote } = useBusiness();
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Filters
  const [filterStatus, setFilterStatus] = useState<'all' | 'drafted' | 'sent' | 'accepted' | 'declined'>('all');

  // Form states
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [serviceId, setServiceId] = useState(services[0]?.id || '');
  const [estimatedPrice, setEstimatedPrice] = useState(services[0]?.price.toString() || '0');
  const [notes, setNotes] = useState('');
  const [validUntil, setValidUntil] = useState('');

  const getCustomerName = (id: string) => {
    return customers.find(c => c.id === id)?.name || 'Private Client';
  };

  const getServiceName = (id?: string) => {
    if (!id) return 'Consulting Retainer';
    return services.find(s => s.id === id)?.name || 'Consulting Retainer';
  };

  const filteredQuotes = quotes.filter(q => {
    if (filterStatus === 'all') return true;
    return q.status === filterStatus;
  });

  const handleCreateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || !serviceId) return;

    createQuote({
      customerId,
      serviceId,
      estimatedPrice: Number(estimatedPrice),
      notes,
      validUntil: validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'drafted'
    });

    setIsAddOpen(false);
    setNotes('');
  };

  const handleUpdateStatus = (id: string, newStatus: 'sent' | 'accepted' | 'declined') => {
    updateQuote(id, { status: newStatus });
  };

  const handleConvert = (id: string) => {
    convertQuoteToInvoice(id);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in text-xs">
      
      {/* 1. MODULE CONTROL BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 dark:border-zinc-800">
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-zinc-50">Quotes & Estimations</h1>
          <p className="text-2xs text-gray-400 dark:text-zinc-500">Formulate strategic client project proposals, retainers, and scope budgets</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <SlidersHorizontal className="h-3.5 w-3.5 text-gray-400" />
            <select
              id="quote-status-filter"
              value={filterStatus}
              onChange={(e: any) => setFilterStatus(e.target.value)}
              className="rounded-lg border border-gray-150 p-1.5 bg-white text-gray-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            >
              <option value="all">All Estimates</option>
              <option value="drafted">📁 Drafted</option>
              <option value="sent">✈️ Sent</option>
              <option value="accepted">💚 Accepted</option>
              <option value="declined">❌ Declined</option>
            </select>
          </div>

          <button
            id="quote-add-trigger"
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
          >
            <Plus className="h-4 w-4" />
            <span>Generate Quote</span>
          </button>
        </div>
      </div>

      {/* 2. QUOTES GRID DISPLAY */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredQuotes.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3 py-16 border border-dashed rounded-xl text-center text-gray-400 dark:border-zinc-800">
            No quotations registered
          </div>
        ) : (
          filteredQuotes.map((q) => {
            const estimatedPriceVal = q.estimatedPrice ?? q.total ?? 0;
            const validUntilVal = q.validUntil ?? q.expiryDate ?? '';
            const serviceDescription = q.serviceId ? getServiceName(q.serviceId) : (q.items?.[0]?.description || 'Creative Strategy Support');
            const normalizedStatus = q.status === 'approved' ? 'accepted' : q.status === 'draft' ? 'drafted' : q.status;

            return (
              <div 
                key={q.id}
                className="rounded-xl border border-gray-100 bg-white p-5 shadow-2xs hover:shadow-xs hover:border-gray-200 transition-all dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-4xs font-mono text-gray-400 dark:text-zinc-500 block uppercase tracking-wider font-semibold">Proposal Code</span>
                      <span className="font-bold font-mono text-gray-900 dark:text-white">{q.quoteNumber}</span>
                    </div>

                    <span className={`
                      capitalize font-bold px-1.5 py-0.5 rounded-xs text-3xs
                      ${(normalizedStatus === 'accepted' || normalizedStatus === 'converted') ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' : ''}
                      ${normalizedStatus === 'sent' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400' : ''}
                      ${normalizedStatus === 'declined' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400' : ''}
                      ${normalizedStatus === 'drafted' ? 'bg-gray-50 text-gray-500 dark:bg-zinc-800 dark:text-zinc-400' : ''}
                    `}>
                      {normalizedStatus}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-zinc-200">{getCustomerName(q.customerId)}</h4>
                    <p className="text-3xs text-gray-400 dark:text-zinc-500 mt-0.5">Estimated Deliverable: {serviceDescription}</p>
                  </div>

                  <div className="bg-gray-50/50 p-2.5 rounded-lg border border-gray-50/60 font-mono text-center dark:bg-zinc-850/20 dark:border-zinc-800/60">
                    <span className="text-4xs text-gray-400 uppercase tracking-wider block font-bold font-sans">Estimated Target Fee</span>
                    <span className="text-sm font-extrabold text-teal-600 dark:text-teal-400">${estimatedPriceVal.toLocaleString()}</span>
                  </div>

                  {q.notes && (
                    <p className="text-3xs text-gray-500 dark:text-zinc-400 italic line-clamp-2">
                      "{q.notes}"
                    </p>
                  )}

                  <div className="text-3xs text-gray-400 font-mono">
                    Proposal Valid Until: {validUntilVal}
                  </div>
                </div>

                {/* Action buttons footer */}
                <div className="mt-5 pt-4 border-t border-gray-50 dark:border-zinc-800/80 flex flex-wrap gap-2 items-center justify-between">
                  <button
                    id={`quote-delete-${q.id}`}
                    onClick={() => deleteQuote(q.id)}
                    className="p-1 rounded-md text-gray-400 hover:text-rose-500 transition-colors"
                    title="Delete proposal"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="flex gap-1.5 items-center">
                    {normalizedStatus === 'drafted' && (
                      <button
                        id={`quote-mark-sent-${q.id}`}
                        onClick={() => handleUpdateStatus(q.id, 'sent')}
                        className="px-2.5 py-1 rounded-lg border text-3xs font-semibold hover:bg-gray-50 dark:border-zinc-800 text-gray-600 dark:text-zinc-300"
                      >
                        Mark Sent
                      </button>
                    )}
                    {normalizedStatus === 'sent' && (
                      <>
                        <button
                          id={`quote-accept-${q.id}`}
                          onClick={() => handleUpdateStatus(q.id, 'accepted')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 text-3xs font-semibold hover:bg-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/40"
                        >
                          Accept
                        </button>
                        <button
                          id={`quote-decline-${q.id}`}
                          onClick={() => handleUpdateStatus(q.id, 'declined')}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-100 text-rose-700 text-3xs font-semibold hover:bg-rose-100 dark:bg-rose-950/20 dark:border-rose-900/40"
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {normalizedStatus === 'accepted' && (
                      <button
                        id={`quote-convert-${q.id}`}
                        onClick={() => handleConvert(q.id)}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-600 text-white text-3xs font-semibold hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 shadow-3xs"
                      >
                        <span>Invoicing</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* DIALOG MODAL: ADD PROPOSAL */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl border border-gray-100 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 animate-scale-up">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3 dark:border-zinc-800">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-zinc-50">Generate Project Quotation</h2>
              <button 
                id="quote-modal-close"
                onClick={() => setIsAddOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuote} className="mt-4 space-y-4">
              <div>
                <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Target Client Profile *</label>
                <select
                  id="quote-customer-select"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full rounded-lg border border-gray-150 p-2.5 bg-white text-gray-850 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-200"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Service deliverable scope *</label>
                <select
                  id="quote-service-select"
                  value={serviceId}
                  onChange={(e) => {
                    setServiceId(e.target.value);
                    const pr = services.find(s => s.id === e.target.value)?.price;
                    if (pr) setEstimatedPrice(pr.toString());
                  }}
                  className="w-full rounded-lg border border-gray-150 p-2.5 bg-white text-gray-850 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-200"
                >
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.name} - ${s.price}</option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Target Quotation Price ($) *</label>
                  <input
                    id="quote-price-input"
                    type="number"
                    required
                    value={estimatedPrice}
                    onChange={(e) => setEstimatedPrice(e.target.value)}
                    className="w-full rounded-lg border border-gray-150 p-2.5 text-gray-900 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Proposal Valid Until</label>
                  <input
                    id="quote-valid-date-input"
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="w-full rounded-lg border border-gray-150 p-2.5 text-gray-900 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Detailed scope notes / deliverables description</label>
                <textarea
                  id="quote-notes-textarea"
                  placeholder="Includes 3 cycles of design mocks, responsive UI styling in React with full support..."
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-lg border border-gray-150 p-2.5 text-gray-900 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100 focus:outline-hidden"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-50 dark:border-zinc-800 justify-end">
                <button
                  id="quote-add-cancel"
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-50 dark:border-zinc-800 dark:text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  id="quote-add-submit"
                  type="submit"
                  className="rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700 dark:bg-teal-500"
                >
                  Draft Quote
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default QuotesView;
