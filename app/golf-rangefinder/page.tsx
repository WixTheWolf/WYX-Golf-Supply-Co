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
  title: "Golf Rangefinder — 800Y Slope-Compensating Laser | WYX Golf Supply Co.",
  description: "The WYX Golf Laser Rangefinder: 800-yard range, slope compensation, pin-lock vibration, 6x magnification. Reads the flag in under a second on any course. Under $120. WYX10 saves 10%.",
  alternates: { canonical: '/golf-rangefinder' },
  openGraph: {
    title: "Golf Laser Rangefinder | Slope Mode | WYX Golf Supply Co.",
    description: "800-yard slope-compensating rangefinder with pin-lock vibration and 6x magnification. The most impactful tech upgrade for any golfer. Under $120. WYX10 saves 10%.",
    url: '/golf-rangefinder'
  }
};

const features = [
  {
    head: '800-Yard Range',
    body: 'Reads to the flagstick at 400+ yards in typical conditions. Trees, bunker faces, layup targets — point and shoot in under a second on anything on the course.'
  },
  {
    head: 'Slope Compensation',
    body: 'Calculates the adjusted yardage accounting for elevation change. Uphill or downhill, the display gives you the club-selection number — not the raw distance.'
  },
  {
    head: 'Pin-Lock Vibration',
    body: "When the laser locks the flag instead of the tree line, the rangefinder vibrates. You know you have the pin, not a background object — before you put it down."
  },
  {
    head: '6x Magnification',
    body: 'A clear optic with diopter adjustment for different vision. Comfortable eye relief for glasses wearers. The flag stays sharp at distance, not blurry.'
  },
  {
    head: 'Belt-Clip Neoprene Case',
    body: 'The included case clips to a cart bag side pocket or the belt loop of the cart. Ready to grab at address. Not buried at the bottom of the bag.'
  },
  {
    head: 'IPX4 Waterproof',
    body: 'Rain-proof to IPX4 — works through morning dew and light rain without cover. The rubber-overmold grip stays secure in wet hands.'
  }
];

const faqs: [string, string][] = [
  ['Do I need slope compensation?', 'Slope compensation is legal for practice and casual play but not for USGA-sanctioned competition rounds. Most recreational golfers benefit significantly — it gives the correct club-selection yardage for uphill and downhill shots. The WYX rangefinder has a slope toggle so you can disable it for competition.'],
  ['Rangefinder or GPS watch?', 'The rangefinder gives more precise point-to-point distance — flag, bunker face, layup target. The GPS watch gives automatic front/middle/back yardages without aiming. For players who travel or play varied courses, the rangefinder is more useful. Many serious golfers use both.'],
  ['How long does the battery last?', 'The CR2 battery (included) lasts 8,000+ readings — typically 2-3 full seasons of regular play before needing replacement. CR2 batteries are available at any camera shop for under $5.'],
  ['Can I use it on any course?', 'Yes. The rangefinder works on any course, any conditions, at any time. It does not require course preloading or connectivity. Point, press, read. The slope toggle allows USGA-legal play when needed.']
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

function rangefinderScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const title = product.title.toLowerCase();
  let score = productQualityScore(product);
  if (/rangefinder|gps watch|golf watch/.test(title)) score += 20;
  if (/golf tech/i.test(product.productType ?? '')) score += 10;
  return score;
}

export default async function GolfRangefinderPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => rangefinderScore(b) - rangefinderScore(a))
    .slice(0, 8);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'Golf Laser Rangefinder — 800 Yard Slope-Compensating',
        description: 'An 800-yard slope-compensating laser rangefinder with pin-lock vibration, 6x magnification, and belt-clip case.',
        brand: { '@type': 'Brand', name: 'WYX Golf Supply Co.' },
        offers: {
          '@type': 'Offer',
          price: '119.00',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: `${siteUrl}/golf-rangefinder`
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Tech</p>
          <h1>Golf Rangefinder. Read Every Flag in Under a Second.</h1>
          <p>The most impactful technology upgrade in golf. Point at the flag. Press. The distance and slope-adjusted yardage appear before your playing partner finishes their practice swing.</p>
          <div className="actions">
            <Link className="button primary" href="#rangefinder-grid">Shop Rangefinders</Link>
            <Link className="button secondary dark" href="/golf-gps-watch">GPS Watch →</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off. 800Y slope mode, pin-lock vibration.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">WYX Rangefinder</p>
          <h2>$119</h2>
          <p>800-yard range. Slope compensation. Pin-lock vibration. 6x magnification. IPX4 waterproof. Belt-clip neoprene case included. Use WYX10 for $11.90 off.</p>
          <Link className="button primary" href="#rangefinder-grid" style={{ marginTop: '1rem', display: 'inline-block' }}>See the Rangefinder &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Rangefinder highlights">
        <span>800-yard range</span>
        <span>Slope compensation</span>
        <span>Pin-lock vibration</span>
        <span>IPX4 waterproof</span>
      </section>

      <section className="section reveal" aria-labelledby="features-heading">
        <div className="section-heading">
          <p className="eyebrow">What It Does</p>
          <h2 id="features-heading">Six Features. One Tool. Every Yardage Question Answered.</h2>
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

      <section id="rangefinder-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Shop Golf Tech</p>
            <h2>Rangefinders &amp; GPS Watches.</h2>
          </div>
          <Link className="text-link" href="/golf-gps-watch">See GPS Watches &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <div className="care-step-card">
                <strong>Laser Rangefinder 800Y &mdash; $119</strong>
                <p>Slope compensation, pin-lock vibration, 6x magnification, IPX4 waterproof. Use WYX10 for $11.90 off.</p>
              </div>
              <div className="care-step-card">
                <strong>GPS Golf Watch &mdash; $149</strong>
                <p>40,000+ courses, front/middle/back yardages, shot tracking, 18-hole battery. Use WYX10 for $14.90 off.</p>
              </div>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Common Questions</p>
          <h2 id="faq-heading">Rangefinder FAQ.</h2>
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

      <section className="section reveal" aria-labelledby="compare-heading">
        <div className="section-heading">
          <p className="eyebrow">Also Consider</p>
          <h2 id="compare-heading">Rangefinder vs GPS Watch &mdash; Which Is Right for You?</h2>
        </div>
        <div className="care-step-grid">
          <Link href="/golf-rangefinder" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Rangefinder &mdash; $119</strong>
            <p>Precise point-to-point distance to anything on the course. Best for players who travel, play varied courses, or compete. Slope toggle for USGA-legal play.</p>
          </Link>
          <Link href="/golf-gps-watch" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>GPS Watch &mdash; $149</strong>
            <p>Always-on front/middle/back yardages without aiming. Best for players who walk frequently or play the same courses repeatedly. 40,000+ preloaded courses.</p>
          </Link>
          <Link href="/journal/golf-rangefinder-vs-gps-watch" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Read the Full Comparison &rarr;</strong>
            <p>Rangefinder vs GPS watch breakdown &mdash; when each wins, who each suits, and whether you can justify owning both.</p>
          </Link>
          <Link href="/golf-trip-gear" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Golf Trip Tech &rarr;</strong>
            <p>A rangefinder is the most important tech to pack for a golf trip &mdash; playing unfamiliar courses without yardage is guesswork on every approach.</p>
          </Link>
        </div>
      </section>

      <EmailCapture
        source="golf-rangefinder"
        campaign="golf_tech_rangefinder"
        title="The Golf Tech That Changes Every Round."
        body="Join the WYX list for golf tech guides, new product drops, and 10% off your first order with WYX10."
      />
    </>
  );
}
