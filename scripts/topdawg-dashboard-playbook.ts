/**
 * Prints WYX-specific TopDawg dashboard steps (account → Shopify → import list → sample order).
 *
 * Usage:
 *   npm run topdawg:playbook
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { getAdminAccessToken } from '../lib/shopify/adminToken';

type Shortlist = {
  dashboardUrl: string;
  shopifyAppUrl: string;
  supplierUrl: string;
  sampleOrderSkus: string[];
  products: Array<{
    supplierSku: string;
    topdawgId: string;
    title: string;
    handle: string;
    dropshipCost: number;
    retailPrice: string;
    migrateTo: string | null;
  }>;
};

async function shopifyAppInstalled(): Promise<boolean> {
  try {
    const domain = process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const version = process.env.SHOPIFY_API_VERSION || '2026-01';
    const token = await getAdminAccessToken();
    const res = await fetch(`https://${domain}/admin/api/${version}/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({
        query: `query { appInstallations(first: 50) { edges { node { app { title } } } } }`,
      }),
    });
    const json = (await res.json()) as {
      data?: { appInstallations?: { edges: Array<{ node: { app: { title: string } } }> } };
    };
    const apps = json.data?.appInstallations?.edges?.map((e) => e.node.app.title) ?? [];
    return apps.some((t) => /topdawg/i.test(t));
  } catch {
    return false;
  }
}

async function main() {
  const meta = JSON.parse(readFileSync(join(process.cwd(), 'data', 'topdawg-shortlist.json'), 'utf8')) as Shortlist;
  const appOk = await shopifyAppInstalled();

  console.log('\n══════════════════════════════════════════════════════════');
  console.log('  WYX × TopDawg Dashboard Playbook');
  console.log('══════════════════════════════════════════════════════════\n');
  console.log(`Dashboard: ${meta.dashboardUrl}\n`);

  console.log('## A. Connect Shopify (do this first)\n');
  console.log('  1. Dashboard → Store Integrations → Shopify');
  console.log('  2. Connect wyxgolfsupply.myshopify.com (install app from dashboard — not App Store alone)');
  console.log(`  3. Video walkthrough: ${meta.supplierUrl}`);
  console.log(`  4. Shopify app: ${meta.shopifyAppUrl}`);
  const connPath = join(process.cwd(), 'data', 'topdawg-connection.json');
  const connected = existsSync(connPath) && JSON.parse(readFileSync(connPath, 'utf8')).shopifyConnected;
  if (connected || appOk) console.log('\n  ✅ Shopify connected to TopDawg');
  else console.log('\n  ⚠️  Complete Shopify connection in dashboard → Store Integrations');

  console.log('\n## B. Upgrade plan (required to sync + fulfill)\n');
  console.log('  Start-Up (free) = browse only. Upgrade to Business+ for:');
  console.log('    • Product sync to Shopify');
  console.log('    • Automated order fulfillment');
  console.log('    • 7-day free trial available from dashboard');

  console.log('\n## C. Import list — search these SKUs (do NOT bulk-import catalog)\n');
  console.log('  Catalog → Sports & Outdoors → search each SKU → Add to Import List\n');
  console.log('  | Search SKU | TopDawg ID | WYX Shopify draft | Retail |');
  console.log('  | --- | --- | --- | --- |');
  for (const p of meta.products) {
    console.log(`  | ${p.supplierSku} | ${p.topdawgId} | ${p.handle} | $${p.retailPrice} |`);
  }

  console.log('\n  After adding to Import List:');
  console.log('    • Set retail price to match WYX draft (column above)');
  console.log('    • Map/link to EXISTING draft — do not create duplicate listings');
  console.log('    • Keep drafts unpublished until sample QA passes');

  console.log('\n## D. Sample order — place NOW (~$53.60 cost)\n');
  console.log('  Dashboard → Orders → Manually Place Order (ship to yourself)\n');
  const samples = meta.products.filter((p) => meta.sampleOrderSkus.includes(p.supplierSku));
  for (const p of samples) {
    console.log(`  ☐ ${p.supplierSku} — ${p.title} ($${p.dropshipCost})`);
  }
  console.log('\n  QA before publishing drafts:');
  console.log('    • Delivered ≤5 business days');
  console.log('    • Photo matches TopDawg CDN / Shopify draft hero');
  console.log('    • Packaging passes Bag Test');
  console.log('  → Set qaPassed: true in data/topdawg-sample-order.json');

  console.log('\n## E. Wholesale deferral (ball markers)\n');
  for (const p of meta.products.filter((x) => x.migrateTo)) {
    console.log(`  ${p.title}: ${p.migrateTo}`);
  }

  console.log('\n## F. WYX admin links\n');
  console.log('  Shopify drafts: https://wyxgolfsupply.myshopify.com/admin/products?query=tag:topdawg-shortlist');
  console.log('  Re-run status:  npm run setup:topdawg\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});