import { useEffect, useState } from 'react';

export function useFarcasterAuth() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [signerUuid, setSignerUuid] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('farcaster_access_token');
    const signer = localStorage.getItem('farcaster_signer_uuid');
    if (token && signer) {
      setAccessToken(token);
      setSignerUuid(signer);
    }
  }, []);

  const saveAuth = (token: string, signer: string) => {
    localStorage.setItem('farcaster_access_token', token);
    localStorage.setItem('farcaster_signer_uuid', signer);
    setAccessToken(token);
    setSignerUuid(signer);
  };

  const clearAuth = () => {
    localStorage.removeItem('farcaster_access_token');
    localStorage.removeItem('farcaster_signer_uuid');
    setAccessToken(null);
    setSignerUuid(null);
  };

  return { accessToken, signerUuid, saveAuth, clearAuth };
}
