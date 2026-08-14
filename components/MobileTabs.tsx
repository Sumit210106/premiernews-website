"use client";

import React, { useState, useEffect } from 'react';
import { getPostPath } from '@/lib/wp';
import Image from 'next/image';

export default function MobileTabs({
  latest,
  analysis,
  exclusive,
  sidebarPosts 
}: {
  latest: any[],
  analysis: any[],
  exclusive: any[],
  sidebarPosts: any[]
}) {
  const [activeTab, setActiveTab] = useState('latest');

  // Instantly snap back to the top of the page when switching tabs
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const tabs = [
    { id: 'latest', label: 'LATEST NEWS', data: latest },
    { id: 'analysis', label: 'ANALYSIS', data: analysis },
    { id: 'exclusive', label: 'EXCLUSIVE', data: exclusive },
  ];

  const activeData = tabs.find(t => t.id === activeTab)?.data || [];

  return (
    <div className="w-full flex flex-col bg-white dark:bg-black px-4 pb-12">
      
      {/* Sticky Tabs Header */}
      <div className="flex border-b border-slate-200 dark:border-zinc-800 sticky top-[72px] bg-white dark:bg-black z-40 pt-2 mb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 text-center py-3 text-[11px] sm:text-xs font-bold uppercase tracking-widest transition-colors ${
              activeTab === tab.id 
                ? 'border-b-[3px] border-[#38003c] dark:border-[#00ff85] text-[#38003c] dark:text-[#00ff85]' 
                : 'border-b-[3px] border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content List */}
      <div className="flex flex-col min-h-[50vh]">
        {activeData.map((post: any, index: number) => {
          const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://via.placeholder.com/150';

          return (
            <a 
              href={getPostPath(post)} 
              key={post.id} 
              className="flex gap-4 py-4 border-b border-slate-100 dark:border-zinc-800/60 items-start active:bg-slate-50 dark:active:bg-zinc-900 transition-colors"
            >
              {/* Optimized Next.js Image Component */}
              <div className="relative w-[110px] h-[80px] shrink-0 overflow-hidden bg-slate-100 dark:bg-zinc-800 rounded">
                <Image 
                  src={imageUrl} 
                  alt={post.title.rendered.replace(/<[^>]+>/g, '') || "Article thumbnail"} 
                  fill
                  sizes="(max-width: 768px) 110px, 110px"
                  priority={index < 3} // Loads top 3 images instantly for LCP boost
                  className="object-cover" 
                />
              </div>
              
              <div className="flex flex-col justify-center pt-0.5">
                <h3 
                  className="text-[15px] font-bold text-slate-900 dark:text-slate-100 leading-snug"
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />
              </div>
            </a>
          );
        })}
        {activeData.length === 0 && (
          <div className="py-10 text-center text-sm text-slate-500">
            No articles found.
          </div>
        )}
      </div>

      {/* Mobile Sidebar */}
      <div className="flex flex-col gap-6 mt-12 pt-8 border-t border-slate-200 dark:border-zinc-800">
        
        {/* Ad Placeholder 1 (MREC) */}
        <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl flex items-center justify-center h-[250px] border border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-slate-500 text-xs font-semibold tracking-widest uppercase shadow-inner">
          Advertisement
        </div>

        {/* Banner 1 */}
        <div className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-zinc-800 block">
          <a href="https://www.sportwettenschweiz.org" target="_blank" rel="noopener noreferrer">
            <div className="relative w-full aspect-[300/250]">
              <Image 
                src="https://premierleaguenewsnow.com/wp-content/uploads/2025/01/SportwettenSchweiz.jpg" 
                alt="SportwettenSchweiz" 
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover"
              />
            </div>
          </a>
        </div>

        {/* Ad Placeholder 2 */}
        <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl flex items-center justify-center h-[250px] border border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-slate-500 text-xs font-semibold tracking-widest uppercase shadow-inner">
          Advertisement
        </div>

        {/* Banner 2 */}
        <div className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-zinc-800 block">
          <a href="https://www.schweizersportwetten.info/" target="_blank" rel="noopener noreferrer">
            <div className="relative w-full aspect-[300/250]">
              <Image 
                src="https://premierleaguenewsnow.com/wp-content/uploads/2025/01/sportwetten-schweiz.png" 
                alt="sportwetten-schweiz" 
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover"
              />
            </div>
          </a>
        </div>
        
        {/* Ad Placeholder 3 */}
        <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl flex items-center justify-center h-[250px] border border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-slate-500 text-xs font-semibold tracking-widest uppercase shadow-inner">
          Advertisement
        </div>

      </div>

    </div>
  );
}