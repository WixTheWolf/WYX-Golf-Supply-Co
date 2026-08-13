import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About WYX Golf Supply Co.',
  description: 'WYX Golf Supply Co. curates useful golf gear, gift-ready picks, and better bag essentials for weekend golfers.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About WYX Golf Supply Co.',
    description: 'WYX Golf Supply Co. curates useful golf gear, gift-ready picks, and better bag essentials for weekend golfers.',
    url: '/about'
  }
};

export default function About() {
  return (
    <div className="lux-secondary">
      <section className="page-hero">
        <p className="eyebrow">About WYX</p>
        <h1>One Independent Point Of View On Golf&apos;s Best Stuff.</h1>
        <p>WYX Golf Supply Co. exists because shopping for golf gear should not require digging through thousands of near-identical products, inflated claims, and supplier copy. The job is to make the edit first, then make the reason for every pick clear.</p>
        <p>The shop is built for serious recreational golfers, style-conscious players, trip planners, and gift buyers who want better gear without the noise.</p>
        <div className="actions">
          <Link className="button primary" href="/products">Shop The Live Edit</Link>
          <Link className="button secondary dark" href="/the-bag-test">Read The WYX Standard</Link>
        </div>
      </section>

      <section className="section reveal" aria-labelledby="authority-heading">
        <div className="section-heading">
          <p className="eyebrow">The Editorial Authority</p>
          <h2 id="authority-heading">The Curation Is The Product.</h2>
        </div>
        <div className="care-step-grid">
          <div className="care-step-card"><strong>Would It Stay In The Bag?</strong><p>Useful beats novel. A WYX product needs a recognizable job or enough design value to keep earning its place.</p></div>
          <div className="care-step-card"><strong>Is The Listing Honest?</strong><p>Current inventory, real product media, accurate variants, and buying guidance that does not pretend every product will fix a golf swing.</p></div>
          <div className="care-step-card"><strong>Does It Fit The Whole Edit?</strong><p>WYX builds a golf wardrobe and bag one intentional piece at a time. More products are not automatically a better shop.</p></div>
        </div>
      </section>

      <section className="dark-section reveal" aria-labelledby="support-heading">
        <div><p className="eyebrow">Buying From WYX</p><h2 id="support-heading">The Details Stay Visible.</h2></div>
        <div>
          <p>Shopify confirms variants, discounts, shipping options, and the final total before payment. If an order arrives damaged or incorrect—or you need help understanding return eligibility—WYX support handles the question directly.</p>
          <div className="actions"><Link className="button primary" href="/shipping-returns">Shipping &amp; Returns</Link><Link className="button secondary" href="/contact">Contact WYX</Link></div>
        </div>
      </section>
    </div>
  );
}
