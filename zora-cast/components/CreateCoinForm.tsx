'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { createCoinCall } from '@zoralabs/coins-sdk';
import { useAccount, useWriteContract } from 'wagmi';
import { Address } from 'viem';
import { base } from "viem/chains";
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { postToFarcaster } from '@/app/utils/farcaster';
import { waitForTransactionReceipt } from "wagmi/actions";
import { config } from '@/app/config';
import { toast } from 'sonner';
import * as dotenv from 'dotenv'
dotenv.config()


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

  const farcasterSignerUuid = process.env.NEXT_PUBLIC_FARCASTER_API_KEY

  const handleSubmit = async (e: React.FormEvent) => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }
    e.preventDefault();
    setLoading(true);
    setResult(null);

    if (imageFile) {
      console.log(farcasterSignerUuid)
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
        onSuccess: async (hash) => {
          const transactionReceipt = await waitForTransactionReceipt(config, {
            hash,
            chainId: base.id,
          });
        
          const contractAddress = transactionReceipt.logs[0].address;
          const tokenUrl = `https://basescan.org/address/${contractAddress}`;
          const message = `Just created a new coin on Zora! Check it out: ${tokenUrl}`;
        
          try {
            const postRes = await postToFarcaster(message, [{ url: tokenUrl }], farcasterSignerUuid);
            const castHash = postRes.data.cast.hash;
            const farcasterUrl = `https://warpcast.com/~/cast/${castHash}`;
        
            toast.success(
              <div>
                🚀 Coin created and casted!
                <div className="mt-1">
                  <a href={tokenUrl} target="_blank" rel="noopener noreferrer" className="underline text-sm mr-3">
                    View on BaseScan
                  </a>
                  <a href={farcasterUrl} target="_blank" rel="noopener noreferrer" className="underline text-sm">
                    View Cast
                  </a>
                </div>
              </div>
            );
          } catch (err) {
            console.error('Farcaster error:', err);
            toast.error('Coin created, but failed to cast to Farcaster.');
          } finally {
            setLoading(false);
          }
        },
      });
    }

   
  };

  return (
    <>
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
    </>
   
  );
}
