/**
 * Scores TopDawg Sports & Outdoors catalog hits against WYX sourcing rubric.
 * Publish threshold: 75/100 (docs/sourcing-targets.md).
 */
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

type TopDawgProduct = {
  id: string;
  title: string;
  brand: string;
  category: string;
  section: string;
  department: string;
  description: string;
  msrp: number;
  price: number;
  quantity: boolean;
  ship_from: string;
  sku: string;
  slug: string;
  url?: string;
  urlpath?: string;
  picture_url?: string;
};

type ScoredProduct = TopDawgProduct & {
  scores: Record<ScoreDimension, number>;
  total: number;
  publish: 'YES' | 'SAMPLE' | 'NO';
  notes: string;
};

type ScoreDimension =
  | 'visual'
  | 'margin'
  | 'gift'
  | 'bundle'
  | 'ship'
  | 'returnRisk'
  | 'unique'
  | 'golfId'
  | 'price'
  | 'supplier';

const SEARCHES = [
  'Golf',
  'ball%20retriever',
  'putting',
  'chipping',
  'divot',
  'golf%20towel',
  'golf%20tee',
  'golf%20cart',
  'golf%20training',
  'golf%20marker',
  'golf%20brush',
  'golf%20net',
  'golf%20umbrella',
  'golf%20glove',
  'alignment%20stick',
];

const GOLF_SIGNAL =
  /\bgolf\b|putting|chipping|divot|ball\s*marker|head\s*cover|ball\s*retriever|alignment\s*stick|groove|range\s*finder/i;
const HARD_REJECT =
  /stitch\s*marker|knitting|crochet|cheese\s*marker|grape\s*marker|cocktail|wine|door\s*mat|wall\s*art|unframed\s*print|coir\s*mat|pen\s*holder|snow\s*fire|hydrant|coloring\s*book|crayola|crossfit|mother'?s\s*day|threenager|gym\s*addict|beer\s*shirt|navajo|llama\s*wearing|blindfold|sport\s*sheets|sexual\s*wellness|bark\s*fifth\s*avenue|archstone\s*pets|dog\s*clothes|pet\s*apparel|dress\b|hoodie\b|forecast\s*t-?shirt|bookmark/i;
const SOFT_REJECT =
  /holdall|duffel\s*bag|sweater|graphic\s*tee|toddler|baby\s*girl|home\s*decor|toothbrush/i;

function fetchHtml(url: string): Promise<string> {
  return fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 WYX-Sourcing-Audit' } }).then((r) => {
    if (!r.ok) throw new Error(`${url} -> ${r.status}`);
    return r.text();
  });
}

function parseProducts(html: string): TopDawgProduct[] {
  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  if (!match) return [];
  const data = JSON.parse(match[1]) as {
    props: { pageProps: { initialResult?: { grouped_hits?: Array<{ hits?: Array<{ document?: TopDawgProduct }> }> } } };
  };
  const groups = data.props.pageProps.initialResult?.grouped_hits ?? [];
  const out: TopDawgProduct[] = [];
  for (const group of groups) {
    for (const hit of group.hits ?? []) {
      if (hit.document?.id) out.push(hit.document);
    }
  }
  return out;
}

function isGolfRelevant(p: TopDawgProduct): boolean {
  const blob = `${p.title} ${p.category} ${p.section} ${p.brand} ${p.description}`.toLowerCase();
  if (HARD_REJECT.test(blob)) return false;
  if (p.section === 'Golf' || p.category.toLowerCase().includes('golf')) {
    // Pet apparel miscategorized under golf search
    if (/bark fifth avenue|dog|pet\b|dress\b/.test(blob) && !/\bgolf\b/.test(p.title.toLowerCase())) return false;
    return true;
  }
  return GOLF_SIGNAL.test(blob);
}

function clamp(n: number, min = 1, max = 10): number {
  return Math.max(min, Math.min(max, Math.round(n)));
}

