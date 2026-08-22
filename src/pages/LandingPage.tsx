import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Zap,
  Users,
  Megaphone,
  MessageSquareShare,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  Flame,
  ChevronRight,
  Play,
  Layers,
  Sun,
  Moon,
  Download,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { usePWA } from '../context/PWAContext';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onDemoLogin?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onLogin,
  onDemoLogin = onLogin,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { openInstallModal, isInstalled } = usePWA();
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);

  const workflowSteps = [
    {
      label: '1. INPUT',
      title: 'Business & Lead Ingestion',
      desc: 'Enter your products, target markets, and inbound prospect inquiries into the autonomous engine.',
      icon: Users,
    },
    {
      label: '2. ANALYZE',
      title: 'Deep AI Qualification',
      desc: 'Gemini analyzes intent signals, company fit, urgency, and purchase timelines in milliseconds.',
      icon: BrainCircuit,
    },
    {
      label: '3. DECIDE',
      title: 'Scoring & Prioritization',
      desc: 'Prospects are objectively scored 0-100 and classified into Hot, Warm, and Cold action streams.',
      icon: Flame,
    },
    {
      label: '4. RECOMMEND',
      title: 'Next Best Action Engine',
      desc: 'The agent computes the exact closing tactic, timing, and tailored offer for each deal.',
      icon: Zap,
    },
    {
      label: '5. GENERATE ACTION',
      title: 'Multi-Channel Execution',
      desc: 'Instant personalized follow-ups, 3-day marketing campaigns, and objection rebuttals are prepared.',
      icon: Megaphone,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white font-sans transition-colors duration-200 bg-geometric-grid">
      {/* Top Navigation */}
      <nav className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight font-display">
              GROWTHPILOT <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-mono">AI</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#agents" className="hover:text-slate-900 dark:hover:text-white transition-colors">AI Agents</a>
            <a href="#workflow" className="hover:text-slate-900 dark:hover:text-white transition-colors">How It Works</a>
            <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">Features</a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {!isInstalled && (
              <button
                onClick={openInstallModal}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-all shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install App</span>
              </button>
            )}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
            <button
              onClick={onLogin}
              className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onDemoLogin}
              className="hidden sm:inline-flex text-xs font-semibold px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Live Demo
            </button>
            <button
              onClick={onGetStarted}
              className="text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden">
        {/* Glow gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/15 dark:bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-violet-500/10 dark:bg-violet-600/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Your Autonomous AI Sales & Customer Growth Agent</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6">
            Turn Leads Into Growth <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-600 dark:from-indigo-400 dark:via-violet-300 dark:to-sky-400">
              With Autonomous AI.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
            GrowthPilot AI empowers small businesses and startups to identify target customers, qualify inbound prospects, generate personalized campaigns, and recommend next best actions—fully automated.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Start Free Growth Trial</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onDemoLogin}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-2 active:scale-98"
            >
              <Play className="w-4 h-4 text-indigo-600 dark:text-indigo-400 fill-indigo-600 dark:fill-indigo-400" />
              <span>Explore Instant Demo</span>
            </button>
          </div>

          {/* Trust points */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> No Credit Card Required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Gemini 2.5 Agentic Engine
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Instant Pipeline Setup
            </span>
          </div>
        </div>

        {/* Product Dashboard Preview Mockup */}
        <div className="max-w-6xl mx-auto mt-16 px-4 sm:px-6 relative z-10">
          <div className="p-2 rounded-2xl bg-gradient-to-b from-slate-200/80 to-slate-300/80 dark:from-slate-700/60 dark:to-slate-900/80 border border-slate-300/80 dark:border-slate-700/80 shadow-2xl shadow-indigo-950/10 dark:shadow-indigo-950/50">
            <div className="rounded-xl bg-white dark:bg-slate-900 p-6 overflow-hidden border border-slate-200 dark:border-slate-800">
              {/* Simulated UI Bar */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-xs font-mono text-slate-400 dark:text-slate-500">growthpilot-agent://dashboard</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>Agent Status: Online</span>
                </div>
              </div>

              {/* Sample Dashboard Preview Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1 font-semibold">
                    <span>High-Intent Prospects</span>
                    <Flame className="w-4 h-4 text-rose-500" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">4 Hot Leads</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">94% average close probability</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1 font-semibold">
                    <span>Next Best Action</span>
                    <Zap className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Send 48h VIP Digital Proof</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Stanford Tech Summit ($3,200 deal)</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1 font-semibold">
                    <span>AI Campaign Active</span>
                    <Megaphone className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Spring Apparel Flash Blitz</p>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-1">3 Captions + 3-Day Rollout Ready</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Autonomous Workflow Section */}
      <section id="workflow" className="py-20 bg-slate-100/70 dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Autonomous Agent Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-2">
              From Inquiry to Conversion in 5 Autonomous Steps
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-3">
              GrowthPilot AI eliminates manual sales guesswork with a continuous decision-making feedback loop.
            </p>
          </div>

          {/* Stepper Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-8">
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeWorkflowStep === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveWorkflowStep(idx)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20 dark:bg-indigo-600/20 dark:border-indigo-500 dark:text-white'
                      : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`} />
                    <span className="text-[11px] font-bold uppercase">{step.label}</span>
                  </div>
                  <p className={`text-xs font-semibold truncate ${isActive ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                    {step.title}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Step Details */}
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-left">
              <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                PHASE 0{activeWorkflowStep + 1}
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {workflowSteps[activeWorkflowStep].title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mt-3">
                {workflowSteps[activeWorkflowStep].desc}
              </p>
              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={onGetStarted}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <span>Experience This Agent</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="w-full md:w-80 p-5 rounded-xl bg-slate-900 text-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-3 font-mono">
              <div className="text-indigo-400 font-bold flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Agent Decision Pipeline</span>
              </div>
              <div className="p-2.5 rounded bg-slate-800 text-slate-200 text-[11px] border border-slate-700">
                {activeWorkflowStep === 0 && '📥 Ingestion: Received prospect with $2.5k target order.'}
                {activeWorkflowStep === 1 && '🧠 Analysis: Validated 3 urgency signals and decision authority.'}
                {activeWorkflowStep === 2 && '🔥 Decision: Score 92/100 -> Classified as Hot Lead.'}
                {activeWorkflowStep === 3 && '⚡ Recommendation: Schedule 15-min VIP proposal within 2 hours.'}
                {activeWorkflowStep === 4 && '🚀 Generation: Prepared custom mockup + tailored WhatsApp draft.'}
              </div>
              <div className="text-[10px] text-emerald-400">Status: Automated agent execution ready</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section id="agents" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Complete Growth Suite
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-2">
            6 Specialized AI Agents Working For Your Business
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-3">
            Not just a chatbot—a complete autonomous business acceleration platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Agent 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 shadow-sm transition-all group">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Growth Strategy Agent</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Analyzes your business model across 10 strategic dimensions, including ICP profiling, channel allocation, and 3 high-priority execution tactics.
            </p>
          </div>

          {/* Agent 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500/50 dark:hover:border-rose-500/50 shadow-sm transition-all group">
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Lead Scoring Agent</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Calculates 0-100 lead scores, categorizes Hot/Warm/Cold prospects, identifies purchase intent, and drafts high-converting follow-up messages.
            </p>
          </div>

          {/* Agent 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 dark:hover:border-amber-500/50 shadow-sm transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Next Best Action Agent</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Evaluates deal stage and communication history to prescribe the single most impactful closing step with clear decision rationale.
            </p>
          </div>

          {/* Agent 4 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 dark:hover:border-sky-500/50 shadow-sm transition-all group">
            <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Megaphone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Campaign Generator</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Creates tailored marketing copy, hooks, CTAs, and actionable 3-day plans for Instagram, LinkedIn, Email, and WhatsApp in seconds.
            </p>
          </div>

          {/* Agent 5 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-violet-500/50 dark:hover:border-violet-500/50 shadow-sm transition-all group">
            <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <MessageSquareShare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Customer Engagement Agent</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Generates personalized welcome, re-engagement, upselling, and thank-you communications adapted for Professional, Friendly, or Persuasive tones.
            </p>
          </div>

          {/* Agent 6 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 shadow-sm transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Growth Insights Agent</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Diagnoses sales bottlenecks, analyzes channel conversion velocity, flags stale prospects, and delivers prioritized tactical recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-16 bg-slate-900 text-white dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to Automate Your Business Growth?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mb-8 max-w-2xl mx-auto">
            Join hundreds of high-growth small businesses using GrowthPilot AI to qualify leads and scale conversions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onDemoLogin}
              className="px-6 py-3.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 text-sm font-semibold transition-colors"
            >
              Explore Live Demo Pipeline
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 py-8 text-center text-xs text-slate-500 dark:text-slate-500 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 GrowthPilot AI. Autonomous AI Sales & Customer Growth Platform.</p>
          <p className="text-slate-500 dark:text-slate-400">Powered by Google Gemini & Agentic Workflows</p>
        </div>
      </footer>
    </div>
  );
};
