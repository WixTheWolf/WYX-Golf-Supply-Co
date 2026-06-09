import type { Metadata } from 'next';
import Link from 'next/link';
import { EmailCapture } from '@/components/EmailCapture';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts } from '@/lib/catalog';
import { siteUrl } from '@/lib/feed';
import { productQualityScore } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Golf Club Care — Clean Clubs, Better Contact, Longer Lasting Irons | WYX Golf Supply Co.",
  description: "Golf club care tools that take 10 minutes and extend the life of your clubs by years. Dual-sided brush, microfiber towel, groove cleaner. WYX10 saves 10%.",
  alternates: { canonical: '/golf-club-care' },
  openGraph: {
    title: "Golf Club Care | WYX Golf Supply Co.",
    description: "Clean grooves = clean contact = the spin you paid for. The 10-minute club care routine that extends club life and recovers lost performance.",
    url: '/golf-club-care'
  }
};

const routine = [
  {
    step: '1',
    head: 'Wet the Brush',
    body: 'Fill a bucket with warm (not hot) water. Submerge the club head for 20 seconds. Warm water softens compacted dirt in the grooves without damaging ferrules or grip tape.'
  },
  {
    step: '2',
    head: 'Scrub with the Stiff Side',
    body: 'The stiff-bristle side of the dual-sided brush removes packed-in dirt and grass from grooves. Work back and forth in the groove direction — not across it. 8-10 strokes per club face.'
  },
  {
    step: '3',
    head: 'Detail with the Groove Cleaner',
    body: 'Run the groove cleaner tool along each groove line. This removes the last layer of compacted material the brush loosens but cannot extract. Takes 30 seconds per iron.'
  },
  {
    step: '4',
    head: 'Switch to the Soft Side',
    body: 'The soft-bristle side buffs the club face and polishes chrome finish on irons without scratching. Use light pressure — this is finishing, not scrubbing.'
  },
  {
    step: '5',
    head: 'Dry with Microfiber',
    body: 'The microfiber towel pulls water out of grooves without leaving lint. Pat the face dry, then wipe the shaft and grip. Never air-dry — water left in grooves accelerates rust on carbon steel clubs.'
  },
  {
    step: '6',
    head: 'Wipe During the Round',
    body: 'Clip the microfiber towel to the bag D-ring. After every iron shot, wipe the face before returning the club. Clean contact every shot — not just at home after the round.'
  }
];

const whyGrooves = [
  {
    head: 'Grooves Create Backspin',
    body: 'The channels machined into a club face grip the ball at impact and impart backspin. Packed-in dirt acts as insulation between the ball and the groove edges — the ball slides instead of biting.'
  },
  {
    head: 'Backspin Controls Distance',
    body: 'A clean 9-iron stops on the green. A dirty 9-iron runs through it. Inconsistent carry distance and unpredictable stopping power are almost always a groove problem before they are a swing problem.'
  },
  {
    head: 'Wet Conditions Amplify the Problem',
    body: 'In rain or dew, grooves are the only mechanism the face has to channel moisture away from the contact point. A clogged groove in wet conditions cannot channel water — the result is a flyer that has no spin and no stopping power.'
  },
  {
    head: 'New Clubs Ship Clean — They Do Not Stay That Way',
    body: 'After 50-75 rounds without cleaning, groove edges erode with compacted material and normal wear. Regular cleaning extends the performance life of a set of irons by 2-4 seasons.'
  }
];

const faqs: [string, string][] = [
  ['How often should I clean my golf clubs?', 'After every round, minimum. During a round — after every iron or wedge shot using a wet towel clipped to the bag. The 10-minute post-round routine (brush, groove cleaner, dry) keeps clubs in new condition indefinitely. Skipping routine cleaning for a full season deposits material that requires soaking and aggressive brushing to remove.'],
  ['Can I use dish soap to clean clubs?', 'Yes — a small amount of mild dish soap in warm water is the standard cleaning solution. Avoid abrasive soaps or anything with bleach. Never use a wire brush on chrome or nickel finishes — it scratches the face. The dual-sided club brush has the correct bristle hardness for both scrubbing (stiff side) and polishing (soft side).'],
  ['Is the club care kit a good gift?', 'The best golf gifts are things a golfer uses but would never buy for themselves. Most golfers own a towel — very few own a dedicated groove cleaning brush and a separate groove tool. The club care kit is the gift that noticeably improves their game without asking them to change their swing.'],
  ['Does club care extend the life of clubs?', 'Dramatically. Groove corrosion is the primary cause of performance degradation in irons. Carbon steel wedges can lose meaningful groove sharpness in 2-3 seasons without cleaning. Chrome-plated irons are more forgiving but still accumulate residue that affects spin. Regular cleaning with the correct tools is the highest-ROI maintenance action for any set of clubs.']
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

const howTo = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Clean Golf Clubs — The 10-Minute Post-Round Routine',
  description: 'A 6-step club care routine using a dual-sided brush, groove cleaner, and microfiber towel.',
  step: routine.map((s) => ({
    '@type': 'HowToStep',
    position: s.step,
    name: s.head,
    text: s.body
  }))
};

function clubCareScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const title = product.title.toLowerCase();
  let score = productQualityScore(product);
  if (/club (care|brush|cleaner)|groove cleaner|dual.sided brush/.test(title)) score += 30;
  if (/towel|microfiber/.test(title)) score += 15;
  if (/club care|care kit/.test(product.productType?.toLowerCase() ?? '')) score += 10;
  return score;
}

export default async function GolfClubCarePage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => clubCareScore(b) - clubCareScore(a))
    .slice(0, 8);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Golf Accessories', item: `${siteUrl}/golf-accessories-every-golfer-needs` },
          { '@type': 'ListItem', position: 3, name: 'Golf Club Care', item: `${siteUrl}/golf-club-care` }
        ]
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Club Care &amp; Maintenance</p>
          <h1>Golf Club Care. 10 Minutes. Cleaner Grooves. More Spin.</h1>
          <p>Dirty grooves cost you spin, distance control, and stopping power — not swing flaws. The dual-sided club brush, groove cleaner, and microfiber towel cover every part of the 10-minute post-round routine that extends club life by years.</p>
          <div className="actions">
            <Link className="button primary" href="#care-grid">Shop Club Care Tools</Link>
            <Link className="button secondary dark" href="/journal/how-to-clean-golf-clubs">Read the Cleaning Guide &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off. Ships in 1-3 days.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">The Core Kit</p>
          <h2>Dual-Sided Club Brush</h2>
          <p>Stiff bristle side for grooves and faces. Soft bristle side for shaft and polishing. Retractable groove cleaner pin built into the handle. One tool for the full routine.</p>
          <Link className="button primary" href="#care-grid" style={{ marginTop: '1rem', display: 'inline-block' }}>See the Brush &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Club care highlights">
        <span>10-minute post-round routine</span>
        <span>Dual-sided stiff + soft brush</span>
        <span>Groove cleaner tool included</span>
        <span>Extends club life 2-4 seasons</span>
      </section>

      <section className="section reveal" aria-labelledby="why-heading">
        <div className="section-heading">
          <p className="eyebrow">Why It Matters</p>
          <h2 id="why-heading">Why Clean Grooves Change Your Game.</h2>
        </div>
        <div className="care-step-grid">
          {whyGrooves.map((item) => (
            <div key={item.head} className="care-step-card">
              <strong>{item.head}</strong>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section reveal" aria-labelledby="routine-heading">
        <div className="section-heading">
          <p className="eyebrow">The 10-Minute Routine</p>
          <h2 id="routine-heading">Six Steps. Every Round.</h2>
        </div>
        <div className="care-step-grid">
          {routine.map((step) => (
            <div key={step.step} className="care-step-card">
              <small style={{ opacity: 0.55, display: 'block', fontWeight: 600 }}>Step {step.step}</small>
              <strong>{step.head}</strong>
              <p>{step.body}</p>
            </div>
          ))}
        </div>
        <p style={{ marginTop: '1.5rem', opacity: 0.8 }}>
          <Link href="/journal/how-to-clean-golf-clubs" className="text-link">Read the full club cleaning guide &rarr;</Link>
        </p>
      </section>

      <section id="care-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Shop Club Care</p>
            <h2>Club Care &amp; Cleaning Tools.</h2>
          </div>
          <Link className="text-link" href="/golf-towels">All Towels &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-club-care-kit" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Dual-Sided Club Brush</strong><p>Stiff + soft bristle, retractable groove cleaner — one tool for the full routine</p></Link>
              <Link href="/golf-towels" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Microfiber Club Towel</strong><p>Clips to bag D-ring. Use every hole to wipe the face before it goes back in the bag.</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Club Care FAQ.</h2>
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
          <p className="eyebrow">As a Gift</p>
          <h2 id="gift-heading">Golf Club Care as a Golf Gift.</h2>
        </div>
        <div className="care-step-grid">
          <Link href="/golf-gifts-for-dad" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Gift for Dad</strong>
            <p>The dual-sided brush and groove cleaner is the maintenance gift he knows he should use but has never bought. Practical, used every round, and better than another box of balls.</p>
          </Link>
          <Link href="/golf-gifts-for-husband" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Gift for Husband</strong>
            <p>If his clubs are more than 2 seasons old and he has never deep-cleaned them, the club care kit is the gift that visibly improves his game without new equipment.</p>
          </Link>
          <Link href="/golf-corporate-gifts" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Corporate Golf Gift</strong>
            <p>A club care kit at a corporate event says you understand golf — not just that you found the golf section. Practical, gender-neutral, and used at every event after.</p>
          </Link>
          <Link href="/kits/bag-upgrade-kit" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Bag Upgrade Kit</strong>
            <p>The WYX Bag Upgrade Kit bundles the club brush, microfiber towel, leather scorecard holder, and alignment sticks into one gift set. The complete functional upgrade.</p>
          </Link>
        </div>
      </section>

      <EmailCapture
        source="golf-club-care"
        campaign="club_care_routine"
        title="Cleaner Clubs. More Spin. Better Scores."
        body="Join the WYX list for club care guides, new accessories, and 10% off your first order with WYX10."
      />
    </>
  );
}
