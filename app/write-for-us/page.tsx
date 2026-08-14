import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { decodeHtml, getPostPath, Post } from '@/lib/wp';

// 1. Dynamic SEO Metadata Generator for Write For Us
export async function generateMetadata(): Promise<Metadata> {
  const slug = "write-for-us";
  try {
    const res = await fetch(
      `https://premierleaguenewsnow.com/wp-json/wp/v2/pages?_embed&slug=${slug}`,
      { next: { revalidate: 3600 } }
    );
    const pages = await res.json();
    if (!pages || pages.length === 0) return { title: 'Write For Us' };

    const page = pages[0];
    const seo = page.aioseo_head_json;

    if (!seo) {
      return { title: decodeHtml(page.title?.rendered || 'Write For Us') };
    }

    return {
      title: seo.title || decodeHtml(page.title.rendered),
      description: seo.description,
      keywords: seo.keywords ? seo.keywords.split(',') : [],
      alternates: {
        canonical: seo.canonical_url || '/write-for-us',
      },
      openGraph: {
        title: seo["og:title"] || seo.title,
        description: seo["og:description"] || seo.description,
        url: seo["og:url"] || '/write-for-us',
        images: seo["og:image"] ? [{ url: seo["og:image"] }] : [],
        type: "website",
      },
      twitter: {
        card: (seo["twitter:card"] as any) || "summary_large_image",
        title: seo["twitter:title"] || seo.title,
        description: seo["twitter:description"] || seo.description,
        images: seo["twitter:image"] ? [seo["twitter:image"]] : [],
      }
    };
  } catch {
    return { title: 'Write For Us' };
  }
}

export default async function StaticPage() {
  const slug = "write-for-us"; 
  
  const res = await fetch(
    `https://premierleaguenewsnow.com/wp-json/wp/v2/pages?_embed&slug=${slug}`, 
    { next: { revalidate: 3600 } }
  );
  
  if (!res.ok) return notFound();
  const pages = await res.json();
  if (!pages || !Array.isArray(pages) || pages.length === 0) return notFound();
  const page = pages[0];

  let sidebarPosts: Post[] = [];
  try {
    const sbRes = await fetch(`https://premierleaguenewsnow.com/wp-json/wp/v2/posts?_embed&per_page=6&categories=7,8`);
    if (sbRes.ok) sidebarPosts = await sbRes.json();
  } catch (error) {
    console.error("Failed to load sidebar posts", error);
  }

  return (
    <main className="bg-white dark:bg-zinc-950 pb-20 pt-8 min-h-[70vh]">
      {/* Dynamic Schema Injection */}
      {page.aioseo_head_json?.schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(page.aioseo_head_json.schema) }}
        />
      )}

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT COLUMN - Main Page Content */}
          <div className="lg:col-span-8 flex flex-col">
            <header className="mb-6 border-b border-slate-100 dark:border-zinc-800 pb-4">
              <h1 className="text-3xl sm:text-4xl md:text-[42px] font-black text-slate-900 dark:text-white leading-[1.15] mb-2">
                {decodeHtml(page.title.rendered)}
              </h1>
            </header>

            <article 
              className="w-full max-w-none text-slate-800 dark:text-slate-200
                [&>*:first-child]:mt-0
                [&_p]:text-base [&_p]:sm:text-lg [&_p]:leading-relaxed [&_p]:text-slate-700 [&_p]:dark:text-slate-300 [&_p]:mb-6 [&_p]:font-normal [&_p:last-child]:mb-0
                [&_h2]:text-2xl [&_h2]:sm:text-3xl [&_h2]:font-extrabold [&_h2]:text-slate-900 [&_h2]:dark:text-white [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:leading-tight
                [&_h3]:text-xl [&_h3]:sm:text-2xl [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:dark:text-white [&_h3]:mt-8 [&_h3]:mb-3
                [&_h4]:text-lg [&_h4]:font-bold [&_h4]:text-slate-900 [&_h4]:dark:text-white [&_h4]:mt-6 [&_h4]:mb-2
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:space-y-2
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:space-y-2
                [&_li]:text-base [&_li]:sm:text-lg [&_li]:text-slate-700 [&_li]:dark:text-slate-300
                [&_a]:text-[#4a0e4e] [&_a]:dark:text-accent [&_a]:underline [&_a]:font-semibold hover:[&_a]:opacity-80
                [&_img]:rounded-xl [&_img]:my-8 [&_img]:w-full [&_img]:h-auto [&_img]:shadow-sm
                [&_figure]:my-8 [&_figure]:w-full
                [&_figcaption]:text-xs [&_figcaption]:text-center [&_figcaption]:text-slate-500 [&_figcaption]:mt-2
                [&_blockquote]:border-l-4 [&_blockquote]:border-[#4a0e4e] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-8 [&_blockquote]:text-slate-600 [&_blockquote]:dark:text-slate-400
                [&_table]:w-full [&_table]:my-10 [&_table]:border-collapse [&_table]:border [&_table]:border-slate-200 [&_table]:dark:border-zinc-800
                [&_th]:bg-slate-100 [&_th]:dark:bg-zinc-900 [&_th]:p-3 [&_th]:text-left [&_th]:font-bold [&_th]:text-sm [&_th]:border-b [&_th]:border-slate-200 [&_th]:dark:border-zinc-800
                [&_td]:p-3 [&_td]:text-sm [&_td]:border-b [&_td]:border-slate-100 [&_td]:dark:border-zinc-800/60"
              dangerouslySetInnerHTML={{ __html: page.content.rendered }}
            />
          </div>

          {/* RIGHT SIDEBAR */}
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
          </div>
        </div>
      </div>
    </main>
  );
}