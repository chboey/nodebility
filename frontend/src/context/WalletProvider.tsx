'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, useAccount, useDisconnect } from 'wagmi';

import { config } from '@/config/wagmi';

interface WalletWatcherProps {
  children: ReactNode;
}

function WalletWatcher({ children }: WalletWatcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    // If user is not connected and is trying to access a page other than root
    if (!isConnected && pathname !== '/') {
      disconnect();
      router.push('/');
    }
  }, [isConnected, pathname, disconnect, router]);

  return <>{children}</>;
}

interface WalletProviderProps {
  children: ReactNode;
}

export default function WalletProvider({ children }: WalletProviderProps) {
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider coolMode>
          <WalletWatcher>{children}</WalletWatcher>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
