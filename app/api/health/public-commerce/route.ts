import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const storefrontDomain = Boolean(process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN);
  const storefrontToken = Boolean(process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN);
  const adminDomain = Boolean(process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN);
  const adminToken = Boolean(process.env.SHOPIFY_ADMIN_ACCESS_TOKEN);

  return NextResponse.json({
    ok: storefrontDomain && storefrontToken,
    storefront: { domain: storefrontDomain, token: storefrontToken },
    admin: { domain: adminDomain, token: adminToken },
    mode: storefrontDomain && storefrontToken ? 'shopify' : 'demo',
    note: 'Presence check only. No secret values are exposed.'
  });
}
