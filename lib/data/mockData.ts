import { Movie, Series, Category } from '@/types/content';

/**
 * ============================================================================
 * PANDUAN MENAMBAHKAN DATA FILM & SERIAL SECARA HARDCODED
 * ============================================================================
 * File ini adalah pusat penyimpanan data hardcoded katalog Cineva.
 * Seluruh data film, serial TV, dan kategori beranda diatur di sini.
 *
 * 1. Menambahkan Film Baru:
 *    - Masukkan object film ke dalam array `SAMPLE_MOVIES` di bawah.
 *    - Pastikan `slug` unik karena menjadi penentu rute halaman:
 *      - Halaman detail: /movie/[slug]
 *      - Pemutar video:  /watch/[slug]
 *    - Jika `featured: true`, film otomatis masuk ke rotasi Hero Banner beranda.
 *
 * 2. Menambahkan Serial TV Baru:
 *    - Masukkan object serial ke dalam array `SAMPLE_SERIES` di bawah.
 *    - Tiap serial dapat memiliki beberapa `seasons`, dan tiap season memiliki `episodes`.
 *    - URL Serial: /series/[slug]
 *    - URL Menonton episode: /watch/[slug]?episodeId=[id_episode]
 *
 * 3. Menampilkan Konten di Beranda:
 *    - Masukkan `slug` film atau serial ke dalam array `contentSlugs` di `SAMPLE_CATEGORIES`.
 * ============================================================================
 */

/**
 * ============================================================================
 * 1. DATA FILM (MOVIES)
 * ============================================================================
 * Format object mengacu pada interface `Movie` (@/types/content).
 * 
 * CONTOH CONTOH TEMPLATE FILM:
 * {
 *   id: 'm-1',
 *   type: 'movie',
 *   title: 'Judul Film Anda',
 *   slug: 'judul-film-anda',
 *   tagline: 'Tagline sinematik film.',
 *   description: 'Sinopsis lengkap cerita film yang menarik perhatian penonton.',
 *   shortDescription: 'Sinopsis singkat satu kalimat.',
 *   posterUrl: 'https://images.unsplash.com/...', // Rasio poster vertikal ~2:3
 *   backdropUrl: 'https://images.unsplash.com/...', // Rasio banner landscape 16:9
 *   trailerUrl: 'https://example.com/trailer.mp4',
 *   videoUrl: 'https://example.com/video-utama.mp4', // URL video stream/mp4
 *   qualities: [
 *     { quality: '1080p', url: 'https://example.com/video-1080p.mp4' },
 *     { quality: '720p', url: 'https://example.com/video-720p.mp4' }
 *   ],
 *   releaseYear: 2026,
 *   duration: 110, // dalam menit
 *   genres: ['Action', 'Sci-Fi', 'Drama'],
 *   cast: ['Nama Aktor 1', 'Nama Aktor 2'],
 *   director: 'Nama Sutradara',
 *   rating: 8.8, // Skala 0 - 10
 *   maturityRating: '13+', // 'SU' | '13+' | '16+' | '18+'
 *   languages: ['Bahasa Indonesia', 'English'],
 *   subtitles: [
 *     { language: 'id', label: 'Bahasa Indonesia', src: '/subtitles/film-id.vtt', default: true },
 *     { language: 'en', label: 'English', src: '/subtitles/film-en.vtt' }
 *   ],
 *   featured: true, // Muncul di Hero Banner
 *   trending: true, // Muncul label Trending
 *   isOriginal: true,
 *   createdAt: '2026-03-01T00:00:00Z',
 *   updatedAt: '2026-03-01T00:00:00Z'
 * }
 */
export const SAMPLE_MOVIES: Movie[] = [];

