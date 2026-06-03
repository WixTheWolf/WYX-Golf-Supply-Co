import { getUserErrors, shopifyAdminFetch } from './adminClient';

type PopularProduct = {
  title: string;
  handle: string;
  price: string;
  compareAtPrice?: string;
  productType: string;
  image: string;
  description: string;
  details: string[];
  sku: string;
  quantity: number;
  tags: string[];
};

const siteUrl = 'https://wyx-golf-supply-co.vercel.app';

export const popularProducts: PopularProduct[] = [
  {
    title: 'Magnetic Golf Club Brush Cleaner',
    handle: 'magnetic-golf-club-brush-cleaner',
    price: '18.99',
    compareAtPrice: '24.99',
    productType: 'Accessories',
    image: `${siteUrl}/images/journal-club-care.png`,
    description: 'A bag-ready magnetic club brush for keeping grooves clean between shots and extending the life of wedges and irons.',
    details: ['Magnetic attachment for quick access', 'Nylon and wire brush heads', 'Built for wet grass, sand, and range sessions', 'Easy add-on for any golfer'],
    sku: 'WYX-BRUSH-001',
    quantity: 72,
    tags: ['popular-seller', 'club brush', 'club care', 'golf accessories', 'under-25']
  },
  {
    title: 'Bamboo Performance Golf Tees - 50 Pack',
    handle: 'bamboo-performance-golf-tees-50-pack',
    price: '8.99',
    productType: 'Accessories',
    image: `${siteUrl}/images/hero-coastal-fairway.png`,
    description: 'A simple 50-pack of bamboo golf tees for restocking the bag before the next round.',
    details: ['50 tees per pack', 'Bag, cart, and travel ready', 'Low-friction cart add-on', 'Useful gift add-on for every handicap'],
    sku: 'WYX-TEES-050',
    quantity: 140,
    tags: ['popular-seller', 'golf tees', 'golf essentials', 'under-10']
  },
  {
    title: 'Tri-Fold Microfiber Golf Towel',
    handle: 'tri-fold-microfiber-golf-towel',
    price: '16.99',
    compareAtPrice: '21.99',
    productType: 'Towels',
    image: `${siteUrl}/images/golf-towel-product.png`,
    description: 'A compact tri-fold microfiber towel built for wet grips, clean club faces, and everyday bag carry.',
    details: ['Microfiber cleaning surface', 'Tri-fold profile clips easily to the bag', 'Useful for clubs, balls, and hands', 'One of the safest first-order golf accessories'],
    sku: 'WYX-TOWEL-TRI',
    quantity: 85,
    tags: ['popular-seller', 'golf towel', 'golf accessories', 'under-25']
  },
  {
    title: 'Premium Cabretta Leather Golf Glove',
    handle: 'premium-cabretta-leather-golf-glove',
    price: '24.99',
    compareAtPrice: '29.99',
    productType: 'Gloves',
    image: `${siteUrl}/images/forest-polo-product.png`,
    description: 'A soft cabretta-style golf glove selected for feel, grip, and repeat-purchase potential.',
    details: ['Soft leather feel', 'Flexible closure', 'Great replacement item for active players', 'Strong gift and reorder profile'],
    sku: 'WYX-GLOVE-CAB',
    quantity: 64,
    tags: ['popular-seller', 'golf glove', 'golf essentials', 'under-30']
  },
  {
    title: 'Coastal Green Driver Headcover',
    handle: 'coastal-green-driver-headcover',
    price: '39.99',
    compareAtPrice: '49.99',
    productType: 'Accessories',
    image: `${siteUrl}/images/leather-bag-detail.png`,
    description: 'A clean driver headcover with coastal WYX styling for golfers who want the bag to look intentional without getting loud.',
    details: ['Driver-sized profile', 'Soft interior feel', 'Giftable bag upgrade', 'Designed around forest green, cream, and leather tones'],
    sku: 'WYX-HC-DRIVER',
    quantity: 38,
    tags: ['popular-seller', 'headcover', 'golf accessories', 'golf gifts']
  },
  {
    title: 'Alignment Putting Mirror',
    handle: 'alignment-putting-mirror',
    price: '29.99',
    compareAtPrice: '39.99',
    productType: 'Training Aid',
    image: `${siteUrl}/images/journal-course-strategy.png`,
    description: 'A compact putting mirror for checking eye line, shoulder setup, and face alignment during practice.',
    details: ['Useful indoor and putting-green training aid', 'Helps reinforce setup consistency', 'Compact enough for the golf bag', 'High-intent product for players trying to score better'],
    sku: 'WYX-MIRROR-001',
    quantity: 45,
    tags: ['popular-seller', 'putting mirror', 'training aid', 'golf accessories']
  },
  {
    title: '12-Foot Golf Ball Retriever',
    handle: '12-foot-golf-ball-retriever',
    price: '34.99',
    compareAtPrice: '44.99',
    productType: 'Accessories',
    image: `${siteUrl}/images/walking-golfer-lifestyle..png`,
    description: 'A telescoping golf ball retriever for water carries, creek edges, and the rounds where one saved ball pays you back.',
    details: ['Extends up to 12 feet', 'Compact enough for most golf bags', 'Practical gift for everyday players', 'Strong utility purchase for higher-handicap golfers'],
    sku: 'WYX-RETRIEVER-12',
    quantity: 32,
    tags: ['popular-seller', 'ball retriever', 'golf accessories', 'golf gifts']
  },
  {
    title: 'Groove Sharpener and Cleaner Tool',
    handle: 'groove-sharpener-cleaner-tool',
    price: '14.99',
    compareAtPrice: '19.99',
    productType: 'Club Care',
    image: `${siteUrl}/images/journal-iron-practice.png`,
    description: 'A pocket-sized groove cleaner for players who want cleaner contact and better spin from their scoring clubs.',
    details: ['Compact pocket profile', 'Works as a quick club-care reset', 'Pairs well with towels and brush cleaners', 'Easy low-ticket checkout add-on'],
    sku: 'WYX-GROOVE-001',
    quantity: 90,
    tags: ['popular-seller', 'groove cleaner', 'club care', 'under-20']
  }
];

