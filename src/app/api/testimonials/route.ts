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
        const data = await req.formData();
        const name = data.get('name') as string;
        const role = data.get('role') as string;
        const content = data.get('content') as string;
        const published = data.get('published') === 'true';
        const featured = data.get('featured') === 'true';
        const avatarFile: File | null = data.get('avatar') as unknown as File;

        if (!name || !content) {
            return NextResponse.json({ error: 'Name and content are required' }, { status: 400 });
        }

        let avatarUrl: string | undefined = undefined;
        if (avatarFile) {
            avatarUrl = await uploadToCloudinary(avatarFile, 'testimonials');
        }

        const newTestimonial = await prisma.testimonial.create({
            data: {
                name,
                role,
                content,
                avatar: avatarUrl,
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