'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Vote, Wallet } from 'lucide-react';
import { toast } from 'sonner';

interface VotingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVote: (amount: number) => void;
  proposalTitle?: string;
  bgsBalance?: string; // User's BIOGAS balance
  isVoting: boolean;
}

export const VotingModal = ({
  isOpen,
  onClose,
  onVote,
  proposalTitle,
  bgsBalance,
  isVoting,
}: VotingModalProps) => {
  const [voteAmount, setVoteAmount] = useState([0]);
  const [currentVoteValue, setCurrentVoteValue] = useState('');
  const maxVotable = Number(bgsBalance);
  const votingPower = Number(currentVoteValue) || 0;

  useEffect(() => {
    if (isOpen) {
      setVoteAmount([0]);
      setCurrentVoteValue('');
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = Number(value);

    if (numValue <= maxVotable) {
      setCurrentVoteValue(value);
      setVoteAmount([numValue]);
    }
  };

  const handleSliderChange = (value: number[]) => {
    setVoteAmount(value);
    setCurrentVoteValue(value[0].toString());
  };

  const setPercentage = (percentage: number) => {
    const amount = (maxVotable * percentage) / 100;
    setVoteAmount([amount]);
    setCurrentVoteValue(amount.toString());
  };

  const handleVoteSubmit = () => {
    if (votingPower > 0 && votingPower <= maxVotable) {
      onVote(votingPower);
      onClose();
    } else {
      toast.error('Please enter a valid voting amount');
    }
  };

  const isValidAmount = votingPower > 0 && votingPower <= maxVotable;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Vote className="w-5 h-5 text-purple-600" />
            </div>
            <span>Cast Your Vote</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Proposal Info */}
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-sm text-slate-600 mb-1">Voting on:</div>
            <div className="font-medium text-slate-900">{proposalTitle}</div>
          </div>

          {/* Balance Display */}
          <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3 border">
            <div className="flex items-center space-x-2">
              <Wallet className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-slate-700">
                Your Balance:
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-lg font-bold text-purple-600">
                {bgsBalance?.toLocaleString()}
              </span>
              <span className="text-sm text-purple-600 font-medium">
                BIOGAS
              </span>
            </div>
          </div>

          <Label htmlFor="vote-amount" className="text-sm font-medium">
            Amount to Vote (BIOGAS)
          </Label>

          {/* Input Field */}
          <div className="relative">
            <Input
              id="vote-amount"
              type="number"
              value={currentVoteValue}
              onChange={handleInputChange}
              max={maxVotable}
              min={0}
              className="pr-20 text-lg font-semibold"
              placeholder="0"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span className="text-sm text-slate-500 font-medium">BIOGAS</span>
            </div>
          </div>

          {/* Voting Power Display */}
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-700 font-medium">
                Your voting power:
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-green-600">
                  {votingPower.toLocaleString()}
                </span>
                <span className="text-sm text-green-600 font-medium">
                  votes
                </span>
              </div>
            </div>
          </div>

          {/* Percentage Buttons */}
          <div className="flex space-x-2">
            {[25, 50, 75, 100].map((percentage) => (
              <Button
                key={percentage}
                variant="outline"
                size="sm"
                onClick={() => setPercentage(percentage)}
                className="flex-1 text-xs hover:bg-purple-50 hover:border-purple-200"
              >
                {percentage}%
              </Button>
            ))}
          </div>

          {/* Slider */}
          <div className="space-y-3">
            <Slider
              value={voteAmount}
              onValueChange={handleSliderChange}
              max={maxVotable}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>0 BIOGAS</span>
              <span>{maxVotable.toLocaleString()} BIOGAS</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isVoting}
            className="flex-1 bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={handleVoteSubmit}
            disabled={!isValidAmount || isVoting}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-black"
          >
            {isVoting ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Voting...
              </>
            ) : (
              'Cast Vote'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
