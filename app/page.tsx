import { Metadata } from "next";
import HeroGrid from "../components/HeroGrid";
import LatestNews from "../components/LatestNews";
import { getLatestPosts } from "../lib/wp";

export const metadata: Metadata = {
  title: "Home",
  description: "Stay up to date with the latest stories and breaking news from the Premier League.",
};

export default async function Home() {
  const posts = await getLatestPosts(19); // 5 for hero, 10 for grid, 4 for recommended sidebar
  
  if (!posts || posts.length === 0) {
    return <div className="p-8 text-center text-slate-800 dark:text-white">No posts found.</div>;
  }

  const heroPosts = posts.slice(0, 5);
  const initialGridPosts = posts.slice(5, 15);
  const recommendedPosts = posts.slice(15, 19);

  return (
    <div className="min-h-screen pt-12 pb-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <HeroGrid posts={heroPosts} />
        <LatestNews initialGridPosts={initialGridPosts} recommendedPosts={recommendedPosts} />
      </div>
    </div>
  );
}
