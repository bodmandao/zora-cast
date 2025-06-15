'use client';

import MyCoinFeed from "@/components/MyCoinFeed";
import { motion } from "framer-motion";

export default function MyCoinsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-950 text-white p-6 flex flex-col items-center">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
      >
        🪙 My Created Coins
      </motion.h1>

      <div className="w-full max-w-6xl">
        <MyCoinFeed />
      </div>
    </main>
  );
}
