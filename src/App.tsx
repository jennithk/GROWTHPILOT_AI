import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import {
  LayoutDashboard,
  BrainCircuit,
  Users,
  Zap,
  Menu,
} from 'lucide-react';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { GrowthStrategyPage } from './pages/GrowthStrategyPage';
import { LeadsPage } from './pages/LeadsPage';
import { NextBestActionPage } from './pages/NextBestActionPage';
import { CampaignGeneratorPage } from './pages/CampaignGeneratorPage';
import { CustomerEngagementPage } from './pages/CustomerEngagementPage';
import { GrowthInsightsPage } from './pages/GrowthInsightsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { BusinessProfilePage } from './pages/BusinessProfilePage';
import { SettingsPage } from './pages/SettingsPage';

// Components
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LeadModal } from './components/LeadModal';
import { api } from './services/api';
import { useToast } from './context/ToastContext';
import { Lead } from './types';

const MainRouter: React.FC = () => {
  const { user, business, isAuthenticated, isLoading } = useAuth();
  const { success, error } = useToast();

  // Navigation state
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [showLanding, setShowLanding] = useState<boolean>(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const [isQuickAddLeadOpen, setIsQuickAddLeadOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // If not authenticated and not explicitly in auth flow, default show landing
    if (!isLoading && !isAuthenticated) {
      setShowLanding(true);
    } else if (isAuthenticated) {
      setShowLanding(false);
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center animate-pulse">
          <span className="w-6 h-6 rounded-full bg-indigo-500 animate-ping" />
        </div>
        <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase font-mono">
          Initializing GrowthPilot AI...
        </p>
      </div>
    );
  }

  // If user is unauthenticated
  if (!isAuthenticated) {
    if (showLanding) {
      return (
        <LandingPage
          onGetStarted={() => {
            setAuthInitialMode('register');
            setShowLanding(false);
          }}
          onLogin={() => {
            setAuthInitialMode('login');
            setShowLanding(false);
          }}
        />
      );
    }

    return (
      <AuthPage
        initialMode={authInitialMode}
        onBackToLanding={() => setShowLanding(true)}
      />
    );
  }

  // If authenticated but no business configured, show onboarding
  if (!business) {
    return (
      <OnboardingPage
        onCompleted={() => {
          setCurrentPage('dashboard');
        }}
      />
    );
  }

  const handleQuickSaveLead = async (leadData: Partial<Lead>) => {
    try {
      await api.createLead(leadData);
      success('Lead Created', 'New prospect added to your sales pipeline');
      setIsQuickAddLeadOpen(false);
      // Trigger a page re-render/refresh if on leads page
      if (currentPage === 'leads') {
        window.dispatchEvent(new CustomEvent('lead-created'));
      }
    } catch (err: any) {
      error('Failed to create lead', err.message);
    }
  };

  // Render active dashboard tab
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentPage} />;
      case 'growth-strategy':
      case 'strategy':
        return <GrowthStrategyPage />;
      case 'leads':
        return <LeadsPage />;
      case 'next-best-action':
      case 'actions':
        return <NextBestActionPage />;
      case 'campaigns':
        return <CampaignGeneratorPage />;
      case 'engagement':
        return <CustomerEngagementPage />;
      case 'insights':
        return <GrowthInsightsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'business-profile':
      case 'profile':
        return <BusinessProfilePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 bg-geometric-grid">
      {/* Top Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={(tab) => {
          setCurrentPage(tab);
          setIsMobileMenuOpen(false);
        }}
        onAddLeadClick={() => setIsQuickAddLeadOpen(true)}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Main Container with Sidebar + Page Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex gap-6">
        {/* Sidebar (Desktop Sticky + Mobile Slide-Over) */}
        <Sidebar
          activeTab={currentPage}
          onSelectTab={(tab) => {
            setCurrentPage(tab);
            setIsMobileMenuOpen(false);
          }}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Page Content View */}
        <main className="flex-1 min-w-0 pb-20 lg:pb-12">
          {renderCurrentPage()}
        </main>
      </div>

      {/* Mobile Bottom Quick Navigation Bar (< lg) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 lg:hidden flex items-center justify-around py-1.5 px-2 shadow-lg transition-colors">
        <button
          onClick={() => {
            setCurrentPage('dashboard');
            setIsMobileMenuOpen(false);
          }}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all min-w-[56px] min-h-[44px] ${
            currentPage === 'dashboard'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">Dashboard</span>
        </button>

        <button
          onClick={() => {
            setCurrentPage('growth-strategy');
            setIsMobileMenuOpen(false);
          }}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all min-w-[56px] min-h-[44px] ${
            ['growth-strategy', 'strategy'].includes(currentPage)
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BrainCircuit className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">Strategy</span>
        </button>

        <button
          onClick={() => {
            setCurrentPage('leads');
            setIsMobileMenuOpen(false);
          }}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all min-w-[56px] min-h-[44px] ${
            currentPage === 'leads'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">Leads</span>
        </button>

        <button
          onClick={() => {
            setCurrentPage('next-best-action');
            setIsMobileMenuOpen(false);
          }}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all min-w-[56px] min-h-[44px] ${
            ['next-best-action', 'actions'].includes(currentPage)
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Zap className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">Actions</span>
        </button>

        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all min-w-[56px] min-h-[44px] ${
            isMobileMenuOpen
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">More</span>
        </button>
      </nav>

      {/* Global Quick Add Lead Modal */}
      <LeadModal
        isOpen={isQuickAddLeadOpen}
        onClose={() => setIsQuickAddLeadOpen(false)}
        onSave={handleQuickSaveLead}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <MainRouter />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
