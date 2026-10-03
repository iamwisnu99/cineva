import React from 'react';
import Link from 'next/link';
import { Film, Tv, Sparkles, Compass } from 'lucide-react';

interface EmptyCatalogStateProps {
  type?: 'all' | 'movies' | 'series' | 'genres';
  title?: string;
  description?: string;
}

export function EmptyCatalogState({
  type = 'all',
  title,
  description,
}: EmptyCatalogStateProps) {
  const getDefaultTitle = () => {
    switch (type) {
      case 'movies':
        return 'Belum Ada Film Tersedia';
      case 'series':
        return 'Belum Ada Serial TV Tersedia';
      case 'genres':
        return 'Koleksi Genre Segera Hadir';
      default:
        return 'Katalog Sedang Diperbarui';
    }
  };

  const getDefaultDesc = () => {
    switch (type) {
      case 'movies':
        return 'Saat ini belum ada film yang ditayangkan. Kami sedang menyiapkan kurasi film-film pilihan terbaik untuk Anda.';
      case 'series':
        return 'Saat ini belum ada serial TV yang ditayangkan. Serial dan episode terbaru akan segera hadir.';
      case 'genres':
        return 'Koleksi genre sedang dalam penataan kurasi. Silakan kembali beberapa saat lagi untuk menjelajahi tayangan favorit Anda.';
      default:
        return 'Katalog konten Cineva saat ini sedang dalam proses kurasi dan pembaruan. Nantikan penayangan judul-judul pilihan segera.';
    }
  };

  const displayTitle = title || getDefaultTitle();
  const displayDesc = description || getDefaultDesc();

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-16 sm:py-24 animate-in fade-in zoom-in-95 duration-300">
      <div className="relative rounded-3xl bg-[#0a0d14]/90 border border-[#1b2234] p-8 sm:p-12 overflow-hidden shadow-2xl backdrop-blur-xl text-center">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 space-y-5">
          {/* Header Icon */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mx-auto shadow-inner shadow-amber-500/10">
            {type === 'movies' ? (
              <Film className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />
            ) : type === 'series' ? (
              <Tv className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />
            ) : type === 'genres' ? (
              <Compass className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />
            ) : (
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />
            )}
          </div>

          {/* Heading & Subtitle */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {displayTitle}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
              {displayDesc}
            </p>
          </div>

          {/* Navigation Action Pills */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-full text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-black shadow-md transition-all hover:scale-105 active:scale-95"
            >
              Beranda
            </Link>
            {type !== 'movies' && (
              <Link
                href="/movies"
                className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#161c2b] hover:bg-[#1f273b] text-white border border-[#232b3e] transition-all hover:scale-105 active:scale-95"
              >
                Katalog Film
              </Link>
            )}
            {type !== 'series' && (
              <Link
                href="/series"
                className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#161c2b] hover:bg-[#1f273b] text-white border border-[#232b3e] transition-all hover:scale-105 active:scale-95"
              >
                Katalog Serial TV
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
