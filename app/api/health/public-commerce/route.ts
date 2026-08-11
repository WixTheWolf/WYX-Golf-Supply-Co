import { NextResponse } from 'next/server';
import { shopifyAdminFetch } from '@/lib/shopify/adminClient';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function present(names: string[]) {
  return names.some((name) => Boolean(process.env[name]));
}

async function adminConnectionIsLive() {
  try {
    const data = await shopifyAdminFetch<{ shop: { id: string } }>(`#graphql
      query PublicCommerceAdminHealth {
        shop { id }
      }
    `);
    return Boolean(data?.shop?.id);
  } catch {
    return false;
  }
}

async function wyx10Status() {
  try {
    const data = await shopifyAdminFetch<any>(`#graphql
      query PublicCommerceDiscountHealth($code: String!) {
        codeDiscountNodeByCode(code: $code) {
          codeDiscount {
            __typename
            ... on DiscountCodeBasic {
              status
              startsAt
              endsAt
              shortSummary
            }
          }
        }
      }
    `, { code: 'WYX10' });

    const discount = data?.codeDiscountNodeByCode?.codeDiscount;
    if (!discount) return { readable: true, exists: false, active: false };
    return {
      readable: true,
      exists: true,
      active: discount.status === 'ACTIVE',
      status: discount.status || null,
      startsAt: discount.startsAt || null,
      endsAt: discount.endsAt || null,
      summary: discount.shortSummary || null
    };
  } catch {
    return { readable: false, exists: null, active: null };
  }
}

export async function GET() {
  const storefrontDomain = present(['NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN', 'SHOPIFY_STORE_DOMAIN', 'SHOPIFY_SHOP_DOMAIN', 'SHOPIFY_DOMAIN']);
  const storefrontToken = present(['NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN', 'SHOPIFY_STOREFRONT_ACCESS_TOKEN', 'SHOPIFY_STOREFRONT_API_TOKEN', 'PUBLIC_STOREFRONT_API_TOKEN', 'STOREFRONT_ACCESS_TOKEN']);
  const adminDomain = present(['SHOPIFY_STORE_DOMAIN', 'NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN', 'SHOPIFY_SHOP_DOMAIN', 'SHOPIFY_DOMAIN']);
  const adminToken = present(['SHOPIFY_ADMIN_ACCESS_TOKEN', 'ADMIN_API_ACCESS_TOKEN', 'SHOPIFY_ACCESS_TOKEN']);
  const adminClientCredentials = present(['SHOPIFY_CLIENT_ID']) && present(['SHOPIFY_CLIENT_SECRET']);
  const adminLive = adminDomain && (adminToken || adminClientCredentials) ? await adminConnectionIsLive() : false;
  const discount = adminLive ? await wyx10Status() : { readable: false, exists: null, active: null };

  const tracking = {
    googleAnalytics: present(['NEXT_PUBLIC_GA_MEASUREMENT_ID']),
    metaPixel: present(['NEXT_PUBLIC_META_PIXEL_ID']),
    tiktokPixel: present(['NEXT_PUBLIC_TIKTOK_PIXEL_ID']),
    clarity: present(['NEXT_PUBLIC_CLARITY_ID']),
    judgeMe: present(['NEXT_PUBLIC_JUDGE_ME_PUBLIC_TOKEN'])
  };

  const email = {
    klaviyo: present(['KLAVIYO_PRIVATE_API_KEY']) && present(['KLAVIYO_LIST_ID']),
    shopifyLeadCapture: adminLive
  };

  return NextResponse.json({
    ok: storefrontDomain && storefrontToken,
    storefront: { domain: storefrontDomain, token: storefrontToken },
    admin: { domain: adminDomain, token: adminToken, clientCredentials: adminClientCredentials, live: adminLive },
    discount: { code: 'WYX10', ...discount },
    tracking,
    email,
    aliasesChecked: {
      storefrontToken: ['NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN', 'SHOPIFY_STOREFRONT_ACCESS_TOKEN', 'SHOPIFY_STOREFRONT_API_TOKEN', 'PUBLIC_STOREFRONT_API_TOKEN', 'STOREFRONT_ACCESS_TOKEN'],
      adminToken: ['SHOPIFY_ADMIN_ACCESS_TOKEN', 'ADMIN_API_ACCESS_TOKEN', 'SHOPIFY_ACCESS_TOKEN']
    },
    mode: storefrontDomain && storefrontToken ? 'shopify' : 'demo',
    note: 'Presence/connectivity checks only. No secret values or private customer/order data are exposed.'
  });
}
