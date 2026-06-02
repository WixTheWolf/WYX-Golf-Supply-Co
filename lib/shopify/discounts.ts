import { getUserErrors, shopifyAdminFetch } from './adminClient';

const FIND_DISCOUNT = `#graphql
query FindDiscount($query: String!) {
  codeDiscountNodes(first: 10, query: $query) {
    nodes {
      id
      codeDiscount {
        ... on DiscountCodeBasic {
          title
          startsAt
          endsAt
          codes(first: 10) { nodes { code } }
        }
      }
    }
  }
}`;

const CREATE_LAUNCH_DISCOUNT = `#graphql
mutation CreateDiscountCode($basicCodeDiscount: DiscountCodeBasicInput!) {
  discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
    codeDiscountNode {
      id
      codeDiscount {
        ... on DiscountCodeBasic {
          title
          startsAt
          endsAt
          codes(first: 10) { nodes { code } }
        }
      }
    }
    userErrors { field message code }
  }
}`;

export async function ensureLaunchDiscount() {
  const existing = await shopifyAdminFetch<any>(FIND_DISCOUNT, { query: 'code:WYX10' });
  const existingNode = existing.codeDiscountNodes.nodes.find((node: any) => node.codeDiscount?.codes?.nodes?.some((code: { code: string }) => code.code === 'WYX10'));
  if (existingNode) {
    return { ok: true, created: false, code: 'WYX10', title: existingNode.codeDiscount.title, id: existingNode.id };
  }

  const now = new Date();
  const endsAt = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const created = await shopifyAdminFetch<any>(CREATE_LAUNCH_DISCOUNT, {
    basicCodeDiscount: {
      title: 'WYX Launch 10% Off',
      code: 'WYX10',
      startsAt: now.toISOString(),
      endsAt: endsAt.toISOString(),
      customerSelection: { all: true },
      customerGets: { value: { percentage: 0.1 }, items: { all: true } },
      appliesOncePerCustomer: false,
      usageLimit: 500,
      combinesWith: { orderDiscounts: true, productDiscounts: true, shippingDiscounts: true }
    }
  });
  const errors = getUserErrors(created);
  if (errors.length) throw new Error(errors.map((error: any) => `${error.message}${error.code ? ` (${error.code})` : ''}`).join(', '));
  return { ok: true, created: true, code: 'WYX10', title: created.discountCodeBasicCreate.codeDiscountNode.codeDiscount.title, id: created.discountCodeBasicCreate.codeDiscountNode.id };
}
