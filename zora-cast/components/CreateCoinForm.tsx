'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { createCoinCall } from '@zoralabs/coins-sdk';
import { useAccount, useWriteContract } from 'wagmi';
import { Address } from 'viem';
import { base } from "viem/chains";
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { postToFarcaster } from '@/app/utils/farcaster';
import { waitForTransactionReceipt } from "wagmi/actions";


export default function CreateCoinForm() {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { writeContract } = useWriteContract();
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();

  const handleSubmit = async (e: React.FormEvent) => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }
    e.preventDefault();
    setLoading(true);
    setResult(null);

    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('symbol', symbol);

      const metadataRes = await fetch('/api/create-metadata', {
        method: 'POST',
        body: formData,
      });

      const metadataData = await metadataRes.json();

      const params = {
        name,
        symbol,
        uri: metadataData.metadataURI,
        payoutRecipient: address as Address,
      };

      const callParams = await createCoinCall(params);
      writeContract(callParams, {
        onSuccess: async(hash) => {
          alert('done');

          const transactionReceipt = await waitForTransactionReceipt(config, {
            hash,
            chainId: base.id,
          });
          // 2. Prepare Farcaster message
          const tokenUrl = `https://basescan.org/address/${createdToken.contractAddress}:${createdToken.tokenId}`;
          const message = `Just created a new NFT on Zora! Check it out: ${tokenUrl}`;
        },
        onError: (err) => {
          console.error(err);
        },
      });
    }

    // const res = await fetch('/api/create-coin', { 
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ name, symbol, description }),
    // });

    // const data = await res.json();
    // setLoading(false);
    // if (data.success) {
    //   setResult(`✅ Coin deployed at: ${data.contractAddress}`);
    // } else {
    //   setResult('❌ Failed to deploy coin');
    // }
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
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
        className="w-full text-white"
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
