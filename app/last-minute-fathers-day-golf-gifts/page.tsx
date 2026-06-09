import type { Metadata } from 'next';
import Link from 'next/link';
import { EmailCapture } from '@/components/EmailCapture';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts } from '@/lib/catalog';
import { productPrice, siteUrl } from '@/lib/feed';
import { productQualityScore } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Last Minute Father's Day Golf Gifts 2026 — Ships Fast | WYX Golf Supply Co.",
  description: "Last minute Father's Day golf gifts that ship fast — gloves, towels, ball markers, alignment sticks, and bag accessories under $60. Use WYX10 for 10% off. June 21 deadline.",
  alternates: { canonical: '/last-minute-fathers-day-golf-gifts' },
  openGraph: {
    title: "Last Minute Father's Day Golf Gifts | WYX Golf Supply Co.",
    description: "Running out of time? These golf gifts ship fast and arrive before June 21. Gloves, towels, markers, and bag accessories under $60.",
    url: '/last-minute-fathers-day-golf-gifts'
  }
};

const fastPicks = [
  { label: 'Cabretta Glove 3-Pack', price: '$32', href: '/golf-gloves', urgency: 'Ships same day' },
  { label: 'Microfiber Clip-On Towel', price: '$18', href: '/golf-towels', urgency: 'In stock now' },
  { label: 'Magnetic Divot Tool + Marker', price: '$18', href: '/golf-divot-tools', urgency: 'Lightweight — fast ship' },
  { label: 'Golf Alignment Sticks 2-Pack', price: '$24', href: '/golf-training-aids', urgency: 'Flat packed — fast ship' },
  { label: 'Hat Clip Ball Marker Set', price: '$16', href: '/golf-ball-markers', urgency: 'Ships in padded envelope' },
  { label: 'Scorecard Pencil Set', price: '$12', href: '/golf-scorecard-holder', urgency: 'Stocking-stuffer size' }
];

const lastMinuteTips = [
  { head: 'Under $25 Ships Fastest', body: 'Small, flat, and lightweight items — alignment sticks, ball markers, scorecard pencils, and tee sets — ship in lightweight packaging that moves through fulfillment faster than bulkier orders. If you are within 4 days of June 21, stick to under $25 picks.' },
  { head: 'A 3-Pack Beats One Glove', body: 'One glove feels thin as a gift. A cabretta glove 3-pack ($32) feels like a considered purchase — and he will use all three over the season. It ships the same way as a single glove but reads as a much more thoughtful gift at opening.' },
  { head: 'Skip the Novelty, Get the Consumable', body: 'Novelty golf gifts (beer markers, joke tees) look desperate last minute. Consumables he always needs — gloves, balls, tees, groove tool — look like you planned it. The difference at opening is not the gift itself, it is how thoughtfully useful it feels.' },
  { head: 'WYX10 Works Today', body: 'Use WYX10 at checkout for 10% off. The code works on any order size and does not expire before June 21. On a $60 bundle — towel, markers, and glove — that is $6 back.' }
];

const faqs: [string, string][] = [
  ["What are the best last minute Father's Day golf gifts?", "The best last-minute Father's Day golf gifts are small, practical accessories that ship fast: a cabretta glove 3-pack ($32), a clip-on microfiber towel ($18), a magnetic divot tool and ball marker set ($18), and alignment sticks ($24). All ship in lightweight packaging and are the practical picks golfers actually want."],
  ["What Father's Day golf gifts ship the fastest?", "Lightweight flat items ship fastest: ball markers, tee sets, alignment sticks, scorecard pencils, and divot tools. These move through standard fulfillment without dimensional weight surcharges and arrive in 2-4 days with standard shipping from most suppliers."],
  ["Is a golf glove a good last minute Father's Day gift?", "Yes — a cabretta leather glove 3-pack ($32) is one of the best last-minute golf gifts because it is practical, used every round, and ships flat. It also avoids the sizing problem of apparel gifts. A single glove can feel thin; a 3-pack reads as a complete, considered gift."]
];

const jsonLd = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
};

function lastMinuteScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const price = Number(productPrice(product).amount);
  let score = productQualityScore(product);
  if (price <= 35) score += 12;
  if (price <= 25) score += 8;
  if (/glove|marker|towel|tee|alignment|pencil|divot|brush/i.test(product.title)) score += 10;
  return score;
}

