/**
 * Update DSers/Spocket connection flags after manual Shopify admin steps.
 *
 * Usage:
 *   npm run mark:dsers -- --dsers-installed
 *   npm run mark:dsers -- --spocket-installed
 *   npm run mark:dsers -- --collective-enabled
 *   npm run mark:dsers -- --dsers-mapped 12
 *   npm run mark:dsers -- --spocket-mapped 1
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

function argValue(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function main() {
  const connPath = join(process.cwd(), 'data', 'dsers-spocket-connection.json');
  const conn = JSON.parse(readFileSync(connPath, 'utf8'));
  let changed = false;

  if (process.argv.includes('--dsers-installed')) {
    conn.dsersInstalled = true;
    conn.dsersInstalledAt = new Date().toISOString();
    console.log('✅ DSers marked installed');
    changed = true;
  }
  if (process.argv.includes('--spocket-installed')) {
    conn.spocketInstalled = true;
    conn.spocketInstalledAt = new Date().toISOString();
    console.log('✅ Spocket marked installed');
    changed = true;
  }
  if (process.argv.includes('--collective-enabled')) {
    conn.shopifyCollectiveEnabled = true;
    conn.collectiveEnabledAt = new Date().toISOString();
    console.log('✅ Shopify Collective marked enabled');
    changed = true;
  }

  const dsersMapped = argValue('--dsers-mapped');
  if (dsersMapped) {
    conn.dsersMappedCount = Number(dsersMapped);
    conn.dsersMappedAt = new Date().toISOString();
    console.log(`✅ DSers mapped count: ${dsersMapped}`);
    changed = true;
  }

  const spocketMapped = argValue('--spocket-mapped');
  if (spocketMapped) {
    conn.spocketMappedCount = Number(spocketMapped);
    conn.spocketMappedAt = new Date().toISOString();
    console.log(`✅ Spocket mapped count: ${spocketMapped}`);
    changed = true;
  }

  if (!changed) {
    console.log('\nUsage:');
    console.log('  npm run mark:dsers -- --dsers-installed');
    console.log('  npm run mark:dsers -- --spocket-installed');
    console.log('  npm run mark:dsers -- --collective-enabled');
    console.log('  npm run mark:dsers -- --dsers-mapped 12');
    console.log('  npm run mark:dsers -- --spocket-mapped 1\n');
    process.exit(1);
  }

  writeFileSync(connPath, JSON.stringify(conn, null, 2));
  console.log('\nNext: npm run dsers:status\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});