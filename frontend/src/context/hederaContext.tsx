'use client';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

import { TransferTransaction, Hbar, Client } from '@hashgraph/sdk';

interface HederaContextType {
  pairingData: any; // You might want to type this more specifically
  hashconnect: any; // You might want to type this more specifically
  accountId: string | null;
}

const HederaContext = createContext<HederaContextType | undefined>(undefined);

interface HederaProviderProps {
  children: ReactNode;
}

export async function HederaProvider({ children }: HederaProviderProps) {
  const [pairingData, setPairingData] = useState(null);
  const [hashconnect, setHashconnect] = useState(null);
  const [accountId, setAccountId] = useState(null);

  //Atomic swap between a Hedera Token Service token and hbar
  // const atomicSwap = await new TransferTransaction()
  //   .addHbarTransfer(accountId1, new Hbar(-1))
  //   .addHbarTransfer(accountId2, new Hbar(1))
  //   .addTokenTransfer(tokenId, accountId2, -1)
  //   .addTokenTransfer(tokenId, accountId1, 1)
  //   .freezeWith(client);

  // //Sign the transaction with accountId1 and accountId2 private keys, submit the transaction to a Hedera network
  // const txResponse = await (
  //   await (await atomicSwap.sign(accountKey1)).sign(accountKey2)
  // ).execute(client);

  // //------------------------------------OR---------------------------------------

  // //Atomic swap between two hedera Token Service created tokens
  // const atomicSwap = await new TransferTransaction()
  //   .addTokenTransfer(tokenId1, accountId1, -1)
  //   .addTokenTransfer(tokenId1, accountId2, 1)
  //   .addTokenTransfer(tokenId2, accountId2, -1)
  //   .addTokenTransfer(tokenId2, accountId1, 1)
  //   .freezeWith(client);

  // //Sign the transaction with accountId1 and accountId2 private keys, submit the transaction to a Hedera network
  // const txResponse = await (
  //   await (await atomicSwap.sign(accountKey1)).sign(accountKey2)
  // ).execute(client);

  const value: HederaContextType = {
    pairingData,
    hashconnect,
    accountId,
  };

  return (
    <HederaContext.Provider value={value}>{children}</HederaContext.Provider>
  );
}

export function useHedera(): HederaContextType {
  const context = useContext(HederaContext);
  if (context === undefined) {
    throw new Error('useHedera must be used within a HederaProvider');
  }
  return context;
}
