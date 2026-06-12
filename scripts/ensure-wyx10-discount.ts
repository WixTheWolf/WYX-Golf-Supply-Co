/**
 * Ensures WYX10 (10% off first order) exists as an active Shopify discount code.
 * Falls back to Storefront cart verification when Admin discount scopes are missing.
 */
import { shopifyAdminFetch } from '../lib/shopify/adminClient';
import { shopifyFetch } from '../lib/shopify/client';
import { CART_CREATE } from '../lib/shopify/queries';

const CODE = 'WYX10';

async function verifyOnStorefront() {
  const products = await shopifyFetch<any>(`
    query { products(first: 5, query: "available_for_sale:true") { edges { node { variants(first: 1) { edges { node { id } } } } } } }
  `);
  const variant = products.products.edges.map((edge: any) => edge.node.variants.edges[0]?.node).find(Boolean);
  if (!variant) throw new Error('No sale-ready variant found for WYX10 cart test.');
  const created = await shopifyFetch<any>(CART_CREATE, {
    lines: [{ merchandiseId: variant.id, quantity: 1 }],
    discountCodes: [CODE]
  });
  const discount = created.cartCreate?.cart?.discountCodes?.find((d: { code: string; applicable: boolean }) => d.code.toUpperCase() === CODE);
  if (!discount?.applicable) throw new Error(`${CODE} is not applicable on storefront cart.`);
  console.log(`✅ ${CODE} verified on storefront cart (Admin discount scopes unavailable)`);
}

const FIND = `
  query FindDiscount($query: String!) {
    codeDiscountNodes(first: 5, query: $query) {
      nodes {
        id
        codeDiscount {
          ... on DiscountCodeBasic {
            title
            status
            codes(first: 1) { nodes { code } }
          }
        }
      }
    }
  }
`;

const CREATE = `
  mutation CreateDiscount($input: DiscountCodeBasicInput!) {
    discountCodeBasicCreate(basicCodeDiscount: $input) {
      codeDiscountNode { id }
      userErrors { field message }
    }
  }
`;

async function main() {
  const existing = await shopifyAdminFetch<any>(FIND, { query: `code:${CODE}` });
  const node = existing.codeDiscountNodes?.nodes?.[0];
  const basic = node?.codeDiscount;
  if (basic?.codes?.nodes?.some((n: { code: string }) => n.code.toUpperCase() === CODE)) {
    console.log(`✅ ${CODE} already exists — status: ${basic.status}`);
    return;
  }

  console.log(`Creating ${CODE} discount...`);
  const result = await shopifyAdminFetch<any>(CREATE, {
    input: {
      title: 'WYX10 — 10% Off First Order',
      code: CODE,
      startsAt: new Date().toISOString(),
      customerSelection: { all: true },
      customerGets: {
        value: { percentage: 0.1 },
        items: { all: true }
      },
      appliesOncePerCustomer: true,
      usageLimit: null,
      combinesWith: {
        orderDiscounts: false,
        productDiscounts: false,
        shippingDiscounts: true
      }
    }
  });

  const errors = result.discountCodeBasicCreate?.userErrors || [];
  if (errors.length) throw new Error(errors.map((e: { message: string }) => e.message).join(', '));
  console.log(`✅ Created ${CODE} discount successfully`);
}

main().catch(async (err) => {
  if (/read_discounts|write_discounts|discountCode/i.test(err.message)) {
    try {
      await verifyOnStorefront();
      return;
    } catch (verifyErr) {
      console.error('Storefront verify failed:', verifyErr instanceof Error ? verifyErr.message : verifyErr);
    }
  }
  console.error('Error:', err.message);
  process.exit(1);
});