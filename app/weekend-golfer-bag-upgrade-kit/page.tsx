import type { Metadata } from 'next';
import Link from 'next/link';
import { EmailCapture } from '@/components/EmailCapture';
import { KitAddButton } from '@/components/KitAddButton';
import { ShareWyx } from '@/components/ShareWyx';
import { ProductCard } from '@/components/ProductCard';
import { productPrice, siteUrl } from '@/lib/feed';
import { getProduct } from '@/lib/shopify/products';
import { cleanText } from '@/lib/text';

export const revalidate = 300;

export const metadata: Metadata = {
  title: "The Weekend Golfer's Bag Upgrade Kit",
  description: 'Five practical golf bag upgrades in one cart: towel, marker, grip refresh, tee restock, and accessory caddie. Live Shopify availability and editable checkout.',
  alternates: { canonical: '/weekend-golfer-bag-upgrade-kit' },
  openGraph: {
    title: "The Weekend Golfer's Bag Upgrade Kit | WYX Golf Supply Co.",
    description: 'Five useful bag upgrades, one easier order. Review every item before secure Shopify checkout.',
    url: '/weekend-golfer-bag-upgrade-kit'
  }
};

const KIT_HANDLES = [
  'tri-fold-microfiber-golf-towel',
  'three-rail-ball-marker',
  'pulse-golf-overgrip-tape',
  'bamboo-performance-golf-tees-50-pack',
  'glove-accessory-caddie-gray'
];

const itemNotes: Record<string, string> = {
  'tri-fold-microfiber-golf-towel': 'A bag-ready towel for club faces, golf balls, and grips during the round.',
  'three-rail-ball-marker': 'A simple green-side essential that is easy to carry and easy to gift.',
  'pulse-golf-overgrip-tape': 'A practical option for golfers who like refreshing grip feel without replacing the entire setup.',
  'bamboo-performance-golf-tees-50-pack': 'A straightforward tee restock so the everyday bag starts the next round ready.',
  'glove-accessory-caddie-gray': 'A dedicated place for gloves and the small items that otherwise disappear into a bag pocket.'
};

const whoItsFor = [
  {
    title: 'Weekend Golfers',
    body: 'For the golfer whose bag works fine but has a few obvious weak spots: worn accessories, loose small items, and basics that need a refresh.'
  },
  {
    title: 'Gift Buyers',
    body: 'Five understandable golf items are easier to get right than guessing a club, shaft, putter shape, or other highly personal equipment choice.'
  },
  {
    title: 'Newer Golfers',
    body: 'A straightforward way to cover several bag basics without trying to learn the entire golf-accessory aisle first.'
  }
];

const whyItWorks = [
  {
    title: 'One Add, Five Separate Items',
    body: 'The kit adds each available product to the cart individually. Nothing is hidden inside a mystery bundle.'
  },
  {
    title: 'Edit Before You Pay',
    body: 'Change quantities or remove anything that does not fit. The cart stays transparent all the way to Shopify checkout.'
  },
  {
    title: 'Live Availability',
    body: 'The page is built from the current Shopify catalog. If an item is not available for sale, it is not included in the kit cart.'
  }
];

