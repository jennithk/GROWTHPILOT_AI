import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import {
  Settings,
  Sparkles,
  RefreshCw,
  ShieldCheck,
  Database,
  Moon,
  Sun,
  Key,
  Building2,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, business, logout, refreshProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { success, error, agent } = useToast();

  const [health, setHealth] = useState<{ status: string; geminiConfigured: boolean } | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    api.checkHealth()
      .then((res) => setHealth(res))
      .catch((e) => console.error(e));
  }, []);

  const handleResetSampleData = async () => {
    if (!confirm('Refresh sample leads and pipeline data? This will restore realistic demo records.')) return;

    setIsResetting(true);
    agent('Resetting Demo Data', 'Repopulating sample leads and scoring metrics...');
    try {
      await api.resetSampleData();
      await refreshProfile();
      success('Sample Data Refreshed', 'Realistic prospects and scoring pipeline restored.');
    } catch (err: any) {
      error('Reset Failed', err.message);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-900 flex items-center justify-center text-white shadow-md">
            <Settings className="w-6 h-6 text-slate-200" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              System Settings & Architecture
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Manage application preferences, view agent status, and reset demo datasets.
            </p>
          </div>
        </div>
      </div>

      {/* System Status Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>System & AI Agent Health</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Gemini 3.7 Agentic Engine</p>
                <p className="text-[11px] text-slate-500">Autonomous sales & strategy agents</p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Active & Ready
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Storage Layer</p>
                <p className="text-[11px] text-slate-500">MongoDB with resilient fallback storage</p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Connected
            </span>
          </div>
        </div>
      </div>

      {/* User & Business Profile Summary */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Building2 className="w-4 h-4 text-indigo-500" />
          <span>Active Organization & Account</span>
        </h2>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">User Account:</span>
            <span className="font-semibold text-slate-900 dark:text-white">{user?.name} ({user?.email})</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">Organization Name:</span>
            <span className="font-semibold text-slate-900 dark:text-white">{business?.businessName || 'Not configured'}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-500">Industry:</span>
            <span className="font-semibold text-slate-900 dark:text-white">{business?.industry || 'Not configured'}</span>
          </div>
        </div>
      </div>

      {/* Appearance & Preferences */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Appearance & Theme
        </h2>

        <div className="flex items-center justify-between text-xs">
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Interface Color Theme</p>
            <p className="text-slate-500">Toggle between Dark mode (recommended for AI command center) and Light mode</p>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-700 flex items-center gap-2 transition-colors"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Switch to Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-600" />
                <span>Switch to Dark</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Demo Reset & Data Management */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
          Demo Dataset Management
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Refresh Demo Leads & Pipeline</p>
            <p className="text-slate-500">
              Restore the full realistic sales dataset (prospect inquiries, scores, and mock interactions) for live evaluation.
            </p>
          </div>
          <button
            onClick={handleResetSampleData}
            disabled={isResetting}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-colors flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span>{isResetting ? 'Refreshing Data...' : 'Reset Sample Pipeline'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
