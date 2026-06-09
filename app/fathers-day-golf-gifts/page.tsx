import type { Metadata } from 'next';
import Link from 'next/link';
import { EmailCapture } from '@/components/EmailCapture';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts, categoryFor } from '@/lib/catalog';
import { productPrice, siteUrl } from '@/lib/feed';
import { productQualityScore } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Father's Day Golf Gifts 2026 — Useful Picks Under $75 | WYX Golf Supply Co.",
  description: "Shop Father's Day golf gifts for 2026 — gloves, towels, ball markers, GPS watch, training aids, and bag upgrades that actually earn a permanent spot in the bag. Use WYX10 for 10% off.",
  alternates: { canonical: '/fathers-day-golf-gifts' },
  openGraph: {
    title: "Father's Day Golf Gifts 2026 | WYX Golf Supply Co.",
    description: "Useful golf gifts for Dad. June 21 is close — shop gloves, towels, markers, GPS watches, and bag upgrades. Use WYX10 for 10% off.",
    url: '/fathers-day-golf-gifts'
  }
};

const budgetTiers = [
  { label: 'Under $25', href: '/golf-gifts-under-25', description: 'Tees, markers, and stocking-stuffer picks' },
  { label: 'Under $60', href: '/golf-gifts-under-60', description: 'Gloves, towels, accessories, and club care' },
  { label: 'Under $100', href: '/best-golf-gifts-under-100', description: 'Scorecard holders, GPS, rangefinder accessories' },
  { label: 'Under $150', href: '/golf-gifts-under-150', description: 'GPS watch, premium bundles, leather gifts' }
];

const giftIdeas = [
  { label: 'Fresh Glove 3-Pack', why: 'He always runs out. Always.', href: '/golf-gloves' },
  { label: 'Clip-On Towel', why: 'The one bag accessory every serious round needs.', href: '/golf-towels' },
  { label: 'Milled Ball Marker Set', why: 'He wants it but will never buy it himself.', href: '/golf-ball-markers' },
  { label: 'GPS Watch', why: 'The gift that improves every round, every time.', href: '/golf-gps-watch' },
  { label: 'Groove Sharpener', why: 'Gets his wedges spinning like new.', href: '/golf-club-care' },
  { label: 'Alignment Sticks', why: 'The pro-level training aid under $25.', href: '/golf-training-aids' }
];

function dadGiftScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const price = Number(productPrice(product).amount);
  const category = categoryFor(product);
  let score = productQualityScore(product);
  if (price <= 75) score += 5;
  if (price <= 45) score += 3;
  if (price <= 25) score += 2;
  if (['Towels', 'Accessories', 'Golf Balls', 'Gloves', 'Grips', 'Club Care'].includes(category)) score += 4;
  if (/marker|towel|glove|grip|headcover|ball|brush|groove|alignment|gps|watch/i.test(product.title)) score += 3;
  return score;
}

