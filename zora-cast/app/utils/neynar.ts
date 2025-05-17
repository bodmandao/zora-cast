export const getNeynarOAuthUrl = () => {
  const clientId = process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID!;
  const redirectUri = encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`);
  return `https://api.neynar.com/v2/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=openid%20farcaster&state=xyz`;
};
