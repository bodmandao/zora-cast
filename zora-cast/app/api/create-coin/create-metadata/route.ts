import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
    const { name, description,symbol, image } = await request.json();

    const uploadImage = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        image,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: process.env.PINATA_API_KEY,
            pinata_secret_api_key: process.env.PINATA_SECRET,
          },
        }
      );
}