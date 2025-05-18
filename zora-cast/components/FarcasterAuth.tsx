'use client';

import { useSignIn, QRCode } from '@farcaster/auth-kit';
import { useEffect, useState } from 'react';

export default function FarcasterAuth() {
  const {
    signIn,
    url,
    data,
  } = useSignIn({
    onSuccess: ({ fid }) => console.log('Signed in with FID:', fid),
  });

  const [isSignedIn, setIsSignedIn] = useState(false);
  const username = data?.username;

  useEffect(() => {
    if (username) {
      setIsSignedIn(true);
    }
  }, [username]);

  return (
    <div className="bg-zinc-800 text-white p-4 rounded-lg shadow-md mb-4">
      {!isSignedIn ? (
        <>
          <button
            onClick={signIn}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-white"
          >
            Sign in with Farcaster
          </button>
          {url && (
            <div className="mt-4">
              <QRCode uri={url} />
              <p className="mt-2 text-sm text-gray-400">Scan with Warpcast</p>
            </div>
          )}
        </>
      ) : (
        <p className="text-green-400">✅ Signed in as <strong>@{username}</strong></p>
      )}
    </div>
  );
}