export default async function FathersDayGolfGifts() {
  const fathersDay = new Date('2026-06-21T00:00:00');
  const now = new Date();
  const daysLeft = Math.ceil((fathersDay.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const urgent = daysLeft <= 7;

  const allProducts = availableProducts(await getProducts());
  const products = allProducts.sort((a, b) => dadGiftScore(b) - dadGiftScore(a)).slice(0, 12);
  const underSixty = products.filter((product) => Number(productPrice(product).amount) <= 60).length;

  return (
    <>
      {daysLeft > 0 && daysLeft <= 21 && (
        <div className="urgency-strip" role="banner" aria-label="Father's Day countdown">
          {urgent ? '⏰' : '🎁'} <strong>Father&apos;s Day is June 21</strong> — {daysLeft} day{daysLeft !== 1 ? 's' : ''} to shop.
          {urgent && ' Order now for on-time delivery.'}
        </div>
      )}

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Father&apos;s Day 2026 · June 21</p>
          <h1>Golf Gifts Dad Will Actually Use.</h1>
          <p>Not novelty gifts. Not stuff that collects dust in the closet. WYX carries the accessories every golfer wants but never buys himself — a fresh glove set, a quality towel, milled ball markers, and gear that earns a permanent spot in the bag.</p>
          <div className="actions">
            <Link className="button primary" href="#dad-gift-grid">Shop Dad Gifts Now</Link>
            <Link className="button secondary dark" href="/kits/dad-gift-kit">See The Dad Gift Kit</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off your first order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Launch Code</p>
          <h2>WYX10</h2>
          <p>10% off at checkout during the Father&apos;s Day window. Best used on a bundle: towel + markers + glove = the complete bag refresh under $80 before the code.</p>
          <p style={{ marginTop: '1rem', fontWeight: 600 }}>June 21 · {daysLeft > 0 ? `${daysLeft} days left` : 'Today!'}</p>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Father's Day shopping benefits">
        <span>June 21 Deadline</span>
        <span>{underSixty} picks under $60</span>
        <span>WYX10 saves 10%</span>
        <span>Useful, not generic</span>
      </section>

      {/* Gift Ideas Guide */}
      <section className="section reveal" aria-labelledby="gift-ideas-heading">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Gift Ideas</p>
            <h2 id="gift-ideas-heading">What To Get Him.</h2>
          </div>
          <Link className="text-link" href="/golf-gifts-for-dad">See All Dad Gifts</Link>
        </div>
        <div className="care-step-grid">
          {giftIdeas.map((idea) => (
            <Link key={idea.href} href={idea.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <strong>{idea.label}</strong>
              <p>{idea.why}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Budget Tiers */}
      <section className="section reveal" aria-labelledby="budget-heading">
        <div className="section-heading">
          <p className="eyebrow">Shop By Budget</p>
          <h2 id="budget-heading">Find The Right Price.</h2>
        </div>
        <div className="care-step-grid">
          {budgetTiers.map((tier) => (
            <Link key={tier.href} href={tier.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <strong>{tier.label}</strong>
              <p>{tier.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section id="dad-gift-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Top Picks</p>
            <h2>Best Golf Gifts For Dad.</h2>
          </div>
          <Link className="text-link" href="/popular-golf-products-2026">See What&apos;s Popular</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
          : <p>Products are syncing from Shopify. Check back in a moment.</p>
        }
      </section>

      {/* Why These Gifts Work */}
      <section className="section reveal" aria-labelledby="why-heading">
        <div className="section-heading">
          <p className="eyebrow">Gift Strategy</p>
          <h2 id="why-heading">The Gifts That Get Used.</h2>
        </div>
        <div className="care-step-grid">
          <div className="care-step-card">
            <strong>Consumables Win</strong>
            <p>Gloves, balls, and tees are the gifts that get used immediately and remembered every time he reaches for the next one. A 3-pack of cabretta gloves beats a novelty headcover every time.</p>
          </div>
          <div className="care-step-card">
            <strong>Bag Accessories Stay</strong>
            <p>A clip-on towel, a milled ball marker, and a groove brush all earn a permanent home in the bag. These are the gifts that outlast the round they were first used in.</p>
          </div>
          <div className="care-step-card">
            <strong>Tech Adds Up</strong>
            <p>A GPS watch ($149) improves every round for years. A rangefinder removes the guesswork on every approach. These are the gifts he wanted but was not going to buy himself.</p>
          </div>
          <div className="care-step-card">
            <strong>Skip the Novelty</strong>
            <p>Beer-themed ball markers, joke tees, and branded polo shirts all share the same fate: re-gifted within 12 months. Stick to gear that improves the round.</p>
          </div>
        </div>
      </section>

      <EmailCapture
        source="fathers-day-golf-gifts"
        campaign="fathers_day_2026"
        title="Get The Dad Gifts Before June 21."
        body="Join the WYX list for Father's Day picks, launch code reminders, and the full golf gift guide for 2026."
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: "Father's Day Golf Gifts 2026",
        description: metadata.description,
        url: `${siteUrl}/fathers-day-golf-gifts`,
        mainEntity: products.slice(0, 6).map((product) => ({
          '@type': 'Product',
          name: product.title,
          url: `${siteUrl}/products/${product.handle}`,
          image: product.featuredImage?.url,
          offers: {
            '@type': 'Offer',
            price: product.priceRange.minVariantPrice.amount,
            priceCurrency: product.priceRange.minVariantPrice.currencyCode,
            availability: 'https://schema.org/InStock'
          }
        }))
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: "What are the best Father's Day golf gifts?", acceptedAnswer: { '@type': 'Answer', text: "The best Father's Day golf gifts are consumables he always needs (glove 3-pack, golf balls, tees), daily-use accessories he would not buy himself (milled ball marker set, quality towel, leather bag tag), and practical tech (GPS watch, rangefinder). All available at WYX Golf Supply Co. with WYX10 for 10% off." } },
          { '@type': 'Question', name: "What golf gift should I get my dad under $50?", acceptedAnswer: { '@type': 'Answer', text: "Under $50, the best golf gifts for Dad include a cabretta glove 3-pack ($32), a microfiber clip-on towel ($18), a milled ball marker set, or alignment sticks ($24). All of these get used every round and make practical, memorable gifts." } },
          { '@type': 'Question', name: "Is a GPS watch a good Father's Day golf gift?", acceptedAnswer: { '@type': 'Answer', text: "Yes — a golf GPS watch is one of the best premium Father's Day golf gifts because it improves every round. The WYX GPS Watch ($149) loads 40,000+ courses, shows front/mid/back distances, and has an 18-hole battery. Use WYX10 for 10% off." } }
        ]
      }) }} />
    </>
  );
}
