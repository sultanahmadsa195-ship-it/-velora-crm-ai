import React, { useState } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  Bot, 
  Calendar as CalendarIcon, 
  BarChart3, 
  Briefcase, 
  Clock, 
  FileText, 
  CreditCard, 
  FileSignature, 
  Folder, 
  Star, 
  Settings as SettingsIcon,
  User,
  ShieldAlert,
  Menu,
  X,
  LogOut,
  LifeBuoy,
  ChevronUp,
  ChevronDown,
  Loader2,
  Send,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { activeTab, setActiveTab, settings, profile, signOutUser, showToast } = useBusiness();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'ai-assistant', label: 'AI Business Partner', icon: Bot, highlight: true },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'appointments', label: 'Appointments', icon: Clock },
    { id: 'services', label: 'Services Catalog', icon: Briefcase },
    { id: 'quotes', label: 'Quotes & Estimates', icon: FileSignature },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'payments', label: 'Payments & Revenue', icon: CreditCard },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'documents', label: 'Documents Vault', icon: Folder },
    { id: 'reviews', label: 'Customer Reviews', icon: Star },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'settings', label: 'Business Settings', icon: SettingsIcon }
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOutUser();
      setShowSignOutModal(false);
      showToast('Workspace session terminated successfully.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error ending session. Please try again.', 'error');
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-xs lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed bottom-0 top-0 left-0 z-50 flex w-64 flex-col border-r border-gray-100 bg-white pt-16 transition-transform duration-300 lg:static lg:translate-x-0 dark:border-zinc-800 dark:bg-zinc-900
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Business Logo & Name (Shown in Sidebar) */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50 dark:border-zinc-800/50">
          <img 
            src={settings.logo} 
            alt="Business Logo" 
            className="h-8 w-8 rounded-lg object-cover shadow-xs border border-gray-100 dark:border-zinc-800"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col truncate">
            <span className="text-sm font-semibold tracking-tight text-gray-900 dark:text-zinc-50 truncate">
              {settings.businessName}
            </span>
            <span className="text-2xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
              Business Suite
            </span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1 scrollbar-thin">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-item-${item.id}`}
                onClick={() => handleTabClick(item.id)}
                className={`
                  relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all group
                  ${isActive 
                    ? 'text-gray-900 dark:text-zinc-50' 
                    : item.highlight
                      ? 'text-teal-600 hover:bg-teal-50/50 dark:text-teal-400 dark:hover:bg-teal-950/20'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-zinc-400 dark:hover:bg-zinc-850 dark:hover:text-zinc-100'
                  }
                `}
              >
                {/* Active Background Slide Motion */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-bg"
                    className="absolute inset-0 rounded-lg bg-gray-50 dark:bg-zinc-800/80"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                <span className="relative z-10 flex items-center justify-center">
                  <Icon className={`
                    h-4 w-4 transition-transform group-hover:scale-105
                    ${isActive 
                      ? 'text-gray-900 dark:text-zinc-50' 
                      : item.highlight
                        ? 'text-teal-500'
                        : 'text-gray-400 group-hover:text-gray-600 dark:text-zinc-500 dark:group-hover:text-zinc-300'
                    }
                  `} />
                </span>

                <span className="relative z-10 truncate">{item.label}</span>

                {item.highlight && (
                  <span className="relative z-10 ml-auto flex h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Pinned User Account Section */}
        <div className="border-t border-gray-100 bg-gray-50/20 p-3 dark:border-zinc-800/60 dark:bg-zinc-900/20 select-none">
          {/* User Actions Accordion Menu */}
          {userMenuOpen && (
            <div className="mb-2 space-y-0.5 rounded-xl border border-gray-100 bg-white p-1 shadow-2xs dark:border-zinc-800 dark:bg-zinc-850 animate-fade-in">
              <button
                id="user-menu-profile"
                onClick={() => {
                  handleTabClick('profile');
                  setUserMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-3xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-250 transition-colors"
              >
                <User className="h-3.5 w-3.5 text-teal-500" />
                <span>My Profile</span>
              </button>
              
              <button
                id="user-menu-settings"
                onClick={() => {
                  handleTabClick('settings');
                  setUserMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-3xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-250 transition-colors"
              >
                <SettingsIcon className="h-3.5 w-3.5 text-teal-500" />
                <span>Business Settings</span>
              </button>

              <button
                id="user-menu-help"
                onClick={() => {
                  setShowHelpModal(true);
                  setUserMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-3xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-250 transition-colors"
              >
                <LifeBuoy className="h-3.5 w-3.5 text-teal-500" />
                <span>Help & Support</span>
              </button>

              <div className="border-t border-gray-50 my-1 dark:border-zinc-800/50" />

              <button
                id="user-menu-signout"
                onClick={() => {
                  setShowSignOutModal(true);
                  setUserMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-3xs font-extrabold text-rose-600 hover:bg-rose-50/50 dark:text-rose-400 dark:hover:bg-rose-950/20 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}

          {/* User Row Button Toggle */}
          <button
            id="sidebar-user-toggle-btn"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex w-full items-center gap-3 rounded-xl p-2 hover:bg-gray-100/60 dark:hover:bg-zinc-800/60 text-left transition-colors"
          >
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt="User Avatar"
                className="h-8 w-8 rounded-lg object-cover border border-gray-100 dark:border-zinc-800"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="h-8 w-8 rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400 flex items-center justify-center font-bold text-xs border border-teal-100/30 dark:border-teal-900/30">
                {profile.name ? profile.name.charAt(0) : 'U'}
              </div>
            )}

            <div className="flex-1 min-w-0 flex flex-col">
              <span className="text-3xs font-bold text-gray-800 dark:text-zinc-200 truncate">
                {profile.name}
              </span>
              <span className="text-4xs text-gray-400 dark:text-zinc-500 font-medium truncate mt-0.5">
                {profile.role}
              </span>
            </div>

            {userMenuOpen ? (
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 dark:text-zinc-500" />
            ) : (
              <ChevronUp className="h-3.5 w-3.5 text-gray-400 dark:text-zinc-500" />
            )}
          </button>
        </div>
      </aside>

      {/* Help & Support Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-5 shadow-xl dark:border-zinc-900 dark:bg-zinc-900 animate-fade-in">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3 mb-4 dark:border-zinc-850">
              <div className="flex items-center gap-2">
                <LifeBuoy className="h-4 w-4 text-teal-500" />
                <span className="text-3xs font-extrabold text-gray-900 dark:text-zinc-50 font-sans uppercase tracking-wider">Help & Support Desk</span>
              </div>
              <button 
                onClick={() => setShowHelpModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 p-0.5 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 text-3xs text-gray-600 dark:text-zinc-400 overflow-y-auto max-h-[60vh] pr-1">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100/50 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/20">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span className="font-bold uppercase tracking-wider text-4xs">All Systems Operational</span>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 dark:text-zinc-200 uppercase tracking-wider text-4xs mb-2">Helpful FAQs</h4>
                <div className="space-y-2.5">
                  <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-zinc-850 border border-gray-100/40 dark:border-zinc-800/40">
                    <p className="font-bold text-gray-700 dark:text-zinc-300">How do I create and manage quotes?</p>
                    <p className="mt-1 text-gray-500 dark:text-zinc-400 leading-normal">Navigate to the Quotes section. You can register new proposal records and convert accepted offers into active invoices instantly with a single click.</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-zinc-850 border border-gray-100/40 dark:border-zinc-800/40">
                    <p className="font-bold text-gray-700 dark:text-zinc-300">How do I update my profile avatar?</p>
                    <p className="mt-1 text-gray-500 dark:text-zinc-400 leading-normal">Navigate to My Profile, enter a direct URL to any image in the Avatar Image URL field, and click save to apply your brand photo instantly.</p>
                  </div>
                </div>
              </div>

              {/* Support ticket creation form */}
              <div className="border-t border-gray-50 pt-3 dark:border-zinc-850">
                <h4 className="font-bold text-gray-800 dark:text-zinc-200 uppercase tracking-wider text-4xs mb-2">Submit Support Ticket</h4>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    showToast('Support ticket submitted successfully. A specialist will contact you soon.', 'success');
                    setShowHelpModal(false);
                  }}
                  className="space-y-2.5"
                >
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <label className="block text-4xs uppercase tracking-wider font-extrabold text-gray-400 dark:text-zinc-500 mb-1">Category</label>
                      <select 
                        required
                        className="w-full rounded-lg border border-gray-150 p-2 dark:border-zinc-800 dark:bg-zinc-850 text-gray-900 dark:text-zinc-100 focus:outline-hidden text-3xs"
                      >
                        <option>Technical Issue</option>
                        <option>Billing & Invoices</option>
                        <option>Feedback & Suggestions</option>
                        <option>Other Inquiry</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-4xs uppercase tracking-wider font-extrabold text-gray-400 dark:text-zinc-500 mb-1">Severity</label>
                      <select 
                        required
                        className="w-full rounded-lg border border-gray-150 p-2 dark:border-zinc-800 dark:bg-zinc-850 text-gray-900 dark:text-zinc-100 focus:outline-hidden text-3xs"
                      >
                        <option>Low - Question/Tweak</option>
                        <option>Medium - Operations Blocked</option>
                        <option>High - Critical Failure</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-4xs uppercase tracking-wider font-extrabold text-gray-400 dark:text-zinc-500 mb-1">Details</label>
                    <textarea 
                      required
                      placeholder="Specify details regarding your inquiry..."
                      rows={2}
                      className="w-full rounded-lg border border-gray-150 p-2 dark:border-zinc-800 dark:bg-zinc-850 text-gray-900 dark:text-zinc-100 focus:outline-hidden text-3xs resize-none"
                    />
                  </div>
                  <button
                    id="submit-support-ticket-btn"
                    type="submit"
                    className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white p-2 font-bold transition-colors shadow-3xs text-3xs cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Dispatch Ticket</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sign Out Confirmation Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-zinc-900 dark:bg-zinc-900">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 mb-3">
              <ShieldAlert className="h-5 w-5 animate-pulse" />
              <span className="text-xs font-bold font-sans uppercase tracking-wider">Confirm Sign Out</span>
            </div>
            
            <p className="text-3xs text-gray-600 dark:text-zinc-400 leading-relaxed">
              Are you sure you want to terminate your current workspace session? Unsaved progress on active forms may be cleared.
            </p>

            <div className="mt-5 flex gap-2.5">
              <button
                id="signout-cancel-btn"
                disabled={isSigningOut}
                onClick={() => setShowSignOutModal(false)}
                className="flex-1 rounded-lg border border-gray-150 p-2 text-3xs font-bold text-gray-500 hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-850 dark:text-zinc-400 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              
              <button
                id="signout-confirm-btn"
                disabled={isSigningOut}
                onClick={handleSignOut}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white p-2 text-3xs font-bold shadow-3xs transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isSigningOut ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Signing Out...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
