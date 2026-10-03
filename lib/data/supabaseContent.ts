import { getSupabaseServerClient } from '@/lib/supabase/server';
import { Movie, Series, Category, Season, Episode } from '@/types/content';

/**
 * Maps Supabase DB movie row to internal Movie interface
 */
function mapMovieFromRow(row: any): Movie {
  return {
    id: row.id,
    type: 'movie',
    title: row.title,
    slug: row.slug,
    tagline: row.tagline || undefined,
    description: row.description,
    shortDescription: row.short_description || undefined,
    posterUrl: row.poster_url,
    backdropUrl: row.backdrop_url,
    trailerUrl: row.trailer_url || undefined,
    videoUrl: row.video_url,
    qualities: row.qualities || [],
    releaseYear: row.release_year,
    duration: row.duration,
    genres: row.genres || [],
    cast: row.cast_members || [],
    director: row.director || 'Prima Wisnu',
    rating: Number(row.rating) || 9.0,
    maturityRating: row.maturity_rating || '13+',
    languages: row.languages || ['Bahasa Indonesia', 'English'],
    subtitles: row.subtitles || [],
    featured: Boolean(row.featured),
    trending: Boolean(row.trending),
    isOriginal: Boolean(row.is_original),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Maps Supabase DB series row with nested seasons/episodes to Series interface
 */
function mapSeriesFromRow(row: any, seasons: Season[] = []): Series {
  return {
    id: row.id,
    type: 'series',
    title: row.title,
    slug: row.slug,
    tagline: row.tagline || undefined,
    description: row.description,
    shortDescription: row.short_description || undefined,
    posterUrl: row.poster_url,
    backdropUrl: row.backdrop_url,
    trailerUrl: row.trailer_url || undefined,
    releaseYear: row.release_year,
    genres: row.genres || [],
    cast: row.cast_members || [],
    creator: row.creator || 'Prima Wisnu',
    rating: Number(row.rating) || 9.0,
    maturityRating: row.maturity_rating || '16+',
    languages: row.languages || ['Bahasa Indonesia', 'English'],
    subtitles: row.subtitles || [],
    seasons: seasons,
    featured: Boolean(row.featured),
    trending: Boolean(row.trending),
    isOriginal: Boolean(row.is_original),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Fetch all movies from Supabase
 */
export async function getSupabaseMovies(): Promise<Movie[] | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase movies query warning:', error.message);
      return null;
    }

    if (!data) return [];
    return data.map(mapMovieFromRow);
  } catch (err) {
    console.warn('Supabase getMovies exception:', err);
    return null;
  }
}

/**
 * Fetch all series with seasons and episodes from Supabase
 */
export async function getSupabaseSeries(): Promise<Series[] | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  try {
    const { data: seriesData, error: seriesError } = await supabase
      .from('series')
      .select('*')
      .order('created_at', { ascending: false });

    if (seriesError || !seriesData) {
      return null;
    }

    // Fetch seasons and episodes for each series
    const fullSeriesList: Series[] = [];

    for (const sRow of seriesData) {
      const { data: seasonsData } = await supabase
        .from('seasons')
        .select('*')
        .eq('series_id', sRow.id)
        .order('season_number', { ascending: true });

      const seasons: Season[] = [];

      if (seasonsData && seasonsData.length > 0) {
        for (const snRow of seasonsData) {
          const { data: epData } = await supabase
            .from('episodes')
            .select('*')
            .eq('season_id', snRow.id)
            .order('episode_number', { ascending: true });

          const episodes: Episode[] = (epData || []).map((ep: any) => ({
            id: ep.id,
            seasonId: ep.season_id,
            seriesSlug: ep.series_slug || sRow.slug,
            episodeNumber: ep.episode_number,
            title: ep.title,
            description: ep.description || '',
            thumbnailUrl: ep.thumbnail_url,
            videoUrl: ep.video_url,
            qualities: ep.qualities || [],
            duration: ep.duration,
            subtitles: ep.subtitles || [],
            releaseDate: ep.release_date,
          }));

          seasons.push({
            id: snRow.id,
            seriesId: snRow.series_id,
            seasonNumber: snRow.season_number,
            title: snRow.title,
            description: snRow.description || '',
            episodes,
          });
        }
      }

      fullSeriesList.push(mapSeriesFromRow(sRow, seasons));
    }

    return fullSeriesList;
  } catch (err) {
    console.warn('Supabase getSeries exception:', err);
    return null;
  }
}

/**
 * Fetch categories from Supabase
 */
export async function getSupabaseCategories(): Promise<Category[] | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data) return null;

    return data.map((row: any) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      description: row.description,
      contentType: row.content_type || 'all',
      sortOrder: row.sort_order,
      visibility: Boolean(row.visibility),
      contentSlugs: row.content_slugs || [],
    }));
  } catch {
    return null;
  }
}

/**
 * Insert or update a movie into Supabase
 */
