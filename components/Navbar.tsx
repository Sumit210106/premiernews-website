"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { decodeHtml } from '@/lib/wp';

interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ id: number; title: string; link: string; path: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('https://premierleaguenewsnow.com/wp-json/wp/v2/categories?per_page=50');
        const data = await res.json();
        
        const filtered = data.filter((c: Category) => 
          c.count > 0 && 
          c.name.toLowerCase() !== 'uncategorized' && 
          c.name.toLowerCase() !== 'latest news'
        );
        
        setCategories(filtered);
      } catch (error) {
        console.error("Failed to load categories for navbar", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileCategoryOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isSearchOpen]);

  const handleSearch = async (value: string) => {
    const trimmed = value.trim();
    setSearchQuery(value);

    if (!trimmed) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      const res = await fetch(
        `https://premierleaguenewsnow.com/wp-json/wp/v2/posts?search=${encodeURIComponent(trimmed)}&per_page=5&_fields=id,slug,date,link,title`
      );
      const data = await res.json();

      const results = Array.isArray(data)
        ? data.map((item: any) => ({
            id: item.id,
            title: decodeHtml(item.title?.rendered || item.title || 'Untitled'),
            link: item.link || '#',
            path: item.link ? new URL(item.link).pathname : `/${item.slug || ''}`,
          }))
        : [];

      setSearchResults(results);
    } catch (error) {
      setSearchResults([]);
      console.error('Search failed', error);
    } finally {
      setIsSearching(false);
    }
  };

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'ABOUT US', path: '/about-us' },
    { name: 'CONTACT US', path: '/contact-us' },
  ];

  return (
    <header className="bg-[#38003c] dark:bg-[#38003c] text-slate-300 dark:text-slate-300 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-20">
          
          {/* OFFICIAL LOGO */}
          <Link href="/" className="shrink-0 flex items-center py-2">
            <img 
              src="https://premierleaguenewsnow.com/wp-content/uploads/2025/05/premier-league-news-now-logo-white.png" 
              alt="Premier League News Now" 
              className="h-10 md:h-12 w-auto object-contain"
            />
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden lg:flex items-center gap-8 h-full">
            <Link 
              href="/" 
              className={`text-xs font-bold tracking-widest uppercase h-full flex items-center border-b-4 transition-colors ${pathname === '/' ? 'border-[#00ff85] text-[#00ff85]' : 'border-transparent text-slate-300 dark:text-slate-300 hover:text-[#00ff85]'}`}
            >
              Home
            </Link>

            <div className="group h-full flex items-center relative">
              <button className={`text-xs font-bold tracking-widest uppercase h-full flex items-center gap-1 border-b-4 transition-colors ${pathname.includes('/category') ? 'border-[#00ff85] text-[#00ff85]' : 'border-transparent text-slate-300 dark:text-slate-300 hover:text-[#00ff85]'}`}>
                Categories
                <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              <div className="absolute top-full left-1/2 -translate-x-1/2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 w-[600px] bg-white dark:bg-zinc-950 shadow-2xl border-t-4 border-[#00ff85] rounded-b-xl overflow-hidden pointer-events-none group-hover:pointer-events-auto">
                <div className="p-8">
                  <h3 className="text-slate-900 dark:text-white text-sm font-black uppercase tracking-widest mb-6 pb-2 border-b border-slate-100 dark:border-zinc-800">
                    Browse Categories
                  </h3>
                  <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                    {categories.map((category) => (
                      <Link 
                        key={category.id} 
                        href={`/category/${category.slug}`}
                        className="text-slate-600 dark:text-slate-400 hover:text-[#4a0e4e] dark:hover:text-[#00ff85] font-semibold text-sm transition-colors flex items-center gap-2 group/link"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-zinc-800 group-hover/link:bg-[#00ff85] transition-colors"></span>
                        {decodeHtml(category.name)}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {navLinks.slice(1).map((link) => (
              <Link 
                key={link.name}
                href={link.path}
                className={`text-xs font-bold tracking-widest uppercase h-full flex items-center border-b-4 transition-colors ${pathname === link.path ? 'border-[#00ff85] text-[#00ff85]' : 'border-transparent text-slate-300 dark:text-slate-300 hover:text-[#00ff85]'}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* UTILITIES (Restored Dark Mode & Search Icons) */}
          <div className="hidden lg:flex items-center gap-5">
            <button
              type="button"
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="text-slate-300 dark:text-slate-300 hover:text-[#00ff85] transition-colors"
              aria-label="Toggle Dark Mode"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="text-slate-300 dark:text-slate-300 hover:text-[#00ff85] transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button 
            className="lg:hidden text-white hover:text-[#00ff85] p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

        </div>
      </div>

      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 p-4 pt-20 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-zinc-800">
              <svg className="h-5 w-5 text-slate-500 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search stories, teams, news…"
                className="w-full border-0 bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="text-sm font-semibold text-slate-500 hover:text-[#00ff85] dark:text-slate-300"
              >
                Close
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4">
              {isSearching ? (
                <p className="text-sm text-slate-500 dark:text-slate-300">Searching…</p>
              ) : searchQuery.trim() ? (
                searchResults.length > 0 ? (
                  <div className="space-y-3">
                    {searchResults.map((result) => (
                      <Link
                        key={result.id}
                        href={result.path}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                          setSearchResults([]);
                        }}
                        className="block rounded-lg border border-slate-200 p-3 text-left transition-colors hover:border-[#00ff85] hover:bg-[#00ff85]/5 dark:border-zinc-700 dark:hover:border-[#00ff85]"
                      >
                        <div className="text-sm font-bold text-slate-900 dark:text-white">{result.title}</div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-300">No results found for “{searchQuery}”.</p>
                )
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-300">Type a keyword to search Premier League news.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-[#38003c] dark:bg-[#38003c] border-t border-white/10 shadow-2xl max-h-[calc(100vh-80px)] overflow-y-auto">
          <nav className="flex flex-col py-4">
            <Link href="/" className={`px-6 py-4 text-sm font-bold tracking-widest uppercase border-b border-white/5 ${pathname === '/' ? 'text-[#00ff85]' : 'text-slate-300 dark:text-slate-300'}`}>
              Home
            </Link>

            <div className="flex flex-col border-b border-white/5">
              <button 
                onClick={() => setIsMobileCategoryOpen(!isMobileCategoryOpen)}
                className="px-6 py-4 text-sm font-bold tracking-widest uppercase text-slate-300 dark:text-slate-300 flex items-center justify-between"
              >
                Categories
                <svg className={`w-4 h-4 transition-transform ${isMobileCategoryOpen ? 'rotate-180 text-[#00ff85]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              {isMobileCategoryOpen && (
                <div className="bg-black/20 px-6 py-4 flex flex-col gap-4">
                  {categories.map((category) => (
                    <Link key={category.id} href={`/category/${category.slug}`} className="text-slate-300 hover:text-[#00ff85] font-semibold text-sm flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                      {decodeHtml(category.name)}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navLinks.slice(1).map((link) => (
              <Link key={link.name} href={link.path} className={`px-6 py-4 text-sm font-bold tracking-widest uppercase border-b border-white/5 ${pathname === link.path ? 'text-[#00ff85]' : 'text-slate-300 dark:text-slate-300'}`}>
                {link.name}
              </Link>
            ))}

            {/* Mobile Utilities (Restored) */}
            <div className="px-6 py-6 flex gap-6">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="text-slate-300 dark:text-slate-300 hover:text-[#00ff85] flex items-center gap-2 text-sm font-bold uppercase tracking-widest"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                Search
              </button>
              <button
                type="button"
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className="text-slate-300 dark:text-slate-300 hover:text-[#00ff85] flex items-center gap-2 text-sm font-bold uppercase tracking-widest"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                Theme
              </button>
            </div>
            
          </nav>
        </div>
      )}
    </header>
  );
}