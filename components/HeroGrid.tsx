import React from 'react';
import Link from 'next/link';
import { Post, decodeHtml, getImageUrl } from '../lib/wp';

interface HeroGridProps {
  posts: Post[];
}

export default function HeroGrid({ posts }: HeroGridProps) {
  if (!posts || posts.length === 0) return null;

  const mainPost = posts[0];
  const sidePosts = posts.slice(1, 5); // Fetch 4 side cards (posts 1 to 4)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:h-[calc(100vh-120px)] lg:min-h-[650px]">
      
      {/* Main Featured Article (Left/Middle) - Spans 2 Columns, fills height on desktop */}
      <div className="lg:col-span-2 flex flex-col bg-white dark:bg-zinc-900 rounded-xl overflow-hidden group border border-slate-200 dark:border-zinc-800 transition-all duration-300 shadow-md h-full">
        <Link href={`/posts/${mainPost.slug}`} className="block relative w-full flex-grow overflow-hidden h-[300px] lg:h-auto">
          <img 
            src={getImageUrl(mainPost)} 
            alt={decodeHtml(mainPost.title.rendered)} 
            className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </Link>
        
        <div className="p-6 md:p-8 flex flex-col shrink-0">
          <span className="text-xs font-semibold uppercase text-primary dark:text-accent tracking-widest mb-3 inline-block">
            Featured Story
          </span>
          <Link href={`/posts/${mainPost.slug}`}>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-800 dark:text-slate-100 mb-4 leading-snug hover:text-primary dark:hover:text-accent transition-colors">
              {decodeHtml(mainPost.title.rendered)}
            </h2>
          </Link>
          
          <div 
            className="text-slate-600 dark:text-slate-400 text-sm md:text-base mb-6 line-clamp-2 leading-relaxed font-normal"
            dangerouslySetInnerHTML={{ __html: decodeHtml(mainPost.excerpt.rendered) }}
          />
          
          <div className="flex justify-end">
            <Link 
              href={`/posts/${mainPost.slug}`} 
              className="text-primary dark:text-accent font-semibold text-sm md:text-base hover:text-primary/80 dark:hover:text-accent-dark tracking-wide flex items-center gap-1 group/link transition-colors"
            >
              Read story
              <span className="transform translate-x-0 group-hover/link:translate-x-1 transition-transform duration-200">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Recommended Reads (Right) - Spans 1 Column, 4 separate cards (Fills height on desktop) */}
      <div className="lg:col-span-1 lg:grid lg:grid-rows-4 lg:gap-4 flex flex-col gap-4 h-full">
        {sidePosts.map((post) => (
          <div 
            key={post.id} 
            className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-slate-300 rounded-xl p-4 flex flex-col justify-between hover:border-accent/30 transition-all duration-300 shadow-sm border border-slate-200 dark:border-zinc-800 h-[140px] lg:h-full lg:row-span-1 group"
          >
            <div className="flex gap-4 items-start">
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-semibold uppercase bg-primary/5 dark:bg-accent/10 text-primary dark:text-accent border border-primary/10 dark:border-accent/20 px-1.5 py-0.5 rounded tracking-wider mb-1.5 inline-block">
                  EPL Update
                </span>
                <Link href={`/posts/${post.slug}`}>
                  <h4 className="font-semibold text-xs sm:text-sm leading-snug text-slate-800 dark:text-slate-100 hover:text-primary dark:hover:text-accent transition-colors line-clamp-2">
                    {decodeHtml(post.title.rendered)}
                  </h4>
                </Link>
              </div>
              <div className="w-[70px] h-[55px] shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-zinc-800">
                <img 
                  src={getImageUrl(post)} 
                  alt={decodeHtml(post.title.rendered)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-1 shrink-0">
              <Link 
                href={`/posts/${post.slug}`} 
                className="text-[10px] font-semibold uppercase text-primary dark:text-accent hover:text-primary/80 dark:hover:text-accent-dark flex items-center gap-1 transition-colors"
              >
                Read Story
                <span className="transform translate-x-0 group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
