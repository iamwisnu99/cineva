import React from 'react';
import Link from 'next/link';
import { Film, Shield, Server, Compass, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-[#1b2234] bg-[#050608] text-zinc-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Brand statement */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md">
              <span className="text-[#07080b] font-black text-sm">C</span>
            </div>
            <span className="text-xl font-black text-white tracking-tight">CINEVA</span>
          </div>
          <p className="text-xs text-amber-400 font-semibold tracking-wider uppercase">
            Stream with Comfortable
          </p>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The dedicated premiere platform for original films, AI-assisted animations, episodic series, and experimental cinematic projects.
          </p>
        </div>

        {/* Catalog Navigation */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Browse Catalog</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/movies" className="hover:text-amber-400 transition-colors">
                Featured Movies
              </Link>
            </li>
            <li>
              <Link href="/series" className="hover:text-amber-400 transition-colors">
                Episodic Series
              </Link>
            </li>
            <li>
              <Link href="/genres" className="hover:text-amber-400 transition-colors">
                All Genres
              </Link>
            </li>
            <li>
              <Link href="/watchlist" className="hover:text-amber-400 transition-colors">
                My Watchlist
              </Link>
            </li>
          </ul>
        </div>

        {/* Technical Architecture */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Architecture</h4>
          <ul className="space-y-2 text-xs leading-relaxed text-zinc-400">
            <li className="flex items-start space-x-2">
              <Server className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
              <span>Direct CDN Media Streaming (Zero Vercel Proxying)</span>
            </li>
            <li className="flex items-start space-x-2">
              <Shield className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
              <span>Multi-track WebVTT Subtitles (ID / EN)</span>
            </li>
            <li className="flex items-start space-x-2">
              <Film className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
              <span>Adaptive HTML5 & Fullscreen Controls</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-[#151a27] flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
        <div>
          © {new Date().getFullYear()} Cineva. All original stories, concepts, and productions reserved.
        </div>
        <div className="flex items-center space-x-1 text-zinc-400">
          <span>Engineered for comfortable viewing</span>
          <Heart className="w-3 h-3 text-red-500 mx-1 fill-red-500" />
          <span>with Next.js & Direct CDN</span>
        </div>
      </div>
    </footer>
  );
}
