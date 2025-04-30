import axios from 'axios';

export const postToFarcaster = async (
  text: string,
  embedUrl?: string
): Promise<any> => {
  try {
    const payload: any = {
      text,
      signer_uuid: process.env.NEXT_PUBLIC_SIGNER_ID!,
    };

    if (embedUrl) {
      payload.embeds = [{ url: embedUrl }];
    }

    const response = await axios.post(
      'https://api.neynar.com/v2/farcaster/cast',
      payload,
      {
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_FARCASTER_API_KEY!,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Farcaster post failed:', error.response?.data || error.message);
    throw error;
  }
};
