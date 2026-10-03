'use client';

import React, { useState, useMemo } from 'react';
import { Series } from '@/types/content';
import { MediaCard } from '@/components/cards/MediaCard';
import { Tv, SlidersHorizontal } from 'lucide-react';

interface SeriesCatalogClientProps {
  initialSeries: Series[];
  genres: string[];
}

export function SeriesCatalogClient({ initialSeries, genres }: SeriesCatalogClientProps) {
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'trending' | 'latest' | 'rating'>('trending');

  const filteredSeries = useMemo(() => {
    let result = [...initialSeries];

    if (selectedGenre !== 'all') {
      result = result.filter((s) =>
        s.genres.some((g) => g.toLowerCase() === selectedGenre.toLowerCase())
      );
    }

    if (sortBy === 'trending') {
      result.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
    } else if (sortBy === 'latest') {
      result.sort((a, b) => b.releaseYear - a.releaseYear);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [initialSeries, selectedGenre, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#1b2234]">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Tv className="w-4 h-4" />
            <span>Episodic Series Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Original Series & Sagas
          </h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-xl">
            Multi-episode narratives, animated universe chronicles, and dark speculative fiction series.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 bg-[#0f131d] border border-[#232b3e] rounded-xl px-3 py-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-semibold text-zinc-200 focus:outline-none cursor-pointer"
            >
              <option value="trending" className="bg-[#0f131d]">Trending First</option>
              <option value="latest" className="bg-[#0f131d]">Release Year</option>
              <option value="rating" className="bg-[#0f131d]">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Genre Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto hide-scrollbar py-6">
        <button
          onClick={() => setSelectedGenre('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            selectedGenre === 'all'
              ? 'bg-amber-400 text-black shadow-md shadow-amber-500/20'
              : 'bg-[#0f131d] border border-[#232b3e] text-zinc-300 hover:text-white hover:border-zinc-500'
          }`}
        >
          All Genres
        </button>
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGenre(g)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedGenre.toLowerCase() === g.toLowerCase()
                ? 'bg-amber-400 text-black shadow-md shadow-amber-500/20'
                : 'bg-[#0f131d] border border-[#232b3e] text-zinc-300 hover:text-white hover:border-zinc-500'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Series Grid */}
      {filteredSeries.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {filteredSeries.map((series) => (
            <div key={series.id} className="flex justify-center">
              <MediaCard item={series} aspectRatio="poster" />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#0a0d14] rounded-2xl border border-[#1b2234] mt-4">
          <Tv className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No series found in this genre</h3>
          <p className="text-xs text-zinc-400 mt-1">Try selecting another genre or clearing your filter.</p>
          <button
            onClick={() => setSelectedGenre('all')}
            className="mt-4 px-4 py-2 rounded-full text-xs font-semibold bg-amber-400 text-black"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