export default async function LastMinuteFathersDayPage() {
  const fathersDay = new Date('2026-06-21T00:00:00');
  const now = new Date();
  const daysLeft = Math.ceil((fathersDay.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const allProducts = availableProducts(await getProducts());
  const products = allProducts.sort((a, b) => lastMinuteScore(b) - lastMinuteScore(a)).slice(0, 12);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'CollectionPage',
        name: "Last Minute Father's Day Golf Gifts",
        url: `${siteUrl}/last-minute-fathers-day-golf-gifts`,
        breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: "Father's Day Golf Gifts", item: `${siteUrl}/fathers-day-golf-gifts` },
          { '@type': 'ListItem', position: 3, name: 'Last Minute', item: `${siteUrl}/last-minute-fathers-day-golf-gifts` }
        ]}
      }) }} />

      {daysLeft > 0 && daysLeft <= 14 && (
        <div className="urgency-strip" role="banner" aria-label="Father's Day deadline">
          ⏰ <strong>Father&apos;s Day is June 21</strong> — {daysLeft} day{daysLeft !== 1 ? 's' : ''} left. Order now for on-time delivery.
        </div>
      )}

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Father&apos;s Day 2026 · June 21 · {daysLeft > 0 ? `${daysLeft} Days Left` : 'Today!'}</p>
          <h1>Last Minute Father&apos;s Day Golf Gifts.</h1>
          <p className="deal-hero-sub">Practical golf gifts that ship fast. Gloves, towels, ball markers, alignment sticks — the accessories every golfer actually needs, delivered before June 21.</p>
          <div className="actions">
            <Link className="button primary" href="#products">Shop Fast Picks</Link>
            <Link className="button secondary" href="/fathers-day-golf-gifts">Full Gift Guide</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.85 }}>
            Use <strong>WYX10</strong> at checkout for 10% off.
          </p>
        </div>
      </section>

      <div className="deal-strip">
        <span>⏰ {daysLeft > 0 ? `${daysLeft} days to June 21` : 'Last chance today'}</span>
        <span>🏌️ Fast-ship golf gifts</span>
        <span>💰 Most picks under $35</span>
        <span>🎁 Use WYX10 for 10% off</span>
      </div>

      <section className="section reveal">
        <div className="section-heading">
          <p className="eyebrow">Fast Picks</p>
          <h2>Six Gifts That Ship Before June 21.</h2>
        </div>
        <div className="care-step-grid">
          {fastPicks.map((pick) => (
            <div key={pick.href} className="care-step">
              <strong>{pick.label} — {pick.price}</strong>
              <p><em>{pick.urgency}</em></p>
              <p><Link href={pick.href}>Shop {pick.label} →</Link></p>
            </div>
          ))}
        </div>
      </section>

      <section id="products" className="section reveal">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">In Stock Now</p>
            <h2>Best Last Minute Golf Gifts.</h2>
          </div>
          <Link className="text-link" href="/golf-gifts-for-dad">See All Dad Gifts</Link>
        </div>
        {products.length > 0
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : <p>Check back shortly — products are syncing.</p>}
      </section>

      <section className="section reveal">
        <div className="section-heading">
          <p className="eyebrow">Last Minute Tips</p>
          <h2>How To Get It Right Under Pressure.</h2>
        </div>
        <div className="care-step-grid">
          {lastMinuteTips.map((tip) => (
            <div key={tip.head} className="care-step">
              <strong>{tip.head}</strong>
              <p>{tip.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section faq-section reveal" aria-labelledby="faq-heading">
        <div className="section-heading"><h2 id="faq-heading">Last Minute Gift Questions.</h2></div>
        <dl className="faq-list">
          {faqs.map(([q, a]) => (
            <div key={q} className="faq-item">
              <dt>{q}</dt>
              <dd>{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <EmailCapture
        source="last-minute-fathers-day"
        campaign="fathers_day_last_minute"
        title="Running Out of Time? Get The Fast-Ship List."
        body="Join the WYX list for last-minute golf gift ideas and 10% off your first order with WYX10."
      />
    </>
  );
}
