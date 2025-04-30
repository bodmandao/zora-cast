const options = {
    method: 'POST',
    headers: {'x-api-key': '<api-key', 'Content-Type': 'application/json'},
    body: '{"signer_uuid":"19d0c5fd-9b33-4a48-a0e2-bc7b0555baec","text":"Writing to @farcaster via the @neynar APIs 🪐"}'
  };
  
  fetch('https://api.neynar.com/v2/farcaster/cast', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));