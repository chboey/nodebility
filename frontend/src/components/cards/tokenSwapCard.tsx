'use client';

import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { TrendingUp } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import Image from 'next/image';
import hederaIcon from '@/images/hedera.svg';

interface TokenStatsCardProps {
  bgsBalance: string;
  hbarBalance: string;
  bgsOperatorBalance: string;
  onSwapClick: () => void;
}

export const TokenSwapCards = ({
  bgsBalance,
  hbarBalance,
  bgsOperatorBalance,
  onSwapClick,
}: TokenStatsCardProps) => {
  return (
    <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#E2EEFEFF] rounded-full flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-[#67A3F2FF]" />
          </div>
          <span>My Token Stats</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">$BIOGAS Balance:</span>
            <span className="font-semibold">{bgsBalance}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">$HBAR Balance:</span>
            <span className="font-semibold">
              {parseFloat(hbarBalance).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">
              Remaining $BIOGAS Token on Bionodes:
            </span>
            <span className="font-semibold">{bgsOperatorBalance}</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center">
              <Image
                src={hederaIcon}
                alt="hederaIcon"
                className="w-8 h-8 rounded-full"
              />
            </div>
            <div>
              <div className="font-medium">Hedera</div>
              <div className="text-xs text-slate-500 font-mono">
                {/* did:hedera:testnet:0.0.123456 */}
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="ghost"
              onClick={onSwapClick}
              className="flex-1 bg-[#90B9ED] text-black px-3 py-2 transition-all duration-350 hover:shadow-md hover:text-white hover:bg-[#2C2D2A]"
            >
              Swap
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
