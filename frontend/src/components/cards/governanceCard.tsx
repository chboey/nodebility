'use client';

import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Vote, Clock, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { useEffect } from 'react';

type VotingStatus = 'vote' | 'voting' | 'voted' | null;

interface GovernanceCardProps {
  votingStatus: VotingStatus;
  onVote: (action: 'vote' | 'voting' | 'voted') => void;
  fundingGoal: number;
  currentFunding: number;
  proposalTitle: string;
  votingEndTime: string;
}

export const GovernanceCard = ({
  votingStatus,
  onVote,
  fundingGoal,
  currentFunding,
  proposalTitle,
  votingEndTime,
}: GovernanceCardProps) => {
  const fundingProgress = (currentFunding / fundingGoal) * 100;

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

  const handleVote = () => {
    onVote(votingStatus === null ? 'voting' : votingStatus);
  };

  useEffect(() => {
    if (votingStatus === 'voted') {
      toast.success('Vote Successfully!');
    }
  }, [votingStatus]);

  return (
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
            <span>Voting Ends in: {votingEndTime}</span>
          </div>
          <Button variant="link" className="p-0 h-auto text-blue-600 text-sm">
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
            onClick={handleVote}
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
  );
};