const faq = [
  {
    q: 'Is this a real bundle or separate items?',
    a: 'The kit is a one-click way to add separate products together. You can review, remove, or change quantities before checkout.'
  },
  {
    q: 'What happens if one of the five items is unavailable?',
    a: 'The page only adds products Shopify currently marks available for sale. If one is unavailable, the page shows the remaining available picks instead of silently substituting something else.'
  },
  {
    q: 'How does WYX10 work on the kit?',
    a: 'The WYX cart requests WYX10 automatically. Shopify shows whether the code applied, and the final price is confirmed before payment.'
  },
  {
    q: 'How long does shipping take?',
    a: 'Timing can vary by product and destination. Shopify shows the available shipping options and current delivery estimate before you place the order.'
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
  const formattedSale = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total * 0.9);

  const ctaLabel = products.length === KIT_HANDLES.length
    ? 'Add The Full Kit'
    : products.length > 0
      ? 'Add Available Kit Picks'
      : 'Join The Kit Drop';

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: "The Weekend Golfer's Bag Upgrade Kit",
      description: 'Five practical golf bag upgrades grouped into one editable cart.',
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
        <p className="eyebrow">Start Here</p>
        <h1>The Weekend Golfer&apos;s Bag Upgrade Kit</h1>
        <p>Five small upgrades with five obvious jobs: clean the gear, mark the ball, refresh grip feel, restock the tees, and organize the loose stuff. One cart, no mystery bundle.</p>
        {products.length > 0 && (
          <div className="lp-price-block" style={{ marginTop: '1rem' }}>
            <span className="lp-price-sale">{formattedSale}</span>
            <span className="lp-price-was">{formattedTotal}</span>
            <span className="lp-price-code">with WYX10 when eligible</span>
          </div>
        )}
        {lines.length > 0 && (
          <div style={{ marginTop: '1.25rem', maxWidth: '420px' }}>
            <KitAddButton lines={lines} label={ctaLabel} buyNowLabel={`Buy Available Kit — ${formattedSale}`} showBuyNow />
          </div>
        )}
        <div className="intent-proof-grid" aria-label="Kit benefits">
          <span>{products.length} of {KIT_HANDLES.length} picks available now</span>
          <span>WYX10 requested automatically</span>
          <span>Edit every item before payment</span>
          <span>Secure Shopify checkout</span>
        </div>
      </section>

      <section className="section reveal" aria-labelledby="problem-heading">
        <div className="section-heading">
          <p className="eyebrow">The Idea</p>
          <h2 id="problem-heading">Fix The Small Stuff First.</h2>
        </div>
        <p>You do not need another giant golf purchase to make the bag better. A few practical accessories can remove the annoyances you deal with every round — and they are much easier to buy for yourself or give as a gift.</p>
      </section>

      <section className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">What&apos;s Available — {products.length} Items</p>
            <h2>{formattedTotal}</h2>
            <p>Each item lands in the cart separately. Review the products, variants, quantities, discount, shipping options, and final price before payment.</p>
          </div>
          {products.length > 0 && <KitAddButton lines={lines} label={ctaLabel} buyNowLabel={`Buy Available Kit — ${formattedSale}`} showBuyNow />}
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
          : <p>The current five-piece kit is unavailable. Join the list below and keep browsing the live bag-upgrade catalog.</p>}
        {products.length > 0 && (
          <div className="kit-add-footer">
            <KitAddButton lines={lines} label={`Add ${products.length} Available Picks`} buyNowLabel={`Buy Available Kit — ${formattedSale}`} showBuyNow />
            <p className="kit-add-note">Products are added individually. WYX requests WYX10 automatically; Shopify confirms the discount and shipping before payment.</p>
          </div>
        )}
      </section>

      <section className="section reveal" aria-labelledby="who-its-for-heading">
        <div className="section-heading">
          <p className="eyebrow">Who It&apos;s For</p>
          <h2 id="who-its-for-heading">An Easier First WYX Order.</h2>
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

      <section className="section reveal" aria-labelledby="why-kit-heading">
        <div className="section-heading">
          <p className="eyebrow">No Bundle Games</p>
          <h2 id="why-kit-heading">You Can See Exactly What You&apos;re Buying.</h2>
        </div>
        <div className="care-step-grid">
          {whyItWorks.map((item) => (
            <div className="care-step" key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section reveal">
        <ShareWyx path="/weekend-golfer-bag-upgrade-kit" />
      </section>

      <section className="dark-section reveal" aria-labelledby="kit-promise-heading">
        <div>
          <p className="eyebrow">The Bag Test Promise</p>
          <h2 id="kit-promise-heading">If The Order Is Wrong, We&apos;ll Help Make It Right.</h2>
          <div className="actions">
            <Link className="button primary" href="/the-bag-test">Read The Bag Test</Link>
            <Link className="button secondary dark" href="/shipping-returns">Shipping &amp; Returns</Link>
          </div>
        </div>
        <p>WYX is built around gear with a clear reason to be in the bag. If something arrives damaged or incorrect, use the support path in our shipping and returns policy so we can help.</p>
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
          title={products.length < KIT_HANDLES.length ? 'Get The Full Kit Restock Note.' : 'Get The Next Bag Test Drop First.'}
          body={products.length < KIT_HANDLES.length
            ? 'Join the WYX list and we will send product and kit updates when the assortment changes.'
            : 'Join the WYX list for new kit drops, trip gear, and Bag Test picks.'}
        />
      </section>

      <section className="section reveal" aria-label="More ways to shop">
        <div className="section-heading">
          <p className="eyebrow">Want To Build Your Own?</p>
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
