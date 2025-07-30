import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
const outfit = Outfit({ subsets: ['latin'] });

import { headers } from 'next/headers'; // added
import ContextProvider from '@/context/provider';
export const metadata: Metadata = {
  title: 'Nodebility',
  description: 'Nodebility on Hedera',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersObj = await headers();
  const cookies = headersObj.get('cookie');

  return (
    <html lang="en">
      <body className={outfit.className}>
        <ContextProvider cookies={cookies}>{children}</ContextProvider>
        <Toaster expand={true} richColors />
      </body>
    </html>
  );
}
