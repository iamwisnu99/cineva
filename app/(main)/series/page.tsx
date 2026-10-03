import React from 'react';
import { Metadata } from 'next';
import { getSeries, getAllGenres } from '@/lib/data/repository';
import { SeriesCatalogClient } from '@/components/catalog/SeriesCatalogClient';

export const metadata: Metadata = {
  title: 'Series — Cineva | Original Episodic Sagas',
  description: 'Stream multi-episode original series, animated chronicles, and sci-fi anthologies on Cineva.',
};

export default async function SeriesPage() {
  const series = await getSeries();
  const genres = await getAllGenres();

  return <SeriesCatalogClient initialSeries={series} genres={genres} />;
}
