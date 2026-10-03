'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaItem } from '@/types/content';
import { MediaCard } from '@/components/cards/MediaCard';

interface ContentRailProps {
  title: string;
  description?: string;
  items: MediaItem[];
  aspectRatio?: 'poster' | 'landscape';
  viewAllHref?: string;
}

export function ContentRail({
  title,
  description,
  items,
  aspectRatio = 'poster',
  viewAllHref,
}: ContentRailProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [items]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 300);
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="relative my-8 sm:my-10 px-4 sm:px-6 lg:px-8 group/rail">
      {/* Rail Header */}
      <div className="flex items-end justify-between mb-3.5">
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center space-x-2">
            <span>{title}</span>
          </h2>
          {description && <p className="text-xs text-zinc-400 mt-0.5">{description}</p>}
        </div>

        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-xs font-semibold text-amber-400/90 hover:text-amber-300 flex items-center space-x-1 group-hover/rail:translate-x-0.5 transition-transform"
          >
            <span>Explore All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Rail Carousel Container */}
      <div className="relative">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 z-20 w-10 h-10 rounded-full bg-black/80 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover/rail:opacity-100 transition-all hover:bg-black hover:border-amber-400 hover:scale-110 shadow-2xl backdrop-blur-md"
          >
            <ChevronLeft className="w-5 h-5 text-amber-400" />
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 z-20 w-10 h-10 rounded-full bg-black/80 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover/rail:opacity-100 transition-all hover:bg-black hover:border-amber-400 hover:scale-110 shadow-2xl backdrop-blur-md"
          >
            <ChevronRight className="w-5 h-5 text-amber-400" />
          </button>
        )}

        {/* Scrollable Track */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex space-x-4 overflow-x-auto hide-scrollbar scroll-smooth py-2 px-1"
        >
          {items.map((item, index) => (
            <MediaCard
              key={`${item.id}-${index}`}
              item={item}
              aspectRatio={aspectRatio}
              priority={index < 4}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
