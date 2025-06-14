'use client';

import { tradeCoinCall } from '@zoralabs/coins-sdk';
import { useWriteContract } from 'wagmi';
import { Address, parseEther } from 'viem';
import Swal from 'sweetalert2';

export default function BuyCoin({ contractAddress }: { contractAddress: Address }) {
  const handleBuy = async () => {
    const { value: amount } = await Swal.fire({
      title: 'Enter amount in ETH',
      input: 'text',
      inputLabel: 'Buy Coin',
      inputPlaceholder: '0.01',
      background: '#1c1c1c',
      color: '#fff',
      confirmButtonColor: '#6366f1',
      inputAttributes: {
        autocapitalize: 'off',
      },
    });

    if (!amount) return;

    const tradeParams = {
      direction: 'buy' as const,
      target: contractAddress,
      args: {
        recipient: contractAddress,
        orderSize: parseEther(amount),
        minAmountOut: 0n,
        tradeReferrer: '0x0000000000000000000000000000000000000000' as Address,
      },
    };

    const callParams = tradeCoinCall(tradeParams);
    writeContract({ ...callParams, value: tradeParams.args.orderSize });
  };

  const { writeContract, isPending } = useWriteContract();

  return (
    <button
      onClick={handleBuy}
      disabled={isPending}
      className="bg-green-600 hover:bg-green-700 transition-all text-white px-4 py-2 rounded shadow-md text-sm"
    >
      {isPending ? 'Buying...' : 'Buy'}
    </button>
  );
}
