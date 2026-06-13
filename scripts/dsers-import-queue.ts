/**
 * Lists DSers SKUs not yet in My Products — for Import List batch work.
 *
 * Usage:
 *   npm run dsers:import-queue
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { verifiedDropshipCatalog } from '../lib/shopify/verifiedDropshipCatalog';

async function main() {
  const connPath = join(process.cwd(), 'data', 'dsers-spocket-connection.json');
  const conn = existsSync(connPath) ? JSON.parse(readFileSync(connPath, 'utf8')) : {};
  const linked = new Set<string>(conn.dsersLinkedProducts ?? []);

  const dsers = verifiedDropshipCatalog.products.filter((p) => p.supplier === 'dsers-aliexpress');
  const remaining = dsers.filter((p) => !linked.has(p.handle));

  console.log(`\n📋 DSers Import Queue — ${remaining.length} remaining (${linked.size}/${dsers.length} linked)\n`);
  console.log('For each: DSers → Import List → paste URL → Map to existing product\n');

  let i = 0;
  for (const p of remaining) {
    i++;
    const url = p.supplierUrl.includes('/item/')
      ? p.supplierUrl
      : `${p.supplierUrl}`;
    console.log(`${i}. ${p.title}`);
    console.log(`   Handle: ${p.handle}`);
    console.log(`   URL:    ${url}`);
    console.log(`   SKU:    AE-${p.supplierSku}`);
    console.log(`   Price:  $${p.retailPrice}\n`);
  }

  if (!remaining.length) {
    console.log('✅ All DSers SKUs linked. Run: npm run mark:dsers -- --dsers-mapped 21\n');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});