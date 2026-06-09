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
  title: "Golf GPS Watch — 40,000+ Courses, Shot Tracking | WYX Golf Supply Co.",
  description: "The WYX Golf GPS Watch: 40,000+ preloaded courses, front/middle/back yardages on every hole, shot distance tracking, scorekeeper mode, 18-hole battery. No phone required. Under $150. WYX10 saves 10%.",
  alternates: { canonical: '/golf-gps-watch' },
  openGraph: {
    title: "Golf GPS Watch | 40,000+ Courses | WYX Golf Supply Co.",
    description: "Golf GPS watch with 40,000+ courses, front/middle/back yardages, shot tracking, and 18-hole battery. No phone needed. Under $150. WYX10 saves 10%.",
    url: '/golf-gps-watch'
  }
};

const features = [
  {
    head: '40,000+ Preloaded Courses',
    body: 'Every major course in the US, Canada, UK, and 40+ countries. Select the course and tee on the first hole — yardages appear instantly, no download or connectivity needed.'
  },
  {
    head: 'Front / Middle / Back Yardages',
    body: 'Each hole shows precise front, middle, and back distances automatically as you walk toward your ball. Know your exact yardage before you reach the ball.'
  },
  {
    head: 'Shot Distance Tracking',
    body: 'Press the shot button before each swing. The watch records carry distance so you can review your actual shot distances after the round — not just the ones you remember.'
  },
  {
    head: 'Scorekeeper Mode',
    body: 'Log your score hole-by-hole on the watch. Review the scorecard after the round. No paper scorecard needed — though you can still use one if you prefer.'
  },
  {
    head: '18-Hole Battery',
    body: 'Finishes a full round on a single charge with power to spare. Charge via USB clip overnight and it is ready for a 36-hole day. The battery does not die on hole 14.'
  },
  {
    head: 'Lightweight — 42g',
    body: 'Wears like a normal everyday watch, not a computer on your wrist. IPX7 waterproof — rain, morning dew, and the post-round wash do not affect it.'
  }
];

const faqs: [string, string][] = [
  ['Do I need to download course maps?', 'No. The GPS watch comes with 40,000+ courses preloaded on the device. Select the course from the on-watch menu and play. No phone pairing or connectivity required on the course.'],
  ['GPS watch vs rangefinder?', 'A GPS watch shows automatic front/middle/back yardages as you walk — no aiming required. A rangefinder gives precise point-to-point distance to any target. Many golfers carry both. The GPS watch is better for frequent rounds on familiar courses. The rangefinder is better for travel and precise layup calculations.'],
  ['Is it waterproof?', 'IPX7 waterproof — submersible to 1 meter for 30 minutes. Rain rounds, morning dew, and cart wash are not a problem. Do not take it swimming.'],
  ['Does it track handicap?', 'The watch tracks hole-by-hole scores via scorekeeper mode. Export to handicap management apps (GHIN, Golf Genius, etc.) is done manually from your post-round review. It does not automatically submit to handicap systems.']
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

function gpsWatchScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const title = product.title.toLowerCase();
  let score = productQualityScore(product);
  if (/gps watch|golf watch/.test(title)) score += 25;
  if (/rangefinder/.test(title)) score += 15;
  if (/golf tech/i.test(product.productType ?? '')) score += 10;
  return score;
}

