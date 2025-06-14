'use client';

import { useEffect, useState } from 'react';
import { getCoinsNew } from '@zoralabs/coins-sdk';
import { useAccount } from 'wagmi';
import CoinCard from './CoinCard';
import { motion } from 'framer-motion';

export default function MyCoinFeed() {
  const [yourCoins, setYourCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { address } = useAccount();

  useEffect(() => {
    const fetchUserCoins = async () => {
      if (!address) return;

      try {
        const response = await getCoinsNew({ count: 50 });
        const allCoins = response.data?.exploreList?.edges || [];

        const userCoins = allCoins.filter(
          (coin: any) =>
            coin.node.creatorAddress.toLowerCase() === address.toLowerCase()
        );

        setYourCoins(userCoins);
      } catch (err) {
        console.error('Failed to fetch your coins:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCoins();
  }, [address]);

  if (!address)
    return (
      <div className="text-center text-zinc-300 mt-20">
        <p className="text-lg">🔐 Connect your wallet to view your minted coins.</p>
      </div>
    );

  if (loading)
    return (
      <div className="text-center text-zinc-300 mt-20 animate-pulse">
        <p className="text-lg">Fetching your coins...</p>
      </div>
    );

  if (yourCoins.length === 0)
    return (
      <div className="text-center mt-20">
        <img src="/empty-state.svg" alt="No coins" className="w-40 mx-auto mb-6 opacity-70" />
        <p className="text-zinc-400 text-lg">You haven’t minted any coins yet.</p>
      </div>
    );

  return (
    <div className="mt-16 px-4 md:px-8">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-white mb-8 text-center md:text-left"
      >
        💰 Your Minted Coins
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {yourCoins.map((coin, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <CoinCard coin={coin.node} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
