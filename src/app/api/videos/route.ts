import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';

export async function GET() {
    try {
        const videos = await prisma.video.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(videos);
    } catch (error) {
        console.error("Error fetching videos:", error);
        return NextResponse.json({ message: "Failed to fetch videos" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.formData();
        const title = data.get('title') as string;
        const videoId = data.get('videoId') as string; // YouTube ID
        const category = data.get('category') as string;
        const description = data.get('description') as string;
        const published = data.get('published') === 'true';
        const featured = data.get('featured') === 'true';
        

        if (!title) {
            return NextResponse.json({ message: "Title is required" }, { status: 400 });
        }
        
        if (!videoId) {
            return NextResponse.json({ message: "YouTube Video ID is required" }, { status: 400 });
        }

        

        const newVideo = await prisma.video.create({
            data: {
                title,
                videoId: videoId || null,
                category,
                description,
                published,
                featured,
            }
        });

        return NextResponse.json(newVideo, { status: 201 });

    } catch (error) {
        console.error("Error creating video:", error);
        return NextResponse.json({ message: "Failed to create video" }, { status: 500 });
    }
}