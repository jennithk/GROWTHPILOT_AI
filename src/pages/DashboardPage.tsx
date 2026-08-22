import React, { useState, useEffect } from 'react';
import {
  Users,
  Flame,
  SunMedium,
  Snowflake,
  TrendingUp,
  Zap,
  BrainCircuit,
  Megaphone,
  MessageSquareShare,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Plus,
  Target,
  Clock,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { DashboardSummary, Lead } from '../types';
import { ScoreGauge } from '../components/ScoreGauge';
import { AILeadAnalysisModal } from '../components/AILeadAnalysisModal';
import { LeadModal } from '../components/LeadModal';

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { business } = useAuth();
  const { success, error, agent } = useToast();

  const [data, setData] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLeadForAnalysis, setSelectedLeadForAnalysis] = useState<Lead | null>(null);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [isScoringLeadId, setIsScoringLeadId] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const res = await api.getDashboardAnalytics();
      setData(res);
    } catch (err: any) {
      error('Error', 'Failed to load dashboard metrics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleScoreLead = async (lead: Lead) => {
    setIsScoringLeadId(lead.id);
    agent('AI Lead Scoring Agent Active', `Evaluating prospect signals for ${lead.name}...`);
    try {
      const res = await api.analyzeLeadWithAI(lead.id);
      const updatedLead = {
        ...lead,
        aiScore: res.analysis?.leadScore,
        aiCategory: res.analysis?.category,
        aiAnalysis: res.analysis,
      };
      setSelectedLeadForAnalysis(updatedLead);
      setIsAnalysisModalOpen(true);
      success('AI Qualification Complete', `${lead.name} scored ${res.analysis?.leadScore}/100 (${res.analysis?.category})`);
      fetchDashboardData();
    } catch (err: any) {
      error('Analysis Failed', err.message || 'Could not score lead');
    } finally {
      setIsScoringLeadId(null);
    }
  };

  const handleCreateLead = async (leadData: Partial<Lead>) => {
    try {
      await api.createLead(leadData);
      setIsAddLeadModalOpen(false);
      success('Lead Created', 'New prospect added to sales pipeline');
      fetchDashboardData();
    } catch (err: any) {
      error('Error', 'Failed to add lead');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-indigo-900/90 via-slate-900 to-slate-900 border border-indigo-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Autonomous Growth Engine Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {business?.businessName || 'Your Business'} Growth Command
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Targeting: <span className="font-semibold text-white">{business?.targetCustomers || 'Qualified buyers'}</span>. AI agents are continuously monitoring inbound inquiries and conversion signals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAddLeadModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Sales Prospect</span>
            </button>
            <button
              onClick={() => onNavigate('growth-strategy')}
              className="px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-2 transition-colors"
            >
              <BrainCircuit className="w-4 h-4 text-indigo-400" />
              <span>Run AI Strategy</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Leads */}
        <div
          onClick={() => onNavigate('leads')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 shadow-sm cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Ingested Leads
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {data?.summary.totalLeads ?? '--'}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> Live CRM
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {data?.summary.convertedCount ?? 0} converted deals to date
          </p>
        </div>

        {/* Hot Leads */}
        <div
          onClick={() => onNavigate('leads')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/40 hover:border-rose-500/60 shadow-sm cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              🔥 Hot Leads (Score 80+)
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {data?.summary.hotLeadsCount ?? '--'}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-300">
              Urgent Priority
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            High purchase intent, close within 24-48h
          </p>
        </div>

        {/* Warm Leads */}
        <div
          onClick={() => onNavigate('leads')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 shadow-sm cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Warm Prospects (50-79)
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <SunMedium className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {data?.summary.warmLeadsCount ?? '--'}
            </span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
              Nurture Stream
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Ready for personalized sample proof & offer
          </p>
        </div>

        {/* Conversion Rate */}
        <div
          onClick={() => onNavigate('analytics')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 shadow-sm cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pipeline Conversion
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {data?.summary.conversionRate ?? 0}%
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {data?.summary.qualifiedRate ?? 0}% Qualified
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Across website, Instagram, and inbound
          </p>
        </div>
      </div>

      {/* Two-Column Core Layout: Today's AI Recommendations & Quick Agent Workflows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's AI Growth Recommendations */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Today’s AI Growth Recommendations
              </h2>
            </div>
            <button
              onClick={fetchDashboardData}
              className="text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          <div className="space-y-3">
            {data?.recommendations && data.recommendations.length > 0 ? (
              data.recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          rec.priority === 'Urgent'
                            ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                            : rec.priority === 'High'
                            ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                            : 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30'
                        }`}
                      >
                        {rec.priority} Action
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{rec.title}</h3>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                      {rec.description}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (rec.leadId) {
                        const targetLead = data.recentLeads.find((l) => l.id === rec.leadId);
                        if (targetLead) {
                          setSelectedLeadForAnalysis(targetLead);
                          setIsAnalysisModalOpen(true);
                          return;
                        }
                      }
                      onNavigate(rec.targetTab);
                    }}
                    className="shrink-0 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-600 text-indigo-600 dark:text-indigo-300 hover:text-white text-xs font-semibold border border-indigo-200 dark:border-indigo-800/50 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>{rec.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-2 opacity-50" />
                <p className="text-sm text-slate-500">Autonomous recommendation engine is scanning...</p>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Quick Launch AI Agents */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              AI Growth Agent Suite
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            <button
              onClick={() => onNavigate('growth-strategy')}
              className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 text-left transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <BrainCircuit className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">AI Growth Strategy</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">10-point business growth plan</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              onClick={() => onNavigate('next-best-action')}
              className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 text-left transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Next Best Action Engine</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Prescriptive deal acceleration</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              onClick={() => onNavigate('campaigns')}
              className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 text-left transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Campaign Generator</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Captions & 3-day plans</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-500 group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              onClick={() => onNavigate('engagement')}
              className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-violet-500/50 text-left transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <MessageSquareShare className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Customer Engagement</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Personalized follow-ups</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-violet-500 group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Leads Pipeline Overview */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Sales Inquiries & AI Qualification
            </h2>
          </div>
          <button
            onClick={() => onNavigate('leads')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>View All Leads ({data?.summary.totalLeads ?? 0})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile View: Cards (< md) */}
        <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800/60">
          {data?.recentLeads && data.recentLeads.length > 0 ? (
            data.recentLeads.map((lead) => (
              <div key={lead.id} className="py-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{lead.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{lead.company || lead.email}</p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                      lead.status === 'Converted'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : lead.status === 'Qualified'
                        ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400'
                        : lead.status === 'Contacted'
                        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {lead.status}
                  </span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2">
                  {lead.interest || 'General inquiry'}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      {lead.source}
                    </span>
                    {lead.aiScore !== undefined && (
                      <ScoreGauge score={lead.aiScore} category={lead.aiCategory} size="sm" />
                    )}
                  </div>

                  {lead.aiAnalysis ? (
                    <button
                      onClick={() => {
                        setSelectedLeadForAnalysis(lead);
                        setIsAnalysisModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 text-xs font-semibold"
                    >
                      AI Report
                    </button>
                  ) : (
                    <button
                      onClick={() => handleScoreLead(lead)}
                      disabled={isScoringLeadId === lead.id}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Sparkles className={`w-3 h-3 ${isScoringLeadId === lead.id ? 'animate-spin' : ''}`} />
                      <span>{isScoringLeadId === lead.id ? 'Scoring...' : 'Score Lead'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="py-6 text-center text-xs text-slate-500">
              No leads in pipeline yet. Click "Add Sales Prospect" to get started.
            </p>
          )}
        </div>

        {/* Desktop View: Table (>= md) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3">Lead / Prospect</th>
                <th className="pb-3">Inquiry & Source</th>
                <th className="pb-3">AI Score & Fit</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Autonomous Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {data?.recentLeads && data.recentLeads.length > 0 ? (
                data.recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 font-medium">
                      <p className="font-semibold text-slate-900 dark:text-white">{lead.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {lead.company || lead.email}
                      </p>
                    </td>
                    <td className="py-3.5">
                      <p className="text-slate-700 dark:text-slate-300 line-clamp-1 max-w-xs">
                        {lead.interest || 'General inquiry'}
                      </p>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        {lead.source}
                      </span>
                    </td>
                    <td className="py-3.5">
                      {lead.aiScore !== undefined ? (
                        <ScoreGauge
                          score={lead.aiScore}
                          category={lead.aiCategory}
                          size="sm"
                        />
                      ) : (
                        <span className="text-slate-400 italic">Not scored yet</span>
                      )}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          lead.status === 'Converted'
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : lead.status === 'Qualified'
                            ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400'
                            : lead.status === 'Contacted'
                            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      {lead.aiAnalysis ? (
                        <button
                          onClick={() => {
                            setSelectedLeadForAnalysis(lead);
                            setIsAnalysisModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 text-xs font-semibold transition-colors"
                        >
                          View AI Analysis
                        </button>
                      ) : (
                        <button
                          onClick={() => handleScoreLead(lead)}
                          disabled={isScoringLeadId === lead.id}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 ml-auto disabled:opacity-50"
                        >
                          <Sparkles className={`w-3.5 h-3.5 ${isScoringLeadId === lead.id ? 'animate-spin' : ''}`} />
                          <span>{isScoringLeadId === lead.id ? 'Scoring...' : 'Score with AI'}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500">
                    No leads in pipeline yet. Click "Add Sales Prospect" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Lead Analysis Modal */}
      <AILeadAnalysisModal
        isOpen={isAnalysisModalOpen}
        onClose={() => setIsAnalysisModalOpen(false)}
        lead={selectedLeadForAnalysis}
        onReAnalyze={async (id) => {
          if (selectedLeadForAnalysis) {
            await handleScoreLead(selectedLeadForAnalysis);
          }
        }}
        isReAnalyzing={!!isScoringLeadId}
      />

      {/* Add Lead Modal */}
      <LeadModal
        isOpen={isAddLeadModalOpen}
        onClose={() => setIsAddLeadModalOpen(false)}
        onSave={handleCreateLead}
      />
    </div>
  );
};
