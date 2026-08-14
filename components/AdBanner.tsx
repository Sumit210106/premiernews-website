"use client";

import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  slotId: string;
}

export default function AdBanner({ slotId }: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    // Prevent double-pushing in React Strict Mode (Localhost)
    if (pushed.current) return;

    let observer: ResizeObserver | null = null;

    const pushAd = () => {
      // Only push the ad if the container is actually visible on the screen (width > 0)
      if (containerRef.current && containerRef.current.offsetWidth > 0 && !pushed.current) {
        pushed.current = true;
        try {
          if (typeof window !== 'undefined') {
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
          }
        } catch (error: any) {
          console.warn("AdSense warning:", error.message);
        }
        
        // Stop observing once the ad is loaded
        if (observer) observer.disconnect();
      }
    };

    // 1. Try to push the ad immediately on mount
    pushAd();

    // 2. If the ad is hidden (e.g., MobileTabs on a Desktop screen), 
    // observe it. If the user resizes the window and it becomes visible, load the ad then.
    if (!pushed.current && containerRef.current) {
      observer = new ResizeObserver(() => {
        pushAd();
      });
      observer.observe(containerRef.current);
    }

    // Cleanup observer on unmount
    return () => {
      if (observer) observer.disconnect();
    };
  }, [slotId]);

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