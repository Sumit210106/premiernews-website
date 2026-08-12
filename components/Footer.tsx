import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebookF,
  faXTwitter,
  faPinterestP,
  faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons';
import { faRss } from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
  const socialLinks = [
    { href: 'https://www.facebook.com/plnewsnow/', label: 'Facebook', icon: faFacebookF },
    { href: 'https://x.com/nnpremierleague', label: 'X (Twitter)', icon: faXTwitter },
    { href: 'https://in.pinterest.com/premierleaguenewsnow/', label: 'Pinterest', icon: faPinterestP },
    { href: 'https://www.linkedin.com/company/premier-league-news-now/', label: 'LinkedIn', icon: faLinkedinIn },
    { href: 'https://premierleaguenewsnow.com/feed/rss/', label: 'RSS Feed', icon: faRss },
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
    <footer className="bg-[#38003c] text-slate-300 pt-14 pb-8 border-t border-white/10">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Column 1: Logo, Description, Disclaimer & Social Icons */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <Link href="/" className="inline-block">
              <img 
                src="https://premierleaguenewsnow.com/wp-content/uploads/2025/05/premier-league-news-now-logo-white.png" 
                alt="Premier League News Now" 
                className="h-10 w-auto object-contain"
              />
            </Link>

            <p className="text-xs md:text-sm leading-relaxed text-slate-300">
              At Premier League News Now, we provide you with the latest Premier League Football Clubs News. Our efficient content writers are dedicated Football Fans from around the globe following the English Premier League and very passionate about the club they support. #EPL
            </p>

            <p className="text-xs md:text-sm text-slate-300">
              We are not affiliated with premierleague.com.
            </p>

            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map(({ href, label, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#00ff85] hover:text-[#38003c] transition-colors shrink-0"
                  aria-label={label}
                  title={label}
                >
                  <FontAwesomeIcon icon={icon} className="w-3.5 h-3.5" />
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
                    className="text-xs md:text-sm text-slate-300 hover:text-[#00ff85] transition-colors"
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
                    className="text-xs md:text-sm text-slate-300 hover:text-[#00ff85] transition-colors"
                  >
                    {club.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright, Legal Links & Developed By */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
            <p>© 2026 Premier League News Now. All rights reserved.</p>
            {/* Added Write For Us and Privacy Policy Links */}
            <div className="flex items-center gap-4 text-slate-300 font-medium">
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