import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSeriesBySlug, getRelatedMedia } from '@/lib/data/repository';
import { SeriesDetailClient } from '@/components/detail/SeriesDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const series = await getSeriesBySlug(slug);

  if (!series) {
    return {
      title: 'Series Not Found — Cineva',
    };
  }

  return {
    title: `${series.title} — Watch on Cineva`,
    description: series.description,
    openGraph: {
      title: `${series.title} — Cineva Originals`,
      description: series.description,
      images: [
        {
          url: series.backdropUrl,
          width: 1200,
          height: 630,
          alt: series.title,
        },
      ],
    },
  };
}

export default async function SeriesDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const series = await getSeriesBySlug(slug);

  if (!series) {
    notFound();
  }

  const related = await getRelatedMedia(series.slug, series.genres, 6);

  return <SeriesDetailClient series={series} relatedSeries={related} />;
}
