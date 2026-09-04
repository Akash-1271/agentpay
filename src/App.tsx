import React, { useState, useEffect } from 'react';
import { Sidebar, NavSection } from './components/Sidebar';
import { CinematicLanding } from './components/landing/CinematicLanding';
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
import { HackathonShowcaseModal } from './components/HackathonShowcaseModal';
import { LiveWebhookStreamModal } from './components/LiveWebhookStreamModal';
import { playPaymentSuccessChime } from './utils/soundEffects';
import { isVoiceEnabled, setVoiceEnabled, speakAgentMessage } from './utils/speechNarrator';
import { AP2DelegationMandate, AgentTransactionOutcome, AuditRecord } from './types';
import { api } from './services/api';
import { Menu, Zap, Search, Play, Volume2, VolumeX, Trophy, Radio } from 'lucide-react';

const SECTION_TITLES: Record<NavSection, string> = {
  landing: 'Cinematic Landing',
  overview: 'Executive Overview',
  agent: 'AI Agent Arena',
  amazon: 'Advisor & Reviews',
  transactions: 'History & Cryptographic Ledger',
  policies: 'Spending Mandates & Enclave',
  catalog: 'Verified Merchant Catalog',
  growth: 'Merchant Yield & Cart Recovery',
  benchmark: 'Multi-Agent Stress Benchmarks',
  failures: 'Exception Containment & Gating',
  audit: 'Cryptographic Audit Trail',
};

