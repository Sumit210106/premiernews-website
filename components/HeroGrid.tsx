import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Post, decodeHtml, getImageUrl, getCategories, getPostPath } from '../lib/wp';

interface HeroGridProps {
  posts: Post[];
}

export default function HeroGrid({ posts }: HeroGridProps) {
  if (!posts || posts.length === 0) return null;
  const mainPost = posts[0];
  const sidePosts = posts.slice(1, 5); 

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Main Featured Article (Left/Middle) */}
      <div className="lg:col-span-2 flex flex-col bg-white dark:bg-zinc-900 rounded-xl overflow-hidden group border border-slate-200 dark:border-zinc-800 transition-all duration-300 shadow-md h-full relative">
        <div className="relative w-full flex-grow overflow-hidden h-[300px] lg:min-h-[400px] bg-slate-100 dark:bg-zinc-800">
          {/* LCP Target: priority=true guarantees this image loads instantly on page visit */}
          <Image 
            src={getImageUrl(mainPost)} 
            alt={decodeHtml(mainPost.title.rendered).replace(/<[^>]+>/g, '')} 
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover transition-all duration-700 ease-out group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
        </div>
        
        <div className="p-6 md:p-8 flex flex-col shrink-0">
          
          <div className="flex flex-wrap gap-2 mb-3 relative z-30">
            {getCategories(mainPost)
              .filter(category => category.name.toLowerCase() !== 'latest news')
              .map(category => (
                <Link 
                  key={category.id} 
                  href={`/category/${category.slug}`}
                  className="text-[10px] font-semibold uppercase bg-primary/5 dark:bg-accent/10 text-primary dark:text-accent border border-primary/10 dark:border-accent/20 px-2 py-0.5 rounded tracking-wider inline-block hover:bg-primary/20 dark:hover:bg-accent/20 transition-colors"
                >
                  {decodeHtml(category.name)}
                </Link>
            ))}
          </div>
          
          {/* CHANGED TO NATIVE <a> TAG FOR FULL PAGE RELOAD */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-800 dark:text-slate-100 mb-4 leading-snug group-hover:text-primary dark:group-hover:text-slate-100 transition-colors">
            <a href={getPostPath(mainPost)} className="before:absolute before:inset-0 before:z-10 cursor-pointer">
              {decodeHtml(mainPost.title.rendered)}
            </a>
          </h2>
          
          <div 
            className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed font-normal relative z-20 pointer-events-none"
            dangerouslySetInnerHTML={{ __html: decodeHtml(mainPost.excerpt.rendered) }}
          />
        </div>
      </div>

      {/* Recommended Reads (Right) */}
      <div className="lg:col-span-1 flex flex-col gap-4 h-full">
        {sidePosts.map((post, index) => (
          <div 
            key={post.id} 
            className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-slate-300 rounded-xl p-4 flex flex-col justify-center group transition-all duration-300 shadow-sm border border-slate-200 dark:border-zinc-800 flex-grow relative"
          >
            <div className="flex gap-4 items-center">
              <div className="flex-1 min-w-0">
                
                <div className="flex flex-wrap gap-1.5 mb-2 relative z-30">
                  {getCategories(post)
                    .filter(category => category.name.toLowerCase() !== 'latest news')
                    .map(category => (
                      <Link 
                        key={category.id} 
                        href={`/category/${category.slug}`}
                        className="text-[9px] font-semibold uppercase bg-primary/5 dark:bg-accent/10 text-primary dark:text-accent border border-primary/10 dark:border-accent/20 px-1.5 py-0.5 rounded tracking-wider inline-block hover:bg-primary/20 dark:hover:bg-accent/20 transition-colors"
                      >
                        {decodeHtml(category.name)}
                      </Link>
                  ))}
                </div>

                {/* CHANGED TO NATIVE <a> TAG FOR FULL PAGE RELOAD */}
                <h4 className="font-semibold text-sm leading-snug text-slate-800 dark:text-slate-100 group-hover:text-primary dark:group-hover:text-slate-100 transition-colors mb-1.5">
                  <a href={getPostPath(post)} className="before:absolute before:inset-0 before:z-10 cursor-pointer">
                    {decodeHtml(post.title.rendered)}
                  </a>
                </h4>
                
                <div 
                  className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 leading-relaxed font-normal relative z-20 pointer-events-none"
                  dangerouslySetInnerHTML={{ __html: decodeHtml(post.excerpt.rendered) }}
                />
              </div>
              
              <div className="relative w-[110px] h-[85px] shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-zinc-800 z-20 pointer-events-none">
                <Image 
                  src={getImageUrl(post)} 
                  alt={decodeHtml(post.title.rendered).replace(/<[^>]+>/g, '')}
                  fill
                  priority={index < 2} 
                  sizes="110px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}