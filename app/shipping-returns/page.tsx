import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Shipping & Returns', description: 'Shipping and returns guidance for WYX Golf Supply Co.' };
const policies = [
  ['Order Handling', 'WYX works with trusted golf suppliers. Processing and delivery timing can vary by product and destination.'],
  ['Shipping', 'Available shipping methods, rates, and estimated timing are calculated at checkout before you place an order.'],
  ['Returns', 'Return eligibility may vary by supplier and product. Review the listing carefully before ordering and use the contact details in your order confirmation for return help.'],
  ['Damaged Items', 'If an item arrives damaged, contact support promptly with your order number and clear photos of the product and packaging.'],
  ['Personalized Products', 'Customized or personalized goods may be final sale when stated on the product listing.']
];

export default function Page() {
  return <section className="page-hero"><p className="eyebrow">Customer Care</p><h1>Shipping & Returns</h1><p>Clear expectations for useful golf gear, gift-ready picks, and better bag builds.</p>{policies.map(([heading, body]) => <div className="policy-card" key={heading}><h2>{heading}</h2><p>{body}</p></div>)}</section>;
}
