import React from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getMovies, getSeries, getCategories } from '@/lib/data/repository';
import { getAdminSession } from '@/lib/auth/admin';
import { AdminStudioClient } from '@/components/admin/AdminStudioClient';

export const metadata: Metadata = {
  title: 'Cineva Studio — Content Administration',
  description: 'Manage movies, series, video CDN configurations, and category rails for Cineva platform.',
};

export default async function AdminPage() {
  const session = await getAdminSession();

  // Strict Protection: Require authenticated admin session
  if (!session) {
    redirect('/admin/login');
  }

  const movies = await getMovies();
  const series = await getSeries();
  const categories = await getCategories();

  return (
    <AdminStudioClient
      adminUser={session}
      initialMovies={movies}
      initialSeries={series}
      initialCategories={categories}
    />
  );
}
