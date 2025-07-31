// hooks/useBalances.ts
'use client';

import { useState, useEffect } from 'react';
import { fetchBalance } from '@/lib/utils';
import { useAccount } from 'wagmi';
import { config } from '@/config/wagmi';

interface BalanceState {
  hbarBalance: string;
  bgsBalance: string;
  bgsOperatorBalance: string;
}

interface UseBalancesReturn extends BalanceState {
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const BGS_TOKEN_ADDRESS = '0x000000000000000000000000000000000062a914';
const BGS_OPERATOR_ADDRESS = '0x000000000000000000000000000000000061e4fe';

export const useBalances = (): UseBalancesReturn => {
  const [balances, setBalances] = useState<BalanceState>({
    hbarBalance: '',
    bgsBalance: '',
    bgsOperatorBalance: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const account = useAccount({ config });

  const fetchAllBalances = async () => {
    if (!account.address) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [bgsValue, bgsOpValue, hbarValue] = await Promise.all([
        fetchBalance(account.address, BGS_TOKEN_ADDRESS),
        fetchBalance(BGS_OPERATOR_ADDRESS, BGS_TOKEN_ADDRESS),
        fetchBalance(account.address, null),
      ]);

      setBalances({
        bgsBalance: bgsValue,
        bgsOperatorBalance: bgsOpValue,
        hbarBalance: hbarValue,
      });
    } catch (err) {
      setError('Failed to load balances');
      console.error('Error loading balances:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBalances();
  }, [account.address]);

  return {
    ...balances,
    isLoading,
    error,
    refetch: fetchAllBalances,
  };
};
