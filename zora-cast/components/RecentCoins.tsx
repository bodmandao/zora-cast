'use client';

import { useEffect, useState } from 'react';
import { getCoinsNew } from '@zoralabs/coins-sdk';
import { Address } from 'viem';
import CoinCard from './CoinCard';
import { db } from '@/app/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function RecentCoinFeed() {
  const [coins, setCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        // 1. Get ZoraCast-created coins from Firebase
        const firebaseSnapshot = await getDocs(collection(db, 'zoraCastCoins'));
        const firebaseCoins = firebaseSnapshot.docs.map(doc => doc.data());

        const zoraCastAddresses = new Set(firebaseCoins.map(c => c.address?.toLowerCase()));

        // 2. Fetch recent coins from Zora SDK
        const zoraResponse = await getCoinsNew({ count: 10 });
        const recentCoins = zoraResponse.data?.exploreList?.edges.map(edge => edge.node) || [];

        // 3. Tag ZoraCast coins
        const taggedRecent = recentCoins.map((coin: any) => ({
          ...coin,
          isZoraCastCoin: zoraCastAddresses.has(coin.address.toLowerCase()),
        }));

        // 4. Tag any Firebase coin that may not be in recent Zora result
        const firebaseOnly = firebaseCoins
          .filter(fbCoin => !taggedRecent.some(rc => rc.address.toLowerCase() === fbCoin.address.toLowerCase()))
          .map(fbCoin => ({
            ...fbCoin,
            isZoraCastCoin: true,
          }));

          console.log(firebaseOnly)
        // 5. Merge and sort
        const combined = [...firebaseOnly, ...taggedRecent];
        console.log(combined)
        combined.sort((a, b) => {
          if (a.isZoraCastCoin && !b.isZoraCastCoin) return -1;
          if (!a.isZoraCastCoin && b.isZoraCastCoin) return 1;
          return 0;
        });

        setCoins(combined);
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
      {coins.map((coin, index) => (
        <CoinCard key={index} coin={coin} />
      ))}
    </div>
  );
}
