import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function present(names: string[]) {
  return names.some((name) => Boolean(process.env[name]));
}

const storefrontTokenNames = ['NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN', 'SHOPIFY_STOREFRONT_ACCESS_TOKEN', 'SHOPIFY_STOREFRONT_API_TOKEN', 'PUBLIC_STOREFRONT_API_TOKEN', 'STOREFRONT_ACCESS_TOKEN'];
const serverFallbackTokenNames = ['SHOPIFY_ADMIN_ACCESS_TOKEN', 'SHOPIFY_ACCESS_TOKEN'];
const adminTokenNames = ['SHOPIFY_ADMIN_ACCESS_TOKEN', 'ADMIN_API_ACCESS_TOKEN', 'SHOPIFY_ACCESS_TOKEN'];

export async function GET() {
  const storefrontDomain = present(['NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN', 'SHOPIFY_STORE_DOMAIN', 'SHOPIFY_SHOP_DOMAIN', 'SHOPIFY_DOMAIN']);
  const explicitStorefrontToken = present(storefrontTokenNames);
  const serverFallbackToken = present(serverFallbackTokenNames);
  const effectiveStorefrontToken = explicitStorefrontToken || serverFallbackToken;
  const adminDomain = present(['SHOPIFY_STORE_DOMAIN', 'NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN', 'SHOPIFY_SHOP_DOMAIN', 'SHOPIFY_DOMAIN']);
  const adminToken = present(adminTokenNames);

  return NextResponse.json({
    ok: storefrontDomain && effectiveStorefrontToken,
    storefront: { domain: storefrontDomain, token: explicitStorefrontToken, effectiveToken: effectiveStorefrontToken, usingServerFallback: !explicitStorefrontToken && serverFallbackToken },
    admin: { domain: adminDomain, token: adminToken },
    aliasesChecked: { storefrontToken: storefrontTokenNames, serverFallbackToken: serverFallbackTokenNames, adminToken: adminTokenNames },
    mode: storefrontDomain && effectiveStorefrontToken ? 'shopify' : 'demo',
    note: 'Presence check only. No secret values are exposed.'
  });
}
