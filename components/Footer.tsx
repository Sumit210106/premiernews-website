import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const socialLinks = [
    {
      href: 'https://www.facebook.com/plnewsnow/',
      label: 'Facebook',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      href: 'https://x.com/nnpremierleague',
      label: 'X (Twitter)',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      href: 'https://in.pinterest.com/premierleaguenewsnow/',
      label: 'Pinterest',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
        </svg>
      ),
    },
    {
      href: 'https://www.linkedin.com/company/premier-league-news-now/',
      label: 'LinkedIn',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
    {
      href: 'https://premierleaguenewsnow.com/feed/rss/',
      label: 'RSS Feed',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20 5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56M4 10.1v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z" />
        </svg>
      ),
    },
  ];

  const leftColumnClubs = [
    { name: 'Arsenal', slug: 'arsenal-news-now' },
    { name: 'Aston Villa', slug: 'aston-villa-news-now' },
    { name: 'Bournemouth', slug: 'afc-bournemouth-news-now' },
    { name: 'Brentford', slug: 'brentford-news-now' },
    { name: 'Brighton', slug: 'brighton-hove-albion-news-now' },
    { name: 'Burnley', slug: 'burnley-news-now' },
    { name: 'Chelsea', slug: 'chelsea-news-now' },
    { name: 'Crystal Palace', slug: 'crystal-palace-news-now' },
    { name: 'Everton', slug: 'everton-news-now' },
    { name: 'Fulham', slug: 'fulham-news-now' },
  ];

  const rightColumnClubs = [
    { name: 'Leeds United', slug: 'leeds-united-news-now' },
    { name: 'Liverpool', slug: 'liverpool-news-now' },
    { name: 'Man City', slug: 'manchester-city-news-now' },
    { name: 'Manchester United', slug: 'manchester-united-news-now' },
    { name: 'Newcastle United', slug: 'newcastle-united-news-now' },
    { name: 'Nottingham Forest', slug: 'nottingham-forest-news-now' },
    { name: 'Sunderland', slug: 'sunderland-news-now' },
    { name: 'Tottenham', slug: 'tottenham-hotspur-news-now' },
    { name: 'West Ham', slug: 'west-ham-united-news-now' },
    { name: 'Wolves', slug: 'wolves' },
  ];

  return (
    <footer className="bg-[#38003c] dark:bg-[#38003c] text-slate-300 dark:text-slate-300 pt-14 pb-8 border-t border-white/10 dark:border-white/10">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Column 1: Logo, Description, Disclaimer & Social Icons */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <Link href="/" className="inline-block">
              <img 
                src="https://premierleaguenewsnow.com/wp-content/uploads/2025/05/premier-league-news-now-logo-white.png" 
                alt="Premier League News Now" 
                width={160}
                height={40}
                loading="lazy"
                className="h-10 w-auto object-contain"
              />
            </Link>

            <p className="text-xs md:text-sm leading-relaxed text-slate-300 dark:text-slate-300">
              At Premier League News Now, we provide you with the latest Premier League Football Clubs News. Our efficient content writers are dedicated Football Fans from around the globe following the English Premier League and very passionate about the club they support. #EPL
            </p>

            <p className="text-xs md:text-sm text-slate-300 dark:text-slate-300">
              We are not affiliated with premierleague.com.
            </p>

            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map(({ href, label, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 dark:bg-white/10 flex items-center justify-center text-white dark:text-white hover:bg-[#00ff85] hover:text-[#38003c] transition-colors shrink-0"
                  aria-label={label}
                  title={label}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 & 3: Club Navigation Links */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-2 gap-8 pt-2">
            <ul className="flex flex-col gap-2.5">
              {leftColumnClubs.map((club) => (
                <li key={club.slug}>
                  <Link 
                    href={`/tag/${club.slug}`} 
                    className="text-xs md:text-sm text-slate-300 dark:text-slate-300 hover:text-[#00ff85] transition-colors"
                  >
                    {club.name}
                  </Link>
                </li>
              ))}
            </ul>

            <ul className="flex flex-col gap-2.5">
              {rightColumnClubs.map((club) => (
                <li key={club.slug}>
                  <Link 
                    href={`/tag/${club.slug}`} 
                    className="text-xs md:text-sm text-slate-300 dark:text-slate-300 hover:text-[#00ff85] transition-colors"
                  >
                    {club.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright, Legal Links & Developed By */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-400 gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
            <p>© 2026 Premier League News Now. All rights reserved.</p>
            {/* Added Write For Us and Privacy Policy Links */}
            <div className="flex items-center gap-4 text-slate-300 dark:text-slate-300 font-medium">
              <Link href="/write-for-us" className="hover:text-[#00ff85] transition-colors">Write For Us</Link>
              <Link href="/privacy-policy" className="hover:text-[#00ff85] transition-colors">Privacy Policy</Link>
            </div>
          </div>
          <p>
            Developed by{' '}
            <a 
              href="https://kolacommunications.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white font-semibold hover:text-[#00ff85] transition-colors"
            >
              Kola Communications
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
}