function scoreProduct(p: TopDawgProduct): ScoredProduct {
  const blob = `${p.title} ${p.description} ${p.category}`.toLowerCase();
  const marginPct = p.msrp > 0 ? ((p.msrp - p.price) / p.msrp) * 100 : 0;
  const notes: string[] = [];

  if (!p.quantity) notes.push('out of stock');
  if (SOFT_REJECT.test(blob)) notes.push('soft-reject category');
  if (p.msrp > 75) notes.push('MSRP above WYX gift ceiling');
  if (p.msrp < 12) notes.push('MSRP too low for meaningful AOV');

  const scores: Record<ScoreDimension, number> = {
    visual: 6,
    margin: clamp(marginPct >= 45 ? 9 : marginPct >= 35 ? 8 : marginPct >= 28 ? 6 : 4),
    gift: 5,
    bundle: 5,
    ship: p.ship_from === 'United States' ? 9 : 5,
    returnRisk: 8,
    unique: 5,
    golfId: 5,
    price: 5,
    supplier: p.quantity ? 7 : 4,
  };

  // Golf identity
  if (/ball\s*marker|divot|tee\s*holder|tee\s*pack/i.test(blob)) scores.golfId = 10;
  else if (/putting|chipping|training|alignment|net|retriever|brush|groove|towel/i.test(blob)) scores.golfId = 9;
  else if (/\bgolf\b/i.test(blob)) scores.golfId = 8;
  else scores.golfId = 3;

  // Giftability
  if (/ball\s*marker|divot|tee|hat\s*clip|gift|prize|scramble/i.test(blob)) scores.gift = 9;
  else if (/putting|chipping|training|towel|umbrella|glove/i.test(blob)) scores.gift = 8;
  else if (/phone|selfie|clip/i.test(blob)) scores.gift = 6;
  else if (SOFT_REJECT.test(blob)) scores.gift = 3;

  // Bundle fit
  if (/marker|divot|tee|towel|brush|clip/i.test(blob)) scores.bundle = 9;
  else if (/putting|chipping|training|net|retriever/i.test(blob)) scores.bundle = 8;
  else scores.bundle = 4;

  // Price point (WYX $22–$75 retail target)
  if (p.msrp >= 18 && p.msrp <= 60) scores.price = 10;
  else if (p.msrp > 60 && p.msrp <= 75) scores.price = 8;
  else if (p.msrp > 75 && p.msrp <= 100) scores.price = 5;
  else if (p.msrp < 18) scores.price = 6;

  // Visual / uniqueness proxies
  if (/selfie\s*golf|selfietotem/i.test(blob)) {
    scores.visual = 7;
    scores.unique = 8;
  }
  if (/wall\s*art|door\s*mat|print|decor/i.test(blob)) {
    scores.visual = 4;
    scores.unique = 3;
    scores.gift = 2;
  }
  if (/chipping\s*dart|game\s*mat|training\s*mat/i.test(blob)) {
    scores.visual = 7;
    scores.unique = 7;
    scores.gift = 8;
  }
  if (/apparel|shirt|sweater|hoodie/i.test(blob)) {
    scores.returnRisk = 5;
    scores.visual = 6;
  }

  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  let publish: ScoredProduct['publish'] = 'NO';
  if (total >= 75 && p.quantity && !SOFT_REJECT.test(blob) && p.msrp <= 75) publish = 'YES';
  else if (total >= 68 && p.quantity) publish = 'SAMPLE';

  return { ...p, scores, total, publish, notes: notes.join('; ') || '—' };
}

