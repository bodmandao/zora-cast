
# 🪐 ZoraCast

ZoraCast is a Next.js-based app that allows users to launch their own Zora coins and automatically cast the launch to [Farcaster](https://warpcast.com) via the Neynar API.

## ✨ Features

- Upload image and metadata for your coin
- Deploy a new coin using the [Zora Coins SDK](https://docs.zora.co/docs/smart-contracts/zora-coins)
- Automatically post a cast to Farcaster with a link to the deployed coin
- Toast notifications via [Sonner](https://sonner.emilkowal.dev/)
- Uses Wagmi, RainbowKit, and WalletConnect for wallet interaction

---

## 🧪 Tech Stack

- **Next.js (App Router)**
- **Zora Coin SDK**
- **Neynar API** (for Farcaster)
- **Wagmi + RainbowKit** (wallet connection)
- **Sonner** (toast notifications)
- **Pinata** (image + metadata upload to IPFS)

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/bodmandao/zora-cast.git
cd zoracast
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root and add:

```env
NEXT_PUBLIC_FARCASTER_API_KEY=your_neynar_api_key
FARCASTER_SIGNER_UUID=your_farcaster_signer_uuid
PINATA_KEY=your_pinata_key
PINATA_SECRET=your_pinata_secret
```

---

## 🧠 Walkthrough

### Step 1: Connect Wallet
User connects their wallet using RainbowKit modal. Required to deploy coins.

### Step 2: Fill the Form
- **Name:** Coin name (e.g., “CoolCoin”)
- **Symbol:** Short token symbol (e.g., “COOL”)
- **Description:** Description for the coin
- **Image:** Upload a representative image

### Step 3: Launch Coin
- FormData is sent to the `/api/create-metadata` route
- Server uploads image + metadata to IPFS via Pinata
- Coin is deployed on Zora using the SDK
- Once deployed, transaction is confirmed and the contract address is extracted

### Step 4: Post to Farcaster
- Cast is posted to Neynar API using the app `signer_uuid`(this will be later updated to use user's signer_uuid)
- Includes the contract URL and shows as an embedded link on Warpcast
- Example message:
  ```
  Just created a new coin on Zora! Check it out: https://basescan.org/address/0x123...
  ```

### Step 5: Toasts
- On success: ✅ Coin created and casted! With links to:
  - BaseScan
  - Warpcast post
- On failure: ⚠️ Shows failure message if Farcaster cast fails

---

## 📂 Project Structure

```
/app
  /api/create-metadata.ts   # Uploads image + metadata to IPFS
  /utils/farcaster.ts       # Handles Farcaster cast post
  /config.ts                # Wagmi config
  /page.tsx                 # Home + Form UI
```
---

## 💙 Credits

- [Zora](https://zora.co/)
- [Farcaster](https://warpcast.com/)
- [Neynar](https://docs.neynar.com/)
- [Sonner](https://sonner.emilkowal.dev/)

---


## 📄 License

MIT
```
