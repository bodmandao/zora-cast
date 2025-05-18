'use client';

import { useEffect, useState } from 'react';
import { getCoinsNew } from '@zoralabs/coins-sdk';

export default function RecentCoins() {
  const [coins, setCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCoins() {
      try {
        const response = await getCoinsNew({ count: 10 });
        const newCoins = response.data?.exploreList?.edges || [];
        setCoins(newCoins);
      } catch (error) {
        console.error('Failed to fetch coins:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCoins();
  }, []);

  return (
    <div className="py-10 px-4 md:px-10 min-h-screen bg-gradient-to-b from-zinc-900 to-black">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">🪙 Recent Coin Launches</h2>

      {loading ? (
        <p className="text-zinc-400 text-center">Loading...</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {coins.map((coin: any, idx) => {
            const { name, symbol, createdAt, creatorAddress, marketCap } = coin.node;
            const formattedDate = new Date(createdAt).toLocaleString();

            return (
              <div
                key={idx}
                className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-5 shadow-lg hover:scale-[1.02] transition-transform"
              >
                <h3 className="text-xl font-semibold text-white">{name} ({symbol})</h3>
                <p className="text-sm text-zinc-400 mt-2">Created: {formattedDate}</p>
                <p className="text-sm text-zinc-400">Creator: <span className="break-all">{creatorAddress}</span></p>
                <p className="text-sm text-zinc-400">Market Cap: {Number(marketCap || 0).toLocaleString()} ETH</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
