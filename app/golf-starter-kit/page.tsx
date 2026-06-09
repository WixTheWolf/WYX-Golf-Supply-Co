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
  title: "Golf Starter Kit — The Accessories Every New Golfer Needs | WYX Golf Supply Co.",
  description: "The complete golf starter kit for new golfers: alignment sticks, cabretta gloves, a quality towel, and a club brush. Under $100 for the full setup. Use WYX10 for 10% off.",
  alternates: { canonical: '/golf-starter-kit' },
  openGraph: {
    title: "Golf Starter Kit for New Golfers | WYX Golf Supply Co.",
    description: "Everything a new golfer needs to start right: alignment sticks, gloves, towel, and club care. Under $100. Use WYX10 for 10% off.",
    url: '/golf-starter-kit'
  }
};

const starterItems = [
  {
    label: 'Alignment Sticks',
    price: '$24',
    why: 'Fix stance, aim, and ball position from day one. The most-used training aid in golf at any skill level.',
    href: '/golf-training-aids',
    when: 'Every range session'
  },
  {
    label: 'Cabretta Glove 3-Pack',
    price: '$32',
    why: 'Grip control before your grip technique is solid. A fresh glove for every 10 rounds. Cabretta leather, not synthetic.',
    href: '/golf-gloves',
    when: 'Every round'
  },
  {
    label: 'Microfiber Clip-On Towel',
    price: '$18',
    why: 'Cleans club faces between shots, grips in rain, ball before putting. Hangs on the bag ring all season.',
    href: '/golf-towels',
    when: 'Every round'
  },
  {
    label: 'Club Brush',
    price: '$16',
    why: 'Builds the groove-cleaning habit from the start. Clean grooves = consistent ball striking. 10 seconds per club.',
    href: '/golf-club-care',
    when: 'After every iron shot'
  },
  {
    label: 'Ball Marker Set',
    price: '$18',
    why: 'A magnetic hat-clip marker removes the coin routine. One less thing to think about on the green.',
    href: '/golf-ball-markers',
    when: 'Every green'
  },
  {
    label: 'GPS Watch (upgrade)',
    price: '$149',
    why: 'Removes yardage anxiety on every approach. The one tech piece that makes every round more enjoyable immediately.',
    href: '/golf-gps-watch',
    when: 'Every hole'
  }
];

const avoidList = [
  { label: 'Premium tour balls', reason: 'A beginner loses 3-5 balls per round. Save the tour balls for year two.' },
  { label: 'Novelty tees', reason: 'A bamboo tee ($8 for 100) works identically. Skip the joke packaging.' },
  { label: 'Club-specific training aids', reason: 'Before swing fundamentals are consistent, club-specific aids address symptoms not causes.' },
  { label: 'Heavy rangefinder', reason: 'A GPS watch is lighter and faster on a new course. Rangefinders shine once you know your carry distances.' }
];

function starterScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const price = Number(productPrice(product).amount);
  let score = productQualityScore(product);
  if (price <= 40) score += 8;
  if (price <= 25) score += 4;
  if (/alignment|glove|towel|brush|marker|tee|ball/i.test(product.title)) score += 5;
  return score;
}

