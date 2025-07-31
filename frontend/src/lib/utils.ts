import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AccountId } from '@hashgraph/sdk';
import { getBalance } from '@wagmi/core';
import { config } from '@/config/wagmi';
import { Address } from 'viem';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getAccountID(evmAddress: string) {
  const response = await fetch(
    `https://testnet.mirrornode.hedera.com/api/v1/accounts/${evmAddress}`,
    {
      method: 'GET',
      headers: {
        Accept: '*/*',
      },
    }
  );
  const data = await response.json();
  return data.account;
}

export function convertAccountIdToSolidityAddress(
  accountId: AccountId
): string {
  const accountIdString =
    accountId.evmAddress !== null
      ? accountId.evmAddress.toString()
      : accountId.toEvmAddress();

  console.log(accountIdString);

  return accountIdString;
}

export async function fetchBalance(address: Address, token: Address | null) {
  if (!token) {
    const rawBalance = await getBalance(config, {
      address,
    });
    return rawBalance.formatted;
  }

  const rawBalance = await getBalance(config, {
    address,
    token,
  });
  return rawBalance.formatted;
}
