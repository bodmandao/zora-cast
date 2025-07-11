'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { createCoinCall, ValidMetadataURI,InitialPurchaseCurrency,createMetadataBuilder,
  createZoraUploaderForCreator,CreateCoinArgs,DeployCurrency
 } from '@zoralabs/coins-sdk';
import { useAccount, useWriteContract,useSimulateContract  } from 'wagmi';
import { Address, parseEther } from 'viem';
import { base } from "viem/chains";
import { simulateContract } from 'wagmi/actions';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { postToFarcaster } from '@/app/utils/farcaster';
import { waitForTransactionReceipt } from "wagmi/actions";
import { useSignIn, useProfile, SignInButton, } from '@farcaster/auth-kit';
import { config } from '@/app/config';
import { toast } from 'sonner';
import * as dotenv from 'dotenv'
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { saveCoinToFirebase } from '@/app/utils/CoinHelper';
dotenv.config()


export default function CreateCoinForm() {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { writeContract } = useWriteContract();
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();

  const saveCastUrl = (contractAddress: string, castHash: string) => {
    const url = `https://warpcast.com/~/cast/${castHash}`;
    const current = JSON.parse(localStorage.getItem('castUrls') || '{}');
    current[contractAddress] = url;
    localStorage.setItem('castUrls', JSON.stringify(current));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      openConnectModal?.();
      return;
    }

    if (!imageFile) {
      toast.error('Please upload an image.');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const { createMetadataParameters } = await createMetadataBuilder()
      .withName(name)
      .withSymbol(symbol)
      .withDescription(description)
      .withImage(imageFile)
      .upload(createZoraUploaderForCreator(address as Address));

       const createCoin: CreateCoinArgs = {
      ...createMetadataParameters,
      payoutRecipient: address as Address,
      currency: DeployCurrency.ZORA,
    };

 const callParams = await createCoinCall(createCoin);

    await simulateContract(config, {
      ...callParams,
      account: address,
      chainId: base.id,
    });
    
      toast.promise(
        new Promise((resolve, reject) => {
          writeContract(callParams, {
            onSuccess: async (hash) => {
              try {
                const transactionReceipt = await waitForTransactionReceipt(config, {
                  hash,
                  chainId: base.id,
                });

                const contractAddress = transactionReceipt.logs[0].address;
                const tokenUrl = `https://basescan.org/address/${contractAddress}`;
                const message = `Just created a new coin on Zora! Check it out: ${tokenUrl}`;
                const postRes = await postToFarcaster(message, tokenUrl);
                console.log(postRes, 'pr')
                const castHash = postRes?.cast.hash;
                const farcasterUrl = `https://warpcast.com/~/cast/${castHash}`;
                saveCastUrl(contractAddress, farcasterUrl)
                saveCoinToFirebase(contractAddress)
                setResult(
                  <div>
                    <a href={farcasterUrl} target="_blank" rel="noopener noreferrer">
                      View cast on Farcaster
                    </a>
                    <br />
                    <a href={tokenUrl} target="_blank" rel="noopener noreferrer">
                      Check out the token
                    </a>
                  </div>
                );

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
                resolve(true);
              } catch (err) {
                console.log(err, 'error')
                toast.error('Coin created, but failed to cast to Farcaster.');
                reject(err);
              }
            },
            onError: (err) => {
              toast.error('Failed to deploy the coin.');
                console.log(err, 'error')

              reject(err);
            },
          });
        }),
        {
          loading: 'Deploying coin...',
          success: 'Coin deployed!',
          error: 'Something went wrong.',
        }
      );
    } catch (err: any) {
      console.error(err);
      toast.error('Unexpected error occurred.', err);
    } finally {
      setLoading(false);
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

        {result && <div className="text-center text-sm text-green-400 mt-2">{result}</div>}
      </motion.form>
    </>

  );
}
