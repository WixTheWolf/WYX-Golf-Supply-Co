#!/usr/bin/env node
/**
 * WYX Catalog Auditor v2 (Admin API)
 * ----------------------------------
 * Sees DRAFT and ARCHIVED products (the hidden SKUs the Storefront API can't
 * return), reports status, and can optionally draft + write back on-brand
 * descriptions/tags/types. Off by default. Dry-run unless you opt in.
 *
 * Usage:
 *   node --env-file=.env.local scripts/catalog-audit-admin.mjs            # audit only
 *   node --env-file=.env.local scripts/catalog-audit-admin.mjs --json > audit.json
 *   node --env-file=.env.local scripts/catalog-audit-admin.mjs --suggest  # draft, no write
 *   node --env-file=.env.local scripts/catalog-audit-admin.mjs --suggest --write  # write back
 *
 * Env (either name works): SHOPIFY_DOMAIN | SHOPIFY_STORE_DOMAIN,
 *   SHOPIFY_ADMIN_TOKEN | SHOPIFY_ADMIN_ACCESS_TOKEN, ANTHROPIC_API_KEY (for --suggest).
 * Admin token scopes: read_products (audit), write_products (--write).
 */

const DOMAIN = process.env.SHOPIFY_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN || process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const API_VERSION = process.env.SHOPIFY_API_VERSION || "2024-10";

const AS_JSON = process.argv.includes("--json");
const SUGGEST = process.argv.includes("--suggest");
const WRITE = process.argv.includes("--write");

const RULES = {
  minDescriptionChars: 80,
  minImages: 1,
  recommendedImages: 3,
  requireProductType: true,
  requireTags: true,
};

if (!DOMAIN || !TOKEN) {
  console.error(
    "Missing env vars. Set SHOPIFY_DOMAIN (or SHOPIFY_STORE_DOMAIN) and " +
    "SHOPIFY_ADMIN_TOKEN (or SHOPIFY_ADMIN_ACCESS_TOKEN).\n" +
    "Admin token must have read_products (and write_products if using --write)."
  );
  process.exit(1);
}
if (SUGGEST && !ANTHROPIC_KEY) {
  console.error("--suggest needs ANTHROPIC_API_KEY set.");
  process.exit(1);
}
if (WRITE && !SUGGEST) {
  console.error("--write requires --suggest (nothing to write without suggestions).");
  process.exit(1);
}

const ADMIN_ENDPOINT = `https://${DOMAIN}/admin/api/${API_VERSION}/graphql.json`;

const PRODUCTS_QUERY = `
  query Products($cursor: String) {
    products(first: 100, after: $cursor) {
      pageInfo { hasNextPage endCursor }
      edges {
        node {
          id
          title
          handle
          status
          descriptionHtml
          productType
          tags
          totalInventory
          featuredImage { url }
          images(first: 10) { edges { node { url } } }
          priceRangeV2 { minVariantPrice { amount currencyCode } }
        }
      }
    }
  }
`;

const UPDATE_MUTATION = `
  mutation UpdateProduct($input: ProductInput!) {
    productUpdate(input: $input) {
      product { id }
      userErrors { field message }
    }
  }
`;

const TAG_VOCABULARY = [
  "novelty", "gift", "fathers-day", "training-aid", "gps", "rangefinder",
  "headcover", "accessories", "under-25", "under-50", "ball-marker",
  "towel", "divot-tool", "tech", "beginner", "stocking-stuffer",
];

const PRODUCT_TYPES = [
  "Novelty Gift", "Training Aid", "GPS/Rangefinder", "Headcover",
  "Accessory", "Apparel", "Ball Marker", "Towel",
];

async function adminGraphQL(query, variables = {}) {
  const res = await fetch(ADMIN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    throw new Error(`Shopify Admin API error ${res.status}: ${await res.text()}`);
  }
  const json = await res.json();
  if (json.errors) throw new Error("GraphQL errors: " + JSON.stringify(json.errors));
  return json.data;
}

async function fetchAllProducts() {
  const all = [];
  let cursor = null;
  let hasNext = true;
  while (hasNext) {
    const data = await adminGraphQL(PRODUCTS_QUERY, { cursor });
    const page = data.products;
    for (const edge of page.edges) all.push(edge.node);
    hasNext = page.pageInfo.hasNextPage;
    cursor = page.pageInfo.endCursor;
  }
  return all;
}

function stripHtml(html) {
  return (html || "").replace(/<[^>]*>/g, "").trim();
}

function auditProduct(p) {
  const issues = [];
  const warnings = [];

  const desc = stripHtml(p.descriptionHtml);
  if (desc.length === 0) issues.push("No description");
  else if (desc.length < RULES.minDescriptionChars) issues.push(`Thin description (${desc.length} chars)`);

  const imageCount = p.images?.edges?.length || 0;
  if (imageCount < RULES.minImages) issues.push("No product image");
  else if (imageCount < RULES.recommendedImages) warnings.push(`Only ${imageCount} image(s), aim for ${RULES.recommendedImages}+`);

  if (RULES.requireProductType && !(p.productType || "").trim()) issues.push("No product type/category");
  if (RULES.requireTags && (!p.tags || p.tags.length === 0)) issues.push("No tags");

  const price = Number(p.priceRangeV2?.minVariantPrice?.amount || 0);
  if (price === 0) warnings.push("Price is 0 or missing");

  return {
    id: p.id,
    title: p.title,
    handle: p.handle,
    status: p.status,
    price,
    imageCount,
    tagCount: p.tags?.length || 0,
    inventory: p.totalInventory,
    descLength: desc.length,
    productType: p.productType,
    issues,
    warnings,
    salesReady: issues.length === 0,
  };
}

