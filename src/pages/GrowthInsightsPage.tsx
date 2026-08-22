import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { GrowthInsightsData } from '../types';
import {
  TrendingUp,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Clock,
  Target,
  RefreshCw,
  Zap,
  ShieldAlert,
  ArrowRight,
  Activity,
} from 'lucide-react';

export const GrowthInsightsPage: React.FC = () => {
  const { business } = useAuth();
  const { success, error, agent } = useToast();

  const [insights, setInsights] = useState<GrowthInsightsData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateInsights = async () => {
    setIsGenerating(true);
    agent('Growth Insights Agent Active', 'Diagnosing pipeline health, bottleneck alerts & customer demand signals...');
    try {
      const res = await api.generateGrowthInsights();
      setInsights(res);
      success('Insights Updated', 'AI pipeline diagnosis complete');
    } catch (err: any) {
      error('Insights Failed', err.message || 'Failed to generate growth insights');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    handleGenerateInsights();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/25">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                AI Growth Insights & Bottleneck Diagnosis
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Pipeline Intelligence
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Autonomous sales analytics diagnosing velocity stalls, lead leakage, and highest-leverage conversion opportunities.
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerateInsights}
          disabled={isGenerating}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Analyzing Pipeline...' : 'Re-Run Growth Diagnosis'}</span>
        </button>
      </div>

      {isGenerating && !insights && (
        <div className="p-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto animate-pulse">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Diagnosing Live Pipeline Health...
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Cross-referencing inquiry timestamps, qualification status ratios, and customer objections.
          </p>
        </div>
      )}

      {insights && (
        <div className="space-y-6">
          {/* Executive Diagnosis Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900 border border-emerald-500/30 text-white shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Autonomous Pipeline Summary
              </span>
              <span className="text-[11px] text-slate-400">
                Generated {new Date(insights.generatedAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm sm:text-base leading-relaxed text-slate-200">
              {insights.executiveSummary}
            </p>
          </div>

          {/* Key Velocity Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block mb-1">
                Lead Velocity Health
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {insights.keyMetricsAnalysis.leadVelocity}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block mb-1">
                Conversion Pipeline Health
              </span>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {insights.keyMetricsAnalysis.conversionHealth}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block mb-1">
                Untouched Inbound Leads
              </span>
              <p className="text-sm font-bold text-rose-500">
                {insights.keyMetricsAnalysis.untouchedLeadsCount} Leads Awaiting Action
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block mb-1">
                Top Inbound Acquisition Channel
              </span>
              <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                {insights.keyMetricsAnalysis.topAcquisitionChannel}
              </p>
            </div>
          </div>

          {/* Growth Opportunities & Bottlenecks Two-Col */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Growth Opportunities */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Lightbulb className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Uncapped Growth Opportunities
                </h3>
              </div>

              <div className="space-y-3">
                {insights.growthOpportunities.map((opp, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{opp.opportunity}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                        {opp.potentialUpside}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Required Action: {opp.actionRequired}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sales Bottlenecks */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Diagnosed Sales Bottlenecks
                </h3>
              </div>

              <div className="space-y-3">
                {insights.salesBottlenecks.map((bot, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{bot.bottleneck}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-600 dark:text-rose-400">
                        {bot.impact} Leakage
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      AI Solution: <strong className="text-slate-900 dark:text-white">{bot.solution}</strong>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Behavioral Insights */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Extracted Customer Demand Insights
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {insights.customerInsights.map((ci, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{ci.insight}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Evidence: {ci.evidence}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700 text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                    Meaning: {ci.strategicMeaning}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prioritized Action Plan */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Zap className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-bold text-white">
                Prioritized Tactical Execution Roadmap
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {insights.recommendedActions.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-1.5 ${
                        rec.priority.includes('24h')
                          ? 'bg-rose-500/20 text-rose-400'
                          : rec.priority.includes('7d')
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-indigo-500/20 text-indigo-400'
                      }`}
                    >
                      {rec.priority}
                    </span>
                    <h4 className="text-xs font-bold text-white">{rec.action}</h4>
                    <p className="text-[11px] text-slate-400 mt-1">Target: {rec.targetLeadOrSegment}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-emerald-400 font-semibold">
                    Outcome: {rec.expectedOutcome}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
