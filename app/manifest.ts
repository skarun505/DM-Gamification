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
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
