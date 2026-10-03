'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
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
  Sparkles,
  LogIn,
  LogOut,
  CheckCircle2
} from 'lucide-react';
import { useWatchlist } from '@/lib/hooks/useWatchlist';

interface CurrentViewer {
  nama: string;
  email: string;
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentViewer | null>(null);
  const { count: watchlistCount } = useWatchlist();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch current viewer session
  const checkSession = () => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.user) {
          setCurrentUser({ nama: data.user.nama, email: data.user.email });
        } else {
          setCurrentUser(null);
        }
      })
      .catch(() => setCurrentUser(null));
  };

  useEffect(() => {
    checkSession();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setCurrentUser(null);
      setProfileDropdownOpen(false);
      router.push('/');
      router.refresh();
    } catch {
      // ignore
    }
  };

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
            <div className="relative w-8 h-8 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Image
                src="/cineva_logo.png"
                alt="Cineva Logo"
                width={32}
                height={32}
                priority
                className="w-full h-full object-contain"
              />
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

        {/* Right Actions: Search, Viewer Profile/Login */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Quick Search */}
          <Link
            href="/search"
            aria-label="Search Cineva"
            className="p-2 rounded-full text-zinc-300 hover:text-white hover:bg-[#161c2b] transition-colors relative group"
          >
            <Search className="w-5 h-5 text-zinc-300 group-hover:text-amber-400 transition-colors" />
          </Link>

          {/* Viewer Account: Login Button OR Profile Dropdown */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                aria-label="Akun Penonton"
                className="flex items-center space-x-2 p-1 pl-2 rounded-full bg-[#0f131d] border border-[#232b3e] hover:border-amber-400/50 transition-all focus:outline-none"
              >
                <span className="text-xs font-bold text-white hidden sm:block max-w-[100px] truncate">
                  {currentUser.nama.split(' ')[0]}
                </span>
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 text-black flex items-center justify-center text-xs font-black shadow-md">
                  {currentUser.nama.charAt(0).toUpperCase()}
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0f131d] border border-[#232b3e] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-3 border-b border-[#1b2234]">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white truncate block">
                        {currentUser.nama}
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    </div>
                    <span className="text-[11px] text-zinc-400 truncate block mt-0.5">
                      {currentUser.email}
                    </span>
                  </div>

                  <div className="p-1 space-y-1">
                    <Link
                      href="/watchlist"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                      <span>Watchlist Saya</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 text-left transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Keluar (Logout)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                href="/login"
                className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-amber-400 hover:bg-amber-300 text-black shadow-md shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk</span>
              </Link>
            </div>
          )}

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

            {/* Mobile Auth actions */}
            <div className="pt-3 border-t border-[#1b2234] flex flex-col space-y-2">
              {currentUser ? (
                <div className="p-3 rounded-xl bg-[#0f131d] border border-[#232b3e] space-y-2">
                  <div className="text-xs text-zinc-300">
                    Masuk sebagai: <strong className="text-white">{currentUser.nama}</strong> ({currentUser.email})
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full py-2 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold flex items-center justify-center space-x-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar Akun</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-bold text-black bg-amber-400"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Masuk / Daftar Akun</span>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
