'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import LandingContent from '@/components/landingContent';

export default function LandingClient() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  useEffect(() => {
    if (isConnected) {
      router.push('/dashboard');
    }
  }, [isConnected, router]);

  if (openConnectModal) {
    return <LandingContent openConnectModal={openConnectModal} />;
  }
}