export default async function GolfGpsWatchPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => gpsWatchScore(b) - gpsWatchScore(a))
    .slice(0, 8);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'Golf GPS Watch — 40,000+ Courses, 18-Hole Battery',
        description: 'A dedicated golf GPS watch with 40,000+ preloaded courses, front/middle/back yardages, shot tracking, and 18-hole battery.',
        brand: { '@type': 'Brand', name: 'WYX Golf Supply Co.' },
        offers: {
          '@type': 'Offer',
          price: '149.00',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: `${siteUrl}/golf-gps-watch`
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Tech</p>
          <h1>Golf GPS Watch. Every Yardage on Your Wrist. No Phone Required.</h1>
          <p>40,000+ courses preloaded. Front, middle, and back on every hole. Shot tracking. 18-hole battery. Wear it like a regular watch and know every yardage by the time you reach your ball.</p>
          <div className="actions">
            <Link className="button primary" href="#gps-grid">Shop GPS Watches</Link>
            <Link className="button secondary dark" href="/golf-rangefinder">See Rangefinder &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off. 40,000+ courses, 18-hole battery, shot tracking.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">WYX GPS Watch</p>
          <h2>$149</h2>
          <p>40,000+ preloaded courses. Front/middle/back on every hole. Shot distance tracking. Scorekeeper mode. 18-hole battery. 42g. IPX7 waterproof. Use WYX10 for $14.90 off.</p>
          <Link className="button primary" href="#gps-grid" style={{ marginTop: '1rem', display: 'inline-block' }}>See the GPS Watch &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="GPS watch highlights">
        <span>40,000+ courses</span>
        <span>Shot tracking</span>
        <span>18-hole battery</span>
        <span>IPX7 waterproof</span>
      </section>

      <section className="section reveal" aria-labelledby="features-heading">
        <div className="section-heading">
          <p className="eyebrow">What It Does</p>
          <h2 id="features-heading">Six Features. Yardage on Your Wrist Before You Reach the Ball.</h2>
        </div>
        <div className="care-step-grid">
          {features.map((f) => (
            <div key={f.head} className="care-step-card">
              <strong>{f.head}</strong>
              <p>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="gps-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Shop Golf Tech</p>
            <h2>GPS Watches &amp; Rangefinders.</h2>
          </div>
          <Link className="text-link" href="/golf-rangefinder">See Rangefinders &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <div className="care-step-card">
                <strong>GPS Golf Watch &mdash; $149</strong>
                <p>40,000+ courses, front/middle/back yardages, shot tracking, 18-hole battery. IPX7 waterproof. Use WYX10 for $14.90 off.</p>
              </div>
              <div className="care-step-card">
                <strong>Laser Rangefinder 800Y &mdash; $119</strong>
                <p>Slope compensation, pin-lock vibration, 6x magnification. The precise companion to the GPS watch. Use WYX10 for $11.90 off.</p>
              </div>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">GPS Watch FAQ.</h2>
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

      <section className="section reveal" aria-labelledby="gift-heading">
        <div className="section-heading">
          <p className="eyebrow">Golf Gift Idea</p>
          <h2 id="gift-heading">The GPS Watch as a Golf Gift.</h2>
        </div>
        <div className="care-step-grid">
          <Link href="/golf-gifts-for-dad" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Best Golf Gift for Dad</strong>
            <p>The GPS watch ($149) is the premium Father&apos;s Day gift that improves every round immediately. He uses it the first tee of the first round after receiving it &mdash; and every round after that.</p>
          </Link>
          <Link href="/golf-gifts-for-husband" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Golf Gift for Husband</strong>
            <p>A golf GPS watch for the husband who plays 20+ rounds a year is the gift that comes up every round for years. He mentions it. His playing partners ask about it. It changes his game visibly.</p>
          </Link>
          <Link href="/golf-trip-gear" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Golf Trip Essential</strong>
            <p>The GPS watch is the most important tech item on a golf trip &mdash; playing unfamiliar courses without yardage means guessing on every approach. 40,000+ courses preloaded means any course, anywhere.</p>
          </Link>
          <Link href="/kits/golf-trip-kit" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>In the Golf Trip Kit</strong>
            <p>The WYX Golf Trip Kit includes the GPS watch alongside fresh gloves, a premium ball pack, and the other essentials for a 3-day golf weekend.</p>
          </Link>
        </div>
      </section>

      <EmailCapture
        source="golf-gps-watch"
        campaign="golf_tech_gps_watch"
        title="Yardage on Your Wrist. Every Round."
        body="Join the WYX list for golf tech guides, new product drops, and 10% off your first order with WYX10."
      />
    </>
  );
}
