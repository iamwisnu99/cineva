import React from 'react';
import Link from 'next/link';
import { Film, Tv, PlusCircle, FileCode, Sparkles, CheckCircle2 } from 'lucide-react';

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
        return 'Belum Ada Kategori Genre';
      default:
        return 'Katalog Konten Masih Kosong';
    }
  };

  const getDefaultDesc = () => {
    switch (type) {
      case 'movies':
        return 'Katalog film saat ini masih kosong dan bersih. Anda dapat menambahkan data film pertama Anda secara hardcoded di file lib/data/mockData.ts pada array SAMPLE_MOVIES.';
      case 'series':
        return 'Katalog serial TV saat ini masih kosong dan bersih. Anda dapat menambahkan data serial TV pertama Anda secara hardcoded di file lib/data/mockData.ts pada array SAMPLE_SERIES.';
      case 'genres':
        return 'Kategori genre akan otomatis terdeteksi dan dikelompokkan segera setelah Anda menambahkan film atau serial TV yang memiliki label genre di lib/data/mockData.ts.';
      default:
        return 'Seluruh data mock film dan serial TV telah dibersihkan. Platform Cineva kini siap diisi dengan konten baru sesuai kebutuhan Anda.';
    }
  };

  const displayTitle = title || getDefaultTitle();
  const displayDesc = description || getDefaultDesc();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-16 sm:py-24 animate-in fade-in zoom-in-95 duration-300">
      <div className="relative rounded-3xl bg-[#0a0d14]/90 border border-[#1b2234] p-8 sm:p-12 overflow-hidden shadow-2xl backdrop-blur-xl">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 text-center max-w-2xl mx-auto space-y-4">
          {/* Header Icon */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mx-auto shadow-inner shadow-amber-500/10">
            {type === 'movies' ? (
              <Film className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />
            ) : type === 'series' ? (
              <Tv className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />
            ) : (
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />
            )}
          </div>

          {/* Heading & Subtitle */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {displayTitle}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
              {displayDesc}
            </p>
          </div>

          {/* Hardcoded Instructions Card */}
          <div className="text-left rounded-2xl bg-[#07090e] border border-[#232b3e] p-5 sm:p-6 mt-6 space-y-3.5 shadow-lg">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <FileCode className="w-4 h-4" />
              <span>Lokasi Menambahkan Data Hardcoded</span>
            </div>

            <div className="bg-[#0f131d] px-3.5 py-2 rounded-xl border border-[#1b2234] font-mono text-xs text-amber-300 select-all overflow-x-auto">
              lib/data/mockData.ts
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-zinc-300">
              <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-white/5 border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">Film (Movies):</strong>
                  <span className="text-zinc-400">Tambahkan object ke array </span>
                  <code className="text-amber-300 font-mono text-[11px]">SAMPLE_MOVIES</code>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-white/5 border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">Serial TV (Series):</strong>
                  <span className="text-zinc-400">Tambahkan object ke array </span>
                  <code className="text-amber-300 font-mono text-[11px]">SAMPLE_SERIES</code>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-zinc-500 leading-normal pt-1">
              💡 <em>Tips: Template schema lengkap beserta contoh field telah disediakan di dalam file <code className="text-zinc-400 font-mono">mockData.ts</code> untuk memudahkan Anda copy-paste.</em>
            </p>
          </div>

          {/* Navigation Action Pills */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-full text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-black shadow-md transition-all hover:scale-105 active:scale-95"
            >
              Beranda
            </Link>
            <Link
              href="/movies"
              className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#161c2b] hover:bg-[#1f273b] text-white border border-[#232b3e] transition-all hover:scale-105 active:scale-95"
            >
              Katalog Film
            </Link>
            <Link
              href="/series"
              className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#161c2b] hover:bg-[#1f273b] text-white border border-[#232b3e] transition-all hover:scale-105 active:scale-95"
            >
              Katalog Serial TV
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
