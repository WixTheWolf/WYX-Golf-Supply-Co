/**
 * Verifies WYX10 works on the Storefront cart (does not require Admin discount scopes).
 */
import { shopifyFetch } from '../lib/shopify/client';
import { CART_CREATE } from '../lib/shopify/queries';

const CODE = 'WYX10';

async function main() {
  const products = await shopifyFetch<any>(`
    query {
      products(first: 5, query: "available_for_sale:true") {
        edges { node { handle variants(first: 1) { edges { node { id price { amount } } } } } }
      }
    }
  `);

  const variant = products.products.edges
    .map((edge: any) => edge.node.variants.edges[0]?.node)
    .find(Boolean);

  if (!variant) throw new Error('No sale-ready variant found for cart test.');

  const created = await shopifyFetch<any>(CART_CREATE, {
    lines: [{ merchandiseId: variant.id, quantity: 1 }],
    discountCodes: [CODE]
  });

  const cart = created.cartCreate?.cart;
  const discount = cart?.discountCodes?.find((d: { code: string }) => d.code.toUpperCase() === CODE);
  const subtotal = Number(cart?.cost?.subtotalAmount?.amount || 0);
  const total = Number(cart?.cost?.totalAmount?.amount || subtotal);
  const savings = subtotal - total;

  if (!discount?.applicable) {
    throw new Error(`${CODE} is not applicable on storefront cart. Create or activate it in Shopify Admin.`);
  }

  console.log(`✅ ${CODE} verified on storefront cart`);
  console.log(`   subtotal: $${subtotal.toFixed(2)} → total: $${total.toFixed(2)} (saved $${savings.toFixed(2)})`);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});