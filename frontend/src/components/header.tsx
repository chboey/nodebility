import React from 'react';
import { Copy, ChevronDown, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from '@radix-ui/react-dropdown-menu';
import nodebility from '@/images/logo.png';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDisconnect } from 'wagmi';
import { toast } from 'sonner';
import hederaIcon from '@/images/hedera.svg';
import { ConnectButton } from '@rainbow-me/rainbowkit';

type HeaderProps = {
  accountId: string | null;
};

export const Header = ({ accountId }: HeaderProps) => {
  const { disconnect } = useDisconnect();
  const router = useRouter();

  const disconnectHandler = async () => {
    await disconnect();
    router.push('/');
  };

  return (
    <div className="min-w-full border-0">
      <header className="border-b bg-[#FBFBFB93] border-[#E5EDCEFF] border-2 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <div className="w-10 h-10 bg-gradient-to-r from-green-200 to-blue-200 rounded-lg flex items-center justify-center">
                <Image src={nodebility} alt="logo" className="" />
              </div>
              <h1 className="text-2xl font-bold text-[#202519FF] hidden sm:block">
                Nodebility
              </h1>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <ConnectButton />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-72 bg-white/95 backdrop-blur-sm border border-slate-200 shadow-xl rounded-xl p-2"
                sideOffset={8}
              >
                <DropdownMenuItem
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 focus:bg-slate-50 cursor-default transition-colors duration-200"
                  onClick={(e) => {
                    if (accountId) {
                      e.stopPropagation();
                      navigator.clipboard.writeText(accountId);
                      toast.info('Account ID is Copied.');
                    } else {
                      toast.error('Failed to copy ID.');
                    }
                  }}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#525298]">
                    <Image
                      src={hederaIcon}
                      alt="hederaIcon"
                      className="w-6 h-6 rounded-full"
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-sm font-semibold text-slate-800">
                      Connected Wallet
                    </span>
                    <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded mt-1">
                      {accountId || null}
                    </span>
                  </div>
                  <Copy className="w-4 h-4 text-slate-600" />
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-2 bg-slate-200" />

                <DropdownMenuItem
                  onClick={disconnectHandler}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 focus:bg-red-50 text-red-600 hover:text-red-700 focus:text-red-700 cursor-pointer transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <LogOut className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">Sign Out</span>
                    <span className="text-xs text-red-500">
                      Disconnect wallet
                    </span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </div>
  );
};
