"use client";

import React, { useState, useMemo } from 'react';
import HeroGrid from './HeroGrid';
import CategorySection from './CategorySection';
import { Post } from '../lib/wp';

interface HomeClientProps {
  initialLatest: Post[];
  initialTransfers: Post[];
  initialAnalysis: Post[];
  initialInternational: Post[];
}

export default function HomeClient({
  initialLatest,
  initialTransfers,
  initialAnalysis,
  initialInternational
}: HomeClientProps) {
  // We keep a state registry of all shown post IDs to prevent duplicates globally
  const [extraShownIds, setExtraShownIds] = useState<number[]>([]);

  // Distribute the initial posts avoiding duplicates
  const distributed = useMemo(() => {
    const registry = new Set<number>();
    
    // 1. Hero Grid (first 5 unique)
    const heroPosts: Post[] = [];
    for (const post of initialLatest) {
      if (heroPosts.length < 5 && !registry.has(post.id)) {
        heroPosts.push(post);
        registry.add(post.id);
      }
    }

    // 2. Latest News (next 10 grid, next 4 recommended)
    const latestGrid: Post[] = [];
    const latestRec: Post[] = [];
    for (const post of initialLatest) {
      if (registry.has(post.id)) continue;
      if (latestGrid.length < 10) {
        latestGrid.push(post);
        registry.add(post.id);
      } else if (latestRec.length < 4) {
        latestRec.push(post);
        registry.add(post.id);
      }
    }

    // 3. Transfer News (10 grid, 4 recommended from initialTransfers)
    const transferGrid: Post[] = [];
    const transferRec: Post[] = [];
    for (const post of initialTransfers) {
      if (registry.has(post.id)) continue;
      if (transferGrid.length < 10) {
        transferGrid.push(post);
        registry.add(post.id);
      } else if (transferRec.length < 4) {
        transferRec.push(post);
        registry.add(post.id);
      }
    }

    // 4. Analysis (10 grid, 4 recommended from initialAnalysis)
    const analysisGrid: Post[] = [];
    const analysisRec: Post[] = [];
    for (const post of initialAnalysis) {
      if (registry.has(post.id)) continue;
      if (analysisGrid.length < 10) {
        analysisGrid.push(post);
        registry.add(post.id);
      } else if (analysisRec.length < 4) {
        analysisRec.push(post);
        registry.add(post.id);
      }
    }

    // 5. International (10 grid, 4 recommended from initialInternational)
    const internationalGrid: Post[] = [];
    const internationalRec: Post[] = [];
    for (const post of initialInternational) {
      if (registry.has(post.id)) continue;
      if (internationalGrid.length < 10) {
        internationalGrid.push(post);
        registry.add(post.id);
      } else if (internationalRec.length < 4) {
        internationalRec.push(post);
        registry.add(post.id);
      }
    }

    return {
      heroPosts,
      latestGrid,
      latestRec,
      transferGrid,
      transferRec,
      analysisGrid,
      analysisRec,
      internationalGrid,
      internationalRec,
      initialShownIds: Array.from(registry)
    };
  }, [initialLatest, initialTransfers, initialAnalysis, initialInternational]);

  // Combine initial shown IDs with client-side paginated shown IDs
  const allExcludeIds = useMemo(() => {
    return [...distributed.initialShownIds, ...extraShownIds];
  }, [distributed.initialShownIds, extraShownIds]);

  const handlePostsShown = (newIds: number[]) => {
    setExtraShownIds((prev) => [...prev, ...newIds]);
  };

  return (
    <div className="container mx-auto px-4 max-w-7xl flex flex-col gap-12">
      {/* Hero Section */}
      <HeroGrid posts={distributed.heroPosts} />

      {/* Global Latest News Section */}
      <CategorySection 
        title="Latest News" 
        initialGridPosts={distributed.latestGrid} 
        recommendedPosts={distributed.latestRec}
        excludeIds={allExcludeIds}
        onPostsShown={handlePostsShown}
        offsetStart={5} // Skip 5 hero posts on subsequent loadMore fetches
      />

      {/* Transfer News Section */}
      {distributed.transferGrid.length > 0 && (
        <CategorySection 
          title="Transfer News & Rumours" 
          categoryId={12}
          initialGridPosts={distributed.transferGrid} 
          recommendedPosts={distributed.transferRec}
          excludeIds={allExcludeIds}
          onPostsShown={handlePostsShown}
        />
      )}

      {/* Analysis & Tactics Section */}
      {distributed.analysisGrid.length > 0 && (
        <CategorySection 
          title="Analysis & Tactical Reviews" 
          categoryId={7}
          initialGridPosts={distributed.analysisGrid} 
          recommendedPosts={distributed.analysisRec}
          excludeIds={allExcludeIds}
          onPostsShown={handlePostsShown}
        />
      )}

      {/* International News Section */}
      {distributed.internationalGrid.length > 0 && (
        <CategorySection 
          title="International Football" 
          categoryId={378}
          initialGridPosts={distributed.internationalGrid} 
          recommendedPosts={distributed.internationalRec}
          excludeIds={allExcludeIds}
          onPostsShown={handlePostsShown}
        />
      )}
    </div>
  );
}
