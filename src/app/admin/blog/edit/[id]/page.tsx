"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import BlogEditor from '@/components/BlogEditor';

// Define the BlogPost type matching the editor's expectations
interface BlogPost {
  id?: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  featured: boolean;
  status: "draft" | "published";
  publishedAt?: string;
  authorId: string;
  readTime: string;
  coverImageUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const response = await axios.get(`/api/blog/${id}`);
          // The tags are stored as a comma-separated string, so we split them into an array.
          const postData = {
            ...response.data,
            tags: response.data.tags ? response.data.tags.split(',') : [],
          };
          setPost(postData);
        } catch (error) {
          console.error('Failed to fetch blog post:', error);
          toast.error('Failed to load blog post.');
        }
      };
      fetchPost();
    }
  }, [id]);

  const handleSave = async (post: BlogPost) => {
    setIsSubmitting(true);
    try {
      const postData = {
        ...post,
        published: post.status === 'published',
        // Join the tags array back into a comma-separated string for the database.
        tags: post.tags.join(','),
        author: post.authorId,
        image: post.coverImageUrl,
      };

      await axios.put(`/api/blog/${id}`, postData);
      
      toast.success('Blog post updated successfully!');
      router.push('/admin/blog');
    } catch (error) {
      console.error('Failed to update blog post:', error);
      toast.error('Failed to update blog post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!post) {
    return <div>Loading...</div>; // Or a skeleton loader
  }

  return (
    <div className="p-6">
      <BlogEditor post={post} onSave={handleSave} />
    </div>
  );
}
