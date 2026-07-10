import React, { useState } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { 
  Plus, 
  Trash2, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Calendar,
  X,
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';

export const TasksView: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask } = useBusiness();
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  // New task form fields
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    status: 'todo' as 'todo' | 'in_progress' | 'completed',
    dueDate: ''
  });

  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  // Columns definition for Linear-like Kanban Layout
  const columns = [
    { id: 'todo', title: 'To Do', color: 'border-t-gray-300 dark:border-t-zinc-700' },
    { id: 'in_progress', title: 'In Progress', color: 'border-t-blue-400 dark:border-t-blue-500' },
    { id: 'completed', title: 'Completed', color: 'border-t-emerald-400 dark:border-t-emerald-500' }
  ];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;

    addTask({
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      status: newTask.status,
      dueDate: newTask.dueDate || new Date().toISOString().split('T')[0]
    });

    setIsAddOpen(false);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      status: 'todo',
      dueDate: ''
    });
  };

  const handleMoveStatus = (id: string, currentStatus: 'todo' | 'in_progress' | 'completed') => {
    let nextStatus: 'todo' | 'in_progress' | 'completed' = 'todo';
    if (currentStatus === 'todo') nextStatus = 'in_progress';
    else if (currentStatus === 'in_progress') nextStatus = 'completed';
    else if (currentStatus === 'completed') nextStatus = 'todo';

    updateTask(id, { status: nextStatus });
  };

  const getFilteredTasksByColumn = (columnId: string) => {
    return tasks.filter(t => {
      const matchesColumn = t.status === columnId;
      const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;
      return matchesColumn && matchesPriority;
    });
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      
      {/* 1. MODULE CONTROL BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 dark:border-zinc-800">
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-zinc-50">Operational Deliverables</h1>
          <p className="text-2xs text-gray-400 dark:text-zinc-500">Track milestones, campaigns, and team action items</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Priority filter */}
          <div className="flex items-center gap-1 text-xs">
            <SlidersHorizontal className="h-3.5 w-3.5 text-gray-400" />
            <select
              id="task-priority-filter"
              value={filterPriority}
              onChange={(e: any) => setFilterPriority(e.target.value)}
              className="rounded-lg border border-gray-150 p-1.5 bg-white text-gray-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            >
              <option value="all">All Priorities</option>
              <option value="high">🔥 High Only</option>
              <option value="medium">⚡ Medium Only</option>
              <option value="low">🌱 Low Only</option>
            </select>
          </div>

          <button
            id="task-add-trigger"
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
          >
            <Plus className="h-4 w-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* 2. KANBAN GRID COLUMNS */}
      <div className="grid gap-6 md:grid-cols-3">
        {columns.map((col) => (
          <div 
            key={col.id} 
            className="flex flex-col rounded-xl bg-gray-50/50 p-4 border border-gray-100/40 dark:bg-zinc-900/40 dark:border-zinc-800/20"
          >
            {/* Column Header */}
            <div className={`flex items-center justify-between border-t-2 ${col.color} pt-2 pb-3`}>
              <span className="text-xs font-bold text-gray-700 dark:text-zinc-300 flex items-center gap-2">
                {col.id === 'completed' ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : col.id === 'in_progress' ? (
                  <Clock className="h-4 w-4 text-blue-500" />
                ) : (
                  <Circle className="h-4 w-4 text-gray-400" />
                )}
                <span>{col.title}</span>
              </span>
              <span className="rounded-full bg-gray-200/80 px-2 py-0.5 text-3xs font-mono font-bold text-gray-600 dark:bg-zinc-800 dark:text-zinc-400">
                {getFilteredTasksByColumn(col.id).length}
              </span>
            </div>

            {/* Column Body / Tasks list */}
            <div className="flex-1 space-y-3 min-h-[350px]">
              {getFilteredTasksByColumn(col.id).map((task) => (
                <motion.div
                  layout
                  key={task.id}
                  id={`task-kanban-card-${task.id}`}
                  className="rounded-xl border border-gray-100 bg-white p-4 shadow-2xs hover:shadow-xs hover:border-gray-200 transition-all group dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex items-start justify-between">
                    <span className={`
                      text-4xs uppercase tracking-widest px-1.5 py-0.5 rounded-sm font-bold
                      ${task.priority === 'high' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400' : ''}
                      ${task.priority === 'medium' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400' : ''}
                      ${task.priority === 'low' ? 'bg-gray-50 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400' : ''}
                    `}>
                      {task.priority} Priority
                    </span>

                    <button
                      id={`task-delete-btn-${task.id}`}
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-rose-500 transition-opacity"
                      title="Delete task"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <h3 className="text-xs font-bold text-gray-800 dark:text-zinc-200 mt-2">
                    {task.title}
                  </h3>
                  
                  {task.description && (
                    <p className="text-2xs text-gray-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed font-normal">
                      {task.description}
                    </p>
                  )}

                  <div className="mt-4 pt-3 border-t border-gray-50 dark:border-zinc-800/60 flex items-center justify-between text-3xs text-gray-400 dark:text-zinc-500">
                    <span className="flex items-center gap-1 font-mono font-medium">
                      <Calendar className="h-3 w-3" />
                      <span>{task.dueDate}</span>
                    </span>

                    {/* Change Status Fast Trigger */}
                    <button
                      id={`task-move-status-${task.id}`}
                      onClick={() => handleMoveStatus(task.id, task.status)}
                      className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-zinc-300 font-semibold"
                    >
                      <span>Advance</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </motion.div>
              ))}

              {getFilteredTasksByColumn(col.id).length === 0 && (
                <div className="h-32 border border-dashed rounded-xl border-gray-200/60 flex items-center justify-center text-center text-3xs text-gray-400 dark:border-zinc-800/40">
                  No deliverables
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* DIALOG MODAL: ADD TASK */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl border border-gray-100 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 animate-scale-up">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3 dark:border-zinc-800">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-zinc-50">Create Operational Task</h2>
              <button 
                id="task-modal-close"
                onClick={() => setIsAddOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Deliverable Title *</label>
                <input
                  id="task-add-title-input"
                  type="text"
                  required
                  placeholder="e.g. Design homepage vector assets"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full rounded-lg border border-gray-150 p-2.5 text-gray-900 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Scope Description</label>
                <textarea
                  id="task-add-desc-textarea"
                  placeholder="Draft specifications, client preferences, or sub-tasks..."
                  rows={3}
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="w-full rounded-lg border border-gray-150 p-2.5 text-gray-900 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100 focus:outline-hidden"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Task Status</label>
                  <select
                    id="task-add-status-select"
                    value={newTask.status}
                    onChange={(e: any) => setNewTask({...newTask, status: e.target.value})}
                    className="w-full rounded-lg border border-gray-150 p-2.5 bg-white text-gray-900 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Priority Weight</label>
                  <select
                    id="task-add-priority-select"
                    value={newTask.priority}
                    onChange={(e: any) => setNewTask({...newTask, priority: e.target.value})}
                    className="w-full rounded-lg border border-gray-150 p-2.5 bg-white text-gray-900 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Due Date</label>
                <input
                  id="task-add-date-input"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  className="w-full rounded-lg border border-gray-150 p-2.5 text-gray-900 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100 focus:outline-hidden"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-50 dark:border-zinc-800 justify-end">
                <button
                  id="task-add-cancel"
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  id="task-add-submit"
                  type="submit"
                  className="rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default TasksView;
