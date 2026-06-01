import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy', description: 'Privacy information for WYX Golf Supply Co.' };

export default function Page() {
  return <section className="page-hero"><p className="eyebrow">Privacy</p><h1>Your Checkout Is Handled By Shopify.</h1><p>WYX Golf Supply Co. uses Shopify to provide product availability, cart, checkout, order processing, and supplier-backed fulfillment. Information submitted during checkout is handled through Shopify and the services needed to complete your order.</p><p>This storefront does not run a separate marketing signup form or collect payment details directly.</p></section>;
}
