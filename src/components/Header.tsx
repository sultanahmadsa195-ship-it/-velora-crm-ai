import React, { useState } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { useTheme } from 'next-themes';
import { 
  Search, 
  Bell, 
  Menu, 
  Sparkles, 
  Check, 
  Moon, 
  Sun,
  X,
  Mail,
  Calendar,
  CreditCard,
  MessageSquare
} from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { 
    searchQuery, 
    setSearchQuery, 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead,
    profile, 
    settings, 
    updateSettings,
    setActiveTab,
    activeTab
  } = useBusiness();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  const unreadNotifs = notifications.filter(n => !n.read);

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'payment': return <CreditCard className="h-4 w-4 text-emerald-500" />;
      case 'review': return <MessageSquare className="h-4 w-4 text-amber-500" />;
      default: return <Bell className="h-4 w-4 text-gray-400" />;
    }
  };

  const handleNotifClick = (id: string) => {
    markNotificationRead(id);
    setIsNotifOpen(false);
  };

  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    updateSettings({
      theme: nextTheme
    });
  };

  const getBreadcrumb = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'customers': return 'Customer Directory';
      case 'tasks': return 'Operational Tasks';
      case 'ai-assistant': return 'AI Strategic Assistant';
      case 'calendar': return 'Appointment Calendar';
      case 'services': return 'Services Menu';
      case 'appointments': return 'Schedules & Sessions';
      case 'quotes': return 'Estimates & Proposals';
      case 'invoices': return 'Billing & Invoices';
      case 'payments': return 'Payments Ledger';
      case 'reports': return 'Performance Reports';
      case 'documents': return 'Secure Vault Documents';
      case 'reviews': return 'Client Feedback';
      case 'profile': return 'My User Profile';
      case 'settings': return 'Business Preferences';
      default: return 'Overview';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-100 bg-white px-6 shadow-2xs dark:border-zinc-800/80 dark:bg-zinc-900/90 dark:backdrop-blur-md">
      {/* Menu Trigger & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button 
          id="mobile-sidebar-toggle"
          onClick={onMenuToggle}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-100 hover:bg-gray-50 lg:hidden dark:border-zinc-800 dark:hover:bg-zinc-800"
        >
          <Menu className="h-5 w-5 text-gray-600 dark:text-zinc-300" />
        </button>

        {/* Brand/Breadcrumbs */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-2xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
            {settings.businessName}
          </span>
          <span className="text-gray-300 dark:text-zinc-700 font-light">/</span>
          <span className="text-sm font-semibold text-gray-800 dark:text-zinc-200">
            {getBreadcrumb()}
          </span>
        </div>
      </div>

      {/* Global Live Search */}
      <div className="mx-4 max-w-md flex-1">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400 dark:text-zinc-500" />
          </span>
          <input
            id="global-header-search"
            type="text"
            placeholder="Search documents, customers, tasks, invoices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-150 bg-gray-50/50 py-1.5 pl-9 pr-4 text-sm font-normal text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:bg-white focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700 dark:focus:bg-zinc-900"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Utilities & Profiles */}
      <div className="flex items-center gap-3">
        {/* Sparkles / Quick AI Assistant Trigger */}
        <button 
          id="header-ai-assistant-trigger"
          onClick={() => setActiveTab('ai-assistant')}
          className="hidden md:flex items-center gap-1.5 rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 transition-all hover:bg-teal-100 dark:bg-teal-950/40 dark:text-teal-400 dark:hover:bg-teal-950/70 animate-pulse-slow"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Ask AI</span>
        </button>

        {/* Theme Toggle Button */}
        <button 
          id="header-theme-toggle"
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-100 text-gray-500 hover:bg-gray-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
          title="Toggle Visual Theme"
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button 
            id="header-notifications-bell"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-gray-100 text-gray-500 hover:bg-gray-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <Bell className="h-4 w-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-zinc-900" />
            )}
          </button>

          {isNotifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
              <div className="absolute right-0 mt-2 z-50 w-80 rounded-xl border border-gray-100 bg-white p-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center justify-between border-b border-gray-50 px-3 py-2 pb-2 dark:border-zinc-800">
                  <span className="text-xs font-semibold text-gray-900 dark:text-zinc-50">Notifications</span>
                  {unreadNotifs.length > 0 && (
                    <button 
                      onClick={markAllNotificationsRead}
                      className="text-2xs font-medium text-teal-600 hover:underline dark:text-teal-400"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto pt-1">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-gray-400 dark:text-zinc-500">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <button
                        key={notif.id}
                        onClick={() => handleNotifClick(notif.id)}
                        className={`
                          flex w-full gap-3 rounded-lg p-2.5 text-left transition-all hover:bg-gray-50 dark:hover:bg-zinc-850/50
                          ${!notif.read ? 'bg-gray-50/50 dark:bg-zinc-850/30' : ''}
                        `}
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-zinc-800">
                          {getNotifIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs truncate font-medium text-gray-900 dark:text-zinc-50`}>
                            {notif.title}
                          </p>
                          <p className="text-2xs text-gray-500 dark:text-zinc-400 line-clamp-2 mt-0.5 leading-relaxed">
                            {notif.message}
                          </p>
                          <span className="text-3xs text-gray-400 dark:text-zinc-500 mt-1 block">
                            {new Date(notif.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {!notif.read && (
                          <div className="h-2 w-2 rounded-full bg-teal-500 self-center shrink-0" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Avatar Quick-link */}
        <button 
          id="header-profile-quick-link"
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-2 rounded-lg border border-gray-100 p-1 pl-1 pr-2.5 hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-800"
        >
          <img
            src={profile.avatar}
            alt="User Avatar"
            className="h-7 w-7 rounded-md object-cover border border-gray-100 dark:border-zinc-800"
            referrerPolicy="no-referrer"
          />
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-gray-800 dark:text-zinc-200 leading-tight">
              {profile.name}
            </span>
            <span className="text-3xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-widest leading-none mt-0.5">
              Admin
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};
export default Header;
