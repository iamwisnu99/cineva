'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Bookmark, Film, Tv, Trash2, Play, Sparkles } from 'lucide-react';
import { MediaItem } from '@/types/content';
import { useWatchlist } from '@/lib/hooks/useWatchlist';
import { MediaCard } from '@/components/cards/MediaCard';

interface WatchlistClientProps {
  allMedia: MediaItem[];
}

export function WatchlistClient({ allMedia }: WatchlistClientProps) {
  const { watchlistSlugs, isLoaded, removeFromWatchlist } = useWatchlist();
  const [filterType, setFilterType] = useState<'all' | 'movie' | 'series'>('all');

  const watchlistItems = useMemo(() => {
    const map = new Map(allMedia.map((m) => [m.slug, m]));
    let items = watchlistSlugs
      .map((slug) => map.get(slug))
      .filter((item): item is MediaItem => item !== undefined);

    if (filterType !== 'all') {
      items = items.filter((item) => item.type === filterType);
    }

    return items;
  }, [allMedia, watchlistSlugs, filterType]);

  if (!isLoaded) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-[#1b2234]">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Bookmark className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>Personal Collection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            My Watchlist
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Films and series you have saved for comfortable streaming.
          </p>
        </div>

        {/* Filter Tabs */}
        {watchlistSlugs.length > 0 && (
          <div className="flex items-center space-x-2 bg-[#0f131d] border border-[#232b3e] p-1 rounded-xl">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === 'all'
                  ? 'bg-amber-400 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              All ({watchlistSlugs.length})
            </button>
            <button
              onClick={() => setFilterType('movie')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                filterType === 'movie'
                  ? 'bg-amber-400 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Movies</span>
            </button>
            <button
              onClick={() => setFilterType('series')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                filterType === 'series'
                  ? 'bg-amber-400 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Series</span>
            </button>
          </div>
        )}
      </div>

      {/* Grid or Empty State */}
      {watchlistItems.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {watchlistItems.map((item) => (
            <div key={item.id} className="relative group/card flex justify-center">
              <MediaCard item={item} aspectRatio="poster" />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-[#0a0d14] rounded-2xl border border-[#1b2234] mt-8 max-w-xl mx-auto p-6 space-y-4">
          <div className="w-14 h-14 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Your Watchlist is Empty</h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto leading-relaxed">
              Explore Cineva's catalog of original films, AI-assisted animations, and episodic series, and click the &ldquo;+ Watchlist&rdquo; button to keep track of titles you want to watch.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full font-bold text-xs bg-amber-400 hover:bg-amber-300 text-black shadow-lg transition-transform hover:scale-105"
            >
              <span>Explore Catalog</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
