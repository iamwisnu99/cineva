'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Play, 
  Plus, 
  Check, 
  Star, 
  Clock, 
  Calendar, 
  Film, 
  Sparkles, 
  Globe, 
  Volume2, 
  Subtitles, 
  Share2, 
  X 
} from 'lucide-react';
import { Movie, MediaItem } from '@/types/content';
import { useWatchlist } from '@/lib/hooks/useWatchlist';
import { ContentRail } from '@/components/rails/ContentRail';

interface MovieDetailClientProps {
  movie: Movie;
  relatedMovies: MediaItem[];
}

export function MovieDetailClient({ movie, relatedMovies }: MovieDetailClientProps) {
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(movie.slug);

  const watchUrl = `/watch/${movie.slug}`;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Backdrop Header */}
      <div className="relative w-full h-[65vh] min-h-[480px] max-h-[700px] overflow-hidden">
        <Image
          src={movie.backdropUrl}
          alt={movie.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />

        {/* Cinematic Vignette Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080b] via-[#07080b]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07080b] via-[#07080b]/70 to-transparent" />
      </div>

      {/* Main Detail Container (Floating over backdrop) */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 sm:-mt-64 z-20">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Poster Column */}
          <div className="flex-none w-48 sm:w-64 lg:w-72 mx-auto md:mx-0">
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border border-[#232b3e] shadow-2xl bg-[#0f131d] group">
              <Image
                src={movie.posterUrl}
                alt={movie.title}
                fill
                priority
                sizes="(max-width: 768px) 192px, 288px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <Link
                  href={watchUrl}
                  className="w-full py-2.5 rounded-xl bg-amber-400 text-black font-bold text-xs flex items-center justify-center space-x-1.5 shadow-lg"
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  <span>Start Film</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Details & Information Column */}
          <div className="flex-1 space-y-6 text-zinc-300">
            {/* Badges & Type */}
            <div className="flex flex-wrap items-center gap-2.5">
              {movie.isOriginal && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-xs font-black uppercase tracking-wider bg-amber-500 text-black">
                  <Sparkles className="w-3 h-3 fill-black" />
                  <span>Cineva Original</span>
                </span>
              )}
              {movie.isAiAssisted && (
                <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-white/10 text-zinc-300 border border-white/10">
                  AI Enhanced
                </span>
              )}
              <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-[#161c2b] text-amber-400 border border-[#232b3e]">
                {movie.maturityRating}
              </span>
              <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                Feature Movie
              </span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-sm sm:text-base text-amber-300/90 font-medium italic mt-1.5">
                  "{movie.tagline}"
                </p>
              )}
            </div>

            {/* Metadata Bar */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-zinc-300 py-1 border-y border-[#1b2234]">
              <div className="flex items-center space-x-1 text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{movie.rating.toFixed(1)} / 10</span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                <span>{movie.releaseYear}</span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-1 text-zinc-400">
                <span>{movie.genres.join(' • ')}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
              <Link
                href={watchUrl}
                className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-full font-bold text-sm sm:text-base bg-amber-400 hover:bg-amber-300 text-black shadow-xl shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <Play className="w-5 h-5 fill-black" />
                <span>Watch Now</span>
              </Link>

              <button
                onClick={() => toggleWatchlist(movie)}
                className={`inline-flex items-center space-x-2 px-5 py-3.5 rounded-full font-semibold text-sm border backdrop-blur-md transition-all hover:scale-105 active:scale-95 ${
                  inWatchlist
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-[#0f131d] border-[#232b3e] text-white hover:border-white'
                }`}
              >
                {inWatchlist ? (
                  <>
                    <Check className="w-4 h-4 text-amber-400" />
                    <span>In Watchlist</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add to Watchlist</span>
                  </>
                )}
              </button>

              {movie.trailerUrl && (
                <button
                  onClick={() => setShowTrailerModal(true)}
                  className="inline-flex items-center space-x-2 px-4 py-3.5 rounded-full font-medium text-sm text-zinc-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all"
                >
                  <Film className="w-4 h-4 text-amber-400" />
                  <span>Trailer</span>
                </button>
              )}

              <button
                onClick={handleShare}
                className="p-3.5 rounded-full bg-[#0f131d] border border-[#232b3e] text-zinc-400 hover:text-white transition-colors relative"
                title="Share title"
              >
                <Share2 className="w-4 h-4" />
                {copiedToast && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-amber-400 text-black text-[10px] font-bold rounded shadow-md whitespace-nowrap">
                    Link Copied!
                  </span>
                )}
              </button>
            </div>

            {/* Synopsis */}
            <div className="space-y-2">
              <h2 className="text-xs uppercase font-bold tracking-wider text-zinc-400">Synopsis</h2>
              <p className="text-sm sm:text-base text-zinc-200 leading-relaxed max-w-3xl">
                {movie.description}
              </p>
            </div>

            {/* Cast & Crew Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-[#1b2234] text-xs">
              <div>
                <span className="text-zinc-500 uppercase font-bold tracking-wider block mb-1">
                  Director / Creator
                </span>
                <span className="text-white font-semibold text-sm">{movie.director}</span>
              </div>

              <div>
                <span className="text-zinc-500 uppercase font-bold tracking-wider block mb-1">
                  Starring
                </span>
                <span className="text-zinc-200 font-medium">{movie.cast.join(', ')}</span>
              </div>

              <div>
                <span className="text-zinc-500 uppercase font-bold tracking-wider block mb-1">
                  Subtitles Available
                </span>
                <div className="flex items-center space-x-1.5 text-zinc-300">
                  <Subtitles className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {movie.subtitles.map((s) => s.label).join(', ') || 'Bahasa Indonesia, English'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-zinc-500 uppercase font-bold tracking-wider block mb-1">
                  Audio & Streaming Tech
                </span>
                <div className="flex items-center space-x-1.5 text-zinc-300">
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Stereo / 5.1 • Direct CDN HTML5</span>
                </div>
              </div>

              <div>
                <span className="text-zinc-500 uppercase font-bold tracking-wider block mb-1">
                  Audio Languages
                </span>
                <span className="text-zinc-200 font-medium">
                  {movie.languages.join(', ')}
                </span>
              </div>

              <div>
                <span className="text-zinc-500 uppercase font-bold tracking-wider block mb-1">
                  Quality Tier
                </span>
                <span className="text-amber-400 font-semibold">
                  Ultra HD 1080p
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Movies Rail */}
      {relatedMovies.length > 0 && (
        <div className="mt-20">
          <ContentRail
            title="More Like This"
            description="Recommended based on similar themes and genres"
            items={relatedMovies}
            aspectRatio="poster"
          />
        </div>
      )}

      {/* Trailer Modal */}
      {showTrailerModal && movie.trailerUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden border border-[#232b3e] shadow-2xl">
            <button
              onClick={() => setShowTrailerModal(false)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/70 text-zinc-400 hover:text-white border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
            <video
              src={movie.trailerUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
