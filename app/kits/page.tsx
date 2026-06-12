import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts } from '@/lib/catalog';
import { siteUrl } from '@/lib/feed';
import { kitDefinitions, kitProducts } from '@/lib/kits';
import { coreMerchProducts } from '@/lib/merchandisingFilters';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Golf Kits — Curated Bundles That Pass The Bag Test',
  description: "Curated golf kits for trips, dad gifts, and bag upgrades. Every kit is built from in-stock gear that passes The Bag Test. Use WYX10 for 10% off your first order.",
  alternates: { canonical: '/kits' },
  openGraph: {
    title: 'Golf Kits | WYX Golf Supply Co.',
    description: 'Curated golf kits for trips, dad gifts, and bag upgrades — built only from in-stock gear.',
    url: '/kits'
  }
};

export default async function KitsHubPage() {
  const catalog = sortByQuality(coreMerchProducts(availableProducts(await getProducts())));

  const kits = kitDefinitions
    .map((kit) => ({ kit, products: kitProducts(catalog, kit, 4) }))
    .filter(({ products }) => products.length >= 3);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'WYX Golf Kits',
        description: 'Curated golf kits built from in-stock gear that passes The Bag Test.',
        url: `${siteUrl}/kits`
      }) }} />

      <section className="page-hero compact">
        <p className="eyebrow">Curated Bundles</p>
        <h1>Golf Kits Built For Real Rounds.</h1>
        <p>Every kit is assembled from in-stock gear that passes The Bag Test — no filler, no novelty junk, no guessing. Add the whole kit or swap pieces before checkout.</p>
        <div className="actions">
          <Link className="button primary" href="/weekend-golfer-bag-upgrade-kit">The Bag Upgrade Kit</Link>
          <Link className="button secondary dark" href="/the-bag-test">Read The Bag Test</Link>
        </div>
      </section>

      <section className="dark-section reveal" aria-labelledby="core-kit-heading">
        <div>
          <p className="eyebrow">The Core Offer</p>
          <h2 id="core-kit-heading">The Weekend Golfer&apos;s Bag Upgrade Kit.</h2>
          <div className="actions">
            <Link className="button primary" href="/weekend-golfer-bag-upgrade-kit">Get The Kit</Link>
          </div>
        </div>
        <p>Five practical pieces that fix the small annoyances every weekend bag has — towel, marker, grip refresh, groove sharpener, and accessory caddie. All confirmed in stock, all under one order, WYX10 takes 10% off.</p>
      </section>

      {kits.map(({ kit, products }) => (
        <section className="section reveal" key={kit.slug} aria-label={kit.title}>
          <div className="section-heading split">
            <div>
              <p className="eyebrow">{kit.eyebrow}</p>
              <h2>{kit.title}.</h2>
              <p>{kit.description}</p>
            </div>
            <Link className="text-link" href={`/kits/${kit.slug}`}>Build This Kit</Link>
          </div>
          <div className="product-grid">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>
      ))}

      <section className="section reveal" aria-label="More ways to shop">
        <div className="section-heading">
          <p className="eyebrow">Not Sure Where To Start?</p>
          <h2>Shop By Situation Instead.</h2>
        </div>
        <div className="actions">
          <Link className="button primary" href="/golf-gifts">Golf Gifts</Link>
          <Link className="button secondary dark" href="/golf-trip-gear">Trip Gear</Link>
          <Link className="button secondary dark" href="/golf-gifts-under-60">Under $60</Link>
        </div>
      </section>
    </>
  );
}
