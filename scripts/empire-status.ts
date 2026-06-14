/**
 * Empire command center — growth phases, metrics, next actions.
 *
 * Usage:
 *   npm run empire:status
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

async function main() {
  const root = process.cwd();
  const roadmap = JSON.parse(readFileSync(join(root, 'data', 'empire-roadmap.json'), 'utf8'));
  const dsers = existsSync(join(root, 'data', 'dsers-spocket-connection.json'))
    ? JSON.parse(readFileSync(join(root, 'data', 'dsers-spocket-connection.json'), 'utf8'))
    : {};
  const topdawg = existsSync(join(root, 'data', 'topdawg-connection.json'))
    ? JSON.parse(readFileSync(join(root, 'data', 'topdawg-connection.json'), 'utf8'))
    : {};

  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║  WYX EMPIRE COMMAND CENTER                               ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');
  console.log(`Vision: ${roadmap.vision}\n`);

  const phase = roadmap.phases[0];
  console.log(`▶ ${phase.name}`);
  console.log(`  Goal: ${phase.goal}\n`);
  for (const m of phase.milestones) {
    const icon = m.done ? '✅' : '⬜';
    const extra = m.command ? ` → ${m.command}` : m.url ? ` → ${m.url}` : '';
    console.log(`  ${icon} ${m.task}${extra}`);
  }

  console.log('\n── Live systems ──');
  console.log(`  Storefront:     https://wyxgolfsupply.com`);
  console.log(`  Grand opening:  https://wyxgolfsupply.com/open`);
  console.log(`  Hero kit:       https://wyxgolfsupply.com/weekend-golfer-bag-upgrade-kit`);
  console.log(`  Creators:       https://wyxgolfsupply.com/creators`);
  console.log(`  DSers linked:   ${dsers.dsersMappedCount ?? 0}/${dsers.dsersTargetCount ?? 21}`);
  console.log(`  TopDawg live:   ${topdawg.headlessPublishedCount ?? 0}/8`);

  console.log('\n── North star (Phase 4) ──');
  const ns = roadmap.northStarMetrics;
  console.log(`  Weekly orders: ${ns.weeklyOrders} | Email list: ${ns.emailList} | AOV: $${ns.aov} | SKUs: ${ns.catalogSkus}`);

  console.log('\n── Commands ──');
  console.log('  npm run empire:activate   # growth activation checklist');
  console.log('  npm run survival:outreach # first 10 sales templates');
  console.log('  npm run pipeline:status   # supplier ops\n');
}

main();