"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Post, decodeHtml, getImageUrl, getCategories, getPostPath } from '../lib/wp';

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
          <h1 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-slate-900 dark:text-white shrink-0">
            {title}
          </h1>
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
            <Link 
              href={getPostPath(post)}
              key={post.id} 
              className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 group flex flex-col md:flex-row"
            >
              <div className="relative w-full md:w-[35%] h-[180px] md:h-auto shrink-0 overflow-hidden">
                <img 
                  src={getImageUrl(post)} 
                  alt={decodeHtml(post.title.rendered)} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              
              <div className="p-5 flex flex-col justify-center flex-grow w-full md:w-[65%]">
                
                {(showCategoryTag || showDate) && (
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    {showCategoryTag && (
                      <div className="flex gap-1.5 flex-wrap">
                        {getCategories(post)
                          .filter(c => c.name.toLowerCase() !== 'latest news')
                          .slice(0, 1)
                          .map(c => (
                            <span key={c.id} className="text-[9px] font-semibold uppercase bg-[#4a0e4e]/10 dark:bg-accent/10 text-[#4a0e4e] dark:text-accent border border-[#4a0e4e]/10 dark:border-accent/20 px-1.5 py-0.5 rounded tracking-wider inline-block">
                              {decodeHtml(c.name)}
                            </span>
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
                
                <h3 className="text-lg md:text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2.5 leading-snug group-hover:text-[#4a0e4e] dark:group-hover:text-accent transition-colors">
                  {decodeHtml(post.title.rendered)}
                </h3>
                
                <div 
                  className="text-slate-600 dark:text-slate-400 text-xs md:text-sm line-clamp-2 leading-relaxed font-normal"
                  dangerouslySetInnerHTML={{ __html: decodeHtml(post.excerpt.rendered) }}
                />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* --- COMPACT LAYOUT (Restored!) --- */}
      {layout === 'compact' && (
        <div className="flex flex-col">
          {gridPosts.map((post, index) => (
            <Link 
              href={getPostPath(post)}
              key={post.id} 
              className="group relative flex flex-col justify-center py-7 border-b border-slate-100 dark:border-zinc-800/60 transition-all duration-300 first:pt-2 overflow-hidden"
            >
              <span className="absolute -left-2 md:left-2 -top-2 md:-top-4 text-7xl md:text-[100px] leading-none font-black italic text-slate-100 dark:text-zinc-800/40 z-0 transition-all duration-500 group-hover:-translate-y-2 group-hover:translate-x-2 group-hover:scale-105 group-hover:text-[#4a0e4e]/10 dark:group-hover:text-accent/10 select-none">
                {String(index + 1).padStart(2, '0')}
              </span>
              
              <div className="relative z-10 pl-8 md:pl-16 flex flex-col justify-center transition-transform duration-500 group-hover:translate-x-2">
                
                {showDate && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 block">
                    {formatDate(post.date)}
                  </span>
                )}
                
                <h3 className="text-base md:text-lg font-medium text-slate-800 dark:text-slate-100 leading-snug group-hover:text-[#4a0e4e] dark:group-hover:text-accent transition-colors max-w-4xl">
                  {decodeHtml(post.title.rendered)}
                </h3>
                
                <div className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 group-hover:text-[#4a0e4e] dark:group-hover:text-accent transition-colors duration-300">
                  <span className="w-4 h-[2px] bg-slate-200 dark:bg-zinc-700 group-hover:w-8 group-hover:bg-[#4a0e4e]/60 dark:group-hover:bg-accent/60 transition-all duration-500 ease-out"></span>
                  Read Story 
                  <span className="transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 ease-out">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center mt-10">
          <button 
            onClick={loadMore}
            disabled={isLoading}
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-slate-200 hover:border-[#4a0e4e] dark:hover:border-accent/50 hover:text-[#4a0e4e] dark:hover:text-accent px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer shadow-sm disabled:opacity-50"
          >
            {isLoading ? "Loading Stories..." : "Load More Stories"}
          </button>
        </div>
      )}

    </div>
  );
}