import React, { useState } from 'react';
import { BusinessProvider, useBusiness } from './context/BusinessContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { CustomersView } from './components/CustomersView';
import { TasksView } from './components/TasksView';
import { AiAssistantView } from './components/AiAssistantView';
import { CalendarView } from './components/CalendarView';
import { InvoicesView } from './components/InvoicesView';
import { QuotesView } from './components/QuotesView';
import { PaymentsView } from './components/PaymentsView';
import { ReportsView } from './components/ReportsView';
import { ServicesView } from './components/ServicesView';
import { DocumentsView } from './components/DocumentsView';
import { ReviewsView } from './components/ReviewsView';
import { ProfileView } from './components/ProfileView';
import { SettingsView } from './components/SettingsView';
import { LoginView } from './components/LoginView';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { ThemeProvider } from 'next-themes';

const NextThemeProvider = ThemeProvider as any;

const AppContent: React.FC = () => {
  const { activeTab, isAuthenticated, toast, hideToast, loading } = useBusiness();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
          <p className="font-mono text-xs text-gray-500 dark:text-zinc-400">Syncing secure connection...</p>
        </div>
      </div>
    );
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'customers':
        return <CustomersView />;
      case 'tasks':
        return <TasksView />;
      case 'ai-assistant':
        return <AiAssistantView />;
      case 'calendar':
        return <CalendarView />;
      case 'invoices':
        return <InvoicesView />;
      case 'quotes':
        return <QuotesView />;
      case 'payments':
        return <PaymentsView />;
      case 'reports':
        return <ReportsView />;
      case 'services':
        return <ServicesView />;
      case 'documents':
        return <DocumentsView />;
      case 'reviews':
        return <ReviewsView />;
      case 'profile':
        return <ProfileView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <LoginView />
        {/* Toast Notifications when in login view */}
        {toast && toast.show && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-lg dark:border-zinc-850 dark:bg-zinc-900 backdrop-blur-md animate-fade-in">
            {toast.type === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
            {toast.type === 'error' && <AlertCircle className="h-4 w-4 text-rose-500" />}
            {toast.type === 'info' && <Info className="h-4 w-4 text-teal-500" />}
            
            <p className="text-3xs font-semibold text-gray-700 dark:text-zinc-300 font-mono">
              {toast.message}
            </p>
            <button 
              onClick={hideToast}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 p-0.5 ml-1 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 text-gray-900 dark:bg-zinc-950 dark:text-zinc-100">
      
      {/* 1. SIDEBAR NAVIGATION */}
      <Sidebar 
        isOpen={mobileMenuOpen} 
        setIsOpen={setMobileMenuOpen} 
      />

      {/* 2. MAIN WORKSPACE CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* GLOBAL HEADER */}
        <Header onMenuToggle={() => setMobileMenuOpen(true)} />

        {/* COMPONENT BODY */}
        <main className="flex-1 overflow-hidden relative">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Toast Notifications */}
      {toast && toast.show && (
        <div className="fixed bottom-5 right-5 z-100 flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-lg dark:border-zinc-850 dark:bg-zinc-900 backdrop-blur-md animate-fade-in">
          {toast.type === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
          {toast.type === 'error' && <AlertCircle className="h-4 w-4 text-rose-500" />}
          {toast.type === 'info' && <Info className="h-4 w-4 text-teal-500" />}
          
          <p className="text-3xs font-semibold text-gray-700 dark:text-zinc-300 font-mono">
            {toast.message}
          </p>
          <button 
            onClick={hideToast}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 p-0.5 ml-1 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

    </div>
  );
};

export default function App() {
  return (
    <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BusinessProvider>
        <AppContent />
      </BusinessProvider>
    </NextThemeProvider>
  );
}
