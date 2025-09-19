import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET a single post
export async function GET(request: Request) {
  try {
    const id = request.url.split("/").pop();
    const post = await db.post.findUnique({
      where: { id: id },
      select: { // Explicitly select all fields
        id: true,
        title: true,
        content: true,
        excerpt: true,
        category: true,
        tags: true,
        featured: true,
        published: true,
        views: true,
        authorId: true,
        coverImageUrl: true,
        createdAt: true,
        updatedAt: true,
        seoTitle: true, 
        seoDescription: true, 
      }
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

// UPDATE a post
export async function PUT(request: Request) {
  try {
    const id = request.url.split("/").pop();
    const body = await request.json();
    const { title, content, excerpt, category, tags, featured, published, image, author, seoTitle, seoDescription } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const post = await db.post.update({
      where: { id: id },
      data: {
        title,
        content,
        excerpt,
        category,
        tags,
        featured: featured || false,
        published: published || false,
        coverImageUrl: image,
        authorId: author, 
        seoTitle: seoTitle,
        seoDescription: seoDescription,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

// DELETE a post
export async function DELETE(request: Request) {
  try {
    const id = request.url.split("/").pop();
    await db.post.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}