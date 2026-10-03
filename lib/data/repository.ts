import { Movie, Series, Category, MediaItem } from '@/types/content';
import { SAMPLE_MOVIES, SAMPLE_SERIES, SAMPLE_CATEGORIES } from './mockData';

// In-memory store (initialized from mock data, can be updated dynamically via admin operations)
let moviesStore: Movie[] = [...SAMPLE_MOVIES];
let seriesStore: Series[] = [...SAMPLE_SERIES];
let categoriesStore: Category[] = [...SAMPLE_CATEGORIES];

export async function getAllMedia(): Promise<MediaItem[]> {
  return [...moviesStore, ...seriesStore];
}

export async function getFeaturedMedia(): Promise<MediaItem[]> {
  const all = await getAllMedia();
  return all.filter((item) => item.featured);
}

export async function getMovies(): Promise<Movie[]> {
  return [...moviesStore];
}

export async function getSeries(): Promise<Series[]> {
  return [...seriesStore];
}

export async function getMediaBySlug(slug: string): Promise<MediaItem | null> {
  const movie = moviesStore.find((m) => m.slug === slug);
  if (movie) return movie;
  const series = seriesStore.find((s) => s.slug === slug);
  if (series) return series;
  return null;
}

export async function getMovieBySlug(slug: string): Promise<Movie | null> {
  return moviesStore.find((m) => m.slug === slug) || null;
}

export async function getSeriesBySlug(slug: string): Promise<Series | null> {
  return seriesStore.find((s) => s.slug === slug) || null;
}

export async function getCategories(): Promise<Category[]> {
  return [...categoriesStore]
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
      // Calculate intersection of genres
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

    // Also match episode titles if series
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
  const idx = moviesStore.findIndex((m) => m.id === movie.id || m.slug === movie.slug);
  if (idx >= 0) {
    moviesStore[idx] = movie;
  } else {
    moviesStore.push(movie);
  }
}

export async function addOrUpdateSeries(series: Series): Promise<void> {
  const idx = seriesStore.findIndex((s) => s.id === series.id || s.slug === series.slug);
  if (idx >= 0) {
    seriesStore[idx] = series;
  } else {
    seriesStore.push(series);
  }
}
