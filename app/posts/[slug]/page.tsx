import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Post, decodeHtml, getImageUrl, getPostBySlug, getLatestPosts } from '../../../lib/wp';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  
  if (!post) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found."
    };
  }

  const title = decodeHtml(post.title.rendered);
  const excerptText = decodeHtml(post.excerpt.rendered).replace(/<[^>]*>/g, '').trim().slice(0, 160);
  const imageUrl = getImageUrl(post);

  return {
    title: title,
    description: excerptText,
    openGraph: {
      title: title,
      description: excerptText,
      url: `https://premierleaguenewsnow.com/posts/${slug}`,
      siteName: "PremierNews",
      images: imageUrl ? [{ url: imageUrl }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: excerptText,
      images: imageUrl ? [imageUrl] : [],
    }
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const recentPosts = await getLatestPosts(4);
  const relatedPosts = recentPosts.filter(p => p.id !== post.id).slice(0, 3);

  const author = post._embedded?.author?.[0];
  const authorName = author?.name ? decodeHtml(author.name) : "PremierNews Staff";
  const authorAvatar = author?.avatar_urls?.[96] || author?.avatar_urls?.[48] || author?.avatar_urls?.[24] || null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen py-12 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Navigation / Back Button */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary dark:text-accent hover:text-primary/80 dark:hover:text-accent-dark transition-colors group"
          >
            <span className="transform translate-x-0 group-hover:-translate-x-1 transition-transform">←</span>
            Back to Home
          </Link>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Article Section */}
          <article className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Header info */}
            <div className="flex flex-col gap-4">
              <span className="text-xs font-semibold uppercase text-primary dark:text-accent tracking-widest">
                Premier League News
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight text-slate-900 dark:text-slate-50 tracking-tight transition-colors">
                {decodeHtml(post.title.rendered)}
              </h1>
              
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-zinc-800/80 pb-6 transition-colors">
                {authorAvatar && (
                  <img 
                    src={authorAvatar} 
                    alt={authorName} 
                    className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-zinc-700" 
                  />
                )}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>By <strong className="font-semibold text-slate-800 dark:text-slate-200">{authorName}</strong></span>
                  <span>•</span>
                  <span>Published on {formatDate(post.date)}</span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-zinc-800 shadow-sm transition-colors">
              <img 
                src={getImageUrl(post)} 
                alt={decodeHtml(post.title.rendered)} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Post Content styled strictly using Tailwind arbitrary child selectors */}
            <div 
              className="mt-6 leading-relaxed text-slate-700 dark:text-slate-300 [&_p]:mb-6 [&_p]:leading-relaxed [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:text-slate-900 [&_h1]:dark:text-slate-50 [&_h1]:mt-8 [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h2]:dark:text-slate-50 [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-slate-900 [&_h3]:dark:text-slate-50 [&_h3]:mt-6 [&_h3]:mb-3 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-6 [&_li]:mb-2 [&_a]:text-primary [&_a]:dark:text-accent hover:[&_a]:text-primary/85 dark:hover:[&_a]:text-accent-dark [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-primary dark:[&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6 [&_blockquote]:text-slate-500 [&_img]:rounded-xl [&_img]:my-8 [&_img]:shadow-md"
              dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            />

            {/* Author Box */}
            {author && (
              <div className="mt-12 p-6 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex gap-4 items-start shadow-sm transition-colors">
                {authorAvatar && (
                  <img 
                    src={authorAvatar} 
                    alt={authorName} 
                    className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-zinc-700 shrink-0" 
                  />
                )}
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1">
                    About {authorName}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                    {author.description || "Sports journalist covering the latest transfer updates, tactical trends, and match analytics in the Premier League."}
                  </p>
                </div>
              </div>
            )}

          </article>

          {/* Related Articles / Sidebar (No Header Container as per user instruction) */}
          <aside className="lg:col-span-1 flex flex-col gap-4">
            {relatedPosts.map((relatedPost) => (
              <div 
                key={relatedPost.id} 
                className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-slate-300 rounded-xl p-5 flex flex-col justify-between hover:border-accent/30 transition-all duration-300 h-[155px] shadow-sm group border border-slate-200 dark:border-zinc-800"
              >
                <div className="flex gap-4">
                  <div className="flex-1">
                    <span className="text-[10px] font-semibold uppercase bg-primary/5 dark:bg-accent/10 text-primary dark:text-accent border border-primary/10 dark:border-accent/20 px-2 py-0.5 rounded tracking-wider mb-2 inline-block">
                      EPL Update
                    </span>
                    <Link href={`/posts/${relatedPost.slug}`}>
                      <h4 className="font-semibold text-sm sm:text-base leading-snug text-slate-800 dark:text-slate-100 hover:text-primary dark:hover:text-accent transition-colors line-clamp-2">
                        {decodeHtml(relatedPost.title.rendered)}
                      </h4>
                    </Link>
                  </div>
                  <div className="w-[85px] h-[65px] shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-zinc-800 transition-colors">
                    <img 
                      src={getImageUrl(relatedPost)} 
                      alt={decodeHtml(relatedPost.title.rendered)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end mt-1">
                  <Link 
                    href={`/posts/${relatedPost.slug}`} 
                    className="text-xs font-semibold uppercase text-primary dark:text-accent hover:text-primary/80 dark:hover:text-accent-dark flex items-center gap-1 transition-colors"
                  >
                    Read Story
                    <span className="transform translate-x-0 group-hover:translate-x-0.5 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </aside>

        </div>
      </div>
    </div>
  );
}
