"use client";

import React from 'react';
import HeroGrid from './HeroGrid';
import CategorySection from './CategorySection';
import { Post } from '../lib/wp';

interface HomeClientProps {
  initialLatest: Post[];
  initialExclusives: Post[];
  initialAnalysis: Post[];
  exclusiveCategoryId: number;
}

export default function HomeClient({
  initialLatest,
  initialExclusives,
  initialAnalysis,
  exclusiveCategoryId
}: HomeClientProps) {
  
  // Section 1: First 5 global posts
  const heroPosts = initialLatest.slice(0, 5);
  
  // Section 2: Next 10 global posts
  const latestGrid = initialLatest.slice(5, 15);

  return (
    <div className="container mx-auto px-4 max-w-7xl flex flex-col gap-12">
      
      {/* 1. Hero Section */}
      <HeroGrid posts={heroPosts} />

      {/* MAIN HOMEPAGE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* LEFT COLUMN: Main Content Feeds */}
        <div className="lg:col-span-2 flex flex-col">
          
          {/* 2. Global Latest News Section (List Layout) */}
          <CategorySection 
            title="More Top Stories" 
            initialGridPosts={latestGrid} 
            offsetStart={5} 
            layout="list"
            showCategoryTag={true}
          />

          {/* 3. Analysis Section (Compact Layout) */}
          {initialAnalysis && initialAnalysis.length > 0 && (
            <CategorySection 
              title="Analysis & Tactics" 
              categoryId={7}
              initialGridPosts={initialAnalysis} 
              offsetStart={0} 
              layout="compact"
              showCategoryTag={false}
            />
          )}

          {/* 4. Exclusive Section (Compact Layout) */}
          {initialExclusives && initialExclusives.length > 0 && (
            <CategorySection 
              title="Exclusives" 
              categoryId={exclusiveCategoryId} 
              initialGridPosts={initialExclusives} 
              offsetStart={0} 
              layout="compact"
              showCategoryTag={false}
            />
          )}

        </div>

        {/* RIGHT COLUMN: Master Sticky Sidebar */}
        <div className="lg:col-span-1 sticky top-24 self-start flex flex-col gap-6 pt-16 mt-16 lg:pt-0 lg:mt-0">
          
          {/* Ad Placeholder 1 (MREC) */}
          <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl flex items-center justify-center h-[250px] border border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-slate-500 text-xs font-semibold tracking-widest uppercase shadow-inner">
            Advertisement
          </div>

          {/* Banner 1 */}
          <div className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-zinc-800">
            <a href="https://www.sportwettenschweiz.org" target="_blank" rel="noopener noreferrer">
              <img 
                src="https://premierleaguenewsnow.com/wp-content/uploads/2025/01/SportwettenSchweiz.jpg" 
                alt="SportwettenSchweiz" 
                className="w-full h-auto object-cover"
              />
            </a>
          </div>

          {/* Ad Placeholder 2 */}
          <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl flex items-center justify-center h-[250px] border border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-slate-500 text-xs font-semibold tracking-widest uppercase shadow-inner">
            Advertisement
          </div>

          {/* Banner 2 */}
          <div className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-zinc-800">
            <a href="https://www.schweizersportwetten.info/" target="_blank" rel="noopener noreferrer">
              <img 
                src="https://premierleaguenewsnow.com/wp-content/uploads/2025/01/sportwetten-schweiz.png" 
                alt="sportwetten-schweiz" 
                className="w-full h-auto object-cover"
              />
            </a>
          </div>
          
          {/* Ad Placeholder 3 (Normal Fixed Size) */}
          <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl flex items-center justify-center h-[250px] border border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-slate-500 text-xs font-semibold tracking-widest uppercase shadow-inner">
            Advertisement
          </div>

        </div>

      </div>
    </div>
  );
}