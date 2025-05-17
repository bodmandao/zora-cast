import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    const res = await axios.post(
      'https://api.neynar.com/v2/oauth/token',
      {
        code,
        client_id: process.env.NEYNAR_CLIENT_ID,
        client_secret: process.env.NEYNAR_CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: process.env.NEYNAR_REDIRECT_URI,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    return NextResponse.json({
      accessToken: res.data.access_token,
      signerUuid: res.data.signer_uuid,
      fid: res.data.user.fid,
    });
  } catch (error: any) {
    console.error('OAuth error:', error?.response?.data || error.message);
    return NextResponse.json({ error: 'OAuth failed' }, { status: 500 });
  }
}
