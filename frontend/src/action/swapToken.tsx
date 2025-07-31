import {
  TransferTransaction,
  Hbar,
  Client,
  TokenId,
  AccountId,
  PrivateKey,
  Transaction,
} from '@hashgraph/sdk';
import { sendTransaction } from '@wagmi/core';
import { parseEther } from 'viem';
import { config } from '@/config/wagmi';
import { convertAccountIdToSolidityAddress, getAccountID } from '@/lib/utils';

interface AtomicSwapParams {
  HBAR: number;
  TOKEN_AMOUNT: number;
  accountAddr: `0x${string}` | undefined;
}

const operatorId = AccountId.fromString(
  process.env.NEXT_PUBLIC_GENT_OPERATOR_ID || ''
);
const operatorKey = PrivateKey.fromStringED25519(
  process.env.NEXT_PUBLIC_AGENT_OPERATOR_KEY || ''
);

export const SwapToken = async ({
  HBAR,
  TOKEN_AMOUNT,
  accountAddr,
}: AtomicSwapParams) => {
  if (!accountAddr) return { success: false, reason: 'MissingAccount' };

  const client = Client.forTestnet().setOperator(operatorId, operatorKey);
  const TOKEN_ID = TokenId.fromString('0.0.6465812');
  console.log('Swapping HBAR to Biogas token...');

  // Step 1: Send HBAR to operator
  let tx1;
  try {
    tx1 = await sendTransaction(config, {
      account: accountAddr,
      to: `0x${convertAccountIdToSolidityAddress(operatorId)}`,
      value: parseEther(HBAR.toString()),
    });

    console.log('HBAR sent. Tx Hash:', tx1);
  } catch (error: any) {
    if (
      error?.name === 'UserRejectedRequestError' ||
      error?.message?.toLowerCase().includes('user rejected')
    ) {
      return { success: false, reason: 'UserRejected' };
    }

    return { success: false, reason: 'TransactionFailed', error };
  }

  // Step 2: Transfer token only if tx1 succeeded
  try {
    const accountId = await getAccountID(accountAddr);

    const tx2 = new TransferTransaction()
      .addTokenTransfer(TOKEN_ID, operatorId, -TOKEN_AMOUNT * 100) // treasury sends token
      .addTokenTransfer(
        TOKEN_ID,
        AccountId.fromString(accountId),
        TOKEN_AMOUNT * 100
      ); // user receives token

    const frozenTx = await tx2.freezeWith(client);
    const signedTx = await frozenTx.sign(operatorKey);
    const response = await signedTx.execute(client);
    const receipt = await response.getReceipt(client);

    return {
      success: true,
      tx1Hash: tx1,
      tx2Status: receipt.status.toString(),
    };
  } catch (error) {
    return {
      success: false,
      reason: 'TokenTransferFailed',
      tx1Hash: tx1,
      error,
    };
  }
};
