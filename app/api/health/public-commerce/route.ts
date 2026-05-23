import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function present(names: string[]) {
  return names.some((name) => Boolean(process.env[name]));
}

export async function GET() {
  const storefrontDomain = present(['NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN', 'SHOPIFY_STORE_DOMAIN', 'SHOPIFY_SHOP_DOMAIN', 'SHOPIFY_DOMAIN']);
  const storefrontToken = present(['NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN', 'SHOPIFY_STOREFRONT_ACCESS_TOKEN', 'SHOPIFY_STOREFRONT_API_TOKEN', 'PUBLIC_STOREFRONT_API_TOKEN', 'STOREFRONT_ACCESS_TOKEN']);
  const adminDomain = present(['SHOPIFY_STORE_DOMAIN', 'NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN', 'SHOPIFY_SHOP_DOMAIN', 'SHOPIFY_DOMAIN']);
  const adminToken = present(['SHOPIFY_ADMIN_ACCESS_TOKEN', 'ADMIN_API_ACCESS_TOKEN', 'SHOPIFY_ACCESS_TOKEN']);

  return NextResponse.json({
    ok: storefrontDomain && storefrontToken,
    storefront: { domain: storefrontDomain, token: storefrontToken },
    admin: { domain: adminDomain, token: adminToken },
    aliasesChecked: {
      storefrontToken: ['NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN', 'SHOPIFY_STOREFRONT_ACCESS_TOKEN', 'SHOPIFY_STOREFRONT_API_TOKEN', 'PUBLIC_STOREFRONT_API_TOKEN', 'STOREFRONT_ACCESS_TOKEN'],
      adminToken: ['SHOPIFY_ADMIN_ACCESS_TOKEN', 'ADMIN_API_ACCESS_TOKEN', 'SHOPIFY_ACCESS_TOKEN']
    },
    mode: storefrontDomain && storefrontToken ? 'shopify' : 'demo',
    note: 'Presence check only. No secret values are exposed.'
  });
}
