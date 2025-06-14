'use client';

import { tradeCoinCall } from '@zoralabs/coins-sdk';
import { useWriteContract } from 'wagmi';
import { Address, parseEther } from 'viem';
import Swal from 'sweetalert2';

export default function SellCoin({ contractAddress }: { contractAddress: Address }) {
  const handleSell = async () => {
    const { value: amount } = await Swal.fire({
      title: 'Enter amount in ETH',
      input: 'text',
      inputLabel: 'Sell Coin',
      inputPlaceholder: '0.01',
      background: '#1c1c1c',
      color: '#fff',
      confirmButtonColor: '#f87171',
      inputAttributes: {
        autocapitalize: 'off',
      },
    });

    if (!amount) return;

    const tradeParams = {
      direction: 'sell' as const,
      target: contractAddress,
      args: {
        recipient: contractAddress,
        orderSize: parseEther(amount),
        minAmountOut: BigInt(0),
        tradeReferrer: '0x0000000000000000000000000000000000000000' as Address,
      },
    };

    const callParams = tradeCoinCall(tradeParams);
    writeContract({ ...callParams });
  };

  const { writeContract, isPending } = useWriteContract();

  return (
    <button
      onClick={handleSell}
      disabled={isPending}
      className="bg-red-600 hover:bg-red-700 transition-all text-white px-4 py-2 rounded shadow-md text-sm ml-2"
    >
      {isPending ? 'Selling...' : 'Sell'}
    </button>
  );
}