export default async function GolfStarterKit() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts.sort((a, b) => starterScore(b) - starterScore(a)).slice(0, 8);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What accessories does a beginner golfer need?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A beginner golfer needs: alignment sticks ($24) to fix aim and stance, a cabretta glove 3-pack ($32) for grip control, a club brush ($16) to build the cleaning habit, a microfiber towel ($18) that clips to the bag, and a ball marker ($18). Total under $110 for the complete starter set. Use WYX10 for 10% off at WYX Golf Supply Co.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is the best golf starter kit under $100?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The best golf starter kit under $100: alignment sticks ($24) + cabretta glove 3-pack ($32) + microfiber towel ($18) + club brush ($16) = $90 before WYX10. These four items are used every range session and every round. They build the habits and mechanics that improve every beginner faster than anything else under $100.'
        }
      },
      {
        '@type': 'Question',
        name: 'What golf gifts should I buy for someone just starting golf?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The best gifts for new golfers: alignment sticks (fix the #1 beginner error — bad aim), a glove 3-pack (always needed, used every round), and a quality towel. Avoid premium tour balls (beginners lose too many) and novelty gear. Practical accessories that build good habits are the best first golf gifts.'
        }
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">New Golfer Setup</p>
          <h1>The Golf Starter Kit.</h1>
          <p>Five accessories that build the right habits from the first round. No clubs, no bags — just the practical gear that makes the first season better and the bad habits fewer.</p>
          <div className="actions">
            <Link className="button primary" href="#starter-picks">Shop Starter Picks</Link>
            <Link className="button secondary dark" href="/golf-gifts-for-beginners">Beginner Gift Guide →</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off your first order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Start Here</p>
          <h2>Under $90</h2>
          <p>Alignment sticks + glove 3-pack + towel + club brush = the complete starter kit before the WYX10 code. Four items, every round, all season.</p>
          <Link className="button primary" href="#starter-picks" style={{ marginTop: '1rem', display: 'inline-block' }}>See All 5 Picks →</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Starter kit highlights">
        <span>5 essential picks</span>
        <span>Under $90 total</span>
        <span>WYX10 saves 10%</span>
        <span>Every-round useful</span>
      </section>

      {/* The 5 Starter Items */}
      <section className="section reveal" aria-labelledby="starter-items-heading">
        <div className="section-heading">
          <p className="eyebrow">The Starter List</p>
          <h2 id="starter-items-heading">What Every New Golfer Needs.</h2>
        </div>
        <div className="care-step-grid">
          {starterItems.map((item) => (
            <Link key={item.href} href={item.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <strong>{item.label} — {item.price}</strong>
              <p>{item.why}</p>
              <small style={{ opacity: 0.65, display: 'block', marginTop: '0.5rem' }}>Used: {item.when}</small>
            </Link>
          ))}
        </div>
      </section>

      {/* What to Skip */}
      <section className="section reveal" aria-labelledby="skip-heading">
        <div className="section-heading">
          <p className="eyebrow">Skip These</p>
          <h2 id="skip-heading">What Not To Buy First.</h2>
        </div>
        <div className="care-step-grid">
          {avoidList.map((item) => (
            <div key={item.label} className="care-step-card">
              <strong style={{ textDecoration: 'line-through', opacity: 0.5 }}>{item.label}</strong>
              <p>{item.reason}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section id="starter-picks" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Shop Starter Gear</p>
            <h2>Starter Kit Picks.</h2>
          </div>
          <Link className="text-link" href="/products">See Full Shop</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
          : <p>Products loading — <Link href="/golf-training-aids">browse training aids</Link> or <Link href="/golf-gloves">gloves</Link> to start.</p>
        }
      </section>

      {/* Why These 5 */}
      <section className="section reveal" aria-labelledby="rationale-heading">
        <div className="section-heading">
          <p className="eyebrow">Why These 5</p>
          <h2 id="rationale-heading">The Logic Behind The Starter Kit.</h2>
        </div>
        <div className="care-step-grid">
          <div className="care-step-card">
            <strong>Fix Bad Habits Before They Form</strong>
            <p>Most beginner swing problems come from poor alignment — the golfer aims offline and compensates with the swing. Alignment sticks placed on the ground for 3 range sessions fix this before it becomes ingrained. The best time to use alignment sticks is the first range session, not after 2 years of compensating.</p>
          </div>
          <div className="care-step-card">
            <strong>Consumables Over One-Offs</strong>
            <p>A 3-pack of gloves is the best first golf purchase because a beginner goes through gloves faster than an experienced player — gripping too tight, playing in rain without switching gloves, and not letting leather dry properly. A 3-pack lasts a full season and means never playing with a dried-out cracked glove.</p>
          </div>
          <div className="care-step-card">
            <strong>Build Bag Habits Early</strong>
            <p>A club brush on the bag ring after every iron shot builds the groove-cleaning habit that most experienced golfers skip. A towel that clips to the bag means it is always there and always used. Habits formed in the first season stay for the rest of a golf life.</p>
          </div>
          <div className="care-step-card">
            <strong>Skip The Advanced Stuff</strong>
            <p>A launch monitor, a rangefinder, and club-specific swing trainers all have their place. That place is after the basic swing fundamentals are consistent. In year one, the basics of alignment, grip, and consistent contact matter more than any technology or specialized aid.</p>
          </div>
        </div>
      </section>

      <EmailCapture
        source="golf-starter-kit"
        campaign="beginner_golf_2026"
        title="New To Golf? We Made a List."
        body="Join the WYX list for the full beginner gear guide, seasonal tips, and 10% off your starter kit with WYX10."
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Starter Kit',
        description: 'The complete golf accessory starter kit for new golfers — alignment sticks, gloves, towel, club brush, and ball markers under $90.',
        url: `${siteUrl}/golf-starter-kit`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Starter Kit', item: `${siteUrl}/golf-starter-kit` }
          ]
        }
      }) }} />
    </>
  );
}
