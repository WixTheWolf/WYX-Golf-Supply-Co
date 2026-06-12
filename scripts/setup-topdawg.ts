/**
 * TopDawg onboarding checklist — account signup, Shopify app status, sample order prep.
 *
 * Usage:
 *   npm run setup:topdawg
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { getAdminAccessToken } from '../lib/shopify/adminToken';

type ShortlistFile = {
  signUpUrl: string;
  shopifyAppUrl: string;
  supplierUrl: string;
  wholesalePriorityNote: string;
  sampleOrderSkus: string[];
  products: Array<{
    supplierSku: string;
    title: string;
    dropshipCost: number;
    retailPrice: string;
    handle: string;
  }>;
};

async function adminFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const version = process.env.SHOPIFY_API_VERSION || '2026-01';
  const token = await getAdminAccessToken();
  const res = await fetch(`https://${domain}/admin/api/${version}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query, variables }),
  });
  const json = (await res.json()) as { data?: T; errors?: unknown };
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  if (json.errors) throw new Error(JSON.stringify(json.errors).slice(0, 200));
  return json as T;
}

async function checkTopDawgApp(): Promise<{ installed: boolean; apps: string[] }> {
  try {
    const data = await adminFetch<any>(`
      query {
        appInstallations(first: 50) {
          edges {
            node {
              app { title handle apiKey }
            }
          }
        }
      }
    `);
    const apps = (data.data?.appInstallations?.edges ?? []).map(
      (e: { node: { app: { title: string } } }) => e.node.app.title,
    );
    const installed = apps.some((t: string) => /topdawg/i.test(t));
    return { installed, apps };
  } catch {
    return { installed: false, apps: [] };
  }
}

async function checkDrafts(handles: string[]) {
  const found: string[] = [];
  for (const handle of handles) {
    const data = await adminFetch<any>(`
      query($q: String!) { products(first: 1, query: $q) { edges { node { handle status } } } }
    `, { q: `handle:${handle}` });
    const node = data.data?.products?.edges?.[0]?.node;
    if (node) found.push(`${node.handle} (${node.status})`);
  }
  return found;
}

function writeSampleOrderManifest(meta: ShortlistFile) {
  const samples = meta.products.filter((p) => meta.sampleOrderSkus.includes(p.supplierSku));
  const totalCost = samples.reduce((s, p) => s + p.dropshipCost, 0);
  const manifest = {
    createdAt: new Date().toISOString(),
    status: 'pending-topdawg-account',
    shipTo: 'mwixted1@gmail.com / WYX sample address',
    instructions: [
      'Log in to TopDawg dashboard after free account approval',
      'Place manual sample order for the 3 SKUs below (do NOT publish Shopify drafts until QA passes)',
      'Confirm: ship time ≤5 days, photo matches TopDawg CDN image, packaging acceptable',
      'Record tracking + delivery date in this file before activating drafts',
    ],
    wholesaleDeferral: meta.wholesalePriorityNote,
    lineItems: samples.map((p) => ({
      supplierSku: p.supplierSku,
      title: p.title,
      dropshipCost: p.dropshipCost,
      retailPrice: p.retailPrice,
      shopifyDraftHandle: p.handle,
      qaChecklist: [
        'Hero image matches live product',
        'No damage / cheap packaging feel',
        'Shipped from US warehouse',
        'Delivered within 5 business days',
      ],
      qaPassed: false,
    })),
    estimatedSampleCost: Math.round(totalCost * 100) / 100,
    activateDraftsWhenAllQaPassed: true,
  };
  const out = join(process.cwd(), 'data', 'topdawg-sample-order.json');
  writeFileSync(out, JSON.stringify(manifest, null, 2));
  return out;
}

async function main() {
  const path = join(process.cwd(), 'data', 'topdawg-shortlist.json');
  const meta = JSON.parse(readFileSync(path, 'utf8')) as ShortlistFile;

  console.log('\n🏌️  TopDawg setup checklist\n');

  // Step 1: Account + app
  console.log('## Step 1 — Account + Shopify app\n');
  console.log(`  ☐ Create free TopDawg account: ${meta.signUpUrl}`);
  console.log(`  ☐ Install Shopify app:        ${meta.shopifyAppUrl}`);
  console.log(`  ☐ Integration guide:          ${meta.supplierUrl}`);

  const connectionPath = join(process.cwd(), 'data', 'topdawg-connection.json');
  let shopifyConnected = false;
  if (existsSync(connectionPath)) {
    const conn = JSON.parse(readFileSync(connectionPath, 'utf8')) as { shopifyConnected?: boolean };
    shopifyConnected = Boolean(conn.shopifyConnected);
  }
  const { installed, apps } = await checkTopDawgApp();
  if (shopifyConnected || installed) {
    console.log('\n  ✅ Shopify connected to TopDawg');
    if (shopifyConnected) console.log('     Confirmed: data/topdawg-connection.json');
  } else {
    console.log('\n  ⚠️  TopDawg Shopify app NOT detected via API (may lack read_apps scope)');
    if (apps.length) console.log(`     Installed apps (${apps.length}): ${apps.slice(0, 8).join(', ')}${apps.length > 8 ? '…' : ''}`);
    console.log('     → Connect from TopDawg dashboard → Store Integrations → Shopify');
  }

  // Step 2: Draft import status
  console.log('\n## Step 2 — Shopify draft import\n');
  const handles = meta.products.map((p) => p.handle);
  const drafts = await checkDrafts(handles);
  console.log(`  Drafts in Shopify: ${drafts.length}/${handles.length}`);
  drafts.forEach((d) => console.log(`    • ${d}`));
  if (drafts.length < handles.length) {
    console.log('  → Run: npm run seed:topdawg-drafts');
  }

  // Step 3: Sample order
  console.log('\n## Step 3 — Sample order (before ads)\n');
  const manifestPath = writeSampleOrderManifest(meta);
  const samples = meta.products.filter((p) => meta.sampleOrderSkus.includes(p.supplierSku));
  console.log(`  Manifest: ${manifestPath}`);
  console.log(`  Order these 3 SKUs (~$${samples.reduce((s, p) => s + p.dropshipCost, 0).toFixed(2)} dropship cost):`);
  samples.forEach((p) => console.log(`    • ${p.supplierSku} — ${p.title} ($${p.dropshipCost})`));
  console.log('  ☐ Place sample order in TopDawg dashboard');
  console.log('  ☐ Mark qaPassed: true in data/topdawg-sample-order.json after delivery');

  // Step 4: Wholesale deferral
  console.log('\n## Step 4 — Wholesale lane priority\n');
  console.log(`  ${meta.wholesalePriorityNote}`);
  console.log('  Ball marker drafts tagged for migration → J&M Golf / GT Golf Supply');
  console.log('  Club cleaning kit → GT Golf Supply when account live\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});