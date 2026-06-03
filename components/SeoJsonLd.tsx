import { siteUrl } from '@/lib/marketing';

export function SeoJsonLd() {
  const data = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'WYX Golf Supply Co.',
      url: siteUrl,
      logo: `${siteUrl}/images/hero-coastal-fairway.png`,
      sameAs: []
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'WYX Golf Supply Co.',
      url: siteUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/products?category={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    }
  ];

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
