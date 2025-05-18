'use client';

import React, { useEffect, useState } from 'react';
import { getCoinsNew, tradeCoinCall } from '@zoralabs/coins-sdk';
import { parseEther, Address } from 'viem';

export default function RecentCoinFeed() {
  const [coins, setCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [buyAmounts, setBuyAmounts] = useState<Record<string, string>>({}); // coinId -> amount

  // Fetch recent coins on mount
  useEffect(() => {
    async function fetchCoins() {
      setLoading(true);
      try {
        const response = await getCoinsNew({ count: 10 });
        const edges = response.data?.exploreList?.edges || [];
        setCoins(edges);
        setError(null);
      } catch (e) {
        setError('Failed to fetch coins.');
      } finally {
        setLoading(false);
      }
    }
    fetchCoins();
  }, []);

  return (
    <div className="recent-coin-feed">
      <h2 className="title">Recent Coins</h2>
      {loading && <p>Loading coins...</p>}
      {error && <p className="error">{error}</p>}

      <div className="coins-list">
        {coins.map(({ node }) => (
          <CoinCard
            key={node.id}
            coin={node}
            buyAmount={buyAmounts[node.id] || ''}
            setBuyAmount={(amount) =>
              setBuyAmounts((prev) => ({ ...prev, [node.id]: amount }))
            }
          />
        ))}
      </div>

      <style jsx>{`
        .recent-coin-feed {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem;
          color: white;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .title {
          text-align: center;
          font-size: 2rem;
          margin-bottom: 1.5rem;
          text-shadow: 0 0 10px #7f5af0;
        }
        .coins-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        .error {
          color: #ff6b6b;
          text-align: center;
        }
      `}</style>
    </div>
  );
}

function CoinCard({
  coin,
  buyAmount,
  setBuyAmount,
}: {
  coin: any;
  buyAmount: string;
  setBuyAmount: (amount: string) => void;
}) {
  const tradeParams = {
    direction: 'buy' as const,
    target: coin.contractAddress as Address,
    args: {
      recipient: coin.creatorAddress as Address,
      orderSize: buyAmount ? parseEther(buyAmount) : BigInt(0),
      minAmountOut: BigInt(0),
      tradeReferrer: '0x0000000000000000000000000000000000000000' as Address,
    },
  };



  const createdAtDate = new Date(coin.createdAt);

  return (
    <div className="coin-card">
      <h3 className="coin-name">
        {coin.name} <span className="symbol">({coin.symbol})</span>
      </h3>
      <p>Created: {createdAtDate.toLocaleString()}</p>
      <p>Creator: {coin.creatorAddress}</p>
      <p>Market Cap: {coin.marketCap || 'N/A'}</p>



      <style jsx>{`
        .coin-card {
          background: rgba(255, 255, 255, 0.07);
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow:
            0 4px 30px rgba(31, 38, 135, 0.37);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          color: white;
          font-size: 0.9rem;
        }
        .coin-name {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          text-shadow: 0 0 8px #7f5af0;
        }
        .symbol {
          font-weight: 400;
          color: #bbb;
        }
        .buy-section {
          margin-top: 1rem;
          display: flex;
          gap: 0.75rem;
        }
        .buy-input {
          flex: 1;
          padding: 0.5rem 1rem;
          border-radius: 10px;
          border: none;
          background: rgba(255, 255, 255, 0.12);
          color: white;
          font-size: 1rem;
          outline: none;
          transition: background 0.3s ease;
        }
        .buy-input:focus {
          background: rgba(255, 255, 255, 0.25);
        }
        .buy-button {
          padding: 0.5rem 1.5rem;
          background-color: #7f5af0;
          border: none;
          border-radius: 10px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .buy-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .buy-button:hover:not(:disabled) {
          background-color: #6246ea;
        }
        .error-text {
          color: #ff6b6b;
          font-size: 0.8rem;
          margin-top: 0.3rem;
        }
      `}</style>
    </div>
  );
}
