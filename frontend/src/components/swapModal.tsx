'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, Info, ArrowRightLeft } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import Image from 'next/image';
import hashpack from '@/images/hashpack.png';
import { SwapToken } from '@/action/swapToken';
import { useAccount } from 'wagmi';
import { config } from '@/config/wagmi';
import { toast } from 'sonner';

interface StakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  biogasBalance: number;
  ownedHbar: number;
  ownedBiogas: number;
  onSuccess: () => void;
}

export function SwapModal({
  isOpen,
  onClose,
  biogasBalance,
  ownedHbar,
  ownedBiogas,
  onSuccess,
}: StakeModalProps) {
  const [swapAmount, setSwapAmount] = useState([0]);
  const [isLoading, setIsLoading] = useState(false);
  const account = useAccount({ config });

  // Conversion rate: 10 HBAR = 1 BIOGAS
  const conversionRate = 10;
  const maxSwappable = ownedHbar;
  const currentSwapValue = swapAmount[0];
  const biogasReceived = currentSwapValue / conversionRate;
  const newTotalBiogas = ownedBiogas + biogasReceived;
  const newTotalHbar = ownedHbar - currentSwapValue;

  const handleSwap = async () => {
    if (currentSwapValue === 0) return;

    setIsLoading(true);
    const result = await SwapToken({
      HBAR: currentSwapValue,
      TOKEN_AMOUNT: biogasReceived,
      accountAddr: account.address,
    });

    if (!result.success) {
      setIsLoading(false);
      toast.error('Error Swapping Tokens...');
      onClose();
    } else {
      toast.success('Successfully Swapped HBAR to BIOGAS.');
      setIsLoading(false);
      onClose();
      setTimeout(() => {
        onSuccess();
      }, 5000);
    }
  };

  const handleSliderChange = (value: number[]) => {
    setSwapAmount(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Math.max(0, Number(e.target.value)), maxSwappable);
    setSwapAmount([value]);
  };

  const setPercentage = (percentage: number) => {
    const amount = Math.floor((maxSwappable * percentage) / 100);
    setSwapAmount([amount]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/98 backdrop-blur-sm shadow-2xl max-h-[40rem]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <ArrowRightLeft className="w-4 h-4 text-white" />
            </div>
            <span>Swap HBAR to BIOGAS</span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[30rem] px-4">
          <div className="space-y-6 py-4 ">
            {/* Balance Overview */}
            <div className="bg-slate-50 rounded-lg space-y-3 p-4">
              <h4 className="font-medium text-sm text-slate-800 mb-3">
                Available Tokens in Nodebility
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between bg-white rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">B</span>
                    </div>
                    <span className="text-sm font-medium">BIOGAS</span>
                  </div>
                  <span className="font-semibold">
                    {biogasBalance.toLocaleString()}
                  </span>
                </div>
              </div>

              <Separator className="my-3" />

              <h4 className="font-medium text-sm text-slate-800 mb-3">
                Currently Owned
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center sm:justify-between bg-white rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center">
                      <Image
                        src={hashpack}
                        alt="hashpack"
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                      />
                    </div>
                    <span className="text-sm font-medium">HBAR</span>
                  </div>
                  <span className="font-semibold text-purple-600">
                    {ownedHbar.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-white rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">B</span>
                    </div>
                    <span className="text-sm font-medium">BIOGAS</span>
                  </div>
                  <span className="font-semibold text-green-600">
                    {ownedBiogas.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Swap Amount Input */}
            <div className="space-y-4">
              <Label htmlFor="swap-amount" className="text-sm font-medium">
                Amount to Swap (HBAR)
              </Label>

              {/* Conversion Rate Display */}
              <div className="flex items-center justify-center space-x-2 text-sm text-[#202519FF] bg-gradient-to-r from-purple-200 to-green-100 rounded-lg p-2">
                <span className="font-medium">1 HBAR</span>
                <ArrowRightLeft className="w-4 h-4" />
                <span className="font-medium">0.1 BIOGAS</span>
                <span className="text-xs">(Rate: 10:1)</span>
              </div>

              {/* Input Field */}
              <div className="relative">
                <Input
                  id="swap-amount"
                  type="number"
                  value={currentSwapValue}
                  onChange={handleInputChange}
                  max={maxSwappable}
                  min={0}
                  className="pr-16 text-lg font-semibold"
                  placeholder="0"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <span className="text-sm text-slate-500 font-medium">
                    HBAR
                  </span>
                </div>
              </div>

              {/* You'll Receive Display */}
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700 font-medium">
                    You&lsquo;ll receive:
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-green-600">
                      {biogasReceived.toFixed(2)}
                    </span>
                    <span className="text-sm text-green-600 font-medium">
                      BIOGAS
                    </span>
                  </div>
                </div>
              </div>

              {/* Percentage Buttons */}
              <div className="flex space-x-2">
                {[25, 50, 75, 100].map((percentage) => (
                  <Button
                    key={percentage}
                    variant="outline"
                    size="sm"
                    onClick={() => setPercentage(percentage)}
                    className="flex-1 text-xs hover:bg-purple-50 hover:border-purple-200"
                  >
                    {percentage}%
                  </Button>
                ))}
              </div>

              {/* Slider */}
              <div className="space-y-3">
                <Slider
                  value={swapAmount}
                  onValueChange={handleSliderChange}
                  max={maxSwappable}
                  min={0}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>0 HBAR</span>
                  <span>{maxSwappable.toLocaleString()} HBAR</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Transaction Preview */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center space-x-2">
                <ArrowUpDown className="w-4 h-4" />
                <span>Transaction Preview</span>
              </h4>

              <div className="bg-gradient-to-r from-purple-100 to-green-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">
                    Swapping Amount
                  </span>
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold">
                      {currentSwapValue.toLocaleString()}
                    </span>
                    <span className="text-sm text-purple-600 font-medium">
                      HBAR
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">
                    Receiving Amount
                  </span>
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold text-green-600">
                      {biogasReceived.toFixed(2)}
                    </span>
                    <span className="text-sm text-green-600 font-medium">
                      BIOGAS
                    </span>
                  </div>
                </div>

                <Separator className="my-2" />

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">
                      Current BIOGAS Owned
                    </span>
                    <span className="font-semibold">
                      {ownedBiogas.toLocaleString()} BIOGAS
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">
                      New Total BIOGAS
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700"
                    >
                      {newTotalBiogas.toFixed(2)} BIOGAS
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">
                      Remaining HBAR
                    </span>
                    <span className="font-semibold text-purple-600">
                      {newTotalHbar.toLocaleString()} HBAR
                    </span>
                  </div>
                </div>
              </div>

              {/* Info Banner */}
              <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-700">
                  <p className="font-medium mb-1">Swap Information</p>
                  <p>• Exchange rate: 10 HBAR = 1 BIOGAS.</p>
                  <p>• No additional fees for swapping.</p>
                  <p>• Transaction is irreversible.</p>
                  <p>• BIOGAS can be used for voting upcoming proposals.</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-transparent"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="ghost"
                onClick={handleSwap}
                disabled={
                  currentSwapValue === 0 ||
                  isLoading ||
                  currentSwapValue > ownedHbar
                }
                className="flex-2 bg-[#90B9ED] text-black px-3 py-2 transition-all duration-350 hover:shadow-md hover:text-white hover:bg-[#2C2D2A]"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Swapping...</span>
                  </div>
                ) : (
                  `Swap ${biogasReceived.toLocaleString()} BIOGAS`
                )}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
