"use client";

import React from 'react';
import HeroGrid from './HeroGrid';
import CategorySection from './CategorySection';
import { Post } from '../lib/wp';
import Image from 'next/image';
import AdBanner from '@/components/AdBanner'; // <-- IMPORT ADBANNER

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

      {/* HORIZONTAL AD: Between Hero Grid and Main Content */}
      <AdBanner slotId="YOUR_HOMEPAGE_HERO_BOTTOM_SLOT" />

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

          {/* HORIZONTAL AD: Between Categories */}
          <AdBanner slotId="YOUR_HOMEPAGE_MID_FEED_SLOT_1" />

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

          {/* HORIZONTAL AD: Between Categories */}
          <AdBanner slotId="YOUR_HOMEPAGE_MID_FEED_SLOT_2" />

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
          
          {/* DESKTOP SIDEBAR AD 1 */}
          <AdBanner slotId="YOUR_DESKTOP_SIDEBAR_SLOT_1" />

          {/* Banner 1 */}
          <div className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-zinc-800 block">
            <a href="https://www.sportwettenschweiz.org" target="_blank" rel="noopener noreferrer">
              <div className="relative w-full aspect-[300/250]">
                <Image 
                  src="https://premierleaguenewsnow.com/wp-content/uploads/2025/01/SportwettenSchweiz.jpg" 
                  alt="SportwettenSchweiz" 
                  fill
                  sizes="(max-width: 1024px) 100vw, 350px"
                  className="object-cover"
                />
              </div>
            </a>
          </div>

          {/* DESKTOP SIDEBAR AD 2 */}
          <AdBanner slotId="YOUR_DESKTOP_SIDEBAR_SLOT_2" />

          {/* Banner 2 */}
          <div className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-zinc-800 block">
            <a href="https://www.schweizersportwetten.info/" target="_blank" rel="noopener noreferrer">
              <div className="relative w-full aspect-[300/250]">
                <Image 
                  src="https://premierleaguenewsnow.com/wp-content/uploads/2025/01/sportwetten-schweiz.png" 
                  alt="sportwetten-schweiz" 
                  fill
                  sizes="(max-width: 1024px) 100vw, 350px"
                  className="object-cover"
                />
              </div>
            </a>
          </div>
          
          {/* DESKTOP SIDEBAR AD 3 */}
          <AdBanner slotId="YOUR_DESKTOP_SIDEBAR_SLOT_3" />

        </div>

      </div>
    </div>
  );
}