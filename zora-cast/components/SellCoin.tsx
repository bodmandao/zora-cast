'use client';

import { useState } from 'react';
import Swal from 'sweetalert2';
import { Address, parseEther } from 'viem';
import { tradeCoinCall } from '@zoralabs/coins-sdk';
import { useWriteContract,useAccount } from 'wagmi';


export default function SellCoin({ contractAddress }: { contractAddress: Address }) {
  const { writeContract, status } = useWriteContract();
  const {address} = useAccount()


  const handleSell = async () => {
    const { value: amount } = await Swal.fire({
      title: 'Sell Coin',
      input: 'text',
      inputLabel: 'Enter amount to sell',
      inputPlaceholder: '0.01',
      confirmButtonText: 'Sell',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value || isNaN(Number(value)) || Number(value) <= 0) {
          return 'Please enter a valid number';
        }
      },
    });

    if (!amount) return;

    const parsedAmount = parseEther(amount);
    const tradeParams = {
      direction: 'sell' as const,
      target: contractAddress,
      args: {
        recipient: address as Address,
        orderSize: parsedAmount,
        minAmountOut: BigInt(0),
        tradeReferrer: '0x0000000000000000000000000000000000000000' as Address,
      },
    };

    const contractCall = tradeCoinCall(tradeParams);
    writeContract({ ...contractCall });
  };

  return (
    <button
      onClick={handleSell}
      disabled={status === 'pending'}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded ml-2"
    >
      {status === 'pending' ? 'Selling...' : 'Sell'}
    </button>
  );
}
