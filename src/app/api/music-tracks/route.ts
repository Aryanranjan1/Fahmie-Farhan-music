import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { v2 as cloudinary } from 'cloudinary';

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.error('Cloudinary environment variables are not set');
} else {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
}

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
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else if (result) {
          resolve(result.secure_url);
        } else {
          console.error('Cloudinary upload failed with no result');
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
        console.log('Starting music track creation...');
        const data = await request.formData();
        console.log('Form data parsed.');

        const title = data.get('title') as string;
        const category = data.get('category') as string;
        const description = data.get('description') as string;
        const fileSize = data.get('fileSize') as string;
        const published = data.get('published') === 'true';
        const featured = data.get('featured') === 'true';

        const audioFile: File | null = data.get('audioFile') as unknown as File;
        
        if (!title || !audioFile) {
            console.log('Missing title or audio file.');
            return NextResponse.json({ message: "Title and Audio File are required" }, { status: 400 });
        }

        console.log('Uploading audio file to Cloudinary...');
        const audioUrl = await uploadToCloudinary(audioFile, 'audio');
        console.log('Audio file uploaded:', audioUrl);

        let coverImageUrl: string | undefined = undefined;
        const coverImageFile: File | null = data.get('coverImageFile') as unknown as File;
        if (coverImageFile) {
            console.log('Uploading cover image to Cloudinary...');
            coverImageUrl = await uploadToCloudinary(coverImageFile, 'images');
            console.log('Cover image uploaded:', coverImageUrl);
        }
        
        console.log('Creating music track in database...');
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
        console.log('Music track created:', newTrack.id);

        return NextResponse.json(newTrack, { status: 201 });

    } catch (error: any) {
        console.error("Error creating music track:", {
            message: error.message,
            stack: error.stack,
            name: error.name,
        });
        return NextResponse.json({ message: "Failed to create music track" }, { status: 500 });
    }
}