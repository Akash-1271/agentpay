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
import { WireTraceModal } from './components/WireTraceModal';
import { CommandPalette } from './components/CommandPalette';
import { StepUpModal } from './components/StepUpModal';
import { ApiDocsModal } from './components/ApiDocsModal';
import { RazorpayLogo } from './components/RazorpayLogo';
import { DemoTourModal } from './components/DemoTourModal';
import { playPaymentSuccessChime } from './utils/soundEffects';
import { AP2DelegationMandate, AgentTransactionOutcome, AuditRecord } from './types';
import { api } from './services/api';
import { Menu, Zap, Search, Command, Play } from 'lucide-react';

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
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col selection:bg-[#0c83ff] selection:text-white font-sans antialiased">
      
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
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* Top App Header with Quick Search */}
        <header className="h-14 px-4 sm:px-8 border-b border-white/[0.07] bg-[#090d16]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05]"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-xs text-slate-400 hover:text-slate-200 transition-all group"
            >
              <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
              <span>Search commands, orders, or navigation...</span>
              <kbd className="font-mono text-[10px] text-slate-500 bg-white/5 px-1.5 py-0.2 rounded ml-4 border border-white/5">
                ⌘K
              </kbd>
            </button>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <button
              onClick={() => setIsDemoTourOpen(true)}
              className="px-3 py-1 rounded-md bg-[#0c83ff] hover:bg-[#0270e0] text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all animate-pulse"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>2-Min Demo Tour</span>
            </button>

            <button
              onClick={() => setIsWireTraceOpen(true)}
              className="hidden md:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] text-slate-300 font-mono text-[11px] transition-all"
            >
              <Zap className="w-3 h-3 text-[#0c83ff]" />
              <span>Protocol Wire</span>
            </button>

            <RazorpayLogo variant="badge" height={16} />
          </div>
        </header>

        {/* Global Toast Alert if any */}
        {toastMessage && (
          <div className="mx-4 sm:mx-8 mt-4 p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs font-mono flex items-center justify-between animate-in fade-in">
            <span>⚠️ {toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="text-rose-400 hover:text-white font-bold ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Main Content Router */}
        <main className="flex-1 px-4 sm:px-8 lg:px-10 py-8 max-w-7xl w-full mx-auto">
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

        {/* Footer */}
        <footer className="border-t border-white/[0.05] py-4 px-4 sm:px-8 text-slate-500 text-xs font-mono flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>AgentPay · Bounded payment infrastructure for agentic commerce</span>
          <span className="text-slate-400">Razorpay AI Buildathon · Track 01</span>
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
