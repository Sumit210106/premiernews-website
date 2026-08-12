import HomeClient from "@/components/HomeClient";
import { Post } from "@/lib/wp";

export const revalidate = 300; 

// --- MASTER CATEGORY MAP ---
// Reference this anywhere in your app to prevent ID confusion
export const CATEGORIES = {
  LATEST_NEWS: 5,
  ACADEMY: 6,
  ANALYSIS: 7,
  EXCLUSIVE: 8,
  FANTASY_PREMIER_LEAGUE: 9,
  LOAN_WATCH: 10,
  INJURY_NEWS: 11,
  TRANSFER_NEWS: 12,
  PREMIER_LEAGUE_DERBIES: 13,
  MATCH_PREVIEW: 14,
  MATCH_REPORT: 15,
  CHAMPIONS_LEAGUE: 39,
  EUROPA_LEAGUE: 65,
  INTERNATIONAL: 378,
  LEAGUE_CUP: 596,
  PLAYER_PROFILE: 720,
  FA_CUP: 836,
  LOCKDOWN_SERIES: 1014,
  UNCATEGORIZED: 1,
} as const;

async function fetchPosts(endpoint: string): Promise<Post[]> {
  try {
    const res = await fetch(endpoint, {
      next: { revalidate: 300 }
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error(`Failed to fetch from ${endpoint}:`, error);
    return [];
  }
}

export default async function HomePage() {
  const WP_BASE = "https://premierleaguenewsnow.com/wp-json/wp/v2/posts?_embed&_fields=id,date,link,slug,title,excerpt,_links,_embedded";

  // Parallel fetch: Using our new Master Map for the category IDs!
  const [initialLatest, initialExclusives, initialAnalysis] = await Promise.all([
    fetchPosts(`${WP_BASE}&per_page=15`),
    fetchPosts(`${WP_BASE}&per_page=10&categories=${CATEGORIES.EXCLUSIVE}`),
    fetchPosts(`${WP_BASE}&per_page=10&categories=${CATEGORIES.ANALYSIS}`), 
  ]);

  return (
    <main className="py-8">
      <HomeClient
        initialLatest={initialLatest}
        initialExclusives={initialExclusives}
        initialAnalysis={initialAnalysis}
        exclusiveCategoryId={CATEGORIES.EXCLUSIVE}
      />
    </main>
  );
}