const FIND_PRODUCT = `#graphql
query FindProduct($query: String!) {
  products(first: 1, query: $query) { nodes { id handle title status } }
}`;

const LOCATIONS = `#graphql
query Locations { locations(first: 1) { nodes { id name } } }
`;

const PUBLICATIONS = `#graphql
query Publications { publications(first: 20) { nodes { id name } } }
`;

const PRODUCT_CREATE = `#graphql
mutation ProductCreate($product: ProductCreateInput!, $media: [CreateMediaInput!]) {
  productCreate(product: $product, media: $media) {
    product { id handle title status }
    userErrors { field message }
  }
}`;

const VARIANT_CREATE = `#graphql
mutation ProductVariantsBulkCreate($productId: ID!, $variants: [ProductVariantsBulkInput!]!, $strategy: ProductVariantsBulkCreateStrategy) {
  productVariantsBulkCreate(productId: $productId, variants: $variants, strategy: $strategy) {
    productVariants { id title price inventoryQuantity }
    userErrors { field message }
  }
}`;

const PUBLISH = `#graphql
mutation PublishProduct($id: ID!, $input: [PublicationInput!]!) {
  publishablePublish(id: $id, input: $input) {
    userErrors { field message }
  }
}`;

function errors(payload: Record<string, any>) {
  return getUserErrors(payload).map((error: any) => error.message).filter(Boolean);
}

function descriptionHtml(product: PopularProduct) {
  return `<p>${product.description}</p><h3>Why it sells</h3><ul>${product.details.map((detail) => `<li>${detail}</li>`).join('')}</ul><p><strong>Launch note:</strong> WYX-stocked popular accessory pick selected for fast checkout and everyday golf utility.</p>`;
}

async function publishProduct(productId: string) {
  const publications = await shopifyAdminFetch<any>(PUBLICATIONS);
  const onlineStore = publications.publications.nodes.find((publication: { name: string }) => /online store/i.test(publication.name));
  if (!onlineStore?.id) return;
  const published = await shopifyAdminFetch<any>(PUBLISH, { id: productId, input: [{ publicationId: onlineStore.id }] });
  const publishErrors = errors(published);
  if (publishErrors.length) throw new Error(publishErrors.join(', '));
}

export async function importPopularProducts() {
  const locations = await shopifyAdminFetch<any>(LOCATIONS);
  const locationId = locations.locations.nodes[0]?.id;
  if (!locationId) throw new Error('No Shopify location found for inventory quantities.');

  const results: Array<{ handle: string; title: string; status: 'created' | 'exists'; shopifyStatus: string; quantity?: number }> = [];
  for (const product of popularProducts) {
    const existing = await shopifyAdminFetch<any>(FIND_PRODUCT, { query: `handle:${product.handle}` });
    const found = existing.products.nodes[0];
    if (found) {
      results.push({ handle: product.handle, title: product.title, status: 'exists', shopifyStatus: found.status });
      continue;
    }

    const created = await shopifyAdminFetch<any>(PRODUCT_CREATE, {
      product: {
        title: product.title,
        handle: product.handle,
        descriptionHtml: descriptionHtml(product),
        vendor: 'WYX Golf Supply Co.',
        productType: product.productType,
        tags: [...product.tags, 'wyx-stocked', 'first-sale-candidate'],
        status: 'ACTIVE',
        seo: {
          title: `${product.title} | WYX Golf Supply Co.`,
          description: product.description
        }
      },
      media: [{ originalSource: product.image, alt: product.title, mediaContentType: 'IMAGE' }]
    });
    const createErrors = errors(created);
    if (createErrors.length) throw new Error(`${product.title}: ${createErrors.join(', ')}`);

    const productId = created.productCreate.product.id;
    const variants = await shopifyAdminFetch<any>(VARIANT_CREATE, {
      productId,
      strategy: 'REMOVE_STANDALONE_VARIANT',
      variants: [{
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        inventoryPolicy: 'DENY',
        inventoryItem: { sku: product.sku, tracked: true, requiresShipping: true },
        inventoryQuantities: [{ locationId, availableQuantity: product.quantity }],
        optionValues: [{ optionName: 'Title', name: 'Default Title' }]
      }]
    });
    const variantErrors = errors(variants);
    if (variantErrors.length) throw new Error(`${product.title}: ${variantErrors.join(', ')}`);

    await publishProduct(productId);
    results.push({ handle: product.handle, title: product.title, status: 'created', shopifyStatus: 'ACTIVE', quantity: product.quantity });
  }
  return results;
}