/**
 * ============================================================================
 * 2. DATA SERIAL TV (TV SERIES)
 * ============================================================================
 * Format object mengacu pada interface `Series` (@/types/content).
 * 
 * CONTOH CONTOH TEMPLATE SERIAL TV:
 * {
 *   id: 's-1',
 *   type: 'series',
 *   title: 'Judul Serial Anda',
 *   slug: 'judul-serial-anda',
 *   tagline: 'Tagline sinematik serial.',
 *   description: 'Sinopsis lengkap perjalanan cerita serial.',
 *   shortDescription: 'Sinopsis ringkas.',
 *   posterUrl: 'https://images.unsplash.com/...', // Rasio poster vertikal ~2:3
 *   backdropUrl: 'https://images.unsplash.com/...', // Rasio banner landscape 16:9
 *   trailerUrl: 'https://example.com/trailer.mp4',
 *   releaseYear: 2026,
 *   genres: ['Fantasy', 'Action', 'Adventure'],
 *   cast: ['Pemeran Utama 1', 'Pemeran Utama 2'],
 *   creator: 'Nama Kreator / Showrunner',
 *   rating: 9.1,
 *   maturityRating: '16+', // 'SU' | '13+' | '16+' | '18+'
 *   languages: ['Bahasa Indonesia', 'English'],
 *   subtitles: [
 *     { language: 'id', label: 'Bahasa Indonesia', src: '/subtitles/series-id.vtt', default: true }
 *   ],
 *   featured: true,
 *   trending: true,
 *   isOriginal: true,
 *   createdAt: '2026-03-01T00:00:00Z',
 *   updatedAt: '2026-03-01T00:00:00Z',
 *   seasons: [
 *     {
 *       id: 's1-sn1',
 *       seriesId: 's-1',
 *       seasonNumber: 1,
 *       title: 'Season 1: Nama Musim Pertama',
 *       description: 'Deskripsi singkat alur musim pertama.',
 *       episodes: [
 *         {
 *           id: 'ep-s1-1',
 *           seasonId: 's1-sn1',
 *           seriesSlug: 'judul-serial-anda',
 *           episodeNumber: 1,
 *           title: 'Episode 1: Judul Episode',
 *           description: 'Sinopsis episode pertama.',
 *           thumbnailUrl: 'https://images.unsplash.com/...', // Rasio 16:9
 *           videoUrl: 'https://example.com/episode1.mp4',
 *           duration: 50, // dalam menit
 *           subtitles: [
 *             { language: 'id', label: 'Bahasa Indonesia', src: '/subtitles/demo-id.vtt', default: true }
 *           ],
 *           releaseDate: '2026-03-01'
 *         }
 *       ]
 *     }
 *   ]
 * }
 */
export const SAMPLE_SERIES: Series[] = [];

/**
 * ============================================================================
 * 3. KATEGORI RAILS BERANDA (CATEGORIES)
 * ============================================================================
 * Mengatur rail baris film/serial yang tampil di Beranda (Home).
 * Masukkan `slug` dari film atau serial yang sudah dibuat ke dalam array `contentSlugs`.
 */
export const SAMPLE_CATEGORIES: Category[] = [
  {
    id: 'cat-featured',
    title: 'Featured & Trending Now',
    slug: 'featured-trending',
    description: 'Sorotan film dan serial pilihan terpopuler minggu ini',
    contentType: 'all',
    sortOrder: 1,
    visibility: true,
    contentSlugs: []
  },
  {
    id: 'cat-originals',
    title: 'Cineva Originals & Productions',
    slug: 'cineva-originals',
    description: 'Karya sinematik orisinal dan produksi pilihan',
    contentType: 'all',
    sortOrder: 2,
    visibility: true,
    contentSlugs: []
  },
  {
    id: 'cat-movies',
    title: 'Film Layar Lebar',
    slug: 'feature-movies',
    description: 'Koleksi film panjang pilihan dengan kualitas sinematik',
    contentType: 'movie',
    sortOrder: 3,
    visibility: true,
    contentSlugs: []
  },
  {
    id: 'cat-series',
    title: 'Serial TV & Drama',
    slug: 'popular-series',
    description: 'Petualangan multi-episode dan serial drama terbaik',
    contentType: 'series',
    sortOrder: 4,
    visibility: true,
    contentSlugs: []
  }
];
