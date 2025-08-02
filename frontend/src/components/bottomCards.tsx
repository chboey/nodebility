// components/BottomCards.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { fetchProposals } from '@/action/proposalAction';
import { Proposal } from './cards/proposalCard';
import { ProposalCard } from './cards/proposalCard';
import { GuardianLogsCard } from './cards/guardianLogsCard';
import { Card, CardContent } from './ui/card';
import { UseGuardianLogs } from '@/hooks/useGuardianLogs';

export const BottomCards = () => {
  const { isLoading } = UseGuardianLogs();
  const [proposals, setProposals] = useState<Proposal[]>([]);

  useEffect(() => {
    const loadProposals = async () => {
      try {
        const data = await fetchProposals();
        setProposals(data);
      } catch (error) {
        console.error('Error loading proposals:', error);
      }
    };

    loadProposals();
  }, []);

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {[1, 2].map((i) => (
          <Card
            key={i}
            className="shadow-lg border-0 bg-white/70 backdrop-blur-sm"
          >
            <CardContent className="p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProposalCard proposals={proposals} />
        <GuardianLogsCard />
      </div>
    </div>
  );
};
