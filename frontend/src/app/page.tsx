'use client';

import { Header } from '@/components/header';
import { BentoCards } from '@/components/bentoCards';
import { BottomCards } from '@/components/bottomCards';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Top Section - Main Cards */}
        <BentoCards />
        {/* Bottom Section */}
        <BottomCards />
      </main>
    </div>
  );
}
