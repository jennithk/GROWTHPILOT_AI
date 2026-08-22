import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Sparkles,
  Sun,
  Moon,
  LogOut,
  Building2,
  ChevronRight,
  Plus,
  Menu,
} from 'lucide-react';

interface NavbarProps {
  currentTab?: string;
  currentPage?: string;
  onNavigate: (tab: string) => void;
  onAddLeadClick?: () => void;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  currentPage,
  onNavigate,
  onAddLeadClick,
  onToggleMobileMenu,
}) => {
  const { user, business, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const activeTab = currentTab || currentPage || 'dashboard';

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Executive Dashboard';
      case 'business-profile':
      case 'profile':
        return 'Business Profile & ICP';
      case 'growth-strategy':
      case 'strategy':
        return 'AI Growth Strategy';
      case 'leads':
        return 'Pipeline & AI Scoring';
      case 'next-best-action':
      case 'actions':
        return 'Next Best Action';
      case 'campaigns':
        return 'Campaign Generator';
      case 'engagement':
        return 'Customer Messaging';
      case 'insights':
        return 'Growth Insights';
      case 'analytics':
        return 'Pipeline Analytics';
      case 'settings':
        return 'System Settings';
      default:
        return 'GrowthPilot Command';
    }
  };

  return (
    <header className="h-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-3 sm:px-6 lg:px-8 transition-colors">
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Hamburger Toggle (< lg) */}
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            aria-label="Open mobile menu"
            className="lg:hidden p-2.5 -ml-1 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Geometric Brand/Breadcrumb */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">
          <button
            onClick={() => onNavigate('dashboard')}
            className="font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-wider text-[11px] sm:text-xs"
          >
            GrowthPilot
          </button>
          <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
          <span className="font-sans font-semibold text-slate-800 dark:text-slate-200 text-xs sm:text-sm capitalize truncate max-w-[130px] sm:max-w-[220px] md:max-w-none">
            {getPageTitle()}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Quick Add Lead Button */}
        {onAddLeadClick && (
          <button
            onClick={onAddLeadClick}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm shadow-indigo-600/20 transition-all active:scale-95 min-h-[36px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Prospect</span>
            <span className="sm:hidden text-[11px]">Add</span>
          </button>
        )}

        {/* Active Business Badge */}
        {business && (
          <button
            onClick={() => onNavigate('business-profile')}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:border-indigo-500/40 transition-colors"
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-500" />
            <span className="max-w-[120px] lg:max-w-[150px] truncate font-semibold">{business.businessName}</span>
          </button>
        )}

        {/* AI Agent Status Pill with Geometric Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden md:inline text-[11px] font-semibold">Gemini 2.5</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle color theme"
          className="p-2 sm:p-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all min-w-[40px] min-h-[40px] flex items-center justify-center"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* User Info & Quick Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center font-display shadow-sm shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
              {user?.name || 'Business User'}
            </p>
            <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
              {user?.email}
            </p>
          </div>

          <button
            onClick={logout}
            title="Sign Out"
            aria-label="Sign Out"
            className="p-2 text-slate-400 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

