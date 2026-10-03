import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllGenres, getMediaByGenre } from '@/lib/data/repository';
import { MediaCard } from '@/components/cards/MediaCard';
import { ArrowLeft, Compass } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const genreTitle = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${genreTitle} Movies & Series — Cineva`,
    description: `Browse all ${genreTitle} titles on Cineva: Stream with Comfortable.`,
  };
}

export default async function GenreDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const genres = await getAllGenres();

  // Find matching genre ignoring case and dashes
  const matchedGenre = genres.find(
    (g) => g.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
  );

  if (!matchedGenre) {
    notFound();
  }

  const items = await getMediaByGenre(matchedGenre);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      {/* Back button */}
      <div className="mb-4">
        <Link
          href="/genres"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-zinc-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Genres</span>
        </Link>
      </div>

      <div className="pb-8 border-b border-[#1b2234]">
        <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Compass className="w-4 h-4" />
          <span>Genre Collection</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          {matchedGenre}
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          {items.length} {items.length === 1 ? 'title' : 'titles'} in this collection
        </p>
      </div>

      {/* Grid */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
        {items.map((item) => (
          <div key={item.id} className="flex justify-center">
            <MediaCard item={item} aspectRatio="poster" />
          </div>
        ))}
      </div>
    </div>
  );
}
