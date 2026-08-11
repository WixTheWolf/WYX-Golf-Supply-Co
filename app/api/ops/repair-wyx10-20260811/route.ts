import { NextResponse } from 'next/server';
import { getUserErrors, shopifyAdminFetch } from '@/lib/shopify/adminClient';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FIND = `#graphql
  query RepairWyx10Find($code: String!) {
    codeDiscountNodeByCode(code: $code) {
      id
      codeDiscount {
        ... on DiscountCodeBasic {
          title
          status
          startsAt
          endsAt
          shortSummary
        }
      }
    }
  }
`;

const UPDATE = `#graphql
  mutation RepairWyx10Update($id: ID!, $input: DiscountCodeBasicInput!) {
    discountCodeBasicUpdate(id: $id, basicCodeDiscount: $input) {
      codeDiscountNode {
        id
        codeDiscount {
          ... on DiscountCodeBasic {
            title
            status
            startsAt
            endsAt
            shortSummary
          }
        }
      }
      userErrors { field message }
    }
  }
`;

async function repair() {
  try {
    const found = await shopifyAdminFetch<any>(FIND, { code: 'WYX10' });
    const node = found?.codeDiscountNodeByCode;
    if (!node?.id) return NextResponse.json({ ok: false, error: 'WYX10 not found.' }, { status: 404 });

    const result = await shopifyAdminFetch<any>(UPDATE, {
      id: node.id,
      input: {
        title: 'WYX10 — 10% Off First Order',
        startsAt: new Date().toISOString(),
        endsAt: null
      }
    });

    const errors = getUserErrors(result);
    if (errors.length) return NextResponse.json({ ok: false, errors: errors.map((error: any) => error.message) }, { status: 400 });

    const repaired = result.discountCodeBasicUpdate?.codeDiscountNode?.codeDiscount;
    return NextResponse.json({
      ok: true,
      code: 'WYX10',
      status: repaired?.status || null,
      startsAt: repaired?.startsAt || null,
      endsAt: repaired?.endsAt || null,
      summary: repaired?.shortSummary || null
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'WYX10 repair failed.' }, { status: 500 });
  }
}

export async function GET() {
  return repair();
}
