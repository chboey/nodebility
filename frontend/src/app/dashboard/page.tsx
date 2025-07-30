'use client';

import { Header } from '@/components/header';
import { BentoCards } from '@/components/bentoCards';
import { BottomCards } from '@/components/bottomCards';
import { useAppKitAccount } from '@reown/appkit/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAccountID } from '@/lib/utils';

export default function Dashboard() {
  const router = useRouter();
  const { address, isConnected } = useAppKitAccount();
  const [accountId, setAccountId] = useState<string>('');

  useEffect(() => {
    const getAccount = async () => {
      if (address) {
        const accountId = await getAccountID(address);
        setAccountId(accountId);
      }
    };

    getAccount();
    if (!isConnected || !address) {
      router.push('/');
    }
  });

  return (
    <div className="min-h-screen bg-[#FBFBFBFF]">
      <Header accountId={accountId} />
      <main className="container mx-auto px-4 py-8">
        <BentoCards />
        <BottomCards />
      </main>
    </div>
  );
}
