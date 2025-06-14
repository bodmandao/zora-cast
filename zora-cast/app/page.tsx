'use client';

import CreateCoinForm from "@/components/CreateCoinForm";
import { motion } from "framer-motion";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import RecentCoins from "@/components/RecentCoins";
import Link from "next/link";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <ConnectButton />

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-6"
      >
        ZoraCast 🚀
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-lg text-gray-300 mb-8 max-w-xl text-center"
      >
        Create your own coin on Zora and instantly share it with the Farcaster community.
      </motion.p>

      {/* Show button only if wallet is connected */}
      {isConnected && (
        <Link
          href="/my-coins"
          className="mb-10 px-5 py-2 bg-white text-black font-semibold rounded hover:bg-zinc-200 transition"
        >
          View Your Coins
        </Link>
      )}

      <CreateCoinForm />
      <RecentCoins />
    </main>
  );
}
