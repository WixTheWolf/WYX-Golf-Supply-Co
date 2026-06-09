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
  title: "Bachelor Party Golf Gifts — Group Golf Gifts for the Groom & His Boys | WYX Golf Supply Co.",
  description: "Bachelor party golf gifts for the groom and the squad — practical accessories, matching picks, and gear that makes a golf weekend memorable. Use WYX10 for 10% off.",
  alternates: { canonical: '/bachelor-party-golf-gifts' },
  openGraph: {
    title: "Bachelor Party Golf Gifts | Golf Weekend Gifts | WYX Golf Supply Co.",
    description: "Golf gifts for a bachelor party weekend — groom gifts, group picks, and matching accessories for the whole squad. WYX10 for 10% off.",
    url: '/bachelor-party-golf-gifts'
  }
};

const groomPicks = [
  { label: 'GPS Watch', price: '$149', why: 'The premium groom gift. 40,000+ courses, 18-hole battery, wrist yardage on every approach. The one that gets mentioned the whole trip.', href: '/golf-gps-watch' },
  { label: 'Leather Scorecard Holder', price: '$38', why: 'Full-grain leather with his initials spot for a marker. Elegant, practical, used every round of the trip and every round after.', href: '/golf-scorecard-holder' },
  { label: 'Milled Ball Marker Gift Set', price: '$28', why: 'Precision-milled coins in a gift box. The "groom's round" marker. Something he will pull out every time and remember.', href: '/golf-ball-markers' }
];

const squadPicks = [
  { label: 'Clip-On Towels (matching)', price: '$18 each', why: 'Every guy on the trip gets a towel in the same color. Matching bag accessories make the group photo. $18/person × 8 guys = $144 for the whole squad.', href: '/golf-towels' },
  { label: 'Alignment Sticks', price: '$24 each', why: 'The warm-up ritual: every guy pulls out his sticks before the trip round. Doubles as a range training tool all season.', href: '/golf-training-aids' },
  { label: 'Cabretta Glove 3-Pack', price: '$32 each', why: 'A fresh 3-pack for the weekend. Golf weekends are hard on gloves. Starting the trip with 3 fresh gloves is a luxury the best man can organize.', href: '/golf-gloves' }
];

const tripEssentials = [
  { label: 'Ball Marker Sets', note: 'One for the groom, one for each groomsman. Under $30 each.', href: '/golf-ball-markers' },
  { label: 'Club Brushes', note: 'Carabiner clip on every bag. The trip essential that gets used.', href: '/golf-club-care' },
  { label: 'Performance Hats', note: 'Matching hats for the group. Low crown, stretch fit, all-day comfort.', href: '/golf-hats' },
  { label: 'Golf Balls (Tour Mix)', note: 'A sleeve per person to start. The groom gets the branded sleeve.', href: '/golf-balls' }
];

function bachelorScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const price = Number(productPrice(product).amount);
  let score = productQualityScore(product);
  if (price <= 50) score += 5;
  if (/towel|marker|glove|gps|scorecard|hat|alignment|brush|ball/i.test(product.title)) score += 5;
  return score;
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What are good bachelor party golf gifts?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Best bachelor party golf gifts: for the groom — GPS watch ($149), leather scorecard holder ($38), milled ball marker gift set ($28). For the squad — matching clip-on towels ($18 each), cabretta glove 3-packs ($32 each), or alignment sticks ($24 each). Size-free picks work for any group size. Use WYX10 for 10% off at WYX Golf Supply Co.'
      }
    },
    {
      '@type': 'Question',
      name: 'What should the best man give as a golf bachelor party gift?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "The best man's bachelor party golf gift for the groom: a GPS watch ($149 — the premium gift that changes every round), a leather scorecard holder ($38 — elegant, practical, used all weekend), or a milled ball marker set ($28 in a gift box). The GPS watch is the standout gift that the groom mentions for years."
      }
    },
    {
      '@type': 'Question',
      name: 'How do I organize group golf gifts for a bachelor party?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For a bachelor party golf group: (1) matching clip-on towels for everyone ($18 each), (2) groom gets a premium gift (GPS watch or scorecard holder), (3) alignment sticks for the warm-up ritual. Size-free accessories mean no sizing spreadsheet. Use WYX10 for 10% off the whole group order at WYX Golf Supply Co.'
      }
    }
  ]
};

