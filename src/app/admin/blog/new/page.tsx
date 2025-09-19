"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import BlogEditor from '@/components/BlogEditor';

// Define the BlogPost type matching the editor's expectations
interface BlogPost {
  id?: number;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  featured: boolean;
  status: "draft" | "published";
  publishedAt?: string;
  author: string;
  readTime: string;
  image?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export default function NewBlogPostPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (post: BlogPost) => {
    setIsSubmitting(true);
    try {
      // Hardcoded authorId - replace with actual user ID from session
      const authorId = "clxnef56p0000u26n54f817n7"; 

      const postData = {
        ...post,
        authorId,
        published: post.status === 'published',
        // The 'tags' field in the prisma schema is a String, not a String array.
        // So we'll join the array into a comma-separated string.
        tags: post.tags.join(','),
      };

      await axios.post('/api/blog', postData);
      
      toast.success('Blog post created successfully!');
      router.push('/admin/blog');
    } catch (error) {
      console.error('Failed to create blog post:', error);
      toast.error('Failed to create blog post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <BlogEditor onSave={handleSave} />
    </div>
  );
}
