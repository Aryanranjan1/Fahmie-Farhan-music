import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const newSubmission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    });

    return NextResponse.json(newSubmission, { status: 201 });

  } catch (error) {
    console.error("Error creating contact submission:", error);
    return NextResponse.json({ message: "Failed to create contact submission" }, { status: 500 });
  }
}

// Optional: GET method to view submissions if needed in the future
export async function GET() {
    try {
        const submissions = await prisma.contactSubmission.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json(submissions);
    } catch (error) {
        console.error("Error fetching submissions:", error);
        return NextResponse.json({ message: "Failed to fetch submissions" }, { status: 500 });
    }
}