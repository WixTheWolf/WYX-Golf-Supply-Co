/**
 * Re-attaches product images for hidden-gem SKUs when Shopify CDN processing failed.
 * Uses AliExpress CDN sources (Shopify rejects many Unsplash imports).
 */
import { hiddenGemProducts } from '../lib/shopify/hiddenGemProducts';
import { getAdminAccessToken } from '../lib/shopify/adminToken';

const SUPPLIER_IMAGES: Record<string, { url: string; alt: string }> = {
  'magnetic-cart-phone-mount': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/Sed29526b2dc34509a3bcce32fef7227f1.jpg_480x480q75.jpg',
    alt: 'Magnetic golf cart phone mount on frame'
  },
  'divot-board-swing-trainer': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/Se7c3933deb3743e18e51f39ba7362b32r.jpg_480x480q75.jpg',
    alt: 'Golf divot board swing path trainer'
  },
  'pop-up-chipping-net-3-target': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S9fea710b272b46b4a376f7d4ce46fef9F.jpg_480x480q75.jpg',
    alt: 'Pop-up backyard golf chipping net'
  },
  'stance-alignment-towel': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S42ca4b5289fd4420bbd09a061bdc344d6.jpg_480x480q75.jpg',
    alt: 'Golf alignment towel clipped to bag'
  },
  'silicone-cart-beverage-holder-2pack': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S98eca60f4bbf42f79f95b127aa0aba5fw.jpg_480x480q75.jpg',
    alt: 'Silicone golf cart cup holder 2-pack'
  },
  'extendable-ball-retriever-15ft': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/Sed29526b2dc34509a3bcce32fef7227f1.jpg_480x480q75.jpg',
    alt: 'Extendable 15-foot golf ball retriever'
  },
  'portable-putting-arc-trainer': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S27437703cbdb40b7835f06b957d7578eI.jpg_480x480q75.jpg',
    alt: 'Portable putting arc stroke trainer'
  },
  'windproof-cart-umbrella-holder': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S9eee16d072924fa18bf5906fcde63f178.jpg',
    alt: 'Golf cart umbrella holder clamp'
  }
};

async function adminFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN!;
  const version = process.env.SHOPIFY_API_VERSION || '2026-01';
  const res = await fetch(`https://${domain}/admin/api/${version}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': await getAdminAccessToken()
    },
    body: JSON.stringify({ query, variables })
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

const FIND = `query($q:String!){ products(first:1, query:$q){ edges{ node{ id handle featuredImage{ url } media(first:20){edges{node{... on MediaImage{ id status image{url} }}}} } } } }`;
const DELETE_MEDIA = `mutation($id:ID!,$mediaIds:[ID!]!){ productDeleteMedia(productId:$id, mediaIds:$mediaIds){ deletedMediaIds mediaUserErrors{ message } } }`;
const MEDIA = `mutation($id:ID!,$media:[CreateMediaInput!]!){ productCreateMedia(productId:$id, media:$media){ media{... on MediaImage{ id status image{url} }} mediaUserErrors{ message } } }`;

function needsFix(node: { featuredImage?: { url?: string }; media?: { edges: Array<{ node: { status?: string; image?: { url?: string } } }> } }) {
  const featured = node.featuredImage?.url;
  if (featured && !featured.includes('unsplash.com')) return false;
  const media = node.media?.edges || [];
  const hasReady = media.some((edge) => edge.node.status === 'READY' && edge.node.image?.url);
  return !hasReady;
}

async function waitForReady(productId: string, handle: string, attempts = 12) {
  for (let i = 0; i < attempts; i++) {
    const data = await adminFetch<any>(FIND, { q: `handle:${handle}` });
    const node = data.products.edges[0]?.node;
    const ready = node?.media?.edges?.find((edge: any) => edge.node.status === 'READY' && edge.node.image?.url);
    if (ready) return ready.node.image.url as string;
    const failedOnly = node?.media?.edges?.every((edge: any) => edge.node.status === 'FAILED');
    if (failedOnly && i > 2) return null;
    await new Promise((r) => setTimeout(r, 1500));
  }
  return null;
}

async function main() {
  for (const product of hiddenGemProducts) {
    const image = SUPPLIER_IMAGES[product.handle] || { url: product.imageUrl, alt: product.imageAlt };
    const data = await adminFetch<any>(FIND, { q: `handle:${product.handle}` });
    const node = data.products.edges[0]?.node;
    if (!node) {
      console.log(`⏭️  ${product.handle} — not found`);
      continue;
    }
    if (!needsFix(node)) {
      console.log(`✓ ${product.handle} — sale-ready image present`);
      continue;
    }

    const mediaIds = (node.media?.edges || []).map((edge: any) => edge.node.id).filter(Boolean);
    if (mediaIds.length) {
      await adminFetch<any>(DELETE_MEDIA, { id: node.id, mediaIds });
      console.log(`🧹 ${product.handle} — cleared ${mediaIds.length} failed media`);
      await new Promise((r) => setTimeout(r, 500));
    }

    const result = await adminFetch<any>(MEDIA, {
      id: node.id,
      media: [{ originalSource: image.url, mediaContentType: 'IMAGE', alt: image.alt }]
    });
    const errs = result.productCreateMedia?.mediaUserErrors || [];
    if (errs.length) {
      console.log(`❌ ${product.handle}: ${errs[0].message}`);
      continue;
    }

    const readyUrl = await waitForReady(node.id, product.handle);
    console.log(readyUrl ? `✅ ${product.handle} — ${readyUrl.slice(0, 72)}...` : `⚠️  ${product.handle} — attached, still processing`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });