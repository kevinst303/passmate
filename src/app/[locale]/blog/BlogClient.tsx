"use client";

import { motion } from "framer-motion";
import { blogPosts, BlogPost } from "@/data/blogPosts";
import { Calendar, Clock, ChevronRight, Tag, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";

interface BlogClientProps {
    posts: BlogPost[];
}

export default function BlogClient({ posts }: BlogClientProps) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const categories = useMemo(() => {
        const cats = new Set(posts.map(post => post.category));
        return Array.from(cats);
    }, [posts]);

    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            const matchesCategory = !selectedCategory || post.category === selectedCategory;
            const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery, posts]);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <>
            {/* Search and Categories */}
            <section className="pb-12 px-4">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto relative group">
                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search articles, guides, and insights..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-white rounded-[2rem] border border-border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg"
                        />
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Button
                            variant={selectedCategory === null ? "primary" : "ghost"}
                            size="sm"
                            onClick={() => setSelectedCategory(null)}
                            className={cn(
                                "rounded-full px-6 transition-all",
                                selectedCategory !== null && "bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                            )}
                        >
                            All Posts
                        </Button>
                        {categories.map((cat) => (
                            <Button
                                key={cat}
                                variant={selectedCategory === cat ? "primary" : "ghost"}
                                size="sm"
                                onClick={() => setSelectedCategory(cat)}
                                className={cn(
                                    "rounded-full px-6 transition-all",
                                    selectedCategory !== cat && "bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                                )}
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="pb-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        key={`${selectedCategory}-${searchQuery}`}
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {filteredPosts.map((post) => (
                            <motion.div
                                key={post.slug}
                                variants={item}
                                className="group relative bg-white rounded-[2rem] border border-border/50 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                            >
                                {/* Image Placeholder */}
                                <div className="h-48 bg-muted relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                                    <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors" />
                                    <div className="absolute bottom-4 left-4 z-20">
                                        <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                            <Tag className="w-3 h-3" />
                                            {post.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground mb-4">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {post.date}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {post.readTime}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h3>

                                    <p className="text-muted-foreground mb-6 line-clamp-3 flex-grow">
                                        {post.excerpt}
                                    </p>

                                    <div className="mt-auto pt-6 border-t border-border/50 flex items-center justify-between">
                                        <div className="text-sm font-bold text-foreground">
                                            By <span className="text-primary">{post.author}</span>
                                        </div>
                                        <Link href={`/blog/${post.slug}`}>
                                            <Button variant="ghost" size="sm" className="rounded-full hover:bg-primary/10 hover:text-primary p-0 h-auto w-auto px-1">
                                                Read More <ChevronRight className="w-4 h-4 ml-1" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {filteredPosts.length === 0 && (
                        <div className="text-center py-20">
                            <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                            <p className="text-muted-foreground text-lg">No posts found matching your criteria.</p>
                            <Button
                                variant="ghost"
                                onClick={() => { setSearchQuery(""); setSelectedCategory(null); }}
                                className="mt-4 text-primary"
                            >
                                Clear all filters
                            </Button>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
