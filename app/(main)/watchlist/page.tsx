import React from 'react';
import { Metadata } from 'next';
import { getAllMedia } from '@/lib/data/repository';
import { WatchlistClient } from '@/components/watchlist/WatchlistClient';

export const metadata: Metadata = {
  title: 'My Watchlist — Cineva | Saved Films & Series',
  description: 'Manage and stream your saved original films and series on Cineva.',
};

export default async function WatchlistPage() {
  const allMedia = await getAllMedia();

  return <WatchlistClient allMedia={allMedia} />;
}
