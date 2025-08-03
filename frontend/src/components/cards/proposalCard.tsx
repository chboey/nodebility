// components/cards/UpcomingProposalsCard.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardTitle, CardHeader } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Clock, Bot, FileText, ArrowRight } from 'lucide-react';
import { Badge } from '../ui/badge';

export interface Proposal {
  _id: string;
  topicId: string;
  contractAddress: string;
  project_title: string;
  project_description: string;
  status:
    | 'active'
    | 'pending'
    | 'completed'
    | 'awaiting_approval'
    | 'awaiting-voting-status';
  requested_total_amount: number;
  initiator: string;
  votingTimerHours: number;
  createdAt: Date;
}

interface UpcomingProposalsCardProps {
  proposals: Proposal[];
}

const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'active':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'completed':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'awaiting-voting-status':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

export const ProposalCard = ({ proposals }: UpcomingProposalsCardProps) => {
  const navigateHandler = (topicId: string) => {
    window.open(`https://hashscan.io/testnet/topic/${topicId}`, '_blank');
  };

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-white to-slate-50/30 backdrop-blur-sm overflow-hidden w-full">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-orange-100 rounded-full flex items-center justify-center">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
          </div>
          <span className="text-base sm:text-lg">Upcoming Proposals</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        <ScrollArea className="h-[20rem] sm:h-[24rem] pr-2 sm:pr-4">
          <div className="space-y-4">
            {proposals.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium text-sm sm:text-base">
                  No upcoming proposals
                </p>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Check back later for new submissions
                </p>
              </div>
            ) : (
              proposals.map((proposal, index) => (
                <Card
                  key={proposal._id}
                  className="group border border-slate-200/60 bg-white hover:bg-slate-50/50 hover:shadow-md hover:border-slate-300/60 transition-all duration-300 sm:hover:-translate-y-0.5 cursor-pointer overflow-hidden"
                >
                  <CardContent className="p-3 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                      <div
                        className="flex-1 min-w-0"
                        onClick={() => navigateHandler(proposal.topicId)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 sm:mb-3">
                          <div className="flex-1 mb-2 sm:mb-0">
                            <h4 className="font-semibold text-slate-900 text-base sm:text-lg leading-tight mb-1 sm:mb-1 group-hover:text-slate-800">
                              {proposal.project_title}
                            </h4>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-sm text-slate-600 mb-2">
                              <div className="flex items-center space-x-1">
                                <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                                <span className="font-medium text-xs sm:text-sm">
                                  {proposal.initiator}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                                  {proposal.topicId}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={`self-start sm:ml-4 flex-shrink-0 font-medium px-2 sm:px-3 py-1 text-xs sm:text-sm ${getStatusVariant(
                              proposal.status
                            )}`}
                          >
                            {proposal.status}
                          </Badge>
                        </div>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-2">
                          {proposal.project_description}
                        </p>
                        {/* Footer */}
                        <div className="flex items-center justify-end sm:justify-between pt-2 sm:pt-3 border-t border-slate-100">
                          <div className="flex items-center space-x-1 text-xs text-slate-400 group-hover:text-slate-600 transition-colors">
                            <span>View details</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
