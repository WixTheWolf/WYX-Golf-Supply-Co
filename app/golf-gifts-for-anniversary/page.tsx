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
  title: "Golf Anniversary Gifts — Elevated Picks for the Golfer You Love | WYX Golf Supply Co.",
  description: "Golf anniversary gifts that feel considered — leather scorecard holders, a rangefinder, GPS watch, or an engraved accessory that earns a permanent bag spot. WYX10 saves 10%.",
  alternates: { canonical: '/golf-gifts-for-anniversary' },
  openGraph: {
    title: "Golf Anniversary Gifts | WYX Golf Supply Co.",
    description: "Golf anniversary gifts for a husband, wife, boyfriend, or girlfriend who golfs. Leather accessories, rangefinders, GPS watches. WYX10 saves 10%.",
    url: '/golf-gifts-for-anniversary'
  }
};

const picks = [
  {
    label: 'Leather Scorecard Holder',
    price: '$38',
    tag: 'Engraving-Ready',
    href: '/golf-scorecard-holder',
    why: 'Full-grain leather with pencil loop and ball marker pocket. The engraving-ready front panel turns it into a personalized anniversary gift — initials, a date, a short phrase. Used every round for a decade. The golf gift that improves with age.'
  },
  {
    label: 'Stainless Golf Flask',
    price: '$36',
    tag: 'Engraving-Ready',
    href: '/golf-training-aids',
    why: 'An 8oz brushed stainless flask with a milled ball marker lid. Slim enough for a cart bag side pocket. Engraving-ready front panel. The anniversary gift that gets used on every round after.'
  },
  {
    label: 'Laser Rangefinder',
    price: '$119',
    tag: 'Best Tech Gift',
    href: '/golf-rangefinder',
    why: 'Slope compensation, pin-lock vibration, 800-yard range. The anniversary gift that changes how they play golf — not just how they look on the course. If they do not own one, this is the gift. If they do, upgrade them to slope mode.'
  },
  {
    label: 'GPS Golf Watch',
    price: '$149',
    tag: 'Wearable Anniversary Gift',
    href: '/golf-gps-watch',
    why: '40,000+ courses preloaded, front/middle/back on every hole, shot tracking, 18-hole battery life. The anniversary gift they wear every single round — and that playing partners comment on immediately.'
  },
  {
    label: 'Cabretta Glove 3-Pack',
    price: '$32',
    tag: 'Used Every Round',
    href: '/golf-gloves',
    why: 'Three fresh cabretta gloves — the consumable anniversary gift that gets used within one round. Stack with the leather scorecard holder for a complete under-$75 anniversary gift set that covers every round.'
  },
  {
    label: 'Putting Alignment Mirror',
    price: '$32',
    tag: 'Practice Gift',
    href: '/golf-training-aids',
    why: 'The coaching tool that shows eye position, shoulder line, and putter path simultaneously. The anniversary gift that builds a daily practice habit and produces visible handicap improvement within a month of use.'
  }
];

const faqs: [string, string][] = [
  ['What is the best golf anniversary gift?', 'The leather scorecard holder ($38) is the best under-$50 golf anniversary gift — engraving-ready, full-grain leather, used every round. The rangefinder ($119) is the best premium anniversary gift for a golfer who plays regularly. The GPS watch ($149) is the anniversary gift they wear to every round for years. All available at wyxgolfsupply.com with WYX10 for 10% off.'],
  ['Can I get a golf anniversary gift engraved?', 'The leather scorecard holder ($38) has an engraving-ready front panel — initials, a date, a short phrase. The stainless flask ($36) also has an engravable panel. Contact us at wyxgolfsupply.com/contact for bulk or custom engraving orders and lead times before ordering.'],
  ['What golf anniversary gift works for both men and women?', 'The leather scorecard holder ($38) and the stainless flask ($36) work for any golfer regardless of skill level, equipment, or gender. The rangefinder ($119) and GPS watch ($149) work for any golfer who plays more than a few rounds per season. The alignment sticks ($24) work for any golfer who practices. None of these have sizing concerns.']
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

function anniversaryScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const price = Number(productPrice(product).amount);
  let score = productQualityScore(product);
  if (/scorecard|flask|rangefinder|gps watch|leather/i.test(product.title)) score += 10;
  if (/glove|towel|marker|alignment/i.test(product.title)) score += 5;
  if (price >= 30 && price <= 60) score += 4;
  return score;
}

export default async function GolfGiftsForAnniversaryPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => anniversaryScore(b) - anniversaryScore(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Anniversary Gifts',
        url: `${siteUrl}/golf-gifts-for-anniversary`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Gifts', item: `${siteUrl}/golf-gifts` },
            { '@type': 'ListItem', position: 3, name: 'Golf Anniversary Gifts', item: `${siteUrl}/golf-gifts-for-anniversary` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Anniversary Gifts</p>
          <h1>Golf Anniversary Gifts. Engraved, Elevated, Used Every Round.</h1>
          <p>These are the accessories that feel considered — leather scorecard holders with engraving-ready panels, stainless flasks, a rangefinder that changes how they play, or a GPS watch they wear to every round. From $32 to $149.</p>
          <div className="actions">
            <Link className="button primary" href="#anniversary-grid">Shop Anniversary Picks</Link>
            <Link className="button secondary dark" href="/golf-scorecard-holder">See the Scorecard Holder &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off every order. Ships in 1-3 days.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Most Popular Anniversary Pick</p>
          <h2>Leather Scorecard Holder</h2>
          <p>$38. Engraving-ready front panel — their initials, a date, a phrase. Full-grain leather, pencil loop, ball marker pocket. Used every round. The golf gift that improves with age.</p>
          <Link className="button primary" href="/golf-scorecard-holder" style={{ marginTop: '1rem', display: 'inline-block' }}>See the Holder &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf anniversary gift highlights">
        <span>Engraving-ready leather picks</span>
        <span>From $32 to $149</span>
        <span>WYX10 saves 10%</span>
        <span>Ships in 1-3 days</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading">
          <p className="eyebrow">Six Anniversary Picks</p>
          <h2 id="picks-heading">Golf Anniversary Gifts. Elevated and Practical.</h2>
        </div>
        <div className="care-step-grid">
          {picks.map((pick) => (
            <Link key={pick.label} href={pick.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <small style={{ opacity: 0.6, fontWeight: 600, display: 'block' }}>{pick.tag}</small>
              <strong>{pick.label} — {pick.price}</strong>
              <p>{pick.why}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="anniversary-grid" className="section product-section">
        <div className="section-heading">
          <p className="eyebrow">Shop Now</p>
          <h2>Golf Anniversary Gifts.</h2>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-scorecard-holder" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Leather Scorecard Holder — $38</strong><p>Engraving-ready, used every round</p></Link>
              <Link href="/golf-rangefinder" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Laser Rangefinder — $119</strong><p>Changes how they play every round</p></Link>
              <Link href="/golf-gps-watch" className="care-step-card" style={{ textDecoration: 'none' }}><strong>GPS Golf Watch — $149</strong><p>Worn to every round</p></Link>
              <Link href="/golf-gloves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Glove 3-Pack — $32</strong><p>Used every round, never restocked</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Anniversary Gift FAQ.</h2>
        </div>
        <div className="care-step-grid">
          {faqs.map(([q, a]) => (
            <div key={q} className="care-step-card">
              <strong>{q}</strong>
              <p>{a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section reveal" aria-labelledby="links-heading">
        <div className="section-heading">
          <p className="eyebrow">More Gift Ideas</p>
          <h2 id="links-heading">Golf Gifts by Recipient.</h2>
        </div>
        <div className="care-step-grid">
          <Link href="/golf-gifts-for-wife" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Gifts for Wife</strong><p>Engraving-ready leather and GPS watch picks</p></Link>
          <Link href="/golf-gifts-for-husband" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Gifts for Husband</strong><p>Practical picks for the husband who golfs</p></Link>
          <Link href="/golf-gifts-for-women" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Gifts for Women</strong><p>Full range of picks for any woman who golfs</p></Link>
          <Link href="/golf-gifts-for-golfers-who-have-everything" className="care-step-card" style={{ textDecoration: 'none' }}><strong>For the Golfer Who Has Everything</strong><p>Creative picks beyond the obvious gifts</p></Link>
        </div>
      </section>

      <EmailCapture
        source="golf-gifts-for-anniversary"
        campaign="anniversary_golf_gifts"
        title="Golf Anniversary Gifts That Feel Considered."
        body="Join the WYX list for gift guides, personalization info, and 10% off your first order with WYX10."
      />
    </>
  );
}
