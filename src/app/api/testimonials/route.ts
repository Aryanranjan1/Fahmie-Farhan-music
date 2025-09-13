import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';

// GET all testimonials
export async function GET() {
    try {
        const testimonials = await prisma.testimonial.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(testimonials);
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
    }
}

// POST a new testimonial
export async function POST(req: Request) {
    try {
        let body;
        try {
            body = await req.json();
        } catch (jsonError) {
            console.error('JSON parsing error:', jsonError);
            return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
        }
        const { name, role, content, avatar, published, featured } = body;

        if (!name || !content) {
            return NextResponse.json({ error: 'Name and content are required' }, { status: 400 });
        }

        const newTestimonial = await prisma.testimonial.create({
            data: {
                name,
                role,
                content,
                avatar,
                published: published || false,
                featured: featured || false,
            },
        });

        return NextResponse.json(newTestimonial, { status: 201 });
    } catch (error) {
        console.error('Error creating testimonial:', error);
        return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
    }
}