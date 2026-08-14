"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Post, decodeHtml, getImageUrl, getCategories, getPostPath } from '../lib/wp';
import Image from 'next/image';

interface CategorySectionProps {
  title: string;
  description?: string; 
  categoryId?: number;
  tagId?: number; 
  initialGridPosts?: Post[]; 
  offsetStart?: number; 
  layout?: 'list' | 'compact';
  showCategoryTag?: boolean;
  showDate?: boolean; 
}

export default function CategorySection({ 
  title, 
  description, 
  categoryId, 
  tagId, 
  initialGridPosts = [], 
  offsetStart = 0,
  layout = 'list',
  showCategoryTag = true,
  showDate = true 
}: CategorySectionProps) {
  const [gridPosts, setGridPosts] = useState<Post[]>(initialGridPosts || []);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const postsPerPage = 10;

  const loadMore = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const offset = offsetStart + gridPosts.length;
      const categoryFilter = categoryId ? `&categories=${categoryId}` : tagId ? `&tags=${tagId}` : "";
      
      const res = await fetch(
        `https://premierleaguenewsnow.com/wp-json/wp/v2/posts?_embed&per_page=${postsPerPage}&offset=${offset}${categoryFilter}&_fields=id,date,link,slug,title,excerpt,_links,_embedded`
      );

      if (!res.ok) throw new Error("Failed to load more posts");

      const fetchedPosts: Post[] = await res.json();

      if (fetchedPosts.length === 0) {
        setHasMore(false);
      } else {
        const uniqueNewPosts = fetchedPosts.filter(
          (post) => !gridPosts.some(p => p.id === post.id)
        );

        if (uniqueNewPosts.length > 0) {
          setGridPosts((prev) => [...prev, ...uniqueNewPosts]);
        }

        if (fetchedPosts.length < postsPerPage || uniqueNewPosts.length === 0) {
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

  if (!gridPosts || gridPosts.length === 0) return null;

  return (
    <div className="flex flex-col mb-12 last:mb-0">
      
      {/* Title & SEO Description Block */}
      <div className="flex flex-col mb-8">
        <div className="flex items-center gap-4">
          <div className="w-2 h-8 bg-[#4a0e4e] dark:bg-accent rounded-sm shrink-0"></div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-slate-900 dark:text-white shrink-0">
            {title}
          </h2>
          <div className="h-px bg-slate-200 dark:bg-zinc-800 flex-grow"></div>
        </div>
        {description && (
          <div 
            className="mt-4 text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
      </div>

      {/* --- LIST LAYOUT --- */}
      {layout === 'list' && (
        <div className="flex flex-col gap-6">
          {gridPosts.map((post) => (
            <div 
              key={post.id} 
              className="group relative bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 flex flex-col md:flex-row"
            >
              {/* Optimized Image */}
              <div className="relative w-full md:w-[35%] h-[180px] md:h-auto shrink-0 overflow-hidden z-0 pointer-events-none bg-slate-100 dark:bg-zinc-800">
                <Image 
                  src={getImageUrl(post)} 
                  alt={decodeHtml(post.title.rendered).replace(/<[^>]+>/g, '')} 
                  fill
                  sizes="(max-width: 768px) 100vw, 35vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              
              {/* Content */}
              <div className="p-5 flex flex-col justify-center flex-grow w-full md:w-[65%]">
                
                {(showCategoryTag || showDate) && (
                  <div className="flex items-center gap-3 mb-3 flex-wrap relative z-30">
                    {showCategoryTag && (
                      <div className="flex gap-1.5 flex-wrap">
                        {getCategories(post)
                          .filter(c => c.name.toLowerCase() !== 'latest news')
                          .slice(0, 1)
                          .map(c => (
                            <Link 
                              key={c.id} 
                              href={`/category/${c.slug}`}
                              className="text-[9px] font-semibold uppercase bg-[#4a0e4e]/10 dark:bg-accent/10 text-[#4a0e4e] dark:text-accent border border-[#4a0e4e]/10 dark:border-accent/20 px-1.5 py-0.5 rounded tracking-wider inline-block hover:bg-[#4a0e4e]/20 dark:hover:bg-accent/20 transition-colors"
                            >
                              {decodeHtml(c.name)}
                            </Link>
                        ))}
                      </div>
                    )}
                    {showDate && (
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                        {formatDate(post.date)}
                      </span>
                    )}
                  </div>
                )}
                
                <h3 className="text-lg md:text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2.5 leading-snug group-hover:text-[#4a0e4e] dark:group-hover:text-slate-100 transition-colors">
                  <a href={getPostPath(post)} className="before:absolute before:inset-0 before:z-10 cursor-pointer">
                    {decodeHtml(post.title.rendered)}
                  </a>
                </h3>
                
                <div 
                  className="text-slate-600 dark:text-slate-400 text-xs md:text-sm line-clamp-2 leading-relaxed font-normal relative z-20 pointer-events-none"
                  dangerouslySetInnerHTML={{ __html: decodeHtml(post.excerpt.rendered) }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- NEW COMPACT LAYOUT --- */}
      {layout === 'compact' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {gridPosts.map((post, index) => (
            <div 
              key={post.id} 
              className="group relative bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 flex flex-col p-4 sm:p-5"
            >
              <a href={getPostPath(post)} className="absolute inset-0 z-20">
                <span className="sr-only">Read story</span>
              </a>
              
              {/* Optimized TOP Image */}
              <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden shadow-sm mb-4 bg-slate-100 dark:bg-zinc-900 z-10 pointer-events-none">
                <Image 
                  src={getImageUrl(post)} 
                  alt={decodeHtml(post.title.rendered).replace(/<[^>]+>/g, '')} 
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* BOTTOM: Content */}
              <div className="relative flex flex-col flex-grow overflow-hidden">
                <span className="absolute -top-4 -left-2 text-[75px] md:text-[90px] leading-none font-black italic text-slate-100 dark:text-zinc-800/40 z-0 transition-transform duration-500 group-hover:-translate-x-1 group-hover:text-[#4a0e4e]/10 dark:group-hover:text-accent/10 select-none pointer-events-none">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="relative z-10 flex flex-col pt-3 pl-2 pr-2">
                  {showDate && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1.5 block">
                      {formatDate(post.date)}
                    </span>
                  )}
                  
                  <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100 leading-snug group-hover:text-[#4a0e4e] dark:group-hover:text-slate-100 transition-colors">
                    {decodeHtml(post.title.rendered)}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LOAD MORE BUTTON */}
      {hasMore && (
        <div className="flex justify-center mt-12">
          <button 
            onClick={loadMore}
            disabled={isLoading}
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-slate-200 hover:border-[#4a0e4e] dark:hover:border-accent/50 hover:text-[#4a0e4e] dark:hover:text-slate-200 px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer shadow-sm disabled:opacity-50"
          >
            {isLoading ? "Loading Stories..." : "Load More Stories"}
          </button>
        </div>
      )}

    </div>
  );
}