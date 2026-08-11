/**
 * WYX unattended operations.
 *
 * Principle: repair only things we can prove are safe to repair automatically.
 * Supplier mapping, publishing, inventory policy and destructive catalog changes
 * stay gated for human or verified-rule approval.
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
  console.log('\nWYX SYSTEM CHECK / unattended ops\n');

  const steps: Array<[string, string]> = [
    // Safe self-heal: WYX10 is a known first-order promotion with a fixed rule.
    ['WYX10 self-heal', 'npm run ensure:wyx10'],
    ['WYX10 verification', 'npm run verify:wyx10'],

    // Read-only / audit-oriented checks. These can fail loudly without changing supplier state.
    ['Shopify Admin catalog check', 'npm run shopify:check-admin'],
    ['Shopify Storefront check', 'npm run shopify:check-storefront'],
    ['DSers mapping status', 'npm run dsers:status'],
    ['Product image audit', 'npm run audit:product-images'],
    ['Pipeline status snapshot', 'npm run pipeline:status'],
    ['Business system snapshot', 'npm run empire:status'],

    // Generates drafts/data only; does not publish marketing without review.
    ['Daily content queue', 'npm run content:daily'],
  ];

  const results: StepResult[] = [];
  for (const [name, cmd] of steps) {
    console.log(`> ${name}`);
    const result = run(name, cmd);
    results.push(result);
    console.log(result.ok ? '  OK' : '  ATTENTION');
  }

  const passed = results.filter((result) => result.ok).length;
  const failedSteps = results.filter((result) => !result.ok).map((result) => result.step);
  const report = {
    startedAt: started,
    completedAt: new Date().toISOString(),
    passed,
    total: results.length,
    health: failedSteps.length ? 'attention' : 'green',
    results,
    links: {
      storefront: 'https://wyxgolfsupply.com',
      drop: 'https://wyxgolfsupply.com/products',
      kit: 'https://wyxgolfsupply.com/weekend-golfer-bag-upgrade-kit',
      health: 'https://wyxgolfsupply.com/api/health/catalog',
    },
    protectedManualActions: [
      'Approve or map new DSers products before they enter the public assortment.',
      'Review any supplier-review tag before removal.',
      'Approve destructive catalog/archive changes.',
      'Connect GA4 and lifecycle email tooling when account credentials are available.',
    ],
  };

  const dataDir = join(process.cwd(), 'data');
  mkdirSync(dataDir, { recursive: true });
  writeFileSync(join(dataDir, 'overnight-report.json'), JSON.stringify(report, null, 2));
  writeFileSync(join(dataDir, 'morning-briefing.json'), JSON.stringify({
    generatedAt: report.completedAt,
    status: report.health,
    summary: `WYX system check: ${passed}/${results.length} checks passed.`,
    storefront: report.links.storefront,
    failedSteps,
    protectedManualActions: report.protectedManualActions,
  }, null, 2));

  console.log(`\nWYX system check complete: ${passed}/${results.length}`);
  if (failedSteps.length) console.log(`Attention: ${failedSteps.join(', ')}`);

  if (passed < results.length) process.exit(1);
}

main();
