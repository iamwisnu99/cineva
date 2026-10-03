import { Movie, Series, Category, MediaItem } from '@/types/content';
import { SAMPLE_MOVIES, SAMPLE_SERIES, SAMPLE_CATEGORIES } from './mockData';
import { 
  getSupabaseMovies, 
  getSupabaseSeries, 
  getSupabaseCategories, 
  insertSupabaseMovie, 
  insertSupabaseSeries,
  updateSupabaseCategorySlugs
} from './supabaseContent';

/**
 * Fetch movies from Supabase and merge with any hardcoded mockData movies
 */
export async function getMovies(): Promise<Movie[]> {
  try {
    const supabaseMovies = await getSupabaseMovies();
    if (supabaseMovies !== null) {
      const slugs = new Set(supabaseMovies.map((m) => m.slug));
      const hardcodedNonDuplicates = SAMPLE_MOVIES.filter((m) => !slugs.has(m.slug));
      return [...supabaseMovies, ...hardcodedNonDuplicates];
    }
  } catch (err) {
    console.warn('Repository getMovies Supabase fallback:', err);
  }
  return [...SAMPLE_MOVIES];
}

/**
 * Fetch series from Supabase and merge with any hardcoded mockData series
 */
export async function getSeries(): Promise<Series[]> {
  try {
    const supabaseSeries = await getSupabaseSeries();
    if (supabaseSeries !== null) {
      const slugs = new Set(supabaseSeries.map((s) => s.slug));
      const hardcodedNonDuplicates = SAMPLE_SERIES.filter((s) => !slugs.has(s.slug));
      return [...supabaseSeries, ...hardcodedNonDuplicates];
    }
  } catch (err) {
    console.warn('Repository getSeries Supabase fallback:', err);
  }
  return [...SAMPLE_SERIES];
}

export async function getAllMedia(): Promise<MediaItem[]> {
  const [movies, series] = await Promise.all([getMovies(), getSeries()]);
  return [...movies, ...series];
}

export async function getFeaturedMedia(): Promise<MediaItem[]> {
  const all = await getAllMedia();
  return all.filter((item) => item.featured);
}

export async function getMediaBySlug(slug: string): Promise<MediaItem | null> {
  const all = await getAllMedia();
  return all.find((item) => item.slug === slug) || null;
}

export async function getMovieBySlug(slug: string): Promise<Movie | null> {
  const movies = await getMovies();
  return movies.find((m) => m.slug === slug) || null;
}

export async function getSeriesBySlug(slug: string): Promise<Series | null> {
  const series = await getSeries();
  return series.find((s) => s.slug === slug) || null;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const supabaseCats = await getSupabaseCategories();
    if (supabaseCats !== null && supabaseCats.length > 0) {
      return [...supabaseCats]
        .filter((c) => c.visibility)
        .sort((a, b) => a.sortOrder - b.sortOrder);
    }
  } catch (err) {
    console.warn('Repository getCategories Supabase fallback:', err);
  }

  return [...SAMPLE_CATEGORIES]
    .filter((c) => c.visibility)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getCategoryWithMedia(): Promise<{ category: Category; items: MediaItem[] }[]> {
  const categories = await getCategories();
  const allMedia = await getAllMedia();
  const mediaMap = new Map(allMedia.map((m) => [m.slug, m]));

  return categories.map((category) => {
    const items = category.contentSlugs
      .map((slug) => mediaMap.get(slug))
      .filter((item): item is MediaItem => item !== undefined);
    return {
      category,
      items,
    };
  });
}

export async function getAllGenres(): Promise<string[]> {
  const all = await getAllMedia();
  const genreSet = new Set<string>();
  all.forEach((item) => {
    item.genres.forEach((g) => genreSet.add(g));
  });
  return Array.from(genreSet).sort();
}

export async function getMediaByGenre(genre: string): Promise<MediaItem[]> {
  const all = await getAllMedia();
  const lowerGenre = genre.toLowerCase();
  return all.filter((item) =>
    item.genres.some((g) => g.toLowerCase() === lowerGenre)
  );
}

export async function getRelatedMedia(
  currentSlug: string,
  genres: string[],
  limit = 6
): Promise<MediaItem[]> {
  const all = await getAllMedia();
  const others = all.filter((m) => m.slug !== currentSlug);

  return others
    .map((item) => {
      const common = item.genres.filter((g) => genres.includes(g)).length;
      return { item, score: common };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);
}

export async function searchMedia(
  query: string,
  typeFilter: 'all' | 'movie' | 'series' = 'all',
  genreFilter = ''
): Promise<MediaItem[]> {
  const q = query.trim().toLowerCase();
  let list = await getAllMedia();

  if (typeFilter !== 'all') {
    list = list.filter((item) => item.type === typeFilter);
  }

  if (genreFilter) {
    const lowerG = genreFilter.toLowerCase();
    list = list.filter((item) => item.genres.some((g) => g.toLowerCase() === lowerG));
  }

  if (!q) {
    return list;
  }

  return list.filter((item) => {
    const matchTitle = item.title.toLowerCase().includes(q);
    const matchDesc = item.description.toLowerCase().includes(q);
    const matchGenre = item.genres.some((g) => g.toLowerCase().includes(q));
    const matchCast = item.cast.some((c) => c.toLowerCase().includes(q));
    const matchDirector =
      (item.type === 'movie' && item.director?.toLowerCase().includes(q)) ||
      (item.type === 'series' && item.creator?.toLowerCase().includes(q));

    const matchEpisode =
      item.type === 'series' &&
      item.seasons?.some((season) =>
        season.episodes.some((ep) => ep.title.toLowerCase().includes(q))
      );

    return matchTitle || matchDesc || matchGenre || matchCast || matchDirector || matchEpisode;
  });
}

// Admin mutators
export async function addOrUpdateMovie(movie: Movie): Promise<void> {
  await insertSupabaseMovie(movie);
}

export async function addOrUpdateSeries(series: Series): Promise<void> {
  await insertSupabaseSeries(series);
}
