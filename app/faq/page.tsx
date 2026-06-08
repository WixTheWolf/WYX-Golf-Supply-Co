import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Golf FAQ — Products, Shipping, Returns & WYX10 | WYX Golf Supply Co.',
  description: 'Answers to the most common questions about WYX Golf Supply Co. — products, shipping timing, returns, the WYX10 discount code, and what makes a good golf gift.',
  alternates: { canonical: '/faq' }
};

const faqGroups: Array<{ heading: string; items: Array<[string, string]> }> = [
  {
    heading: 'Shopping & Products',
    items: [
      ['What golf products does WYX carry?', 'WYX carries golf gloves, ball markers, magnetic hat clips, golf towels, alignment sticks, putting mirrors, swing tempo trainers, rangefinders, grip tape, bamboo tees, club brushes, scorecard holders, shoe bags, golf balls, and apparel including hats, polos, quarter-zips, and socks.'],
      ['What should I buy first?', 'Start with the products you use every round: a clean towel, a reliable glove, and a milled ball marker. These three upgrade the bag immediately. Use WYX10 for 10% off your first order.'],
      ['Are products actually in stock and purchasable?', 'Every product on wyxgolfsupply.com is available through Shopify checkout. Pages only appear for items with inventory, real images, and a live buyable variant.'],
      ['What is WYX10?', 'WYX10 is the WYX launch discount code. Enter it at checkout for 10% off eligible products sitewide. No minimum order required.'],
    ]
  },
  {
    heading: 'Golf Gifts',
    items: [
      ['What are the best golf gifts under $60?', 'Top picks under $60 with no sizing risk: milled ball marker set ($18–$24), golf towel with clip ($28–$34), alignment sticks ($22), grip tape ($16). Stack 2–3 for a complete gift bundle.'],
      ['What is a good last-minute Father\'s Day golf gift?', 'A magnetic hat clip + ball marker ($24) ships in 1–2 business days with no sizing risk. Pair with grip tape or a towel for under $50. Father\'s Day is June 21 — order by June 18 for standard delivery.'],
      ['What golf gifts do not require sizing?', 'Ball markers, hat clips, towels, grip tape, alignment sticks, putting mirrors, bamboo tees, scorecard holders, club brushes, and shoe bags require no sizing. Golf balls and gloves do — check product listings.'],
      ['Are golf accessories good gifts for coworkers?', 'Yes. Ball markers, towels, and grip tape are practical, priced $15–$40, and require no sizing. Safe for any skill level. Use WYX10 for 10% off.'],
    ]
  },
  {
    heading: 'Shipping & Returns',
    items: [
      ['When do I see shipping cost and timing?', 'Shipping options, delivery estimates, and rates are shown at checkout before any payment is entered.'],
      ['How long does WYX shipping take?', 'Most orders ship within 1–2 business days. Standard delivery is typically 3–5 business days. Expedited options shown at checkout.'],
      ['What is the return policy?', 'WYX supports returns on products that arrive damaged or significantly different from the listing. Email support@wyxgolfsupply.com with your order number. Full policy at Shipping & Returns.'],
    ]
  },
  {
    heading: 'Products & Gear',
    items: [
      ['What size golf glove should I buy?', 'Golf gloves are sized S, M, ML, L, XL. Measure dominant hand width across the knuckles. The glove should fit snugly with no bunching at the fingertips.'],
      ['What is cabretta leather?', 'Cabretta leather is from a specific type of sheepskin that produces a thin, soft hide. It provides a near-barehand feel and is the standard for premium golf gloves at every level of play.'],
      ['What are alignment sticks used for?', 'Alignment sticks go on the ground at the range to check ball position, stance, target alignment, and swing path. Used by every PGA Tour player and every serious amateur.'],
      ['What is a putting alignment mirror?', 'A putting mirror is a flat reflective surface placed at address that shows eye position, shoulder alignment, and putter face angle — the three most common putting setup errors. Works on any flat surface.'],
    ]
  },
  {
    heading: 'About WYX',
    items: [
      ['Who is WYX Golf Supply Co. for?', 'WYX is for weekend golfers, golf trip planners, gift shoppers, scramble teams, and anyone who wants practical golf gear without a generic catalog. Brand line: gear for the boys, the trip, and the bag.'],
      ['Where is WYX based?', 'WYX Golf Supply Co. is a US-based curated golf shop. Customer support: support@wyxgolfsupply.com.'],
    ]
  }
];

const allFaqs = faqGroups.flatMap((group) => group.items);

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: allFaqs.map(([question, answer]) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer }
  }))
};

export default function FAQ() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="page-hero">
        <p className="eyebrow">Help &amp; FAQ</p>
        <h1>Before You Add To Bag.</h1>
        <p>Quick answers about products, shipping, gifting, and the WYX10 code.</p>
      </section>
      <section className="faq-page">
        {faqGroups.map((group) => (
          <div key={group.heading} className="faq-group">
            <h2>{group.heading}</h2>
            <div className="detail-list">
              {group.items.map(([question, answer]) => (
                <details key={question}>
                  <summary>{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        ))}
        <p className="faq-footer">
          Need more help? Email <a href="mailto:support@wyxgolfsupply.com">support@wyxgolfsupply.com</a> or read the{' '}
          <Link className="text-link" href="/shipping-returns">Shipping &amp; Returns policy</Link>.
          {' '}Shop <Link className="text-link" href="/golf-gifts">golf gifts</Link> or{' '}
          <Link className="text-link" href="/fathers-day-golf-gifts">Father&apos;s Day gifts</Link>.
        </p>
      </section>
    </>
  );
}
