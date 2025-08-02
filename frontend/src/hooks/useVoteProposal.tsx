import { sendTransaction } from '@wagmi/core';
import { encodeFunctionData } from 'viem';
import { config } from '@/config/wagmi';
import { BGS_TOKEN_ADDRESS } from '@/lib/constant';
import BGSVotingContractABI from '@/ABI/BGSVotingContract.json';

const erc20Abi = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
];

export async function voteProposals(
  USER_ADDRESS: `0x${string}` | undefined,
  CONTRACT_ADDRESS: string,
  TOKEN_AMOUNT: number
) {
  if (!USER_ADDRESS) {
    console.error('USER_ADDRESS is undefined');
    return;
  }

  try {
    const bgsToken = TOKEN_AMOUNT * 100;

    // Step 1: Transfer Tokens to Proposal Contract
    const transferData = encodeFunctionData({
      abi: erc20Abi,
      functionName: 'transfer',
      args: [CONTRACT_ADDRESS, bgsToken],
    });

    const txHash = await sendTransaction(config, {
      account: USER_ADDRESS,
      to: BGS_TOKEN_ADDRESS,
      data: transferData,
    });

    console.log('Transfer Transaction Hash:', txHash);

    // Step 2: Notify Proposal Contract of Token Received
    const tokenReceivedData = encodeFunctionData({
      abi: BGSVotingContractABI,
      functionName: 'onTokenReceived',
      args: [USER_ADDRESS, bgsToken],
    });

    const txHash2 = await sendTransaction(config, {
      account: USER_ADDRESS,
      to: CONTRACT_ADDRESS as any,
      data: tokenReceivedData,
      gas: BigInt(1000000),
    });

    console.log('onTokenReceived Transaction Hash:', txHash2);

    // Step 3: Register the Vote
    const registerVoteData = encodeFunctionData({
      abi: BGSVotingContractABI,
      functionName: 'registerVote',
      args: [],
    });

    const txHash3 = await sendTransaction(config, {
      account: USER_ADDRESS,
      to: CONTRACT_ADDRESS as any,
      data: registerVoteData,
      gas: BigInt(1000000),
    });

    console.log('registerVote Transaction Hash:', txHash3);

    return txHash3;
  } catch (error) {
    console.error('Error during voteProposals execution:', error);
    return;
  }
}
