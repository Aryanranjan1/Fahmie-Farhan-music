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
        const data = await req.formData();
        const name = data.get('name') as string;
        const role = data.get('role') as string;
        const content = data.get('content') as string;
        const published = data.get('published') === 'true';
        const featured = data.get('featured') === 'true';
        const avatarFile: File | null = data.get('avatar') as unknown as File;

        let avatarUrl: string | undefined = undefined;
        if (avatarFile) {
            avatarUrl = await uploadToCloudinary(avatarFile, 'testimonials');
        }

        const updatedTestimonial = await prisma.testimonial.update({
            where: { id },
            data: {
                name: name || undefined,
                role: role || undefined,
                content: content || undefined,
                avatar: avatarUrl,
                published: published,
                featured: featured,
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