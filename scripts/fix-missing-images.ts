/**
 * fix-missing-images.ts
 *
 * Adds correct, product-matched images to WYX products that are missing them.
 * Uses productCreateMedia with curated Unsplash URLs for each product handle.
 *
 * Usage:
 *   npx tsx --env-file .env.local scripts/fix-missing-images.ts
 */
import { getAdminAccessToken } from '../lib/shopify/adminToken';

async function adminFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const version = process.env.SHOPIFY_API_VERSION || '2026-01';
  const token = await getAdminAccessToken();
  const res = await fetch(`https://${domain}/admin/api/${version}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json() as any;
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  if (json.errors?.some((e: any) => !e.path)) throw new Error(JSON.stringify(json.errors));
  return json as T;
}

// Carefully matched images for each product — correct product type, not generic golf scenery
const IMAGE_MAP: Record<string, { url: string; alt: string }> = {
  'putting-alignment-mirror-folding-tour': {
    url: 'https://images.unsplash.com/photo-1611676028867-89893e54c25c?w=1200&h=900&fit=crop&q=80',
    alt: 'Golfer practicing putting alignment on practice green',
  },
  'golf-alignment-sticks-2-pack-fiberglass': {
    url: 'https://images.unsplash.com/photo-1510521196603-23acd98bfde7?w=1200&h=900&fit=crop&q=80',
    alt: 'Golf alignment sticks on driving range mat',
  },
  'golf-putting-mat-9-foot-alignment': {
    url: 'https://images.unsplash.com/photo-1574359411659-15573a27fd0c?w=1200&h=900&fit=crop&q=80',
    alt: 'Golf putting mat with alignment channels on floor',
  },
  'backyard-chipping-net-4-target-folding': {
    url: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&h=900&fit=crop&q=80',
    alt: 'Golf chipping net set up on lawn for practice',
  },
  'golf-umbrella-62-wind-vent': {
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&h=900&fit=crop&q=80',
    alt: 'Large golf umbrella open on rainy golf course',
  },
  'golf-quarter-zip-pullover-thermal': {
    url: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=1200&h=900&fit=crop&q=80',
    alt: 'Quarter zip pullover worn outdoors in cool conditions',
  },
  'magnetic-golf-divot-tool-combo-marker': {
    url: 'https://images.unsplash.com/photo-1622517658789-cfc0ab4ad893?w=1200&h=900&fit=crop&q=80',
    alt: 'Golf divot tool and ball marker on putting green',
  },
  'golf-hat-clip-ball-marker-set-3-markers': {
    url: 'https://images.unsplash.com/photo-1548436789-b8a26f4e9036?w=1200&h=900&fit=crop&q=80',
    alt: 'Golf ball markers clipped to hat brim',
  },
  'golf-rain-glove-pair-wet-weather-grip': {
    url: 'https://images.unsplash.com/photo-1598965402089-897ce52e8355?w=1200&h=900&fit=crop&q=80',
    alt: 'Golf gloves gripping club in wet weather conditions',
  },
  'leather-golf-scorecard-holder-full-grain': {
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&h=900&fit=crop&q=80',
    alt: 'Leather scorecard holder on golf cart',
  },
  'night-golf-glow-ball-set-12-led-core': {
    url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&h=900&fit=crop&q=80',
    alt: 'Golf balls glowing at night on a course',
  },
  'cabretta-golf-glove-3-pack-mens': {
    url: 'https://images.unsplash.com/photo-1592919505780-303950717480?w=1200&h=900&fit=crop&q=80',
    alt: 'Cabretta leather golf gloves in white',
  },
  'portable-putting-cup-regulation': {
    url: 'https://images.unsplash.com/photo-1574359411659-15573a27fd0c?w=1200&h=900&fit=crop&q=80',
    alt: 'Golf putting cup on practice mat indoors',
  },
  'golf-putting-gate-set-2-precision-gates': {
    url: 'https://images.unsplash.com/photo-1574352245494-d9d4a645e73c?w=1200&h=900&fit=crop&q=80',
    alt: 'Putting accuracy gates on practice putting green',
  },
  'golf-practice-ball-set-12-foam-airflow': {
    url: 'https://images.unsplash.com/photo-1579723985163-26b6de5e1ab8?w=1200&h=900&fit=crop&q=80',
    alt: 'Foam golf practice balls on backyard mat',
  },
};

async function getProductsNeedingImages() {
  const data = await adminFetch<any>(`
    query {
      products(first: 100, query: "vendor:'WYX Golf Supply Co.'") {
        edges {
          node {
            id handle title
            featuredImage { url }
          }
        }
      }
    }
  `);
  return (data.data.products.edges as any[])
    .map((e: any) => e.node)
    .filter((p: any) => !p.featuredImage?.url && IMAGE_MAP[p.handle]);
}

async function addImage(productId: string, handle: string) {
  const fix = IMAGE_MAP[handle];
  const data = await adminFetch<any>(`
    mutation($productId: ID!, $media: [CreateMediaInput!]!) {
      productCreateMedia(productId: $productId, media: $media) {
        media { ... on MediaImage { id image { url } } }
        userErrors { field message }
      }
    }
  `, {
    productId,
    media: [{ mediaContentType: 'IMAGE', originalSource: fix.url, alt: fix.alt }],
  });

  const errors = data.data?.productCreateMedia?.userErrors ?? [];
  if (errors.length) {
    console.error(`  ✗ ${handle}: ${errors.map((e: any) => e.message).join(', ')}`);
    return false;
  }
  console.log(`  ✓ ${handle}`);
  return true;
}

async function main() {
  console.log('🖼  WYX Golf — Missing Image Fix\n');

  const products = await getProductsNeedingImages();
  console.log(`Products needing images: ${products.length}\n`);

  if (products.length === 0) {
    console.log('✅ All products already have images!');
    return;
  }

  let fixed = 0;
  for (const p of products) {
    console.log(`→ ${p.handle}`);
    const ok = await addImage(p.id, p.handle);
    if (ok) fixed++;
    await new Promise(r => setTimeout(r, 500)); // rate limit
  }

  console.log(`\n✅ Fixed ${fixed}/${products.length} products`);
  console.log('Images may take 1-2 minutes to process on Shopify CDN.');
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
