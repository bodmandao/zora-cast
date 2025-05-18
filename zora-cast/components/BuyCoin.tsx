'use client';

import { useState } from 'react';
import Swal from 'sweetalert2';
import { Address, parseEther } from 'viem';
import { tradeCoinCall } from '@zoralabs/coins-sdk';
import { useWriteContract,useAccount } from 'wagmi';

export default function BuyCoin({ contractAddress }: { contractAddress: Address }) {
  const { writeContract, status } = useWriteContract();
  const {address} = useAccount()

  const handleBuy = async () => {
    const { value: amount } = await Swal.fire({
      title: 'Buy Coin',
      input: 'text',
      inputLabel: 'Enter amount in ETH',
      inputPlaceholder: '0.01',
      confirmButtonText: 'Buy',
      showCancelButton: true,
      inputValidator: (value:any) => {
        if (!value || isNaN(Number(value)) || Number(value) <= 0) {
          return 'Please enter a valid number';
        }
      },
    });

    if (!amount) return;

    const parsedAmount = parseEther(amount);
    const tradeParams = {
      direction: 'buy' as const,
      target: contractAddress,
      args: {
        recipient: address as Address, 
        orderSize: parsedAmount,
        minAmountOut: BigInt(0),
        tradeReferrer: '0x0000000000000000000000000000000000000000' as Address,
      },
    };

    const contractCall = tradeCoinCall(tradeParams);
    writeContract({ ...contractCall, value: parsedAmount });
  };

  return (
    <button
      onClick={handleBuy}
      disabled={status === 'pending'}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
    >
      {status === 'pending' ? 'Buying...' : 'Buy'}
    </button>
  );
}
