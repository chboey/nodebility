import { useEffect, useState } from 'react';
import { getVotingProgress } from '@/action/votingProgress';

interface VotingProgress {
  project_cost: number;
  funded: number;
}

export const useVotingProgress = () => {
  const [progress, setProgress] = useState<VotingProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = async () => {
    try {
      const data = await getVotingProgress();
      setProgress(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  return { fetchProgress, progress, loading, error };
};
