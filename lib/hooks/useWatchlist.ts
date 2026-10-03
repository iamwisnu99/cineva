'use client';

import { useState, useEffect, useCallback } from 'react';
import { MediaItem } from '@/types/content';

const WATCHLIST_STORAGE_KEY = 'cineva_watchlist_v1';
const WATCHLIST_EVENT = 'cineva_watchlist_updated';

export function useWatchlist() {
  const [watchlistSlugs, setWatchlistSlugs] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadWatchlist = useCallback(() => {
    try {
      const stored = localStorage.getItem(WATCHLIST_STORAGE_KEY);
      if (stored) {
        setWatchlistSlugs(JSON.parse(stored));
      } else {
        setWatchlistSlugs([]);
      }
    } catch {
      setWatchlistSlugs([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadWatchlist();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === WATCHLIST_STORAGE_KEY) {
        loadWatchlist();
      }
    };

    const handleCustomEvent = () => {
      loadWatchlist();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(WATCHLIST_EVENT, handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(WATCHLIST_EVENT, handleCustomEvent);
    };
  }, [loadWatchlist]);

  const isInWatchlist = useCallback(
    (slug: string) => {
      return watchlistSlugs.includes(slug);
    },
    [watchlistSlugs]
  );

  const toggleWatchlist = useCallback((item: MediaItem) => {
    try {
      const stored = localStorage.getItem(WATCHLIST_STORAGE_KEY);
      const current: string[] = stored ? JSON.parse(stored) : [];
      let updated: string[];

      if (current.includes(item.slug)) {
        updated = current.filter((s) => s !== item.slug);
      } else {
        updated = [item.slug, ...current];
      }

      localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(updated));
      setWatchlistSlugs(updated);
      window.dispatchEvent(new Event(WATCHLIST_EVENT));
      return !current.includes(item.slug);
    } catch {
      return false;
    }
  }, []);

  const removeFromWatchlist = useCallback((slug: string) => {
    try {
      const stored = localStorage.getItem(WATCHLIST_STORAGE_KEY);
      const current: string[] = stored ? JSON.parse(stored) : [];
      const updated = current.filter((s) => s !== slug);
      localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(updated));
      setWatchlistSlugs(updated);
      window.dispatchEvent(new Event(WATCHLIST_EVENT));
    } catch {
      // ignore
    }
  }, []);

  return {
    watchlistSlugs,
    isInWatchlist,
    toggleWatchlist,
    removeFromWatchlist,
    isLoaded,
    count: watchlistSlugs.length,
  };
}
