import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { decodeHtml, getPostPath, Post } from '@/lib/wp';
import CategorySection from '@/components/CategorySection';

export default async function TagArchivePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> | any 
}) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // 1. Fetch the tag object
  const tagRes = await fetch(`https://premierleaguenewsnow.com/wp-json/wp/v2/tags?slug=${slug}`);
  const tags = await tagRes.json();
  if (!tags || tags.length === 0) return notFound();
  const tag = tags[0];

  // 2. Extract SEO Meta Data (Yoast SEO support with native fallbacks)
  const seoTitle = tag.yoast_head_json?.title || tag.name;
  const seoDescription = tag.yoast_head_json?.description || tag.description || '';

  // 3. Fetch initial posts for this tag
  const postsRes = await fetch(`https://premierleaguenewsnow.com/wp-json/wp/v2/posts?_embed&tags=${tag.id}&per_page=10`);
  const initialPosts = await postsRes.json();

  // 4. Fetch Sidebar Posts
  let sidebarPosts: Post[] = [];
  try {
    const sbRes = await fetch(`https://premierleaguenewsnow.com/wp-json/wp/v2/posts?_embed&per_page=6&categories=7,8`);
    if (sbRes.ok) sidebarPosts = await sbRes.json();
  } catch (error) {
    console.error("Failed to load sidebar posts", error);
  }

  return (
    <main className="bg-white dark:bg-zinc-950 pb-20 pt-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT COLUMN - Articles List */}
          <div className="lg:col-span-8 flex flex-col">
            <CategorySection 
              title={decodeHtml(seoTitle)}
              description={decodeHtml(seoDescription)}
              tagId={tag.id}
              initialGridPosts={initialPosts}
              layout="list"
              showCategoryTag={false} // Hidden inside archives
              showDate={false}        // Hidden inside archives
            />
          </div>

          {/* RIGHT SIDEBAR (Identical to Single Post) */}
          <div className="lg:col-span-4 sticky top-24 self-start flex flex-col gap-8">
            <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl flex items-center justify-center h-[250px] border border-slate-200 dark:border-zinc-800 text-slate-400 text-xs font-semibold tracking-widest uppercase shadow-inner">
              Advertisement
            </div>

            {sidebarPosts.length > 0 && (
              <div className="bg-white dark:bg-zinc-950 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800 shadow-sm">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6 pb-4 border-b border-slate-100 dark:border-zinc-800">
                  Recommended Stories
                </h3>
                <div className="flex flex-col gap-6">
                  {sidebarPosts.map((sp: any, idx: number) => {
                    const spDate = new Date(sp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    return (
                      <Link href={getPostPath(sp)} key={sp.id} className="group flex gap-4 items-start">
                        <span className="text-4xl md:text-[42px] font-black text-slate-200 dark:text-zinc-800 leading-none mt-1 group-hover:text-[#4a0e4e] transition-colors">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <div className="flex flex-col gap-1.5 pt-1">
                          <h4 className="text-sm md:text-base font-bold text-slate-800 dark:text-slate-100 leading-snug group-hover:text-[#4a0e4e] transition-colors">
                            {decodeHtml(sp.title.rendered)}
                          </h4>
                          <span className="text-[11px] text-slate-400 font-medium tracking-wide">
                            {spDate}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl flex items-center justify-center h-[250px] border border-slate-200 dark:border-zinc-800 text-slate-400 text-xs font-semibold tracking-widest uppercase shadow-inner">
              Advertisement
            </div>

            <div className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-zinc-800">
              <a href="https://www.sportwettenschweiz.org" target="_blank" rel="noopener noreferrer">
                <img src="https://premierleaguenewsnow.com/wp-content/uploads/2025/01/SportwettenSchweiz.jpg" alt="SportwettenSchweiz" className="w-full h-auto object-cover"/>
              </a>
            </div>

            <div className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-zinc-800">
              <a href="https://www.schweizersportwetten.info/" target="_blank" rel="noopener noreferrer">
                <img src="https://premierleaguenewsnow.com/wp-content/uploads/2025/01/sportwetten-schweiz.png" alt="sportwetten-schweiz" className="w-full h-auto object-cover"/>
              </a>
            </div>
            
            <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl flex items-center justify-center min-h-[500px] border border-slate-200 dark:border-zinc-800 text-slate-400 text-xs font-semibold tracking-widest uppercase shadow-inner">
              Advertisement
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}