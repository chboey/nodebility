'use client';

import dynamic from 'next/dynamic';

const LandingClient = dynamic(() => import('../context/landingClient'), {
  ssr: false,
});

export default function HomePage() {
  return <LandingClient />;
}
