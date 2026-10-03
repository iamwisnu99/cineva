'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, X, Clock } from 'lucide-react';
import { useWatchProgress } from '@/lib/hooks/useWatchProgress';

export function ContinueWatchingRail() {
  const { progressList, isLoaded, removeProgress } = useWatchProgress();

  if (!isLoaded || !progressList || progressList.length === 0) {
    return null;
  }

  const formatRemainingTime = (progressSec: number, durationSec: number) => {
    const remaining = Math.max(0, durationSec - progressSec);
    const mins = Math.floor(remaining / 60);
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      return `${hrs}h ${remainingMins}m remaining`;
    }
    return `${mins}m remaining`;
  };

  return (
    <section className="relative my-8 sm:my-10 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center space-x-2">
            <span>Continue Watching</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">Resume where you left off</p>
        </div>
      </div>

      <div className="flex space-x-4 overflow-x-auto hide-scrollbar scroll-smooth py-2 px-1">
        {progressList.map((progress) => {
          const watchUrl = `/watch/${progress.contentSlug}${
            progress.episodeId ? `?episodeId=${progress.episodeId}` : ''
          }`;

          return (
            <div
              key={`${progress.contentSlug}-${progress.episodeId || 'movie'}`}
              className="relative flex-none group w-[260px] sm:w-[290px] select-none"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden bg-[#0f131d] border border-[#1b2234] group-hover:border-amber-500/50 transition-all duration-300 group-hover:shadow-xl">
                <Image
                  src={progress.backdropUrl || progress.posterUrl}
                  alt={progress.title}
                  fill
                  sizes="290px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeProgress(progress.contentSlug, progress.episodeId);
                  }}
                  title="Remove from history"
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black text-zinc-400 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Center Play Button Overlay */}
                <Link
                  href={watchUrl}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-11 h-11 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-lg group-hover:scale-110 active:scale-95 transition-transform">
                    <Play className="w-5 h-5 fill-black ml-0.5" />
                  </div>
                </Link>

                {/* Content info & Progress Bar at Bottom of Image */}
                <div className="absolute bottom-0 left-0 right-0 p-3 pointer-events-none">
                  <div className="flex items-center justify-between text-[11px] text-zinc-300 mb-1.5 font-medium">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{formatRemainingTime(progress.progressSeconds, progress.durationSeconds)}</span>
                    </span>
                    <span className="text-amber-400 font-bold">{progress.percentage}%</span>
                  </div>

                  {/* Progress track */}
                  <div className="w-full h-1.5 bg-zinc-700/80 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                      style={{ width: `${Math.min(100, Math.max(5, progress.percentage))}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Title & Episode metadata below */}
              <div className="mt-2 px-1">
                <Link href={watchUrl} className="block group-hover:text-amber-400 transition-colors">
                  <h3 className="text-sm font-semibold text-white tracking-tight truncate">
                    {progress.title}
                  </h3>
                </Link>
                {progress.episodeTitle && (
                  <p className="text-xs text-zinc-400 truncate">
                    S{progress.seasonNumber || 1}:E{progress.episodeNumber || 1} • {progress.episodeTitle}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
