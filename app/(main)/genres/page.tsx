import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllGenres, getAllMedia } from '@/lib/data/repository';
import { Compass, Film, Tv, Sparkles, ChevronRight } from 'lucide-react';
import { EmptyCatalogState } from '@/components/common/EmptyCatalogState';

export const metadata: Metadata = {
  title: 'Genres & Collections — Cineva',
  description: 'Explore Cineva films and series categorized by genres: Sci-Fi, Fantasy, Animation, Drama, Cyberpunk, and more.',
};

// Curated atmospheric imagery for genres
const GENRE_IMAGES: Record<string, string> = {
  'Sci-Fi': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
  'Fantasy': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
  'Animation': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
  'Cyberpunk': 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=800&auto=format&fit=crop',
  'Action': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
  'Drama': 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop',
  'Horror': 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800&auto=format&fit=crop',
  'Mystery': 'https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=800&auto=format&fit=crop',
  'Adventure': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
  'Experimental': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
  'Anthology': 'https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=800&auto=format&fit=crop',
  'Family': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
  'Thriller': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
};

export default async function GenresPage() {
  const genres = await getAllGenres();
  const allMedia = await getAllMedia();

  if (genres.length === 0) {
    return (
      <div className="pt-24 pb-20">
        <EmptyCatalogState type="genres" />
      </div>
    );
  }

  const genreCounts: Record<string, number> = {};
  genres.forEach((g) => {
    genreCounts[g] = allMedia.filter((m) =>
      m.genres.some((genre) => genre.toLowerCase() === g.toLowerCase())
    ).length;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      <div className="pb-8 border-b border-[#1b2234]">
        <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Compass className="w-4 h-4" />
          <span>Catalog Taxonomy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Explore by Genre
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Dive into original cinematic universes categorized by aesthetic, mood, and genre.
        </p>
      </div>

      {/* Genre Visual Cards Grid */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {genres.map((genre) => {
          const img =
            GENRE_IMAGES[genre] ||
            'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop';
          const count = genreCounts[genre] || 0;
          const slug = genre.toLowerCase().replace(/\s+/g, '-');

          return (
            <Link
              key={genre}
              href={`/genres/${slug}`}
              className="relative h-44 rounded-2xl overflow-hidden border border-[#232b3e] hover:border-amber-400/60 shadow-xl group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/10"
            >
              <Image
                src={img}
                alt={genre}
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent group-hover:via-black/40 transition-colors" />

              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-white tracking-tight group-hover:text-amber-300 transition-colors">
                      {genre}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {count} {count === 1 ? 'Title' : 'Titles'}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-amber-400 text-white group-hover:text-black flex items-center justify-center transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
