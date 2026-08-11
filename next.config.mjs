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
      { source: '/lp/fathers-day', destination: '/golf-gifts-for-dad', permanent: true }
    ];
  }
};
export default nextConfig;
