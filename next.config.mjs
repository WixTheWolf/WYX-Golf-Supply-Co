/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.shopify.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'ae-pic-a1.aliexpress-media.com' }
    ]
  },
  async redirects() {
    return [
      { source: '/fathers-day-golf-gifts', destination: '/golf-gifts-for-dad', permanent: true },
      { source: '/last-minute-fathers-day-golf-gifts', destination: '/golf-gifts-for-dad', permanent: true },
      { source: '/lp/fathers-day', destination: '/golf-gifts-for-dad', permanent: true },
      { source: '/open', destination: '/', permanent: true },
      { source: '/short-list', destination: '/#wyx-radar', permanent: true },
      { source: '/swing-correction', destination: '/products', permanent: true },
      { source: '/golf-rain-gear', destination: '/golf-trip-gear', permanent: true },
      { source: '/golf-putter-headcovers', destination: '/products?category=Accessories', permanent: true },
      { source: '/lp/hidden-gems', destination: '/products', permanent: true }
    ];
  }
};
export default nextConfig;
