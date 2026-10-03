export type ContentType = 'movie' | 'series';

export interface SubtitleTrack {
  language: string; // e.g. "id", "en"
  label: string; // e.g. "Bahasa Indonesia", "English"
  src: string; // path or URL to .vtt file
  default?: boolean;
}

export interface VideoSourceQuality {
  quality: '1080p' | '720p' | '480p' | 'auto';
  url: string;
}

export interface Movie {
  id: string;
  type: 'movie';
  title: string;
  slug: string;
  tagline?: string;
  description: string;
  shortDescription?: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl?: string;
  videoUrl: string;
  qualities?: VideoSourceQuality[];
  releaseYear: number;
  duration: number; // in minutes
  genres: string[];
  cast: string[];
  director: string;
  creator?: string;
  rating: number; // 0 - 10
  maturityRating: 'SU' | '13+' | '16+' | '18+';
  languages: string[];
  subtitles: SubtitleTrack[];
  featured?: boolean;
  trending?: boolean;
  isAiAssisted?: boolean;
  isOriginal?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Episode {
  id: string;
  seasonId: string;
  seriesSlug: string;
  episodeNumber: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  qualities?: VideoSourceQuality[];
  duration: number; // in minutes
  subtitles: SubtitleTrack[];
  releaseDate: string;
}

export interface Season {
  id: string;
  seriesId: string;
  seasonNumber: number;
  title: string;
  description: string;
  episodes: Episode[];
}

export interface Series {
  id: string;
  type: 'series';
  title: string;
  slug: string;
  tagline?: string;
  description: string;
  shortDescription?: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl?: string;
  releaseYear: number;
  genres: string[];
  cast: string[];
  creator: string;
  rating: number; // 0 - 10
  maturityRating: 'SU' | '13+' | '16+' | '18+';
  languages: string[];
  subtitles: SubtitleTrack[];
  seasons: Season[];
  featured?: boolean;
  trending?: boolean;
  isAiAssisted?: boolean;
  isOriginal?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type MediaItem = Movie | Series;

export interface WatchProgress {
  userId: string;
  contentId: string;
  contentSlug: string;
  contentType: ContentType;
  title: string;
  posterUrl: string;
  backdropUrl: string;
  episodeId?: string;
  episodeNumber?: number;
  seasonNumber?: number;
  episodeTitle?: string;
  progressSeconds: number;
  durationSeconds: number;
  percentage: number;
  updatedAt: string;
}

export interface Category {
  id: string;
  title: string;
  slug: string;
  description?: string;
  contentType: 'all' | 'movie' | 'series';
  sortOrder: number;
  visibility: boolean;
  contentSlugs: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  isKids: boolean;
}
