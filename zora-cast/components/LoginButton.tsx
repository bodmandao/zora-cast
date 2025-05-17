'use client';

import { getNeynarOAuthUrl } from '@/app/utils/neynar';

export default function LoginButton() {
  const handleLogin = () => {
    window.location.href = getNeynarOAuthUrl();
  };

  return (
    <button onClick={handleLogin} className="px-4 py-2 bg-purple-600 text-white rounded-lg">
      Sign in with Farcaster
    </button>
  );
}
