import React, { useState } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { 
  Plus, 
  Trash2, 
  X, 
  Star, 
  MessageSquare,
  Sparkles
} from 'lucide-react';

export const ReviewsView: React.FC = () => {
  const { reviews, customers, addReview, deleteReview } = useBusiness();
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form states
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const getCustomerName = (id: string) => {
    return customers.find(c => c.id === id)?.name || 'Private Client';
  };

  const getCustomerCompany = (id: string) => {
    return customers.find(c => c.id === id)?.company || 'Consulting Retainer';
  };

  // Average calculation
  const averageRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '5.0';

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment) return;

    addReview({
      customerId,
      rating,
      comment
    });

    setIsAddOpen(false);
    setComment('');
    setRating(5);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in text-xs">
      
      {/* 1. MODULE CONTROL BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 dark:border-zinc-800">
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-zinc-50 font-sans">Reviews & Feedback</h1>
          <p className="text-2xs text-gray-400 dark:text-zinc-500">Formulate visual rating benchmarks and manage customer satisfaction indexes</p>
        </div>

        <button
          id="reviews-add-trigger"
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Register Feedback</span>
        </button>
      </div>

      {/* 2. RATINGS VALUE SUMMARY PANEL */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        
        {/* Rating average card */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900 flex items-center justify-between">
          <div>
            <span className="text-3xs text-gray-400 uppercase font-bold tracking-wider block">Average Satisfaction Score</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-lg font-extrabold text-gray-950 dark:text-white font-mono">{averageRating}</span>
              <span className="text-xs text-gray-400 font-semibold">/ 5.0</span>
            </div>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(st => (
              <Star key={st} className={`h-4.5 w-4.5 ${st <= Math.round(Number(averageRating)) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 dark:text-zinc-700'}`} />
            ))}
          </div>
        </div>

        {/* Reviews count card */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900 flex items-center justify-between sm:col-span-1 lg:col-span-2">
          <div>
            <span className="text-3xs text-gray-400 uppercase font-bold tracking-wider block">Total Audited Reviews</span>
            <span className="text-lg font-extrabold text-gray-900 dark:text-white mt-1.5 block font-mono">
              {reviews.length} Submissions
            </span>
          </div>
          <div className="h-10 w-10 rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950/20 dark:text-teal-400 flex items-center justify-center">
            <MessageSquare className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* 3. REVIEWS GRID FEED */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3 py-16 border border-dashed rounded-xl text-center text-gray-400 dark:border-zinc-800">
            No satisfaction feedback reviews submitted yet
          </div>
        ) : (
          reviews.map((rev) => (
            <div 
              key={rev.id}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-2xs hover:shadow-xs hover:border-gray-200 transition-all dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  {/* Rating Stars */}
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((st) => (
                      <Star 
                        key={st} 
                        className={`h-3.5 w-3.5 ${st <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-100 dark:text-zinc-800'}`} 
                      />
                    ))}
                  </div>

                  <button
                    id={`review-delete-${rev.id}`}
                    onClick={() => deleteReview(rev.id)}
                    className="text-gray-400 hover:text-rose-500"
                    title="Delete review"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <p className="text-2xs text-gray-600 dark:text-zinc-400 italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-50 dark:border-zinc-800/80">
                <span className="font-bold text-gray-800 dark:text-zinc-200 block truncate leading-snug">
                  {getCustomerName(rev.customerId)}
                </span>
                <span className="text-3xs text-gray-450 dark:text-zinc-500 font-medium truncate block mt-0.5">
                  {getCustomerCompany(rev.customerId)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DIALOG MODAL: ADD REVIEW */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl border border-gray-100 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 animate-scale-up">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3 dark:border-zinc-800">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-zinc-50">Log Client Satisfaction Review</h2>
              <button 
                id="review-modal-close"
                onClick={() => setIsAddOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReview} className="mt-4 space-y-4">
              <div>
                <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Target Client Profile *</label>
                <select
                  id="review-customer-select"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full rounded-lg border border-gray-150 p-2.5 bg-white text-gray-800 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-200"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Star Input Choice */}
              <div>
                <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-2">Operational Score Rating *</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((st) => (
                    <button
                      key={st}
                      type="button"
                      id={`review-rate-btn-${st}`}
                      onClick={() => setRating(st)}
                      className="p-1 hover:scale-115 transition-transform"
                    >
                      <Star 
                        className={`h-7 w-7 ${st <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-250 dark:text-zinc-700'}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Feedback Comments *</label>
                <textarea
                  id="review-comment-textarea"
                  required
                  placeholder="Draft project comments, timeline review, or client recommendations..."
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full rounded-lg border border-gray-150 p-2.5 text-gray-900 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100 focus:outline-hidden"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-50 dark:border-zinc-800 justify-end">
                <button
                  id="review-add-cancel"
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-50 dark:border-zinc-800 dark:text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  id="review-add-submit"
                  type="submit"
                  className="rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700 dark:bg-teal-500"
                >
                  Register Feedback
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default ReviewsView;
