'use client';

import React from 'react';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import {
  TrendingUp,
  Vote,
  Clock,
  Users,
  BarChart3,
  ExternalLink,
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Button } from './ui/button';

export const BentoCards = () => {
  const [votingChoice, setVotingChoice] = useState<string | null>(null);

  const chartData = [
    { month: 'Jan', value: 65 },
    { month: 'Feb', value: 45 },
    { month: 'Mar', value: 78 },
    { month: 'Apr', value: 52 },
    { month: 'May', value: 89 },
    { month: 'Jun', value: 67 },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* My Token Stats */}
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
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
                <span className="text-sm text-slate-600">Staked:</span>
                <span className="font-semibold text-blue-600">900</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Rewards:</span>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700"
                >
                  +32 Pending
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">H</span>
                </div>
                <div>
                  <div className="font-medium">Hedera</div>
                  <div className="text-xs text-slate-500 font-mono">
                    did:hedera:testnet:0.0.123456
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent hover:bg-gray-200"
                >
                  Un-Stake
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 transition duration-300 hover:bg-gradient-to-r hover:from-blue-700 hover:to-purple-700">
                  Stake
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Community Treasury Balance */}
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <span>Community Treasury Balance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">$BIOGAS Balance:</span>
                <span className="font-semibold">10,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Active Projects:</span>
                <span className="font-semibold">4</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">
                  Total Tokens in Circulation:
                </span>
                <span className="font-semibold">50,000</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-sm">$BIOGAS Minting History</h4>
                <BarChart3 className="w-4 h-4 text-slate-400" />
              </div>
              <div className="h-24 flex items-end justify-between space-x-1">
                {chartData.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center space-y-1"
                  >
                    <div
                      className="w-4 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                      style={{ height: `${(item.value / 100) * 60}px` }}
                    />
                    <span className="text-xs text-slate-500">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Governance Portal */}
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="pb-3">
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
                <span>Voting Ends in: 2d 14h</span>
              </div>
              <Button
                variant="link"
                className="p-0 h-auto text-blue-600 text-sm"
              >
                View Voting Details <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 shadow-md border-0">
              <h4 className="font-medium text-sm mb-3">Voting Status</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-green-600">Yes (78%)</span>
                  <span className="text-red-500">No (22%)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden flex">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-1000 ease-out"
                    style={{ width: '78%' }}
                  />
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-1000 ease-out"
                    style={{ width: '22%' }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>2,340 votes</span>
                  <span>660 votes</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant={votingChoice === 'yes' ? 'default' : 'outline'}
                className="flex-1 hover:bg-green-400 focus:bg-green-600 text-black transition-all duration-300"
                onClick={() => setVotingChoice('yes')}
              >
                Vote
              </Button>
              <Button
                variant={votingChoice === 'no' ? 'destructive' : 'outline'}
                className="flex-1 hover:bg-[#fd5c63] active:bg-[#F2003C] text-black transition-all duration-300"
                onClick={() => setVotingChoice('no')}
              >
                No
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
