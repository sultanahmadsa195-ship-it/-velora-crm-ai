import React, { useState } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  Building, 
  MapPin, 
  FileText, 
  Trash2, 
  Sparkles,
  BookOpen,
  Calendar,
  History,
  X,
  FileUp,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

export const CustomersView: React.FC = () => {
  const { 
    customers, 
    addCustomer, 
    updateCustomer, 
    deleteCustomer, 
    customerNotes, 
    addCustomerNote,
    customerHistory,
    documents,
    uploadDocument,
    setActiveTab,
    searchQuery
  } = useBusiness();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [localSearch, setLocalSearch] = useState('');

  // Modals / Creating State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCust, setNewCust] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    status: 'active' as 'active' | 'inactive'
  });

  // Notes state
  const [newNoteText, setNewNoteText] = useState('');
  const [noteType, setNoteType] = useState<'internal' | 'client_communication'>('internal');

  // Customer selection
  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  // Filtering list
  const activeSearch = searchQuery || localSearch;
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(activeSearch.toLowerCase()) || 
                          c.email.toLowerCase().includes(activeSearch.toLowerCase()) || 
                          c.company.toLowerCase().includes(activeSearch.toLowerCase());
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getNotesForSelected = () => {
    return customerNotes.filter(n => n.customerId === selectedCustomerId);
  };

  const getHistoryForSelected = () => {
    return customerHistory.filter(h => h.customerId === selectedCustomerId);
  };

  const getDocsForSelected = () => {
    return documents.filter(d => d.customerId === selectedCustomerId);
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCust.name || !newCust.email) return;

    const added = addCustomer(newCust);
    setSelectedCustomerId(added.id);
    setIsAddOpen(false);
    setNewCust({
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      status: 'active'
    });
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !selectedCustomerId) return;
    addCustomerNote(selectedCustomerId, newNoteText, noteType);
    setNewNoteText('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCustomerId) return;

    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    const sizeStr = `${sizeMB} MB`;
    const extension = file.name.split('.').pop() || 'dat';

    // Simple file simulation
    uploadDocument(file.name, sizeStr, extension, undefined, selectedCustomerId);
  };

  const toggleStatus = () => {
    if (!selectedCustomer) return;
    const newStatus = selectedCustomer.status === 'active' ? 'inactive' : 'active';
    updateCustomer(selectedCustomer.id, { status: newStatus });
  };

  const handleTriggerAiChat = (type: 'email' | 'quote' | 'summarize') => {
    // Navigate and store custom metadata if necessary
    // We can save variables into session storage for the AI Assistant to read on mount!
    if (selectedCustomer) {
      sessionStorage.setItem('ai_preset_type', type);
      sessionStorage.setItem('ai_preset_customer_id', selectedCustomer.id);
      sessionStorage.setItem('ai_preset_customer_name', selectedCustomer.name);
      sessionStorage.setItem('ai_preset_customer_email', selectedCustomer.email);
      setActiveTab('ai-assistant');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] bg-gray-50 dark:bg-zinc-950">
      
      {/* LEFT COLUMN: CLIENT LIST DIRECTORY */}
      <div className="w-full lg:w-96 border-r border-gray-100 bg-white flex flex-col shrink-0 dark:border-zinc-800 dark:bg-zinc-900">
        
        {/* Search & Actions Header */}
        <div className="p-4 border-b border-gray-150 space-y-3 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-zinc-50">Clients Ledger</h2>
            <button 
              onClick={() => setIsAddOpen(true)}
              className="flex items-center gap-1 rounded-lg bg-teal-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Client</span>
            </button>
          </div>

          {/* Local Search input (if no global search query active) */}
          {!searchQuery && (
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2.5">
                <Search className="h-3.5 w-3.5 text-gray-400 dark:text-zinc-500" />
              </span>
              <input
                id="customer-local-search"
                type="text"
                placeholder="Search phone, company, email..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-150 bg-gray-50/50 py-1.5 pl-8 pr-3 text-xs text-gray-900 focus:border-gray-300 focus:bg-white focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100"
              />
            </div>
          )}

          {/* Status Tabs Filters */}
          <div className="flex border-b border-gray-100 text-xs gap-4 dark:border-zinc-800">
            {(['all', 'active', 'inactive'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`pb-2 font-medium capitalize border-b-2 transition-all ${
                  filterStatus === status 
                    ? 'border-teal-500 text-teal-600 dark:text-teal-400' 
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Customer List */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50 p-2 space-y-1 dark:divide-zinc-800/40">
          {filteredCustomers.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-400 dark:text-zinc-500">
              No customers found
            </div>
          ) : (
            filteredCustomers.map((cust) => (
              <button
                key={cust.id}
                id={`customer-directory-item-${cust.id}`}
                onClick={() => setSelectedCustomerId(cust.id)}
                className={`
                  w-full text-left p-3 rounded-lg flex items-center justify-between transition-all group
                  ${selectedCustomerId === cust.id 
                    ? 'bg-gray-50 dark:bg-zinc-800/80' 
                    : 'hover:bg-gray-50/50 dark:hover:bg-zinc-850/50'
                  }
                `}
              >
                <div className="min-w-0 flex-1 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-800 dark:text-zinc-200 truncate block">
                      {cust.name}
                    </span>
                    <span className={`
                      h-1.5 w-1.5 rounded-full shrink-0
                      ${cust.status === 'active' ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-zinc-600'}
                    `} />
                  </div>
                  <span className="text-3xs font-medium text-gray-400 dark:text-zinc-500 truncate block mt-0.5">
                    {cust.company || 'Private Client'}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-2xs font-bold text-gray-700 dark:text-zinc-300 font-mono">
                    ${cust.totalSpent.toLocaleString()}
                  </span>
                  <span className="text-4xs text-gray-400 dark:text-zinc-500 block mt-0.5 uppercase tracking-wider font-semibold">
                    LTV Spent
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: DETAIL VIEW PANE */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {selectedCustomer ? (
          <div className="grid gap-6 xl:grid-cols-3">
            
            {/* 1. PRIMARY CONTACT DETAILS CARD */}
            <div className="xl:col-span-2 space-y-6">
              <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-50 pb-4 dark:border-zinc-800">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400 flex items-center justify-center font-bold text-lg shadow-2xs">
                      {selectedCustomer.name.charAt(0)}
                    </div>
                    <div>
                      <h1 className="text-lg font-bold text-gray-900 dark:text-zinc-50">{selectedCustomer.name}</h1>
                      <p className="text-xs font-medium text-gray-400 dark:text-zinc-500">{selectedCustomer.company || 'Private Retainer Contract'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status Button */}
                    <button
                      id="customer-toggle-status"
                      onClick={toggleStatus}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all ${
                        selectedCustomer.status === 'active'
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400'
                          : 'bg-gray-100 border-gray-200 text-gray-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400'
                      }`}
                    >
                      {selectedCustomer.status}
                    </button>

                    {/* AI Partner quick-actions */}
                    <button
                      id="customer-ai-summarize"
                      onClick={() => handleTriggerAiChat('summarize')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-teal-100 bg-teal-50 text-teal-700 hover:bg-teal-100 dark:border-teal-950 dark:bg-teal-950/30 dark:text-teal-400"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Summarize</span>
                    </button>
                  </div>
                </div>

                {/* Specific Fields */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2 text-xs">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/50 border border-gray-50 dark:bg-zinc-850/20 dark:border-zinc-800/40">
                    <Mail className="h-4 w-4 text-gray-400 dark:text-zinc-500" />
                    <div>
                      <span className="text-3xs text-gray-400 dark:text-zinc-500 uppercase tracking-wider block font-medium">Email Address</span>
                      <a href={`mailto:${selectedCustomer.email}`} className="font-semibold text-gray-700 hover:underline dark:text-zinc-300">
                        {selectedCustomer.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/50 border border-gray-50 dark:bg-zinc-850/20 dark:border-zinc-800/40">
                    <Phone className="h-4 w-4 text-gray-400 dark:text-zinc-500" />
                    <div>
                      <span className="text-3xs text-gray-400 dark:text-zinc-500 uppercase tracking-wider block font-medium">Phone Connection</span>
                      <a href={`tel:${selectedCustomer.phone}`} className="font-semibold text-gray-700 hover:underline dark:text-zinc-300">
                        {selectedCustomer.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/50 border border-gray-50 sm:col-span-2 dark:bg-zinc-850/20 dark:border-zinc-800/40">
                    <MapPin className="h-4 w-4 text-gray-400 dark:text-zinc-500" />
                    <div>
                      <span className="text-3xs text-gray-400 dark:text-zinc-500 uppercase tracking-wider block font-medium">Billing Location Address</span>
                      <span className="font-semibold text-gray-700 dark:text-zinc-300 leading-relaxed">
                        {selectedCustomer.address}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI-assisted drafts shortcuts */}
                <div className="mt-6 pt-6 border-t border-gray-50 flex flex-wrap gap-2.5 dark:border-zinc-800">
                  <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400 self-center w-full sm:w-auto">AI Partner Drafts:</span>
                  <button
                    id="customer-ai-email"
                    onClick={() => handleTriggerAiChat('email')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-150 hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-850 text-gray-700 dark:text-zinc-300"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>Draft Email</span>
                  </button>
                  <button
                    id="customer-ai-quote"
                    onClick={() => handleTriggerAiChat('quote')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-150 hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-850 text-gray-700 dark:text-zinc-300"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>Compose Estimate</span>
                  </button>
                </div>
              </div>

              {/* 2. CUSTOMER INTERNAL NOTES MANAGEMENT */}
              <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-50 border-b border-gray-50 pb-3 dark:border-zinc-800">
                  Customer Notes & Communication Log
                </h3>

                {/* Add Note Input */}
                <form onSubmit={handleAddNote} className="mt-4 space-y-3">
                  <textarea
                    id="customer-new-note-textarea"
                    placeholder="Enter project details, visual guidelines, or call summaries here..."
                    rows={3}
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="w-full rounded-lg border border-gray-150 p-3 text-xs text-gray-900 focus:border-gray-300 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <label className="flex items-center gap-1.5 text-2xs font-semibold text-gray-500 dark:text-zinc-400">
                        <input
                          id="customer-note-type-internal"
                          type="radio"
                          name="noteType"
                          checked={noteType === 'internal'}
                          onChange={() => setNoteType('internal')}
                          className="text-teal-600 focus:ring-teal-500"
                        />
                        <span>Internal Log</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-2xs font-semibold text-gray-500 dark:text-zinc-400">
                        <input
                          id="customer-note-type-comm"
                          type="radio"
                          name="noteType"
                          checked={noteType === 'client_communication'}
                          onChange={() => setNoteType('client_communication')}
                          className="text-teal-600 focus:ring-teal-500"
                        />
                        <span>Client Communication</span>
                      </label>
                    </div>

                    <button
                      id="customer-add-note-submit"
                      type="submit"
                      disabled={!newNoteText.trim()}
                      className="rounded-lg bg-gray-950 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                      Save Note
                    </button>
                  </div>
                </form>

                {/* Notes Feed */}
                <div className="mt-6 space-y-4 divide-y divide-gray-50 dark:divide-zinc-800/40">
                  {getNotesForSelected().length === 0 ? (
                    <div className="pt-6 text-center text-xs text-gray-400 dark:text-zinc-500">
                      No customer notes stored yet
                    </div>
                  ) : (
                    getNotesForSelected().map((n) => (
                      <div key={n.id} className="pt-4 first:pt-0">
                        <div className="flex items-center justify-between text-3xs font-semibold text-gray-400 dark:text-zinc-500">
                          <span className="flex items-center gap-1">
                            <span className="text-gray-700 dark:text-zinc-300">{n.author}</span>
                            <span>•</span>
                            <span className={`
                              px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-bold
                              ${n.type === 'internal' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400' : 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400'}
                            `}>
                              {n.type === 'internal' ? 'Internal' : 'Client Comm'}
                            </span>
                          </span>
                          <span>
                            {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-gray-700 dark:text-zinc-300 leading-relaxed font-normal whitespace-pre-wrap">
                          {n.note}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* 3. SIDEBAR DETAILS: DYNAMIC ACTIVITY HISTORY & DIGITAL DOCUMENTS */}
            <div className="space-y-6">
              
              {/* Client Documents Cabinet */}
              <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center justify-between border-b border-gray-50 pb-3 dark:border-zinc-800">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-50 flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-gray-400 dark:text-zinc-500" />
                    <span>Client Vault</span>
                  </h3>

                  {/* Upload Simulator */}
                  <label className="flex items-center justify-center h-7 w-7 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 cursor-pointer dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700" title="Upload Document">
                    <FileUp className="h-4 w-4" />
                    <input 
                      id="customer-vault-file-upload"
                      type="file" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                      accept=".png,.jpeg,.pdf,.docx,.doc,.xls,.xlsx"
                    />
                  </label>
                </div>

                <div className="mt-4 space-y-3">
                  {getDocsForSelected().length === 0 ? (
                    <div className="py-8 text-center text-xs text-gray-400 dark:text-zinc-500">
                      No documents stored
                    </div>
                  ) : (
                    getDocsForSelected().map((doc) => (
                      <div 
                        key={doc.id}
                        className="p-2.5 rounded-lg border border-gray-50 flex items-center justify-between gap-3 dark:border-zinc-800/40 dark:bg-zinc-850/10"
                      >
                        <div className="min-w-0 flex-1">
                          <span className="text-2xs font-semibold text-gray-800 dark:text-zinc-200 block truncate leading-tight">
                            {doc.name}
                          </span>
                          <span className="text-3xs text-gray-400 dark:text-zinc-500 font-mono">
                            {doc.size} • {doc.type.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-3xs font-mono text-teal-600 dark:text-teal-400 uppercase font-bold tracking-wider shrink-0">
                          Stored
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* History Timeline specifically for this Customer */}
              <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-50 border-b border-gray-50 pb-3 dark:border-zinc-800 flex items-center gap-1.5">
                  <History className="h-4 w-4 text-gray-400" />
                  <span>Activity History</span>
                </h3>

                <div className="mt-4 relative border-l border-gray-100 pl-4 space-y-4 ml-1.5 dark:border-zinc-800">
                  {getHistoryForSelected().length === 0 ? (
                    <div className="py-8 text-center text-xs text-gray-400 dark:text-zinc-500">
                      No registration history yet
                    </div>
                  ) : (
                    getHistoryForSelected().map((hist) => (
                      <div key={hist.id} className="relative">
                        <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-teal-500 ring-4 ring-white dark:ring-zinc-900" />
                        <div>
                          <p className="text-xs font-semibold text-gray-800 dark:text-zinc-300 leading-tight">
                            {hist.description}
                          </p>
                          <span className="text-3xs text-gray-400 dark:text-zinc-500 font-mono mt-0.5 block">
                            {new Date(hist.date).toLocaleDateString()}
                          </span>
                          {hist.amount !== undefined && (
                            <span className="text-3xs font-mono text-teal-600 dark:text-teal-400 mt-0.5 block font-semibold">
                              ${hist.amount.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="h-[400px] flex items-center justify-center border border-dashed rounded-xl border-gray-200 dark:border-zinc-800">
            <div className="text-center text-xs text-gray-400 dark:text-zinc-500">
              Select or register a customer in the ledger to review operational records
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD CUSTOMER DIALOG */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl border border-gray-100 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 animate-scale-up">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3 dark:border-zinc-800">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-zinc-50">Register New Customer Profile</h2>
              <button 
                id="customer-modal-close"
                onClick={() => setIsAddOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Full Client Name *</label>
                <input
                  id="customer-add-name-input"
                  type="text"
                  required
                  value={newCust.name}
                  onChange={(e) => setNewCust({...newCust, name: e.target.value})}
                  className="w-full rounded-lg border border-gray-150 p-2.5 text-gray-900 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Email Address *</label>
                <input
                  id="customer-add-email-input"
                  type="email"
                  required
                  value={newCust.email}
                  onChange={(e) => setNewCust({...newCust, email: e.target.value})}
                  className="w-full rounded-lg border border-gray-150 p-2.5 text-gray-900 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100 focus:outline-hidden"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Phone Number</label>
                  <input
                    id="customer-add-phone-input"
                    type="text"
                    value={newCust.phone}
                    onChange={(e) => setNewCust({...newCust, phone: e.target.value})}
                    className="w-full rounded-lg border border-gray-150 p-2.5 text-gray-900 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Company / Organization</label>
                  <input
                    id="customer-add-company-input"
                    type="text"
                    value={newCust.company}
                    onChange={(e) => setNewCust({...newCust, company: e.target.value})}
                    className="w-full rounded-lg border border-gray-150 p-2.5 text-gray-900 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Billing Location Address</label>
                <input
                  id="customer-add-address-input"
                  type="text"
                  value={newCust.address}
                  onChange={(e) => setNewCust({...newCust, address: e.target.value})}
                  className="w-full rounded-lg border border-gray-150 p-2.5 text-gray-900 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-50 dark:border-zinc-800 justify-end">
                <button
                  id="customer-add-cancel"
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  id="customer-add-submit"
                  type="submit"
                  className="rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
                >
                  Register Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default CustomersView;
