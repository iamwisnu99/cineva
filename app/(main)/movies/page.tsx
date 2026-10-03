import React from 'react';
import { Metadata } from 'next';
import { getMovies, getAllGenres } from '@/lib/data/repository';
import { MovieCatalogClient } from '@/components/catalog/MovieCatalogClient';

export const metadata: Metadata = {
  title: 'Movies — Cineva | Original Feature Films',
  description: 'Stream original feature films, AI-assisted animations, and visionary sci-fi works on Cineva.',
};

export default async function MoviesPage() {
  const movies = await getMovies();
  const genres = await getAllGenres();

  return <MovieCatalogClient initialMovies={movies} genres={genres} />;
}
