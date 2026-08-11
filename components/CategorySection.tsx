"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Post, decodeHtml, getImageUrl } from '../lib/wp';

interface CategorySectionProps {
  title: string;
  categoryId?: number; // Optional. If undefined, fetches latest posts globally
  initialGridPosts: Post[];
  recommendedPosts: Post[];
  excludeIds: number[];
  onPostsShown: (ids: number[]) => void;
  offsetStart?: number; // Starting offset (e.g. 5 for the first global section to skip hero posts)
}

export default function CategorySection({ 
  title, 
  categoryId, 
  initialGridPosts, 
  recommendedPosts,
  excludeIds,
  onPostsShown,
  offsetStart = 0 
}: CategorySectionProps) {
  const [gridPosts, setGridPosts] = useState<Post[]>(initialGridPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadedOffset, setLoadedOffset] = useState(0);

  const loadMore = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      // Calculate offset dynamically based on initial offset, loaded posts, and extra fetches
      const offset = offsetStart + gridPosts.length + loadedOffset;
      
      const categoryFilter = categoryId ? `&categories=${categoryId}` : "";
      
      // Fetch 20 posts (instead of 10) to make sure we have enough unique posts after filtering duplicates
      const res = await fetch(
        `https://premierleaguenewsnow.com/wp-json/wp/v2/posts?_embed&per_page=20&offset=${offset}${categoryFilter}&_fields=id,date,link,slug,title,excerpt,_links,_embedded`
      );

      if (!res.ok) throw new Error("Failed to load more posts");

      const fetchedPosts: Post[] = await res.json();

      if (fetchedPosts.length === 0) {
        setHasMore(false);
      } else {
        // Filter out duplicates (excluding posts that are already shown anywhere on the page)
        const uniqueNewPosts = fetchedPosts.filter(
          (post) => !excludeIds.includes(post.id) && !gridPosts.some(p => p.id === post.id)
        );

        // Take up to 10 unique posts
        const postsToAppend = uniqueNewPosts.slice(0, 10);

        if (postsToAppend.length > 0) {
          setGridPosts((prev) => [...prev, ...postsToAppend]);
          
          // Register the newly shown post IDs globally
          const newIds = postsToAppend.map(p => p.id);
          onPostsShown(newIds);
        }

        // Track how many total API posts we skipped past in this call
        setLoadedOffset((prev) => prev + fetchedPosts.length - postsToAppend.length);

        if (fetchedPosts.length < 20 || postsToAppend.length === 0) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Chunk the grid posts into blocks of 10 (each block follows the 2-6-2 layout)
  const chunks: Post[][] = [];
  for (let i = 0; i < gridPosts.length; i += 10) {
    chunks.push(gridPosts.slice(i, i + 10));
  }

  return (
    <div className="border-t border-slate-200 dark:border-zinc-800 pt-16 mt-16">
      <h2 className="text-2xl sm:text-3xl font-semibold text-slate-800 dark:text-slate-100 mb-10 tracking-tight">
        {title}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {/* Left Column - 2/3 width, houses all chunks of 10 */}
        <div className="lg:col-span-2 flex flex-col gap-12">
          
          {chunks.map((chunk, chunkIdx) => (
            <div 
              key={chunkIdx} 
              className={`flex flex-col gap-8 ${
                chunkIdx > 0 ? "pt-12 border-t border-slate-200 dark:border-zinc-800/80" : ""
              }`}
            >
              {/* Top 2: 2-column wider horizontal layout on desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {chunk.slice(0, 2).map((post) => (
                  <div 
                    key={post.id} 
                    className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 transition-all duration-300 shadow-sm hover:border-accent/20 group md:flex md:h-[220px] flex-col md:flex-row"
                  >
                    <Link href={`/posts/${post.slug}`} className="block relative md:w-1/2 h-[180px] md:h-full shrink-0 overflow-hidden">
                      <img 
                        src={getImageUrl(post)} 
                        alt={decodeHtml(post.title.rendered)} 
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </Link>
                    <div className="p-5 md:w-1/2 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2.5 text-[9px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                          <span className="text-primary dark:text-accent">Feature</span>
                          <span>{formatDate(post.date)}</span>
                        </div>
                        <Link href={`/posts/${post.slug}`}>
                          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-2 leading-snug hover:text-primary dark:hover:text-accent transition-colors line-clamp-2">
                            {decodeHtml(post.title.rendered)}
                          </h3>
                        </Link>
                        <div 
                          className="text-slate-600 dark:text-slate-400 text-xs mb-3 line-clamp-2 leading-relaxed font-normal"
                          dangerouslySetInnerHTML={{ __html: decodeHtml(post.excerpt.rendered) }}
                        />
                      </div>
                      <div className="flex justify-end">
                        <Link 
                          href={`/posts/${post.slug}`} 
                          className="text-primary dark:text-accent text-xs font-semibold hover:underline flex items-center gap-0.5 group/link"
                        >
                          Read Story
                          <span className="transform translate-x-0 group-hover/link:translate-x-0.5 transition-transform">→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Middle 6: 3-column vertical grid layout */}
              {chunk.length > 2 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {chunk.slice(2, 8).map((post) => (
                    <div 
                      key={post.id} 
                      className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 transition-all duration-300 shadow-sm hover:border-accent/20 group flex flex-col h-full"
                    >
                      <Link href={`/posts/${post.slug}`} className="block relative w-full h-[150px] overflow-hidden">
                        <img 
                          src={getImageUrl(post)} 
                          alt={decodeHtml(post.title.rendered)} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </Link>
                      <div className="p-4 flex flex-col flex-grow justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2 text-[9px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                            <span className="text-primary dark:text-accent">Update</span>
                            <span>{formatDate(post.date)}</span>
                          </div>
                          <Link href={`/posts/${post.slug}`}>
                            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2 leading-snug hover:text-primary dark:hover:text-accent transition-colors line-clamp-2">
                              {decodeHtml(post.title.rendered)}
                            </h3>
                          </Link>
                          <div 
                            className="text-slate-600 dark:text-slate-400 text-xs mb-4 line-clamp-2 leading-relaxed font-normal"
                            dangerouslySetInnerHTML={{ __html: decodeHtml(post.excerpt.rendered) }}
                          />
                        </div>
                        <div className="flex justify-end">
                          <Link 
                            href={`/posts/${post.slug}`} 
                            className="text-primary dark:text-accent text-xs font-semibold hover:underline flex items-center gap-0.5 group/link"
                          >
                            Read Story
                            <span className="transform translate-x-0 group-hover/link:translate-x-0.5 transition-transform">→</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom 2: 2-column wider horizontal layout on desktop */}
              {chunk.length > 8 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {chunk.slice(8, 10).map((post) => (
                    <div 
                      key={post.id} 
                      className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 transition-all duration-300 shadow-sm hover:border-accent/20 group md:flex md:h-[220px] flex-col md:flex-row"
                    >
                      <Link href={`/posts/${post.slug}`} className="block relative md:w-1/2 h-[180px] md:h-full shrink-0 overflow-hidden">
                        <img 
                          src={getImageUrl(post)} 
                          alt={decodeHtml(post.title.rendered)} 
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      </Link>
                      <div className="p-5 md:w-1/2 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2.5 text-[9px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                            <span className="text-primary dark:text-accent">Report</span>
                            <span>{formatDate(post.date)}</span>
                          </div>
                          <Link href={`/posts/${post.slug}`}>
                            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-2 leading-snug hover:text-primary dark:hover:text-accent transition-colors line-clamp-2">
                              {decodeHtml(post.title.rendered)}
                            </h3>
                          </Link>
                          <div 
                            className="text-slate-600 dark:text-slate-400 text-xs mb-3 line-clamp-2 leading-relaxed font-normal"
                            dangerouslySetInnerHTML={{ __html: decodeHtml(post.excerpt.rendered) }}
                          />
                        </div>
                        <div className="flex justify-end">
                          <Link 
                            href={`/posts/${post.slug}`} 
                            className="text-primary dark:text-accent text-xs font-semibold hover:underline flex items-center gap-0.5 group/link"
                          >
                            Read Story
                            <span className="transform translate-x-0 group-hover/link:translate-x-0.5 transition-transform">→</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* View More Button */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button 
                onClick={loadMore}
                disabled={isLoading}
                className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-slate-200 hover:border-accent/50 hover:text-primary dark:hover:text-accent px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isLoading ? "Loading Stories..." : "View More Stories"}
              </button>
            </div>
          )}
        </div>

        {/* Right Column - 1/3 width, STICKY */}
        <div className="lg:col-span-1 sticky top-[96px] self-start flex flex-col gap-6">
          
          {/* Recommended Reads Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 uppercase tracking-wider border-b border-slate-100 dark:border-zinc-850 pb-2">
              Recommended Stories
            </h3>
            
            <div className="flex flex-col gap-4">
              {recommendedPosts.map((post, idx) => (
                <div key={post.id} className="flex gap-4 items-start group">
                  <span className="text-2xl font-semibold text-slate-300 dark:text-zinc-700 leading-none">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <Link href={`/posts/${post.slug}`}>
                      <h4 className="font-semibold text-xs sm:text-sm leading-snug text-slate-800 dark:text-slate-200 hover:text-primary dark:hover:text-accent transition-colors line-clamp-2">
                        {decodeHtml(post.title.rendered)}
                      </h4>
                    </Link>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {formatDate(post.date)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
