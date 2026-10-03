'use client';

import { useState, useEffect, useCallback } from 'react';
import { WatchProgress } from '@/types/content';

const PROGRESS_STORAGE_KEY = 'cineva_watch_progress_v1';
const PROGRESS_EVENT = 'cineva_progress_updated';

export function useWatchProgress() {
  const [progressList, setProgressList] = useState<WatchProgress[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadProgress = useCallback(() => {
    try {
      const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (stored) {
        const parsed: WatchProgress[] = JSON.parse(stored);
        // sort by most recently watched
        parsed.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        setProgressList(parsed);
      } else {
        // Provide mock initial continue watching if empty for immediate demo delight
        const initialSeed: WatchProgress[] = [
          {
            userId: 'user-default',
            contentId: 'm-1',
            contentSlug: 'the-last-signal',
            contentType: 'movie',
            title: 'The Last Signal',
            posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
            backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop',
            progressSeconds: 3120, // ~52 mins in
            durationSeconds: 6480, // 108 mins
            percentage: 48,
            updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          },
          {
            userId: 'user-default',
            contentId: 's-1',
            contentSlug: 'chronicles-of-veyra',
            contentType: 'series',
            title: 'Chronicles of Veyra',
            posterUrl: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=800&auto=format&fit=crop',
            backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop',
            episodeId: 'ep-s1-1',
            episodeNumber: 1,
            seasonNumber: 1,
            episodeTitle: 'The Ashborn Prophecy',
            progressSeconds: 1680, // ~28 mins in
            durationSeconds: 3120,
            percentage: 54,
            updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
          }
        ];
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(initialSeed));
        setProgressList(initialSeed);
      }
    } catch {
      setProgressList([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadProgress();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === PROGRESS_STORAGE_KEY) {
        loadProgress();
      }
    };

    const handleCustom = () => {
      loadProgress();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(PROGRESS_EVENT, handleCustom);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(PROGRESS_EVENT, handleCustom);
    };
  }, [loadProgress]);

  const saveProgress = useCallback((item: Omit<WatchProgress, 'updatedAt' | 'percentage'>) => {
    try {
      const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
      let list: WatchProgress[] = stored ? JSON.parse(stored) : [];

      const percentage = Math.min(
        100,
        Math.max(0, Math.round((item.progressSeconds / (item.durationSeconds || 1)) * 100))
      );

      // If finished (> 95%), we can either keep or reset, let's keep track
      const existingIdx = list.findIndex(
        (p) =>
          p.contentSlug === item.contentSlug &&
          (item.episodeId ? p.episodeId === item.episodeId : true)
      );

      const newRecord: WatchProgress = {
        ...item,
        percentage,
        updatedAt: new Date().toISOString(),
      };

      if (existingIdx >= 0) {
        list[existingIdx] = newRecord;
      } else {
        list.unshift(newRecord);
      }

      // Keep up to 20 recent items
      list = list.slice(0, 20);

      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(list));
      setProgressList(list);
      window.dispatchEvent(new Event(PROGRESS_EVENT));
    } catch {
      // ignore
    }
  }, []);

  const getProgressForContent = useCallback(
    (slug: string, episodeId?: string): WatchProgress | undefined => {
      return progressList.find(
        (p) => p.contentSlug === slug && (episodeId ? p.episodeId === episodeId : true)
      );
    },
    [progressList]
  );

  const removeProgress = useCallback((contentSlug: string, episodeId?: string) => {
    try {
      const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (!stored) return;
      let list: WatchProgress[] = JSON.parse(stored);
      list = list.filter(
        (p) => !(p.contentSlug === contentSlug && (episodeId ? p.episodeId === episodeId : true))
      );
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(list));
      setProgressList(list);
      window.dispatchEvent(new Event(PROGRESS_EVENT));
    } catch {
      // ignore
    }
  }, []);

  return {
    progressList,
    isLoaded,
    saveProgress,
    getProgressForContent,
    removeProgress,
  };
}