export const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<NavSection>('landing');
  const [mandate, setMandate] = useState<AP2DelegationMandate | null>(null);
  const [dailySpent, setDailySpent] = useState<number>(1250);
  const [auditLedger, setAuditLedger] = useState<AuditRecord[]>([]);
  const [lastOutcome, setLastOutcome] = useState<AgentTransactionOutcome | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [voiceOn, setVoiceOn] = useState<boolean>(false);
  const [isStepUpOpen, setIsStepUpOpen] = useState<boolean>(false);
  const [isApiDocsOpen, setIsApiDocsOpen] = useState<boolean>(false);
  const [isWireTraceOpen, setIsWireTraceOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [isDemoTourOpen, setIsDemoTourOpen] = useState<boolean>(false);
  const [isRubricOpen, setIsRubricOpen] = useState<boolean>(false);
  const [isWebhookStreamOpen, setIsWebhookStreamOpen] = useState<boolean>(false);
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

  const toggleVoice = () => {
    const nextState = !voiceOn;
    setVoiceOn(nextState);
    setVoiceEnabled(nextState);
  };

  const handleRunTransaction = async (prompt: string, options: any = {}) => {
    try {
      setLoading(true);
      speakAgentMessage(`Evaluating intent: ${prompt}`);

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
        speakAgentMessage(`Enclave bounds verified. Order captured and settled via Razorpay.`);
      } else if (outcome.status === 'STEP_UP_REQUIRED') {
        setIsStepUpOpen(true);
        speakAgentMessage(`Single-purchase threshold exceeded. Biometric passkey step-up required.`);
      } else if (outcome.status === 'REJECTED_POLICY') {
        speakAgentMessage(`Transaction blocked by spending mandate. Zero card exposure.`);
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
        speakAgentMessage(`Biometric authorization verified. Payment captured.`);
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
    <div className="min-h-screen bg-[#0a0a0a] text-stone-100 flex flex-col selection:bg-[#a78b71]/30 selection:text-white font-sans antialiased relative dot-grid-bg">
      
      {/* ── A. Full-Bleed Cinematic Landing Page ── */}
      {currentSection === 'landing' ? (
        <CinematicLanding
          onNavigate={setCurrentSection}
          onRunLiveDemo={(prompt) => {
            setCurrentSection('agent');
            handleRunTransaction(prompt, { autoAcceptBundles: true });
          }}
        />
      ) : (
        /* ── B. Product App Shell (Sidebar + Workspace) ── */
        <div className="flex-1 flex flex-col min-h-screen relative">
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

          {/* Main Content Layout with 64-unit (256px) Offset */}
          <div className="flex-1 lg:pl-64 flex flex-col min-w-0 relative z-10">
            {/* Top App Header */}
            <header className="h-16 px-4 sm:px-8 border-b border-white/10 bg-[#0a0a0a]/85 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsMobileNavOpen(true)}
                  className="lg:hidden p-2 text-stone-300 hover:bg-white/5 rounded-lg transition-colors"
                  aria-label="Open navigation menu"
                >
                  <Menu className="w-5 h-5" />
                </button>

                {/* Section Title in Playfair Display Italic */}
                <h1 className="font-playfair text-lg sm:text-xl text-stone-100 font-bold tracking-tight hidden md:block">
                  {SECTION_TITLES[currentSection] || 'AgentPay'}
                </h1>

                <button
                  onClick={() => setIsCommandPaletteOpen(true)}
                  className="hidden sm:flex items-center space-x-2.5 px-3 py-1.5 border border-white/10 hover:border-[#a78b71]/50 bg-white/[0.03] rounded-xl text-xs text-stone-400 hover:text-stone-200 transition-all group shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                >
                  <Search className="w-3.5 h-3.5 text-[#c9b8a0] group-hover:scale-110 transition-transform" />
                  <span className="font-sans text-xs">Search commands, orders, or policies...</span>
                  <kbd className="font-mono text-[10px] text-stone-300 bg-white/10 px-1.5 py-0.5 ml-3 border border-white/10 rounded-md">
                    ⌘K
                  </kbd>
                </button>
              </div>

              <div className="flex items-center space-x-2.5 text-xs">
                {/* Live Status Pill */}
                <div className="hidden sm:inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-emerald-400 text-[10px] tracking-wider uppercase">LIVE</span>
                  <span className="text-stone-400 text-[10px] border-l border-emerald-500/20 pl-2 font-mono">Enclave Bounded</span>
                </div>

                {/* Hackathon Judging Rubric & Demo Scenarios */}
                <button
                  onClick={() => setIsRubricOpen(true)}
                  className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 border border-[#a78b71]/30 hover:border-[#a78b71]/60 bg-[#a78b71]/10 hover:bg-[#a78b71]/20 text-[#e8d5b7] rounded-xl text-xs font-medium transition-all shadow-[0_0_15px_rgba(167,139,113,0.15)]"
                >
                  <Trophy className="w-3.5 h-3.5 text-[#c9b8a0]" />
                  <span>Rubric</span>
                </button>

                {/* Live Webhook Stream Inspector */}
                <button
                  onClick={() => setIsWebhookStreamOpen(true)}
                  className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 border border-white/10 hover:border-[#a78b71]/40 bg-white/[0.03] text-stone-300 rounded-xl text-xs font-mono transition-all"
                >
                  <Radio className="w-3.5 h-3.5 text-[#c9b8a0] animate-pulse" />
                  <span>Webhooks</span>
                </button>

                {/* Voice Narrator Toggle */}
                <button
                  onClick={toggleVoice}
                  title={voiceOn ? 'Voice Narration ON' : 'Voice Narration OFF'}
                  className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 border transition-all ${
                    voiceOn
                      ? 'border-[#a78b71] bg-[#a78b71]/20 text-[#e8d5b7] font-semibold shadow-[0_0_15px_rgba(167,139,113,0.25)]'
                      : 'border-white/10 bg-white/[0.02] text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {voiceOn ? (
                    <Volume2 className="w-3.5 h-3.5 text-[#e8d5b7] animate-pulse" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                  )}
                  <span className="hidden sm:inline font-sans">{voiceOn ? 'Voice Active' : 'Voice'}</span>
                </button>

                {/* Editorial Tour */}
                <button
                  onClick={() => setIsDemoTourOpen(true)}
                  className="btn-gold-secondary px-3.5 py-1.5 text-xs rounded-xl"
                >
                  <Play className="w-3 h-3 fill-current text-[#c9b8a0]" />
                  <span className="hidden sm:inline">Tour</span>
                </button>

                {/* Protocol Wire */}
                <button
                  onClick={() => setIsWireTraceOpen(true)}
                  className="hidden lg:inline-flex items-center space-x-1.5 px-3 py-1.5 border border-white/10 hover:border-[#a78b71]/40 bg-white/[0.02] rounded-xl text-stone-300 font-mono text-[11px] transition-all"
                >
                  <Zap className="w-3.5 h-3.5 text-[#c9b8a0]" />
                  <span className="tracking-wider uppercase">Wire</span>
                </button>

                <div className="pl-1">
                  <RazorpayLogo variant="badge" height={18} />
                </div>
              </div>
            </header>

            {/* Global Toast Alert */}
            {toastMessage && (
              <div className="mx-4 sm:mx-8 mt-4 p-3.5 border-l-2 border-l-rose-500 border border-rose-500/20 bg-black/60 backdrop-blur-md text-rose-300 text-xs font-mono flex items-center justify-between animate-in shadow-[0_2px_8px_rgba(0,0,0,0.5)] rounded-r-xl">
                <span>⚠️ {toastMessage}</span>
                <button
                  onClick={() => setToastMessage(null)}
                  className="text-rose-400 hover:text-rose-200 font-bold ml-4 uppercase tracking-widest text-[10px]"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Main Content Router */}
            <main className="flex-1 px-4 sm:px-8 lg:px-12 py-10 max-w-7xl w-full mx-auto">
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
        <footer className="border-t border-white/10 py-6 px-4 sm:px-8 text-slate-400 text-xs font-body flex flex-col sm:flex-row justify-between items-center gap-3 bg-[#080B11]/90 backdrop-blur-md">
          <span className="tracking-[0.2em] uppercase font-mono text-[11px] text-slate-200 font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0C83FF]" />
            AgentPay · Autonomous Commerce Protocol
          </span>
          <span className="text-slate-400 tracking-[0.15em] uppercase text-[10px] font-mono">
            Track 01 · Razorpay AI Architecture
          </span>
        </footer>
      </div>
    </div>
  )}
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

      <HackathonShowcaseModal
        isOpen={isRubricOpen}
        onClose={() => setIsRubricOpen(false)}
        onNavigate={setCurrentSection}
        onRunTransaction={handleRunTransaction}
      />

      <LiveWebhookStreamModal
        isOpen={isWebhookStreamOpen}
        onClose={() => setIsWebhookStreamOpen(false)}
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
