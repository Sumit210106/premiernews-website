export interface Post {
  id: number;
  date: string;
  link: string;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
    'author'?: Array<{
      id: number;
      name: string;
      description?: string;
      avatar_urls?: {
        [key: string]: string;
      };
    }>;
  };
}

const WP_API_URL = "https://premierleaguenewsnow.com/wp-json/wp/v2";

/**
 * Decodes standard HTML entities commonly returned by WordPress
 */
export function decodeHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/&#8217;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&#8211;/g, "-")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8230;/g, "...")
    .replace(/&#038;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#8216;/g, "'")
    .replace(/&#8212;/g, "—");
}

/**
 * Safely extracts the featured image URL from the WP post embed metadata
 */
export function getImageUrl(post: Post): string {
  return post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/placeholder.jpg';
}

/**
 * Fetches the latest posts from the WordPress API with Next.js revalidation
 */
export async function getLatestPosts(limit: number = 4): Promise<Post[]> {
  const res = await fetch(`${WP_API_URL}/posts?_embed&per_page=${limit}&_fields=id,date,link,slug,title,excerpt,_links,_embedded`, {
    next: { revalidate: 300 } // Optimized: cache API response for 5 minutes
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch latest posts: ${res.statusText}`);
  }

  return res.json();
}

/**
 * Fetches a single post by slug from the WordPress API
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const res = await fetch(`${WP_API_URL}/posts?slug=${slug}&_embed`, {
    next: { revalidate: 300 } // Optimized: cache API response for 5 minutes
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch post by slug: ${res.statusText}`);
  }

  const posts: Post[] = await res.json();
  return posts[0] || null;
}

/**
 * Fetches posts by category ID from the WordPress API
 */
export async function getPostsByCategory(categoryId: number, limit: number = 3): Promise<Post[]> {
  const res = await fetch(`${WP_API_URL}/posts?categories=${categoryId}&_embed&per_page=${limit}&_fields=id,date,link,slug,title,excerpt,_links,_embedded`, {
    next: { revalidate: 300 } // Optimized: cache API response for 5 minutes
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch posts for category ${categoryId}: ${res.statusText}`);
  }

  return res.json();
}
