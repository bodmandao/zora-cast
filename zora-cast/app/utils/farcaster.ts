import { AxiosInstance, AxiosResponse } from 'axios';
import axios from 'axios';

const FARCASTER_API_KEY = process.env.NEXT_PUBLIC_FARCASTER_API_KEY;
const API_BASE_URL = 'https://api.neynar.com/v2'; 

const farcasterClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'api_key': FARCASTER_API_KEY,
    'Content-Type': 'application/json',
  },
});

export const postToFarcaster = async (
  text: string,
  embeds?: { url: string }[],
  signerUuid?: string
): Promise<AxiosResponse> => {
  try {
    const response = await farcasterClient.post('/farcaster/cast', {
      text,
      embeds,
      signer_uuid: signerUuid,
    });
    return response.data;
  } catch (error) {
    console.error('Error posting to Farcaster:', error);
    throw error;
  }
};