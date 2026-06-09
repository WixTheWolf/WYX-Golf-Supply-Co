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
  title: 'Golf Home Practice Equipment — Chipping Nets, Putting Mats & Training Aids | WYX Golf Supply Co.',
  description: 'Golf home practice equipment that delivers real improvement between rounds — collapsible chipping nets, indoor putting mats, alignment sticks, and impact tape. All under $50.',
  alternates: { canonical: '/golf-home-practice' },
  openGraph: {
    title: 'Golf Home Practice Equipment | WYX Golf Supply Co.',
    description: 'The home practice kit that actually improves your score: chipping net, putting mat, alignment sticks, impact tape. All under $50.',
    url: '/golf-home-practice'
  }
};

const practiceSetups = [
  { head: 'The Chipping Net Setup', body: 'A collapsible chipping net ($38) in the backyard produces more improvement per hour than almost any other single practice investment. Pitch shots with a wedge from 10-30 yards — the distance that costs most amateurs 3-4 shots per round — with instant feedback on contact and trajectory. Swing for 20 minutes, three times a week, and your short game will measurably improve within two weeks.' },
  { head: 'The Indoor Putting Mat Setup', body: 'A 9-foot indoor putting mat ($48) removes the most common excuse for not practicing putting: "I have to drive to the course." Rolling 50 putts on the mat before bed, focusing on start-line consistency with the built-in alignment guides, produces the same benefit as a dedicated range session — without leaving home. The velvet surface rolls true and the automatic ball return eliminates the setup friction that stops most golfers from practicing daily.' },
  { head: 'The Alignment + Impact Tape Combo', body: 'Alignment sticks ($24) on the floor in front of the TV show ball position and stance width relative to a fixed reference. Impact labels ($14) on a practice club face show exactly where contact occurs during dry-swing practice. The combination addresses the two most common amateur errors (setup and face contact) for under $40 total — less than a single lesson.' },
  { head: 'The Complete Home Practice Kit', body: 'Chipping net + putting mat + alignment sticks + impact tape = the full home practice kit for under $130. This is the setup that replaces random range sessions with structured improvement: short game, putting, setup alignment, and face contact — all four areas covered without a club membership or a 20-minute drive.' }
];

const faqs: [string, string][] = [
  ['What is the best golf practice equipment for home?', 'The best home golf practice equipment for most golfers is a collapsible chipping net ($38) for short game, a 9-foot putting mat ($48) for putting, and alignment sticks ($24) for setup drills. These three cover the areas that produce the most improvement per hour of practice.'],
  ['Can you practice golf at home without a net?', 'Yes — a putting mat and alignment sticks work well inside without a net. Impact tape applied to a club face for dry-swing practice on carpet also produces useful feedback without hitting balls. The chipping net adds the ability to actually hit chip shots — which produces faster improvement than dry swings alone.'],
  ['What is the best indoor putting mat?', 'The best indoor putting mat has a real-feel velvet or microfiber surface (not astroturf), built-in alignment guides, and an automatic ball return. A 9-foot length is enough to practice 6-10 foot putts — the most score-relevant length. Mats under $50 with these features outperform basic mats sold at much higher prices.'],
  ['How often should I practice golf at home?', 'Twenty minutes of deliberate practice 3-4 times per week produces measurable improvement in 2-3 weeks. Short game practice (chipping net, 20 minutes) and putting practice (mat, 10 minutes) before bed are the highest-return sessions. You do not need to practice every day — consistency matters more than volume.']
];

const jsonLd = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
};

function homeScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/chipping.net|putting.mat|alignment.stick|impact.tape|resistance.band/i.test(product.title + ' ' + product.handle)) score += 25;
  if (/training/i.test(product.productType)) score += 8;
  return score;
}

export default async function GolfHomePracticePage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts.sort((a, b) => homeScore(b) - homeScore(a)).slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Golf Home Practice Equipment',
        url: `${siteUrl}/golf-home-practice`,
        breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Golf Home Practice', item: `${siteUrl}/golf-home-practice` }
        ]}
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Practice Between Rounds</p>
          <h1>Golf Home Practice Equipment.</h1>
          <p className="deal-hero-sub">Chipping nets, putting mats, alignment sticks, and impact tape — the home practice kit that produces real improvement without a range trip. All under $50.</p>
          <div className="actions">
            <Link className="button primary" href="#products">Shop Practice Gear</Link>
            <Link className="button secondary" href="/golf-training-aids">All Training Aids</Link>
          </div>
        </div>
      </section>

      <div className="deal-strip">
        <span>🏡 Backyard + indoor</span>
        <span>🏌️ Chipping nets from $38</span>
        <span>⛳ Putting mats from $48</span>
        <span>🎁 Use WYX10 for 10% off</span>
      </div>

      <section className="section reveal">
        <div className="section-heading">
          <p className="eyebrow">Home Practice Setups</p>
          <h2>Four Practice Setups That Actually Work.</h2>
        </div>
        <div className="care-step-grid">
          {practiceSetups.map((s) => (
            <div key={s.head} className="care-step">
              <strong>{s.head}</strong>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="products" className="section reveal">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Home Practice</p>
            <h2>Practice Gear For Home & Backyard.</h2>
          </div>
          <Link className="text-link" href="/golf-practice-gear">See All Practice Gear</Link>
        </div>
        {products.length > 0
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : <p>Check back shortly — products are syncing.</p>}
      </section>

      <section className="section faq-section reveal" aria-labelledby="faq-heading">
        <div className="section-heading"><h2 id="faq-heading">Home Practice Questions.</h2></div>
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
        source="golf-home-practice"
        campaign="practice-gear"
        title="Get Better Between Rounds."
        body="Join the WYX list for home practice tips and 10% off your first order with WYX10."
      />
    </>
  );
}
