"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { getPostPath } from '@/lib/wp';

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
        {activeData.map((post: any) => {
          const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://via.placeholder.com/150';

          return (
            <Link 
              href={getPostPath(post)} 
              key={post.id} 
              className="flex gap-4 py-4 border-b border-slate-100 dark:border-zinc-800/60 items-start active:bg-slate-50 dark:active:bg-zinc-900 transition-colors"
            >
              <div className="w-[110px] h-[80px] shrink-0 overflow-hidden bg-slate-100 dark:bg-zinc-800">
                <img src={imageUrl} alt="" className="w-full h-full object-cover" />
              </div>
              
              <div className="flex flex-col justify-center pt-0.5">
                {/* Title (No Categories, fully shown without clamping, natively decodes entities like &#038;) */}
                <h3 
                  className="text-[15px] font-bold text-slate-900 dark:text-slate-100 leading-snug"
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />
              </div>
            </Link>
          );
        })}
        {activeData.length === 0 && (
          <div className="py-10 text-center text-sm text-slate-500">
            No articles found.
          </div>
        )}
      </div>

      {/* Mobile Sidebar (Appears below tabs) */}
      <div className="flex flex-col gap-8 mt-12">
        
        {/* Top Ad Placeholder */}
        <div className="bg-slate-50 dark:bg-zinc-800/50 flex items-center justify-center h-[250px] border border-slate-200 dark:border-zinc-800 text-slate-400 text-xs font-semibold tracking-widest uppercase">
          Advertisement
        </div>

        {/* Recommended Stories Widget */}
        {sidebarPosts.length > 0 && (
          <div className="bg-slate-50 dark:bg-zinc-900/50 p-6 border border-slate-200 dark:border-zinc-800">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6 pb-4 border-b border-slate-200 dark:border-zinc-800">
              Recommended Stories
            </h3>
            <div className="flex flex-col gap-6">
              {sidebarPosts.map((sp: any, idx: number) => {
                const spDate = new Date(sp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                return (
                  <Link href={getPostPath(sp)} key={sp.id} className="group flex gap-4 items-start">
                    <span className="text-4xl font-black text-slate-300 dark:text-zinc-800 leading-none mt-1 group-hover:text-[#4a0e4e] transition-colors">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="flex flex-col gap-1.5 pt-1">
                      {/* Sidebar Title natively decodes entities too */}
                      <h4 
                        className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug group-hover:text-[#4a0e4e] transition-colors"
                        dangerouslySetInnerHTML={{ __html: sp.title.rendered }}
                      />
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

        {/* Bottom Ad Placeholder */}
        <div className="bg-slate-50 dark:bg-zinc-800/50 flex items-center justify-center h-[250px] border border-slate-200 dark:border-zinc-800 text-slate-400 text-xs font-semibold tracking-widest uppercase">
          Advertisement
        </div>
      </div>

    </div>
  );
}