import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const shopDomain = process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_SHOP_DOMAIN || process.env.SHOPIFY_DOMAIN;
const apiVersion = process.env.SHOPIFY_API_VERSION || process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2026-01';
const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || process.env.ADMIN_API_ACCESS_TOKEN || process.env.SHOPIFY_ACCESS_TOKEN;
const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.SHOPIFY_STOREFRONT_API_TOKEN || process.env.PUBLIC_STOREFRONT_API_TOKEN || process.env.STOREFRONT_ACCESS_TOKEN;

function classifyToken(token?: string) {
  if (!token) return 'missing';
  if (token.startsWith('shpat_')) return 'shopify-admin-access-token';
  if (token.startsWith('shpss_')) return 'shopify-app-secret-not-admin-token';
  if (token.startsWith('shpca_')) return 'shopify-custom-app-token';
  if (token.startsWith('atkn_')) return 'shopify-app-automation-token-not-admin-token';
  if (/^[a-f0-9]{32,}$/i.test(token)) return 'hex-like-token';
  return 'present-unknown-format';
}

async function checkAdmin() {
  if (!shopDomain || !adminToken) return { ok: false, tokenKind: classifyToken(adminToken), error: 'Missing Shopify Admin domain or token.' };
  try {
    const response = await fetch(`https://${shopDomain}/admin/api/${apiVersion}/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': adminToken },
      body: JSON.stringify({ query: 'query { shop { name myshopifyDomain } }' }),
      cache: 'no-store'
    });
    const json = await response.json();
    return { ok: response.ok && !json.errors, status: response.status, tokenKind: classifyToken(adminToken), error: json.errors ? JSON.stringify(json.errors) : null };
  } catch (error) {
    return { ok: false, tokenKind: classifyToken(adminToken), error: error instanceof Error ? error.message : 'Unknown Admin API error.' };
  }
}

async function checkStorefront() {
  if (!shopDomain || !storefrontToken) return { ok: false, tokenKind: classifyToken(storefrontToken), error: 'Missing Shopify Storefront domain or token.' };
  try {
    const response = await fetch(`https://${shopDomain}/api/${apiVersion}/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': storefrontToken },
      body: JSON.stringify({ query: 'query { shop { name } }' }),
      cache: 'no-store'
    });
    const json = await response.json();
    return { ok: response.ok && !json.errors, status: response.status, tokenKind: classifyToken(storefrontToken), error: json.errors ? JSON.stringify(json.errors) : null };
  } catch (error) {
    return { ok: false, tokenKind: classifyToken(storefrontToken), error: error instanceof Error ? error.message : 'Unknown Storefront API error.' };
  }
}

export async function GET() {
  const [admin, storefront] = await Promise.all([checkAdmin(), checkStorefront()]);
  return NextResponse.json({
    ok: admin.ok && storefront.ok,
    domainPresent: Boolean(shopDomain),
    apiVersion,
    admin,
    storefront,
    note: 'Live Shopify connection check. Token values are never returned.'
  });
}
