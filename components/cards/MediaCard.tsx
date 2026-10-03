'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Plus, Check, Info, Star } from 'lucide-react';
import { MediaItem } from '@/types/content';
import { useWatchlist } from '@/lib/hooks/useWatchlist';

interface MediaCardProps {
  item: MediaItem;
  aspectRatio?: 'poster' | 'landscape';
  priority?: boolean;
}

export function MediaCard({ item, aspectRatio = 'poster', priority = false }: MediaCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(item.slug);

  const detailUrl = item.type === 'movie' ? `/movie/${item.slug}` : `/series/${item.slug}`;
  const watchUrl = `/watch/${item.slug}`;

  const imageUrl = aspectRatio === 'landscape' ? item.backdropUrl : item.posterUrl;

  return (
    <div
      className="relative flex-none group select-none transition-all duration-300"
      style={{
        width: aspectRatio === 'landscape' ? '280px' : '185px',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative overflow-hidden rounded-xl bg-[#0f131d] border border-[#1b2234] transition-all duration-300 group-hover:border-amber-500/50 group-hover:shadow-2xl group-hover:shadow-amber-500/10 group-hover:-translate-y-1.5 ${
          aspectRatio === 'landscape' ? 'aspect-video' : 'aspect-[2/3]'
        }`}
      >
        {/* Poster / Backdrop Image */}
        <Image
          src={imageUrl}
          alt={item.title}
          fill
          sizes={aspectRatio === 'landscape' ? '280px' : '185px'}
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Subtle Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080b] via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          {item.isOriginal && (
            <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded bg-amber-500/90 text-black shadow-sm">
              Original
            </span>
          )}
          {item.rating && (
            <span className="ml-auto flex items-center space-x-1 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-bold text-amber-400 border border-white/10">
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              <span>{item.rating.toFixed(1)}</span>
            </span>
          )}
        </div>

        {/* Floating Quick Action Overlay on Hover */}
        <div
          className={`absolute inset-0 p-3 flex flex-col justify-end transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Quick Buttons */}
          <div className="flex items-center space-x-2 mb-2">
            <Link
              href={watchUrl}
              aria-label={`Play ${item.title}`}
              className="w-9 h-9 rounded-full bg-amber-400 hover:bg-amber-300 text-black flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
            >
              <Play className="w-4 h-4 fill-black ml-0.5" />
            </Link>

            <button
              onClick={(e) => {
                e.preventDefault();
                toggleWatchlist(item);
              }}
              title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
              className={`w-9 h-9 rounded-full border flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 active:scale-95 ${
                inWatchlist
                  ? 'bg-amber-500/20 border-amber-400 text-amber-400'
                  : 'bg-black/60 border-white/20 text-white hover:border-white'
              }`}
            >
              {inWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>

            <Link
              href={detailUrl}
              title="More Details"
              className="w-9 h-9 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center backdrop-blur-md hover:border-white transition-all hover:scale-110 ml-auto"
            >
              <Info className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick Specs on Hover */}
          <div className="text-[11px] text-zinc-300 flex items-center space-x-2 font-medium">
            <span className="text-white font-bold">{item.releaseYear}</span>
            <span>•</span>
            <span className="px-1 py-0.2 rounded text-[10px] bg-white/10 text-zinc-300 border border-white/10">
              {item.maturityRating}
            </span>
            <span>•</span>
            <span>
              {item.type === 'movie'
                ? `${Math.floor(item.duration / 60)}h ${item.duration % 60}m`
                : `${item.seasons?.length || 1} Season${(item.seasons?.length || 1) > 1 ? 's' : ''}`}
            </span>
          </div>

          <div className="text-[10px] text-zinc-400 mt-1 line-clamp-1">
            {item.genres.slice(0, 3).join(' • ')}
          </div>
        </div>
      </div>

      {/* Static Label below card */}
      <div className="mt-2 px-1">
        <Link href={detailUrl} className="block group-hover:text-amber-400 transition-colors">
          <h3 className="text-sm font-semibold text-white tracking-tight truncate">{item.title}</h3>
        </Link>
        <div className="flex items-center space-x-2 text-xs text-zinc-400 mt-0.5">
          <span>{item.releaseYear}</span>
          <span>•</span>
          <span className="truncate">{item.genres[0]}</span>
        </div>
      </div>
    </div>
  );
}
