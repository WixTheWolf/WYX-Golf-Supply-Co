/**
 * Lists DSers SKUs not yet mapped to Shopify, prioritized by revenue risk.
 *
 * Usage:
 *   npm run dsers:import-queue
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { verifiedDropshipCatalog } from '../lib/shopify/verifiedDropshipCatalog';

const FLAGSHIP_HANDLES = new Set([
  'bamboo-performance-golf-tees-50-pack',
  'tri-fold-microfiber-golf-towel',
  'groove-sharpener-cleaner-tool',
  'magnetic-golf-club-brush-cleaner',
  'premium-cabretta-leather-golf-glove',
  'golf-hat-clip-ball-marker-set-3-markers',
  'stroke-counter-wristband',
  'alignment-putting-mirror'
]);

async function main() {
  const connPath = join(process.cwd(), 'data', 'dsers-spocket-connection.json');
  const conn = existsSync(connPath) ? JSON.parse(readFileSync(connPath, 'utf8')) : {};
  const linked = new Set<string>(conn.dsersLinkedProducts ?? []);

  const dsers = verifiedDropshipCatalog.products.filter((product) => product.supplier === 'dsers-aliexpress');
  const remaining = dsers
    .filter((product) => !linked.has(product.handle))
    .sort((a, b) => {
      const score = (product: typeof a) => {
        let value = 0;
        if (FLAGSHIP_HANDLES.has(product.handle)) value += 100;
        if (product.status === 'active') value += 50;
        if (product.tags?.includes('supplier-review')) value += 10;
        return value;
      };
      return score(b) - score(a);
    });

  console.log(`\n📋 DSers Mapping Queue — ${remaining.length} remaining (${linked.size}/${dsers.length} recorded mapped)\n`);
  console.log('Do not clear supplier-review or advertise a DSers SKU until mapping is saved in DSers.\n');
  console.log('For each: DSers → Import List / Product Mapping → paste URL → Map to existing Shopify product\n');

  let index = 0;
  for (const product of remaining) {
    index += 1;
    const priority = FLAGSHIP_HANDLES.has(product.handle) ? 'P0' : product.status === 'active' ? 'P1' : 'P2';
    console.log(`${index}. [${priority}] ${product.title}`);
    console.log(`   Handle: ${product.handle}`);
    console.log(`   URL:    ${product.supplierUrl}`);
    console.log(`   SKU:    AE-${product.supplierSku}`);
    console.log(`   Price:  $${product.retailPrice}`);
    console.log(`   Status: ${product.status}\n`);
  }

  if (!remaining.length) {
    console.log('✅ All DSers SKUs are recorded as mapped. Re-run the storefront audit before clearing any remaining review gates.\n');
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
