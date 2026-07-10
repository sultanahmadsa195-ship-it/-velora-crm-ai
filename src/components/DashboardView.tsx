import React from 'react';
import { useBusiness } from '../context/BusinessContext';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  CheckSquare, 
  Calendar, 
  Clock, 
  Plus, 
  ArrowUpRight,
  TrendingDown,
  DollarSign
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { motion } from 'motion/react';

export const DashboardView: React.FC = () => {
  const { 
    customers, 
    tasks, 
    appointments, 
    invoices, 
    customerHistory, 
    services,
    updateTask,
    setActiveTab
  } = useBusiness();

  // 1. CALCULATE CORE METRICS
  const totalRevenue = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);

  const pendingInvoicesSum = invoices
    .filter(inv => inv.status === 'sent')
    .reduce((sum, inv) => sum + inv.total, 0);

  const activeCustomersCount = customers.filter(c => c.status === 'active').length;
  const pendingTasksCount = tasks.filter(t => t.status !== 'completed').length;
  
  // 2. BUILD CHART DATA (Synthesized Monthly Gross)
  const chartData = [
    { month: 'Jan', revenue: 4200, projects: 3 },
    { month: 'Feb', revenue: 5800, projects: 5 },
    { month: 'Mar', revenue: 5100, projects: 4 },
    { month: 'Apr', revenue: 7600, projects: 6 },
    { month: 'May', revenue: 9800, projects: 8 },
    { month: 'Jun', revenue: 14400, projects: 11 },
    { month: 'Jul', revenue: totalRevenue > 0 ? totalRevenue : 15800, projects: 12 }
  ];

  // 3. FETCH RECENT ACTIVITIES (Last 5 actions)
  const recentActivities = [...customerHistory]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // 4. GET TODAY'S OR UPCOMING APPOINTMENTS
  const upcomingAppointments = [...appointments]
    .filter(appt => appt.status === 'scheduled')
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 3);

  // 5. GET INCOMPLETE TASKS
  const priorityTasks = [...tasks]
    .filter(t => t.status !== 'completed')
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    })
    .slice(0, 4);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getCustomerName = (id: string) => {
    return customers.find(c => c.id === id)?.name || 'Client';
  };

  const getServiceName = (id: string) => {
    return services.find(s => s.id === id)?.name || 'Service Appointment';
  };

  const toggleTaskStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'todo' : 'completed';
    updateTask(id, { status: newStatus });
  };

  return (
    <div className="space-y-6 animate-fade-in p-6">
      
      {/* 1. TOP STATS CARDS GRID */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Gross Revenue */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="rounded-xl border border-gray-100 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
              Gross Revenue
            </span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-zinc-50">
              {formatCurrency(totalRevenue)}
            </span>
            <span className="flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="mr-0.5 h-3 w-3" />
              +14%
            </span>
          </div>
          <p className="mt-1 text-3xs text-gray-400 dark:text-zinc-500">
            Total historical payments collected
          </p>
        </motion.div>

        {/* Active Customers */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-xl border border-gray-100 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
              Active Clients
            </span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-zinc-50">
              {activeCustomersCount}
            </span>
            <span className="flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="mr-0.5 h-3 w-3" />
              +5%
            </span>
          </div>
          <p className="mt-1 text-3xs text-gray-400 dark:text-zinc-500">
            Current clients under active retainer
          </p>
        </motion.div>

        {/* Outstanding Receivables */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="rounded-xl border border-gray-100 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
              Pending Billings
            </span>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-zinc-50">
              {formatCurrency(pendingInvoicesSum)}
            </span>
            <span className="flex items-center text-xs font-semibold text-amber-600 dark:text-amber-400">
              <Clock className="mr-0.5 h-3 w-3" />
              Pending
            </span>
          </div>
          <p className="mt-1 text-3xs text-gray-400 dark:text-zinc-500">
            Accounts receivable currently sent
          </p>
        </motion.div>

        {/* Pending Tasks */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="rounded-xl border border-gray-100 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
              Active Tasks
            </span>
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <CheckSquare className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-zinc-50">
              {pendingTasksCount}
            </span>
            <span className="flex items-center text-xs font-semibold text-rose-500 dark:text-rose-400">
              <TrendingDown className="mr-0.5 h-3 w-3" />
              -2
            </span>
          </div>
          <p className="mt-1 text-3xs text-gray-400 dark:text-zinc-500">
            Open wireframe and deliverable tasks
          </p>
        </motion.div>
      </div>

      {/* 2. AREA GRAPH PERFORMANCE VISUALIZER */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Area Graph Chart */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-2xs lg:col-span-2 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-50">
                Revenue & Delivery Timeline
              </h3>
              <p className="text-2xs text-gray-400 dark:text-zinc-500">
                Performance tracking of booked services and billings
              </p>
            </div>
            <button 
              onClick={() => setActiveTab('reports')}
              className="flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
            >
              <span>View Reports</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-6 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" className="hidden dark:block" />
                <XAxis 
                  dataKey="month" 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => `$${val}`}
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: 'none', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '11px',
                    backgroundColor: '#1e293b',
                    color: '#fff'
                  }} 
                  formatter={(val: any) => [`$${val}`, 'Gross Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#14b8a6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Appointments Widgets */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-gray-50 pb-3 dark:border-zinc-800/80">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-50">
                Scheduled Appointments
              </h3>
              <p className="text-2xs text-gray-400 dark:text-zinc-500">
                Your direct briefing agenda for the week
              </p>
            </div>
            <button 
              onClick={() => setActiveTab('appointments')}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              title="Schedule Appointment"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {upcomingAppointments.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-400 dark:text-zinc-500">
                No scheduled appointments this week
              </div>
            ) : (
              upcomingAppointments.map((appt) => (
                <div 
                  key={appt.id}
                  className="group flex gap-3 rounded-lg border border-gray-50 p-3 transition-all hover:bg-gray-50 dark:border-zinc-800/40 dark:hover:bg-zinc-850"
                >
                  <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400">
                    <span className="text-2xs font-bold leading-none">
                      {new Date(appt.start).getDate()}
                    </span>
                    <span className="text-3xs font-medium uppercase leading-none mt-0.5">
                      {new Date(appt.start).toLocaleDateString([], { month: 'short' })}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-semibold text-gray-800 dark:text-zinc-200 truncate">
                      {getServiceName(appt.serviceId)}
                    </h4>
                    <p className="text-2xs text-gray-500 dark:text-zinc-400 truncate mt-0.5">
                      {getCustomerName(appt.customerId)}
                    </p>
                    <span className="text-3xs text-gray-400 dark:text-zinc-500 flex items-center gap-1 mt-1 font-mono">
                      <Clock className="h-2.5 w-2.5" />
                      {new Date(appt.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 3. TASK SYNC & RECENT ACTIVITY TIMELINE */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Task Checklist Panel */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-gray-50 pb-3 dark:border-zinc-800/80">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-50">
                Operational Task Queue
              </h3>
              <p className="text-2xs text-gray-400 dark:text-zinc-500">
                Quick completion toggle from your dashboard
              </p>
            </div>
            <button 
              onClick={() => setActiveTab('tasks')}
              className="text-2xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
            >
              Manage Tasks
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {priorityTasks.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-400 dark:text-zinc-500">
                All tasks are cleared!
              </div>
            ) : (
              priorityTasks.map((task) => (
                <div 
                  key={task.id}
                  className="flex items-center gap-3 rounded-lg border border-gray-50 p-3 dark:border-zinc-800/40"
                >
                  <input
                    id={`dashboard-task-checkbox-${task.id}`}
                    type="checkbox"
                    checked={task.status === 'completed'}
                    onChange={() => toggleTaskStatus(task.id, task.status)}
                    className="h-4 w-4 rounded-sm border-gray-300 text-teal-600 focus:ring-teal-500 dark:border-zinc-700 dark:bg-zinc-800"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold text-gray-800 dark:text-zinc-200 truncate ${task.status === 'completed' ? 'line-through text-gray-400 dark:text-zinc-500' : ''}`}>
                      {task.title}
                    </p>
                    <span className="text-3xs text-gray-400 dark:text-zinc-500 flex items-center gap-1.5 mt-1 font-mono">
                      <span>Due: {task.dueDate}</span>
                      <span>•</span>
                      <span className={`
                        capitalize font-bold px-1 rounded-xs
                        ${task.priority === 'high' ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/20' : ''}
                        ${task.priority === 'medium' ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' : ''}
                        ${task.priority === 'low' ? 'text-gray-400 bg-gray-50 dark:bg-zinc-800/50' : ''}
                      `}>
                        {task.priority}
                      </span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Dynamic Activity Timeline */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-gray-50 pb-3 dark:border-zinc-800/80">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-50">
                Recent CRM Activity
              </h3>
              <p className="text-2xs text-gray-400 dark:text-zinc-500">
                Operational records and communications logs
              </p>
            </div>
            <span className="text-3xs font-mono text-gray-400 dark:text-zinc-500">
              REAL-TIME SYNC
            </span>
          </div>

          <div className="mt-5 relative border-l border-gray-100 pl-4 space-y-5 ml-1.5 dark:border-zinc-800">
            {recentActivities.map((act) => (
              <div key={act.id} className="relative">
                {/* Visual Timeline Marker Node */}
                <span className="absolute -left-[21px] top-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-white ring-2 ring-teal-500 dark:bg-zinc-900" />
                
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-2xs font-semibold text-gray-800 dark:text-zinc-300">
                      {act.description}
                    </span>
                    <p className="text-3xs text-gray-400 dark:text-zinc-500 mt-0.5">
                      Client: {getCustomerName(act.customerId)}
                    </p>
                  </div>
                  <span className="text-3xs font-mono text-gray-400 dark:text-zinc-500 whitespace-nowrap pl-2">
                    {new Date(act.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                {act.amount !== undefined && (
                  <span className="text-3xs font-mono font-bold text-teal-600 dark:text-teal-400 mt-1 block">
                    Amount: {formatCurrency(act.amount)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
export default DashboardView;