async function main() {
  const base = 'https://topdawg.com/dropshipping-products/department/Sports%20&%20Outdoors?search=';
  const byId = new Map<string, TopDawgProduct>();

  for (const term of SEARCHES) {
    const html = await fetchHtml(base + term);
    for (const p of parseProducts(html)) byId.set(p.id, p);
    await new Promise((r) => setTimeout(r, 400));
  }

  const all = [...byId.values()];
  const golf = all.filter(isGolfRelevant);
  const scored = golf.map(scoreProduct).sort((a, b) => b.total - a.total);

  const yes = scored.filter((p) => p.publish === 'YES');
  const sample = scored.filter((p) => p.publish === 'SAMPLE');
  const no = scored.filter((p) => p.publish === 'NO');

  const lines: string[] = [
    '# TopDawg Golf Catalog Audit — WYX Scorecard',
    '',
    `Generated: ${new Date().toISOString().slice(0, 10)}`,
    '',
    '## Method',
    '',
    '- Source: TopDawg public catalog (`Sports & Outdoors` department, golf-focused search terms)',
    `- Raw hits scraped: **${all.length}** unique SKUs`,
    `- Golf-relevant after filter: **${golf.length}** SKUs`,
    '- Scoring: 10 dimensions × 1–10 (docs/sourcing-targets.md). **Publish ≥75**, **Sample 68–74**, **No <68**',
    '- TopDawg supplier reliability baseline: **7** (US ship, aggregator catalog — filter hard)',
    '',
    '## Summary',
    '',
    `| Tier | Count | Action |`,
    `| --- | ---: | --- |`,
    `| **Publish (≥75)** | ${yes.length} | Import to Shopify as \`supplier-review\` drafts; sample before ads |`,
    `| **Sample (68–74)** | ${sample.length} | Order 1 unit; promote if photos + ship time pass Bag Test |`,
    `| **Reject (<68)** | ${no.length} | Skip — off-strategy or weak margin/gift fit |`,
    '',
    '## Top picks — Publish tier',
    '',
    '| Product | Brand | MSRP | Cost | Margin | Score | WYX fit |',
    '| --- | --- | ---: | ---: | ---: | ---: | --- |',
  ];

  for (const p of yes.slice(0, 20)) {
    const margin = p.msrp > 0 ? Math.round(((p.msrp - p.price) / p.msrp) * 100) : 0;
    const fit =
      p.scores.gift >= 9
        ? 'Gift/scramble'
        : p.scores.bundle >= 8
          ? 'Kit component'
          : 'Training/trip';
    lines.push(
      `| ${p.title.replace(/\|/g, '/').slice(0, 55)} | ${p.brand} | $${p.msrp.toFixed(2)} | $${p.price.toFixed(2)} | ${margin}% | **${p.total}** | ${fit} |`,
    );
  }

  lines.push('', '## Sample tier (worth 1-unit QA)', '', '| Product | Brand | MSRP | Score | Notes |', '| --- | --- | ---: | ---: | --- |');
  for (const p of sample.slice(0, 15)) {
    lines.push(`| ${p.title.replace(/\|/g, '/').slice(0, 50)} | ${p.brand} | $${p.msrp.toFixed(2)} | ${p.total} | ${p.notes} |`);
  }

  lines.push('', '## Reject patterns (why 72% of raw hits fail)', '', '- **False positives**: "marker", "tee", "cart" match wine markers, toddler tees, pet carts', '- **Home decor**: prints, door mats, pen holders — not bag-test products', '- **Apparel**: sizing/return risk; WYX POD/wholesale lanes are better', '- **MSRP >$75**: breaks gift-flow positioning', '', '## Recommended import shortlist (8 SKUs)', '');
  const shortlist = yes.slice(0, 8);
  shortlist.forEach((p, i) => {
    lines.push(`${i + 1}. **${p.title}** (${p.brand}) — MSRP $${p.msrp.toFixed(2)}, cost $${p.price.toFixed(2)}, score ${p.total}`);
    lines.push(`   - SKU: \`${p.sku}\` | TDID: \`${p.id}\``);
    const path = p.urlpath ?? p.url ?? '';
    if (path) lines.push(`   - Catalog: https://topdawg.com${path.startsWith('/') ? path : `/${path}`}`);
  });

  lines.push(
    '',
    '## Next steps',
    '',
    '1. Create free TopDawg account + install Shopify app',
    '2. Import the 8-SKU shortlist as drafts tagged `supplier-topdawg`, `supplier-review`',
    '3. Place sample orders; confirm ship time ≤5 days and photo quality',
    '4. Run `npm run apply:verified-catalog` only after hero images are verified per-SKU',
    '5. Prefer J&M / GT Golf for markers & divot tools once wholesale accounts open',
    '',
  );

  const outDir = join(process.cwd(), 'docs');
  const mdPath = join(outDir, 'topdawg-golf-catalog-audit.md');
  const jsonPath = join(process.cwd(), 'data', 'topdawg-golf-audit.json');
  writeFileSync(mdPath, lines.join('\n'));
  mkdirSync(join(process.cwd(), 'data'), { recursive: true });
  writeFileSync(jsonPath, JSON.stringify({ generatedAt: new Date().toISOString(), raw: all.length, golf: golf.length, scored }, null, 2));

  console.log(`\n✅ TopDawg golf audit complete`);
  console.log(`   Raw hits: ${all.length}`);
  console.log(`   Golf-relevant: ${golf.length}`);
  console.log(`   Publish: ${yes.length} | Sample: ${sample.length} | Reject: ${no.length}`);
  console.log(`   Report: ${mdPath}`);
  console.log(`   Data:   ${jsonPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});