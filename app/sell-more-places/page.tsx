import type { Metadata } from 'next';
import Link from 'next/link';
import { EmailCapture } from '@/components/EmailCapture';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts } from '@/lib/catalog';
import { campaignUrl, channelPlan, launchSocialCopy, paidSearchAngles, siteUrl } from '@/lib/marketing';
import { coreMerchProducts, firstBuyProducts } from '@/lib/merchandisingFilters';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Shop WYX Everywhere | Golf Gifts, Hats, Apparel & Trip Gear',
  description: 'Shop WYX Golf Supply Co. by gift, trip, hat, apparel, deal, and bag-upgrade pages.',
  alternates: { canonical: '/sell-more-places' },
  openGraph: {
    title: 'Shop WYX Everywhere | WYX Golf Supply Co.',
    description: 'Shop WYX Golf Supply Co. by gift, trip, hat, apparel, deal, and bag-upgrade pages.',
    url: '/sell-more-places'
  }
};

const quickLinks = [
  ['Golf gifts', '/golf-gifts', 'For gift posts, Google searches, and under-$60 shoppers.'],
  ['Hats', '/products?category=Headwear', 'For social style posts and easy gift carts.'],
  ['Apparel', '/products?category=Apparel', 'For course-ready outfits and weekend golf style.'],
  ['Trip gear', '/golf-trip-gear', 'For bachelor parties, scrambles, and group golf weekends.'],
  ['Launch deals', '/deals', 'For email, retargeting, and first-order traffic.'],
  ['Bag upgrades', '/bag-upgrades', 'For practical accessories and cart builders.']
];

export default async function SellMorePlaces() {
  const catalog = sortByQuality(coreMerchProducts(availableProducts(await getProducts())));
  const firstPicks = firstBuyProducts(catalog).slice(0, 4);
  const fallback = catalog.slice(0, 4);
  const products = firstPicks.length ? firstPicks : fallback;

  return (
    <>
      <section className="page-hero compact">
        <p className="eyebrow">Shop By Need</p>
        <h1>Find The Right Golf Gear Faster.</h1>
        <p>Start with the page that fits the round: gifts, hats, apparel, trip gear, bag upgrades, or launch deals. No digging through a random catalog.</p>
        <div className="actions">
          <Link className="button primary" href="#channel-links">Choose Your Gear</Link>
          <Link className="button secondary dark" href="/products">Shop All Gear</Link>
        </div>
      </section>

      <section id="channel-links" className="section channel-hub-grid">
        {channelPlan.map((channel) => <article key={channel.channel} className="channel-card">
          <p className="eyebrow">{channel.channel}</p>
          <h2>{channel.audience}</h2>
          <p>{channel.promise}</p>
          <Link className="button primary" href={campaignUrl(channel.href, channel.campaign)}>{channel.cta}</Link>
        </article>)}
      </section>

      <section className="section seo-guide">
        <div>
          <p className="eyebrow">Fast Links</p>
          <h2>Start With The Right Shelf.</h2>
          <p>Gift shoppers, trip planners, scramble captains, and weekend golfers should not have to hunt for the right products.</p>
        </div>
        <div className="collection-copy-grid">
          {quickLinks.map(([label, href, copy]) => <article key={href}>
            <h3>{label}</h3>
            <p>{copy}</p>
            <Link className="text-link" href={campaignUrl(href, `quick_${label.toLowerCase().replaceAll(' ', '_')}`)}>Shop {label}</Link>
          </article>)}
        </div>
      </section>

      {products.length > 0 && <section className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Start Here</p>
            <h2>Easy Products To Add First.</h2>
          </div>
          <Link className="text-link" href="/products">Browse Full Shop</Link>
        </div>
        <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </section>}

      <section className="section channel-copy-section">
        <div>
          <p className="eyebrow">Quick Notes</p>
          <h2>What WYX Is Good For.</h2>
          <div className="copy-bank-grid">
            {launchSocialCopy.slice(0, 6).map((copy) => <article key={copy}><p>{copy}</p></article>)}
          </div>
        </div>
        <div>
          <p className="eyebrow">Popular Searches</p>
          <h2>Golf Gear People Are Looking For.</h2>
          <ul className="channel-list">{paidSearchAngles.slice(0, 10).map((angle) => <li key={angle}>{angle}</li>)}</ul>
        </div>
      </section>

      <EmailCapture source="sell-more-places" campaign="multi_channel_hub" title="Get WYX Drops Wherever You Shop." body="Join the list for launch offers, social drops, golf gift ideas, trip gear, and useful bag upgrades." />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Shop WYX Everywhere',
          description: metadata.description,
          url: `${siteUrl}/sell-more-places`,
          isPartOf: { '@type': 'WebSite', name: 'WYX Golf Supply Co.', url: siteUrl }
        },
        {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'WYX shopping paths',
          itemListElement: quickLinks.map(([label, href], index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: label,
            url: `${siteUrl}${href}`
          }))
        }
      ]) }} />
    </>
  );
}
