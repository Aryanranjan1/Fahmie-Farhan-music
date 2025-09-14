import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';

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
        const trackToDelete = await prisma.musicTrack.findUnique({
            where: { id: params.id },
        });

        if (!trackToDelete) {
            return NextResponse.json({ message: "Music track not found" }, { status: 404 });
        }

        // No need to delete files from local system as they are now external (SoundCloud)

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
        const existingTrack = await prisma.musicTrack.findUnique({
            where: { id: params.id },
        });

        if (!existingTrack) {
            return NextResponse.json({ message: "Music track not found" }, { status: 404 });
        }

        const data = await request.formData();
        const title = data.get('title') as string;
        const category = data.get('category') as string;
        const description = data.get('description') as string;
        const fileSize = data.get('fileSize') as string; // This might become irrelevant
        const published = data.get('published') === 'true';
        const featured = data.get('featured') === 'true';

        const audioUrlInput = data.get('audioUrl') as string; // Expecting SoundCloud URL
        let coverImageUrlInput = data.get('coverImageUrl') as string; // Optional manual cover image URL

        let audioUrl = existingTrack.audioUrl;
        let coverImageUrl = existingTrack.coverImageUrl;

        
        // If a manual coverImageUrl is provided, use it
        if (coverImageUrlInput) {
            coverImageUrl = coverImageUrlInput;
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