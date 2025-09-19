import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

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
        return NextResponse.json({ error: "Failed to fetch music tracks" }, { status: 500 });
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
            return NextResponse.json({ error: "Title and Audio File are required" }, { status: 400 });
        }

        try {
            // Ensure upload directories exist
            const audioUploadDir = path.join(process.cwd(), 'public/uploads/audio');
            const imageUploadDir = path.join(process.cwd(), 'public/uploads/images');
            await mkdir(audioUploadDir, { recursive: true });
            await mkdir(imageUploadDir, { recursive: true });

            // Handle Audio File Upload
            const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
            const audioFilename = `${Date.now()}-${audioFile.name.replace(/\s/g, '_')}`;
            const audioUploadPath = path.join(audioUploadDir, audioFilename);
            await writeFile(audioUploadPath, audioBuffer);
            const audioUrl = `/uploads/audio/${audioFilename}`;

            // Handle Cover Image Upload (Optional)
            let coverImageUrl: string | undefined = undefined;
            if (coverImageFile) {
                const imageBuffer = Buffer.from(await coverImageFile.arrayBuffer());
                const imageFilename = `${Date.now()}-${coverImageFile.name.replace(/\s/g, '_')}`;
                const imageUploadPath = path.join(imageUploadDir, imageFilename);
                await writeFile(imageUploadPath, imageBuffer);
                coverImageUrl = `/uploads/images/${imageFilename}`;
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
        } catch (fileError) {
            console.error("Error handling file upload:", fileError);
            return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
        }
    } catch (error) {
        console.error("Error creating music track:", error);
        return NextResponse.json({ error: "Failed to create music track" }, { status: 500 });
    }
}