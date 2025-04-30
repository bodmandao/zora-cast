'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Zora Cast',
  projectId: process.env.NEXT_PUBLIC_WALLET_ID!, 
  chains: [base],
  ssr: true,
});