import React, { useState } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { 
  Plus, 
  Trash2, 
  X, 
  Search, 
  Sparkles,
  BookOpen,
  DollarSign
} from 'lucide-react';

export const ServicesView: React.FC = () => {
  const { services, addService, updateService, deleteService } = useBusiness();
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form states
  const [newSrv, setNewSrv] = useState({
    name: '',
    description: '',
    price: ''
  });

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSrv.name || !newSrv.price) return;

    addService({
      name: newSrv.name,
      description: newSrv.description,
      price: Number(newSrv.price)
    });

    setIsAddOpen(false);
    setNewSrv({ name: '', description: '', price: '' });
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in text-xs">
      
      {/* 1. MODULE CONTROL BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 dark:border-zinc-800">
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-zinc-50">CRM Offerings & Services</h1>
          <p className="text-2xs text-gray-400 dark:text-zinc-500">Configure catalog offerings, baseline prices, and scope benchmarks</p>
        </div>

        <button
          id="services-add-trigger"
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add Service</span>
        </button>
      </div>

      {/* 2. SERVICES CATALOG GRID */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.length === 0 ? (
          <div className="sm:col-span-2 lg:col-span-3 py-16 border border-dashed rounded-xl text-center text-gray-400 dark:border-zinc-800">
            No active services in the catalog
          </div>
        ) : (
          services.map((srv) => (
            <div 
              key={srv.id}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-2xs hover:shadow-xs hover:border-gray-200 transition-all dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="rounded-lg bg-teal-50/60 p-2 text-teal-600 dark:bg-teal-950/20 dark:text-teal-400">
                    <BookOpen className="h-4.5 w-4.5" />
                  </span>
                  
                  <button
                    id={`service-delete-btn-${srv.id}`}
                    onClick={() => deleteService(srv.id)}
                    className="text-gray-400 hover:text-rose-500"
                    title="Delete service offering"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 dark:text-zinc-200">{srv.name}</h3>
                  <p className="text-2xs text-gray-500 dark:text-zinc-400 mt-1 line-clamp-3 leading-relaxed font-normal">
                    {srv.description || 'Custom service specifications configured upon consultation intake.'}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-50 dark:border-zinc-800/80 flex items-center justify-between">
                <span className="text-3xs uppercase tracking-widest text-gray-400 dark:text-zinc-500 font-bold">Base Cost</span>
                <span className="text-sm font-extrabold text-teal-600 dark:text-teal-400 font-mono">
                  ${srv.price.toLocaleString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DIALOG MODAL: ADD SERVICE */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl border border-gray-100 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 animate-scale-up">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3 dark:border-zinc-800">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-zinc-50">Register Service Offering</h2>
              <button 
                id="service-modal-close"
                onClick={() => setIsAddOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="mt-4 space-y-4">
              <div>
                <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Service Label / Name *</label>
                <input
                  id="service-add-name"
                  type="text"
                  required
                  placeholder="e.g. Premium Branding Identity Kit"
                  value={newSrv.name}
                  onChange={(e) => setNewSrv({...newSrv, name: e.target.value})}
                  className="w-full rounded-lg border border-gray-150 p-2.5 text-gray-900 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Standard Scope Cost ($) *</label>
                <input
                  id="service-add-price"
                  type="number"
                  required
                  placeholder="e.g. 3500"
                  value={newSrv.price}
                  onChange={(e) => setNewSrv({...newSrv, price: e.target.value})}
                  className="w-full rounded-lg border border-gray-150 p-2.5 text-gray-900 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Service Details & Deliverables Description</label>
                <textarea
                  id="service-add-desc"
                  placeholder="Draft specs, milestones timeline, client review rounds limit..."
                  rows={4}
                  value={newSrv.description}
                  onChange={(e) => setNewSrv({...newSrv, description: e.target.value})}
                  className="w-full rounded-lg border border-gray-150 p-2.5 text-gray-900 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100 focus:outline-hidden"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-50 dark:border-zinc-800 justify-end">
                <button
                  id="service-add-cancel"
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-50 dark:border-zinc-800 dark:text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  id="service-add-submit"
                  type="submit"
                  className="rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700 dark:bg-teal-500"
                >
                  Add Service Offering
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default ServicesView;
