import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Flame,
  SunMedium,
  Snowflake,
  Sparkles,
  MoreVertical,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Building,
  ArrowUpDown,
  Kanban,
  List,
  CheckCircle2,
  Clock,
  Send,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { Lead, LeadStatus, LeadCategory } from '../types';
import { ScoreGauge } from '../components/ScoreGauge';
import { AILeadAnalysisModal } from '../components/AILeadAnalysisModal';
import { LeadModal } from '../components/LeadModal';

export const LeadsPage: React.FC = () => {
  const { business } = useAuth();
  const { success, error, agent } = useToast();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [sortBy, setSortBy] = useState('score_desc');

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [selectedLeadForAnalysis, setSelectedLeadForAnalysis] = useState<Lead | null>(null);
  const [isScoringLeadId, setIsScoringLeadId] = useState<string | null>(null);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const data = await api.getLeads({
        status: statusFilter !== 'All' ? statusFilter : undefined,
        category: categoryFilter !== 'All' ? categoryFilter : undefined,
        source: sourceFilter !== 'All' ? sourceFilter : undefined,
        search: searchQuery || undefined,
        sortBy,
      });
      setLeads(data);
    } catch (err: any) {
      error('Failed to load leads', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter, categoryFilter, sourceFilter, sortBy, searchQuery]);

  const handleScoreLead = async (lead: Lead) => {
    setIsScoringLeadId(lead.id);
    agent('AI Lead Scoring Agent', `Evaluating customer need, score & next actions for ${lead.name}...`);
    try {
      const res = await api.analyzeLeadWithAI(lead.id);
      const updatedLead: Lead = {
        ...lead,
        aiScore: res.analysis?.leadScore,
        aiCategory: res.analysis?.category,
        aiAnalysis: res.analysis,
      };
      setSelectedLeadForAnalysis(updatedLead);
      setIsAnalysisModalOpen(true);
      success('AI Scoring Complete', `${lead.name} scored ${res.analysis?.leadScore}/100 (${res.analysis?.category})`);
      fetchLeads();
    } catch (err: any) {
      error('Analysis Failed', err.message || 'Could not score lead');
    } finally {
      setIsScoringLeadId(null);
    }
  };

  const handleSaveLead = async (leadData: Partial<Lead>) => {
    try {
      if (editingLead) {
        await api.updateLead(editingLead.id, leadData);
        success('Lead Updated', 'Changes saved successfully');
      } else {
        await api.createLead(leadData);
        success('Lead Created', 'New prospect added to pipeline');
      }
      setIsAddEditModalOpen(false);
      setEditingLead(null);
      fetchLeads();
    } catch (err: any) {
      error('Save Failed', err.message);
    }
  };

  const handleDeleteLead = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from your leads pipeline?`)) return;
    try {
      await api.deleteLead(id);
      success('Lead Removed', `${name} deleted`);
      fetchLeads();
    } catch (err: any) {
      error('Delete Failed', err.message);
    }
  };

  const handleStatusChange = async (id: string, newStatus: LeadStatus) => {
    try {
      await api.updateLead(id, { status: newStatus });
      success('Status Updated', `Lead moved to ${newStatus}`);
      fetchLeads();
    } catch (err: any) {
      error('Update Failed', err.message);
    }
  };

  const kanbanColumns: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/25">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Sales Pipeline & AI Scoring
              </h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                {leads.length} Leads
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Autonomous qualification engine scoring intent, buying timeline, and personalized next actions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span className="hidden sm:inline">Board</span>
            </button>
          </div>

          <button
            onClick={() => {
              setEditingLead(null);
              setIsAddEditModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Prospect</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, company, email, or need..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Converted">Converted</option>
            <option value="Lost">Lost</option>
          </select>

          {/* AI Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All AI Fits</option>
            <option value="Hot">🔥 Hot (Score 80-100)</option>
            <option value="Warm">☀️ Warm (Score 50-79)</option>
            <option value="Cold">❄️ Cold (Score &lt;50)</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="score_desc">AI Score: High to Low</option>
            <option value="score_asc">AI Score: Low to High</option>
            <option value="newest">Newest Inbound</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Main View (Table or Kanban) */}
      {viewMode === 'table' ? (
        <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Mobile View: Cards (< md) */}
          <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800/60">
            {leads.length > 0 ? (
              leads.map((lead) => (
                <div key={lead.id} className="py-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">{lead.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {lead.company ? `${lead.company} • ` : ''}{lead.email}
                        </p>
                      </div>
                    </div>

                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                      className="px-2 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 focus:outline-none"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Converted">Converted</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2">
                    {lead.interest || 'General inquiry'}
                  </p>

                  {lead.notes && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                      Note: {lead.notes}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium">
                        {lead.source}
                      </span>
                      {lead.aiScore !== undefined && (
                        <ScoreGauge score={lead.aiScore} category={lead.aiCategory} size="sm" />
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 ml-auto">
                      {lead.aiAnalysis ? (
                        <button
                          onClick={() => {
                            setSelectedLeadForAnalysis(lead);
                            setIsAnalysisModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 text-xs font-semibold flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>AI Report</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleScoreLead(lead)}
                          disabled={isScoringLeadId === lead.id}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 disabled:opacity-50"
                        >
                          <Sparkles className={`w-3 h-3 ${isScoringLeadId === lead.id ? 'animate-spin' : ''}`} />
                          <span>Score</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setEditingLead(lead);
                          setIsAddEditModalOpen(true);
                        }}
                        aria-label="Edit lead"
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteLead(lead.id, lead.name)}
                        aria-label="Delete lead"
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-xs text-slate-500">
                No leads match your filter criteria.
              </p>
            )}
          </div>

          {/* Desktop View: Table (>= md) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="pb-3 pl-2">Prospect</th>
                  <th className="pb-3">Inquiry & Need</th>
                  <th className="pb-3">Source</th>
                  <th className="pb-3">AI Score & Fit</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right pr-2">Autonomous Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {leads.length > 0 ? (
                  leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 pl-2 font-medium">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300">
                            {lead.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-xs">{lead.name}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              {lead.company ? `${lead.company} • ` : ''}{lead.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 max-w-xs">
                        <p className="text-slate-700 dark:text-slate-300 line-clamp-1 font-medium">
                          {lead.interest || 'General inquiry'}
                        </p>
                        {lead.notes && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            Note: {lead.notes}
                          </p>
                        )}
                      </td>

                      <td className="py-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium">
                          {lead.source}
                        </span>
                      </td>

                      <td className="py-4">
                        {lead.aiScore !== undefined ? (
                          <ScoreGauge
                            score={lead.aiScore}
                            category={lead.aiCategory}
                            size="sm"
                          />
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Unanalyzed</span>
                        )}
                      </td>

                      <td className="py-4">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 focus:outline-none"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Qualified">Qualified</option>
                          <option value="Converted">Converted</option>
                          <option value="Lost">Lost</option>
                        </select>
                      </td>

                      <td className="py-4 text-right pr-2">
                        <div className="flex items-center justify-end gap-2">
                          {lead.aiAnalysis ? (
                            <button
                              onClick={() => {
                                setSelectedLeadForAnalysis(lead);
                                setIsAnalysisModalOpen(true);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 text-xs font-semibold transition-colors flex items-center gap-1"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>AI Intelligence</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleScoreLead(lead)}
                              disabled={isScoringLeadId === lead.id}
                              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
                            >
                              <Sparkles className={`w-3.5 h-3.5 ${isScoringLeadId === lead.id ? 'animate-spin' : ''}`} />
                              <span>{isScoringLeadId === lead.id ? 'Scoring...' : 'Score with AI'}</span>
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setEditingLead(lead);
                              setIsAddEditModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteLead(lead.id, lead.name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      No leads match your filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Kanban Board View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {kanbanColumns.map((colStatus) => {
            const colLeads = leads.filter((l) => l.status === colStatus);
            return (
              <div
                key={colStatus}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[70vh]"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      {colStatus}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {colLeads.length}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {colLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2.5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                            {lead.name}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                            {lead.company || lead.email}
                          </p>
                        </div>
                        {lead.aiScore !== undefined && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              lead.aiCategory === 'Hot'
                                ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                                : lead.aiCategory === 'Warm'
                                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                                : 'bg-sky-500/20 text-sky-600 dark:text-sky-400'
                            }`}
                          >
                            {lead.aiScore}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                        {lead.interest || 'No interest notes specified'}
                      </p>

                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {lead.source}
                        </span>

                        {lead.aiAnalysis ? (
                          <button
                            onClick={() => {
                              setSelectedLeadForAnalysis(lead);
                              setIsAnalysisModalOpen(true);
                            }}
                            className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 hover:underline"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Analysis</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleScoreLead(lead)}
                            className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                          >
                            + Score AI
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
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

      <LeadModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setEditingLead(null);
        }}
        onSave={handleSaveLead}
        initialData={editingLead}
      />
    </div>
  );
};
