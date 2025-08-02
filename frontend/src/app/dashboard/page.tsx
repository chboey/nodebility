'use client';

import { Header } from '@/components/header';
import { BentoCards } from '@/components/bentoCards';
import { BottomCards } from '@/components/bottomCards';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAccountID } from '@/lib/utils';
import { useAccount } from 'wagmi';

export default function Dashboard() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [accountId, setAccountId] = useState<string | null>(null);
  useEffect(() => {
    const getAccount = async () => {
      if (address) {
        const accountId = await getAccountID(address);
        setAccountId(accountId);
      }
    };

    getAccount();
  });

  return (
    <div className="min-h-screen bg-[#FBFBFBFF]">
      <Header accountId={accountId || null} />
      <main className="container mx-auto px-4 py-8">
        <BentoCards />
        <BottomCards />
      </main>
    </div>
  );
}
