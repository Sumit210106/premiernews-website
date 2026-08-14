import React from 'react';
import Link from 'next/link';
import Script from 'next/script';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { decodeHtml, getImageUrl, getPostPath } from '@/lib/wp';
import Comments from '@/components/Comments';
import AdBanner from '@/components/AdBanner'; // <-- 1. IMPORT ADBANNER COMPONENT

export async function generateStaticParams() {
  try {
    const res = await fetch('https://premierleaguenewsnow.com/wp-json/wp/v2/posts?_fields=date,slug&per_page=50');
    if (!res.ok) return [{ year: '2026', month: '08', day: '14', slug: 'latest-news' }];
    const posts = await res.json();
    if (!Array.isArray(posts) || posts.length === 0) return [{ year: '2026', month: '08', day: '14', slug: 'latest-news' }];
    return posts.map((post: any) => {
      const dateObj = new Date(post.date);
      return {
        year: String(dateObj.getFullYear()),
        month: String(dateObj.getMonth() + 1).padStart(2, '0'),
        day: String(dateObj.getDate()).padStart(2, '0'),
        slug: post.slug,
      };
    });
  } catch {
    return [{ year: '2026', month: '08', day: '14', slug: 'latest-news' }];
  }
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ year: string, month: string, day: string, slug: string }> | any 
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const res = await fetch(
    `https://premierleaguenewsnow.com/wp-json/wp/v2/posts?_embed&slug=${slug}`,
    { next: { revalidate: 300 } }
  );

  if (!res.ok) return {};
  const posts = await res.json();
  if (!posts || posts.length === 0) return {};

  const post = posts[0];
  const seo = post.aioseo_head_json;

  if (!seo) {
    return { title: decodeHtml(post.title?.rendered || 'Article') };
  }

  return {
    title: seo.title || decodeHtml(post.title.rendered),
    description: seo.description,
    keywords: seo.keywords ? seo.keywords.split(',') : [],
    alternates: {
      canonical: seo.canonical_url,
    },
    openGraph: {
      title: seo["og:title"] || seo.title,
      description: seo["og:description"] || seo.description,
      url: seo["og:url"],
      images: seo["og:image"] ? [{ url: seo["og:image"] }] : [],
      type: "article",
      publishedTime: seo["article:published_time"],
      modifiedTime: seo["article:modified_time"],
    },
    twitter: {
      card: seo["twitter:card"] as any || "summary_large_image",
      title: seo["twitter:title"] || seo.title,
      description: seo["twitter:description"] || seo.description,
      images: seo["twitter:image"] ? [seo["twitter:image"]] : [],
    }
  };
}

