import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import '@rainbow-me/rainbowkit/styles.css';
import WalletProvider from '@/context/WalletProvider';

const outfit = Outfit({ subsets: ['latin'] });
export const metadata: Metadata = {
  title: 'Nodebility',
  description: 'Nodebility on Hedera',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <WalletProvider>
          <main>{children}</main>
        </WalletProvider>

        <Toaster expand={true} richColors />
      </body>
    </html>
  );
}
