import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { hederaTestnet } from '@wagmi/core/chains';

export const config = getDefaultConfig({
  appName: 'Nodebility',
  projectId: '2af648f583bfa8066a5505bb374511a6',
  chains: [hederaTestnet],
  ssr: false,
});
