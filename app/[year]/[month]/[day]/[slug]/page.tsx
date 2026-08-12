import React from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { decodeHtml, getImageUrl, getPostPath } from '@/lib/wp';

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
  if (!posts || posts.length === 0) return notFound();

  const post = posts[0];
  const categories = post._embedded?.['wp:term']?.[0] || [];
  const tags = post._embedded?.['wp:term']?.[1] || [];
  const primaryCategory = categories.length > 0 ? categories[0] : null;

  // Extract author data (Name & Avatar)
  const authorData = post._embedded?.['author']?.[0] || post._embedded?.author?.[0];
  const authorName = authorData?.name || 'Premier News Desk';
  const authorAvatar = authorData?.avatar_urls?.['96'] || authorData?.avatar_urls?.['48'] || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=4a0e4e&color=fff`;

  // 1. Fetch Bottom Recommended Posts by Tags (For the end of the article)
  let recommendedPosts = [];
  try {
    const tagIds = tags.map((t: any) => t.id).join(',');
    const queryParam = tagIds ? `tags=${tagIds}` : `categories=${primaryCategory?.id || ''}`;
    
    const recRes = await fetch(
      `https://premierleaguenewsnow.com/wp-json/wp/v2/posts?_embed&per_page=3&exclude=${post.id}&${queryParam}`,
      { next: { revalidate: 300 } }
    );
    
    if (recRes.ok) recommendedPosts = await recRes.json();
  } catch (error) {
    console.error("Failed to load recommended posts", error);
  }

  // 2. Fetch Sidebar Recommended Stories (Mix of Analysis:7 & Exclusive:8)
  let sidebarPosts = [];
  try {
    const sbRes = await fetch(
      `https://premierleaguenewsnow.com/wp-json/wp/v2/posts?_embed&per_page=6&categories=7,8&exclude=${post.id}`,
      { next: { revalidate: 300 } }
    );
    if (sbRes.ok) sidebarPosts = await sbRes.json();
  } catch (error) {
    console.error("Failed to load sidebar posts", error);
  }

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <main className="bg-white dark:bg-zinc-950 pb-20 pt-8">
      {/* Social Embed Scripts */}
      <Script src="https://platform.twitter.com/widgets.js" strategy="afterInteractive" />
      <Script src="https://www.instagram.com/embed.js" strategy="afterInteractive" />
      <Script src="https://embed-cdn.gettyimages.com/widgets/e.js" strategy="afterInteractive" />

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* MAIN ARTICLE COLUMN */}
          <div className="lg:col-span-8 flex flex-col">
            
            {/* Breadcrumbs */}
            <nav className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mb-6 font-semibold uppercase tracking-wider">
              <Link href="/" className="hover:text-[#4a0e4e] dark:hover:text-accent transition-colors">Home</Link>
              <span>/</span>
              {primaryCategory && (
                <>
                  <Link href={`/category/${primaryCategory.slug}`} className="hover:text-[#4a0e4e] dark:hover:text-accent transition-colors">
                    {decodeHtml(primaryCategory.name)}
                  </Link>
                  <span>/</span>
                </>
              )}
              <span className="text-slate-400 dark:text-slate-600 truncate max-w-[200px] sm:max-w-[300px]">
                {decodeHtml(post.title.rendered)}
              </span>
            </nav>

            {/* Post Header */}
            <header className="mb-6 border-b border-slate-100 dark:border-zinc-800 pb-6">
              
              <div className="flex gap-2 flex-wrap mb-4">
                {categories.map((cat: any) => (
                  <Link 
                    key={cat.id} 
                    href={`/category/${cat.slug}`}
                    className="text-[10px] sm:text-xs font-bold uppercase bg-[#4a0e4e]/10 dark:bg-accent/10 text-[#4a0e4e] dark:text-accent px-2.5 py-1 rounded tracking-wider"
                  >
                    {decodeHtml(cat.name)}
                  </Link>
                ))}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-[42px] font-black text-slate-900 dark:text-white leading-[1.15] mb-6">
                {decodeHtml(post.title.rendered)}
              </h1>

              {/* Smartly Written Author & Date Header */}
              <div className="flex items-center gap-3">
                <img 
                  src={authorAvatar} 
                  alt={decodeHtml(authorName)} 
                  className="w-10 h-10 rounded-full shadow-sm object-cover border border-slate-100 dark:border-zinc-800"
                />
                <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                  <span>By <span className="text-slate-900 dark:text-slate-200 font-extrabold">{decodeHtml(authorName)}</span></span>
                  <span className="hidden sm:inline text-slate-300 dark:text-zinc-700">|</span>
                  <span>Published on {formattedDate}</span>
                </div>
              </div>
            </header>

            {/* Featured Image - Natural Scaling (No Cropping) */}
            <div className="w-full mb-8">
              <img 
                src={getImageUrl(post)} 
                alt={decodeHtml(post.title.rendered)} 
                className="w-full h-auto rounded-2xl shadow-sm bg-slate-100 dark:bg-zinc-900"
              />
            </div>

            {/* ARTICLE CONTENT */}
            <div className="w-full max-w-3xl">
              <article 
                className="w-full max-w-none text-slate-800 dark:text-slate-200
                  [&_p]:text-base [&_p]:sm:text-lg [&_p]:leading-relaxed [&_p]:text-slate-700 [&_p]:dark:text-slate-300 [&_p]:mb-6 [&_p]:font-normal [&_p:last-child]:mb-0
                  [&_h2]:text-2xl [&_h2]:sm:text-3xl [&_h2]:font-extrabold [&_h2]:text-slate-900 [&_h2]:dark:text-white [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:leading-tight
                  [&_h3]:text-xl [&_h3]:sm:text-2xl [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:dark:text-white [&_h3]:mt-8 [&_h3]:mb-3
                  [&_h4]:text-lg [&_h4]:font-bold [&_h4]:text-slate-900 [&_h4]:dark:text-white [&_h4]:mt-6 [&_h4]:mb-2
                  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:space-y-2
                  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:space-y-2
                  [&_li]:text-base [&_li]:sm:text-lg [&_li]:text-slate-700 [&_li]:dark:text-slate-300
                  [&_a]:text-[#4a0e4e] [&_a]:dark:text-accent [&_a]:underline [&_a]:font-semibold hover:[&_a]:opacity-80
                  [&_img]:rounded-xl [&_img]:my-8 [&_img]:w-full [&_img]:h-auto [&_img]:shadow-sm
                  [&_figure]:my-8 [&_figure]:w-full
                  [&_figcaption]:text-xs [&_figcaption]:text-center [&_figcaption]:text-slate-500 [&_figcaption]:mt-2
                  [&_blockquote]:border-l-4 [&_blockquote]:border-[#4a0e4e] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-8 [&_blockquote]:text-slate-600 [&_blockquote]:dark:text-slate-400
                  [&_table]:w-full [&_table]:my-10 [&_table]:border-collapse [&_table]:border [&_table]:border-slate-200 [&_table]:dark:border-zinc-800
                  [&_th]:bg-slate-100 [&_th]:dark:bg-zinc-900 [&_th]:p-3 [&_th]:text-left [&_th]:font-bold [&_th]:text-sm [&_th]:border-b [&_th]:border-slate-200 [&_th]:dark:border-zinc-800
                  [&_td]:p-3 [&_td]:text-sm [&_td]:border-b [&_td]:border-slate-100 [&_td]:dark:border-zinc-800/60
                  
                  /* Embed & Media specific overrides to force full width */
                  [&_iframe]:!w-full [&_iframe]:aspect-video [&_iframe]:rounded-xl [&_iframe]:my-6
                  [&_.wp-block-embed]:my-6 [&_.wp-block-embed]:!w-full
                  [&_.wp-block-embed__wrapper]:!w-full [&_.wp-block-embed__wrapper]:relative
                  [&_.twitter-tweet]:mx-auto [&_.twitter-tweet]:my-6
                  [&_.instagram-media]:mx-auto [&_.instagram-media]:my-6
                  
                  /* Getty specific overrides */
                  [&_.getty]:!w-full [&_.getty]:!max-w-full [&_.getty_embed]:!w-full [&_.getty_embed]:!max-w-full
                  [&_div[class*='getty']]:!w-full [&_div[class*='getty']]:!max-w-full
                  [&_iframe[src*='gettyimages']]:!w-full [&_iframe[src*='gettyimages']]:!max-w-full"
                dangerouslySetInnerHTML={{ __html: post.content.rendered }}
              />
            </div>

            {/* Tags Section */}
            {tags.length > 0 && (
              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-zinc-800 max-w-3xl">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-3">
                  Tags in this story
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: any) => (
                    <Link 
                      key={tag.id}
                      href={`/tag/${tag.slug}`}
                      className="text-xs font-semibold bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-slate-400 hover:bg-[#4a0e4e] hover:text-white dark:hover:bg-accent dark:hover:text-black transition-colors px-3 py-1.5 rounded-md"
                    >
                      #{decodeHtml(tag.name)}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Recommended Posts (Based on Tags) */}
            {recommendedPosts.length > 0 && (
              <div className="mt-12 pt-8 border-t-4 border-slate-900 dark:border-white max-w-3xl">
                <h3 className="text-2xl font-black uppercase italic tracking-tight text-slate-900 dark:text-white mb-6">
                  Recommended For You
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {recommendedPosts.map((recPost: any) => (
                    <Link 
                      href={getPostPath(recPost)} 
                      key={recPost.id}
                      className="group flex flex-col gap-3"
                    >
                      <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-zinc-900">
                        <img 
                          src={getImageUrl(recPost)} 
                          alt={decodeHtml(recPost.title.rendered)}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#4a0e4e] dark:group-hover:text-accent transition-colors line-clamp-3">
                        {decodeHtml(recPost.title.rendered)}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT SIDEBAR - REORDERED */}
          <div className="lg:col-span-4 sticky top-24 self-start flex flex-col gap-8">
            
            {/* 1. Advertisement Placeholder */}
            <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl flex items-center justify-center h-[250px] border border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-slate-500 text-xs font-semibold tracking-widest uppercase shadow-inner">
              Advertisement
            </div>

            {/* 2. Custom Recommended Stories Widget (Screenshot Design) */}
            {sidebarPosts.length > 0 && (
              <div className="bg-white dark:bg-zinc-950 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800 shadow-sm">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6 pb-4 border-b border-slate-100 dark:border-zinc-800">
                  Recommended Stories
                </h3>
                <div className="flex flex-col gap-6">
                  {sidebarPosts.map((sp: any, idx: number) => {
                    const spDate = new Date(sp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    return (
                      <Link href={getPostPath(sp)} key={sp.id} className="group flex gap-4 items-start">
                        {/* Huge Light Gray Number */}
                        <span className="text-4xl md:text-[42px] font-black text-slate-200 dark:text-zinc-800 leading-none mt-1 group-hover:text-[#4a0e4e] dark:group-hover:text-accent transition-colors">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        
                        {/* Title and Date */}
                        <div className="flex flex-col gap-1.5 pt-1">
                          <h4 className="text-sm md:text-base font-bold text-slate-800 dark:text-slate-100 leading-snug group-hover:text-[#4a0e4e] dark:group-hover:text-accent transition-colors">
                            {decodeHtml(sp.title.rendered)}
                          </h4>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium tracking-wide">
                            {spDate}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Advertisement Placeholder */}
            <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl flex items-center justify-center h-[250px] border border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-slate-500 text-xs font-semibold tracking-widest uppercase shadow-inner">
              Advertisement
            </div>

            {/* 4. Sponsored Banner 1 */}
            <div className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-zinc-800">
              <a href="https://www.sportwettenschweiz.org" target="_blank" rel="noopener noreferrer">
                <img 
                  src="https://premierleaguenewsnow.com/wp-content/uploads/2025/01/SportwettenSchweiz.jpg" 
                  alt="SportwettenSchweiz" 
                  className="w-full h-auto object-cover"
                />
              </a>
            </div>

            {/* 5. Sponsored Banner 2 */}
            <div className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-zinc-800">
              <a href="https://www.schweizersportwetten.info/" target="_blank" rel="noopener noreferrer">
                <img 
                  src="https://premierleaguenewsnow.com/wp-content/uploads/2025/01/sportwetten-schweiz.png" 
                  alt="sportwetten-schweiz" 
                  className="w-full h-auto object-cover"
                />
              </a>
            </div>

            {/* 6. Bottom Advertisement Placeholder */}
            <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl flex items-center justify-center min-h-[500px] border border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-slate-500 text-xs font-semibold tracking-widest uppercase shadow-inner sticky top-24">
              Advertisement
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}