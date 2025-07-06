'use client';

import { useAccount, useWalletClient, usePublicClient } from 'wagmi';
import { tradeCoin, TradeParameters, DeployCurrency } from '@zoralabs/coins-sdk';
import { Address, parseEther } from 'viem';
import Swal from 'sweetalert2';

export default function BuyCoin({ contractAddress }: { contractAddress: Address }) {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

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

    if (!amount || !walletClient || !publicClient || !address) return;

    const tradeParameters: TradeParameters = {
      sell: { type: 'eth' },
      buy: {
        type: 'erc20',
        address: contractAddress,
      },
      amountIn: parseEther(amount),
      slippage: 0.05, // 5% slippage
      sender: address,
    };

    try {
      const receipt = await tradeCoin({
        tradeParameters,
        walletClient,
        publicClient,
        account: walletClient.account,
      });

      console.log('Trade successful:', receipt);
      Swal.fire('Success', 'Coin purchased successfully!', 'success');
    } catch (err) {
      console.error('Trade failed:', err);
      Swal.fire('Error', 'Trade failed', 'error');
    }
  };

  return (
    <button
      onClick={handleBuy}
      className="bg-green-600 hover:bg-green-700 transition-all text-white px-4 py-2 rounded shadow-md text-sm"
    >
      Buy
    </button>
  );
}
