import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';

// GET all social links
export async function GET() {
    try {
        const socialLinks = await prisma.socialLink.findMany({
            orderBy: { createdAt: 'asc' },
        });
        return NextResponse.json(socialLinks);
    } catch (error) {
        console.error('Error fetching social links:', error);
        return NextResponse.json({ error: 'Failed to fetch social links' }, { status: 500 });
    }
}

// POST a new social link
export async function POST(req: Request) {
    try {
        const { name, url, icon } = await req.json();

        if (!name || !url) {
            return NextResponse.json({ error: 'Name and URL are required' }, { status: 400 });
        }

        const newSocialLink = await prisma.socialLink.create({
            data: {
                name,
                url,
                icon,
            },
        });

        return NextResponse.json(newSocialLink, { status: 201 });
    } catch (error) {
        console.error('Error creating social link:', error);
        return NextResponse.json({ error: 'Failed to create social link' }, { status: 500 });
    }
}