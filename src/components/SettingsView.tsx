import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { 
  Settings, 
  Building, 
  DollarSign, 
  Percent, 
  HelpCircle, 
  Save, 
  CheckCircle2,
  Sun,
  Moon,
  Laptop
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [config, setConfig] = useState({
    companyName: 'Velora CRM AI',
    supportEmail: 'ops@veloracrm.ai',
    currency: 'USD',
    taxRate: 8,
    sandboxMode: true
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in text-xs max-w-2xl mx-auto">
      
      {/* 1. MODULE CONTROL BAR */}
      <div className="border-b border-gray-100 pb-4 dark:border-zinc-800">
        <h1 className="text-lg font-bold text-gray-900 dark:text-zinc-50 font-sans">CRM Global Settings</h1>
        <p className="text-2xs text-gray-400 dark:text-zinc-500">Configure ledger structures, currency representations, and default tax metrics</p>
      </div>

      {/* 2. CONFIGURATION FORM */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-xs font-bold text-gray-900 dark:text-zinc-50 border-b border-gray-50 pb-3 dark:border-zinc-800 flex items-center gap-1.5">
          <Settings className="h-4 w-4 text-teal-500" />
          <span>General Business Guidelines</span>
        </h3>

        <form onSubmit={handleSaveSettings} className="mt-4 space-y-4">
          
          <div>
            <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Company Legal Name</label>
            <div className="relative">
              <Building className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-zinc-500" />
              <input
                id="settings-company-name"
                type="text"
                required
                value={config.companyName}
                onChange={(e) => setConfig({...config, companyName: e.target.value})}
                className="w-full rounded-lg border border-gray-150 py-2.5 pl-10 pr-3 text-gray-900 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Support Email Address</label>
            <input
              id="settings-support-email"
              type="email"
              required
              value={config.supportEmail}
              onChange={(e) => setConfig({...config, supportEmail: e.target.value})}
              className="w-full rounded-lg border border-gray-150 p-2.5 text-gray-900 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100 focus:outline-hidden"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Ledger Currency Format</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-zinc-500" />
                <select
                  id="settings-currency-select"
                  value={config.currency}
                  onChange={(e) => setConfig({...config, currency: e.target.value})}
                  className="w-full rounded-lg border border-gray-150 py-2.5 pl-10 pr-3 bg-white text-gray-900 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100"
                >
                  <option value="USD">USD ($) United States Dollar</option>
                  <option value="EUR">EUR (€) Euro Standard</option>
                  <option value="GBP">GBP (£) British Sterling</option>
                  <option value="JPY">JPY (¥) Japanese Yen</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Standard Sales Tax Rate (%)</label>
              <div className="relative">
                <Percent className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-zinc-500" />
                <input
                  id="settings-tax-rate"
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={config.taxRate}
                  onChange={(e) => setConfig({...config, taxRate: Number(e.target.value)})}
                  className="w-full rounded-lg border border-gray-150 py-2.5 pl-10 pr-3 text-gray-900 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Visual Theme Selection Panel */}
          <div className="border-t border-gray-100 pt-4 dark:border-zinc-800">
            <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-2.5">
              Workspace Theme Mode
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                id="theme-select-light"
                onClick={() => setTheme('light')}
                className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'border-teal-500 bg-teal-50/10 text-teal-700 dark:border-teal-400 dark:text-teal-400 dark:bg-teal-950/20'
                    : 'border-gray-150 hover:bg-gray-50 text-gray-500 dark:border-zinc-800 dark:hover:bg-zinc-850 dark:text-zinc-400'
                }`}
              >
                <Sun className="h-4 w-4" />
                <span className="font-bold text-4xs uppercase tracking-wider">Light Theme</span>
              </button>

              <button
                type="button"
                id="theme-select-dark"
                onClick={() => setTheme('dark')}
                className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'border-teal-500 bg-teal-50/10 text-teal-700 dark:border-teal-400 dark:text-teal-400 dark:bg-teal-950/20'
                    : 'border-gray-150 hover:bg-gray-50 text-gray-500 dark:border-zinc-800 dark:hover:bg-zinc-850 dark:text-zinc-400'
                }`}
              >
                <Moon className="h-4 w-4" />
                <span className="font-bold text-4xs uppercase tracking-wider">Dark Theme</span>
              </button>

              <button
                type="button"
                id="theme-select-system"
                onClick={() => setTheme('system')}
                className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  theme === 'system'
                    ? 'border-teal-500 bg-teal-50/10 text-teal-700 dark:border-teal-400 dark:text-teal-400 dark:bg-teal-950/20'
                    : 'border-gray-150 hover:bg-gray-50 text-gray-500 dark:border-zinc-800 dark:hover:bg-zinc-850 dark:text-zinc-400'
                }`}
              >
                <Laptop className="h-4 w-4" />
                <span className="font-bold text-4xs uppercase tracking-wider">System Default</span>
              </button>
            </div>
          </div>

          {/* Sandboxed Ledger Toggle */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50/50 border border-gray-50 dark:bg-zinc-850/20 dark:border-zinc-800/60 mt-4">
            <div>
              <span className="font-bold text-gray-800 dark:text-zinc-200 flex items-center gap-1">
                <span>Enable Sandbox Ledger Mode</span>
                <HelpCircle className="h-3.5 w-3.5 text-gray-400" title="Offline persistent mode without active Stripe webhook overhead" />
              </span>
              <p className="text-3xs text-gray-400 dark:text-zinc-500 mt-0.5">Persist application states securely into local workspace cache</p>
            </div>
            <input
              id="settings-sandbox-toggle"
              type="checkbox"
              checked={config.sandboxMode}
              onChange={(e) => setConfig({...config, sandboxMode: e.target.checked})}
              className="h-4 w-4 text-teal-600 focus:ring-teal-500 rounded-sm"
            />
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-zinc-800">
            {saveSuccess ? (
              <span className="text-3xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 animate-pulse">
                <CheckCircle2 className="h-4 w-4" />
                <span>Global settings committed successfully</span>
              </span>
            ) : <span />}

            <button
              id="settings-save-submit"
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700 dark:bg-teal-500 font-semibold shadow-3xs"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Commit Settings</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};
export default SettingsView;
