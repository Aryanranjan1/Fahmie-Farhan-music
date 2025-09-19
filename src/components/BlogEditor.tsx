"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  X, 
  Save,
  Upload
} from "lucide-react";
import TiptapEditor from "./TiptapEditor";

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

export default function BlogEditor({ post, onSave }: { post?: BlogPost; onSave: (post: BlogPost) => void }) {
  const [blogPost, setBlogPost] = useState<BlogPost>(post || {
    title: "",
    content: "",
    excerpt: "",
    category: "",
    tags: [],
    featured: false,
    status: "draft",
    authorId: "Fahmie Farhan",
    readTime: "",
    coverImageUrl: "",
    seoTitle: "",
    seoDescription: ""
  });

  const [newTag, setNewTag] = useState("");

  const categories = [
    "Composition",
    "Cultural Heritage",
    "Behind the Scenes",
    "Industry Insights",
    "Business",
    "Collaboration",
    "Tutorial",
    "News"
  ];

  const handleInputChange = (field: keyof BlogPost, value: string | boolean) => {
    setBlogPost(prev => ({ ...prev, [field]: value }));
  };

  const handleContentChange = (content: string) => {
    setBlogPost(prev => ({ ...prev, content }));
  };

  const addTag = () => {
    if (newTag.trim() && !blogPost.tags.includes(newTag.trim())) {
      setBlogPost(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setBlogPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const calculateReadTime = (content: string) => {
    if (typeof window === 'undefined') return '';
    const div = document.createElement('div');
    div.innerHTML = content;
    const text = div.textContent || div.innerText || '';
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).filter(Boolean).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const handleSave = () => {
    const finalPost = {
      ...blogPost,
      readTime: calculateReadTime(blogPost.content),
      publishedAt: blogPost.status === "published" ? new Date().toISOString() : blogPost.publishedAt
    };
    onSave(finalPost);
  };

  const generateExcerpt = () => {
    if (blogPost.content) {
      if (typeof window === 'undefined') return;
      const div = document.createElement('div');
      div.innerHTML = blogPost.content;
      const plainText = (div.textContent || div.innerText || '').trim();
      
      const excerpt = plainText.length > 150 
        ? plainText.substring(0, 150) + "..." 
        : plainText;
      
      handleInputChange("excerpt", excerpt);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-charcoal-dark border-fantasy-gold/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-fantasy-gold">
              {post ? "Edit Blog Post" : "Create New Blog Post"}
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                onClick={handleSave}
                className="bg-fantasy-gold text-deep-black hover:bg-fantasy-gold/90"
              >
                <Save className="w-4 h-4 mr-2" />
                Save {blogPost.status === "published" ? "Changes" : "as Draft"}
              </Button>
              {blogPost.status === "draft" && (
                <Button
                  onClick={() => {
                    handleInputChange("status", "published");
                    setTimeout(handleSave, 100);
                  }}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  Publish
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <Card className="bg-charcoal-dark border-fantasy-gold/20">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-text-white">Title</Label>
                  <Input
                    id="title"
                    value={blogPost.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="bg-deep-black border-fantasy-gold/20 text-text-white placeholder:text-text-muted"
                    placeholder="Enter post title..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="excerpt" className="text-text-white">Excerpt</Label>
                  <div className="flex space-x-2">
                    <Textarea
                      id="excerpt"
                      value={blogPost.excerpt}
                      onChange={(e) => handleInputChange("excerpt", e.target.value)}
                      className="bg-deep-black border-fantasy-gold/20 text-text-white placeholder:text-text-muted flex-1"
                      placeholder="Brief description of the post..."
                      rows={3}
                    />
                    <Button
                      variant="outline"
                      onClick={generateExcerpt}
                      className="border-fantasy-gold/20 text-fantasy-gold whitespace-nowrap"
                    >
                      Auto-generate
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card className="bg-charcoal-dark border-fantasy-gold/20">
            <CardHeader>
              <CardTitle className="text-fantasy-gold">Content</CardTitle>
            </CardHeader>
            <CardContent>
              <TiptapEditor
                content={blogPost.content}
                onChange={handleContentChange}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category */}
          <Card className="bg-charcoal-dark border-fantasy-gold/20">
            <CardHeader>
              <CardTitle className="text-fantasy-gold">Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={blogPost.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger className="bg-deep-black border-fantasy-gold/20 text-text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="bg-charcoal-dark border-fantasy-gold/20">
            <CardHeader>
              <CardTitle className="text-fantasy-gold">Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addTag()}
                    className="bg-deep-black border-fantasy-gold/20 text-text-white placeholder:text-text-muted"
                    placeholder="Add tag..."
                  />
                  <Button
                    onClick={addTag}
                    variant="outline"
                    className="border-fantasy-gold/20 text-fantasy-gold"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {blogPost.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-fantasy-gold/20 text-fantasy-gold hover:bg-fantasy-gold/30 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      {tag}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cover Image URL */}
          <Card className="bg-charcoal-dark border-fantasy-gold/20">
            <CardHeader>
              <CardTitle className="text-fantasy-gold">Cover Image URL</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Input
                  value={blogPost.coverImageUrl || ""}
                  onChange={(e) => handleInputChange("coverImageUrl", e.target.value)}
                  className="bg-deep-black border-fantasy-gold/20 text-text-white placeholder:text-text-muted"
                  placeholder="Image URL"
                />
              </div>
            </CardContent>
          </Card>

          {/* Post Settings */}
          <Card className="bg-charcoal-dark border-fantasy-gold/20">
            <CardHeader>
              <CardTitle className="text-fantasy-gold">Post Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-text-white">Featured Post</Label>
                <input
                  type="checkbox"
                  checked={blogPost.featured}
                  onChange={(e) => handleInputChange("featured", e.target.checked)}
                  className="rounded border-fantasy-gold/20 bg-deep-black text-fantasy-gold"
                />
              </div>
              
              <div>
                <Label className="text-text-white">Status</Label>
                <Select value={blogPost.status} onValueChange={(value) => handleInputChange("status", value as "draft" | "published")}>
                  <SelectTrigger className="bg-deep-black border-fantasy-gold/20 text-text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-text-white">Author</Label>
                <Input
                  value={blogPost.authorId}
                  onChange={(e) => handleInputChange("authorId", e.target.value)}
                  className="bg-deep-black border-fantasy-gold/20 text-text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card className="bg-charcoal-dark border-fantasy-gold/20">
            <CardHeader>
              <CardTitle className="text-fantasy-gold">SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-text-white">SEO Title</Label>
                <Input
                  value={blogPost.seoTitle || ""}
                  onChange={(e) => handleInputChange("seoTitle", e.target.value)}
                  className="bg-deep-black border-fantasy-gold/20 text-text-white placeholder:text-text-muted"
                  placeholder="Custom SEO title (optional)"
                />
              </div>
              
              <div>
                <Label className="text-text-white">SEO Description</Label>
                <Textarea
                  value={blogPost.seoDescription || ""}
                  onChange={(e) => handleInputChange("seoDescription", e.target.value)}
                  className="bg-deep-black border-fantasy-gold/20 text-text-white placeholder:text-text-muted"
                  placeholder="Meta description for search engines"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}