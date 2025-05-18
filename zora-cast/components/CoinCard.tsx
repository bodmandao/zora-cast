'use client';

import { useReadContract, useAccount } from 'wagmi';
import { formatUnits } from 'viem';
import BuyCoin from './BuyCoin';
import SellCoin from './SellCoin';

const ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
] as const;

export default function CoinCard({
  coin,
}: {
  coin: {
    name: string;
    symbol: string;
    createdAt: string;
    creatorAddress: string;
    marketCap: string;
    address: `0x${string}`;
  };
}) {
  const { address } = useAccount();

  const { data: balance } = useReadContract({
    address: coin.address,
    abi: ABI,
    functionName: 'balanceOf',
    args: [address!],
  }) as { data: bigint | undefined };

  console.log(coin.address)
  const formattedBalance =
    balance !== undefined ? formatUnits(balance, 18) : 'Loading...';

  return (
    <div className="bg-white/10 border border-white/20 backdrop-blur-lg p-6 rounded-xl shadow-xl text-white space-y-4">
      <div className="text-xl font-semibold">
        {coin.name} ({coin.symbol})
      </div>
      <div className="text-sm text-zinc-300">
        Created: {new Date(coin.createdAt).toLocaleString()}
      </div>
      <div className="text-sm text-zinc-300">
        Creator: {coin.creatorAddress.slice(0, 6)}...{coin.creatorAddress.slice(-4)}
      </div>
      <p className="text-sm text-zinc-300 mb-2">Your Balance: {formattedBalance}</p>
      <div className="text-sm text-zinc-300">Market Cap: {coin.marketCap}</div>

      <BuyCoin contractAddress={coin.address} />
      <SellCoin contractAddress={coin.address} />
    </div>
  );
}
