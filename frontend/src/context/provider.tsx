'use client';

import { wagmiAdapter, projectId } from '../config/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import { hederaTestnet } from 'viem/chains';
import React, { type ReactNode } from 'react';
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi';

// Set up queryClient
const queryClient = new QueryClient();

if (!projectId) {
  throw new Error('Project ID is not defined');
}

// Set up metadata
const metadata = {
  name: 'Nodebility',
  description: 'Nodebility on Hedera',
  url: '',
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
};

// Create the modal
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [hederaTestnet],
  defaultNetwork: hederaTestnet,
  metadata: metadata,
  features: {
    email: false,
    socials: false,
    analytics: true, // Optional - defaults to your Cloud configuration
  },
  themeMode: 'light',
  enableWalletConnect: true,
  includeWalletIds: [
    'a29498d225fa4b13468ff4d6cf4ae0ea4adcbd95f07ce8a843a1dee10b632f3f',
  ],
});

function ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider;
