/**
 * Unified TopDawg pipeline status.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { getAdminAccessToken } from '../lib/shopify/adminToken';

async function gql(query: string, variables: Record<string, unknown> = {}) {
  const domain = process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = await getAdminAccessToken();
  const res = await fetch(`https://${domain}/admin/api/2026-01/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query, variables }),
  });
  return (await res.json()) as { data?: any; errors?: unknown };
}

async function main() {
  const conn = existsSync(join(process.cwd(), 'data', 'topdawg-connection.json'))
    ? JSON.parse(readFileSync(join(process.cwd(), 'data', 'topdawg-connection.json'), 'utf8'))
    : {};
  const sample = JSON.parse(readFileSync(join(process.cwd(), 'data', 'topdawg-sample-order.json'), 'utf8'));

  const data = await gql(`query {
    products(first: 20, query: "tag:topdawg-shortlist") {
      nodes {
        handle status
        variants(first:1) { nodes { sku inventoryPolicy availableForSale } }
        resourcePublicationsV2(first:5) {
          edges { node { publication { name } isPublished } }
        }
      }
    }
  }`);

  const products = data.data?.products?.nodes ?? [];
  const onHeadless = products.filter((p: any) =>
    p.resourcePublicationsV2.edges.some((e: any) => e.node.isPublished && /headless/i.test(e.node.publication.name)),
  );

  console.log('\n═══ TopDawg Pipeline Status ═══\n');
  console.log(`Shopify connected:     ${conn.shopifyConnected ? '✅' : '⏳'}`);
  console.log(`Import list mapped:    ${conn.importListMapped ? '✅' : '⏳ (dashboard → Catalog → Import List)'}`);
  console.log(`Sample order placed:   ${conn.sampleOrderPlaced ? '✅' : '⏳ (~$53.60 — 3 SKUs)'}`);
  console.log(`Variant SKUs set:      ${conn.variantSkusSet ?? 0}/8`);
  console.log(`On Headless storefront: ${onHeadless.length}/8\n`);

  console.log('Products:');
  for (const p of products) {
    const v = p.variants.nodes[0];
    const hl = p.resourcePublicationsV2.edges.some((e: any) => e.node.isPublished && /headless/i.test(e.node.publication.name));
    console.log(`  ${hl ? '🌐' : '🔒'} ${p.handle} | ${v?.inventoryPolicy || '?'} | ${v?.sku || 'no-sku'}`);
  }

  console.log('\nSample QA:');
  for (const item of sample.lineItems) {
    console.log(`  ${item.qaPassed ? '✅' : '⏳'} ${item.supplierSku} — ${item.title}`);
  }

  const qaDone = sample.lineItems.every((i: { qaPassed: boolean }) => i.qaPassed);
  console.log('\nNext:');
  if (!conn.importListMapped) console.log('  → Map 8 SKUs in TopDawg Import List (npm run topdawg:playbook)');
  if (!conn.sampleOrderPlaced) console.log('  → Place sample order in TopDawg dashboard');
  if (qaDone) console.log('  → npm run publish:topdawg-headless');
  else if (sample.lineItems.some((i: { qaPassed: boolean }) => i.qaPassed))
    console.log('  → npm run publish:topdawg-headless (partial QA passed)');
  else console.log('  → Wait for samples; set qaPassed in data/topdawg-sample-order.json');
  console.log('');
}

main().catch((e) => { console.error(e); process.exit(1); });