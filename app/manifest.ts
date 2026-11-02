import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AdQuest — Learn Ads by Playing',
    short_name: 'AdQuest',
    description: 'Master performance marketing from zero to hero through gamified lessons, simulators, and interview prep.',
    start_url: '/home',
    display: 'standalone',
    background_color: '#FAF8F5',
    theme_color: '#4F46E5',
    icons: [
      {
        src: '/icons/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}

