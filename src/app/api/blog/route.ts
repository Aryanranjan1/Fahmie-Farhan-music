import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const published = searchParams.get('published');

    const whereClause: any = {
      published: true, // Only return published posts by default
    };

    if (featured === 'true') {
      whereClause.featured = true;
    } else if (featured === 'false') {
      whereClause.featured = false;
    }

    if (published === 'false') { // Allow fetching unpublished if explicitly requested (e.g., for admin)
      whereClause.published = false;
    }
    
    const posts = await db.post.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, excerpt, category, tags, featured, published, authorId } = body;
    
    if (!title || !authorId) {
      return NextResponse.json({ error: 'Title and authorId are required' }, { status: 400 });
    }
    
    const post = await db.post.create({
      data: {
        title,
        content,
        excerpt,
        category,
        tags,
        featured: featured || false,
        published: published || false,
        authorId
      }
    });
    
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}