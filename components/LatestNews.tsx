"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Post, decodeHtml, getImageUrl } from '../lib/wp';

interface LatestNewsProps {
  initialGridPosts: Post[];
  recommendedPosts: Post[];
}

export default function LatestNews({ initialGridPosts, recommendedPosts }: LatestNewsProps) {
  const [gridPosts, setGridPosts] = useState<Post[]>(initialGridPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      // Calculate offset dynamically (5 hero posts + loaded grid posts)
      const offset = 5 + gridPosts.length;
      const res = await fetch(
        `https://premierleaguenewsnow.com/wp-json/wp/v2/posts?_embed&per_page=10&offset=${offset}&_fields=id,date,link,slug,title,excerpt,_links,_embedded`
      );

      if (!res.ok) throw new Error("Failed to load more posts");

      const newPosts: Post[] = await res.json();

      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setGridPosts((prev) => [...prev, ...newPosts]);
        if (newPosts.length < 10) {
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
        Latest News
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
                    className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 transition-all duration-300 shadow-sm hover:border-emerald-500/20 group md:flex md:h-[220px] flex-col md:flex-row"
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
                          <span className="text-emerald-600 dark:text-emerald-400">EPL Feature</span>
                          <span>{formatDate(post.date)}</span>
                        </div>
                        <Link href={`/posts/${post.slug}`}>
                          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-2 leading-snug hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors line-clamp-2">
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
                          className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold hover:underline flex items-center gap-0.5 group/link"
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
                      className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 transition-all duration-300 shadow-sm hover:border-emerald-500/20 group flex flex-col h-full"
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
                            <span className="text-emerald-600 dark:text-emerald-400">Match Update</span>
                            <span>{formatDate(post.date)}</span>
                          </div>
                          <Link href={`/posts/${post.slug}`}>
                            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2 leading-snug hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors line-clamp-2">
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
                            className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold hover:underline flex items-center gap-0.5 group/link"
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
                      className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 transition-all duration-300 shadow-sm hover:border-emerald-500/20 group md:flex md:h-[220px] flex-col md:flex-row"
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
                            <span className="text-emerald-600 dark:text-emerald-400">EPL Review</span>
                            <span>{formatDate(post.date)}</span>
                          </div>
                          <Link href={`/posts/${post.slug}`}>
                            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-2 leading-snug hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors line-clamp-2">
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
                            className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold hover:underline flex items-center gap-0.5 group/link"
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
                className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-slate-200 hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-400 px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer shadow-sm disabled:opacity-50"
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
                      <h4 className="font-semibold text-xs sm:text-sm leading-snug text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors line-clamp-2">
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
