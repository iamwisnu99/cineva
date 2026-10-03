'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Film, 
  Tv, 
  Layers, 
  Plus, 
  Server, 
  Database, 
  Check, 
  ExternalLink, 
  Play, 
  Settings2, 
  Sparkles,
  Save,
  AlertCircle,
  LogOut,
  UserCheck,
  Trash2,
  Loader2
} from 'lucide-react';
import { Movie, Series, Category } from '@/types/content';
import { AdminUser } from '@/lib/auth/admin';

interface AdminStudioClientProps {
  adminUser: AdminUser;
  initialMovies: Movie[];
  initialSeries: Series[];
  initialCategories: Category[];
}

export function AdminStudioClient({
  adminUser,
  initialMovies,
  initialSeries,
  initialCategories,
}: AdminStudioClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'catalog' | 'new-title' | 'providers' | 'categories'>('catalog');
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [seriesList, setSeriesList] = useState<Series[]>(initialSeries);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saveNotice, setSaveNotice] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // New title form state
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newType, setNewType] = useState<'movie' | 'series'>('movie');
  const [newDesc, setNewDesc] = useState('');
  const [newYear, setNewYear] = useState('2026');
  const [newDuration, setNewDuration] = useState('95');
  const [newGenres, setNewGenres] = useState('Sci-Fi, Action, Drama');
  const [newPoster, setNewPoster] = useState('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop');
  const [newBackdrop, setNewBackdrop] = useState('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop');
  const [newVideoUrl, setNewVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4');
  const [newDirector, setNewDirector] = useState(adminUser.nama || 'Prima Wisnu');

  // Video Provider Settings
  const [selectedProvider, setSelectedProvider] = useState<'cdn' | 'r2' | 'bunny' | 'gdrive'>('cdn');
  const [cdnBaseUrl, setCdnBaseUrl] = useState('https://stream.cineva.local/cdn');
  const [subtitleCdnUrl, setSubtitleCdnUrl] = useState('https://subtitles.cineva.local');

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      setIsLoggingOut(false);
    }
  };

  const handleCreateTitle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSaving(true);
    setErrorMessage('');

    const generatedSlug = newSlug.trim() || newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const genresArray = newGenres.split(',').map((g) => g.trim()).filter(Boolean);

    try {
      if (newType === 'movie') {
        const payload = {
          title: newTitle.trim(),
          slug: generatedSlug,
          description: newDesc || 'Koleksi film sinematik pilihan Cineva.',
          releaseYear: parseInt(newYear) || 2026,
          duration: parseInt(newDuration) || 90,
          genres: genresArray.length > 0 ? genresArray : ['Sci-Fi'],
          cast: ['Cineva Ensemble'],
          director: newDirector || adminUser.nama || 'Prima Wisnu',
          rating: 9.0,
          maturityRating: '13+',
          languages: ['Bahasa Indonesia', 'English'],
          posterUrl: newPoster,
          backdropUrl: newBackdrop,
          videoUrl: newVideoUrl,
          subtitles: [
            { language: 'id', label: 'Bahasa Indonesia', src: '/subtitles/demo-id.vtt', default: true },
            { language: 'en', label: 'English', src: '/subtitles/demo-en.vtt' }
          ],
          featured: true,
          trending: true,
          isOriginal: true,
        };

        const res = await fetch('/api/admin/movies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Gagal menyimpan film ke database Supabase.');
        }

        setMovies([data.movie, ...movies.filter((m) => m.slug !== data.movie.slug)]);
        setSaveNotice(`Film "${data.movie.title}" berhasil disimpan permanen ke database Supabase!`);
      } else {
        const payload = {
          title: newTitle.trim(),
          slug: generatedSlug,
          description: newDesc || 'Koleksi serial TV pilihan Cineva.',
          releaseYear: parseInt(newYear) || 2026,
          genres: genresArray.length > 0 ? genresArray : ['Drama'],
          cast: ['Cineva Ensemble'],
          creator: newDirector || adminUser.nama || 'Prima Wisnu',
          rating: 9.0,
          maturityRating: '16+',
          languages: ['Bahasa Indonesia', 'English'],
          posterUrl: newPoster,
          backdropUrl: newBackdrop,
          featured: true,
          trending: true,
          isOriginal: true,
          seasons: [
            {
              seasonNumber: 1,
              title: 'Season 1',
              episodes: [
                {
                  episodeNumber: 1,
                  title: 'Episode 1',
                  description: newDesc || 'Episode 1 alur cerita awal.',
                  thumbnailUrl: newBackdrop,
                  videoUrl: newVideoUrl,
                  duration: parseInt(newDuration) || 45,
                  subtitles: [
                    { language: 'id', label: 'Bahasa Indonesia', src: '/subtitles/demo-id.vtt', default: true }
                  ]
                }
              ]
            }
          ]
        };

        const res = await fetch('/api/admin/series', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Gagal menyimpan serial ke database Supabase.');
        }

        setSeriesList([data.series, ...seriesList.filter((s) => s.slug !== data.series.slug)]);
        setSaveNotice(`Serial TV "${data.series.title}" berhasil disimpan permanen ke database Supabase!`);
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 5000);
      setNewTitle('');
      setNewSlug('');
      setNewDesc('');
      setActiveTab('catalog');
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan saat menyimpan ke database.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMovie = async (id: string, title: string) => {
    if (!confirm(`Hapus film "${title}" secara permanen dari database Supabase?`)) return;
    setDeletingId(id);
    setErrorMessage('');
    try {
      const res = await fetch(`/api/admin/movies?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal menghapus film.');
      }
      setMovies((prev) => prev.filter((m) => m.id !== id));
      setSaveNotice(`Film "${title}" berhasil dihapus dari database.`);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menghapus film.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteSeries = async (id: string, title: string) => {
    if (!confirm(`Hapus serial "${title}" secara permanen dari database Supabase?`)) return;
    setDeletingId(id);
    setErrorMessage('');
    try {
      const res = await fetch(`/api/admin/series?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal menghapus serial.');
      }
      setSeriesList((prev) => prev.filter((s) => s.id !== id));
      setSaveNotice(`Serial "${title}" berhasil dihapus dari database.`);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menghapus serial.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#1b2234]">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Cineva Studio • Authenticated Admin</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Production Control Center
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage your personal catalog, video CDN endpoints, WebVTT subtitle tracks, and category rails.
          </p>
        </div>

        {/* Admin Profile & Logout action */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center space-x-2.5 px-3.5 py-2 rounded-xl bg-[#0f131d] border border-[#232b3e]">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-white font-bold block">{adminUser.nama}</span>
              <span className="text-zinc-500 text-[10px] block">{adminUser.email}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 font-bold transition-colors disabled:opacity-50"
            title="Keluar dari sesi admin"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isLoggingOut ? 'Keluar...' : 'Logout'}</span>
          </button>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <div className="px-4 py-3 rounded-2xl bg-[#0f131d] border border-[#232b3e]">
          <span className="text-zinc-500 block text-xs">Total Movies</span>
          <span className="text-white text-xl font-black">{movies.length}</span>
        </div>
        <div className="px-4 py-3 rounded-2xl bg-[#0f131d] border border-[#232b3e]">
          <span className="text-zinc-500 block text-xs">Total Series</span>
          <span className="text-white text-xl font-black">{seriesList.length}</span>
        </div>
        <div className="px-4 py-3 rounded-2xl bg-[#0f131d] border border-[#232b3e]">
          <span className="text-zinc-500 block text-xs">Category Rails</span>
          <span className="text-amber-400 text-xl font-black">{initialCategories.length}</span>
        </div>
        <div className="px-4 py-3 rounded-2xl bg-[#0f131d] border border-[#232b3e]">
          <span className="text-zinc-500 block text-xs">Database Table</span>
          <span className="text-emerald-400 text-xs font-bold block mt-1">public.movies / series</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#1b2234] pt-8 pb-4 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'catalog'
              ? 'bg-amber-400 text-black shadow-md'
              : 'text-zinc-400 hover:text-white bg-[#0f131d] border border-[#232b3e]'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Catalog Inventory</span>
        </button>

        <button
          onClick={() => setActiveTab('new-title')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'new-title'
              ? 'bg-amber-400 text-black shadow-md'
              : 'text-zinc-400 hover:text-white bg-[#0f131d] border border-[#232b3e]'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Publish New Title</span>
        </button>

        <button
          onClick={() => setActiveTab('providers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'providers'
              ? 'bg-amber-400 text-black shadow-md'
              : 'text-zinc-400 hover:text-white bg-[#0f131d] border border-[#232b3e]'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>Video Storage / CDN Provider</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'categories'
              ? 'bg-amber-400 text-black shadow-md'
              : 'text-zinc-400 hover:text-white bg-[#0f131d] border border-[#232b3e]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Homepage Category Rails</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveNotice || 'Perubahan berhasil disimpan ke database Supabase!'}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Tab 1: Catalog Inventory */}
      {activeTab === 'catalog' && (
        <div className="mt-8 space-y-6">
          <div className="overflow-x-auto rounded-2xl border border-[#1b2234] bg-[#0a0d14]">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-[#0f131d] text-zinc-400 font-bold uppercase tracking-wider border-b border-[#1b2234]">
                <tr>
                  <th className="p-4">Title</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Year</th>
                  <th className="p-4">Genres</th>
                  <th className="p-4">Video Source</th>
                  <th className="p-4">Subtitles</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b2234]">
                {movies.map((m) => (
                  <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold text-white flex items-center space-x-2">
                      <span className="truncate max-w-xs">{m.title}</span>
                      {m.isOriginal && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          Original
                        </span>
                      )}
                    </td>
                    <td className="p-4 uppercase font-semibold text-zinc-400">Movie</td>
                    <td className="p-4">{m.releaseYear}</td>
                    <td className="p-4 text-zinc-400">{m.genres.slice(0, 2).join(', ')}</td>
                    <td className="p-4 text-zinc-400 font-mono text-[11px] truncate max-w-xs">
                      {m.videoUrl}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px] font-semibold">
                        {m.subtitles.length} Tracks (WebVTT)
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                      <Link
                        href={`/movie/${m.slug}`}
                        className="p-1.5 rounded-lg bg-[#161c2b] text-zinc-300 hover:text-white inline-block transition-colors"
                        title="Lihat halaman film"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/watch/${m.slug}`}
                        className="p-1.5 rounded-lg bg-amber-400 text-black hover:bg-amber-300 inline-block font-bold transition-colors"
                        title="Tonton di player"
                      >
                        <Play className="w-3.5 h-3.5 fill-black" />
                      </Link>
                      <button
                        onClick={() => handleDeleteMovie(m.id, m.title)}
                        disabled={deletingId === m.id}
                        className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 inline-block transition-colors disabled:opacity-50"
                        title="Hapus film dari database Supabase"
                      >
                        {deletingId === m.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}

                {seriesList.map((s) => (
                  <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold text-white flex items-center space-x-2">
                      <span className="truncate max-w-xs">{s.title}</span>
                      {s.isOriginal && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          Original
                        </span>
                      )}
                    </td>
                    <td className="p-4 uppercase font-semibold text-zinc-400">
                      Series ({s.seasons?.length || 1}S)
                    </td>
                    <td className="p-4">{s.releaseYear}</td>
                    <td className="p-4 text-zinc-400">{s.genres.slice(0, 2).join(', ')}</td>
                    <td className="p-4 text-zinc-400 font-mono text-[11px]">
                      {s.seasons?.[0]?.episodes?.length || 0} Episodes
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px] font-semibold">
                        {s.subtitles.length} Tracks (WebVTT)
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                      <Link
                        href={`/series/${s.slug}`}
                        className="p-1.5 rounded-lg bg-[#161c2b] text-zinc-300 hover:text-white inline-block transition-colors"
                        title="Lihat halaman serial"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/watch/${s.slug}`}
                        className="p-1.5 rounded-lg bg-amber-400 text-black hover:bg-amber-300 inline-block font-bold transition-colors"
                        title="Tonton di player"
                      >
                        <Play className="w-3.5 h-3.5 fill-black" />
                      </Link>
                      <button
                        onClick={() => handleDeleteSeries(s.id, s.title)}
                        disabled={deletingId === s.id}
                        className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 inline-block transition-colors disabled:opacity-50"
                        title="Hapus serial dari database Supabase"
                      >
                        {deletingId === s.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Publish New Title */}
      {activeTab === 'new-title' && (
        <form onSubmit={handleCreateTitle} className="mt-8 max-w-3xl space-y-6 bg-[#0a0d14] p-6 sm:p-8 rounded-2xl border border-[#1b2234]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1b2234]">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Publish Judul Baru ke Database Supabase</span>
            </h2>

            {/* Type selector toggle */}
            <div className="flex items-center space-x-2 bg-[#0f131d] p-1 rounded-xl border border-[#232b3e]">
              <button
                type="button"
                onClick={() => setNewType('movie')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  newType === 'movie'
                    ? 'bg-amber-400 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Film (Movie)</span>
              </button>
              <button
                type="button"
                onClick={() => setNewType('series')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  newType === 'series'
                    ? 'bg-amber-400 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Serial TV (Series)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                Judul {newType === 'movie' ? 'Film' : 'Serial'} *
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={newType === 'movie' ? 'e.g. Celestial Orbit' : 'e.g. Chronicles of Eldoria'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f131d] border border-[#232b3e] text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                URL Slug
              </label>
              <input
                type="text"
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                placeholder="auto-generated jika dikosongkan"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f131d] border border-[#232b3e] text-white text-xs focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                Tahun Rilis
              </label>
              <input
                type="number"
                value={newYear}
                onChange={(e) => setNewYear(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f131d] border border-[#232b3e] text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                {newType === 'movie' ? 'Durasi Film (Menit)' : 'Durasi Episode (Menit)'}
              </label>
              <input
                type="number"
                value={newDuration}
                onChange={(e) => setNewDuration(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f131d] border border-[#232b3e] text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
              Genres (Pisahkan dengan koma)
            </label>
            <input
              type="text"
              value={newGenres}
              onChange={(e) => setNewGenres(e.target.value)}
              placeholder="Action, Sci-Fi, Drama"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f131d] border border-[#232b3e] text-white text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
              Sinopsis & Deskripsi Cerita
            </label>
            <textarea
              rows={3}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Deskripsi cerita sinematik yang menarik..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f131d] border border-[#232b3e] text-white text-xs focus:outline-none focus:border-amber-400 leading-relaxed"
            />
          </div>

          <div className="space-y-4 pt-2 border-t border-[#1b2234]">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Tautan Media Video & Artwork Poster
            </h3>

            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                {newType === 'movie' ? 'Video Stream URL (MP4 / HLS CDN) *' : 'Video Stream Episode 1 (MP4 / HLS CDN) *'}
              </label>
              <input
                type="url"
                required
                value={newVideoUrl}
                onChange={(e) => setNewVideoUrl(e.target.value)}
                placeholder="https://your-cdn-or-r2.com/videos/content.mp4"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f131d] border border-[#232b3e] text-white text-xs focus:outline-none focus:border-amber-400 font-mono"
              />
              <p className="text-[11px] text-zinc-500 mt-1">
                Player memutar langsung dari CDN/R2 eksternal tanpa proxy bandwidth Vercel.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Poster Image URL (Vertikal ~2:3)
                </label>
                <input
                  type="url"
                  value={newPoster}
                  onChange={(e) => setNewPoster(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f131d] border border-[#232b3e] text-white text-xs focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Backdrop Banner URL (Landscape 16:9)
                </label>
                <input
                  type="url"
                  value={newBackdrop}
                  onChange={(e) => setNewBackdrop(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f131d] border border-[#232b3e] text-white text-xs focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => setActiveTab('catalog')}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-zinc-400 hover:text-white"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-full text-xs font-bold bg-amber-400 hover:bg-amber-300 text-black shadow-lg shadow-amber-500/20 flex items-center space-x-1.5 disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyimpan ke Supabase...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Publish ke Supabase Catalog</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Video Storage / CDN Providers */}
      {activeTab === 'providers' && (
        <div className="mt-8 max-w-3xl space-y-6 bg-[#0a0d14] p-6 sm:p-8 rounded-2xl border border-[#1b2234]">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Server className="w-4 h-4 text-amber-400" />
              <span>Video Provider & Storage Architecture Configuration</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Configure external media delivery endpoints per DETAILS.md Section 12-14.
            </p>
          </div>

          {/* Provider Select Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {[
              {
                id: 'cdn',
                title: 'Direct CDN / Custom Storage',
                desc: 'Client browser plays directly from public CDN bucket or origin.',
              },
              {
                id: 'r2',
                title: 'Cloudflare R2 Object Storage',
                desc: 'Zero-egress bandwidth object storage with custom streaming domain.',
              },
              {
                id: 'bunny',
                title: 'Bunny Stream CDN',
                desc: 'Edge video delivery with global transcoded caching.',
              },
              {
                id: 'gdrive',
                title: 'Google Drive (Dev Fallback)',
                desc: 'Testing fallback only. Subject to strict Google API quotas per Section 34.',
              },
            ].map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedProvider(p.id as any)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedProvider === p.id
                    ? 'bg-amber-500/10 border-amber-400 shadow-md'
                    : 'bg-[#0f131d] border-[#232b3e] hover:border-zinc-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{p.title}</h4>
                  {selectedProvider === p.id && <Check className="w-4 h-4 text-amber-400" />}
                </div>
                <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Provider details */}
          <div className="space-y-4 pt-4 border-t border-[#1b2234]">
            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                VIDEO_CDN_BASE_URL (Environment Variable)
              </label>
              <input
                type="text"
                value={cdnBaseUrl}
                onChange={(e) => setCdnBaseUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f131d] border border-[#232b3e] text-white text-xs font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                SUBTITLE_CDN_BASE_URL
              </label>
              <input
                type="text"
                value={subtitleCdnUrl}
                onChange={(e) => setSubtitleCdnUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f131d] border border-[#232b3e] text-white text-xs font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="p-4 rounded-xl bg-[#161c2b] border border-[#232b3e] text-xs text-zinc-300 space-y-1.5">
              <span className="font-bold text-amber-400 block">Core Architecture Guarantee:</span>
              <p className="leading-relaxed">
                Vercel Functions are strictly reserved for metadata APIs and search logic. All video streams and WebVTT subtitle files bypass serverless execution directly to the client browser.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Category Rails */}
      {activeTab === 'categories' && (
        <div className="mt-8 max-w-3xl space-y-4 bg-[#0a0d14] p-6 sm:p-8 rounded-2xl border border-[#1b2234]">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Data-Driven Homepage Rails</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Per DETAILS.md Section 6: Category rails are completely data-driven and can be reordered dynamically without frontend component changes.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            {initialCategories.map((cat, index) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#0f131d] border border-[#232b3e]"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-lg bg-zinc-800 text-amber-400 flex items-center justify-center font-bold text-xs">
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white">{cat.title}</h4>
                    <p className="text-[11px] text-zinc-400">{cat.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px] font-semibold">
                    {cat.contentSlugs.length} Items
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
