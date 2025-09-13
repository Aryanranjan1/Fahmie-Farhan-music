import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(file: File, folder: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result.secure_url);
        } else {
          reject(new Error('Cloudinary upload failed'));
        }
      }
    );
    uploadStream.end(buffer);
  });
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get('published') === 'true';

    try {
        const musicTracks = await prisma.musicTrack.findMany({
            where: publishedOnly ? { published: true } : {},
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(musicTracks);
    } catch (error) {
        console.error("Error fetching music tracks:", error);
        return NextResponse.json({ message: "Failed to fetch music tracks" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.formData();
        const title = data.get('title') as string;
        const category = data.get('category') as string;
        const description = data.get('description') as string;
        const fileSize = data.get('fileSize') as string;
        const published = data.get('published') === 'true';
        const featured = data.get('featured') === 'true';

        const audioFile: File | null = data.get('audioFile') as unknown as File;
        const coverImageFile: File | null = data.get('coverImageFile') as unknown as File;
        
        if (!title || !audioFile) {
            return NextResponse.json({ message: "Title and Audio File are required" }, { status: 400 });
        }

        const audioUrl = await uploadToCloudinary(audioFile, 'audio');

        let coverImageUrl: string | undefined = undefined;
        if (coverImageFile) {
            coverImageUrl = await uploadToCloudinary(coverImageFile, 'images');
        }
        
        const newTrack = await prisma.musicTrack.create({
            data: {
                title,
                category,
                description,
                fileSize,
                published,
                featured,
                audioUrl,
                coverImageUrl,
            }
        });

        return NextResponse.json(newTrack, { status: 201 });

    } catch (error) {
        console.error("Error creating music track:", error);
        return NextResponse.json({ message: "Failed to create music track" }, { status: 500 });
    }
}
