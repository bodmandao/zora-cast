'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function CreateCoinForm() {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [supply, setSupply] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const res = await fetch('/api/create-coin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, symbol, supply }),
    });

    const data = await res.json();
    setLoading(false);
    if (data.success) {
      setResult(`✅ Coin deployed at: ${data.contractAddress}`);
    } else {
      setResult('❌ Failed to deploy coin');
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-zinc-900 rounded-2xl p-6 shadow-lg w-full max-w-md space-y-4"
    >
      <input
        type="text"
        placeholder="Token Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white"
      />
      <input
        type="text"
        placeholder="Symbol (e.g. ZORA)"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        required
        className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white"
      />
      <input
        type="number"
        placeholder="Total Supply"
        value={supply}
        onChange={(e) => setSupply(e.target.value)}
        required
        className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full p-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {loading ? 'Launching...' : 'Launch Coin'}
      </button>

      {result && <p className="text-center text-sm text-green-400 mt-2">{result}</p>}
    </motion.form>
  );
}
