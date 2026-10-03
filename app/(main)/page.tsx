import React from 'react';
import { HeroSection } from '@/components/hero/HeroSection';
import { ContentRail } from '@/components/rails/ContentRail';
import { ContinueWatchingRail } from '@/components/rails/ContinueWatchingRail';
import { getFeaturedMedia, getCategoryWithMedia } from '@/lib/data/repository';

export default async function HomePage() {
  const featuredItems = await getFeaturedMedia();
  const categoryRails = await getCategoryWithMedia();

  return (
    <div className="relative pb-16">
      {/* Cinematic Hero */}
      <HeroSection items={featuredItems} />

      {/* Content Rails Container */}
      <div className="relative -mt-16 sm:-mt-24 z-20 space-y-2">
        {/* Continue Watching (client-synced) */}
        <ContinueWatchingRail />

        {/* Dynamic Category Rails from Repository */}
        {categoryRails.map(({ category, items }, index) => {
          const isLandscape = index % 3 === 1; // alternate subtle landscape rail for visual richness
          return (
            <ContentRail
              key={category.id}
              title={category.title}
              description={category.description}
              items={items}
              aspectRatio={isLandscape ? 'landscape' : 'poster'}
              viewAllHref={
                category.slug === 'popular-series'
                  ? '/series'
                  : category.slug === 'feature-movies'
                  ? '/movies'
                  : `/genres`
              }
            />
          );
        })}
      </div>
    </div>
  );
}
