import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';

// GET all blog posts
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const published = searchParams.get('published');

        let where = {};
        if (published === 'true') {
            where = { published: true };
        } else if (published === 'false') {
            where = { published: false };
        }

        const posts = await prisma.post.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
    }
}

// POST a new blog post
export async function POST(req: Request) {
    try {
        const { title, content, excerpt, category, tags, featured, published, authorId, coverImageUrl } = await req.json(); // Add coverImageUrl

        if (!title || !authorId) {
            return NextResponse.json({ error: 'Title and Author ID are required' }, { status: 400 });
        }

        const newPost = await prisma.post.create({
            data: {
                title,
                content,
                excerpt,
                category,
                tags,
                featured: featured || false,
                published: published || false,
                authorId,
                coverImageUrl, // Add coverImageUrl here
            },
        });

        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        console.error('Error creating blog post:', error);
        return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
    }
}
