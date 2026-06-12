/**
 * DSers / Spocket fulfillment pipeline status.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { getAdminAccessToken } from '../lib/shopify/adminToken';
import { verifiedDropshipCatalog } from '../lib/shopify/verifiedDropshipCatalog';

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
  const connPath = join(process.cwd(), 'data', 'dsers-spocket-connection.json');
  const conn = existsSync(connPath) ? JSON.parse(readFileSync(connPath, 'utf8')) : {};

  const handles = verifiedDropshipCatalog.products.map((p) => p.handle);
  const found: Record<string, any> = {};

  for (const handle of handles) {
    const data = await gql(`query($q: String!) {
      products(first: 1, query: $q) {
        nodes {
          handle status tags
          variants(first:1) { nodes { sku inventoryPolicy } }
        }
      }
    }`, { q: `handle:${handle}` });
    const p = data.data?.products?.nodes?.[0];
    if (p) found[handle] = p;
    await new Promise((r) => setTimeout(r, 150));
  }

  const dsersCatalog = verifiedDropshipCatalog.products.filter((p) => p.supplier === 'dsers-aliexpress');
  const spocketCatalog = verifiedDropshipCatalog.products.filter((p) => p.supplier === 'spocket');

  const dsersInShopify = dsersCatalog.filter((p) => found[p.handle]);
  const spocketInShopify = spocketCatalog.filter((p) => found[p.handle]);
  const taggedDsers = dsersInShopify.filter((p) => found[p.handle].tags.includes('supplier-dsers'));
  const taggedSpocket = spocketInShopify.filter((p) => found[p.handle].tags.includes('supplier-spocket'));
  const continuePolicy = Object.values(found).filter((p) => p.variants?.nodes?.[0]?.inventoryPolicy === 'CONTINUE').length;

  console.log('\n═══ DSers / Spocket Pipeline Status ═══\n');
  console.log(`DSers app installed:       ${conn.dsersInstalled ? '✅' : '⏳'}`);
  console.log(`Spocket app installed:     ${conn.spocketInstalled ? '✅' : '⏳'}`);
  console.log(`Shopify Collective:        ${conn.shopifyCollectiveEnabled ? '✅' : '⏳'}`);
  console.log(`Catalog synced to Shopify: ${Object.keys(found).length}/${handles.length}`);
  console.log(`DSers-tagged in Shopify:   ${taggedDsers.length}/${dsersCatalog.length}`);
  console.log(`Spocket-tagged:            ${taggedSpocket.length}/${spocketCatalog.length}`);
  console.log(`CONTINUE inventory policy: ${continuePolicy}/${Object.keys(found).length}`);
  console.log(`DSers mapped (manual):     ${conn.dsersMappedCount ?? 0}/${conn.dsersTargetCount ?? dsersCatalog.length}`);
  console.log(`Spocket mapped (manual):   ${conn.spocketMappedCount ?? 0}/${conn.spocketTargetCount ?? spocketCatalog.length}\n`);

  console.log('DSers SKUs (map in app → existing handle):');
  for (const p of dsersCatalog) {
    const node = found[p.handle];
    const icon = node ? (node.tags.includes('supplier-dsers') ? '🏷' : '📦') : '❌';
    const status = node?.status || 'missing';
    console.log(`  ${icon} ${p.handle} | ${status} | ${p.supplierSku}`);
  }

  console.log('\nSpocket SKUs:');
  for (const p of spocketCatalog) {
    const node = found[p.handle];
    const icon = node ? (node.tags.includes('supplier-spocket') ? '🏷' : '📦') : '❌';
    console.log(`  ${icon} ${p.handle} | ${node?.status || 'missing'}`);
  }

  console.log('\nNext:');
  if (!conn.dsersInstalled) console.log('  → Install DSers: npm run dsers:playbook');
  if (!conn.spocketInstalled) console.log('  → Install Spocket: npm run dsers:playbook');
  if ((conn.dsersMappedCount ?? 0) < dsersCatalog.length) console.log('  → Map DSers imports to existing handles');
  if ((conn.spocketMappedCount ?? 0) < spocketCatalog.length) console.log('  → Map Spocket import to spocket-golf-rope-cap');
  if (conn.dsersInstalled && conn.spocketInstalled && (conn.dsersMappedCount ?? 0) >= dsersCatalog.length) {
    console.log('  → npm run enable:wyx-inventory');
  }
  console.log('');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});