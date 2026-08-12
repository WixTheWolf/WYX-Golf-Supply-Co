import { siteUrl } from '@/lib/marketing';

const storeName = 'WYX Golf Supply Co.';
const description = 'Modern golf apparel and gear for the course, the trip, and everything after the round. A smaller, sharper WYX edit.';
const golfEnvironmentImage = 'https://images.unsplash.com/photo-1684599995533-3ffecba8fb81?auto=format&fit=crop&w=1600&q=84';

export function SeoJsonLd() {
  const logo = `${siteUrl}/icon.svg`;

  const data = [
    {
      '@context': 'https://schema.org',
      '@type': 'OnlineStore',
      '@id': `${siteUrl}/#store`,
      name: storeName,
      url: siteUrl,
      logo,
      image: golfEnvironmentImage,
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
      logo,
      image: golfEnvironmentImage,
      description
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      name: storeName,
      url: siteUrl,
      publisher: { '@id': `${siteUrl}/#organization` }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'OfferCatalog',
      '@id': `${siteUrl}/#offer-catalog`,
      name: 'WYX Golf Supply Co. product categories',
      itemListElement: [
        { '@type': 'OfferCatalog', name: 'Golf Apparel', url: `${siteUrl}/apparel` },
        { '@type': 'OfferCatalog', name: 'Golf Headwear', url: `${siteUrl}/products?category=Headwear` },
        { '@type': 'OfferCatalog', name: 'Golf Accessories', url: `${siteUrl}/products?category=Accessories` },
        { '@type': 'OfferCatalog', name: 'Golf Trip Gear', url: `${siteUrl}/golf-trip-gear` },
        { '@type': 'OfferCatalog', name: 'Golf Gifts', url: `${siteUrl}/golf-gifts` }
      ]
    }
  ];

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
