/**
 * Unattended nightly ops — catalog, inventory, audits, briefing.
 *
 * Usage:
 *   npm run overnight:ops
 */
import { execSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

type StepResult = { step: string; ok: boolean; output: string };

function run(step: string, command: string): StepResult {
  try {
    const output = execSync(command, {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, FORCE_COLOR: '0' },
    });
    return { step, ok: true, output: output.slice(-2000) };
  } catch (error) {
    const err = error as { stdout?: string; stderr?: string; message?: string };
    return {
      step,
      ok: false,
      output: [err.stdout, err.stderr, err.message].filter(Boolean).join('\n').slice(-2000),
    };
  }
}

async function main() {
  const started = new Date().toISOString();
  console.log('\n🌙 WYX Overnight Ops — unattended build\n');

  const steps: Array<[string, string]> = [
    ['WYX10 discount', 'npm run ensure:wyx10'],
    ['Verified catalog sync', 'npm run apply:verified-catalog'],
    ['DSers SKU alignment', 'npm run finalize:dsers'],
    ['Clear DSers review gates', 'npm run clear:dsers-review'],
    ['Inventory CONTINUE', 'npm run enable:wyx-inventory'],
    ['Product image audit', 'npm run audit:product-images'],
    ['Archive non-golf SKUs', 'npm run archive:non-golf'],
    ['Outreach draft refresh', 'npm run send:supplier-outreach'],
    ['Daily content queue', 'npm run content:daily'],
    ['Survival outreach refresh', 'npm run survival:outreach'],
    ['Sales blitz pack', 'npm run blitz:outreach'],
    ['Pipeline status snapshot', 'npm run pipeline:status'],
    ['Empire status snapshot', 'npm run empire:status'],
  ];

  const results: StepResult[] = [];
  for (const [name, cmd] of steps) {
    console.log(`▶ ${name}...`);
    const result = run(name, cmd);
    results.push(result);
    console.log(result.ok ? '  ✅' : '  ⚠️');
  }

  const passed = results.filter((r) => r.ok).length;
  const report = {
    startedAt: started,
    completedAt: new Date().toISOString(),
    passed,
    total: results.length,
    results,
    links: {
      storefront: 'https://wyxgolfsupply.com',
      open: 'https://wyxgolfsupply.com/open',
      kit: 'https://wyxgolfsupply.com/weekend-golfer-bag-upgrade-kit',
      googleFeed: 'https://wyxgolfsupply.com/feeds/google-products.xml',
      health: 'https://wyxgolfsupply.com/api/health/catalog',
    },
    manualWhenBack: [
      'Add GA4 + Meta pixel in Vercel (npm run empire:activate)',
      'Send 30 personal texts (data/survival-outreach/)',
      'DSers import queue (npm run dsers:import-queue)',
      'Post today\'s content from data/daily-content/latest/',
    ],
  };

  const dataDir = join(process.cwd(), 'data');
  mkdirSync(dataDir, { recursive: true });
  writeFileSync(join(dataDir, 'overnight-report.json'), JSON.stringify(report, null, 2));
  writeFileSync(join(dataDir, 'morning-briefing.json'), JSON.stringify({
    generatedAt: report.completedAt,
    summary: `Overnight ops: ${passed}/${results.length} steps passed.`,
    storefront: report.links.storefront,
    topPriority: report.manualWhenBack,
    failedSteps: results.filter((r) => !r.ok).map((r) => r.step),
  }, null, 2));

  console.log(`\n✅ Overnight ops complete: ${passed}/${results.length}`);
  console.log('   Report: data/overnight-report.json');
  console.log('   Briefing: data/morning-briefing.json\n');

  if (passed < results.length) process.exit(1);
}

main();