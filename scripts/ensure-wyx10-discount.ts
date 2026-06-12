/**
 * Ensures WYX10 (10% off first order) exists as an active Shopify discount code.
 */
import { shopifyAdminFetch } from '../lib/shopify/adminClient';

const CODE = 'WYX10';

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

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});