import { MetadataRoute } from 'next';
import { getPostPath, Post } from '@/lib/wp';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://premierleaguenewsnow.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/write-for-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  try {
    const res = await fetch(
      'https://premierleaguenewsnow.com/wp-json/wp/v2/posts?per_page=50&_fields=date,slug',
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) return staticRoutes;

    const posts: Post[] = await res.json();
    const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}${getPostPath(post)}`,
      lastModified: new Date(post.date),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    return [...staticRoutes, ...postRoutes];
  } catch (error) {
    console.error('Failed to fetch posts for sitemap:', error);
    return staticRoutes;
  }
}
