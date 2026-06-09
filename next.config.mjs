/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.shopify.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'ae-pic-a1.aliexpress-media.com' }
    ]
  },
  async redirects() {
    return [
      // Old/renamed product handles → current catalog
      {
        source: '/products/12-foot-golf-ball-retriever',
        destination: '/products/golf-ball-retriever-21-foot-collapsible-telescoping',
        permanent: true
      },
      {
        source: '/products/premium-cabretta-leather-golf-glove',
        destination: '/products/cabretta-golf-glove-3-pack-left-hand-ml',
        permanent: true
      },
      {
        source: '/products/coastal-green-driver-headcover',
        destination: '/golf-headcovers',
        permanent: true
      },
      {
        source: '/products/golf-rangefinder-case-magnetic-belt-clip',
        destination: '/products/golf-rangefinder-case-hard-shell-magnetic-clip',
        permanent: true
      },
      {
        source: '/products/bamboo-performance-golf-tees-50-pack',
        destination: '/golf-gifts-under-25',
        permanent: true
      },
    ];
  }
};
export default nextConfig;
