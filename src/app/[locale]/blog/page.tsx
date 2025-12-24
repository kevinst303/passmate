import { Navbar } from "@/components/Navbar";
import { blogPosts } from "@/data/blogPosts";
import BlogClient from "./BlogClient";
import { Link } from "@/i18n/routing";
import { Metadata } from 'next';
import { Newsletter } from "@/components/Newsletter";

export const metadata: Metadata = {
    title: "PassMate Blog | Australian Citizenship & Visa Insights",
    description: "Stay updated with the latest news, guides, and insights on Australian citizenship, visas, and living in Australia. Your ultimate resource for becoming an Aussie.",
};

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-16 px-4 overflow-hidden">
                <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full font-bold mb-6 text-sm">
                            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                            AUSTRALIAN CITIZENSHIP INSIGHTS
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-display font-black text-foreground mb-6 tracking-tight">
                            PassMate <span className="text-primary italic font-serif">Blog</span>
                        </h1>

                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Your go-to resource for Australian citizenship news, visa updates, and lifestyle guides.
                            Boost your knowledge about life in Australia.
                        </p>
                    </div>
                </div>
            </section>

            <BlogClient posts={blogPosts} />

            <Newsletter />

            <footer className="py-12 border-t border-border bg-white">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🐨</span>
                        <span className="text-xl font-display font-bold text-primary">PassMate</span>
                    </div>
                    <p className="text-muted-foreground text-sm text-center md:text-left">
                        © {new Date().getFullYear()} PassMate. Helps you pass the Australian Citizenship Test.
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
