'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCoinsNew } from '@zoralabs/coins-sdk';
import { useAccount, useReadContract } from 'wagmi';
import { Address, formatEther } from 'viem';
import Image from 'next/image';
import BuyCoin from '@/components/BuyCoin';
import SellCoin from '@/components/SellCoin';

const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
] as const;

export default function CoinProfilePage() {
  const { address: coinAddress } = useParams<{ address: Address }>();
  const [coinData, setCoinData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { address: userAddress } = useAccount();

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const response = await getCoinsNew({ count: 50 });
        const allCoins = response.data?.exploreList?.edges || [];
        const match = allCoins.find(
          (coin: any) =>
            coin.node.address.toLowerCase() === coinAddress?.toLowerCase()
        );
        setCoinData(match?.node || null);
      } catch (err) {
        console.error('Failed to load coin data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoin();
  }, [coinAddress]);

  const { data: balance } = useReadContract({
    address: coinAddress as Address,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [userAddress!],
  }) as {
    data: bigint | undefined;
  };

  const getCastUrl = (contractAddress: string): string | null => {
    if (typeof window === 'undefined') return null;
    const stored = JSON.parse(localStorage.getItem('castUrls') || '{}');
    return stored[contractAddress] || null;
  };

  if (loading) return <div className="text-white text-center mt-10">Loading coin details...</div>;
  if (!coinData) return <div className="text-red-500 text-center mt-10">Coin not found.</div>;

  const {
    name,
    symbol,
    creatorAddress,
    createdAt,
    marketCap,
    mediaContent,
    creatorProfile,
  } = coinData;

  const imageUrl = mediaContent?.previewImage?.medium || '';
  const creatorHandle = creatorProfile?.handle || `${creatorAddress.slice(0, 6)}...${creatorAddress.slice(-4)}`;
  const castUrl = getCastUrl(coinAddress);

  return (
    <div className="max-w-3xl mx-auto mt-12 bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl shadow-lg overflow-hidden text-white">
      {imageUrl && (
        <div className="relative h-64 w-full">
          <Image
            src={imageUrl}
            alt={`${name} banner`}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{name} <span className="text-sm text-zinc-400">({symbol})</span></h1>
          {castUrl ? (
            <a
              href={castUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-full"
            >
              Launch Cast ↗
            </a>
          ) : (
            <span className="text-xs italic text-zinc-400">No Cast Found</span>
          )}
        </div>

        <p className="text-sm text-zinc-300">
          <span className="font-medium">Creator:</span> {creatorHandle}
        </p>
        <p className="text-sm text-zinc-300">
          <span className="font-medium">Created:</span> {new Date(createdAt).toLocaleDateString()}
        </p>
        <p className="text-sm text-zinc-300">
          <span className="font-medium">Market Cap:</span> ${Number(marketCap).toFixed(2)}
        </p>

        {userAddress && (
          <p className="text-sm text-zinc-300">
            <span className="font-medium">Your Balance:</span> {balance ? formatEther(balance) : '0'}
          </p>
        )}

        <div className="pt-4 space-y-3">
          <BuyCoin contractAddress={coinAddress as Address} />
          <SellCoin contractAddress={coinAddress as Address} />
        </div>
      </div>
    </div>
  );
}
