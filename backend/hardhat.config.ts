require('@nomicfoundation/hardhat-ethers');
require('@nomicfoundation/hardhat-verify');
require('dotenv').config();

module.exports = {
  solidity: '0.8.24',
 defaultNetwork: "hederatestnet",
  networks: {
    hederatestnet: {
      url: 'https://testnet.hashio.io/api',
      chainId: 296,
      accounts: [process.env.AGENT_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      hederatestnet: '', // Hedera doesn't require a real API key
    },
    customChains: [
      {
        network: 'hederatestnet',
        chainId: 296,
        urls: {
          apiURL: 'https://server-verify.hashscan.io',
          browserURL: 'https://hashscan.io/testnet',
        },
      },
    ],
  },
};