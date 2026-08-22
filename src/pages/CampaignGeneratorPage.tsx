import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { CampaignData } from '../types';
import {
  Megaphone,
  Sparkles,
  Calendar,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  Copy,
  Check,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  RefreshCw,
  Hash,
} from 'lucide-react';

export const CampaignGeneratorPage: React.FC = () => {
  const { business } = useAuth();
  const { success, error, agent } = useToast();

  const [campaignGoal, setCampaignGoal] = useState('Drive 25 high-ticket bulk merchandise orders for upcoming conferences');
  const [productService, setProductService] = useState(
    business?.products || 'Custom Heavyweight Embroidered Hoodies & Organic Screenprinted T-Shirts'
  );
  const [targetAudience, setTargetAudience] = useState(
    business?.targetCustomers || 'Event organizers, startup teams, and university organizations'
  );
  const [platform, setPlatform] = useState('Instagram');

  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedGeneral, setCopiedGeneral] = useState(false);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!campaignGoal || !productService) {
      error('Missing fields', 'Please enter a campaign goal and product.');
      return;
    }

    setIsGenerating(true);
    agent('AI Campaign Agent', `Crafting multi-channel promotional campaign for ${platform}...`);
    try {
      const res = await api.generateCampaign({
        campaignGoal,
        productService,
        targetAudience,
        platform,
      });
      setCampaign(res);
      success('Campaign Ready', `Generated 3 captions & 3-day roadmap for ${platform}`);
    } catch (err: any) {
      error('Campaign Failed', err.message || 'Could not generate campaign');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyCaption = (caption: string, idx: number) => {
    navigator.clipboard.writeText(caption);
    setCopiedIndex(idx);
    success('Copied', `Caption #${idx + 1} copied to clipboard`);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const platforms = [
    { id: 'Instagram', label: 'Instagram', icon: Instagram },
    { id: 'LinkedIn', label: 'LinkedIn', icon: Linkedin },
    { id: 'Email', label: 'Email Newsletter', icon: Mail },
    { id: 'WhatsApp', label: 'WhatsApp / SMS', icon: MessageCircle },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/25">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                AI Multi-Channel Campaign Generator
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
                Marketing Agent
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Generates hooks, conversion copy, and 3-day deployment roadmaps tailored for any channel.
            </p>
          </div>
        </div>
      </div>

      {/* Input Parameters Box */}
      <form onSubmit={handleGenerate} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Platform Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
            Target Platform / Channel
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {platforms.map((p) => {
              const Icon = p.icon;
              const isSelected = platform === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlatform(p.id)}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-sky-500/15 border-sky-500 text-sky-600 dark:text-sky-400 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Campaign Goal *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Promote 20% discount on first bulk orders"
              value={campaignGoal}
              onChange={(e) => setCampaignGoal(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Featured Product / Service *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Custom heavy embroidered hoodies"
              value={productService}
              onChange={(e) => setProductService(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
            Target Audience Segment
          </label>
          <input
            type="text"
            placeholder="e.g. Startup founders and event organizers"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="pt-2 flex items-center justify-end">
          <button
            type="submit"
            disabled={isGenerating}
            className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Generating Marketing Blitz...' : 'Generate AI Campaign'}</span>
          </button>
        </div>
      </form>

      {/* Generated Campaign Output */}
      {campaign && (
        <div className="space-y-6">
          {/* Campaign Strategy Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-sky-950/40 to-slate-900 border border-sky-500/30 text-white shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> {campaign.platform} Campaign Matrix
              </span>
              <span className="text-[11px] text-slate-400">Ready to Deploy</span>
            </div>
            <h2 className="text-xl font-bold text-white">{campaign.campaignName}</h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              Objective: <span className="text-white font-medium">{campaign.campaignObjective}</span>
            </p>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-sky-200">
              <span className="font-bold text-sky-400 block mb-0.5">Core Campaign Hook / Key Message:</span>
              "{campaign.keyMessage}"
            </div>
          </div>

          {/* 3 Marketing Captions Grid */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-500" />
              <span>3 Tailored Marketing Captions</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {campaign.marketingCaptions.map((cap, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-600 dark:text-sky-400 font-mono">
                        OPTION #{idx + 1}
                      </span>
                      <button
                        onClick={() => copyCaption(`${cap.hook}\n\n${cap.caption}\n\n${cap.callToAction}\n\n${(cap.hashtags || campaign.hashtags).map(h => h.startsWith('#') ? h : `#${h}`).join(' ')}`, idx)}
                        className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-500">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-2.5 rounded-lg bg-sky-50/50 dark:bg-sky-950/20 text-xs font-bold text-slate-900 dark:text-white">
                      Hook: "{cap.hook}"
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                      {cap.caption}
                    </p>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      CTA: {cap.callToAction}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hashtags & CTA Bar */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-sky-500" />
              <div className="flex flex-wrap gap-1.5">
                {campaign.hashtags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[11px]"
                  >
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-slate-600 dark:text-slate-400 font-medium">
              Primary CTA: <span className="text-slate-900 dark:text-white font-bold">{campaign.primaryCallToAction}</span>
            </div>
          </div>

          {/* 3-Day Actionable Campaign Plan */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                3-Day Actionable Deployment Plan
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {campaign.threeDayCampaignPlan.map((day) => (
                <div
                  key={day.day}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
                        DAY 0{day.day}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {day.recommendedTime}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{day.title}</h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      {day.activity}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700 text-[10px] text-slate-700 dark:text-slate-300 font-semibold">
                    Deliverable: {day.deliverable}
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
