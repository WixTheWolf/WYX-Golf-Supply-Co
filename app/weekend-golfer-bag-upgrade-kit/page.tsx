import type { Metadata } from 'next';
import Link from 'next/link';
import { EmailCapture } from '@/components/EmailCapture';
import { KitAddButton } from '@/components/KitAddButton';
import { ProductCard } from '@/components/ProductCard';
import { productPrice, siteUrl } from '@/lib/feed';
import { getProduct } from '@/lib/shopify/products';
import { cleanText } from '@/lib/text';

export const revalidate = 300;

export const metadata: Metadata = {
  title: "The Weekend Golfer's Bag Upgrade Kit | WYX Golf Supply Co.",
  description: "In-stock pieces that fix the small annoyances every weekend golf bag has — a towel, a marker, a grip refresh, a groove sharpener, and an accessory caddie. Use WYX10 for 10% off.",
  alternates: { canonical: '/weekend-golfer-bag-upgrade-kit' },
  openGraph: {
    title: "The Weekend Golfer's Bag Upgrade Kit | WYX Golf Supply Co.",
    description: "Practical, in-stock bag upgrades bundled into one kit. Use WYX10 for 10% off your first order.",
    url: '/weekend-golfer-bag-upgrade-kit'
  }
};

const KIT_HANDLES = [
  'tri-fold-microfiber-golf-towel',
  'three-rail-ball-marker',
  'pulse-golf-overgrip-tape',
  'groove-sharpener-cleaner-tool',
  'glove-accessory-caddie-gray'
];

const itemNotes: Record<string, string> = {
  'tri-fold-microfiber-golf-towel': 'Clips to the bag and handles club faces, balls, and grips between shots.',
  'three-rail-ball-marker': "A marker that's easy to find in a pocket and easy to set down on the green.",
  'pulse-golf-overgrip-tape': 'An easy at-home grip refresh for clubs that have gone slick since last season.',
  'groove-sharpener-cleaner-tool': 'Restores clean grooves on wedges and irons so the face grips the ball the way it should.',
  'glove-accessory-caddie-gray': 'A dedicated spot for gloves, tees, and the small stuff that usually ends up loose in the bottom pocket.'
};

const whoItsFor = [
  {
    title: 'Weekend Golfers',
    body: 'You play 12-30 rounds a year and your bag has slowly filled with stuff that does not work, is missing, or is the wrong size. This kit fixes the five most common gaps in one order.'
  },
  {
    title: 'Gift Buyers',
    body: "Don't know what he needs? This is the safe pick — five small, practical items almost every golfer can use, instead of one big item that might miss."
  },
  {
    title: 'New Golfers',
    body: 'If you just started playing, this kit covers the basics nobody tells you to buy until you are standing on the first tee without them.'
  }
];

const freeTools = [
  {
    title: "The Gift-Giver's Cheat Sheet",
    body: "A short guide to picking a golf gift when you don't golf — what matters, what doesn't, and what to skip entirely."
  },
  {
    title: 'The Bag Audit Checklist',
    body: 'A 2-minute checklist for what should be in a weekend bag right now, and what is probably expired, broken, or missing.'
  },
  {
    title: 'Optional Gift Reminder',
    body: "Add your details at checkout and we'll send a quiet reminder before the next gifting date. Skip it if you don't need it."
  }
];

const faq = [
  {
    q: 'Is this a real bundle or separate items?',
    a: "Each item ships as a separate product, added to your cart together. You can remove or adjust quantities before checkout — nothing is hidden or bundled into one mystery box."
  },
  {
    q: 'What if an item runs out of stock?',
    a: 'We only show items that are confirmed in stock. If something sells out, it drops off this page until it is back — we will not swap in a different product without telling you.'
  },
  {
    q: 'Does WYX10 work on this kit?',
    a: 'Yes. Use WYX10 at checkout for 10% off your first order, including every item in this kit.'
  }
];

