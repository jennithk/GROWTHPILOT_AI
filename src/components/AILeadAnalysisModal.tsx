import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Copy,
  Check,
  Flame,
  Send,
  Clock,
  Target,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import { Lead } from '../types';
import { ScoreGauge } from './ScoreGauge';
import { useToast } from '../context/ToastContext';

interface AILeadAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onReAnalyze?: (leadId: string) => Promise<void>;
  isReAnalyzing?: boolean;
}

export const AILeadAnalysisModal: React.FC<AILeadAnalysisModalProps> = ({
  isOpen,
  onClose,
  lead,
  onReAnalyze,
  isReAnalyzing,
}) => {
  const { success } = useToast();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !lead) return null;

  const analysis = lead.aiAnalysis;

  const handleCopyMessage = () => {
    if (analysis?.followUpMessage) {
      navigator.clipboard.writeText(analysis.followUpMessage);
      setCopied(true);
      success('Message Copied', 'Personalized follow-up message copied to clipboard');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  AI Lead Scoring Intelligence
                </h2>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  Gemini Agent
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Prospect: <span className="font-semibold text-slate-700 dark:text-slate-200">{lead.name}</span>
                {lead.company ? ` • ${lead.company}` : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Top Score Matrix */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/40 dark:from-slate-800/60 dark:to-slate-800/30 border border-indigo-100 dark:border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <ScoreGauge
                score={lead.aiScore || analysis?.leadScore || 75}
                category={lead.aiCategory || analysis?.category || 'Warm'}
                size="lg"
                showLabel={false}
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Classification:</span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      (lead.aiCategory || analysis?.category) === 'Hot'
                        ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                        : (lead.aiCategory || analysis?.category) === 'Warm'
                        ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                        : 'bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30'
                    }`}
                  >
                    🔥 {lead.aiCategory || analysis?.category || 'Warm'} Lead
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Purchase Intent: <span className="text-indigo-600 dark:text-indigo-400">{analysis?.purchaseIntent || 'High'}</span>
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Follow-up: {analysis?.followUpTime || 'Within 24 hours'}</span>
                  </div>
                  {analysis?.dealProbabilityPct && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Win Rate: {analysis.dealProbabilityPct}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {onReAnalyze && (
              <button
                onClick={() => onReAnalyze(lead.id)}
                disabled={isReAnalyzing}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 text-indigo-500 ${isReAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isReAnalyzing ? 'Re-Analyzing...' : 'Re-Run AI Agent'}</span>
              </button>
            )}
          </div>

          {/* Identified Need & Recommended Action */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                <Target className="w-4 h-4 text-indigo-500" />
                <span>Extracted Customer Need</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {analysis?.customerNeed || lead.interest || 'Customer seeking bulk custom products with reliable delivery.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-800/50">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Recommended Next Action</span>
              </div>
              <p className="text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed font-medium">
                {analysis?.nextBestAction || 'Schedule a tailored discovery call and present custom digital mockups.'}
              </p>
            </div>
          </div>

          {/* Personalized Follow-Up Message */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Personalized Follow-Up Message (AI Generated)
                </span>
              </div>
              <button
                onClick={handleCopyMessage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800/60 transition-colors"
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

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 font-sans text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line select-text">
              {analysis?.followUpMessage ||
                `Hi ${lead.name.split(' ')[0]}, based on your interest in ${lead.interest || 'our custom products'}, we'd love to share personalized design mockups and special volume pricing options. When is a good time for a quick 5-minute call?`}
            </div>
          </div>

          {/* Scoring Factors */}
          {analysis?.scoringFactors && analysis.scoringFactors.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                Key Scoring Factors
              </h4>
              <div className="space-y-2">
                {analysis.scoringFactors.map((factor, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          factor.weight === 'Positive'
                            ? 'bg-emerald-500'
                            : factor.weight === 'Negative'
                            ? 'bg-rose-500'
                            : 'bg-amber-500'
                        }`}
                      />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{factor.factor}</span>
                    </div>
                    <span className="text-slate-500 dark:text-slate-400">{factor.reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Analysis Timestamp: {analysis?.analyzedAt ? new Date(analysis.analyzedAt).toLocaleString() : 'Just now'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
