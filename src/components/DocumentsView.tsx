import React, { useState } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { 
  FileUp, 
  Trash2, 
  Search, 
  BookOpen, 
  Folder, 
  User, 
  AlertCircle 
} from 'lucide-react';

export const DocumentsView: React.FC = () => {
  const { documents, customers, uploadDocument, deleteDocument } = useBusiness();
  const [selectedCustFilter, setSelectedCustFilter] = useState<'all' | string>('all');

  const getCustomerName = (id?: string) => {
    if (!id) return 'General Business File';
    return customers.find(c => c.id === id)?.name || 'Private Customer';
  };

  const filteredDocs = documents.filter(doc => {
    if (selectedCustFilter === 'all') return true;
    return doc.customerId === selectedCustFilter;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    const sizeStr = `${sizeMB} MB`;
    const extension = file.name.split('.').pop() || 'dat';

    // Simple general file upload
    uploadDocument(file.name, sizeStr, extension, undefined, selectedCustFilter === 'all' ? undefined : selectedCustFilter);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in text-xs">
      
      {/* 1. MODULE CONTROL BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 dark:border-zinc-800">
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-zinc-50 font-sans">Digital Documents Closet</h1>
          <p className="text-2xs text-gray-400 dark:text-zinc-500">Secure CRM files, agreements, and contract scopes</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Target Customer Folder Selector */}
          <div className="flex items-center gap-1">
            <Folder className="h-3.5 w-3.5 text-gray-400" />
            <select
              id="document-customer-filter"
              value={selectedCustFilter}
              onChange={(e) => setSelectedCustFilter(e.target.value)}
              className="rounded-lg border border-gray-150 p-1.5 bg-white text-gray-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            >
              <option value="all">All Cabinets</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name} Files</option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 cursor-pointer shrink-0">
            <FileUp className="h-4 w-4" />
            <span>Upload File</span>
            <input 
              id="document-cabinet-file-upload"
              type="file" 
              onChange={handleFileUpload} 
              className="hidden" 
              accept=".png,.jpeg,.pdf,.docx,.doc,.xls,.xlsx"
            />
          </label>
        </div>
      </div>

      {/* 2. DOCUMENTS COLLECTION LIST */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredDocs.length === 0 ? (
          <div className="sm:col-span-2 lg:col-span-3 py-16 border border-dashed rounded-xl text-center text-gray-400 dark:border-zinc-800">
            No digital assets uploaded in this cabinet
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <div 
              key={doc.id}
              className="rounded-xl border border-gray-100 bg-white p-4.5 shadow-2xs hover:shadow-xs hover:border-gray-200 transition-all dark:border-zinc-800 dark:bg-zinc-900 flex items-center justify-between gap-4"
            >
              <div className="min-w-0 flex-1 space-y-1">
                <span className="text-2xs font-bold text-gray-800 dark:text-zinc-100 block truncate leading-snug">
                  {doc.name}
                </span>
                
                <div className="flex items-center gap-2 text-3xs text-gray-400 dark:text-zinc-500 font-medium">
                  <span className="font-mono uppercase text-teal-600 dark:text-teal-400 font-bold">{doc.type}</span>
                  <span>•</span>
                  <span>{doc.size}</span>
                </div>

                <span className="text-4xs text-gray-400 dark:text-zinc-500 flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span className="truncate">{getCustomerName(doc.customerId)}</span>
                </span>
              </div>

              <button
                id={`document-delete-btn-${doc.id}`}
                onClick={() => deleteDocument(doc.id)}
                className="text-gray-400 hover:text-rose-500 p-1 rounded-lg transition-colors"
                title="Delete document"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
export default DocumentsView;
