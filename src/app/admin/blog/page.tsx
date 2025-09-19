'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface BlogPost {
  id: string;
  title: string;
  category?: string;
  published: boolean;
  featured: boolean;
}

export default function AdminBlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const response = await axios.get('/api/blog?published=all'); // Fetch all posts
      setBlogPosts(response.data);
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
      toast.error("Failed to load blog posts.");
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await axios.delete(`/api/blog/${postId}`);
      toast.success('Post deleted successfully');
      fetchBlogPosts(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete post:", error);
      toast.error("Failed to delete post.");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Blog Posts</h1>
        <Button asChild>
          <Link href="/admin/blog/new">Add New Blog Post</Link>
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg">
          <thead>
            <tr className="text-left">
              <th className="py-3 px-4 border-b border-gray-700">Title</th>
              <th className="py-3 px-4 border-b border-gray-700">Category</th>
              <th className="py-3 px-4 border-b border-gray-700">Published</th>
              <th className="py-3 px-4 border-b border-gray-700">Featured</th>
              <th className="py-3 px-4 border-b border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogPosts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-700/50">
                <td className="py-3 px-4 border-b border-gray-700">{post.title}</td>
                <td className="py-3 px-4 border-b border-gray-700">{post.category || 'N/A'}</td>
                <td className="py-3 px-4 border-b border-gray-700">{post.published ? 'Yes' : 'No'}</td>
                <td className="py-3 px-4 border-b border-gray-700">{post.featured ? 'Yes' : 'No'}</td>
                <td className="py-3 px-4 border-b border-gray-700">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/blog/edit/${post.id}`}>Edit</Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">Delete</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the blog post.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(post.id)}>
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
