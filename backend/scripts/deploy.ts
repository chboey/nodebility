const hre = require('hardhat');

export async function deployProposalContract(
  durationDay: number,
  goalAmount: number,
  proposalTopic: string
): Promise<string> {
  const tokenAddr = '0x000000000000000000000000000000000062A914';

  const ProposalContract = await hre.ethers.getContractFactory(
    'BGSVotingContract'
  );
  const contract = await ProposalContract.deploy(
    tokenAddr,
    durationDay,
    goalAmount,
    proposalTopic
  );

  await contract.waitForDeployment();
  console.log('Contract deployed to:', contract.target); // Use `contract.target` for Ethers v6

  return contract.target; // Returns deployed address
}

// 🔥 ADD THIS TO RUN THE DEPLOY FUNCTION 🔥
async function main() {
  await deployProposalContract(30, 10000, 'Green Energy Proposal');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});