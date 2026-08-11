"use client";

import React, { useState, useEffect } from 'react';
import { Search, Menu, X, Moon, Sun } from 'lucide-react';
import Link from 'next/link';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Check initial theme
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const navItems = [
    { label: 'HOME', href: '/' },
    { label: 'LATEST NEWS', href: '/latest-news' },
    { label: 'ABOUT US', href: '/about' },
    { label: 'CONTACT US', href: '/contact' },
    { label: 'WRITE FOR US', href: '/write-for-us' },
    { label: 'PRIVACY POLICY', href: '/privacy-policy' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 shadow-md bg-primary text-white">
      <nav className={`w-full transition-all duration-300 ${isScrolled ? 'py-3' : 'py-4'}`}>
        <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between">
          
          <div className="flex-shrink-0 mr-6">
            <Link href="/" className="text-2xl font-black italic tracking-tighter">
              PREMIER <span className="text-accent">NEWS</span>
            </Link>
          </div>
          
          <div className="hidden lg:flex items-center flex-1 justify-center space-x-6 xl:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-sans text-[13px] xl:text-[14px] font-bold tracking-[0.5px] whitespace-nowrap transition-all duration-200 uppercase text-white hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4 lg:space-x-5 ml-auto lg:ml-6">
            <button
              onClick={toggleTheme}
              className="text-white hover:text-accent transition-colors bg-transparent border-0 cursor-pointer flex items-center"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={22} strokeWidth={1.5} /> : <Sun size={22} strokeWidth={1.5} />}
            </button>
            <button className="text-white hover:text-accent transition-colors bg-transparent border-0 cursor-pointer">
              <Search size={22} strokeWidth={1.5} />
            </button>

            <div className="lg:hidden flex items-center ml-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="bg-transparent border-0 text-white hover:text-accent cursor-pointer"
              >
                {isMobileMenuOpen ? <X size={26} strokeWidth={1.5} /> : <Menu size={26} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <div 
        className={`lg:hidden absolute left-0 right-0 w-full text-white overflow-hidden transition-all duration-300 ease-in-out shadow-lg bg-primary`}
        style={{ 
            top: '100%',
            maxHeight: isMobileMenuOpen ? '500px' : '0'
        }}
      >
        <div className="flex flex-col py-2 px-6 border-t border-white/10">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-left text-[14px] font-bold tracking-[1px] text-white py-4 border-b border-white/10 uppercase hover:text-accent hover:bg-white/5"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