export default async function BachelorPartyGolfGifts() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts.sort((a, b) => bachelorScore(b) - bachelorScore(a)).slice(0, 8);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Weekend Gifts</p>
          <h1>Bachelor Party Golf Gifts.</h1>
          <p>A groom gift he will use every round for years. Matching accessories for the squad that make the group photo. Practical picks that survive a golf trip and come home in the bag.</p>
          <div className="actions">
            <Link className="button primary" href="#bachelor-picks">Shop Group Picks</Link>
            <Link className="button secondary dark" href="/golf-trip-gear">Golf Trip Gear →</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off the whole order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Groom Gift Idea</p>
          <h2>GPS Watch</h2>
          <p>$149. 40,000+ courses, 18-hole battery. The premium groom gift that improves every round of the trip and every round after. Use WYX10 for $14.90 off.</p>
          <Link className="button primary" href="/golf-gps-watch" style={{ marginTop: '1rem', display: 'inline-block' }}>See GPS Watch →</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Bachelor party golf highlights">
        <span>Groom gift ideas</span>
        <span>Squad matching picks</span>
        <span>WYX10 saves 10%</span>
        <span>Size-free, no hassle</span>
      </section>

      {/* Groom Picks */}
      <section className="section reveal" aria-labelledby="groom-heading">
        <div className="section-heading">
          <p className="eyebrow">The Groom</p>
          <h2 id="groom-heading">Three Groom Gift Ideas.</h2>
        </div>
        <div className="care-step-grid">
          {groomPicks.map((pick) => (
            <Link key={pick.href} href={pick.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <strong>{pick.label} — {pick.price}</strong>
              <p>{pick.why}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Squad Picks */}
      <section className="section reveal" aria-labelledby="squad-heading">
        <div className="section-heading">
          <p className="eyebrow">The Squad</p>
          <h2 id="squad-heading">Group Picks for the Whole Crew.</h2>
        </div>
        <div className="care-step-grid">
          {squadPicks.map((pick) => (
            <Link key={pick.href + pick.label} href={pick.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <strong>{pick.label}</strong>
              <p>{pick.why}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section id="bachelor-picks" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Shop Golf Weekend</p>
            <h2>All Bachelor Party Picks.</h2>
          </div>
          <Link className="text-link" href="/golf-trip-gear">See Trip Gear</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-gps-watch" className="care-step-card" style={{ textDecoration: 'none' }}><strong>GPS Watch</strong><p>$149 — Groom gift</p></Link>
              <Link href="/golf-towels" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Matching Towels</strong><p>$18 each — Squad pick</p></Link>
              <Link href="/golf-ball-markers" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Ball Marker Sets</strong><p>$28 — Great gift box</p></Link>
              <Link href="/golf-scorecard-holder" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Scorecard Holder</strong><p>$38 — Elegant groom gift</p></Link>
            </div>
          )
        }
      </section>

      {/* Trip Essentials */}
      <section className="section reveal" aria-labelledby="essentials-heading">
        <div className="section-heading">
          <p className="eyebrow">Trip Checklist</p>
          <h2 id="essentials-heading">Golf Weekend Essentials for Everyone.</h2>
        </div>
        <div className="care-step-grid">
          {tripEssentials.map((item) => (
            <Link key={item.label} href={item.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <strong>{item.label}</strong>
              <p>{item.note}</p>
            </Link>
          ))}
        </div>
      </section>

      <EmailCapture
        source="bachelor-party-golf-gifts"
        campaign="bachelor_golf_2026"
        title="Planning a Golf Bachelor Party?"
        body="Join the WYX list for group gift planning tips, golf weekend packing lists, and 10% off the whole order with WYX10."
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Bachelor Party Golf Gifts',
        description: 'Golf gifts for a bachelor party weekend — groom gifts, squad matching picks, and trip essentials for the whole crew.',
        url: `${siteUrl}/bachelor-party-golf-gifts`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Trip Gear', item: `${siteUrl}/golf-trip-gear` },
            { '@type': 'ListItem', position: 3, name: 'Bachelor Party Golf Gifts', item: `${siteUrl}/bachelor-party-golf-gifts` }
          ]
        }
      }) }} />
    </>
  );
}
