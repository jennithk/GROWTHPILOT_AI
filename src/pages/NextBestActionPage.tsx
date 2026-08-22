import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { Lead, NextBestActionData } from '../types';
import {
  Zap,
  Sparkles,
  Users,
  Target,
  Clock,
  ArrowRight,
  Copy,
  Check,
  RefreshCw,
  Send,
  CheckCircle2,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';

export const NextBestActionPage: React.FC = () => {
  const { business } = useAuth();
  const { success, error, agent } = useToast();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  const [actionData, setActionData] = useState<NextBestActionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const list = await api.getLeads();
        setLeads(list);
        if (list.length > 0) {
          // Select first hot lead or first lead
          const hot = list.find((l) => l.aiCategory === 'Hot' || (l.aiScore && l.aiScore >= 80));
          const initialId = hot ? hot.id : list[0].id;
          setSelectedLeadId(initialId);
          generateAction(initialId);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchLeads();
  }, []);

  const generateAction = async (leadId?: string) => {
    const targetId = leadId || selectedLeadId;
    if (!targetId) return;

    setIsLoading(true);
    const targetLead = leads.find((l) => l.id === targetId);
    agent('Evaluating Next Best Action', `Computing optimal conversion strategy for ${targetLead?.name || 'Prospect'}...`);

    try {
      const result = await api.getNextBestAction(targetId);
      setActionData(result);
      success('Recommendation Ready', `AI computed next best action for ${result.leadName}`);
    } catch (err: any) {
      error('Action Calculation Error', err.message || 'Failed to calculate next best action');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (actionData?.suggestedMessage) {
      navigator.clipboard.writeText(actionData.suggestedMessage);
      setCopied(true);
      success('Message Copied', 'Suggested follow-up ready to paste');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-amber-500/25">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                AI Next Best Action Engine
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                Agentic Prescriptions
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Evaluates buyer stage, urgency signals, and interaction context to compute the single highest-probability next step.
            </p>
          </div>
        </div>

        {/* Lead Selector Dropdown & Refresh Button */}
        <div className="flex items-center gap-2.5">
          <select
            value={selectedLeadId}
            onChange={(e) => {
              setSelectedLeadId(e.target.value);
              generateAction(e.target.value);
            }}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {leads.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} {l.company ? `(${l.company})` : ''} - {l.aiCategory || l.status}
              </option>
            ))}
          </select>

          <button
            onClick={() => generateAction()}
            disabled={isLoading || !selectedLeadId}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md shadow-amber-600/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Computing...' : 'Recalculate'}</span>
          </button>
        </div>
      </div>

      {isLoading && !actionData && (
        <div className="p-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto animate-pulse">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Computing Next Best Action...
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Analyzing previous responses, budget timing, and product match with Gemini 3.7.
          </p>
        </div>
      )}

      {actionData && (
        <div className="space-y-6">
          {/* Top Prescribed Action Banner */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-amber-500/40 text-white shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> High-Probability Prescription
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {actionData.priority} Priority
                </span>
                <span className="text-xs font-medium text-slate-300">
                  • Urgency: <span className="text-amber-300 font-semibold">{actionData.urgency}</span>
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800 px-3 py-1.5 rounded-xl">
                <TrendingUp className="w-4 h-4" />
                <span>Win Rate Boost: {actionData.conversionBoostEstimate}</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">
                Recommended Action:
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1 text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-amber-200">
                {actionData.recommendedAction}
              </h2>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <span className="font-bold text-indigo-300 block mb-1">Decision Rationale:</span>
              {actionData.decisionRationale}
            </div>
          </div>

          {/* Suggested Message Ready to Deploy */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  AI-Crafted Closing Follow-Up Draft
                </h3>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800/60 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Message</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed select-text font-sans">
              {actionData.suggestedMessage}
            </div>
          </div>

          {/* Alternative Next Steps */}
          {actionData.alternativeActions && actionData.alternativeActions.length > 0 && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Alternative Contingency Tactics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {actionData.alternativeActions.map((alt, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{alt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
