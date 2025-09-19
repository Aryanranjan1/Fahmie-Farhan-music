"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, User, Search, Filter, ExternalLink, Heart, MessageCircle } from "lucide-react";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  category: string;
  tags: string;
  featured: boolean;
  published: boolean;
  views: number;
  coverImageUrl?: string;
}

const categories = ["All", "Composition", "Cultural Heritage", "Behind the Scenes", "Industry Insights", "Business", "Collaboration"];

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch('/api/blog');
        if (response.ok) {
          const data = await response.json();
          // Filter only published posts
          const publishedPosts = data.filter((post: BlogPost) => post.published);
          setBlogPosts(publishedPosts);
        } else {
          console.error('Failed to fetch blog posts');
          setBlogPosts([]);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setBlogPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);


  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "popular") {
      return b.views - a.views;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // recent (by date)
  });

  const featuredPosts = blogPosts.filter(post => post.featured);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-black text-text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-black text-text-white">
      {/* Global Animated Background */}
      <div className="particles-container"></div>
      
      {/* Header */}
      <motion.section 
        className="py-20 px-6 bg-gradient-to-b from-charcoal-dark to-deep-black relative overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="hero-bg absolute inset-0"></div>
        <div className="floating-orbs absolute inset-0"></div>
        <div className="floating-notes absolute inset-0"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div variants={fadeInUp}>
            <div className="mx-auto mb-6"></div>
          </motion.div>
          <motion.h1 
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-fantasy-gold via-yellow-400 to-fantasy-gold bg-clip-text text-transparent"
            variants={fadeInUp}
          >
            Blog
          </motion.h1>
          <motion.p 
            className="text-xl text-text-muted max-w-3xl mx-auto"
            variants={fadeInUp}
          >
            Insights, tutorials, and stories from the world of orchestral composition and cultural music innovation. 
            Join me on a journey through the art and craft of creating meaningful music.
          </motion.p>
        </div>
      </motion.section>



      {/* Featured Posts */}
      <motion.section 
        className="py-16 px-6 bg-deep-black"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-12" variants={fadeInUp}>
            <h2 className="text-3xl font-bold mb-4 text-fantasy-gold">Featured Articles</h2>
            <motion.p className="text-lg text-text-muted" variants={fadeInUp}>
              Hand-picked posts that showcase the best of musical composition and cultural innovation
            </motion.p>
          </motion.div>

          <motion.div className="grid lg:grid-cols-2 gap-8 mb-12" variants={staggerContainer}>
            {featuredPosts.map((post) => (
              <motion.div key={post.id} variants={fadeInUp}>
                <Card className="bg-charcoal-dark border-fantasy-gold/20 overflow-hidden hover:border-fantasy-gold/40 transition-all hover:transform hover:scale-105">
                  <div className="aspect-video bg-gradient-to-br from-fantasy-gold/10 to-purple-500/10 relative overflow-hidden">
                      <img
                        src={post.coverImageUrl || '/placeholder-cover.png'}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-deep-black/80 to-transparent"></div>
                      <Badge className="absolute top-4 left-4 bg-fantasy-gold text-deep-black">
                        Featured
                      </Badge>
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="bg-fantasy-gold/20 text-fantasy-gold">
                          {post.category}
                        </Badge>
                        <div className="flex items-center text-text-muted text-sm">
                          <Clock className="w-4 h-4 mr-1" />
                          {Math.ceil(post.content.length / 200)} min read
                        </div>
                      </div>
                      <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                      <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-text-muted text-sm">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {post.author || 'Fahmie Farhan'}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 text-text-muted text-sm">
                          <div className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {post.views}
                          </div>
                        </div>
                      </div>
                      <Button className="w-full mt-4 btn-gold">
                        <Link href={`/blog/${post.id}`}>
                          Read Article
                        </Link>
                      </Button>
                    </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* All Posts */}
      <motion.section 
        className="py-16 px-6 bg-charcoal-dark"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto">
          {/* Filters and Search */}
          <motion.div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-12" variants={fadeInUp}>
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-deep-black border-fantasy-gold/20 text-text-white placeholder:text-text-muted"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category 
                    ? "bg-fantasy-gold text-deep-black hover:bg-fantasy-gold/90" 
                    : "border-fantasy-gold/20 text-fantasy-gold hover:bg-fantasy-gold hover:text-deep-black"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-text-muted">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32 bg-deep-black border-fantasy-gold/20 text-text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Posts Grid */}
          {sortedPosts.length === 0 ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold mb-2">No articles found</h3>
              <p className="text-text-muted">Try adjusting your search or filter criteria</p>
            </motion.div>
          ) : (
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
            >
              {sortedPosts.map((post) => (
                <motion.div key={post.id} variants={fadeInUp}>
                  <Card className="bg-deep-black border-fantasy-gold/20 hover:border-fantasy-gold/40 transition-all hover:transform hover:scale-105">
                    <CardHeader className="pb-2">
                      <div className="aspect-video bg-gradient-to-br from-fantasy-gold/10 to-purple-500/10 rounded-lg mb-4 relative overflow-hidden">
                        <img
                          src={post.coverImageUrl || '/placeholder-cover.png'}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-deep-black/60 to-transparent"></div>
                        {post.featured && (
                          <Badge className="absolute top-2 right-2 bg-fantasy-gold text-deep-black">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="bg-fantasy-gold/20 text-fantasy-gold text-xs">
                          {post.category}
                        </Badge>
                        <div className="flex items-center text-text-muted text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {Math.ceil(post.content.length / 200)} min read
                        </div>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                      <CardDescription className="text-sm line-clamp-3">{post.excerpt}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.split(',').map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-fantasy-gold/30 text-fantasy-gold">
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm text-text-muted mb-4">
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {post.author || 'Fahmie Farhan'}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Heart className="w-3 h-3 mr-1" />
                          {post.views}
                        </div>
                      </div>
                      <Button className="w-full btn-gold">
                        <Link href={`/blog/${post.id}`}>
                          Read Article
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>
    </div>
  );
}