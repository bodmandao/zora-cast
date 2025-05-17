import axios from "axios";

export const postToFarcaster = async (
  text: string,
  embedUrl?: string,
  signerUuid?: string,
  accessToken?: string // optional
): Promise<any> => {
  const headers: any = {
    'Content-Type': 'application/json',
    'x-api-key': process.env.NEXT_PUBLIC_FARCASTER_API_KEY,
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const payload = {
    text,
    signer_uuid: signerUuid,
    embeds: embedUrl ? [{ url: embedUrl }] : undefined,
  };

  const response = await axios.post('https://api.neynar.com/v2/farcaster/cast', payload, {
    headers,
  });

  return response.data;
};
