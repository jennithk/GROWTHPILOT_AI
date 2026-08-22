import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';
import {
  Sparkles,
  Building2,
  Tag,
  MapPin,
  Users,
  Target,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Sun,
  Moon,
} from 'lucide-react';

interface OnboardingPageProps {
  onComplete?: () => void;
  onCompleted?: () => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({
  onComplete,
  onCompleted,
}) => {
  const finishOnboarding = onCompleted || onComplete || (() => {});
  const { business, updateBusinessLocally } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { success, error, agent } = useToast();

  const [businessName, setBusinessName] = useState(business?.businessName || '');
  const [industry, setIndustry] = useState(business?.industry || 'Custom Apparel & Merchandise');
  const [description, setDescription] = useState(
    business?.description ||
      'We manufacture premium sustainable custom hoodies, t-shirts, and tote bags for corporate events, creators, and university teams.'
  );
  const [products, setProducts] = useState(
    business?.products ||
      'Custom Embroidered Heavyweight Hoodies, Screenprinted Organic T-Shirts, Branded Tote Bags, Custom Tech Sleeves'
  );
  const [targetLocation, setTargetLocation] = useState(business?.targetLocation || 'United States & Canada');
  const [targetCustomers, setTargetCustomers] = useState(
    business?.targetCustomers ||
      'Tech startup founders, university club presidents, corporate event organizers, and boutique brand creators looking for bulk orders of 50-500 units'
  );
  const [businessGoal, setBusinessGoal] = useState(
    business?.businessGoal || 'Generate more qualified inbound leads and close 20 high-value bulk orders this month'
  );
  const [isSaving, setIsSaving] = useState(false);

  const presets = [
    {
      name: 'Custom Apparel & Merch',
      industry: 'Fashion / Custom Apparel',
      desc: 'Premium sustainable custom clothing and merchandise for businesses, universities, and creators.',
      products: 'Embroidered Hoodies, Organic Screenprinted Tees, Heavyweight Zip-ups, Branded Canvas Totes',
      loc: 'North America (US & Canada)',
      cust: 'Startup leaders, event organizers, college groups, and independent creators ordering 50-500 units.',
      goal: 'Scale inbound lead pipeline and increase average bulk order value.',
    },
    {
      name: 'B2B AI Software / SaaS',
      industry: 'Software / Technology',
      desc: 'B2B workflow automation platform streamlining customer operations and sales tracking for SMBs.',
      products: 'Growth Automation Pro ($149/mo), Enterprise Team Plan ($499/mo), Custom Onboarding API',
      loc: 'Global (Remote)',
      cust: 'Founders, VP of Sales, and Operations Directors at fast-growing companies (10-150 employees).',
      goal: 'Acquire 50 qualified trial signups and increase demo-to-paid conversion by 35%.',
    },
    {
      name: 'Digital Growth Agency',
      industry: 'Marketing & Design Services',
      desc: 'Full-service digital performance studio helping direct-to-consumer brands scale paid media and creative.',
      products: 'Monthly Growth Retainer ($3,500/mo), Full Brand Identity Sprint ($5,000), TikTok Ad Creative Pack ($2,000)',
      loc: 'United States & UK',
      cust: 'E-commerce founders doing $500k-$5M annual revenue seeking profitable customer acquisition.',
      goal: 'Book 15 qualified discovery calls and sign 4 new retainer clients this quarter.',
    },
  ];

  const applyPreset = (p: typeof presets[0]) => {
    setBusinessName(p.name);
    setIndustry(p.industry);
    setDescription(p.desc);
    setProducts(p.products);
    setTargetLocation(p.loc);
    setTargetCustomers(p.cust);
    setBusinessGoal(p.goal);
    agent('Preset Applied', `Loaded template for ${p.name}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !industry.trim() || !products.trim()) {
      error('Missing Information', 'Please provide business name, industry, and products.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await api.saveBusinessProfile({
        businessName: businessName.trim(),
        industry: industry.trim(),
        description: description.trim(),
        products: products.trim(),
        targetLocation: targetLocation.trim(),
        targetCustomers: targetCustomers.trim(),
        businessGoal: businessGoal.trim(),
      });

      updateBusinessLocally(res.business);
      success('Profile Initialized', 'GrowthPilot AI is calibrated to your business model.');
      finishOnboarding();
    } catch (err: any) {
      error('Save Failed', err.message || 'Failed to save business profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8 bg-geometric-grid transition-colors duration-200 relative">
      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-all shadow-sm"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Growth Calibration</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Tell GrowthPilot AI About Your Business
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-xl mx-auto">
            Our autonomous AI agents use this profile to analyze target buyers, compute lead qualification scores, and generate hyper-personalized sales messaging.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="mb-8 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Quick Start Templates (Click to Auto-Fill)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(p)}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500/40 text-left transition-all group shadow-sm"
              >
                <p className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300">
                  {p.name}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{p.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Main Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl space-y-5 backdrop-blur-md transition-colors"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Business Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Threadcraft Studios"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Industry / Niche *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Custom Apparel, B2B SaaS, Health & Wellness"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Business Description *
            </label>
            <textarea
              rows={3}
              required
              placeholder="What does your company do? What is your core offering and unique value?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Products or Services Offered *
            </label>
            <textarea
              rows={2}
              required
              placeholder="List your specific products, packages, pricing tiers, or service bundles"
              value={products}
              onChange={(e) => setProducts(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Target Geographic Location
              </label>
              <input
                type="text"
                placeholder="e.g. United States, Western Europe, Global"
                value={targetLocation}
                onChange={(e) => setTargetLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Target Customer Segment *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Startup founders, event planners, creators"
                value={targetCustomers}
                onChange={(e) => setTargetCustomers(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Primary Business / Growth Goal *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Increase monthly recurring sales by 40% and qualify high-ticket buyers faster"
              value={businessGoal}
              onChange={(e) => setBusinessGoal(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Calibrating AI Growth Engine...</span>
                </>
              ) : (
                <>
                  <span>Activate GrowthPilot AI Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
