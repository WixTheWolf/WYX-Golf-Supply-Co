import type { Metadata } from 'next';
import Link from 'next/link';
import { EmailCapture } from '@/components/EmailCapture';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts } from '@/lib/catalog';
import { productPrice, siteUrl } from '@/lib/feed';
import { campaignUrl } from '@/lib/marketing';
import { coreMerchProducts } from '@/lib/merchandisingFilters';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Golf Gifts Under $60',
  description: 'Shop useful golf gifts under $60, including towels, tees, gloves, ball markers, club-care tools, and practice aids from WYX Golf Supply Co.',
  alternates: { canonical: '/golf-gifts-under-60' },
  openGraph: {
    title: 'Golf Gifts Under $60',
    description: 'Useful golf gifts and bag upgrades selected for weekend golfers.',
    url: '/golf-gifts-under-60'
  }
};

export default async function GolfGiftsUnder60() {
  const products = coreMerchProducts(availableProducts(await getProducts()))
    .filter((product) => Number(productPrice(product).amount) <= 60)
    .slice(0, 12);

  return (
    <>
      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Gifts Under $60</p>
          <h1>Golf Gifts Under $60 That Actually Get Used.</h1>
          <p>Easy golf gifts for players who already have enough polos and bad swing advice. Start with towels, markers, balls, caddies, and small bag upgrades.</p>
          <div className="actions">
            <Link className="button primary" href="#gift-grid">Shop Gift Picks</Link>
            <Link className="button secondary dark" href="/first-sale">Use WYX10</Link>
          </div>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Launch Code</p>
          <h2>WYX10 Saves 10%</h2>
          <p>Use the launch code at checkout. Great for golfers, coaches, league partners, and last-minute gifts.</p>
        </aside>
      </section>
      <section className="deal-strip" aria-label="Gift shopping benefits">
        <span>Under-$60 golf gifts</span>
        <span>Easy gift picks</span>
        <span>Useful bag upgrades</span>
        <span>Fast first-order picks</span>
      </section>
      <section id="gift-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">{products.length} Giftable Picks</p>
            <h2>Ready To Add To Cart.</h2>
          </div>
          <Link className="text-link" href={campaignUrl('/deals', 'golf_gifts_under_60')}>Shop All Deals</Link>
        </div>
        <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </section>
      <section className="section reveal" aria-labelledby="tiers-heading">
        <div className="section-heading">
          <p className="eyebrow">Other Budgets</p>
          <h2 id="tiers-heading">All Price Ranges.</h2>
        </div>
        <div className="care-step-grid">
          <Link href="/golf-gifts-under-25" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Under $25</strong>
            <p>Stocking-stuffer accessories that earn a permanent bag spot.</p>
          </Link>
          <Link href="/golf-gifts-under-35" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Under $35</strong>
            <p>The sweet spot for practical everyday-use picks.</p>
          </Link>
          <Link href="/golf-gifts-under-50" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Under $50</strong>
            <p>Glove 3-packs, markers, alignment sticks, and the complete bag tier.</p>
          </Link>
          <Link href="/golf-gifts-under-75" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Under $75</strong>
            <p>Leather accessories and training aids that earn a bag spot.</p>
          </Link>
        </div>
      </section>

      <section className="section reveal" aria-labelledby="links-heading">
        <div className="section-heading">
          <p className="eyebrow">More Gift Ideas</p>
          <h2 id="links-heading">Golf Gifts by Recipient.</h2>
        </div>
        <div className="care-step-grid">
          <Link href="/golf-gifts-for-husband" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Gifts for Husband</strong><p>Practical picks for the husband who golfs</p></Link>
          <Link href="/golf-gifts-for-wife" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Gifts for Wife</strong><p>Engraving-ready leather and GPS watch picks</p></Link>
          <Link href="/golf-gifts-for-mom" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Gifts for Mom</strong><p>Six picks under $50 — practical and thoughtful</p></Link>
          <Link href="/golf-birthday-gifts" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Birthday Gifts</strong><p>Budget-tiered picks for any birthday budget</p></Link>
        </div>
      </section>

      <EmailCapture source="golf-gifts-under-60" campaign="golf_gifts_launch_list" title="Need Golf Gift Ideas Later?" body="Join the WYX list for under-$60 gift picks, useful bag upgrades, and launch offers." />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Gifts Under $60',
        description: metadata.description,
        url: `${siteUrl}/golf-gifts-under-60`,
        mainEntity: products.map((product) => ({ '@type': 'Product', name: product.title, url: `${siteUrl}/products/${product.handle}`, image: product.featuredImage?.url }))
      }) }} />
    </>
  );
}
