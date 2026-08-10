"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Post {
  id: number;
  link: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
  };
}

interface HeroSliderProps {
  posts: Post[];
}

export default function HeroSlider({ posts }: HeroSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getImageUrl = (post: Post) => {
    return post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/placeholder.jpg';
  };

  const decodeHtml = (html: string) => {
    return html
      .replace(/&#8217;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&#8211;/g, "-")
      .replace(/&#8220;/g, '"')
      .replace(/&#8221;/g, '"');
  };

  useEffect(() => {
    if (isPaused) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }

    const nextSlide = () => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % posts.length);
    };

    timeoutRef.current = setInterval(nextSlide, 5000);

    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, [posts.length, isPaused]);

  return (
    <div 
      className="relative w-full h-[400px] sm:h-[500px] md:h-[550px] lg:h-[600px] rounded-lg overflow-hidden bg-[#1c1c1c] flex flex-col justify-end group/slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {posts.map((post, index) => {
        const isActive = index === activeIndex;
        return (
          <div
            key={post.id}
            className={`absolute inset-0 w-full h-full flex flex-col transition-all duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
              <img
                src={getImageUrl(post)}
                alt={decodeHtml(post.title.rendered)}
                className={`w-full h-full object-cover transition-transform duration-[5000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />
              {/* Gradient Overlay for Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>

            {/* Content Card Overlay at bottom */}
            <div className="relative z-20 p-6 md:p-10 mt-auto max-w-3xl">
              <span className="inline-block bg-[#65d374] text-black font-black text-xs px-2.5 py-1 rounded uppercase tracking-wider mb-4">
                Latest News
              </span>
              
              <Link href={post.link}>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white mb-3 leading-tight hover:text-[#65d374] transition-colors line-clamp-3">
                  {decodeHtml(post.title.rendered)}
                </h2>
              </Link>

              <div
                className="text-gray-300 text-xs sm:text-sm md:text-base mb-6 line-clamp-2 max-w-2xl"
                dangerouslySetInnerHTML={{ __html: decodeHtml(post.excerpt.rendered) }}
              />

              <div className="flex justify-between items-center">
                <Link
                  href={post.link}
                  className="text-white hover:text-[#65d374] font-black text-sm md:text-base transition-colors tracking-wide flex items-center gap-1 group"
                >
                  Read Story
                  <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Indicators (Dots) */}
      <div className="absolute bottom-6 right-6 z-30 flex space-x-2">
        {posts.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === activeIndex ? 'bg-[#65d374] w-8' : 'bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