export default async function SinglePostPage({ 
  params 
}: { 
  params: Promise<{ year: string, month: string, day: string, slug: string }> | any 
}) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const res = await fetch(
    `https://premierleaguenewsnow.com/wp-json/wp/v2/posts?_embed&slug=${slug}`,
    { next: { revalidate: 300 } }
  );

  if (!res.ok) return notFound();
  
  const posts = await res.json();
  if (!posts || !Array.isArray(posts) || posts.length === 0) return notFound();

  const post = posts[0];
  const categories = post._embedded?.['wp:term']?.[0] || [];
  const tags = post._embedded?.['wp:term']?.[1] || [];
  const primaryCategory = categories.length > 0 ? categories[0] : null;

  const authorData = post._embedded?.['author']?.[0] || post._embedded?.author?.[0];
  const authorName = authorData?.name || 'Premier News Desk';
  const authorAvatar = authorData?.avatar_urls?.['96'] || authorData?.avatar_urls?.['48'] || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=4a0e4e&color=fff`;

  let recommendedPosts = [];
  const WP_FIELDS = "_fields=id,date,link,slug,title,excerpt,_links,_embedded.wp:featuredmedia,_embedded.wp:term";
  try {
    const tagIds = tags.map((t: any) => t.id).join(',');
    const queryParam = tagIds ? `tags=${tagIds}` : `categories=${primaryCategory?.id || ''}`;
    const recRes = await fetch(`https://premierleaguenewsnow.com/wp-json/wp/v2/posts?_embed&${WP_FIELDS}&per_page=3&exclude=${post.id}&${queryParam}`, { next: { revalidate: 300 } });
    if (recRes.ok) recommendedPosts = await recRes.json();
  } catch (error) {}

  let sidebarPosts = [];
  try {
    const sbRes = await fetch(`https://premierleaguenewsnow.com/wp-json/wp/v2/posts?_embed&${WP_FIELDS}&per_page=6&categories=7,8&exclude=${post.id}`, { next: { revalidate: 300 } });
    if (sbRes.ok) sidebarPosts = await sbRes.json();
  } catch (error) {}

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <main className="bg-white dark:bg-zinc-950 pb-20 pt-8">
      
      {/* INJECT JSON-LD SCHEMA FROM AIOSEO */}
      {post.aioseo_head_json?.schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(post.aioseo_head_json.schema) }}
        />
      )}

      <Script src="https://platform.twitter.com/widgets.js" strategy="afterInteractive" />
      <Script src="https://www.instagram.com/embed.js" strategy="afterInteractive" />
      <Script src="https://embed-cdn.gettyimages.com/widgets/e.js" strategy="afterInteractive" />
      <Script src="https://static.smartframe.io/embed.js" strategy="afterInteractive" />

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-8 flex flex-col">
            
            <nav className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mb-6 font-semibold uppercase tracking-wider">
              <Link href="/" className="hover:text-[#4a0e4e] dark:hover:text-[#00ff85] transition-colors">Home</Link>
              <span>/</span>
              {primaryCategory && (
                <>
                  <Link href={`/category/${primaryCategory.slug}`} className="hover:text-[#4a0e4e] dark:hover:text-[#00ff85] transition-colors">
                    {decodeHtml(primaryCategory.name)}
                  </Link>
                  <span>/</span>
                </>
              )}
              <span className="text-slate-400 dark:text-slate-600 truncate max-w-[200px] sm:max-w-[300px]">
                {decodeHtml(post.title.rendered)}
              </span>
            </nav>

            <header className="mb-6 border-b border-slate-100 dark:border-zinc-800 pb-6">
              <div className="flex gap-2 flex-wrap mb-4">
                {categories.map((cat: any) => (
                  <Link key={cat.id} href={`/category/${cat.slug}`} className="text-[10px] sm:text-xs font-bold uppercase bg-[#4a0e4e]/10 dark:bg-[#00ff85]/10 text-[#4a0e4e] dark:text-[#00ff85] px-2.5 py-1 rounded tracking-wider">
                    {decodeHtml(cat.name)}
                  </Link>
                ))}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight text-slate-900 dark:text-slate-50 tracking-tight mb-6">
                {decodeHtml(post.title.rendered)}
              </h1>

              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {authorAvatar && (
                  <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden shadow-sm border border-slate-100 dark:border-zinc-700">
                    <Image src={authorAvatar} alt={decodeHtml(authorName)} fill className="object-cover" />
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-medium tracking-wide">
                  <span>By <strong className="text-slate-800 dark:text-slate-200 font-semibold">{decodeHtml(authorName)}</strong></span>
                  <span className="hidden sm:inline text-slate-300 dark:text-zinc-700">•</span>
                  <span>Published on {formattedDate}</span>
                </div>
              </div>
            </header>

            {/* Optimized Featured Image */}
            <div className="relative w-full aspect-video mb-8 rounded-xl overflow-hidden shadow-sm bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
              <Image 
                src={getImageUrl(post)} 
                alt={decodeHtml(post.title.rendered).replace(/<[^>]+>/g, '')} 
                fill 
                priority 
                sizes="(max-width: 1024px) 100vw, 800px"
                className="object-cover" 
              />
            </div>

            {/* 2. AD UNIT ABOVE ARTICLE CONTENT */}
            <div className="w-full max-w-3xl">
              <AdBanner slotId="6658379634" />
            </div>

            <div className="w-full max-w-3xl">
              <div 
                suppressHydrationWarning
                className="mt-6 text-slate-700 dark:text-slate-300 
                  [&_p]:text-[15px] md:[&_p]:text-base [&_p]:leading-[1.75] [&_p]:mb-5
                  [&_h1]:text-2xl md:[&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:text-slate-900 [&_h1]:dark:text-slate-50 [&_h1]:mt-8 [&_h1]:mb-4 
                  [&_h2]:text-xl md:[&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h2]:dark:text-slate-50 [&_h2]:mt-8 [&_h2]:mb-3 
                  [&_h3]:text-lg md:[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-slate-900 [&_h3]:dark:text-slate-50 [&_h3]:mt-6 [&_h3]:mb-3 
                  [&_ul]:list-disc [&_ul]:ml-5 [&_ul]:mb-5 [&_ol]:list-decimal [&_ol]:ml-5 [&_ol]:mb-5 
                  [&_li]:mb-2 [&_li]:text-[15px] md:[&_li]:text-base [&_li]:leading-[1.75]
                  [&_a]:text-[#4a0e4e] [&_a]:dark:text-[#00ff85] hover:[&_a]:opacity-85 [&_a]:underline 
                  [&_blockquote]:border-l-4 [&_blockquote]:border-[#4a0e4e] dark:[&_blockquote]:border-[#00ff85] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6 [&_blockquote]:text-slate-500 
                  
                  [&_table]:w-full [&_table]:my-8 [&_table]:border-collapse [&_table]:border [&_table]:border-slate-300 [&_table]:dark:border-zinc-700
                  [&_th]:p-3 [&_th]:border [&_th]:border-slate-300 [&_th]:dark:border-zinc-700 [&_th]:bg-slate-50 [&_th]:dark:bg-zinc-800/50 [&_th]:font-semibold [&_th]:text-left
                  [&_td]:p-3 [&_td]:border [&_td]:border-slate-300 [&_td]:dark:border-zinc-700
                  
                  [&_img]:rounded-xl [&_img]:my-6 [&_img]:shadow-sm
                  
                  [&_smartframe-embed]:!block [&_smartframe-embed]:!w-full [&_smartframe-embed]:!h-auto [&_smartframe-embed]:my-6"
                dangerouslySetInnerHTML={{ __html: decodeHtml(post.content.rendered) }}
              />
            </div>

            {/* 3. AD UNIT BELOW ARTICLE CONTENT */}
            <div className="w-full max-w-3xl">
              <AdBanner slotId="YOUR_BELOW_ARTICLE_SLOT_ID" />
            </div>

            {tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-zinc-800 max-w-3xl">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-900 dark:text-white mb-3">Tags in this story</h4>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: any) => (
                    <Link key={tag.id} href={`/tag/${tag.slug}`} className="text-xs font-semibold bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-slate-400 hover:bg-[#4a0e4e] hover:text-white dark:hover:bg-[#00ff85] dark:hover:text-black transition-colors px-3 py-1.5 rounded-md">
                      #{decodeHtml(tag.name)}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {recommendedPosts.length > 0 && (
              <div className="mt-12 pt-8 border-t-4 border-slate-900 dark:border-white max-w-3xl">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Recommended For You</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {recommendedPosts.map((recPost: any) => (
                    <a href={getPostPath(recPost)} key={recPost.id} className="group flex flex-col gap-3">
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                        <Image 
                          src={getImageUrl(recPost)} 
                          alt={decodeHtml(recPost.title.rendered).replace(/<[^>]+>/g, '')} 
                          fill 
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug group-hover:text-[#4a0e4e] dark:group-hover:text-[#00ff85] transition-colors line-clamp-3">
                        {decodeHtml(recPost.title.rendered)}
                      </h4>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <Comments postId={post.id} />

          </div>

          <div className="lg:col-span-4 sticky top-24 self-start flex flex-col gap-8">
            
            {/* 4. AD UNIT: SIDEBAR TOP */}
            <AdBanner slotId="3640703662" />

            {sidebarPosts.length > 0 && (
              <div className="bg-white dark:bg-zinc-950 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-900 dark:text-white mb-6 pb-4 border-b border-slate-100 dark:border-zinc-800">Recommended Stories</h3>
                <div className="flex flex-col gap-6">
                  {sidebarPosts.map((sp: any, idx: number) => {
                    const spDate = new Date(sp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    return (
                      <a href={getPostPath(sp)} key={sp.id} className="group flex gap-4 items-start">
                        <span className="text-3xl md:text-4xl font-bold text-slate-200 dark:text-zinc-800 leading-none mt-1 group-hover:text-[#4a0e4e] dark:group-hover:text-[#00ff85] transition-colors">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <div className="flex flex-col gap-1.5 pt-1">
                          <h4 className="text-sm md:text-[15px] font-semibold text-slate-800 dark:text-slate-100 leading-snug group-hover:text-[#4a0e4e] dark:group-hover:text-[#00ff85] transition-colors">
                            {decodeHtml(sp.title.rendered)}
                          </h4>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium tracking-wide">{spDate}</span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. AD UNIT: SIDEBAR BOTTOM */}
            <AdBanner slotId="YOUR_SIDEBAR_BOTTOM_SLOT_ID" />

            <div className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-zinc-800">
              <a href="https://www.sportwettenschweiz.org" target="_blank" rel="noopener noreferrer">
                <div className="relative w-full aspect-[300/250]">
                  <Image src="https://premierleaguenewsnow.com/wp-content/uploads/2025/01/SportwettenSchweiz.jpg" alt="SportwettenSchweiz" fill sizes="300px" className="object-cover" />
                </div>
              </a>
            </div>
            <div className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-zinc-800">
              <a href="https://www.schweizersportwetten.info/" target="_blank" rel="noopener noreferrer">
                <div className="relative w-full aspect-[300/250]">
                  <Image src="https://premierleaguenewsnow.com/wp-content/uploads/2025/01/sportwetten-schweiz.png" alt="sportwetten-schweiz" fill sizes="300px" className="object-cover" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}