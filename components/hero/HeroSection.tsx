'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Plus, Check, Info, Volume2, VolumeX, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import { MediaItem } from '@/types/content';
import { useWatchlist } from '@/lib/hooks/useWatchlist';

interface HeroSectionProps {
  items: MediaItem[];
}

export function HeroSection({ items }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  const currentItem = items[currentIndex] || items[0];
  const inWatchlist = currentItem ? isInWatchlist(currentItem.slug) : false;

  // Auto-advance hero slides every 8 seconds if not paused
  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [items.length]);

  if (!currentItem) return null;

  const detailUrl = currentItem.type === 'movie' ? `/movie/${currentItem.slug}` : `/series/${currentItem.slug}`;
  const watchUrl = `/watch/${currentItem.slug}`;

  return (
    <section className="relative w-full h-[78vh] sm:h-[86vh] min-h-[550px] max-h-[900px] overflow-hidden select-none">
      {/* Backdrop Image with crossfade */}
      <div className="absolute inset-0">
        <Image
          src={currentItem.backdropUrl}
          alt={currentItem.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105 animate-in fade-in zoom-in-95 duration-1000"
        />

        {/* Cinematic Vignettes & Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07080b] via-[#07080b]/75 to-transparent w-full md:w-3/4 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080b] via-[#07080b]/30 to-transparent z-10" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-black/20 to-black/60 z-10" />
      </div>

      {/* Hero Content Information */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-14 sm:pb-20">
        <div className="max-w-2xl space-y-4">
          {/* Badge & Type indicator */}
          <div className="flex items-center space-x-2.5">
            {currentItem.isOriginal && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-amber-500 text-black shadow-lg shadow-amber-500/20">
                <Sparkles className="w-3 h-3 fill-black" />
                <span>Cineva Original</span>
              </span>
            )}
            {currentItem.isAiAssisted && (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-white/10 text-zinc-300 border border-white/10 backdrop-blur-sm">
                AI Enhanced
              </span>
            )}
            <span className="text-xs uppercase font-semibold tracking-wider text-amber-400">
              {currentItem.type === 'movie' ? 'Feature Film' : 'Original Series'}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] drop-shadow-md">
            {currentItem.title}
          </h1>

          {/* Tagline */}
          {currentItem.tagline && (
            <p className="text-sm sm:text-base text-amber-300/90 font-medium italic">
              "{currentItem.tagline}"
            </p>
          )}

          {/* Metadata Specs */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-zinc-300 font-medium">
            <span className="text-amber-400 font-bold">★ {currentItem.rating.toFixed(1)}</span>
            <span>•</span>
            <span className="text-white font-semibold">{currentItem.releaseYear}</span>
            <span>•</span>
            <span className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-white/10 text-white border border-white/15">
              {currentItem.maturityRating}
            </span>
            <span>•</span>
            <span>
              {currentItem.type === 'movie'
                ? `${Math.floor(currentItem.duration / 60)}h ${currentItem.duration % 60}m`
                : `${currentItem.seasons?.length || 1} Season${(currentItem.seasons?.length || 1) > 1 ? 's' : ''}`}
            </span>
            <span>•</span>
            <span className="text-zinc-400">{currentItem.genres.slice(0, 3).join(', ')}</span>
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-zinc-300 line-clamp-3 leading-relaxed max-w-xl text-shadow">
            {currentItem.description}
          </p>

          {/* Hero Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              href={watchUrl}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full font-bold text-sm sm:text-base bg-amber-400 hover:bg-amber-300 text-black shadow-xl shadow-amber-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="w-5 h-5 fill-black" />
              <span>Watch Now</span>
            </Link>

            <button
              onClick={() => toggleWatchlist(currentItem)}
              className={`inline-flex items-center space-x-2 px-5 py-3 rounded-full font-semibold text-sm sm:text-base border backdrop-blur-md transition-all hover:scale-105 active:scale-95 ${
                inWatchlist
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : 'bg-black/50 border-white/20 text-white hover:bg-black/70 hover:border-white'
              }`}
            >
              {inWatchlist ? (
                <>
                  <Check className="w-5 h-5 text-amber-400" />
                  <span>In Watchlist</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Watchlist</span>
                </>
              )}
            </button>

            <Link
              href={detailUrl}
              className="inline-flex items-center space-x-2 px-4 py-3 rounded-full font-medium text-sm text-zinc-300 bg-white/5 border border-white/15 hover:bg-white/10 hover:text-white backdrop-blur-md transition-all"
            >
              <Info className="w-5 h-5" />
              <span>More Info</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Carousel Navigation Pill Controls */}
      {items.length > 1 && (
        <div className="absolute bottom-6 right-4 sm:right-8 z-30 flex items-center space-x-2 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)}
            aria-label="Previous hero banner"
            className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-1.5 px-1">
            {items.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}: ${item.title}`}
                className={`transition-all duration-300 rounded-full ${
                  currentIndex === idx ? 'w-5 h-1.5 bg-amber-400' : 'w-1.5 h-1.5 bg-zinc-600 hover:bg-zinc-400'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % items.length)}
            aria-label="Next hero banner"
            className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
}
