'use client';

import { useAccount, useWalletClient, usePublicClient } from 'wagmi';
import { tradeCoin, TradeParameters } from '@zoralabs/coins-sdk';
import { Address, parseEther } from 'viem';
import Swal from 'sweetalert2';

export default function SellCoin({ contractAddress }: { contractAddress: Address }) {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const handleSell = async () => {
    const { value: amount } = await Swal.fire({
      title: 'Enter amount to sell',
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

    if (!amount || !walletClient || !publicClient || !walletClient.account || !address) {
      Swal.fire('Wallet not connected', 'Please connect your wallet', 'error');
      return;
    }

    const tradeParameters: TradeParameters = {
      sell: {
        type: 'erc20',
        address: contractAddress,
      },
      buy: { type: 'eth' },
      amountIn: parseEther(amount),
      slippage: 0.05,
      sender: address,
    };

    try {
      const receipt = await tradeCoin({
        tradeParameters,
        walletClient,
        publicClient,
        account: walletClient.account,
      });

      console.log('Sell successful:', receipt);
      Swal.fire('Success', 'Coin sold successfully!', 'success');
    } catch (err) {
      console.error('Sell failed:', err);
      Swal.fire('Error', 'Sell failed', 'error');
    }
  };

  return (
    <button
      onClick={handleSell}
      className="bg-red-600 hover:bg-red-700 transition-all text-white px-4 py-2 rounded shadow-md text-sm ml-2"
    >
      Sell
    </button>
  );
}
