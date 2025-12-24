import { blogPosts } from "@/data/blogPosts";
import { MetadataRoute } from 'next';

const locales = ['en', 'it', 'zh', 'hi', 'vi', 'ar', 'tl'];
const baseUrl = 'https://passmate.com.au'; // Replace with actual domain

export default function sitemap(): MetadataRoute.Sitemap {
    const staticRoutes = ['', '/blog', '/about', '/login', '/privacy', '/terms', '/contact'];

    const entries: MetadataRoute.Sitemap = [];

    // Add static routes for each locale
    locales.forEach(locale => {
        staticRoutes.forEach(route => {
            entries.push({
                url: `${baseUrl}/${locale}${route}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: route === '' ? 1 : 0.8,
            });
        });
    });

    // Add blog post routes
    blogPosts.forEach(post => {
        locales.forEach(locale => {
            entries.push({
                url: `${baseUrl}/${locale}/blog/${post.slug}`,
                lastModified: new Date(post.date),
                changeFrequency: 'monthly',
                priority: 0.6,
            });
        });
    });

    return entries;
}
