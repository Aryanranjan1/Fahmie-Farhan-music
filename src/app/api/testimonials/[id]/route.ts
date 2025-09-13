import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';

// GET a single testimonial by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const testimonial = await prisma.testimonial.findUnique({
            where: { id },
        });

        if (!testimonial) {
            return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
        }
        return NextResponse.json(testimonial);
    } catch (error) {
        console.error('Error fetching testimonial:', error);
        return NextResponse.json({ error: 'Failed to fetch testimonial' }, { status: 500 });
    }
}

// PUT (update) a testimonial by ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        let body;
        try {
            body = await req.json();
        } catch (jsonError) {
            console.error('JSON parsing error:', jsonError);
            return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
        }
        const { name, role, content, avatar, published, featured } = body;

        const updatedTestimonial = await prisma.testimonial.update({
            where: { id },
            data: {
                name: name || undefined,
                role: role || undefined,
                content: content || undefined,
                avatar: avatar || undefined,
                published: published !== undefined ? published : undefined,
                featured: featured !== undefined ? featured : undefined,
            },
        });

        return NextResponse.json(updatedTestimonial);
    } catch (error) {
        console.error('Error updating testimonial:', error);
        return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
    }
}

// DELETE a testimonial by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        await prisma.testimonial.delete({
            where: { id },
        });
        return NextResponse.json({ message: 'Testimonial deleted successfully' });
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
    }
}
