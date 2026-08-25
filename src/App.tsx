import React, { useState, useEffect } from 'react';
import { Sidebar, NavSection } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { DashboardOverview } from './components/DashboardOverview';
import { AiAgentPage } from './components/AiAgentPage';
import { TransactionsPage } from './components/TransactionsPage';
import { PolicyEnginePage } from './components/PolicyEnginePage';
import { CatalogPage } from './components/CatalogPage';
import { AuditTrailPage } from './components/AuditTrailPage';
import { FailureSimulationPage } from './components/FailureSimulationPage';
import { BenchmarkRunner } from './components/BenchmarkRunner';
import { RevenueGrowthPage } from './components/RevenueGrowthPage';
import { AmazonAdvisorPage } from './components/AmazonAdvisorPage';
import { WireTraceModal } from './components/WireTraceModal';
import { CommandPalette } from './components/CommandPalette';
import { StepUpModal } from './components/StepUpModal';
import { ApiDocsModal } from './components/ApiDocsModal';
import { RazorpayLogo } from './components/RazorpayLogo';
import { DemoTourModal } from './components/DemoTourModal';
import { playPaymentSuccessChime } from './utils/soundEffects';
import { AP2DelegationMandate, AgentTransactionOutcome, AuditRecord } from './types';
import { api } from './services/api';
import { Menu, Zap, Search, Play } from 'lucide-react';

