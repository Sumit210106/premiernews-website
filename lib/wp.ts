export interface Post {
  id: number;
  date: string;
  link: string;
  slug: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  aioseo_head_json?: {
    title?: string;
    description?: string;
    canonical_url?: string;
    keywords?: string;
    "og:title"?: string;
    "og:description"?: string;
    "og:url"?: string;
    "og:image"?: string;
    "article:published_time"?: string;
    "article:modified_time"?: string;
    "twitter:card"?: string;
    "twitter:title"?: string;
    "twitter:description"?: string;
    "twitter:image"?: string;
    schema?: any; 
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
    }>>;
  };
}

export const decodeHtml = (html: string) => {
  if (!html) return '';
  return html
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&#8216;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&#8230;/g, '…')
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, '—')
    .replace(/\[smartframe_images_embed(.*?)\]/g, '<smartframe-embed$1></smartframe-embed>');
};

export const getImageUrl = (post: Post) => {
  return post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/placeholder.jpg';
};

export const getCategories = (post: Post) => {
  return post._embedded?.['wp:term']?.[0] || [];
};

export const getPostPath = (post: Post) => {
  if (!post.date) return `/${post.slug}`;
  const dateObj = new Date(post.date);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `/${year}/${month}/${day}/${post.slug}`;
};