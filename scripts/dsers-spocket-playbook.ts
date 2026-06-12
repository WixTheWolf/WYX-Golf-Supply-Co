/**
 * DSers + Spocket install and SKU mapping playbook for verified dropship catalog.
 *
 * Usage:
 *   npm run dsers:playbook
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { verifiedDropshipCatalog } from '../lib/shopify/verifiedDropshipCatalog';

type Connection = {
  dsersInstalled: boolean;
  spocketInstalled: boolean;
  shopifyCollectiveEnabled: boolean;
  dsersAppUrl: string;
  spocketAppUrl: string;
  collectiveUrl: string;
  shopifyAdminUrl: string;
};

function bySupplier(supplier: string) {
  return verifiedDropshipCatalog.products.filter((p) => p.supplier === supplier);
}

async function main() {
  const connPath = join(process.cwd(), 'data', 'dsers-spocket-connection.json');
  const conn: Connection = existsSync(connPath)
    ? JSON.parse(readFileSync(connPath, 'utf8'))
    : {
        dsersInstalled: false,
        spocketInstalled: false,
        shopifyCollectiveEnabled: false,
        dsersAppUrl: 'https://apps.shopify.com/dsers',
        spocketAppUrl: 'https://apps.shopify.com/spocket',
        collectiveUrl: 'https://admin.shopify.com/store/wyxgolfsupply/collective',
        shopifyAdminUrl: 'https://admin.shopify.com/store/wyxgolfsupply/apps',
      };

  const dsers = bySupplier('dsers-aliexpress');
  const spocket = bySupplier('spocket');
  const collective = verifiedDropshipCatalog.products.filter((p) => p.supplier === 'shopify-collective');
  const wholesale = verifiedDropshipCatalog.products.filter((p) => p.supplier.includes('wholesale') || p.supplier === 'jp-lann-wholesale');

  console.log('\n══════════════════════════════════════════════════════════');
  console.log('  WYX × DSers / Spocket / Collective Playbook');
  console.log('══════════════════════════════════════════════════════════\n');

  console.log('## A. Install apps (Shopify admin)\n');
  console.log(`  Apps: ${conn.shopifyAdminUrl}`);
  console.log(`  ${conn.dsersInstalled ? '✅' : '☐'} DSers:      ${conn.dsersAppUrl}`);
  console.log(`  ${conn.spocketInstalled ? '✅' : '☐'} Spocket:    ${conn.spocketAppUrl}`);
  console.log(`  ${conn.shopifyCollectiveEnabled ? '✅' : '☐'} Collective: ${conn.collectiveUrl}`);
  console.log('\n  After install: npm run mark:dsers -- --dsers-installed');
  console.log('                 npm run mark:dsers -- --spocket-installed');

  console.log('\n## B. DSers — map 20 AliExpress SKUs to existing Shopify products\n');
  console.log('  DSers → Import List → paste AliExpress URL → Import to Shopify');
  console.log('  CRITICAL: Link to EXISTING product handle — do NOT create duplicates\n');
  console.log('  | AliExpress URL | WYX handle | Retail | Ship |');
  console.log('  | --- | --- | --- | --- |');
  for (const p of dsers) {
    const url = p.supplierUrl.includes('aliexpress.com/item/')
      ? p.supplierUrl
      : `${p.supplierUrl} (search: ${p.supplierSku})`;
    console.log(`  | ${url} | ${p.handle} | $${p.retailPrice} | ${p.usShipDays}d |`);
  }

  console.log('\n## C. Spocket — map 1 US-warehouse SKU\n');
  for (const p of spocket) {
    console.log(`  ☐ ${p.title}`);
    console.log(`     Spocket search → import → link to ${p.handle} ($${p.retailPrice})`);
    console.log(`     Supplier page: ${p.supplierUrl}`);
  }

  console.log('\n## D. Shopify Collective — 2 premium training aids (draft)\n');
  for (const p of collective) {
    console.log(`  ☐ ${p.title} → ${p.handle}`);
    console.log(`     Supplier: ${p.supplierUrl}`);
  }
  console.log('  Collective → discover suppliers → connect Leadbetter / Indoor Golf Outlet');

  console.log('\n## E. Wholesale lane (outreach pending — not DSers/Spocket)\n');
  for (const p of wholesale) {
    console.log(`  ☐ ${p.title} — ${p.supplier} (${p.supplierSku})`);
  }

  console.log('\n## F. After mapping\n');
  console.log('  1. npm run mark:dsers -- --dsers-mapped <count>');
  console.log('  2. npm run mark:dsers -- --spocket-mapped <count>');
  console.log('  3. npm run dsers:status');
  console.log('  4. npm run enable:wyx-inventory  (active SKUs only)');
  console.log('  5. Remove supplier-review tag on QA-passed SKUs\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});