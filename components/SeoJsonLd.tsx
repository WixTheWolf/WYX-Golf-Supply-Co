import { siteUrl } from '@/lib/marketing';

const storeName = 'WYX Golf Supply Co.';
const description = 'A curated online golf shop for useful golf gifts, trip gear, hats, apparel, and bag upgrades for weekend golfers.';

export function SeoJsonLd() {
  const data = [
    {
      '@context': 'https://schema.org',
      '@type': 'OnlineStore',
      '@id': `${siteUrl}/#store`,
      name: storeName,
      url: siteUrl,
      logo: `${siteUrl}/images/hero-coastal-fairway.png`,
      image: `${siteUrl}/images/hero-coastal-fairway.png`,
      description,
      email: 'support@wyxgolfsupply.com',
      priceRange: '$$'
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: storeName,
      url: siteUrl,
      logo: `${siteUrl}/images/hero-coastal-fairway.png`,
      description,
      sameAs: []
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      name: storeName,
      url: siteUrl,
      publisher: { '@id': `${siteUrl}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/products?category={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'OfferCatalog',
      '@id': `${siteUrl}/#offer-catalog`,
      name: 'WYX Golf Supply Co. product categories',
      itemListElement: [
        { '@type': 'OfferCatalog', name: 'Golf Gifts', url: `${siteUrl}/golf-gifts` },
        { '@type': 'OfferCatalog', name: 'Golf Trip Gear', url: `${siteUrl}/golf-trip-gear` },
        { '@type': 'OfferCatalog', name: 'Golf Hats', url: `${siteUrl}/products?category=Headwear` },
        { '@type': 'OfferCatalog', name: 'Golf Apparel', url: `${siteUrl}/products?category=Apparel` },
        { '@type': 'OfferCatalog', name: 'Golf Bag Upgrades', url: `${siteUrl}/bag-upgrades` }
      ]
    }
  ];

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
