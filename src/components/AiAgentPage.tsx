import React from 'react';
import { AgentTransactionOutcome } from '../types';
import { LiveArena } from './LiveArena';

interface AiAgentPageProps {
  onRunTransaction: (prompt: string, options?: any) => Promise<AgentTransactionOutcome>;
  lastOutcome: AgentTransactionOutcome | null;
  loading: boolean;
  onOpenStepUpModal: () => void;
}

export const AiAgentPage: React.FC<AiAgentPageProps> = ({
  onRunTransaction,
  lastOutcome,
  loading,
  onOpenStepUpModal,
}) => {
  return (
    <div className="space-y-6 animate-in">
      <LiveArena
        onRunTransaction={onRunTransaction}
        lastOutcome={lastOutcome}
        loading={loading}
        onOpenStepUpModal={onOpenStepUpModal}
      />
    </div>
  );
};
