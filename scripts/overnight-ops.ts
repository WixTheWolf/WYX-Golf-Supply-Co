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
      timeout: 120_000,
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

  // These commands intentionally use the runtime process environment directly.
  // Vercel injects production secrets into process.env; .env.local is a local-only convenience.
  const steps: Array<[string, string]> = [
    ['WYX10 self-heal', 'npx tsx scripts/ensure-wyx10-discount.ts'],
    ['WYX10 verification', 'npx tsx scripts/verify-wyx10-discount.ts'],
    ['Shopify Admin catalog check', 'npx tsx scripts/check-admin-products.ts'],
    ['Shopify Storefront check', 'npx tsx scripts/check-storefront-products.ts'],
    ['DSers mapping status', 'npx tsx scripts/dsers-spocket-status.ts'],
    ['Product image audit', 'npx tsx scripts/audit-product-images.ts'],
    ['Pipeline status snapshot', 'npx tsx scripts/pipeline-status.ts'],
    ['Business system snapshot', 'npx tsx scripts/empire-status.ts'],
    ['Daily content queue', 'npx tsx scripts/generate-daily-content.ts'],
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

  const briefing = {
    generatedAt: report.completedAt,
    status: report.health,
    summary: `WYX system check: ${passed}/${results.length} checks passed.`,
    storefront: report.links.storefront,
    failedSteps,
    protectedManualActions: report.protectedManualActions,
  };

  // Local runs keep the convenient files. Vercel's deployed filesystem should be treated as immutable.
  if (!process.env.VERCEL) {
    const dataDir = join(process.cwd(), 'data');
    mkdirSync(dataDir, { recursive: true });
    writeFileSync(join(dataDir, 'overnight-report.json'), JSON.stringify(report, null, 2));
    writeFileSync(join(dataDir, 'morning-briefing.json'), JSON.stringify(briefing, null, 2));
  }

  // The cron route reads this marker from stdout, so production needs no writable report file.
  console.log(`WYX_BRIEFING_JSON=${JSON.stringify(briefing)}`);
  console.log(`\nWYX system check complete: ${passed}/${results.length}`);
  if (failedSteps.length) console.log(`Attention: ${failedSteps.join(', ')}`);

  if (passed < results.length) process.exit(1);
}

main();
