/**
 * Update TopDawg connection flags after manual dashboard steps.
 *
 * Usage:
 *   npm run mark:topdawg -- --import-list
 *   npm run mark:topdawg -- --sample-order [--tracking TRACK123]
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

function argValue(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function main() {
  const importList = process.argv.includes('--import-list');
  const sampleOrder = process.argv.includes('--sample-order');
  const tracking = argValue('--tracking');

  if (!importList && !sampleOrder) {
    console.log('\nUsage:');
    console.log('  npm run mark:topdawg -- --import-list');
    console.log('  npm run mark:topdawg -- --sample-order [--tracking TRACK123]\n');
    process.exit(1);
  }

  const connPath = join(process.cwd(), 'data', 'topdawg-connection.json');
  const samplePath = join(process.cwd(), 'data', 'topdawg-sample-order.json');
  const conn = JSON.parse(readFileSync(connPath, 'utf8'));
  const sample = JSON.parse(readFileSync(samplePath, 'utf8'));

  if (importList) {
    conn.importListMapped = true;
    conn.importListMappedAt = new Date().toISOString();
    sample.status = 'import-list-mapped';
    console.log('✅ Marked import list mapped (8 SKUs → existing Shopify drafts)');
  }

  if (sampleOrder) {
    conn.sampleOrderPlaced = true;
    conn.sampleOrderPlacedAt = new Date().toISOString();
    sample.status = 'sample-order-placed';
    sample.sampleOrderPlacedAt = conn.sampleOrderPlacedAt;
    if (tracking) sample.trackingNumber = tracking;
    console.log(`✅ Marked sample order placed${tracking ? ` (tracking: ${tracking})` : ''}`);
  }

  writeFileSync(connPath, JSON.stringify(conn, null, 2));
  writeFileSync(samplePath, JSON.stringify(sample, null, 2));
  console.log('\nNext: npm run topdawg:status\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});