import React from 'react';
import { Metadata } from 'next';
import { getAllMedia } from '@/lib/data/repository';
import { SearchClient } from '@/components/search/SearchClient';

export const metadata: Metadata = {
  title: 'Search — Cineva | Discover Films & Series',
  description: 'Search through Cineva original movies, series, episodes, genres, and directors.',
};

export default async function SearchPage() {
  const allMedia = await getAllMedia();

  return <SearchClient initialMedia={allMedia} />;
}
