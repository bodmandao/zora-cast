'use client';

import { useEffect, useState } from 'react';
import { getCoinsNew } from '@zoralabs/coins-sdk';
import { Address } from 'viem';
import CoinCard from './CoinCard';

export default function RecentCoinFeed() {
  const [coins, setCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await getCoinsNew({ count: 10 });
        setCoins(response.data?.exploreList?.edges || []);
      } catch (err) {
        console.error('Failed to fetch coins:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  if (loading) return <div className="text-white">Loading coins...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {coins.map((coin, index) => (
        <CoinCard key={index} coin={coin.node} />
      ))}
    </div>
  );
}
