import { getCoin } from '@zoralabs/coins-sdk';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { Address, parseEther } from 'viem';

export async function saveCoinToFirebase(contractAddress: string) {
  const response = await getCoin({address : contractAddress});
  console.log(response)
  const coinData = response.data?.zora20Token

  console.log(coinData)
  if (coinData) {
    await setDoc(doc(db, 'zoraCastCoins', contractAddress), {
      address : contractAddress,
      name: coinData.name,
      symbol: coinData.symbol,
      createdAt: coinData.createdAt,
      marketCap: coinData.marketCap,
      mediaContent: coinData.mediaContent,
      creatorAddress: coinData.creatorAddress,
      creatorProfile: coinData.creatorProfile,
    });
  }
}