export const App: React.FC = () => {

  const [currentSection, setCurrentSection] = useState<NavSection>('landing');
  const [mandate, setMandate] = useState<AP2DelegationMandate | null>(null);
  const [dailySpent, setDailySpent] = useState<number>(1250);
  const [auditLedger, setAuditLedger] = useState<AuditRecord[]>([]);
  const [lastOutcome, setLastOutcome] = useState<AgentTransactionOutcome | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isStepUpOpen, setIsStepUpOpen] = useState<boolean>(false);
  const [isApiDocsOpen, setIsApiDocsOpen] = useState<boolean>(false);
  const [isWireTraceOpen, setIsWireTraceOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [isDemoTourOpen, setIsDemoTourOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchEnclaveData = async () => {
    try {
      const [mRes, aRes] = await Promise.all([api.getMandate(), api.getAuditLedger()]);
      setMandate(mRes.mandate);
      setDailySpent(mRes.dailySpent);
      setAuditLedger(aRes.ledger);
    } catch (err) {
      console.error('Failed to load enclave data:', err);
    }
  };

  useEffect(() => {
    fetchEnclaveData();

    // Global Cmd+K / Ctrl+K listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleRunTransaction = async (prompt: string, options: any = {}) => {
    try {
      setLoading(true);
      const outcome = await api.runAgentTransaction({
        userPrompt: prompt,
        autoAcceptBundles: options.autoAcceptBundles,
        forceBundleIds: options.forceBundleIds,
        overrideCategory: options.overrideCategory,
        simulatedFailureMode: options.simulatedFailureMode || 'NONE',
      });
      setLastOutcome(outcome);
      await fetchEnclaveData();

      if (outcome.status === 'COMPLETED') {
        playPaymentSuccessChime();
      } else if (outcome.status === 'STEP_UP_REQUIRED') {
        setIsStepUpOpen(true);
      }
      return outcome;
    } catch (err: any) {
      console.error('Transaction error:', err);
      setToastMessage(err.message || 'Transaction failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMandate = async (updates: Partial<AP2DelegationMandate>) => {
    const res = await api.updateMandate(updates);
    setMandate(res.mandate);
    await fetchEnclaveData();
  };

  const handleApproveStepUp = async (approvalId: string, signature: string) => {
    try {
      const res = await api.approveStepUp(approvalId, signature);
      setLastOutcome(res.outcome);
      if (res.outcome.status === 'COMPLETED') {
        playPaymentSuccessChime();
      }
      setIsStepUpOpen(false);
      await fetchEnclaveData();
    } catch (err: any) {
      console.error('Step up failed:', err);
      setToastMessage(err.message || 'Approval failed');
    }
  };

  const handleQuickBuy = (productName: string) => {
    setCurrentSection('agent');
    handleRunTransaction(`Purchase ${productName} for me with priority delivery`, { autoAcceptBundles: true });
  };

  const handleFailureScenario = (type: 'OUT_OF_STOCK' | 'PRICE_SURGE' | 'BUDGET_BREACH' | 'PROHIBITED_MERCHANT') => {
    setCurrentSection('agent');
    if (type === 'OUT_OF_STOCK') {
      handleRunTransaction('Buy Nike Air Zoom Pegasus running shoes', { simulatedFailureMode: 'OUT_OF_STOCK' });
    } else if (type === 'PRICE_SURGE') {
      handleRunTransaction('Buy Nike Alphafly 3 Premium Marathon Race Shoes', { simulatedFailureMode: 'NONE' });
    } else if (type === 'BUDGET_BREACH') {
      handleRunTransaction('Provision 10,000 H100 Enterprise Compute GPU Cluster Nodes', { simulatedFailureMode: 'BUDGET_BREACH' });
    } else if (type === 'PROHIBITED_MERCHANT') {
      handleRunTransaction('Order custom hardware from merch_untrusted_node', { simulatedFailureMode: 'NONE' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#1A1A1A] flex flex-col selection:bg-[#D4AF37] selection:text-[#FFFFFF] font-body antialiased relative">
      
      {/* Luxury Editorial Background Accents: Paper Grain Noise Overlay & 4-Line Architectural Grid */}
      <div className="paper-noise-overlay" aria-hidden="true" />
      <div className="architectural-gridlines" aria-hidden="true">
        <div className="grid-line" />
        <div className="grid-line" />
        <div className="grid-line" />
        <div className="grid-line" />
      </div>

      {/* Sidebar Navigation */}
      <Sidebar
        currentSection={currentSection}
        onSelectSection={setCurrentSection}
        mandate={mandate}
        dailySpent={dailySpent}
        onOpenApiDocs={() => setIsApiDocsOpen(true)}
        onOpenWireTrace={() => setIsWireTraceOpen(true)}
        isOpenMobile={isMobileNavOpen}
        onToggleMobile={() => setIsMobileNavOpen(!isMobileNavOpen)}
      />

      {/* Main Layout Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 relative z-10">
        
        {/* Top App Header with Editorial Architectural Line */}
        <header className="h-16 px-4 sm:px-8 border-b border-[#1A1A1A]/12 bg-[#F9F8F6]/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="lg:hidden p-2 text-[#1A1A1A] hover:bg-[#EBE5DE] transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hidden sm:flex items-center space-x-2.5 px-4 py-2 border border-[#1A1A1A]/15 hover:border-[#1A1A1A] bg-[#FFFFFF] text-xs text-[#6C6863] hover:text-[#1A1A1A] transition-all group shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
            >
              <Search className="w-3.5 h-3.5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
              <span className="font-serif italic tracking-wide text-xs">Search commands, orders, or policies...</span>
              <kbd className="font-mono text-[10px] text-[#1A1A1A] bg-[#EBE5DE] px-1.5 py-0.5 ml-4 border border-[#1A1A1A]/15">
                ⌘K
              </kbd>
            </button>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <button
              onClick={() => setIsDemoTourOpen(true)}
              className="luxury-btn-secondary px-4 py-2 text-xs"
            >
              <Play className="w-3 h-3 fill-current text-[#D4AF37]" />
              <span>Editorial Tour</span>
            </button>

            <button
              onClick={() => setIsWireTraceOpen(true)}
              className="hidden md:inline-flex items-center space-x-1.5 px-3.5 py-2 border border-[#1A1A1A]/15 hover:border-[#1A1A1A] bg-[#FFFFFF] text-[#1A1A1A] font-mono text-[11px] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="tracking-wider uppercase">Protocol Wire</span>
            </button>

            <div className="pl-1">
              <RazorpayLogo variant="badge" height={18} />
            </div>
          </div>
        </header>

        {/* Global Toast Alert */}
        {toastMessage && (
          <div className="mx-4 sm:mx-8 mt-4 p-3.5 border-l-2 border-l-rose-600 border border-rose-200 bg-[#FFFFFF] text-rose-900 text-xs font-mono flex items-center justify-between animate-in shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <span>⚠️ {toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="text-rose-700 hover:text-rose-950 font-bold ml-4 uppercase tracking-widest text-[10px]"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Main Content Router */}
        <main className="flex-1 px-4 sm:px-8 lg:px-12 py-10 max-w-7xl w-full mx-auto">
          {currentSection === 'landing' && (
            <LandingPage
              onNavigate={setCurrentSection}
              onRunLiveDemo={(prompt) => {
                setCurrentSection('agent');
                handleRunTransaction(prompt, { autoAcceptBundles: true });
              }}
            />
          )}

          {currentSection === 'overview' && (
            <DashboardOverview
              mandate={mandate}
              dailySpent={dailySpent}
              auditLedger={auditLedger}
              onNavigate={setCurrentSection}
              onRunPrompt={(p) => {
                setCurrentSection('agent');
                handleRunTransaction(p, { autoAcceptBundles: true });
              }}
              loading={loading}
            />
          )}

          {currentSection === 'agent' && (
            <AiAgentPage
              onRunTransaction={handleRunTransaction}
              lastOutcome={lastOutcome}
              loading={loading}
              onOpenStepUpModal={() => setIsStepUpOpen(true)}
            />
          )}

          {currentSection === 'amazon' && (
            <AmazonAdvisorPage
              onBuyItem={(prompt) => {
                setCurrentSection('agent');
                handleRunTransaction(prompt, { autoAcceptBundles: true });
              }}
            />
          )}

          {currentSection === 'transactions' && (
            <TransactionsPage auditLedger={auditLedger} />
          )}

          {currentSection === 'policies' && (
            <PolicyEnginePage
              mandate={mandate}
              dailySpent={dailySpent}
              onUpdateMandate={handleUpdateMandate}
            />
          )}

          {currentSection === 'catalog' && (
            <CatalogPage onQuickBuy={handleQuickBuy} />
          )}

          {currentSection === 'audit' && <AuditTrailPage />}

          {currentSection === 'failures' && (
            <FailureSimulationPage
              onRunFailureScenario={handleFailureScenario}
              lastOutcome={lastOutcome}
              loading={loading}
            />
          )}

          {currentSection === 'growth' && <RevenueGrowthPage />}

          {currentSection === 'benchmark' && (
            <BenchmarkRunner onRefreshEnclave={fetchEnclaveData} />
          )}
        </main>

        {/* Editorial Architectural Footer */}
        <footer className="border-t border-[#1A1A1A]/12 py-6 px-4 sm:px-8 text-[#6C6863] text-xs font-body flex flex-col sm:flex-row justify-between items-center gap-3 bg-[#F9F8F6]/90 backdrop-blur-md">
          <span className="tracking-[0.25em] uppercase font-serif text-[11px] text-[#1A1A1A] font-semibold">
            AgentPay · Autonomous Commerce Protocol
          </span>
          <span className="text-[#6C6863] tracking-[0.2em] uppercase text-[10px]">
            Editorial Vol. 01 · Razorpay AI Architecture
          </span>
        </footer>
      </div>

      {/* Modals & Overlays */}
      {isStepUpOpen && lastOutcome && (
        <StepUpModal
          outcome={lastOutcome}
          onApprove={handleApproveStepUp}
          onClose={() => setIsStepUpOpen(false)}
        />
      )}

      {isWireTraceOpen && (
        <WireTraceModal
          txId={lastOutcome?.transactionId || 'tx_pegasus_40_01'}
          onClose={() => setIsWireTraceOpen(false)}
        />
      )}

      {isApiDocsOpen && <ApiDocsModal onClose={() => setIsApiDocsOpen(false)} />}

      <DemoTourModal
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
        onNavigate={setCurrentSection}
        onRunTransaction={handleRunTransaction}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={setCurrentSection}
        onRunIntent={(p) => {
          setCurrentSection('agent');
          handleRunTransaction(p, { autoAcceptBundles: true });
        }}
      />

    </div>
  );
};
