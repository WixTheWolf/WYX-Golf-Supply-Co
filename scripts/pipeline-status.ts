/**
 * Unified WYX ops pipeline status — TopDawg, DSers, outreach.
 *
 * Usage:
 *   npm run pipeline:status
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

function readJson(path: string) {
  return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : {};
}

async function main() {
  const root = process.cwd();
  const topdawg = readJson(join(root, 'data', 'topdawg-connection.json'));
  const dsers = readJson(join(root, 'data', 'dsers-spocket-connection.json'));
  const outreach = existsSync(join(root, 'data', 'supplier-outreach-log.json'))
    ? JSON.parse(readFileSync(join(root, 'data', 'supplier-outreach-log.json'), 'utf8'))
    : [];

  const drafts = outreach.filter((m: { status: string }) => m.status === 'draft-ready').length;
  const skipped = outreach.filter((m: { status: string }) => m.status === 'skipped').length;

  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║           WYX Pipeline Status                        ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');

  console.log('── TopDawg (US warehouse) ──');
  console.log(`  Shopify connected:    ${topdawg.shopifyConnected ? '✅' : '⏳'}`);
  console.log(`  Import list:          ${topdawg.importListMapped ? '✅' : '⏳ 8 SKUs'}`);
  console.log(`  Sample order:         ${topdawg.sampleOrderPlaced ? '✅' : '⏳ ~$53.60'}`);
  console.log(`  Headless published:   ${topdawg.headlessPublishedCount ?? 0}/8`);

  console.log('\n── DSers / Spocket ──');
  console.log(`  DSers installed:      ${dsers.dsersInstalled ? '✅' : '⏳'}`);
  console.log(`  Spocket installed:    ${dsers.spocketInstalled ? '✅' : '⏳'}`);
  console.log(`  DSers linked:         ${dsers.dsersMappedCount ?? 0}/${dsers.dsersTargetCount ?? 21}`);
  console.log(`  Spocket linked:       ${dsers.spocketMappedCount ?? 0}/${dsers.spocketTargetCount ?? 1}`);
  console.log(`  SKUs aligned (AE-*):  ${dsers.dsersSkusAligned ?? 0}`);
  if (dsers.testOrder) {
    console.log(`  Test order:           #${dsers.testOrder.confirmation} (${dsers.testOrder.dsersStatus || 'placed'})`);
  }

  console.log('\n── Supplier outreach ──');
  console.log(`  Drafts ready:         ${drafts}`);
  console.log(`  Skipped (TopDawg):    ${skipped}`);

  console.log('\n── Next actions ──');
  if (!topdawg.importListMapped) console.log('  • TopDawg Import List → npm run topdawg:playbook');
  if ((dsers.dsersMappedCount ?? 0) < (dsers.dsersTargetCount ?? 21)) {
    console.log(`  • DSers Import List → npm run dsers:import-queue (${(dsers.dsersTargetCount ?? 21) - (dsers.dsersMappedCount ?? 0)} remaining)`);
  }
  if (drafts > 0) console.log('  • Send wholesale emails → data/supplier-outreach-drafts/');
  console.log('');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});