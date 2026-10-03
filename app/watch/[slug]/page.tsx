import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMediaBySlug } from '@/lib/data/repository';
import { getVideoProvider } from '@/lib/video/provider';
import { VideoPlayer } from '@/components/player/VideoPlayer';
import { Episode } from '@/types/content';

interface WatchPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params, searchParams }: WatchPageProps): Promise<Metadata> {
  const { slug } = await params;
  const sp = await searchParams;
  const item = await getMediaBySlug(slug);

  if (!item) {
    return { title: 'Player — Cineva' };
  }

  let title = item.title;
  if (item.type === 'series' && sp.episodeId && item.seasons) {
    for (const season of item.seasons) {
      const ep = season.episodes.find((e) => e.id === sp.episodeId);
      if (ep) {
        title = `${item.title} — ${ep.title}`;
        break;
      }
    }
  }

  return {
    title: `Watching: ${title} — Cineva`,
    description: `Stream ${title} directly on Cineva with comfortable viewing and WebVTT subtitles.`,
  };
}

export default async function WatchPage({ params, searchParams }: WatchPageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const item = await getMediaBySlug(slug);

  if (!item) {
    notFound();
  }

  const provider = getVideoProvider();
  let streamUrl = '';
  let initialEpisode: Episode | undefined = undefined;
  let nextEpisode: Episode | undefined = undefined;
  let subtitles = item.subtitles || [];

  if (item.type === 'movie') {
    const playback = await provider.resolvePlaybackSource(item.id, item.videoUrl);
    streamUrl = playback.streamUrl;
  } else {
    // Series: locate selected episode or default to S1:E1
    const seasons = item.seasons || [];
    const episodeId = typeof sp.episodeId === 'string' ? sp.episodeId : undefined;

    let targetEp: Episode | undefined;
    let nextEp: Episode | undefined;

    // Flatten episodes for sequential search
    const allEpisodes: Episode[] = [];
    seasons.forEach((season) => {
      season.episodes.forEach((ep) => allEpisodes.push(ep));
    });

    if (episodeId) {
      const epIndex = allEpisodes.findIndex((e) => e.id === episodeId);
      if (epIndex >= 0) {
        targetEp = allEpisodes[epIndex];
        if (epIndex + 1 < allEpisodes.length) {
          nextEp = allEpisodes[epIndex + 1];
        }
      }
    }

    if (!targetEp && allEpisodes.length > 0) {
      targetEp = allEpisodes[0];
      if (allEpisodes.length > 1) {
        nextEp = allEpisodes[1];
      }
    }

    if (targetEp) {
      initialEpisode = targetEp;
      nextEpisode = nextEp;
      const playback = await provider.resolvePlaybackSource(targetEp.id, targetEp.videoUrl);
      streamUrl = playback.streamUrl;
      if (targetEp.subtitles && targetEp.subtitles.length > 0) {
        subtitles = targetEp.subtitles;
      }
    } else {
      // Fallback
      streamUrl = item.backdropUrl;
    }
  }

  return (
    <VideoPlayer
      item={item}
      initialEpisode={initialEpisode}
      nextEpisode={nextEpisode}
      streamUrl={streamUrl}
      subtitles={subtitles}
    />
  );
}
