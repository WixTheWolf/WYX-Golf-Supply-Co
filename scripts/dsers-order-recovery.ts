/**
 * Step-by-step recovery when a Shopify order does not appear in DSers.
 *
 * Usage:
 *   npm run dsers:recover-order
 *   npm run dsers:recover-order -- --order H0KFGQ9ZD
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { verifiedDropshipCatalog } from '../lib/shopify/verifiedDropshipCatalog';

function argValue(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function main() {
  const orderName = argValue('--order') || 'H0KFGQ9ZD';
  const connPath = join(process.cwd(), 'data', 'dsers-spocket-connection.json');
  const conn = existsSync(connPath) ? JSON.parse(readFileSync(connPath, 'utf8')) : {};
  const test = conn.testOrder;

  const bamboo = verifiedDropshipCatalog.products.find((p) => p.handle === 'bamboo-performance-golf-tees-50-pack');

  console.log('\n══════════════════════════════════════════════════════════');
  console.log('  DSers Order Recovery Playbook');
  console.log('══════════════════════════════════════════════════════════\n');
  console.log(`Order: #${orderName}`);
  if (test) {
    console.log(`Product: ${test.product}`);
    console.log(`Total: $${test.total} | Ship: ${test.shipTo}\n`);
  }

  console.log('## Why it missed DSers\n');
  console.log('  Shopify product existed BEFORE DSers import/link.');
  console.log('  DSers only auto-captures orders for products in its Imported List');
  console.log('  that are explicitly mapped to a Shopify product variant.\n');

  console.log('## Fix A — Map product, then pull order (do this first)\n');
  console.log('  1. Shopify admin → Apps → DSers');
  console.log('  2. Left nav → Import List (or Product Mapping)');
  console.log('  3. Paste AliExpress URL:');
  if (bamboo) console.log(`     ${bamboo.supplierUrl}`);
  console.log('  4. Click Import → when prompted, choose **Map to existing product**');
  console.log('  5. Select: Bamboo Performance Golf Tees - 50 Pack');
  console.log(`     Handle: bamboo-performance-golf-tees-50-pack`);
  if (bamboo) console.log(`     Target SKU: AE-${bamboo.supplierSku}`);
  console.log('  6. Save mapping → DSers → Settings → Order Sync → enable');
  console.log('  7. DSers → Open Orders → find #' + orderName + ' → Place Order\n');

  console.log('## Fix B — Order already in Open Orders but unmapped\n');
  console.log('  1. DSers → Open Orders');
  console.log(`  2. Find order #${orderName}`);
  console.log('  3. Click **Map Product** on the line item');
  console.log('  4. Link to the AliExpress listing you imported above');
  console.log('  5. Click **Place Order** to push to AliExpress\n');

  console.log('## Fix C — Order not in DSers at all\n');
  console.log('  1. DSers → Settings → Store Connection → Re-authorize Shopify');
  console.log('  2. Confirm DSers has read_orders + write_orders scopes');
  console.log('  3. DSers → Orders → Sync / Refresh');
  console.log('  4. If still missing: DSers → Open Orders → **Import Order** → paste #' + orderName + '\n');

  console.log('## After recovery\n');
  console.log('  npm run mark:dsers -- --dsers-mapped 21');
  console.log('  Reply "dsers got it" when Place Order succeeds\n');

  console.log('## All 21 DSers handles (batch re-map if needed)\n');
  const dsers = verifiedDropshipCatalog.products.filter((p) => p.supplier === 'dsers-aliexpress');
  for (const p of dsers) {
    const itemUrl = p.supplierUrl.includes('/item/') ? p.supplierUrl : `(search ${p.supplierSku})`;
    console.log(`  ${p.handle}`);
    console.log(`    URL: ${itemUrl}`);
    console.log(`    SKU: AE-${p.supplierSku}\n`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});