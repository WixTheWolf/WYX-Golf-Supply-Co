import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'WYX Golf Supply Co.',
    short_name: 'WYX Golf',
    description: 'Practical golf gifts, trip gear, and bag upgrades for weekend golfers. Every product passes The Bag Test.',
    start_url: '/',
    display: 'standalone',
    background_color: '#10271e',
    theme_color: '#10271e',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' }
    ]
  };
}
