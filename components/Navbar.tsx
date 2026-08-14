"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  const [isMobileTeamsOpen, setIsMobileTeamsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const pathname = usePathname();
  const router = useRouter();

  // Updated with Google's Official Permanent Sports CDN (100% reliable)
  const clubs = [
    { name: 'Arsenal', slug: 'arsenal-news-now', logo: 'https://ssl.gstatic.com/onebox/media/sports/logos/optimized/4us2nCgl6kgZc0t3hpW75Q_500x500.png' },
    { name: 'Aston Villa', slug: 'aston-villa-news-now', logo: 'https://ssl.gstatic.com/onebox/media/sports/logos/optimized/uyNNelfnFvCEnsLrUL-j2Q_500x500.png' },
    { name: 'Bournemouth', slug: 'afc-bournemouth-news-now', logo: 'https://ssl.gstatic.com/onebox/media/sports/logos/optimized/IcOt-hrK04B-RlRwI3R0yA_500x500.png' },
    { name: 'Brentford', slug: 'brentford-news-now', logo: 'https://ssl.gstatic.com/onebox/media/sports/logos/optimized/QOUce0WQBYqnkSmN6_TxGA_500x500.png' },
    { name: 'Brighton', slug: 'brighton-hove-albion-news-now', logo: 'https://ssl.gstatic.com/onebox/media/sports/logos/optimized/EKIe0e-ZIphOcfQAwsuEEQ_500x500.png' },
    { name: 'Burnley', slug: 'burnley-news-now', logo: 'https://ssl.gstatic.com/onebox/media/sports/logos/optimized/XC5UrPpuN5yzkgCiiz9yWg_500x500.png' },
    { name: 'Chelsea', slug: 'chelsea-news-now', logo: 'https://ssl.gstatic.com/onebox/media/sports/logos/optimized/fhBITrIlbQxhVB6IjxUO6Q_500x500.png' },
    { name: 'Crystal Palace', slug: 'crystal-palace-news-now', logo: 'https://ssl.gstatic.com/onebox/media/sports/logos/optimized/8piQOzndGmApKYTcvyN9vA_500x500.png' },
    { name: 'Everton', slug: 'everton-news-now', logo: 'https://ssl.gstatic.com/onebox/media/sports/logos/optimized/C3J47ea36cMBc4XPbp9aaA_500x500.png' },
    { name: 'Fulham', slug: 'fulham-news-now', logo: 'https://ssl.gstatic.com/onebox/media/sports/logos/optimized/Gh7_5p3n364p4vxeM8FhNg_500x500.png' },
    { name: 'Leeds United', slug: 'leeds-united-news-now', logo: 'https://ssl.gstatic.com/onebox/media/sports/logos/optimized/5dqfOKpjjW6EwTAx_FysKQ_500x500.png' },
    { name: 'Liverpool', slug: 'liverpool-news-now', logo: 'https://ssl.gstatic.com/onebox/media/sports/logos/optimized/nGfV05dipbAc7zzojivKew_500x500.png' },
    { name: 'Man City', slug: 'manchester-city-news-now', logo: 'https://ssl.gstatic.com/onebox/media/sports/logos/optimized/z44l-a0W1v5FmgPnemV6Xw_500x500.png' },
    { name: 'Manchester United', slug: 'manchester-united-news-now', logo: 'https://ssl.gstatic.com/onebox/media/sports/logos/optimized/udQ6ns69PctCv143h-GeYw_500x500.png' },
    { name: 'Newcastle United', slug: 'newcastle-united-news-now', logo: 'https://ssl.gstatic.com/onebox/media/sports/logos/optimized/96CcNNQ0AYDAbssP0V9LuQ_500x500.png' },
    { name: 'Nottingham Forest', slug: 'nottingham-forest-news-now', logo: 'https://ssl.gstatic.com/onebox/media/sports/logos/optimized/Zr6FbE-8pDH7UBpWCO8U9A_500x500.png' },
    { name: 'Sunderland', slug: 'sunderland-news-now', logo: 'https://ssl.gstatic.com/onebox/media/sports/logos/optimized/CQFeTfHrtxqgr3VKWtTwfA_500x500.png' },
    { name: 'Tottenham', slug: 'tottenham-hotspur-news-now', logo: 'https://ssl.gstatic.com/onebox/media/sports/logos/optimized/k3Q_mKE98Dnohrcea0JFgQ_500x500.png' },
    { name: 'West Ham', slug: 'west-ham-united-news-now', logo: 'https://ssl.gstatic.com/onebox/media/sports/logos/optimized/bXkiyIzsbDip3x2FFcUU3A_500x500.png' },
    { name: 'Wolves', slug: 'wolves', logo: 'https://ssl.gstatic.com/onebox/media/sports/logos/optimized/-WjHLbBIQO9xE2e2MW3OPQ_500x500.png' },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('https://premierleaguenewsnow.com/wp-json/wp/v2/categories?per_page=50');
        const data = await res.json();
        const filtered = data.filter((c: Category) => 
          c.count > 0 && c.name.toLowerCase() !== 'uncategorized' && c.name.toLowerCase() !== 'latest news'
        );
        setCategories(filtered);
      } catch (error) {
        console.error("Failed to load categories for navbar", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileCategoryOpen(false);
    setIsMobileTeamsOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDarkMode(true);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'ABOUT US', path: '/about-us' },
    { name: 'CONTACT US', path: '/contact-us' },
  ];

  return (
    <header className="bg-[#38003c] text-white sticky top-0 z-50 shadow-lg relative">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-20 relative z-10">
          
          {/* LOGO */}
          <Link href="/" className="shrink-0 flex items-center py-2">
            <img 
              src="https://premierleaguenewsnow.com/wp-content/uploads/2025/05/premier-league-news-now-logo-white.png" 
              alt="Premier League News Now" 
              className="h-10 md:h-12 w-auto object-contain"
            />
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden lg:flex items-center gap-8 h-full">
            <Link href="/" className={`text-xs font-bold tracking-widest uppercase h-full flex items-center border-b-4 transition-colors ${pathname === '/' ? 'border-[#00ff85] text-[#00ff85]' : 'border-transparent text-white hover:text-[#00ff85]'}`}>
              Home
            </Link>

            {/* TEAMS LOGO MEGA MENU */}
            <div className="group h-full flex items-center relative">
              <button className={`text-xs font-bold tracking-widest uppercase h-full flex items-center gap-1 border-b-4 transition-colors ${pathname.includes('/tag') ? 'border-[#00ff85] text-[#00ff85]' : 'border-transparent text-white hover:text-[#00ff85]'}`}>
                Teams
                <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              <div className="absolute top-full left-1/2 -translate-x-1/2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 w-[600px] bg-white dark:bg-zinc-950 shadow-2xl border-t-4 border-[#00ff85] rounded-b-xl overflow-hidden pointer-events-none group-hover:pointer-events-auto">
                <div className="p-8">
                  <h3 className="text-slate-900 dark:text-white text-sm font-black uppercase tracking-widest mb-6 pb-2 border-b border-slate-100 dark:border-zinc-800">Select a Club</h3>
                  
                  {/* Clean 5-column grid for logos */}
                  <div className="grid grid-cols-5 gap-x-4 gap-y-6">
                    {clubs.map((club) => (
                      <Link 
                        key={club.slug} 
                        href={`/tag/${club.slug}`} 
                        className="flex items-center justify-center group/logo"
                        title={club.name} 
                      >
                        <div className="w-12 h-12 flex items-center justify-center p-1 bg-slate-50 dark:bg-zinc-900 rounded-full border border-slate-100 dark:border-zinc-800 shadow-sm group-hover/logo:scale-110 group-hover/logo:border-[#00ff85] transition-all duration-300">
                          <img 
                            src={club.logo} 
                            alt={club.name} 
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      </Link>
                    ))}
                  </div>

                </div>
              </div>
            </div>

            {/* CATEGORIES MEGA MENU */}
            <div className="group h-full flex items-center relative">
              <button className={`text-xs font-bold tracking-widest uppercase h-full flex items-center gap-1 border-b-4 transition-colors ${pathname.includes('/category') ? 'border-[#00ff85] text-[#00ff85]' : 'border-transparent text-white hover:text-[#00ff85]'}`}>
                Categories
                <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              <div className="absolute top-full left-1/2 -translate-x-1/2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 w-[600px] bg-white dark:bg-zinc-950 shadow-2xl border-t-4 border-[#00ff85] rounded-b-xl overflow-hidden pointer-events-none group-hover:pointer-events-auto">
                <div className="p-8">
                  <h3 className="text-slate-900 dark:text-white text-sm font-black uppercase tracking-widest mb-6 pb-2 border-b border-slate-100 dark:border-zinc-800">Browse Categories</h3>
                  <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                    {categories.map((category) => (
                      <Link key={category.id} href={`/category/${category.slug}`} className="text-slate-600 dark:text-slate-400 hover:text-[#4a0e4e] dark:hover:text-[#00ff85] font-semibold text-sm transition-colors flex items-center gap-2 group/link">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-zinc-800 group-hover/link:bg-[#00ff85] transition-colors"></span>
                        {decodeHtml(category.name)}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {navLinks.map((link) => (
              <Link key={link.name} href={link.path} className={`text-xs font-bold tracking-widest uppercase h-full flex items-center border-b-4 transition-colors ${pathname === link.path ? 'border-[#00ff85] text-[#00ff85]' : 'border-transparent text-white hover:text-[#00ff85]'}`}>
                {link.name}
              </Link>
            ))}
          </nav>

          {/* DESKTOP UTILITIES */}
          <div className="hidden lg:flex items-center gap-5">
            <button onClick={toggleTheme} className="text-white hover:text-[#00ff85] transition-colors" aria-label="Toggle Dark Mode">
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
              )}
            </button>
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className={`transition-colors ${isSearchOpen ? 'text-[#00ff85]' : 'text-white hover:text-[#00ff85]'}`} aria-label="Search">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button className="lg:hidden text-white hover:text-[#00ff85] p-2" aria-label="Toggle mobile menu" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* SEARCH DROPDOWN OVERLAY (Desktop & Mobile) */}
      <div className={`absolute top-full left-0 w-full bg-[#2a002d] border-t border-white/10 overflow-hidden transition-all duration-300 ${isSearchOpen ? 'max-h-24 py-4' : 'max-h-0 py-0'}`}>
        <div className="container mx-auto px-4 max-w-3xl">
          <form onSubmit={handleSearch} className="relative">
            <input 
              type="text" 
              placeholder="Search Premier League News..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/30 border border-white/20 text-white placeholder-white/50 rounded-full py-3 px-6 pr-12 focus:outline-none focus:border-[#00ff85]"
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-[#00ff85]" aria-label="Search">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </button>
          </form>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-[#38003c] border-t border-white/10 shadow-2xl max-h-[calc(100vh-80px)] overflow-y-auto z-0">
          <nav className="flex flex-col py-4">
            <Link href="/" className={`px-6 py-4 text-sm font-bold tracking-widest uppercase border-b border-white/5 ${pathname === '/' ? 'text-[#00ff85]' : 'text-white'}`}>Home</Link>

            {/* MOBILE TEAMS LOGO ACCORDION */}
            <div className="flex flex-col border-b border-white/5">
              <button onClick={() => setIsMobileTeamsOpen(!isMobileTeamsOpen)} className="px-6 py-4 text-sm font-bold tracking-widest uppercase text-white flex items-center justify-between">
                Teams
                <svg className={`w-4 h-4 transition-transform ${isMobileTeamsOpen ? 'rotate-180 text-[#00ff85]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              {isMobileTeamsOpen && (
                <div className="bg-black/20 px-4 py-6 grid grid-cols-5 gap-y-6 gap-x-2">
                  {clubs.map((club) => (
                    <Link 
                      key={club.slug} 
                      href={`/tag/${club.slug}`} 
                      className="flex items-center justify-center group"
                      title={club.name}
                    >
                      <div className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full p-1 border border-white/10 group-hover:scale-110 group-hover:border-[#00ff85] transition-all duration-300">
                        <img 
                          src={club.logo} 
                          alt={club.name} 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* MOBILE CATEGORIES ACCORDION */}
            <div className="flex flex-col border-b border-white/5">
              <button onClick={() => setIsMobileCategoryOpen(!isMobileCategoryOpen)} className="px-6 py-4 text-sm font-bold tracking-widest uppercase text-white flex items-center justify-between">
                Categories
                <svg className={`w-4 h-4 transition-transform ${isMobileCategoryOpen ? 'rotate-180 text-[#00ff85]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              {isMobileCategoryOpen && (
                <div className="bg-black/20 px-6 py-4 flex flex-col gap-4">
                  {categories.map((category) => (
                    <Link key={category.id} href={`/category/${category.slug}`} className="text-slate-300 hover:text-[#00ff85] font-semibold text-sm flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>{decodeHtml(category.name)}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <Link key={link.name} href={link.path} className={`px-6 py-4 text-sm font-bold tracking-widest uppercase border-b border-white/5 ${pathname === link.path ? 'text-[#00ff85]' : 'text-white'}`}>
                {link.name}
              </Link>
            ))}

            {/* Mobile Utilities */}
            <div className="px-6 py-6 flex gap-6">
              <button onClick={() => { setIsSearchOpen(!isSearchOpen); setIsMobileMenuOpen(false); }} className="text-white hover:text-[#00ff85] flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                Search
              </button>
              <button onClick={toggleTheme} className="text-white hover:text-[#00ff85] flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                )}
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}