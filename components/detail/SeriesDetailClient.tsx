'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Play, 
  Plus, 
  Check, 
  Star, 
  Calendar, 
  Tv, 
  Sparkles, 
  Clock, 
  Subtitles, 
  Volume2, 
  Share2, 
  Layers 
} from 'lucide-react';
import { Series, Episode, MediaItem } from '@/types/content';
import { useWatchlist } from '@/lib/hooks/useWatchlist';
import { useWatchProgress } from '@/lib/hooks/useWatchProgress';
import { ContentRail } from '@/components/rails/ContentRail';

interface SeriesDetailClientProps {
  series: Series;
  relatedSeries: MediaItem[];
}

export function SeriesDetailClient({ series, relatedSeries }: SeriesDetailClientProps) {
  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState<number>(1);
  const [copiedToast, setCopiedToast] = useState(false);

  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { getProgressForContent } = useWatchProgress();
  const inWatchlist = isInWatchlist(series.slug);

  const seasons = series.seasons || [];
  const currentSeason = seasons.find((s) => s.seasonNumber === selectedSeasonNumber) || seasons[0];
  const episodes = currentSeason?.episodes || [];
  const firstEpisode = episodes[0];

  const playFirstEpisodeUrl = firstEpisode
    ? `/watch/${series.slug}?episodeId=${firstEpisode.id}`
    : `/watch/${series.slug}`;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Backdrop Header */}
      <div className="relative w-full h-[65vh] min-h-[480px] max-h-[700px] overflow-hidden">
        <Image
          src={series.backdropUrl}
          alt={series.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#07080b] via-[#07080b]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07080b] via-[#07080b]/70 to-transparent" />
      </div>

      {/* Main Detail Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 sm:-mt-64 z-20">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Poster Column */}
          <div className="flex-none w-48 sm:w-64 lg:w-72 mx-auto md:mx-0">
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border border-[#232b3e] shadow-2xl bg-[#0f131d] group">
              <Image
                src={series.posterUrl}
                alt={series.title}
                fill
                priority
                sizes="(max-width: 768px) 192px, 288px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <Link
                  href={playFirstEpisodeUrl}
                  className="w-full py-2.5 rounded-xl bg-amber-400 text-black font-bold text-xs flex items-center justify-center space-x-1.5 shadow-lg"
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  <span>Start Season 1</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Series Meta Info */}
          <div className="flex-1 space-y-6 text-zinc-300">
            <div className="flex flex-wrap items-center gap-2.5">
              {series.isOriginal && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-xs font-black uppercase tracking-wider bg-amber-500 text-black">
                  <Sparkles className="w-3 h-3 fill-black" />
                  <span>Cineva Original</span>
                </span>
              )}
              <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-[#161c2b] text-amber-400 border border-[#232b3e]">
                {series.maturityRating}
              </span>
              <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                Episodic Series
              </span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                {series.title}
              </h1>
              {series.tagline && (
                <p className="text-sm sm:text-base text-amber-300/90 font-medium italic mt-1.5">
                  "{series.tagline}"
                </p>
              )}
            </div>

            {/* Metadata Bar */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-zinc-300 py-1 border-y border-[#1b2234]">
              <div className="flex items-center space-x-1 text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{series.rating.toFixed(1)} / 10</span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                <span>{series.releaseYear}</span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <Layers className="w-3.5 h-3.5 text-zinc-400" />
                <span>{seasons.length} Season{seasons.length > 1 ? 's' : ''}</span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-1 text-zinc-400">
                <span>{series.genres.join(' • ')}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
              <Link
                href={playFirstEpisodeUrl}
                className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-full font-bold text-sm sm:text-base bg-amber-400 hover:bg-amber-300 text-black shadow-xl shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <Play className="w-5 h-5 fill-black" />
                <span>Play S1:E1</span>
              </Link>

              <button
                onClick={() => toggleWatchlist(series)}
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

              <button
                onClick={handleShare}
                className="p-3.5 rounded-full bg-[#0f131d] border border-[#232b3e] text-zinc-400 hover:text-white transition-colors relative"
                title="Share series"
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
              <h2 className="text-xs uppercase font-bold tracking-wider text-zinc-400">Series Overview</h2>
              <p className="text-sm sm:text-base text-zinc-200 leading-relaxed max-w-3xl">
                {series.description}
              </p>
            </div>

            {/* Creator & Subtitles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#1b2234] text-xs">
              <div>
                <span className="text-zinc-500 uppercase font-bold tracking-wider block mb-1">
                  Creator / Studio
                </span>
                <span className="text-white font-semibold text-sm">{series.creator}</span>
              </div>

              <div>
                <span className="text-zinc-500 uppercase font-bold tracking-wider block mb-1">
                  Cast & Voices
                </span>
                <span className="text-zinc-200 font-medium">{series.cast.join(', ')}</span>
              </div>

              <div>
                <span className="text-zinc-500 uppercase font-bold tracking-wider block mb-1">
                  Subtitles
                </span>
                <div className="flex items-center space-x-1.5 text-zinc-300">
                  <Subtitles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Bahasa Indonesia, English</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Episode Guide Section */}
        <div className="mt-16 sm:mt-20 pt-8 border-t border-[#1b2234]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Episodes</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {currentSeason?.title || `Season ${selectedSeasonNumber}`}
              </p>
            </div>

            {/* Season Selector Tabs */}
            {seasons.length > 1 && (
              <div className="flex items-center space-x-2 bg-[#0f131d] border border-[#232b3e] p-1 rounded-xl">
                {seasons.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSeasonNumber(s.seasonNumber)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedSeasonNumber === s.seasonNumber
                        ? 'bg-amber-400 text-black shadow-md'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Season {s.seasonNumber}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Episode Cards Grid/List */}
          <div className="space-y-4">
            {episodes.map((ep) => {
              const watchEpisodeUrl = `/watch/${series.slug}?episodeId=${ep.id}`;
              const progress = getProgressForContent(series.slug, ep.id);

              return (
                <div
                  key={ep.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 rounded-2xl bg-[#0b0e16] border border-[#1b2234] hover:border-amber-500/40 transition-all group gap-4"
                >
                  <div className="flex items-start sm:items-center space-x-4 w-full sm:w-auto">
                    {/* Thumbnail */}
                    <div className="relative flex-none w-32 sm:w-44 aspect-video rounded-xl overflow-hidden bg-[#07080b] border border-white/5">
                      <Image
                        src={ep.thumbnailUrl}
                        alt={ep.title}
                        fill
                        sizes="176px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Link
                        href={watchEpisodeUrl}
                        className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-3.5 h-3.5 fill-black ml-0.5" />
                        </div>
                      </Link>

                      {/* Watched progress bar on thumbnail */}
                      {progress && progress.percentage > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
                          <div
                            className="h-full bg-amber-400"
                            style={{ width: `${progress.percentage}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                          EP {ep.episodeNumber}
                        </span>
                        <span>•</span>
                        <span className="text-xs text-zinc-400 flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{ep.duration}m</span>
                        </span>
                      </div>
                      <Link href={watchEpisodeUrl} className="block group-hover:text-amber-400 transition-colors">
                        <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                          {ep.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-zinc-400 line-clamp-2 max-w-xl leading-relaxed">
                        {ep.description}
                      </p>
                    </div>
                  </div>

                  {/* Play Action Button on Right */}
                  <div className="self-end sm:self-center shrink-0">
                    <Link
                      href={watchEpisodeUrl}
                      className="px-4 py-2 rounded-xl bg-[#161c2b] border border-[#232b3e] text-xs font-semibold text-zinc-200 group-hover:bg-amber-400 group-hover:text-black group-hover:border-amber-400 transition-all flex items-center space-x-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{progress ? 'Resume' : 'Play'}</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Related Series Rail */}
        {relatedSeries.length > 0 && (
          <div className="mt-20">
            <ContentRail
              title="More Series Like This"
              description="Explore other sagas and universes"
              items={relatedSeries}
              aspectRatio="poster"
            />
          </div>
        )}
      </div>
    </div>
  );
}
