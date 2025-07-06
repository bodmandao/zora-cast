'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Address, formatEther } from 'viem';
import { useAccount, useReadContract } from 'wagmi';
import BuyCoin from './BuyCoin';
import SellCoin from './SellCoin';

const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
] as const;

export default function CoinCard({ coin }: { coin: any }) {
  const { address: userAddress } = useAccount();
console.log(coin,'coin')
  if (!coin) return null;

  const {
    name,
    symbol,
    address,
    contractAddress,
    createdAt,
    creatorAddress,
    creatorProfile,
    marketCap,
    mediaContent,
  } = coin;

  const { data: balance } = useReadContract({
    address: address as Address,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [userAddress!],
  }) as {
    data: bigint | undefined;
  };

  const imageUrl = mediaContent?.previewImage?.medium || '';
  const createdDate = new Date(createdAt).toLocaleDateString();
  const creatorHandle =
    creatorProfile?.handle || `${creatorAddress.slice(0, 6)}...${creatorAddress.slice(-4)}`;
  const avatarUrl = creatorProfile?.avatar?.previewImage?.small || '';

  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl overflow-hidden shadow-xl transition hover:scale-[1.01] duration-300">
      {imageUrl && (
        <div className="h-48 w-full relative">
          <Image
            src={imageUrl}
            alt={`${name} image`}
            fill
            className="object-cover rounded-t-xl"
          />
        </div>
      )}

      <div className="p-5 space-y-3 text-white">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">{name}</h3>
          {coin.isZoraCastCoin && (
            <span className="inline-block mt-1 bg-purple-700 text-xs px-2 py-1 rounded text-white font-medium">
              🚀 Created on ZoraCast
            </span>
          )}
          <span className="text-sm text-gray-400">{symbol}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-300">
          {avatarUrl && (
            <Image
              src={avatarUrl}
              alt="creator avatar"
              width={24}
              height={24}
              className="rounded-full"
            />
          )}
          Creator: {creatorHandle}
        </div>

        <div className="text-sm text-gray-300">
          Market Cap: ${Number(marketCap).toFixed(2)}
        </div>

        <div className="text-xs text-gray-500">Created on {createdDate}</div>

        {userAddress && (
          <p className="text-sm text-gray-300">
            Your Balance:{' '}
            <span className="font-medium">
              {balance ? (Number(balance) / 1e18).toFixed(4) : '0.0000'}
            </span>
          </p>
        )}

        <div className="flex gap-2 mt-3">
          <BuyCoin contractAddress={contractAddress} />
          <SellCoin contractAddress={contractAddress} />
        </div>

        <Link
          href={`/coin/${address}`}
          className="inline-block mt-4 text-sm px-4 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-md text-white text-center"
        >
          View Coin →
        </Link>
      </div>
    </div>
  );
}
