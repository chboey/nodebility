import { useEffect, useState } from 'react';
import { Proposal } from '@/components/cards/proposalCard';

export function useActiveProposal() {
  const [activeProposals, setActiveProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const res = await fetch(
          'https://bionode-nodebility-backend.online/api/proposals/status/active'
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch proposals. Status: ${res.status}`);
        }

        const json = await res.json();
        const proposals: Proposal[] = json.data;

        setActiveProposals(proposals);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  return { activeProposals, loading, error };
}
