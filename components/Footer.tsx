import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-auto">
      <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
        <div className="flex-1">
          <h2 className="text-2xl font-black italic tracking-tighter mb-4 text-[#cc0000]">PREMIERNEWS</h2>
          <p className="text-sm text-gray-400 max-w-sm">
            Your top destination for the latest updates, stories, and insights. We deliver news that matters.
          </p>
        </div>
        
        <div className="flex-1 flex gap-12">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold uppercase tracking-wider mb-2 text-sm text-gray-300">Quick Links</h3>
            <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">Home</Link>
            <Link href="/latest-news" className="text-sm text-gray-400 hover:text-white transition-colors">Latest News</Link>
            <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">About Us</Link>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-bold uppercase tracking-wider mb-2 text-sm text-gray-300">Support</h3>
            <Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">Contact Us</Link>
            <Link href="/write-for-us" className="text-sm text-gray-400 hover:text-white transition-colors">Write For Us</Link>
            <Link href="/privacy-policy" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} PremierNews. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