export default async function BagUpgradeKitPage() {
  const products = (await Promise.all(KIT_HANDLES.map((handle) => getProduct(handle))))
    .filter((product): product is NonNullable<typeof product> => Boolean(product) && product!.availableForSale);

  const lines = products
    .map((product) => product.variants.find((variant) => variant.availableForSale))
    .filter(Boolean)
    .map((variant) => ({ merchandiseId: variant!.id, quantity: 1 }));

  const total = products.reduce((sum, product) => sum + Number(productPrice(product).amount), 0);
  const formattedTotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total);

  const ctaLabel = products.length === KIT_HANDLES.length
    ? 'Get The Kit'
    : products.length > 0
      ? 'Build From Available Picks'
      : 'Join The Kit Drop';

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: "The Weekend Golfer's Bag Upgrade Kit",
      description: 'Practical, in-stock golf bag upgrades bundled into one order.',
      url: `${siteUrl}/weekend-golfer-bag-upgrade-kit`,
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: cleanText(product.title),
        url: `${siteUrl}/products/${product.handle}`,
        item: {
          '@type': 'Product',
          name: cleanText(product.title),
          url: `${siteUrl}/products/${product.handle}`,
          image: product.featuredImage?.url,
          offers: {
            '@type': 'Offer',
            price: productPrice(product).amount,
            priceCurrency: productPrice(product).currencyCode,
            availability: 'https://schema.org/InStock'
          }
        }
      }))
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: "Weekend Golfer's Bag Upgrade Kit", item: `${siteUrl}/weekend-golfer-bag-upgrade-kit` }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a }
      }))
    }
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="page-hero compact">
        <p className="eyebrow">The Core Offer</p>
        <h1>The Weekend Golfer&apos;s Bag Upgrade Kit</h1>
        <p>A practical golf gift kit built around gear he&apos;ll actually keep in the bag — a clean towel, a marker that doesn&apos;t get lost, an at-home grip refresh, a groove sharpener, and a place for the small stuff that always ends up loose in the bottom pocket.</p>
        <div className="intent-proof-grid" aria-label="Kit benefits">
          <span>{products.length} of {KIT_HANDLES.length} items confirmed in stock</span>
          <span>WYX10 saves 10%</span>
          <span>Swap or remove items before checkout</span>
          <span>Ships via Shopify checkout</span>
        </div>
      </section>

      <section className="section reveal" aria-labelledby="problem-heading">
        <div className="section-heading">
          <p className="eyebrow">The Problem</p>
          <h2 id="problem-heading">Every Bag Has The Same Few Gaps.</h2>
        </div>
        <p>No towel, a marker that walked off after the third round, grips that have gone slick since last season, club faces caked from the last range session, and a glove that is somehow always damp. None of these are expensive problems. They just never get fixed on their own — so this kit fixes all five at once.</p>
      </section>

      <section className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">What&apos;s Inside — {products.length} Items</p>
            <h2>{formattedTotal}</h2>
            <p>Each item ships separately and lands in your cart on its own — review quantities and remove anything that does not fit before checkout.</p>
          </div>
          {products.length > 0 && <KitAddButton lines={lines} label={ctaLabel} />}
        </div>
        {products.length > 0
          ? <div className="product-grid">
              {products.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                  {itemNotes[product.handle] && <p className="buy-reason" style={{ marginTop: '0.5rem' }}>{itemNotes[product.handle]}</p>}
                </div>
              ))}
            </div>
          : <p>The kit is being restocked — join the list below and we will email you the moment it is ready.</p>}
        {products.length > 0 && (
          <div className="kit-add-footer">
            <KitAddButton lines={lines} label={`Add All ${products.length} to Cart`} />
            <p className="kit-add-note">Items land in the cart individually — remove anything that does not fit before checkout. Use WYX10 at checkout for 10% off.</p>
          </div>
        )}
      </section>

      <section className="section reveal" aria-labelledby="who-its-for-heading">
        <div className="section-heading">
          <p className="eyebrow">Who It&apos;s For</p>
          <h2 id="who-its-for-heading">Built For Three Kinds Of Buyers.</h2>
        </div>
        <div className="care-step-grid">
          {whoItsFor.map((item) => (
            <div className="care-step" key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section reveal" aria-labelledby="free-tools-heading">
        <div className="section-heading">
          <p className="eyebrow">Free With This Kit</p>
          <h2 id="free-tools-heading">A Few Free Tools That Make Gift-Giving Easier.</h2>
        </div>
        <div className="care-step-grid">
          {freeTools.map((tool) => (
            <div className="care-step" key={tool.title}>
              <strong>{tool.title}</strong>
              <p>{tool.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="dark-section reveal" aria-labelledby="kit-promise-heading">
        <div>
          <p className="eyebrow">The Bag Test Promise</p>
          <h2 id="kit-promise-heading">If It&apos;s Wrong, We&apos;ll Make It Right.</h2>
          <div className="actions">
            <Link className="button primary" href="/the-bag-test">Read The Bag Test</Link>
          </div>
        </div>
        <p>We build kits around gear golfers actually use. If your order arrives damaged, incorrect, or does not match what you expected, contact us within 30 days and we&apos;ll help make it right.</p>
      </section>

      <section className="section reveal" aria-labelledby="kit-faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Quick Questions</p>
          <h2 id="kit-faq-heading">Kit FAQ.</h2>
        </div>
        <div className="care-step-grid">
          {faq.map((item) => (
            <div className="care-step" key={item.q}>
              <strong>{item.q}</strong>
              <p>{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="bag-upgrade-kit-waitlist">
        <EmailCapture
          source="bag-upgrade-kit"
          campaign="bag_upgrade_kit_waitlist"
          title={products.length < KIT_HANDLES.length ? 'Join The Kit Drop.' : 'Get The Next Bag Test Drop First.'}
          body={products.length < KIT_HANDLES.length
            ? "We'll email you the moment the full Bag Upgrade Kit is back in stock."
            : 'Join the WYX list for new kit drops, trip gear, and launch discounts — before your foursome hears about them.'}
        />
      </section>

      <section className="section reveal" aria-label="More ways to shop">
        <div className="section-heading">
          <p className="eyebrow">Not Quite Right?</p>
          <h2>Shop Bag Upgrades Individually.</h2>
        </div>
        <div className="actions">
          <Link className="button primary" href="/bag-upgrades">Shop Bag Upgrades</Link>
          <Link className="button secondary dark" href="/golf-gifts-under-60">Golf Gifts Under $60</Link>
        </div>
      </section>
    </>
  );
}
