import type { Metadata } from 'next';
import Link from 'next/link';
import { EmailCapture } from '@/components/EmailCapture';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts, categoryFor } from '@/lib/catalog';
import { siteUrl } from '@/lib/feed';
import { productQualityScore } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Golf Gifts That Actually Get Used | WYX Golf Supply Co.',
  description: 'Shop practical golf gifts for weekend golfers: towels, markers, gloves, trip gear, training aids, headwear, and useful bag upgrades. WYX10 saves 10% on your first order.',
  alternates: { canonical: '/golf-gifts' },
  openGraph: {
    title: 'Golf Gifts That Actually Get Used | WYX Golf Supply Co.',
    description: 'Useful golf gifts for real rounds, trips, and better bags. Shop live WYX picks and save 10% on your first order with WYX10.',
    url: '/golf-gifts'
  }
};

const budgets = [
  { label: 'Easy Add-Ons', href: '/golf-gifts-under-25', desc: 'Low-risk golf gifts and bag extras that are easy to add to a first order.' },
  { label: 'Gifts Under $60', href: '/golf-gifts-under-60', desc: 'The WYX sweet spot: useful gifts that feel substantial without requiring club specs.' },
  { label: 'Bag Upgrades', href: '/bag-upgrades', desc: 'Practical gear for golfers who would rather improve the setup than collect novelty junk.' },
  { label: 'Shop Everything', href: '/products', desc: 'Browse the full live WYX catalog, sorted around useful golf gear and current availability.' }
];

const occasions = [
  { label: 'Golf Gifts for Dad', href: '/golf-gifts-for-dad' },
  { label: 'Golf Gifts for Men', href: '/golf-gifts-for-men' },
  { label: 'Golf Gifts for Women', href: '/golf-gifts-for-women' },
  { label: 'Golf Birthday Gifts', href: '/golf-birthday-gifts' },
  { label: 'Golf Corporate Gifts', href: '/golf-corporate-gifts' },
  { label: 'Golf Tournament Prizes', href: '/golf-tournament-prizes' }
];

const faqs: [string, string][] = [
  ['What makes a good golf gift?', 'The safest golf gifts have a clear job and do not require knowing the golfer’s exact club specs. Towels, markers, headwear, trip gear, practice tools, and small bag upgrades are easier to get right than highly personal equipment.'],
  ['What should I buy for a golfer who already has everything?', 'Look for the small things golfers use, lose, wear out, or forget to replace: towels, gloves, markers, club-care tools, trip accessories, and compact practice gear. WYX calls that The Bag Test.'],
  ['How do I choose a golf gift without guessing the wrong size?', 'Start with non-sized accessories such as towels, markers, club-care tools, trip gear, or practice aids. If you choose apparel or gloves, check the product options and sizing information before adding to the bag.']
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a }
  }))
};

function giftScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  const category = categoryFor(product);
  if (['Towels', 'Accessories', 'Gloves', 'Headwear', 'Training Aids', 'Club Care'].includes(category)) score += 8;
  if (/gift|towel|marker|glove|caddie|headcover|training|putting|brush|groove/i.test(`${product.title} ${(product.tags || []).join(' ')}`)) score += 6;
  return score;
}

export default async function GolfGiftsPage() {
  const allProducts = availableProducts(await getProducts());
  const products = [...allProducts]
    .sort((a, b) => giftScore(b) - giftScore(a))
    .slice(0, 12);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Gifts',
        url: `${siteUrl}/golf-gifts`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Gifts', item: `${siteUrl}/golf-gifts` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Gifts</p>
          <h1>Golf Gifts That Actually Get Used.</h1>
          <p>Skip the filler. WYX focuses on golf gifts with a real job: useful bag upgrades, trip gear, practice tools, headwear, club care, and the small accessories golfers reach for during actual rounds.</p>
          <div className="actions">
            <Link className="button primary" href="#gifts-grid">Shop Live Gift Picks</Link>
            <Link className="button secondary dark" href="/golf-gifts-under-60">Gifts Under $60</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> for 10% off your first order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">The WYX Rule</p>
          <h2>Pass The Bag Test.</h2>
          <p>If it does not have a clear reason to stay in the bag, on the cart, or in the golf-trip rotation, it should not be a featured WYX gift.</p>
          <Link className="button primary" href="/the-bag-test" style={{ marginTop: '1rem', display: 'inline-block' }}>See The Bag Test</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf gift shopping highlights">
        <span>Live Shopify inventory</span>
        <span>Secure checkout</span>
        <span>WYX10 saves 10%</span>
        <span>Shipping shown before payment</span>
      </section>

      <section className="section reveal" aria-labelledby="budget-heading">
        <div className="section-heading">
          <p className="eyebrow">Shop Faster</p>
          <h2 id="budget-heading">Choose The Kind Of Gift.</h2>
        </div>
        <div className="care-step-grid">
          {budgets.map((budget) => (
            <Link key={budget.label} href={budget.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <strong>{budget.label}</strong>
              <p>{budget.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="gifts-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Live Picks</p>
            <h2>Giftable Right Now.</h2>
          </div>
          <Link className="text-link" href="/products">Shop all</Link>
        </div>
        {products.length > 0
          ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
          : <p>Live gift picks are being refreshed. Browse the full shop for currently available gear.</p>
        }
      </section>

      <section className="section reveal" aria-labelledby="occasions-heading">
        <div className="section-heading">
          <p className="eyebrow">Need A Shortcut?</p>
          <h2 id="occasions-heading">Shop By Recipient Or Occasion.</h2>
        </div>
        <div className="care-step-grid">
          {occasions.map((occasion) => (
            <Link key={occasion.label} href={occasion.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <strong>{occasion.label}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Gift FAQ.</h2>
        </div>
        <div className="care-step-grid">
          {faqs.map(([question, answer]) => (
            <div key={question} className="care-step-card">
              <strong>{question}</strong>
              <p>{answer}</p>
            </div>
          ))}
        </div>
      </section>

      <EmailCapture
        source="golf-gifts"
        campaign="golf_gifts"
        title="Better Golf Gifts, Less Guessing."
        body="Get WYX gift picks, trip gear, and Bag Test winners plus 10% off your first order with WYX10."
      />
    </>
  );
}
