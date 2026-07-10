import React, { useState } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { 
  Plus, 
  Trash2, 
  Search, 
  SlidersHorizontal, 
  Printer, 
  CreditCard, 
  Clock, 
  X, 
  CheckCircle,
  FileText,
  DollarSign
} from 'lucide-react';
import { Invoice, InvoiceItem } from '../types';

export const InvoicesView: React.FC = () => {
  const { 
    invoices, 
    customers, 
    services, 
    createInvoice, 
    updateInvoice, 
    recordPayment, 
    deleteInvoice 
  } = useBusiness();

  // Dialog controls
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  
  // Selection references
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  
  // Create Invoice State
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState<Omit<InvoiceItem, 'id'>[]>([
    { serviceId: services[0]?.id || '', description: services[0]?.name || '', quantity: 1, unitPrice: services[0]?.price || 0, amount: services[0]?.price || 0 }
  ]);
  const [invoiceNotes, setInvoiceNotes] = useState('');

  // Payment recording parameters
  const [payAmount, setPayAmount] = useState(0);
  const [payMethod, setPayMethod] = useState<'cash' | 'credit_card' | 'bank_transfer' | 'paypal' | 'other'>('credit_card');
  const [payRef, setPayRef] = useState('');

  // Filters
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'sent' | 'paid' | 'overdue'>('all');

  const getCustomerName = (id: string) => {
    return customers.find(c => c.id === id)?.name || 'Private Client';
  };

  const getCustomerEmail = (id: string) => {
    return customers.find(c => c.id === id)?.email || 'no-email@biz.com';
  };

  const filteredInvoices = invoices.filter(inv => {
    return filterStatus === 'all' || inv.status === filterStatus;
  });

  // Calculate invoice sums
  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const tax = Math.round(subtotal * 0.08); // 8% standard tax
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  // Add Item to creation array
  const handleAddItem = () => {
    setItems([...items, { serviceId: services[0]?.id || '', description: services[0]?.name || '', quantity: 1, unitPrice: services[0]?.price || 0, amount: services[0]?.price || 0 }]);
  };

  // Remove Item from creation array
  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemServiceChange = (index: number, srvId: string) => {
    const srv = services.find(s => s.id === srvId);
    if (!srv) return;

    setItems(items.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          serviceId: srvId,
          description: srv.name,
          unitPrice: srv.price,
          amount: srv.price * item.quantity
        };
      }
      return item;
    }));
  };

  const handleItemQtyChange = (index: number, qty: number) => {
    setItems(items.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          quantity: qty,
          amount: item.unitPrice * qty
        };
      }
      return item;
    }));
  };

  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const { subtotal, tax, total } = calculateTotals();

    createInvoice({
      customerId,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: items.map((it, idx) => ({ ...it, id: `item-${idx}-${Date.now()}` })),
      subtotal,
      tax,
      discount: 0,
      total,
      status: 'sent',
      notes: invoiceNotes
    });

    setIsCreateOpen(false);
    setItems([{ serviceId: services[0]?.id || '', description: services[0]?.name || '', quantity: 1, unitPrice: services[0]?.price || 0, amount: services[0]?.price || 0 }]);
    setInvoiceNotes('');
  };

  const triggerPaymentModal = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setPayAmount(inv.total);
    setIsPaymentOpen(true);
  };

  const handleConfirmPayment = () => {
    if (!selectedInvoice) return;
    recordPayment(selectedInvoice.id, payAmount, payMethod, payRef);
    setIsPaymentOpen(false);
    setSelectedInvoice(null);
  };

  const triggerPrintModal = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setIsPrintOpen(true);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in text-xs">
      
      {/* 1. MODULE CONTROL BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 dark:border-zinc-800">
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-zinc-50 font-sans">Billing & Invoices</h1>
          <p className="text-2xs text-gray-400 dark:text-zinc-500">Generate professional invoice schedules and audit payments history</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <SlidersHorizontal className="h-3.5 w-3.5 text-gray-400" />
            <select
              id="invoice-status-filter"
              value={filterStatus}
              onChange={(e: any) => setFilterStatus(e.target.value)}
              className="rounded-lg border border-gray-150 p-1.5 bg-white text-gray-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            >
              <option value="all">All Statuses</option>
              <option value="paid">✅ Paid Only</option>
              <option value="sent">✈️ Sent Only</option>
              <option value="overdue">🚨 Overdue Only</option>
              <option value="draft">📁 Draft Only</option>
            </select>
          </div>

          <button
            id="invoice-create-trigger"
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
          >
            <Plus className="h-4 w-4" />
            <span>Generate Invoice</span>
          </button>
        </div>
      </div>

      {/* 2. INVOICE RECORDS TABLE */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-2xs overflow-hidden dark:border-zinc-800 dark:bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 dark:bg-zinc-850 dark:border-zinc-800 dark:text-zinc-400">
                <th className="p-4 font-bold">Invoice Ref</th>
                <th className="p-4 font-bold">Customer Profile</th>
                <th className="p-4 font-bold">Billing Date</th>
                <th className="p-4 font-bold">Due Date</th>
                <th className="p-4 font-bold">Amount Due</th>
                <th className="p-4 font-bold">Payment Status</th>
                <th className="p-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/60 text-gray-700 dark:text-zinc-300">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-400 dark:text-zinc-500">
                    No matching invoices registered
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/40 dark:hover:bg-zinc-850/20 transition-colors">
                    <td className="p-4 font-bold text-gray-900 dark:text-white font-mono">{inv.invoiceNumber}</td>
                    <td className="p-4">
                      <div>
                        <span className="font-semibold block text-gray-800 dark:text-zinc-200">{getCustomerName(inv.customerId)}</span>
                        <span className="text-3xs text-gray-400 dark:text-zinc-500 block mt-0.5">{getCustomerEmail(inv.customerId)}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono">{inv.issueDate}</td>
                    <td className="p-4 font-mono">{inv.dueDate}</td>
                    <td className="p-4 font-bold font-mono text-gray-900 dark:text-zinc-100">${inv.total.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`
                        capitalize font-bold px-2 py-0.5 rounded-sm inline-block text-3xs
                        ${inv.status === 'paid' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' : ''}
                        ${inv.status === 'sent' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400' : ''}
                        ${inv.status === 'overdue' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400' : ''}
                        ${inv.status === 'draft' ? 'bg-gray-50 text-gray-500 dark:bg-zinc-800 dark:text-zinc-400' : ''}
                      `}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {inv.status !== 'paid' && (
                          <button
                            id={`invoice-record-pay-${inv.id}`}
                            onClick={() => triggerPaymentModal(inv)}
                            className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/20"
                            title="Record Payment"
                          >
                            <CreditCard className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          id={`invoice-print-${inv.id}`}
                          onClick={() => triggerPrintModal(inv)}
                          className="p-1 rounded-md text-gray-600 hover:bg-gray-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
                          title="Print Receipt"
                        >
                          <Printer className="h-4 w-4" />
                        </button>
                        <button
                          id={`invoice-delete-${inv.id}`}
                          onClick={() => deleteInvoice(inv.id)}
                          className="p-1 rounded-md text-gray-400 hover:text-rose-500 dark:hover:bg-zinc-800"
                          title="Delete Invoice"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DIALOG MODAL: GENERATE NEW INVOICE */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-xl border border-gray-100 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 my-8 animate-scale-up">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3 dark:border-zinc-800">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-zinc-50">Compile Formal Bill / Invoice</h2>
              <button 
                id="invoice-modal-close"
                onClick={() => setIsCreateOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInvoice} className="mt-4 space-y-4">
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Target Client Profile *</label>
                  <select
                    id="invoice-customer-select"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    className="w-full rounded-lg border border-gray-150 p-2.5 bg-white text-gray-800 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-200"
                  >
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Payment Due Date *</label>
                  <input
                    id="invoice-due-date-input"
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-150 p-2.5 text-gray-900 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100"
                  />
                </div>
              </div>

              {/* Items Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-600 dark:text-zinc-400">Billable Deliverables Items</span>
                  <button
                    id="invoice-add-item-btn"
                    type="button"
                    onClick={handleAddItem}
                    className="text-2xs font-semibold text-teal-600 hover:underline dark:text-teal-400"
                  >
                    + Add Custom Item
                  </button>
                </div>

                <div className="space-y-2.5">
                  {items.map((item, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      {/* Select Service */}
                      <div className="flex-1">
                        <select
                          id={`invoice-item-service-${index}`}
                          value={item.serviceId}
                          onChange={(e) => handleItemServiceChange(index, e.target.value)}
                          className="w-full rounded-lg border border-gray-150 p-2 bg-white text-gray-800 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-200"
                        >
                          {services.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Quantity */}
                      <div className="w-16">
                        <input
                          id={`invoice-item-qty-${index}`}
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => handleItemQtyChange(index, Number(e.target.value))}
                          className="w-full rounded-lg border border-gray-150 p-2 text-center text-gray-900 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100 focus:outline-hidden"
                        />
                      </div>

                      {/* Display Unit Price */}
                      <div className="w-24 text-right font-semibold font-mono text-gray-700 dark:text-zinc-300">
                        ${item.unitPrice.toLocaleString()}
                      </div>

                      {/* Display Amount */}
                      <div className="w-24 text-right font-bold font-mono text-gray-900 dark:text-zinc-100">
                        ${item.amount.toLocaleString()}
                      </div>

                      {/* Remove Btn */}
                      <button
                        id={`invoice-item-remove-${index}`}
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        disabled={items.length === 1}
                        className="text-gray-400 hover:text-rose-500 disabled:opacity-30 pl-1 shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subtotal & Totals Displays */}
              <div className="border-t border-gray-50 dark:border-zinc-800 pt-4 text-right space-y-1.5 font-mono">
                <div className="text-gray-500 dark:text-zinc-400">
                  Subtotal: <span className="font-semibold text-gray-800 dark:text-zinc-200">${calculateTotals().subtotal.toLocaleString()}</span>
                </div>
                <div className="text-gray-500 dark:text-zinc-400">
                  Standard Tax (8%): <span className="font-semibold text-gray-800 dark:text-zinc-200">${calculateTotals().tax.toLocaleString()}</span>
                </div>
                <div className="text-sm font-bold text-gray-950 dark:text-white pt-1.5 border-t border-dashed border-gray-150 dark:border-zinc-800">
                  Total Billable Due: <span>${calculateTotals().total.toLocaleString()}</span>
                </div>
              </div>

              {/* Invoice notes */}
              <div>
                <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Invoice Notes / Terms</label>
                <textarea
                  id="invoice-add-notes-textarea"
                  placeholder="Thank you for your business. Due upon presentation terms..."
                  rows={2}
                  value={invoiceNotes}
                  onChange={(e) => setInvoiceNotes(e.target.value)}
                  className="w-full rounded-lg border border-gray-150 p-2.5 text-gray-900 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100 focus:outline-hidden"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-50 dark:border-zinc-800 justify-end">
                <button
                  id="invoice-add-cancel"
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  id="invoice-add-submit"
                  type="submit"
                  className="rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
                >
                  Save & Issue Invoice
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DIALOG MODAL: RECORD PAYMENT */}
      {isPaymentOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-xl border border-gray-100 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 animate-scale-up">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3 dark:border-zinc-800">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-zinc-50">Record Revenue Payment</h2>
              <button 
                id="payment-modal-close"
                onClick={() => setIsPaymentOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <span className="text-3xs text-gray-400 dark:text-zinc-500 uppercase font-bold block">Invoice Reference</span>
                <span className="font-bold text-gray-800 dark:text-zinc-200 font-mono text-sm">{selectedInvoice.invoiceNumber}</span>
              </div>

              <div>
                <span className="text-3xs text-gray-400 dark:text-zinc-500 uppercase font-bold block">Customer Target</span>
                <span className="font-semibold text-gray-800 dark:text-zinc-200">{getCustomerName(selectedInvoice.customerId)}</span>
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div>
                  <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Amount Settled ($) *</label>
                  <input
                    id="payment-amount-input"
                    type="number"
                    required
                    value={payAmount}
                    onChange={(e) => setPayAmount(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-150 p-2 text-gray-900 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Settlement Method *</label>
                  <select
                    id="payment-method-select"
                    value={payMethod}
                    onChange={(e: any) => setPayMethod(e.target.value)}
                    className="w-full rounded-lg border border-gray-150 p-2 bg-white text-gray-900 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100"
                  >
                    <option value="credit_card">Stripe Credit Card</option>
                    <option value="bank_transfer">ACH Bank Transfer</option>
                    <option value="cash">Hard Cash</option>
                    <option value="paypal">PayPal Gateway</option>
                    <option value="other">Other Ledger</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Reference Transaction ID</label>
                <input
                  id="payment-ref-input"
                  type="text"
                  placeholder="e.g. Wire-X-9982"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  className="w-full rounded-lg border border-gray-150 p-2 text-gray-900 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100 focus:outline-hidden"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-50 dark:border-zinc-800 justify-end">
                <button
                  id="payment-add-cancel"
                  onClick={() => setIsPaymentOpen(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-50 dark:border-zinc-800 dark:text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  id="payment-add-submit"
                  onClick={handleConfirmPayment}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                >
                  Confirm Settlement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DIALOG MODAL: PRINT PREVIEW FORM */}
      {isPrintOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-xl border border-gray-100 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 my-8 animate-scale-up">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3 dark:border-zinc-800">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-zinc-50">Invoice Printable Template</h2>
              <button 
                id="print-modal-close"
                onClick={() => setIsPrintOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 p-6 border rounded-lg bg-gray-50/20 text-xs dark:bg-zinc-950/20 dark:border-zinc-800" id="printable-invoice-content">
              
              {/* Receipt Header */}
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h1 className="text-sm font-bold tracking-tight text-gray-900 dark:text-white uppercase">Velora CRM AI</h1>
                  <p className="text-3xs text-gray-400 mt-0.5">San Francisco • USA</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold font-mono block text-gray-900 dark:text-zinc-100">{selectedInvoice.invoiceNumber}</span>
                  <span className="text-3xs text-gray-400 uppercase font-bold tracking-wider">Formal Bill</span>
                </div>
              </div>

              {/* Bill to metadata */}
              <div className="grid gap-4 sm:grid-cols-2 mt-8 pt-4 border-t border-dashed border-gray-150 dark:border-zinc-800">
                <div>
                  <span className="text-3xs text-gray-400 uppercase font-semibold">Bill To:</span>
                  <p className="font-bold text-gray-800 dark:text-zinc-200 mt-0.5">{getCustomerName(selectedInvoice.customerId)}</p>
                  <p className="text-3xs text-gray-500 dark:text-zinc-400">{getCustomerEmail(selectedInvoice.customerId)}</p>
                </div>
                <div className="sm:text-right">
                  <span className="text-3xs text-gray-400 uppercase font-semibold block">Billing Milestones:</span>
                  <span className="font-semibold block mt-0.5">Issued: {selectedInvoice.issueDate}</span>
                  <span className="font-semibold block text-rose-500">Due: {selectedInvoice.dueDate}</span>
                </div>
              </div>

              {/* Receipt Items Details */}
              <div className="mt-8">
                <div className="grid grid-cols-12 font-bold border-b border-gray-100 pb-2 text-gray-500 dark:border-zinc-800 dark:text-zinc-400 uppercase text-3xs">
                  <div className="col-span-8">Description</div>
                  <div className="col-span-1 text-center">Qty</div>
                  <div className="col-span-3 text-right">Price</div>
                </div>

                <div className="divide-y divide-gray-50 dark:divide-zinc-800/40 mt-1">
                  {selectedInvoice.items.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 py-3 text-gray-700 dark:text-zinc-300">
                      <div className="col-span-8 font-semibold">{item.description}</div>
                      <div className="col-span-1 text-center font-semibold font-mono">{item.quantity}</div>
                      <div className="col-span-3 text-right font-bold font-mono">${item.amount.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Summary */}
              <div className="mt-6 pt-4 border-t border-dashed border-gray-150 dark:border-zinc-800 text-right space-y-1 font-mono">
                <p className="text-gray-400">Subtotal: <span className="text-gray-800 dark:text-zinc-200 font-semibold">${selectedInvoice.subtotal.toLocaleString()}</span></p>
                <p className="text-gray-400">Tax (8%): <span className="text-gray-800 dark:text-zinc-200 font-semibold">${selectedInvoice.tax.toLocaleString()}</span></p>
                <p className="text-sm font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-zinc-800">Total Charged: <span>${selectedInvoice.total.toLocaleString()}</span></p>
              </div>

              <p className="text-center text-4xs font-mono text-gray-400 dark:text-zinc-500 mt-8">
                {selectedInvoice.notes || 'Velora CRM AI consulting terms apply.'}
              </p>

            </div>

            <div className="flex gap-3 pt-6 border-t border-gray-50 dark:border-zinc-800 justify-end">
              <button
                id="print-dismiss"
                onClick={() => setIsPrintOpen(false)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-50 dark:border-zinc-800 dark:text-zinc-400"
              >
                Close Preview
              </button>
              <button
                id="print-trigger-action"
                onClick={() => window.print()}
                className="rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700 dark:bg-teal-500"
              >
                Print Document
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default InvoicesView;
