import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
