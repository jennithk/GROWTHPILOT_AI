import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { GrowthStrategyData } from '../types';
import {
  BrainCircuit,
  Sparkles,
  Users,
  Target,
  AlertCircle,
  TrendingUp,
  Share2,
  CheckCircle2,
  Layers,
  ArrowRight,
  Copy,
  Check,
  RefreshCw,
  Zap,
  ShoppingBag,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';

export const GrowthStrategyPage: React.FC = () => {
  const { business } = useAuth();
  const { success, error, agent } = useToast();

  const [strategy, setStrategy] = useState<GrowthStrategyData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleGenerateStrategy = async () => {
    setIsGenerating(true);
    agent('AI Growth Agent Activated', 'Synthesizing 10-dimension business growth strategy...');
    try {
      const data = await api.generateGrowthStrategy();
      setStrategy(data);
      success('Strategy Ready', 'Comprehensive 10-point AI Growth Strategy generated');
    } catch (err: any) {
      error('Strategy Error', err.message || 'Failed to generate growth strategy');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    // Auto-generate or check history on first load
    handleGenerateStrategy();
  }, []);

  const copyText = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    success('Copied', 'Strategy section copied to clipboard');
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/25">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                AI Growth Strategy Agent
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                10-Point Analysis
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Autonomous strategic advisor synthesizing market positioning, ICP profiles, and high-impact conversion roadmaps.
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerateStrategy}
          disabled={isGenerating}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Synthesizing Strategy...' : 'Re-Run AI Growth Agent'}</span>
        </button>
      </div>

      {isGenerating && !strategy && (
        <div className="p-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto animate-pulse">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            AI Growth Agent is Analyzing {business?.businessName || 'Your Business'}...
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Evaluating market demographics, objection playbooks, budget allocations, and high-leverage growth avenues with Gemini 3.7.
          </p>
        </div>
      )}

      {strategy && (
        <div className="space-y-6">
          {/* Executive Summary Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-900 border border-indigo-500/30 text-white shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Executive Growth Thesis
              </span>
              <span className="text-[11px] text-slate-400">
                Generated {new Date(strategy.generatedAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm sm:text-base leading-relaxed text-slate-200">
              {strategy.businessSummary}
            </p>
          </div>

          {/* Dimension 1 & 2: Audience & ICP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Target Audience Analysis */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                    01
                  </div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Target Audience Analysis
                  </h2>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                    Demographics:
                  </span>
                  <p className="text-slate-600 dark:text-slate-400">{strategy.targetAudienceAnalysis.demographics}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                    Psychographics & Values:
                  </span>
                  <p className="text-slate-600 dark:text-slate-400">{strategy.targetAudienceAnalysis.psychographics}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                    Buying Behaviors & Habits:
                  </span>
                  <p className="text-slate-600 dark:text-slate-400">{strategy.targetAudienceAnalysis.buyingBehaviors}</p>
                </div>
              </div>
            </div>

            {/* 2. Ideal Customer Profile (ICP) */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                    02
                  </div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Ideal Customer Profile (ICP)
                  </h2>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                    Primary Decision Maker:
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">{strategy.idealCustomerProfile.titleOrSegment}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                    Organization Type / Scale:
                  </span>
                  <p className="text-slate-600 dark:text-slate-400">{strategy.idealCustomerProfile.companyOrIndividualType}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                    Trigger Events (When they buy):
                  </span>
                  <p className="text-slate-600 dark:text-slate-400">{strategy.idealCustomerProfile.triggerEvents}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dimension 3 & 4: Pain Points & Value Proposition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 3. Customer Pain Points */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-xs">
                  03
                </div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Customer Pain Points
                </h2>
              </div>

              <div className="space-y-2">
                {strategy.customerPainPoints.map((pain, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-xs text-rose-900 dark:text-rose-200 flex items-start gap-2.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span>{pain}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Value Proposition */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                  04
                </div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Compelling Value Proposition
                </h2>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  Positioning Headline
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  "{strategy.valueProposition.headline}"
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
                  {strategy.valueProposition.coreBenefit}
                </p>
              </div>

              <div className="space-y-1.5 text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Key Differentiators:</span>
                {strategy.valueProposition.keyDifferentiators.map((diff, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{diff}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dimension 5: Growth Opportunities */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                05
              </div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Identified Growth Opportunities
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {strategy.growthOpportunities.map((opp, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                        {opp.impact} Impact
                      </span>
                      <span className="text-[10px] text-slate-400">{opp.timeframe}</span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">{opp.title}</h3>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {opp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dimension 6: Recommended Marketing Channels */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-xs">
                06
              </div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Recommended Marketing Channels & Budget Allocation
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {strategy.recommendedMarketingChannels.map((chan, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{chan.channel}</span>
                    <span className="text-xs font-extrabold text-sky-600 dark:text-sky-400">
                      {chan.budgetAllocationPct}% Budget
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">
                    {chan.whyItWorks}
                  </p>
                  <div className="space-y-1">
                    {chan.tactics.map((tac, tIdx) => (
                      <div key={tIdx} className="text-[10px] text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-sky-500" />
                        <span>{tac}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dimension 7 & 8: Sales Strategy & Customer Engagement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 7. Sales Strategy & Objection Handling */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                  07
                </div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Sales Strategy & Objection Handling
                </h2>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Outreach Approach:
                  </span>
                  <p className="text-slate-600 dark:text-slate-400">{strategy.salesStrategy.outreachApproach}</p>
                </div>

                <div className="space-y-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                    AI Objection Counters:
                  </span>
                  {strategy.salesStrategy.objectionHandling.map((obj, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30">
                      <p className="font-semibold text-amber-900 dark:text-amber-300">
                        "{obj.objection}"
                      </p>
                      <p className="text-slate-600 dark:text-slate-300 mt-1">
                        → {obj.counter}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 8. Customer Engagement Strategy */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="w-7 h-7 rounded-lg bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold text-xs">
                  08
                </div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Customer Engagement & Retention
                </h2>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                    Retention Focus:
                  </span>
                  <p className="text-slate-600 dark:text-slate-400">{strategy.customerEngagementStrategy.retentionFocus}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                    Onboarding Cadence:
                  </span>
                  <p className="text-slate-600 dark:text-slate-400">{strategy.customerEngagementStrategy.onboardingCadence}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Loyalty Mechanisms:
                  </span>
                  {strategy.customerEngagementStrategy.loyaltyMechanisms.map((mech, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <span className="w-1 h-1 rounded-full bg-violet-500" />
                      <span>{mech}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Dimension 9: Upselling Opportunities */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                09
              </div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Upselling & Cross-Selling Architecture
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {strategy.upsellingOpportunities.map((up, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{up.bundleOrAddon}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                      {up.expectedRevenueBoost}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Target: {up.targetSegment}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Dimension 10: 3 High-Priority Actions (Immediate Execution) */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-slate-900 border border-indigo-500/40 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-indigo-800/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-extrabold text-xs shadow-md">
                  10
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    3 High-Priority Actions (Immediate Execution)
                  </h2>
                  <p className="text-xs text-indigo-300">
                    Autonomous tactical recommendations for immediate ROI
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {strategy.highPriorityActions.map((action) => (
                <div
                  key={action.actionNumber}
                  className="p-4 rounded-xl bg-slate-900/90 border border-indigo-500/30 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-indigo-400">
                        ACTION #{action.actionNumber}
                      </span>
                      <span className="text-[10px] text-slate-400">{action.timeToExecute}</span>
                    </div>
                    <h3 className="text-xs font-bold text-white">{action.title}</h3>
                    <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-semibold text-emerald-400">
                    Expected: {action.expectedImpact}
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
