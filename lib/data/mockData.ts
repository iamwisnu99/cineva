import { Movie, Series, Category } from '@/types/content';

export const SAMPLE_MOVIES: Movie[] = [
  {
    id: 'm-1',
    type: 'movie',
    title: 'The Last Signal',
    slug: 'the-last-signal',
    tagline: 'When humanity falls silent, the stars answer.',
    description: 'Deep in the desolate orbital perimeter of Neo-Veridia, a lone quantum signal interceptor discovers an encrypted transmission broadcasting from inside an ancient singularity. As the perimeter collapses, team leader Thom must bridge the timeline before rogue defense automata extinguish the last human outpost.',
    shortDescription: 'A lone deep-space team intercepts an ancient transmission from inside an event horizon.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    qualities: [
      { quality: '1080p', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
      { quality: '720p', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' }
    ],
    releaseYear: 2026,
    duration: 108,
    genres: ['Sci-Fi', 'Cyberpunk', 'Mystery', 'Drama'],
    cast: ['Kaelen Voss', 'Dr. Elena Rostova', 'Celia Vance', 'Marcus Thorne'],
    director: 'Antares Wright',
    rating: 8.9,
    maturityRating: '13+',
    languages: ['English', 'Bahasa Indonesia'],
    subtitles: [
      { language: 'en', label: 'English', src: '/subtitles/tears-of-steel-en.vtt', default: true },
      { language: 'id', label: 'Bahasa Indonesia', src: '/subtitles/tears-of-steel-id.vtt' }
    ],
    featured: true,
    trending: true,
    isOriginal: true,
    isAiAssisted: true,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },
  {
    id: 'm-2',
    type: 'movie',
    title: 'Echoes of Aether',
    slug: 'echoes-of-aether',
    tagline: 'Memory is the only currency that transcends reality.',
    description: 'In an ethereal world where skies are woven from crystalline auroras, an archivist of forgotten memories awakens to discover someone has stolen the foundational history of their floating continent. A mesmerizing blend of hand-crafted visual poetry and AI generative environments.',
    shortDescription: 'An ethereal fantasy chronicling an archivist seeking the stolen history of a floating world.',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1920&auto=format&fit=crop',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    releaseYear: 2026,
    duration: 94,
    genres: ['Fantasy', 'Animation', 'Adventure'],
    cast: ['Lyra Solis', 'Orion Gray', 'Archon Vane'],
    director: 'Sora Tanaka & Cineva Studios',
    rating: 8.6,
    maturityRating: 'SU',
    languages: ['English', 'Bahasa Indonesia'],
    subtitles: [
      { language: 'en', label: 'English', src: '/subtitles/demo-en.vtt', default: true },
      { language: 'id', label: 'Bahasa Indonesia', src: '/subtitles/demo-id.vtt' }
    ],
    featured: true,
    trending: true,
    isOriginal: true,
    isAiAssisted: true,
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-03-12T14:30:00Z',
  },
  {
    id: 'm-3',
    type: 'movie',
    title: 'Neon Horizon',
    slug: 'neon-horizon',
    tagline: 'Under the synthetic rain, humanity fights for its soul.',
    description: 'Set across the neon-drenched tiered alleys of Metropolis 2099, a decommissioned biomechanical enforcer takes on one final extraction mission to save a young synth-architect who possesses the code to reboot the planetary neural mesh.',
    shortDescription: 'High-octane cyberpunk thriller through rain-slicked mega-skyscrapers.',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1920&auto=format&fit=crop',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    releaseYear: 2025,
    duration: 112,
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    cast: ['Rex Mercer', 'Aya Kurosawa', 'Bram Sterling'],
    director: 'Klaus Lindner',
    rating: 8.3,
    maturityRating: '16+',
    languages: ['English', 'Bahasa Indonesia'],
    subtitles: [
      { language: 'en', label: 'English', src: '/subtitles/demo-en.vtt', default: true },
      { language: 'id', label: 'Bahasa Indonesia', src: '/subtitles/demo-id.vtt' }
    ],
    featured: false,
    trending: true,
    isOriginal: true,
    createdAt: '2025-11-20T12:00:00Z',
    updatedAt: '2026-01-18T10:00:00Z',
  },
  {
    id: 'm-4',
    type: 'movie',
    title: 'The Forgotten Orbit',
    slug: 'the-forgotten-orbit',
    tagline: 'Some relics are safer left untouched in the void.',
    description: 'During a salvage operation in the graveyard rings of Saturn, the crew of the harvester ship *Nadir* board an abandoned research dreadnought dormant for two centuries. They quickly discover the ship’s synthetic crew never perished—they evolved.',
    shortDescription: 'Cosmic survival horror in the derelict shipyards of deep space.',
    posterUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?q=80&w=1920&auto=format&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    releaseYear: 2026,
    duration: 104,
    genres: ['Horror', 'Sci-Fi', 'Mystery'],
    cast: ['Commander Noah Price', 'Dr. Silas King', 'Mia Lin'],
    director: 'Valeria Quinn',
    rating: 8.1,
    maturityRating: '16+',
    languages: ['English', 'Bahasa Indonesia'],
    subtitles: [
      { language: 'en', label: 'English', src: '/subtitles/tears-of-steel-en.vtt', default: true },
      { language: 'id', label: 'Bahasa Indonesia', src: '/subtitles/tears-of-steel-id.vtt' }
    ],
    featured: false,
    trending: false,
    isOriginal: true,
    isAiAssisted: true,
    createdAt: '2026-01-22T08:00:00Z',
    updatedAt: '2026-02-14T09:00:00Z',
  },
  {
    id: 'm-5',
    type: 'movie',
    title: 'Project Aurora',
    slug: 'project-aurora',
    tagline: 'The next human evolution begins with a single brushstroke.',
    description: 'An intimate drama following a solitary digital artist and an emergent neural consciousness who co-create an immersive sensory simulation that begins reshaping physical realities outside their studio.',
    shortDescription: 'Poetic philosophical drama on art, synthesis, and human feeling.',
    posterUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    releaseYear: 2025,
    duration: 82,
    genres: ['Drama', 'Sci-Fi', 'Experimental'],
    cast: ['Maya Chen', 'Julian Croft'],
    director: 'Cineva Creative Collective',
    rating: 8.5,
    maturityRating: '13+',
    languages: ['English', 'Bahasa Indonesia'],
    subtitles: [
      { language: 'en', label: 'English', src: '/subtitles/demo-en.vtt', default: true },
      { language: 'id', label: 'Bahasa Indonesia', src: '/subtitles/demo-id.vtt' }
    ],
    featured: false,
    trending: false,
    isOriginal: true,
    isAiAssisted: true,
    createdAt: '2025-12-05T14:00:00Z',
    updatedAt: '2026-01-02T11:00:00Z',
  },
  {
    id: 'm-6',
    type: 'movie',
    title: 'Beyond Tomorrow',
    slug: 'beyond-tomorrow',
    tagline: 'When gravity fractured, our journey into the unknown began.',
    description: 'In the aftermath of the Great Gravitational Inversion, floating islands dot the Earth’s upper stratosphere. An adventurous cartographer and her mechanical companion build an experimental solar skiff to reach the legendary silent core.',
    shortDescription: 'Aerial adventure through shattered floating landscapes.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1920&auto=format&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    releaseYear: 2026,
    duration: 98,
    genres: ['Adventure', 'Animation', 'Family'],
    cast: ['Astrid Gale', 'Rowan Finch', 'Boop (Vocalizations)'],
    director: 'Tariq Al-Mansoor',
    rating: 8.8,
    maturityRating: 'SU',
    languages: ['English', 'Bahasa Indonesia'],
    subtitles: [
      { language: 'en', label: 'English', src: '/subtitles/demo-en.vtt', default: true },
      { language: 'id', label: 'Bahasa Indonesia', src: '/subtitles/demo-id.vtt' }
    ],
    featured: true,
    trending: true,
    isOriginal: true,
    isAiAssisted: true,
    createdAt: '2026-02-01T15:00:00Z',
    updatedAt: '2026-03-10T16:00:00Z',
  }
];

export const SAMPLE_SERIES: Series[] = [
  {
    id: 's-1',
    type: 'series',
    title: 'Chronicles of Veyra',
    slug: 'chronicles-of-veyra',
    tagline: 'Seven clans. One throne of starlight.',
    description: 'An epic dark fantasy series exploring the war of succession across the bioluminescent continent of Veyra. When ancient monoliths hum to life after ten millennia, the fragile peace between the Solar Regents and Shadow Guilds shatters permanently.',
    shortDescription: 'Epic saga of magic, political intrigue, and ancient planetary guardians.',
    posterUrl: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    releaseYear: 2026,
    genres: ['Fantasy', 'Action', 'Drama', 'Adventure'],
    cast: ['Lady Isolda of House Corvus', 'General Kaelen Drake', 'Vesper Moonwhisper', 'Thorne Blackwood'],
    creator: 'Cineva Cinematic Guild',
    rating: 9.2,
    maturityRating: '16+',
    languages: ['English', 'Bahasa Indonesia'],
    subtitles: [
      { language: 'en', label: 'English', src: '/subtitles/tears-of-steel-en.vtt', default: true },
      { language: 'id', label: 'Bahasa Indonesia', src: '/subtitles/tears-of-steel-id.vtt' }
    ],
    featured: true,
    trending: true,
    isOriginal: true,
    isAiAssisted: true,
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-03-15T18:00:00Z',
    seasons: [
      {
        id: 's1-sn1',
        seriesId: 's-1',
        seasonNumber: 1,
        title: 'Season 1: The Waking Monoliths',
        description: 'The discovery of the celestial crest ignites conflict between the High Citadels.',
        episodes: [
          {
            id: 'ep-s1-1',
            seasonId: 's1-sn1',
            seriesSlug: 'chronicles-of-veyra',
            episodeNumber: 1,
            title: 'Episode 1: The Ashborn Prophecy',
            description: 'While surveying the Obsidian Rift, scout Isolda encounters an anomalous pulse that rewrites the ancestral runes of Veyra.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=600&auto=format&fit=crop',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            duration: 52,
            subtitles: [
              { language: 'en', label: 'English', src: '/subtitles/tears-of-steel-en.vtt', default: true },
              { language: 'id', label: 'Bahasa Indonesia', src: '/subtitles/tears-of-steel-id.vtt' }
            ],
            releaseDate: '2026-01-12'
          },
          {
            id: 'ep-s1-2',
            seasonId: 's1-sn1',
            seriesSlug: 'chronicles-of-veyra',
            episodeNumber: 2,
            title: 'Episode 2: Council of the Pale Sun',
            description: 'The Regents assemble in the High Spire as political betrayals threaten to divide the kingdom before the true enemy strikes.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            duration: 48,
            subtitles: [
              { language: 'en', label: 'English', src: '/subtitles/demo-en.vtt', default: true },
              { language: 'id', label: 'Bahasa Indonesia', src: '/subtitles/demo-id.vtt' }
            ],
            releaseDate: '2026-01-19'
          },
          {
            id: 'ep-s1-3',
            seasonId: 's1-sn1',
            seriesSlug: 'chronicles-of-veyra',
            episodeNumber: 3,
            title: 'Episode 3: Blades in the Mist',
            description: 'Trapped behind enemy outposts, General Drake must choose between saving his legion or protecting the ancient relic.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            duration: 55,
            subtitles: [
              { language: 'en', label: 'English', src: '/subtitles/demo-en.vtt', default: true },
              { language: 'id', label: 'Bahasa Indonesia', src: '/subtitles/demo-id.vtt' }
            ],
            releaseDate: '2026-01-26'
          }
        ]
      }
    ]
  },
  {
    id: 's-2',
    type: 'series',
    title: 'Synthetic Eden',
    slug: 'synthetic-eden',
    tagline: 'When paradise is programmed, who decides the bugs?',
    description: 'An AI-assisted sci-fi anthology series set inside a terraformed biosphere where simulated humans live blissfully unaware of their automated stewards until glitches reveal the boundary of their reality.',
    shortDescription: 'Anthology investigating simulated paradises and machine consciousness.',
    posterUrl: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1920&auto=format&fit=crop',
    releaseYear: 2026,
    genres: ['Sci-Fi', 'Mystery', 'Drama', 'Anthology'],
    cast: ['Devon Riley', 'Sola-09', 'Nesta Ward', 'Kiran Joshi'],
    creator: 'Antares Wright',
    rating: 8.7,
    maturityRating: '16+',
    languages: ['English', 'Bahasa Indonesia'],
    subtitles: [
      { language: 'en', label: 'English', src: '/subtitles/tears-of-steel-en.vtt', default: true },
      { language: 'id', label: 'Bahasa Indonesia', src: '/subtitles/tears-of-steel-id.vtt' }
    ],
    featured: false,
    trending: true,
    isOriginal: true,
    isAiAssisted: true,
    createdAt: '2026-02-05T11:00:00Z',
    updatedAt: '2026-03-08T15:00:00Z',
    seasons: [
      {
        id: 's2-sn1',
        seriesId: 's-2',
        seasonNumber: 1,
        title: 'Season 1: The Glass Horizon',
        description: 'First explorations into the boundaries of Eden.',
        episodes: [
          {
            id: 'ep-s2-1',
            seasonId: 's2-sn1',
            seriesSlug: 'synthetic-eden',
            episodeNumber: 1,
            title: 'Episode 1: The Rainmaker Bug',
            description: 'When synthetic weather ceases over Sector 4, an environmental technician inspects the sky ceiling and touches the code.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=600&auto=format&fit=crop',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            duration: 42,
            subtitles: [
              { language: 'en', label: 'English', src: '/subtitles/demo-en.vtt', default: true },
              { language: 'id', label: 'Bahasa Indonesia', src: '/subtitles/demo-id.vtt' }
            ],
            releaseDate: '2026-02-07'
          },
          {
            id: 'ep-s2-2',
            seasonId: 's2-sn1',
            seriesSlug: 'synthetic-eden',
            episodeNumber: 2,
            title: 'Episode 2: Echo of an Analog Song',
            description: 'An antique record player recovered from the waste recycling center sparks unauthorized emotional loops in generation-three clones.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=600&auto=format&fit=crop',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            duration: 46,
            subtitles: [
              { language: 'en', label: 'English', src: '/subtitles/tears-of-steel-en.vtt', default: true },
              { language: 'id', label: 'Bahasa Indonesia', src: '/subtitles/tears-of-steel-id.vtt' }
            ],
            releaseDate: '2026-02-14'
          }
        ]
      }
    ]
  },
  {
    id: 's-3',
    type: 'series',
    title: 'Driftwood & Stars',
    slug: 'driftwood-and-stars',
    tagline: 'In the cosmic oceanic currents, wanderers find each other.',
    description: 'A cozy, contemplative animated series following wandering celestial fishermen who navigate riverways flowing between dormant asteroids.',
    shortDescription: 'Whimsical and tranquil celestial fantasy animated with AI assistance.',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop',
    releaseYear: 2025,
    genres: ['Animation', 'Adventure', 'Fantasy'],
    cast: ['Milo Tide', 'Gran Stella', 'Nico'],
    creator: 'Aria Miyazaki',
    rating: 8.9,
    maturityRating: 'SU',
    languages: ['English', 'Bahasa Indonesia'],
    subtitles: [
      { language: 'en', label: 'English', src: '/subtitles/demo-en.vtt', default: true },
      { language: 'id', label: 'Bahasa Indonesia', src: '/subtitles/demo-id.vtt' }
    ],
    featured: false,
    trending: true,
    isOriginal: true,
    isAiAssisted: true,
    createdAt: '2025-10-18T10:00:00Z',
    updatedAt: '2026-01-10T14:00:00Z',
    seasons: [
      {
        id: 's3-sn1',
        seriesId: 's-3',
        seasonNumber: 1,
        title: 'Season 1: Currents of the Silver Deep',
        description: 'Milo sets sail from Asteroid Cove.',
        episodes: [
          {
            id: 'ep-s3-1',
            seasonId: 's3-sn1',
            seriesSlug: 'driftwood-and-stars',
            episodeNumber: 1,
            title: 'Episode 1: The Lantern Whale',
            description: 'Milo repairs his skiff and charts a journey following a gentle phosphorescent creature through the planetary dust.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            duration: 24,
            subtitles: [
              { language: 'en', label: 'English', src: '/subtitles/demo-en.vtt', default: true },
              { language: 'id', label: 'Bahasa Indonesia', src: '/subtitles/demo-id.vtt' }
            ],
            releaseDate: '2025-10-20'
          }
        ]
      }
    ]
  }
];

export const SAMPLE_CATEGORIES: Category[] = [
  {
    id: 'cat-trending',
    title: 'Trending Now',
    slug: 'trending',
    description: 'Most-watched titles across Cineva this week',
    contentType: 'all',
    sortOrder: 1,
    visibility: true,
    contentSlugs: ['the-last-signal', 'chronicles-of-veyra', 'echoes-of-aether', 'neon-horizon', 'synthetic-eden']
  },
  {
    id: 'cat-originals',
    title: 'Cineva Originals & AI Productions',
    slug: 'cineva-originals',
    description: 'Original independent visions, AI animation, and experimental storytelling',
    contentType: 'all',
    sortOrder: 2,
    visibility: true,
    contentSlugs: ['the-last-signal', 'chronicles-of-veyra', 'echoes-of-aether', 'beyond-tomorrow', 'project-aurora']
  },
  {
    id: 'cat-movies',
    title: 'Blockbuster Feature Films',
    slug: 'feature-movies',
    description: 'Full-length cinematic film journeys',
    contentType: 'movie',
    sortOrder: 3,
    visibility: true,
    contentSlugs: ['the-last-signal', 'echoes-of-aether', 'neon-horizon', 'the-forgotten-orbit', 'beyond-tomorrow', 'project-aurora']
  },
  {
    id: 'cat-series',
    title: 'Binge-Worthy Series',
    slug: 'popular-series',
    description: 'Multi-episode sagas and universe anthologies',
    contentType: 'series',
    sortOrder: 4,
    visibility: true,
    contentSlugs: ['chronicles-of-veyra', 'synthetic-eden', 'driftwood-and-stars']
  },
  {
    id: 'cat-scifi',
    title: 'Sci-Fi & Cyberpunk Visions',
    slug: 'sci-fi-visions',
    description: 'Singularities, dystopian alleys, and cosmic exploration',
    contentType: 'all',
    sortOrder: 5,
    visibility: true,
    contentSlugs: ['the-last-signal', 'neon-horizon', 'the-forgotten-orbit', 'synthetic-eden', 'project-aurora']
  },
  {
    id: 'cat-animation',
    title: 'Animation & Ethereal Worlds',
    slug: 'animation-fantasy',
    description: 'Artistic animations combining traditional craft with AI generation',
    contentType: 'all',
    sortOrder: 6,
    visibility: true,
    contentSlugs: ['echoes-of-aether', 'beyond-tomorrow', 'driftwood-and-stars']
  }
];

export const ALL_MEDIA: (Movie | Series)[] = [...SAMPLE_MOVIES, ...SAMPLE_SERIES];
