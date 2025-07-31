'use client';

import { useState } from 'react';
import { Modal } from './modal';
import { TokenSwapCards } from './cards/tokenSwapCard';
import { SimulationCards } from './cards/simulationCard';
import { GovernanceCard } from './cards/governanceCard';
import { LoadingSkeleton } from './loadingSkeleton';
import { useBalances } from '@/hooks/useBalances';

type VotingStatus = 'vote' | 'voting' | 'voted' | null;

const GOVERNANCE_CONFIG = {
  fundingGoal: 1000,
  currentFunding: 650,
  proposalTitle: 'Solar Farm Project',
  votingEndTime: '2d 14h 20m',
};

export const BentoCards = () => {
  const [votingStatus, setVotingStatus] = useState<VotingStatus>(null);
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);

  const { hbarBalance, bgsBalance, bgsOperatorBalance, isLoading } =
    useBalances();

  const handleVote = (action: 'vote' | 'voting' | 'voted') => {
    setVotingStatus(action);
    // Simulate voting process
    if (action === 'voting') {
      setTimeout(() => {
        setVotingStatus('voted');
      }, 2000);
    }
  };

  const handleSwapClick = () => {
    setIsStakeModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsStakeModalOpen(false);
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <TokenSwapCards
          bgsBalance={bgsBalance}
          hbarBalance={hbarBalance}
          bgsOperatorBalance={bgsOperatorBalance}
          onSwapClick={handleSwapClick}
        />

        <SimulationCards />

        <GovernanceCard
          votingStatus={votingStatus}
          onVote={handleVote}
          fundingGoal={GOVERNANCE_CONFIG.fundingGoal}
          currentFunding={GOVERNANCE_CONFIG.currentFunding}
          proposalTitle={GOVERNANCE_CONFIG.proposalTitle}
          votingEndTime={GOVERNANCE_CONFIG.votingEndTime}
        />
      </div>

      <Modal
        isOpen={isStakeModalOpen}
        onClose={handleCloseModal}
        biogasBalance={Number(bgsOperatorBalance)}
        ownedHbar={Number(hbarBalance)}
        ownedBiogas={Number(bgsBalance)}
      />
    </div>
  );
};
