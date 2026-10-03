'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Volume1,
  Maximize,
  Minimize,
  Settings,
  Subtitles,
  ArrowLeft,
  SkipForward,
  Check,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { MediaItem, Episode, SubtitleTrack } from '@/types/content';
import { useWatchProgress } from '@/lib/hooks/useWatchProgress';

interface VideoPlayerProps {
  item: MediaItem;
  initialEpisode?: Episode;
  nextEpisode?: Episode;
  streamUrl: string;
  subtitles: SubtitleTrack[];
}

export function VideoPlayer({
  item,
  initialEpisode,
  nextEpisode,
  streamUrl,
  subtitles,
}: VideoPlayerProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [selectedQuality, setSelectedQuality] = useState('Auto');
  const [activeSubtitle, setActiveSubtitle] = useState<string>('off');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSubtitlesOpen, setIsSubtitlesOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [resumePrompt, setResumePrompt] = useState<{ seconds: number } | null>(null);

  const { saveProgress, getProgressForContent } = useWatchProgress();

  const title = initialEpisode
    ? `${item.title} — ${initialEpisode.title}`
    : item.title;

  const episodeLabel = initialEpisode
    ? `S1:E${initialEpisode.episodeNumber}`
    : undefined;

  // Initialize saved progress check
  useEffect(() => {
    const saved = getProgressForContent(item.slug, initialEpisode?.id);
    if (saved && saved.progressSeconds > 10 && saved.progressSeconds < (saved.durationSeconds - 30)) {
      setResumePrompt({ seconds: saved.progressSeconds });
    }
  }, [item.slug, initialEpisode?.id, getProgressForContent]);

  // Format seconds to mm:ss or hh:mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) {
      return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Auto-hide controls timer
  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        if (!isSettingsOpen && !isSubtitlesOpen) {
          setShowControls(false);
        }
      }, 3500);
    }
  }, [isPlaying, isSettingsOpen, isSubtitlesOpen]);

  // Handle Play/Pause
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    resetControlsTimeout();
  }, [resetControlsTimeout]);

  // Seek
  const seekBy = useCallback((seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.duration, videoRef.current.currentTime + seconds));
    resetControlsTimeout();
  }, [resetControlsTimeout]);

  // Toggle Fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  // Set Subtitle track
  const setSubtitleTrack = useCallback((lang: string) => {
    if (!videoRef.current) return;
    setActiveSubtitle(lang);
    const tracks = videoRef.current.textTracks;
    for (let i = 0; i < tracks.length; i++) {
      if (lang === 'off') {
        tracks[i].mode = 'disabled';
      } else {
        tracks[i].mode = tracks[i].language === lang ? 'showing' : 'disabled';
      }
    }
    setIsSubtitlesOpen(false);
  }, []);

  // Update Progress periodic save
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    setCurrentTime(curr);

    // Update buffer
    if (videoRef.current.buffered.length > 0) {
      const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
      setBuffered(bufferedEnd);
    }

    // Periodic progress save every 5 seconds
    if (Math.floor(curr) % 5 === 0 && curr > 0) {
      saveProgress({
        userId: 'current-user',
        contentId: item.id,
        contentSlug: item.slug,
        contentType: item.type,
        title: item.title,
        posterUrl: item.posterUrl,
        backdropUrl: item.backdropUrl,
        episodeId: initialEpisode?.id,
        episodeNumber: initialEpisode?.episodeNumber,
        seasonNumber: 1,
        episodeTitle: initialEpisode?.title,
        progressSeconds: Math.floor(curr),
        durationSeconds: Math.floor(videoRef.current.duration || 1),
      });
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if focus is on inputs
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'arrowleft':
          e.preventDefault();
          seekBy(-10);
          break;
        case 'arrowright':
          e.preventDefault();
          seekBy(10);
          break;
        case 'arrowup':
          e.preventDefault();
          setVolume((v) => {
            const next = Math.min(1, v + 0.1);
            if (videoRef.current) videoRef.current.volume = next;
            setIsMuted(false);
            return next;
          });
          break;
        case 'arrowdown':
          e.preventDefault();
          setVolume((v) => {
            const next = Math.max(0, v - 0.1);
            if (videoRef.current) videoRef.current.volume = next;
            return next;
          });
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          setIsMuted((prev) => {
            if (videoRef.current) videoRef.current.muted = !prev;
            return !prev;
          });
          break;
        case 'c':
          e.preventDefault();
          setSubtitleTrack(activeSubtitle === 'off' ? (subtitles[0]?.language || 'id') : 'off');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, seekBy, toggleFullscreen, activeSubtitle, subtitles, setSubtitleTrack]);

  // Set default subtitle if specified
  useEffect(() => {
    const defaultSub = subtitles.find((s) => s.default);
    if (defaultSub) {
      setSubtitleTrack(defaultSub.language);
    }
  }, [subtitles, setSubtitleTrack]);

  // Resume Handler
  const handleResume = () => {
    if (videoRef.current && resumePrompt) {
      videoRef.current.currentTime = resumePrompt.seconds;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
      setResumePrompt(null);
    }
  };

  const handleStartFromBeginning = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
      setResumePrompt(null);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={resetControlsTimeout}
      onClick={resetControlsTimeout}
      className="relative w-full h-screen bg-black overflow-hidden select-none flex items-center justify-center font-sans"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={streamUrl}
        playsInline
        preload="metadata"
        crossOrigin="anonymous"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration);
            setIsLoading(false);
          }
        }}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => {
          setIsLoading(false);
          setIsPlaying(true);
        }}
        onEnded={() => {
          setIsPlaying(false);
          if (nextEpisode) {
            router.push(`/watch/${item.slug}?episodeId=${nextEpisode.id}`);
          }
        }}
        onError={() => {
          setIsLoading(false);
          setErrorState(
            'Unable to connect to the external video CDN. Please verify your internet connection or check provider settings.'
          );
        }}
        onClick={togglePlay}
        className="w-full h-full object-contain cursor-pointer"
      >
        {subtitles.map((sub) => (
          <track
            key={sub.language}
            kind="subtitles"
            src={sub.src}
            srcLang={sub.language}
            label={sub.label}
            default={sub.default}
          />
        ))}
      </video>

      {/* Loading Spinner */}
      {isLoading && !errorState && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 pointer-events-none z-30">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin shadow-lg" />
          <span className="text-xs uppercase tracking-widest text-zinc-300 font-semibold mt-4">
            Loading Stream...
          </span>
        </div>
      )}

      {/* Error State Banner */}
      {errorState && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 p-6 text-center z-40">
          <AlertCircle className="w-12 h-12 text-amber-400 mb-3" />
          <h2 className="text-xl font-bold text-white mb-2">We couldn't play this title</h2>
          <p className="text-sm text-zinc-400 max-w-md mb-6">{errorState}</p>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setErrorState(null);
                setIsLoading(true);
                if (videoRef.current) {
                  videoRef.current.load();
                  videoRef.current.play().catch(() => {});
                }
              }}
              className="px-5 py-2.5 rounded-full font-bold text-sm bg-amber-400 hover:bg-amber-300 text-black transition-transform hover:scale-105"
            >
              Try Again
            </button>
            <Link
              href={item.type === 'movie' ? `/movie/${item.slug}` : `/series/${item.slug}`}
              className="px-5 py-2.5 rounded-full font-medium text-sm bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              Return to Catalog
            </Link>
          </div>
        </div>
      )}

      {/* Resume Prompt Modal Dialog */}
      {resumePrompt && !isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/75 backdrop-blur-sm z-40 p-4">
          <div className="bg-[#0f131d] border border-[#232b3e] rounded-2xl p-6 max-w-md w-full shadow-2xl text-center space-y-4">
            <div className="w-10 h-10 rounded-full bg-amber-400/20 border border-amber-400 text-amber-400 mx-auto flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Resume Watching?</h3>
              <p className="text-xs text-zinc-400 mt-1">
                You previously paused at{' '}
                <span className="text-amber-400 font-semibold">{formatTime(resumePrompt.seconds)}</span>.
                Would you like to pick up where you left off?
              </p>
            </div>
            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={handleResume}
                className="px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm shadow-lg transition-transform hover:scale-105"
              >
                Resume ({formatTime(resumePrompt.seconds)})
              </button>
              <button
                onClick={handleStartFromBeginning}
                className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-colors"
              >
                From Beginning
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Player Top Navigation Overlay */}
      <div
        className={`absolute top-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex items-center justify-between transition-opacity duration-300 z-30 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center space-x-4">
          <Link
            href={item.type === 'movie' ? `/movie/${item.slug}` : `/series/${item.slug}`}
            className="p-2 rounded-full bg-black/60 hover:bg-white/10 text-white border border-white/10 transition-colors"
            title="Back to details"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center space-x-2">
              <span>{title}</span>
              {episodeLabel && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-400 text-black uppercase">
                  {episodeLabel}
                </span>
              )}
            </h1>
            <p className="text-[11px] text-zinc-400 mt-0.5">Cineva: Stream with Comfortable</p>
          </div>
        </div>

        {/* Next episode quick trigger if available */}
        {nextEpisode && (
          <Link
            href={`/watch/${item.slug}?episodeId=${nextEpisode.id}`}
            className="hidden sm:flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-200 hover:text-white transition-colors"
          >
            <span>Next: {nextEpisode.title}</span>
            <SkipForward className="w-3.5 h-3.5 text-amber-400" />
          </Link>
        )}
      </div>

      {/* Player Bottom Controls Overlay */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent transition-opacity duration-300 z-30 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress Seek Bar */}
        <div className="relative group/seek mb-4 cursor-pointer">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setCurrentTime(val);
              if (videoRef.current) {
                videoRef.current.currentTime = val;
              }
            }}
            className="w-full h-1.5 hover:h-2.5 bg-zinc-700/60 rounded-full appearance-none cursor-pointer accent-amber-400 transition-all"
            style={{
              background: `linear-gradient(to right, #f59e0b ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.2) ${(currentTime / (duration || 1)) * 100}%)`,
            }}
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between text-white">
          {/* Left Controls */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-amber-400 hover:bg-amber-300 text-black flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-black" />
              ) : (
                <Play className="w-5 h-5 fill-black ml-0.5" />
              )}
            </button>

            {/* Rewind 10s */}
            <button
              onClick={() => seekBy(-10)}
              className="p-1.5 text-zinc-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              title="Rewind 10 seconds"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {/* Forward 10s */}
            <button
              onClick={() => seekBy(10)}
              className="p-1.5 text-zinc-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              title="Fast forward 10 seconds"
            >
              <RotateCw className="w-5 h-5" />
            </button>

            {/* Volume Control */}
            <div className="flex items-center space-x-2 group/vol">
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.muted = !isMuted;
                    setIsMuted(!isMuted);
                  }
                }}
                className="p-1.5 text-zinc-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-red-400" />
                ) : volume < 0.5 ? (
                  <Volume1 className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setVolume(val);
                  setIsMuted(val === 0);
                  if (videoRef.current) {
                    videoRef.current.volume = val;
                    videoRef.current.muted = val === 0;
                  }
                }}
                className="w-16 sm:w-20 h-1 bg-zinc-600 rounded-full appearance-none cursor-pointer accent-amber-400 hidden sm:block"
              />
            </div>

            {/* Time Stamp */}
            <div className="text-xs sm:text-sm font-medium text-zinc-300">
              <span className="text-white">{formatTime(currentTime)}</span>
              <span className="text-zinc-500 mx-1.5">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Subtitle / Audio Tracks Picker */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsSubtitlesOpen(!isSubtitlesOpen);
                  setIsSettingsOpen(false);
                }}
                className={`p-2 rounded-full border transition-colors ${
                  activeSubtitle !== 'off'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-400'
                    : 'bg-black/40 border-white/10 text-zinc-300 hover:text-white hover:border-white/30'
                }`}
                title="Subtitles & Captions"
              >
                <Subtitles className="w-4 h-4" />
              </button>

              {isSubtitlesOpen && (
                <div className="absolute bottom-12 right-0 bg-[#0f131d] border border-[#232b3e] rounded-xl p-3 shadow-2xl w-56 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 px-2">
                    Subtitles (WebVTT)
                  </div>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSubtitleTrack('off')}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between text-zinc-300 hover:bg-white/5"
                    >
                      <span>Off</span>
                      {activeSubtitle === 'off' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                    {subtitles.map((sub) => (
                      <button
                        key={sub.language}
                        onClick={() => setSubtitleTrack(sub.language)}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between text-zinc-300 hover:bg-white/5"
                      >
                        <span>{sub.label}</span>
                        {activeSubtitle === sub.language && (
                          <Check className="w-3.5 h-3.5 text-amber-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Settings (Speed & Quality) */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsSettingsOpen(!isSettingsOpen);
                  setIsSubtitlesOpen(false);
                }}
                className="p-2 rounded-full bg-black/40 border border-white/10 text-zinc-300 hover:text-white hover:border-white/30 transition-colors"
                title="Playback Settings"
              >
                <Settings className="w-4 h-4" />
              </button>

              {isSettingsOpen && (
                <div className="absolute bottom-12 right-0 bg-[#0f131d] border border-[#232b3e] rounded-xl p-3 shadow-2xl w-48 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 px-2">
                    Playback Speed
                  </div>
                  <div className="grid grid-cols-3 gap-1 mb-3">
                    {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => {
                          setPlaybackRate(rate);
                          if (videoRef.current) videoRef.current.playbackRate = rate;
                        }}
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          playbackRate === rate
                            ? 'bg-amber-400 text-black'
                            : 'bg-white/5 text-zinc-300 hover:bg-white/10'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>

                  <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 px-2">
                    Quality
                  </div>
                  <div className="space-y-1">
                    {['Auto (1080p)', '1080p HD', '720p', '480p'].map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          setSelectedQuality(q);
                          setIsSettingsOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-1 rounded-md text-xs font-medium flex items-center justify-between text-zinc-300 hover:bg-white/5"
                      >
                        <span>{q}</span>
                        {selectedQuality === q && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-full bg-black/40 border border-white/10 text-zinc-300 hover:text-white hover:border-white/30 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
