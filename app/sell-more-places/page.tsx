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
  description: 'Find WYX Golf Supply Co. through social, email, search, group golf gift guides, launch deals, and curated golf product pages.',
  alternates: { canonical: '/sell-more-places' }
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
        <p className="eyebrow">Shop WYX Everywhere</p>
        <h1>More Ways To Find The Right Golf Gear.</h1>
        <p>Use this hub for social bios, email campaigns, group golf buyers, search traffic, and launch promotions. It routes shoppers to the right WYX page instead of forcing every buyer through the same homepage.</p>
        <div className="actions">
          <Link className="button primary" href="#channel-links">Choose A Buying Path</Link>
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
          <h2>Send Each Customer To The Best Page.</h2>
          <p>Different buyers need different doors into the shop. These links are built for bios, captions, email buttons, group chats, QR codes, and paid ads.</p>
        </div>
        <div className="collection-copy-grid">
          {quickLinks.map(([label, href, copy]) => <article key={href}>
            <h3>{label}</h3>
            <p>{copy}</p>
            <Link className="text-link" href={campaignUrl(href, `quick_${label.toLowerCase().replaceAll(' ', '_')}`)}>Open {label}</Link>
          </article>)}
        </div>
      </section>

      {products.length > 0 && <section className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Best First Clicks</p>
            <h2>Products Worth Sending Traffic To.</h2>
          </div>
          <Link className="text-link" href="/products">Browse Full Shop</Link>
        </div>
        <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </section>}

      <section className="section channel-copy-section">
        <div>
          <p className="eyebrow">Copy Bank</p>
          <h2>Use These Posts To Drive Traffic.</h2>
          <div className="copy-bank-grid">
            {launchSocialCopy.slice(0, 6).map((copy) => <article key={copy}><p>{copy}</p></article>)}
          </div>
        </div>
        <div>
          <p className="eyebrow">Search Angles</p>
          <h2>Campaigns To Build Around.</h2>
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
          name: 'WYX multi-channel shopping paths',
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
