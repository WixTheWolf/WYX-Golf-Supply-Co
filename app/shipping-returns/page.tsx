import type { Metadata } from 'next';
import { supportEmail } from '@/lib/support';

export const metadata: Metadata = { title: 'Shipping & Returns', description: 'Shipping and returns guidance for WYX Golf Supply Co.' };
const policies = [
  ['Order Handling', 'Timing can vary by item and destination, and the latest estimate is shown at checkout before you place your order.'],
  ['Shipping', 'Shipping options, rates, and delivery estimates are calculated before you place your order.'],
  ['Returns', "Return eligibility can vary by item, especially for personalized or final-sale products. If you need help, contact WYX support with your order number and we'll point you in the right direction."],
  ['Damaged or Incorrect Items', 'If your order arrives damaged or incorrect, contact us promptly with your order number and clear photos of the product and packaging.'],
  ['Personalized Products', 'Customized or personalized goods may be final sale when stated on the product listing.']
];

export default function Page() {
  return <section className="page-hero"><p className="eyebrow">Customer Care</p><h1>Shipping & Returns</h1><p>We keep it simple. Shipping rates and delivery estimates are shown before payment, and we're here to help if something arrives damaged or incorrect.</p><p>Support: <a className="text-link" href={`mailto:${supportEmail}`}>{supportEmail}</a></p>{policies.map(([heading, body]) => <div className="policy-card" key={heading}><h2>{heading}</h2><p>{body}</p></div>)}</section>;
}
