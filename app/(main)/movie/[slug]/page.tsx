import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMovieBySlug, getRelatedMedia } from '@/lib/data/repository';
import { MovieDetailClient } from '@/components/detail/MovieDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const movie = await getMovieBySlug(slug);

  if (!movie) {
    return {
      title: 'Movie Not Found — Cineva',
    };
  }

  return {
    title: `${movie.title} (${movie.releaseYear}) — Watch on Cineva`,
    description: movie.description,
    openGraph: {
      title: `${movie.title} — Cineva: Stream with Comfortable`,
      description: movie.description,
      images: [
        {
          url: movie.backdropUrl,
          width: 1200,
          height: 630,
          alt: movie.title,
        },
      ],
    },
  };
}

export default async function MovieDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const movie = await getMovieBySlug(slug);

  if (!movie) {
    notFound();
  }

  const related = await getRelatedMedia(movie.slug, movie.genres, 6);

  return <MovieDetailClient movie={movie} relatedMovies={related} />;
}
