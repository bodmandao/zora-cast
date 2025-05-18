export const getNeynarOAuthUrl = () => {
  const clientId = process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID!;
  console.log(clientId)
  const redirectUri = encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`);
  return `https://api.neynar.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID!}&redirect_uri=${encodeURIComponent(window.location.origin)}&response_type=token`
//   return `https://api.neynar.com/v2/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID}&redirect_uri=http://localhost:3000/oauth/callback&response_type=token`
//   return `https://api.neynar.com/v2/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=openid%20farcaster&state=xyz`;
};
