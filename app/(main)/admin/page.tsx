import React from 'react';
import { Metadata } from 'next';
import { getMovies, getSeries, getCategories } from '@/lib/data/repository';
import { AdminStudioClient } from '@/components/admin/AdminStudioClient';

export const metadata: Metadata = {
  title: 'Cineva Studio — Content Administration',
  description: 'Manage movies, series, video CDN configurations, and category rails for Cineva platform.',
};

export default async function AdminPage() {
  const movies = await getMovies();
  const series = await getSeries();
  const categories = await getCategories();

  return (
    <AdminStudioClient
      initialMovies={movies}
      initialSeries={series}
      initialCategories={categories}
    />
  );
}
