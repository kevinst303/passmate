
import { blogPosts } from "@/data/blogPosts";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Clock, Calendar, Tag, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Newsletter } from "@/components/Newsletter";

interface Props {
    params: Promise<{
        slug: string;
        locale: string;
    }>;
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const post = blogPosts.find((p) => p.slug === slug);

    if (!post) {
        return {
            title: "Post Not Found",
        };
    }

    return {
        title: `${post.title} | PassMate Blog`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.date,
            authors: [post.author],
        }
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = blogPosts.find((p) => p.slug === slug);

    if (!post) {
        return notFound();
    }

    const relatedPosts = blogPosts
        .filter(p => p.category === post.category && p.slug !== slug)
        .slice(0, 3);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        image: post.image,
        author: {
            '@type': 'Person',
            name: post.author,
        },
        datePublished: new Date(post.date).toISOString(),
        publisher: {
            '@type': 'Organization',
            name: 'PassMate',
            logo: {
                '@type': 'ImageObject',
                url: 'https://passmate.com.au/logo.png', // Placeholder
            },
        },
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />

            <main className="pt-32 px-4">
                <article className="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-sm border border-border/50 overflow-hidden">

                    {/* Header */}
                    <header className="p-8 lg:p-12 pb-0">
                        <Link href="/blog" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8 group font-medium">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Blog
                        </Link>

                        <div className="flex flex-wrap gap-4 items-center text-sm font-bold text-muted-foreground mb-6">
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-2">
                                <Tag className="w-3 h-3" />
                                {post.category}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" /> {post.date}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" /> {post.readTime}
                            </span>
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-display font-black text-foreground mb-6 leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex items-center gap-4 py-6 border-t border-border/50 border-b">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                                🐨
                            </div>
                            <div>
                                <p className="font-bold text-foreground">{post.author}</p>
                                <p className="text-xs text-muted-foreground">Australian Citizenship Expert</p>
                            </div>
                        </div>
                    </header>

                    {/* Content */}
                    <div className="p-8 lg:p-12 lg:pt-8 prose prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-primary prose-img:rounded-2xl">
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>

                    {/* Social Share */}
                    <div className="px-8 lg:px-12 pb-12">
                        <div className="pt-8 border-t border-border/50">
                            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Share this article</h4>
                            <div className="flex gap-4">
                                <button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all">
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                                </button>
                                <button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all">
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                </button>
                                <button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all">
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>

                </article>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <div className="max-w-4xl mx-auto mt-20">
                        <h3 className="text-2xl font-display font-black mb-8">Related <span className="text-primary italic">Articles</span></h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedPosts.map(p => (
                                <Link key={p.slug} href={`/blog/${p.slug}`} className="group bg-white rounded-3xl border border-border/50 p-6 hover:shadow-lg transition-all flex flex-col h-full">
                                    <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">{p.category}</div>
                                    <h4 className="font-bold mb-4 line-clamp-2 group-hover:text-primary transition-colors flex-grow">{p.title}</h4>
                                    <div className="text-xs font-bold text-muted-foreground pt-4 border-t border-border/50 flex justify-between items-center">
                                        <span>{p.date}</span>
                                        <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Next/Prev Posts */}
                <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 pb-20 border-b border-border/50">
                    {(() => {
                        const currentIndex = blogPosts.findIndex(p => p.slug === slug);
                        const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
                        const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

                        return (
                            <>
                                {prevPost ? (
                                    <Link href={`/blog/${prevPost.slug}`} className="group bg-white p-6 rounded-[2rem] border border-border/50 hover:border-primary/50 transition-all flex flex-col justify-center">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Previous Post</p>
                                        <h4 className="font-bold group-hover:text-primary transition-colors line-clamp-1">{prevPost.title}</h4>
                                    </Link>
                                ) : <div />}
                                {nextPost ? (
                                    <Link href={`/blog/${nextPost.slug}`} className="group bg-white p-6 rounded-[2rem] border border-border/50 hover:border-primary/50 transition-all flex flex-col justify-center text-right">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Next Post</p>
                                        <h4 className="font-bold group-hover:text-primary transition-colors line-clamp-1">{nextPost.title}</h4>
                                    </Link>
                                ) : <div />}
                            </>
                        );
                    })()}
                </div>
            </main>

            <Newsletter />

            <footer className="mt-20 py-12 border-t border-border bg-white">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🐨</span>
                        <span className="text-xl font-display font-bold text-primary">PassMate</span>
                    </div>
                    <p className="text-muted-foreground text-sm font-bold text-center md:text-left">
                        © {new Date().getFullYear()} PassMate. Built with ❤️ in Australia.
                    </p>
                    <div className="flex gap-6 text-sm font-medium text-muted-foreground">
                        <Link href="/about" className="hover:text-foreground">About</Link>
                        <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
                        <Link href="/terms" className="hover:text-foreground">Terms</Link>
                        <Link href="/contact" className="hover:text-foreground">Contact</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
