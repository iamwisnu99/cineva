'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Film, 
  Tv, 
  Search, 
  Bookmark, 
  Compass, 
  Menu, 
  X, 
  ShieldCheck, 
  User, 
  Sparkles 
} from 'lucide-react';
import { useWatchlist } from '@/lib/hooks/useWatchlist';

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { count: watchlistCount } = useWatchlist();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/', icon: Film },
    { label: 'Movies', href: '/movies', icon: Film },
    { label: 'Series', href: '/series', icon: Tv },
    { label: 'Genres', href: '/genres', icon: Compass },
    { label: 'Watchlist', href: '/watchlist', icon: Bookmark, badge: watchlistCount },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#07080b]/95 backdrop-blur-md border-b border-[#1b2234] shadow-2xl py-3'
          : 'bg-gradient-to-b from-[#07080b]/90 via-[#07080b]/40 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand & Wordmark */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="group flex items-center space-x-2.5 focus:outline-none">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <span className="text-[#07080b] font-black text-lg tracking-tighter">C</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center">
                CINEVA
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 ml-1 inline-block animate-pulse"></span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-medium -mt-1 hidden sm:block">
                Stream with Comfortable
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-1.5 ${
                    isActive
                      ? 'text-white bg-[#161c2b] shadow-inner shadow-black/40'
                      : 'text-zinc-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-zinc-400'}`} />
                  <span>{link.label}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-400 text-black">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions: Search, Admin, Profile */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Quick Search */}
          <Link
            href="/search"
            aria-label="Search Cineva"
            className="p-2 rounded-full text-zinc-300 hover:text-white hover:bg-[#161c2b] transition-colors relative group"
          >
            <Search className="w-5 h-5 text-zinc-300 group-hover:text-amber-400 transition-colors" />
          </Link>

          {/* Admin shortcut button */}
          <Link
            href="/admin"
            title="Content Studio / Admin"
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-zinc-300 bg-[#0f131d] border border-[#232b3e] hover:border-amber-500/50 hover:text-white transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Studio</span>
          </Link>

          {/* User Profile Avatar */}
          <div className="relative group">
            <button
              aria-label="User Account"
              className="flex items-center space-x-2 p-1 rounded-full border border-transparent hover:border-[#232b3e] focus:outline-none transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-800 border border-zinc-600 flex items-center justify-center text-xs font-bold text-amber-400 shadow-md">
                <User className="w-4 h-4 text-zinc-200" />
              </div>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-[#161c2b] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0d14]/98 backdrop-blur-xl border-b border-[#232b3e] px-4 pt-3 pb-6 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-white bg-[#161c2b] border border-[#232b3e]'
                      : 'text-zinc-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-zinc-400'}`} />
                    <span>{link.label}</span>
                  </div>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-400 text-black">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-2 border-t border-[#1b2234] flex flex-col space-y-2">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>Cineva Studio (Admin)</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
