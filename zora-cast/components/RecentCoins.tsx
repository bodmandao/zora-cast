'use client';

import { useEffect, useState } from 'react';
import { getCoinsNew } from '@zoralabs/coins-sdk';
import { Address } from 'viem';
import CoinCard from './CoinCard';
import { db } from '@/app/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';


export default function RecentCoinFeed() {
  const [coins, setCoins] = useState<any[]>([]);
  const [zoraCastAddresses, setZoraCastAddresses] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchCoins = async () => {
      try {
        // Fetch coins created via ZoraCast from Firebase
        const firebaseSnapshot = await getDocs(collection(db, 'zoraCastCoins'));
        const zoraCastCoins = firebaseSnapshot.docs.map(doc => doc.data());
        const addressSet = new Set(zoraCastCoins.map(c => c.contractAddress.toLowerCase()));
        setZoraCastAddresses(addressSet);

        // Fetch recent coins from Zora SDK
        const response = await getCoinsNew({ count: 10 });
        const allCoins = response.data?.exploreList?.edges || [];

        // Tag those created via ZoraCast
        const tagged = allCoins.map((edge: any) => ({
          ...edge.node,
          isZoraCastCoin: addressSet.has(edge.node.address.toLowerCase()),
        }));

        // Sort ZoraCast coins to top
        tagged.sort((a, b) => {
          if (a.isZoraCastCoin && !b.isZoraCastCoin) return -1;
          if (!a.isZoraCastCoin && b.isZoraCastCoin) return 1;
          return 0;
        });
        setCoins(tagged);
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
        <CoinCard key={index} coin={coin.node} />
      ))}
    </div>
  );
}
