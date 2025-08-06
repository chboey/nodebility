'use client';

import { useState } from 'react';
import { SwapModal } from './swapModal';
import { TokenSwapCards } from './cards/tokenSwapCard';
import { SimulationCards } from './cards/simulationCard';
import { GovernanceCard } from './cards/governanceCard';
import { LoadingSkeleton } from './loadingSkeleton';
import { useBalances } from '@/hooks/useBalances';
import { useVotingProgress } from '@/hooks/useVotingProgress';
import { useActiveProposal } from '@/hooks/useActiveProposal';
import { getVotingProgress } from '@/action/votingProgress';

type VotingStatus = 'vote' | 'voting' | 'voted' | null;

export const BentoCards = () => {
  const [votingStatus, setVotingStatus] = useState<VotingStatus>(null);
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);

  const {
    hbarBalance,
    bgsBalance,
    bgsOperatorBalance,
    isLoading: balancesLoading,
    refetch,
  } = useBalances();
  const { fetchProgress, progress } = useVotingProgress();
  const { activeProposals } = useActiveProposal();

  // Centralized loading state
  const isLoading = balancesLoading;

  const handleVote = (action: 'vote' | 'voting' | 'voted') => {
    setVotingStatus(action);
  };

  const handleSwapClick = () => {
    setIsStakeModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsStakeModalOpen(false);
  };

  const handleSuccess = async () => {
    await fetchProgress();
    await refetch();
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
          fundingGoal={progress?.project_cost || 100}
          currentFunding={progress?.funded || 0}
          contractAddress={activeProposals[0]?.contractAddress}
          proposalTitle={activeProposals[0]?.project_title}
          votingEndTime={activeProposals[0]?.votingTimerHours}
          createdAt={activeProposals[0]?.createdAt}
          topicId={activeProposals[0]?.topicId}
          bgsBalance={bgsBalance}
          onSuccess={handleSuccess}
        />
      </div>

      <SwapModal
        isOpen={isStakeModalOpen}
        onClose={handleCloseModal}
        biogasBalance={Number(bgsOperatorBalance)}
        ownedHbar={Number(hbarBalance)}
        ownedBiogas={Number(bgsBalance)}
        onSuccess={handleSuccess}
      />
    </div>
  );
};
