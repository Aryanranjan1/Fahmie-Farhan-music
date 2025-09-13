import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const name = searchParams.get('name');
    const email = searchParams.get('email');

    let whereClause: any = {};
    
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt.gte = new Date(startDate);
      if (endDate) whereClause.createdAt.lte = new Date(endDate);
    }
    
    if (name) {
      whereClause.name = {
        contains: name,
        mode: 'insensitive'
      };
    }
    
    if (email) {
      whereClause.email = {
        contains: email,
        mode: 'insensitive'
      };
    }

    const submissions = await db.contactSubmission.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Convert to CSV format
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Subject', 'Message', 'Date'];
    const csvRows = [
      headers.join(','),
      ...submissions.map(submission => [
        submission.id,
        `"${submission.name}"`,
        `"${submission.email}"`,
        `"${submission.phone || ''}"`,
        `"${submission.company || ''}"`,
        `"${submission.subject || ''}"`,
        `"${submission.message.replace(/"/g, '""')}"`,
        submission.createdAt
      ].join(','))
    ];

    const csvContent = csvRows.join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="contact-submissions-${new Date().toISOString().split('T')[0]}.csv"`
      }
    });
  } catch (error) {
    console.error('Error exporting contact submissions:', error);
    return NextResponse.json({ error: 'Failed to export contact submissions' }, { status: 500 });
  }
}