async function draftEnrichment(product) {
  const needsDesc = product.issues.includes("No description");
  const needsType = product.issues.includes("No product type/category");
  const needsTags = product.issues.includes("No tags");

  const prompt = `You enrich product data for WYX Golf Supply Co., a golf accessories store
for weekend golfers and gift buyers. Brand voice: confident, fun, direct, no corporate-speak.

Product title: ${product.title}
Current product type: ${product.productType || "none"}
Current tags: ${product.tagCount ? "(some)" : "none"}

Return ONLY valid JSON with these keys (include a key only if requested below):
${needsDesc ? '- "description": 40 to 70 words. No em dashes or en dashes. End with a light buy nudge.\n' : ""}${needsType ? `- "productType": one value chosen from this list: ${JSON.stringify(PRODUCT_TYPES)}\n` : ""}${needsTags ? `- "tags": 2 to 5 values chosen ONLY from this list: ${JSON.stringify(TAG_VOCABULARY)}\n` : ""}
Do not invent values outside the provided lists. Do not include any text outside the JSON.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic API error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  let text = data.content.filter((b) => b.type === "text").map((b) => b.text).join("").trim();
  text = text.replace(/```json|```/g, "").trim();

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(`Could not parse model output for "${product.title}": ${text.slice(0, 120)}`);
  }

  if (parsed.description) parsed.description = parsed.description.replace(/[—–]/g, ", ");
  if (parsed.tags) parsed.tags = parsed.tags.filter((t) => TAG_VOCABULARY.includes(t));
  if (parsed.productType && !PRODUCT_TYPES.includes(parsed.productType)) delete parsed.productType;

  return parsed;
}

async function writeEnrichment(id, enrichment) {
  const input = { id };
  if (enrichment.description) input.descriptionHtml = `<p>${enrichment.description}</p>`;
  if (enrichment.productType) input.productType = enrichment.productType;
  if (enrichment.tags && enrichment.tags.length) input.tags = enrichment.tags;

  const data = await adminGraphQL(UPDATE_MUTATION, { input });
  const errs = data.productUpdate.userErrors;
  if (errs && errs.length) throw new Error("Write failed: " + JSON.stringify(errs));
  return true;
}

function printReport(results) {
  const total = results.length;
  const byStatus = results.reduce((m, r) => ((m[r.status] = (m[r.status] || 0) + 1), m), {});
  const notReady = results.filter((r) => !r.salesReady);

  console.log("\n=== WYX CATALOG AUDIT (Admin, full catalog) ===");
  console.log(`Scanned ${total} products`);
  console.log(`By status: ${Object.entries(byStatus).map(([k, v]) => `${k} ${v}`).join(", ")}`);
  console.log(`Sales-ready: ${total - notReady.length}`);
  console.log(`Need fixes: ${notReady.length}\n`);

  const drafts = results.filter((r) => r.status === "DRAFT");
  if (drafts.length) {
    console.log(`--- DRAFT / HIDDEN (${drafts.length}) ---`);
    console.log("These are invisible to shoppers. Publish or finish them to sell.\n");
  }

  if (notReady.length) {
    console.log("--- NEEDS FIXING ---");
    for (const r of notReady) {
      console.log(`\n  [${r.status}] ${r.title}  (/products/${r.handle})`);
      for (const i of r.issues) console.log(`    [X] ${i}`);
      for (const w of r.warnings) console.log(`    [!] ${w}`);
    }
    console.log("");
  }

  const priority = notReady
    .filter((r) => r.status === "ACTIVE" && (r.inventory ?? 0) !== 0)
    .sort((a, b) => b.issues.length - a.issues.length)
    .slice(0, 10);
  if (priority.length) {
    console.log("--- FIX THESE FIRST (active, in stock, most issues) ---");
    priority.forEach((r, i) => console.log(`  ${i + 1}. ${r.title}  (${r.issues.length} issues)`));
    console.log("");
  }
}

async function main() {
  try {
    const products = await fetchAllProducts();
    const results = products.map(auditProduct);

    if (AS_JSON && !SUGGEST) {
      console.log(JSON.stringify(results, null, 2));
      return;
    }

    printReport(results);

    if (SUGGEST) {
      const needsEnrichment = results.filter((r) =>
        r.issues.includes("No description") ||
        r.issues.includes("No tags") ||
        r.issues.includes("No product type/category")
      );
      console.log(`\n=== ENRICHING ${needsEnrichment.length} products (description / tags / type) ===`);
      console.log(WRITE ? "Mode: WRITE (changes will be saved to Shopify)\n" : "Mode: DRY RUN (preview only, nothing saved)\n");

      for (const r of needsEnrichment) {
        try {
          const e = await draftEnrichment(r);
          console.log(`\n  [${r.status}] ${r.title}  (/products/${r.handle})`);
          if (e.description) console.log(`    desc: ${e.description}`);
          if (e.productType) console.log(`    type: ${e.productType}`);
          if (e.tags && e.tags.length) console.log(`    tags: ${e.tags.join(", ")}`);
          if (WRITE) {
            await writeEnrichment(r.id, e);
            console.log("    -> saved to Shopify");
            await new Promise((res) => setTimeout(res, 600));
          }
        } catch (err) {
          console.log(`    [skip] ${r.title}: ${err.message}`);
        }
      }
      console.log("");
    }
  } catch (err) {
    console.error("Audit failed:", err.message);
    process.exit(1);
  }
}

main();
