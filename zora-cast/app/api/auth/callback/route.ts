import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  const res = await fetch('https://api.neynar.com/v2/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api_key': process.env.NEXT_PUBLIC_FARCASTER_API_KEY!,
    },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code,
      client_id: process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID,
      client_secret: process.env.NEYNAR_CLIENT_SECRET,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    }),
  });

  const data = await res.json();

  // Save token + signer in a cookie or redirect with them as query
  const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/store?access_token=${data.access_token}&signer_uuid=${data.signer_uuid}`;
  return NextResponse.redirect(redirectUrl);
}
