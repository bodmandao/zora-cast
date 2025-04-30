import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const image = formData.get('image') as File | null;
  const name = formData.get('name') as string | null;
  const description = formData.get('description') as string | null;
  const symbol = formData.get('symbol') as string | null;

  if (!image || !name || !symbol || !description) {
    return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
  }

  // Convert image to buffer
  const buffer = Buffer.from(await image.arrayBuffer());

  // Prepare image upload form
  const imageForm = new FormData();
  imageForm.append('file', buffer, {
    filename: image.name,
    contentType: image.type,
  });

  // Upload image to Pinata
  const uploadImage = await axios.post(
    'https://api.pinata.cloud/pinning/pinFileToIPFS',
    imageForm,
    {
      headers: {
        ...imageForm.getHeaders(),
        pinata_api_key: process.env.PINATA_KEY!,
        pinata_secret_api_key: process.env.PINATA_SECRET!,
      },
    }
  );

  const imageIpfsHash = uploadImage.data.IpfsHash;

  // Upload metadata
  const metadata = {
    name,
    description,
    symbol,
    image: `ipfs://${imageIpfsHash}`,
  };

  const uploadMetadata = await axios.post(
    'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    metadata,
    {
      headers: {
        pinata_api_key: process.env.PINATA_KEY!,
        pinata_secret_api_key: process.env.PINATA_SECRET!,
      },
    }
  );

  const metadataIpfsHash = uploadMetadata.data.IpfsHash;

  return NextResponse.json({ success: true, metadataURI: `ipfs://${metadataIpfsHash}` });
}
