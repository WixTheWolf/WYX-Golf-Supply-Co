import type { Metadata } from 'next';
import Link from 'next/link';
import { EditorialProductCard } from '@/components/EditorialProductCard';
import { EmailCapture } from '@/components/EmailCapture';
import { availableProducts } from '@/lib/catalog';
import { siteUrl } from '@/lib/feed';
import { coreMerchProducts } from '@/lib/merchandisingFilters';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Hidden Gem Golf Gear — Accessories You Didn\'t Know You Needed | WYX',
  description: 'Curated hidden-gem golf accessories: cart phone mounts, divot boards, chipping nets, alignment towels, and more. Practical gear weekend golfers love once they see it. WYX10 saves 10%.',
  alternates: { canonical: '/hidden-gems' },
  openGraph: {
    title: 'Hidden Gem Golf Gear | WYX Golf Supply Co.',
    description: 'Golf accessories you didn\'t know you needed — until you see them in your bag.',
    url: '/hidden-gems'
  }
};

const highlights = [
  { title: 'Cart upgrades', copy: 'Phone mounts, cup holders, umbrella clips — small swaps that fix real cart annoyances.' },
  { title: 'Train smarter', copy: 'Divot boards, putting arcs, and pop-up nets for reps without a range trip.' },
  { title: 'Under $50', copy: 'Impulse-friendly price points with gift-worthy packaging stories.' }
];

export default async function HiddenGemsPage() {
  const catalog = sortByQuality(coreMerchProducts(availableProducts(await getProducts())));
  const hiddenGems = catalog.filter((product) =>
    (product.tags || []).some((tag) => tag.toLowerCase() === 'hidden-gem')
  );
  const fallback = catalog.filter((product) =>
    /cart|mount|retriever|chipping|putting arc|alignment towel|divot board|cup holder|umbrella holder/i.test(`${product.title} ${product.handle}`)
  );
  const products = (hiddenGems.length ? hiddenGems : fallback).slice(0, 12);

  return (
    <>
      <section className="deal-hero">
        <div>
          <p className="eyebrow">Hidden Gems</p>
          <h1>Golf Gear You Didn&apos;t Know You Needed.</h1>
          <p>These are the cart mounts, training aids, and bag upgrades that make golfers stop mid-round and ask &ldquo;where did you get that?&rdquo; Every pick passes The Bag Test. WYX10 saves 10%.</p>
          <div className="actions">
            <Link className="button primary" href="#hidden-gems-grid">Shop Hidden Gems</Link>
            <Link className="button secondary dark" href="/kits/hidden-gem-starter-kit">Hidden Gem Kit</Link>
          </div>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Why these convert</p>
          <h2>See it. Want it. Buy it.</h2>
          <p>Hidden gems solve a visible problem in 10 seconds — wobbly cups, lost phones, wasted balls in water, or putting strokes with no feedback. No spec sheet required.</p>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Hidden gem highlights">
        <span>Cart life upgrades</span>
        <span>Backyard practice</span>
        <span>Under $50 picks</span>
        <span>WYX10 saves 10%</span>
      </section>

      <section className="section reveal">
        <div className="care-step-grid">
          {highlights.map((item) => (
            <div className="care-step-card" key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="hidden-gems-grid" className="section product-section">
        <div className="section-heading">
          <p className="eyebrow">Curated Picks</p>
          <h2>Hidden Gems In Stock Now.</h2>
        </div>
        {products.length ? (
          <div className="editorial-product-grid">
            {products.map((product, index) => (
              <EditorialProductCard key={product.id} product={product} featured={index === 0} />
            ))}
          </div>
        ) : (
          <p>Fresh hidden gems are on the way — check back soon or <Link href="/products">shop the full catalog</Link>.</p>
        )}
      </section>

      <EmailCapture
        source="hidden-gems"
        campaign="hidden_gems"
        title="Get the next hidden gem first."
        body="New cart upgrades and training aids land here before they hit the homepage. WYX10 saves 10% on your first order."
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Hidden Gem Golf Gear',
        url: `${siteUrl}/hidden-gems`
      }) }} />
    </>
  );
}