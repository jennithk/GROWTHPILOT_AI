import React from 'react';
import {
  LayoutDashboard,
  Building2,
  BrainCircuit,
  Users,
  Zap,
  Megaphone,
  MessageSquareShare,
  TrendingUp,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
  ChevronRight,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeTab?: string;
  currentPage?: string;
  onSelectTab?: (tab: string) => void;
  onNavigate?: (tab: string) => void;
  leadCounts?: { total: number; hot: number };
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  currentPage,
  onSelectTab,
  onNavigate,
  leadCounts,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const { logout, business } = useAuth();
  const current = activeTab || currentPage || 'dashboard';
  const handleNav = (tabId: string) => {
    if (onSelectTab) onSelectTab(tabId);
    else if (onNavigate) onNavigate(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, aliases: ['dashboard'] },
    { id: 'business-profile', label: 'Business Profile', icon: Building2, aliases: ['business-profile', 'profile'] },
    {
      id: 'growth-strategy',
      label: 'AI Growth Agent',
      icon: BrainCircuit,
      badge: 'Strategy',
      badgeColor: 'bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20',
      aliases: ['growth-strategy', 'strategy'],
    },
    {
      id: 'leads',
      label: 'Leads & Scoring',
      icon: Users,
      count: leadCounts?.total,
      hotCount: leadCounts?.hot,
      aliases: ['leads'],
    },
    {
      id: 'next-best-action',
      label: 'Next Best Action',
      icon: Zap,
      badge: 'Agentic',
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
      aliases: ['next-best-action', 'actions'],
    },
    { id: 'campaigns', label: 'Campaign Generator', icon: Megaphone, aliases: ['campaigns'] },
    { id: 'engagement', label: 'Customer Engagement', icon: MessageSquareShare, aliases: ['engagement'] },
    { id: 'insights', label: 'Growth Insights', icon: TrendingUp, aliases: ['insights'] },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, aliases: ['analytics'] },
    { id: 'settings', label: 'Settings', icon: Settings, aliases: ['settings'] },
  ];

  const renderContent = (isMobile = false) => (
    <>
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5 font-display">
              GrowthPilot
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 font-semibold">
                AI
              </span>
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-tight">
              Autonomous Sales Agent
            </p>
          </div>
        </div>
        {isMobile && onCloseMobile && (
          <button
            onClick={onCloseMobile}
            aria-label="Close navigation"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Business Quick Pill */}
      {business && (
        <div className="mx-3 mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50">
          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono mb-1">
            <span className="font-semibold uppercase tracking-wider text-[9px]">Organization</span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Live
            </span>
          </div>
          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
            {business.businessName}
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
            {business.industry}
          </p>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="px-2 pb-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
          Agent Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.aliases.includes(current);
          return (
            <button
              key={item.id}
              id={`nav-${item.id}${isMobile ? '-mobile' : ''}`}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20 dark:bg-indigo-600 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                {item.badge && (
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {typeof item.count === 'number' && item.count > 0 && (
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
                {typeof item.hotCount === 'number' && item.hotCount > 0 && (
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center gap-0.5"
                    title={`${item.hotCount} Hot Leads`}
                  >
                    🔥 {item.hotCount}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar (Hidden on mobile and tablets < lg) */}
      <aside className="hidden lg:flex w-64 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm text-slate-700 dark:text-slate-300 flex-col shrink-0 sticky top-20 h-[calc(100vh-6.5rem)] select-none overflow-hidden transition-colors">
        {renderContent(false)}
      </aside>

      {/* Mobile Slide-Over Drawer (Visible on < lg when open) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="relative w-80 max-w-[85vw] bg-white dark:bg-slate-900 shadow-2xl flex flex-col h-full z-10 border-r border-slate-200 dark:border-slate-800 animate-in slide-in-from-left duration-200">
            {renderContent(true)}
          </div>
        </div>
      )}
    </>
  );
};