export async function insertSupabaseMovie(movie: Partial<Movie>): Promise<{ success: boolean; data?: Movie; error?: string }> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return { success: false, error: 'Koneksi database Supabase tidak dikonfigurasi.' };
  }

  try {
    const row = {
      title: movie.title,
      slug: movie.slug,
      tagline: movie.tagline || null,
      description: movie.description,
      short_description: movie.shortDescription || null,
      poster_url: movie.posterUrl,
      backdrop_url: movie.backdropUrl,
      trailer_url: movie.trailerUrl || null,
      video_url: movie.videoUrl,
      qualities: movie.qualities || [],
      release_year: movie.releaseYear || 2026,
      duration: movie.duration || 90,
      genres: movie.genres || [],
      cast_members: movie.cast || [],
      director: movie.director || 'Prima Wisnu',
      rating: movie.rating || 9.0,
      maturity_rating: movie.maturityRating || '13+',
      languages: movie.languages || ['Bahasa Indonesia', 'English'],
      subtitles: movie.subtitles || [],
      featured: movie.featured !== undefined ? movie.featured : true,
      trending: movie.trending !== undefined ? movie.trending : true,
      is_original: movie.isOriginal !== undefined ? movie.isOriginal : true,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('movies')
      .upsert(row, { onConflict: 'slug' })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: mapMovieFromRow(data) };
  } catch (err: any) {
    return { success: false, error: err.message || 'Gagal menyimpan film ke database.' };
  }
}

/**
 * Delete a movie from Supabase by ID or slug
 */
export async function deleteSupabaseMovie(idOrSlug: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return { success: false, error: 'Database Supabase tidak terhubung.' };

  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    const query = supabase.from('movies').delete();

    const { error } = isUuid 
      ? await query.eq('id', idOrSlug) 
      : await query.eq('slug', idOrSlug);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Insert or update a series with season and episode into Supabase
 */
export async function insertSupabaseSeries(series: Partial<Series>): Promise<{ success: boolean; data?: Series; error?: string }> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return { success: false, error: 'Koneksi database Supabase tidak dikonfigurasi.' };
  }

  try {
    const sRow = {
      title: series.title,
      slug: series.slug,
      tagline: series.tagline || null,
      description: series.description,
      short_description: series.shortDescription || null,
      poster_url: series.posterUrl,
      backdrop_url: series.backdropUrl,
      trailer_url: series.trailerUrl || null,
      release_year: series.releaseYear || 2026,
      genres: series.genres || [],
      cast_members: series.cast || [],
      creator: series.creator || 'Prima Wisnu',
      rating: series.rating || 9.0,
      maturity_rating: series.maturityRating || '16+',
      languages: series.languages || ['Bahasa Indonesia', 'English'],
      subtitles: series.subtitles || [],
      featured: series.featured !== undefined ? series.featured : true,
      trending: series.trending !== undefined ? series.trending : true,
      is_original: series.isOriginal !== undefined ? series.isOriginal : true,
      updated_at: new Date().toISOString(),
    };

    const { data: savedSeries, error: sErr } = await supabase
      .from('series')
      .upsert(sRow, { onConflict: 'slug' })
      .select()
      .single();

    if (sErr) return { success: false, error: sErr.message };

    // If seasons provided, insert them
    const createdSeasons: Season[] = [];
    if (series.seasons && series.seasons.length > 0) {
      for (const season of series.seasons) {
        const { data: savedSeason, error: snErr } = await supabase
          .from('seasons')
          .insert({
            series_id: savedSeries.id,
            season_number: season.seasonNumber || 1,
            title: season.title,
            description: season.description || null,
          })
          .select()
          .single();

        if (!snErr && savedSeason) {
          const createdEpisodes: Episode[] = [];
          if (season.episodes && season.episodes.length > 0) {
            for (const ep of season.episodes) {
              const { data: savedEp, error: epErr } = await supabase
                .from('episodes')
                .insert({
                  season_id: savedSeason.id,
                  series_slug: series.slug,
                  episode_number: ep.episodeNumber || 1,
                  title: ep.title,
                  description: ep.description || null,
                  thumbnail_url: ep.thumbnailUrl,
                  video_url: ep.videoUrl,
                  duration: ep.duration || 45,
                  qualities: ep.qualities || [],
                  subtitles: ep.subtitles || [],
                  release_date: ep.releaseDate || new Date().toISOString().split('T')[0],
                })
                .select()
                .single();

              if (!epErr && savedEp) {
                createdEpisodes.push({
                  id: savedEp.id,
                  seasonId: savedEp.season_id,
                  seriesSlug: savedEp.series_slug,
                  episodeNumber: savedEp.episode_number,
                  title: savedEp.title,
                  description: savedEp.description || '',
                  thumbnailUrl: savedEp.thumbnail_url,
                  videoUrl: savedEp.video_url,
                  duration: savedEp.duration,
                  subtitles: savedEp.subtitles || [],
                  releaseDate: savedEp.release_date,
                });
              }
            }
          }

          createdSeasons.push({
            id: savedSeason.id,
            seriesId: savedSeason.series_id,
            seasonNumber: savedSeason.season_number,
            title: savedSeason.title,
            description: savedSeason.description || '',
            episodes: createdEpisodes,
          });
        }
      }
    }

    return { success: true, data: mapSeriesFromRow(savedSeries, createdSeasons) };
  } catch (err: any) {
    return { success: false, error: err.message || 'Gagal menyimpan serial ke database.' };
  }
}

/**
 * Delete a series from Supabase by ID or slug
 */
export async function deleteSupabaseSeries(idOrSlug: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return { success: false, error: 'Database Supabase tidak terhubung.' };

  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    const query = supabase.from('series').delete();

    const { error } = isUuid 
      ? await query.eq('id', idOrSlug) 
      : await query.eq('slug', idOrSlug);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Update category slugs in Supabase
 */
export async function updateSupabaseCategorySlugs(categoryId: string, slugs: string[]): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return { success: false, error: 'Database Supabase tidak terhubung.' };

  try {
    const { error } = await supabase
      .from('categories')
      .update({ content_slugs: slugs, updated_at: new Date().toISOString() })
      .eq('id', categoryId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
