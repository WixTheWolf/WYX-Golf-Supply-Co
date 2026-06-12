/**
 * Post-connect TopDawg setup: variant SKUs, tags, connection status.
 * Does NOT publish to Headless (sample QA gate).
 *
 * Usage:
 *   npm run finalize:topdawg
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { getAdminAccessToken } from '../lib/shopify/adminToken';

type ShortlistProduct = {
  handle: string;
  supplierSku: string;
  tags: string[];
};

async function adminFetch(query: string, variables: Record<string, unknown> = {}) {
  const domain = process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const version = process.env.SHOPIFY_API_VERSION || '2026-01';
  const token = await getAdminAccessToken();
  const res = await fetch(`https://${domain}/admin/api/${version}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query, variables }),
  });
  const json = (await res.json()) as { data?: unknown; errors?: unknown };
  if (json.errors) throw new Error(JSON.stringify(json.errors).slice(0, 300));
  return json;
}

async function syncProduct(p: ShortlistProduct) {
  const data = await adminFetch(`
    query($q: String!) {
      products(first: 1, query: $q) {
        edges {
          node {
            id handle status tags
            resourcePublicationsV2(first: 5) {
              edges { node { publication { name } isPublished } }
            }
            variants(first: 1) { edges { node { id sku } } }
          }
        }
      }
    }
  `, { q: `handle:${p.handle}` });

  const node = (data as any).data?.products?.edges?.[0]?.node;
  if (!node) return { handle: p.handle, status: 'missing' };

  const mergedTags = Array.from(new Set([...(node.tags || []), ...p.tags, 'topdawg-shortlist', 'supplier-topdawg']));
  await adminFetch(`mutation($id: ID!, $tags: [String!]!) {
    productUpdate(product: { id: $id, tags: $tags }) { userErrors { message } }
  }`, { id: node.id, tags: mergedTags });

  const variantId = node.variants?.edges?.[0]?.node?.id;
  const targetSku = `TD-${p.supplierSku}`;
  if (variantId && node.variants.edges[0].node.sku !== targetSku) {
    await adminFetch(`mutation($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        userErrors { message }
      }
    }`, {
      productId: node.id,
      variants: [{ id: variantId, inventoryItem: { sku: targetSku, tracked: true } }],
    });
  }

  const published = (node.resourcePublicationsV2?.edges ?? []).filter((e: any) => e.node.isPublished);
  return {
    handle: p.handle,
    status: node.status,
    sku: targetSku,
    headless: published.some((e: any) => /headless/i.test(e.node.publication.name)),
  };
}

async function main() {
  const shortlist = JSON.parse(readFileSync(join(process.cwd(), 'data', 'topdawg-shortlist.json'), 'utf8'));
  const connectionPath = join(process.cwd(), 'data', 'topdawg-connection.json');

  console.log('\n🔗 Finalizing TopDawg ↔ Shopify connection\n');

  const results = [];
  for (const p of shortlist.products as ShortlistProduct[]) {
    process.stdout.write(`  ${p.handle}... `);
    try {
      const r = await syncProduct(p);
      results.push(r);
      console.log(`${r.status} sku:${(r as any).sku}${(r as any).headless ? ' ⚠️ ON HEADLESS' : ''}`);
      await new Promise((res) => setTimeout(res, 400));
    } catch (err) {
      console.log('ERROR', err instanceof Error ? err.message : err);
    }
  }

  const onHeadless = results.filter((r: any) => r.headless);
  const connection = {
    shopifyConnected: true,
    connectedAt: new Date().toISOString(),
    dashboardUrl: 'https://topdawg.com/reseller/dashboard',
    shopifyAdminUrl: 'https://admin.shopify.com/store/wyxgolfsupply/products',
    importListMapped: false,
    sampleOrderPlaced: false,
    headlessPublished: onHeadless.length > 0,
    variantSkusSet: results.filter((r: any) => r.sku).length,
    notes: onHeadless.length
      ? 'WARNING: Some SKUs published to Headless before sample QA.'
      : 'ACTIVE in Shopify admin; not on Headless until sample QA passes.',
  };
  writeFileSync(connectionPath, JSON.stringify(connection, null, 2));

  console.log('\n✅ Connection status saved:', connectionPath);
  console.log(`   ${results.length} products synced | Headless live: ${onHeadless.length}`);

  if (!onHeadless.length) {
    console.log('\n📋 Next from TopDawg dashboard:');
    console.log('   1. Add 8 SKUs to Import List (npm run topdawg:playbook for list)');
    console.log('   2. Place 3-unit sample order (~$53.60)');
    console.log('   3. After QA → npm run publish:topdawg-headless');
  }
}

main().catch((e) => { console.error(e); process.exit(1); });