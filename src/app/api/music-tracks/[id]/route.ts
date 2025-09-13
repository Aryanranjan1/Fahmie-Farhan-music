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

// GET a single music track
export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const track = await prisma.musicTrack.findUnique({
            where: { id: params.id },
        });
        if (!track) {
            return NextResponse.json({ message: "Music track not found" }, { status: 404 });
        }
        return NextResponse.json(track);
    } catch (error) {
        console.error("Error fetching music track:", error);
        return NextResponse.json({ message: "Failed to fetch music track" }, { status: 500 });
    }
}

// DELETE a music track
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        // Note: Deleting from Cloudinary is not implemented here.
        // You might want to add that logic if needed.
        await prisma.musicTrack.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: "Music track deleted successfully" });
    } catch (error) {
        console.error("Error deleting music track:", error);
        return NextResponse.json({ message: "Failed to delete music track" }, { status: 500 });
    }
}

// UPDATE a music track
export async function PUT(request: Request, { params }: { params: { id: string } }) {
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

        let audioUrl: string | undefined;
        if (audioFile) {
            audioUrl = await uploadToCloudinary(audioFile, 'audio');
        }

        let coverImageUrl: string | undefined;
        if (coverImageFile) {
            coverImageUrl = await uploadToCloudinary(coverImageFile, 'images');
        }

        const updatedTrack = await prisma.musicTrack.update({
            where: { id: params.id },
            data: {
                title,
                category,
                description,
                fileSize,
                published,
                featured,
                audioUrl,
                coverImageUrl,
            },
        });

        return NextResponse.json(updatedTrack);

    } catch (error) {
        console.error("Error updating music track:", error);
        return NextResponse.json({ message: "Failed to update music track" }, { status: 500 });
    }
}
