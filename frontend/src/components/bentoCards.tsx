'use client';

import React from 'react';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import {
  TrendingUp,
  Vote,
  Clock,
  Target,
  BarChart3,
  ExternalLink,
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { Modal } from './modal';
import Image from 'next/image';
import hashpack from '@/images/hashpack.png';

export const BentoCards = () => {
  const [votingStatus, setVotingStatus] = useState<
    'vote' | 'voting' | 'voted' | null
  >(null);
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);

  const fundingGoal = 1000;
  const currentFunding = 650;
  const fundingProgress = (currentFunding / fundingGoal) * 100;

  const handleVote = (action: 'vote' | 'voting' | 'voted') => {
    setVotingStatus(action);
    // Simulate voting process
    if (action === 'voting') {
      setTimeout(() => {
        setVotingStatus('voted');
      }, 2000);
    }
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

  const dailyMintingData = [
    { day: 'Mon', minted: 45 },
    { day: 'Tue', minted: 52 },
    { day: 'Wed', minted: 38 },
    { day: 'Thu', minted: 67 },
    { day: 'Fri', minted: 71 },
    { day: 'Sat', minted: 43 },
    { day: 'Sun', minted: 58 },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* My Token Stats */}
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm ">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#E2EEFEFF] rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#67A3F2FF]" />
              </div>
              <span>My Token Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">$BIOGAS Balance:</span>
                <span className="font-semibold">1,240</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">$HBAR Balance:</span>
                <span className="font-semibold">1,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">
                  Remaining Balance for $BIOGAS to vote:
                </span>
                <span className="font-semibold">999</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  <Image
                    src={hashpack}
                    alt="hashpack"
                    className="w-8 h-8 rounded-full"
                  />
                </div>
                <div>
                  <div className="font-medium">Hedera</div>
                  <div className="text-xs text-slate-500 font-mono">
                    {/* did hedera fetch here */}
                    did:hedera:testnet:0.0.123456
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => setIsStakeModalOpen(true)}
                  className="flex-1 bg-[#90B9ED] text-black px-3 py-2 transition-all duration-350 hover:shadow-md hover:text-white hover:bg-[#2C2D2A]"
                >
                  Swap
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <span>$BIOGAS Token Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                47,350
              </div>
              <div className="text-sm text-slate-600">Total $BIOGAS Minted</div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-sm">Daily Minting Chart</h4>
                <BarChart3 className="w-4 h-4 text-slate-400" />
              </div>
              <div className="h-24 flex items-end justify-between space-x-1">
                {dailyMintingData.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center space-y-1"
                  >
                    <div
                      className="w-6 bg-gradient-to-t from-green-600 to-green-400 rounded-t transition-all duration-500 hover:from-green-500 hover:to-green-300"
                      style={{ height: `${(item.minted / 80) * 60}px` }}
                    />
                    <span className="text-xs text-slate-500">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Governance Portal */}
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
              <div className="font-medium">
                Current Proposal: Solar Farm Project
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Clock className="w-4 h-4" />
                <span>Voting Ends in: 2d 14h 20m</span>
              </div>
              <Button
                variant="link"
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
                onClick={() =>
                  handleVote(votingStatus === null ? 'voting' : votingStatus)
                }
                disabled={votingStatus === 'voting' || votingStatus === 'voted'}
              >
                {votingStatus === 'voting' && (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                )}
                {getVoteButtonText()}
              </Button>
              {votingStatus === 'voted' && (
                <div className="text-center">
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700"
                  >
                    ✓ Vote Submitted Successfully
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <Modal
        isOpen={isStakeModalOpen}
        onClose={() => setIsStakeModalOpen(false)}
        biogasBalance={1240}
        ownedHbar={3500}
        ownedBiogas={900}
      />
    </div>
  );
};
