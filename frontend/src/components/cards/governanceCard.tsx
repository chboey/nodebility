'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Vote, Clock, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { voteProposals } from '@/hooks/useVoteProposal';
import { useAccount } from 'wagmi';
import { config } from '@/config/wagmi';
import { VotingModal } from '../votingModal';

type VotingStatus = 'vote' | 'voting' | 'voted' | null;

interface GovernanceCardProps {
  votingStatus: VotingStatus;
  onVote: (action: 'vote' | 'voting' | 'voted') => void;
  fundingGoal: number;
  currentFunding: number;
  contractAddress: string;
  proposalTitle?: string;
  votingEndTime?: number;
  userBalance?: number; // Add user balance prop
  bgsBalance?: string;
  topicId?: string;
  createdAt?: Date;
}

export const GovernanceCard = ({
  votingStatus,
  onVote,
  fundingGoal,
  currentFunding,
  contractAddress,
  proposalTitle,
  votingEndTime,
  bgsBalance,
  topicId,
  createdAt,
}: GovernanceCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fundingProgress = (currentFunding / fundingGoal) * 100;

  const formattedEndTime = (() => {
    if (createdAt && votingEndTime) {
      const createdAtDate = new Date(createdAt);
      const timeExpiration = new Date(
        createdAtDate.getTime() + votingEndTime * 60 * 60 * 1000
      );

      const day = String(timeExpiration.getDate()).padStart(2, '0');
      const month = String(timeExpiration.getMonth() + 1).padStart(2, '0');
      const year = timeExpiration.getFullYear();

      return `${day}-${month}-${year}`;
    }
    return '--';
  })();
  const account = useAccount({ config });

  const navigateHandler = () => {
    window.open(
      `https://hashscan.io/testnet/contract/${contractAddress}`,
      '_blank'
    );
  };

  const getVoteButtonText = () => {
    switch (votingStatus) {
      case 'voting':
        return 'Voting...';
      case 'voted':
        return 'Voted';
      default:
        return 'Vote';
    }
  };

  const getVoteButtonVariant = () => {
    switch (votingStatus) {
      case 'voted':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const handleVoteClick = () => {
    if (votingStatus === 'voted' || votingStatus === 'voting') return;
    setIsModalOpen(true);
  };

  const handleVoteSubmit = async (amount: number) => {
    if (!topicId || !amount) return;
    onVote('voting');

    // Call your voting function with the amount
    await voteProposals(account.address, contractAddress, amount, topicId)
      .then(() => {
        onVote('voted');
        toast.success(`Voted with ${amount} BIOGAS tokens!`);
      })
      .catch(() => {
        onVote('vote'); // Reset on error
        toast.error('Voting failed. Please try again.');
      });
  };

  useEffect(() => {
    if (votingStatus === 'voted') {
      toast.success('Vote Successfully!');
    }
  }, [votingStatus]);

  return (
    <>
      <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Vote className="w-5 h-5 text-purple-600" />
            </div>
            <span>Governance Portal</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="font-medium">Current Proposal: {proposalTitle}</div>
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <Clock className="w-4 h-4" />
              <span>Voting Ends at: {formattedEndTime}</span>
            </div>
            <Button
              variant="link"
              onClick={navigateHandler}
              className="p-0 h-auto text-blue-600 text-sm"
            >
              View Voting Details <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <h4 className="font-medium text-sm mb-3">Funding Progress</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-600">Raised</span>
                <span className="text-purple-600">
                  {currentFunding} / {fundingGoal} BIOGAS
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-1000 ease-out rounded-full"
                  style={{ width: `${fundingProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>{fundingProgress.toFixed(1)}% funded</span>
                <span>{fundingGoal - currentFunding} BIOGAS remaining</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Button
              variant={getVoteButtonVariant()}
              className="w-full bg-purple-400 hover:bg-purple-300 text-black transition-all duration-300"
              onClick={handleVoteClick}
              disabled={votingStatus === 'voting' || votingStatus === 'voted'}
            >
              {votingStatus === 'voting' && (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              )}
              {getVoteButtonText()}
            </Button>
          </div>
        </CardContent>
      </Card>

      <VotingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onVote={handleVoteSubmit}
        proposalTitle={proposalTitle}
        bgsBalance={bgsBalance}
        isVoting={votingStatus === 'voting'}
      />
    </>
  );
};
