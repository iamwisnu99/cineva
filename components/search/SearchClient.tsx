'use client';

import React, { useState, useMemo } from 'react';
import { Search as SearchIcon, X, Film, Tv, Sparkles, Filter } from 'lucide-react';
import { MediaItem } from '@/types/content';
import { MediaCard } from '@/components/cards/MediaCard';
import { EmptyCatalogState } from '@/components/common/EmptyCatalogState';

interface SearchClientProps {
  initialMedia: MediaItem[];
}

const POPULAR_SEARCH_SUGGESTIONS = [
  'Sci-Fi',
  'Animation',
  'Action',
  'Drama',
  'Fantasy',
  'Mystery',
];

export function SearchClient({ initialMedia }: SearchClientProps) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'movie' | 'series'>('all');

  if (initialMedia.length === 0) {
    return (
      <div className="pt-24 pb-20">
        <EmptyCatalogState
          type="all"
          title="Pencarian Belum Tersedia"
          description="Katalog konten masih kosong sehingga belum ada film atau serial TV yang dapat dicari. Tambahkan data film atau serial TV di lib/data/mockData.ts terlebih dahulu."
        />
      </div>
    );
  }

  const filteredResults = useMemo(() => {
    let list = initialMedia;

    if (activeTab !== 'all') {
      list = list.filter((item) => item.type === activeTab);
    }

    const q = query.trim().toLowerCase();
    if (!q) {
      return list;
    }

    return list.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchGenre = item.genres.some((g) => g.toLowerCase().includes(q));
      const matchCast = item.cast.some((c) => c.toLowerCase().includes(q));
      const matchDirector =
        (item.type === 'movie' && item.director?.toLowerCase().includes(q)) ||
        (item.type === 'series' && item.creator?.toLowerCase().includes(q));

      const matchEpisode =
        item.type === 'series' &&
        item.seasons?.some((s) =>
          s.episodes.some((e) => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q))
        );

      return matchTitle || matchDesc || matchGenre || matchCast || matchDirector || matchEpisode;
    });
  }, [initialMedia, query, activeTab]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      {/* Search Header Bar */}
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none text-zinc-400">
            <SearchIcon className="w-5 h-5 text-amber-400" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, series, episodes, genres, actors..."
            autoFocus
            className="w-full pl-12 sm:pl-14 pr-12 py-4 rounded-2xl bg-[#0f131d] border border-[#232b3e] text-white placeholder-zinc-500 text-sm sm:text-base focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 shadow-2xl transition-all"
          />

          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Suggestion tags */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs font-semibold text-zinc-500 mr-1">Trending Searches:</span>
          {POPULAR_SEARCH_SUGGESTIONS.map((sug) => (
            <button
              key={sug}
              onClick={() => setQuery(sug)}
              className="px-2.5 py-1 rounded-full text-xs bg-[#161c2b] border border-[#232b3e] text-zinc-300 hover:text-amber-300 hover:border-amber-500/50 transition-colors"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Filter Tabs (All, Movies, Series) */}
        <div className="flex items-center space-x-2 pt-2 border-b border-[#1b2234] pb-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-amber-400 text-black shadow-md'
                : 'text-zinc-400 hover:text-white bg-[#0f131d] border border-[#232b3e]'
            }`}
          >
            All Titles
          </button>
          <button
            onClick={() => setActiveTab('movie')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'movie'
                ? 'bg-amber-400 text-black shadow-md'
                : 'text-zinc-400 hover:text-white bg-[#0f131d] border border-[#232b3e]'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Movies Only</span>
          </button>
          <button
            onClick={() => setActiveTab('series')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'series'
                ? 'bg-amber-400 text-black shadow-md'
                : 'text-zinc-400 hover:text-white bg-[#0f131d] border border-[#232b3e]'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Series Only</span>
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs text-zinc-400">
            Showing <span className="text-white font-bold">{filteredResults.length}</span> titles
            {query && (
              <span>
                {' '}for query &ldquo;<span className="text-amber-400 font-semibold">{query}</span>&rdquo;
              </span>
            )}
          </p>
        </div>

        {filteredResults.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {filteredResults.map((item) => (
              <div key={item.id} className="flex justify-center">
                <MediaCard item={item} aspectRatio="poster" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-[#0a0d14] rounded-2xl border border-[#1b2234] max-w-2xl mx-auto">
            <SearchIcon className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No results found</h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
              We couldn't find any match for &ldquo;{query}&rdquo;. Try checking the spelling or browse by genre instead.
            </p>
            <button
              onClick={() => {
                setQuery('');
                setActiveTab('all');
              }}
              className="mt-5 px-5 py-2.5 rounded-full text-xs font-bold bg-amber-400 text-black shadow-md"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
