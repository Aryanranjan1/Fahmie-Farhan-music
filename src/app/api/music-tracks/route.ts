import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import axios from 'axios'; // Import axios for making HTTP requests

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
        const fileSize = data.get('fileSize') as string; // This might become irrelevant if not uploading files
        const published = data.get('published') === 'true';
        const featured = data.get('featured') === 'true';

        const audioUrlInput = data.get('audioUrl') as string; // Expecting SoundCloud URL
        
        if (!title || !audioUrlInput) {
            return NextResponse.json({ message: "Title and Audio URL are required" }, { status: 400 });
        }

        let coverImageUrl: string | undefined = undefined;

        // Fetch artwork from SoundCloud OEmbed API
        try {
            const oembedResponse = await axios.get(`https://soundcloud.com/oembed?url=${audioUrlInput}&format=json`);
            if (oembedResponse.data && oembedResponse.data.thumbnail_url) {
                coverImageUrl = oembedResponse.data.thumbnail_url;
            }
        } catch (oembedError) {
            console.warn("Could not fetch SoundCloud artwork:", oembedError);
            // Optionally, set a default cover image or handle this error differently
        }
        
        const newTrack = await prisma.musicTrack.create({
            data: {
                title,
                category,
                description,
                fileSize, // Keep for now, might be removed later if truly irrelevant
                published,
                featured,
                audioUrl: audioUrlInput,
                coverImageUrl,
            }
        });

        return NextResponse.json(newTrack, { status: 201 });

    } catch (error) {
        console.error("Error creating music track:", error);
        return NextResponse.json({ message: "Failed to create music track" }, { status: 500 });
    }
}