import React, { useState } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  User,
  X,
  MapPin,
  AlertCircle
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { appointments, services, customers, bookAppointment } = useBusiness();
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  
  // Date states
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 5)); // July 5, 2026 (matching our mock timeline!)

  // Book appointment states
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [newBooking, setNewBooking] = useState({
    customerId: customers[0]?.id || '',
    serviceId: services[0]?.id || '',
    start: '2026-07-06T10:00',
    end: '2026-07-06T11:30',
    notes: ''
  });

  const getCustomerName = (id: string) => {
    return customers.find(c => c.id === id)?.name || 'Client';
  };

  const getServiceName = (id: string) => {
    return services.find(s => s.id === id)?.name || 'Service Appointment';
  };

  const handlePrev = () => {
    if (viewMode === 'month') {
      setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(prev => new Date(prev.setDate(prev.getDate() - 7)));
    } else {
      setCurrentDate(prev => new Date(prev.setDate(prev.getDate() - 1)));
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(prev => new Date(prev.setDate(prev.getDate() + 7)));
    } else {
      setCurrentDate(prev => new Date(prev.setDate(prev.getDate() + 1)));
    }
  };

  // GENERATE MONTH CELLS
  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Day 1 of the month
    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay(); // 0 is Sunday, 1 is Monday...
    
    // Total days in current month
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    // Total days in previous month
    const prevTotalDays = new Date(year, month, 0).getDate();

    const cells: { date: Date; isCurrentMonth: boolean }[] = [];

    // Fill previous month padding
    for (let i = startOffset - 1; i >= 0; i--) {
      cells.push({
        date: new Date(year, month - 1, prevTotalDays - i),
        isCurrentMonth: false
      });
    }

    // Fill current month days
    for (let i = 1; i <= totalDays; i++) {
      cells.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }

    // Fill next month padding to make a perfect grid of 35 or 42 days
    const totalCells = cells.length > 35 ? 42 : 35;
    const nextPadding = totalCells - cells.length;
    for (let i = 1; i <= nextPadding; i++) {
      cells.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }

    return cells;
  };

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(appt => {
      const apptDate = new Date(appt.start);
      return apptDate.getFullYear() === date.getFullYear() &&
             apptDate.getMonth() === date.getMonth() &&
             apptDate.getDate() === date.getDate();
    });
  };

  const handleScheduleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    bookAppointment({
      customerId: newBooking.customerId,
      serviceId: newBooking.serviceId,
      start: new Date(newBooking.start).toISOString(),
      end: new Date(newBooking.end).toISOString(),
      notes: newBooking.notes,
      status: 'scheduled'
    });
    setIsBookOpen(false);
    setNewBooking({
      customerId: customers[0]?.id || '',
      serviceId: services[0]?.id || '',
      start: '2026-07-06T10:00',
      end: '2026-07-06T11:30',
      notes: ''
    });
  };

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="p-6 space-y-6 animate-fade-in text-xs">
      
      {/* 1. MODULE HEADER CONTROLLER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 dark:border-zinc-800">
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-zinc-50">Schedules & Calendar</h1>
          <p className="text-2xs text-gray-400 dark:text-zinc-500">Coordinate briefs, alignment milestones, and consultation retainers</p>
        </div>

        {/* Calendar View Toggle tabs */}
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg bg-gray-100 p-1 dark:bg-zinc-900">
            {(['month', 'week', 'day'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded-md text-3xs font-semibold capitalize tracking-wider transition-all ${
                  viewMode === mode 
                    ? 'bg-white text-gray-900 shadow-2xs dark:bg-zinc-800 dark:text-white' 
                    : 'text-gray-500 hover:text-gray-900 dark:text-zinc-400'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            id="calendar-book-trigger"
            onClick={() => setIsBookOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
          >
            <Plus className="h-4 w-4" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* 2. CALENDAR NAVIGATOR CONTROL */}
      <div className="flex items-center justify-between bg-white p-4 border rounded-xl border-gray-100 dark:bg-zinc-900 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <button 
            id="calendar-prev-button"
            onClick={handlePrev}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-800"
          >
            <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-zinc-400" />
          </button>
          <button 
            id="calendar-next-button"
            onClick={handleNext}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-800"
          >
            <ChevronRight className="h-4 w-4 text-gray-600 dark:text-zinc-400" />
          </button>
          <span className="text-sm font-bold text-gray-800 dark:text-zinc-200 ml-2">
            {currentDate.toLocaleDateString([], { month: 'long', year: 'numeric' })}
          </span>
        </div>

        <span className="text-3xs font-mono uppercase tracking-widest text-teal-600 dark:text-teal-400 font-bold">
          UTC TIMELINE
        </span>
      </div>

      {/* 3. CALENDAR CONTENT VIEWER */}
      {viewMode === 'month' && (
        <div className="rounded-xl border border-gray-100 bg-white shadow-3xs overflow-hidden dark:border-zinc-800 dark:bg-zinc-900">
          
          {/* Days list header */}
          <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50 text-center py-2 dark:border-zinc-800 dark:bg-zinc-850">
            {daysOfWeek.map(d => (
              <span key={d} className="text-2xs font-bold text-gray-500 dark:text-zinc-400">{d}</span>
            ))}
          </div>

          {/* Grid of days cells */}
          <div className="grid grid-cols-7 divide-x divide-y divide-gray-100 dark:divide-zinc-800 border-l border-t border-transparent">
            {getMonthDays().map((cell, idx) => {
              const dayAppts = getAppointmentsForDate(cell.date);
              const isToday = cell.date.getDate() === 5 && cell.date.getMonth() === 6 && cell.date.getFullYear() === 2026; // Simulated Today: July 5, 2026

              return (
                <div 
                  key={idx}
                  className={`
                    min-h-[100px] p-2 flex flex-col justify-between transition-colors
                    ${cell.isCurrentMonth ? 'bg-white dark:bg-zinc-900' : 'bg-gray-50/40 dark:bg-zinc-950/20 text-gray-400'}
                    ${isToday ? 'bg-teal-50/20 dark:bg-teal-950/10' : ''}
                  `}
                >
                  <div className="flex justify-between items-center">
                    <span className={`
                      h-6 w-6 flex items-center justify-center rounded-full font-bold
                      ${isToday ? 'bg-teal-600 text-white shadow-3xs' : 'text-gray-700 dark:text-zinc-400'}
                    `}>
                      {cell.date.getDate()}
                    </span>
                  </div>

                  {/* Appointments indicators inside cell */}
                  <div className="mt-2 space-y-1.5 flex-1 overflow-y-auto max-h-[70px] scrollbar-none">
                    {dayAppts.map(appt => (
                      <div 
                        key={appt.id}
                        className={`
                          px-1.5 py-1 rounded-md text-4xs font-semibold border truncate
                          ${appt.status === 'completed'
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400'
                            : 'bg-teal-50 border-teal-100 text-teal-700 dark:bg-teal-950/20 dark:border-teal-900/30 dark:text-teal-400'
                          }
                        `}
                        title={`${getServiceName(appt.serviceId)} - ${getCustomerName(appt.customerId)}`}
                      >
                        {new Date(appt.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} • {getCustomerName(appt.customerId)}
                      </div>
                    ))}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {viewMode === 'week' && (
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-3xs text-center text-gray-400 dark:border-zinc-800 dark:bg-zinc-900">
          <CalendarIcon className="h-8 w-8 mx-auto text-gray-300 dark:text-zinc-700 mb-2" />
          <p className="text-xs">Weekly list view optimized for operational planners.</p>
          <div className="mt-4 space-y-2 text-left max-w-xl mx-auto">
            {appointments.map((appt) => (
              <div key={appt.id} className="p-3 border rounded-lg flex items-center justify-between dark:border-zinc-800 dark:bg-zinc-850/40">
                <div>
                  <span className="text-3xs font-mono font-bold text-teal-600 dark:text-teal-400">
                    {new Date(appt.start).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                  <h4 className="text-xs font-bold text-gray-800 dark:text-zinc-200 mt-1">{getServiceName(appt.serviceId)}</h4>
                  <p className="text-2xs text-gray-500 dark:text-zinc-400">{getCustomerName(appt.customerId)}</p>
                </div>
                <span className="text-2xs font-semibold text-gray-600 dark:text-zinc-400 bg-gray-50 px-2 py-1 rounded-md dark:bg-zinc-800">
                  {new Date(appt.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewMode === 'day' && (
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-3xs dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 dark:text-zinc-500">
            Agenda for {currentDate.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
          </h3>
          <div className="divide-y divide-gray-100 dark:divide-zinc-800">
            {getAppointmentsForDate(currentDate).length === 0 ? (
              <div className="py-12 text-center text-gray-400 dark:text-zinc-500">
                No appointments booked on this day.
              </div>
            ) : (
              getAppointmentsForDate(currentDate).map(appt => (
                <div key={appt.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400 flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-zinc-50">{getServiceName(appt.serviceId)}</h4>
                      <p className="text-2xs text-gray-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5">
                        <User className="h-3 w-3" />
                        <span>{getCustomerName(appt.customerId)}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xs font-mono bg-gray-100 px-2 py-1 rounded-md text-gray-600 dark:bg-zinc-800 dark:text-zinc-300">
                      {new Date(appt.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(appt.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-3xs font-semibold uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 px-1.5 py-0.5 rounded-xs dark:bg-emerald-950/20">
                      {appt.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* DIALOG MODAL: BOOK APPOINTMENT */}
      {isBookOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl border border-gray-100 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 animate-scale-up">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3 dark:border-zinc-800">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-zinc-50">Schedule Consultation Appointment</h2>
              <button 
                id="booking-modal-close"
                onClick={() => setIsBookOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleBooking} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Target Client Profile *</label>
                <select
                  id="booking-customer-select"
                  value={newBooking.customerId}
                  onChange={(e) => setNewBooking({...newBooking, customerId: e.target.value})}
                  className="w-full rounded-lg border border-gray-150 p-2.5 bg-white text-gray-800 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-200"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.company || 'Private Client'})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Service to Deliver *</label>
                <select
                  id="booking-service-select"
                  value={newBooking.serviceId}
                  onChange={(e) => setNewBooking({...newBooking, serviceId: e.target.value})}
                  className="w-full rounded-lg border border-gray-150 p-2.5 bg-white text-gray-800 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-200"
                >
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.name} - ${s.price}</option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Start Time *</label>
                  <input
                    id="booking-start-input"
                    type="datetime-local"
                    required
                    value={newBooking.start}
                    onChange={(e) => setNewBooking({...newBooking, start: e.target.value})}
                    className="w-full rounded-lg border border-gray-150 p-2.5 text-gray-900 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">End Time *</label>
                  <input
                    id="booking-end-input"
                    type="datetime-local"
                    required
                    value={newBooking.end}
                    onChange={(e) => setNewBooking({...newBooking, end: e.target.value})}
                    className="w-full rounded-lg border border-gray-150 p-2.5 text-gray-900 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Internal Notes & Meeting Objectives</label>
                <textarea
                  id="booking-notes-textarea"
                  placeholder="Include meeting links, pre-meeting checklists, or client targets..."
                  rows={3}
                  value={newBooking.notes}
                  onChange={(e) => setNewBooking({...newBooking, notes: e.target.value})}
                  className="w-full rounded-lg border border-gray-150 p-2.5 text-gray-900 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100 focus:outline-hidden"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-50 dark:border-zinc-800 justify-end">
                <button
                  id="booking-add-cancel"
                  type="button"
                  onClick={() => setIsBookOpen(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  id="booking-add-submit"
                  type="submit"
                  className="rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
                >
                  Book Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default CalendarView;
