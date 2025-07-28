import React from 'react';
import { Wallet, Copy, ChevronDown, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from '@radix-ui/react-dropdown-menu';
import { Button } from './ui/button';
import Image from 'next/image';
import hashpack from '@/images/hashpack.png';

export const Header = () => {
  return (
    <div>
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Node-bility
              </h1>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center bg-[#525298] hover:bg-[#39398BFF] rounded-lg px-3 py-2 transition-all duration-200 hover:shadow-md"
                >
                  <Image
                    src={hashpack}
                    alt="hashpack"
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="font-mono text-white">HashPack</span>
                  <ChevronDown className="w-4 h-4 text-slate-100 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-72 bg-white/95 backdrop-blur-sm border border-slate-200 shadow-xl rounded-xl p-2"
                sideOffset={8}
              >
                <DropdownMenuItem
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 focus:bg-slate-50 cursor-default transition-colors duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText('0xAbC1234.....ef1234');
                  }}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-sm font-semibold text-slate-800">
                      Connected Wallet
                    </span>
                    <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded mt-1">
                      0xAbC1234.....ef1234
                    </span>
                  </div>
                  <Copy className="w-4 h-4 text-slate-600" />
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-2 bg-slate-200" />

                <DropdownMenuItem className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 focus:bg-red-50 text-red-600 hover:text-red-700 focus:text-red-700 cursor-pointer transition-all duration-200">
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
