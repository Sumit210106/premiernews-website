import { Metadata } from "next";
import HomeClient from "../components/HomeClient";
import { getLatestPosts, getPostsByCategory } from "../lib/wp";

export const metadata: Metadata = {
  title: "Home",
  description: "Stay up to date with the latest stories and breaking news from the Premier League.",
};

export default async function Home() {
  // Fetch all sections in parallel with larger pools to allow deduplication
  const [
    latestPosts,
    transferPosts,
    analysisPosts,
    internationalPosts
  ] = await Promise.all([
    getLatestPosts(35),          // Larger pool for Hero and Latest News grid
    getPostsByCategory(12, 25),  // Transfer news
    getPostsByCategory(7, 25),   // Analysis posts
    getPostsByCategory(378, 25)  // International posts
  ]);

  if (!latestPosts || latestPosts.length === 0) {
    return <div className="p-8 text-center text-slate-800 dark:text-white">No posts found.</div>;
  }

  return (
    <div className="min-h-screen pt-12 pb-24">
      <HomeClient 
        initialLatest={latestPosts}
        initialTransfers={transferPosts}
        initialAnalysis={analysisPosts}
        initialInternational={internationalPosts}
      />
    </div>
  );
}
