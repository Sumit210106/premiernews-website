"use client";

import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  slotId: string;
}

export default function AdBanner({ slotId }: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  const isPlaceholder = !slotId || slotId.startsWith('YOUR_');

  useEffect(() => {
    if (isPlaceholder || pushed.current) return;

    let observer: IntersectionObserver | null = null;

    const pushAd = () => {
      if (containerRef.current && containerRef.current.offsetWidth > 0 && !pushed.current) {
        pushed.current = true;
        try {
          if (typeof window !== 'undefined') {
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
          }
        } catch (error: any) {
          // Ignore AdSense push warnings
        }
        if (observer) observer.disconnect();
      }
    };

    if ('IntersectionObserver' in window && containerRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !pushed.current) {
              pushAd();
            }
          });
        },
        { rootMargin: '200px' }
      );
      observer.observe(containerRef.current);
    } else {
      pushAd();
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, [slotId, isPlaceholder]);

  if (isPlaceholder) {
    return (
      <div className="w-full overflow-hidden my-6 flex items-center justify-center bg-slate-50 dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-800/80 rounded-xl min-h-[100px] text-slate-400 text-xs font-semibold tracking-widest uppercase shadow-inner">
        <span>Advertisement</span>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="w-full overflow-hidden my-8 flex items-center justify-center bg-slate-50 dark:bg-zinc-900/30 rounded-xl min-h-[100px]"
    >
      <ins 
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-3207230642900815"
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}