import { getUserErrors, shopifyAdminFetch } from './adminClient';

type FreshProduct = {
  title: string;
  handle: string;
  vendor: string;
  productType: string;
  price: string;
  compareAtPrice?: string;
  image: string;
  description: string;
  details: string[];
  sku: string;
  quantity: number;
  sourceUrl: string;
  tags: string[];
};

export const freshProducts: FreshProduct[] = [
  {
    title: 'Carolina Blue Two-Sided Golf Ball Marker - 2 Pack',
    handle: 'carolina-blue-two-sided-golf-ball-marker-2-pack',
    vendor: 'Blue Ridge Golf Co.',
    productType: 'Golf Ball Marker',
    price: '14.99',
    compareAtPrice: '19.99',
    image: 'https://cdn.shopify.com/s/files/1/0802/5037/2374/files/two-sided-metal-golf-ball-marker-carolina-blue-pure-white-golf-ball-marker-6808582.jpg?v=1771876391',
    description: 'A bright Carolina blue and pure white two-sided marker that is easy to spot on the green and easy to gift.',
    details: ['Two-sided metal marker', 'Easy-to-spot enamel color', 'Good fit for weekend rounds and golf trips'],
    sku: 'WYX-BRG-MARKER-CB-2',
    quantity: 25,
    sourceUrl: 'https://blueridgegolfco.com/products/two-sided-metal-golf-ball-marker-carolina-blue-pure-white',
    tags: ['golf gifts', 'ball marker', 'bag essentials', 'under-25', 'fresh-pick']
  },
  {
    title: 'Blue Ridge Golf Ball Markers - Set Of 2',
    handle: 'blue-ridge-golf-ball-markers-set-of-2',
    vendor: 'Blue Ridge Golf Co.',
    productType: 'Golf Ball Marker',
    price: '9.99',
    compareAtPrice: '14.99',
    image: 'https://cdn.shopify.com/s/files/1/0802/5037/2374/products/blue-ridge-golf-co-ball-markers-969949.jpg?v=1698880740',
    description: 'A simple two-marker set for golfers who want a cleaner pocket and an easy green-side upgrade.',
    details: ['Compact metal marker set', 'Easy gift add-on', 'Useful for league nights and weekend rounds'],
    sku: 'WYX-BRG-MARKER-SET2',
    quantity: 25,
    sourceUrl: 'https://blueridgegolfco.com/products/blue-ridge-golf-co-ball-marker-set',
    tags: ['golf gifts', 'ball marker', 'under-15', 'bag essentials', 'fresh-pick']
  },
  {
    title: 'Topographic Carolina Blue Driver Headcover',
    handle: 'topographic-carolina-blue-driver-headcover',
    vendor: 'Blue Ridge Golf Co.',
    productType: 'Golf Club Headcover',
    price: '59.99',
    compareAtPrice: '69.99',
    image: 'https://cdn.shopify.com/s/files/1/0802/5037/2374/files/topographic-edition-carolina-blue-embroidered-pure-white-golf-club-headcover-5867572.jpg?v=1756404907',
    description: 'A Carolina blue topographic driver headcover for golfers who want the bag to look a little more dialed.',
    details: ['Driver-sized headcover', 'Soft interior feel', 'Gift-ready bag upgrade under $75'],
    sku: 'WYX-BRG-HC-CB-DR',
    quantity: 12,
    sourceUrl: 'https://blueridgegolfco.com/products/topographic-design-edition-carolina-blue-embroidered-pure-white',
    tags: ['headcover', 'golf gifts', 'bag upgrade', 'under-75', 'fresh-pick']
  },
  {
    title: 'Glove & Accessory Caddie - Black',
    handle: 'glove-accessory-caddie-black',
    vendor: 'Pins and Aces',
    productType: 'Glove Caddies',
    price: '24.95',
    image: 'https://cdn.shopify.com/s/files/1/2435/1447/files/GloveCaddy_BlackandGray.jpg?v=1765416916',
    description: 'A black glove and accessory caddie for keeping gloves, tees, and small pieces from floating loose in the bag.',
    details: ['Holds gloves and small accessories', 'Clean black colorway', 'Easy bag organization gift'],
    sku: 'WYX-PA-GLOVE-CADDIE-BLK',
    quantity: 20,
    sourceUrl: 'https://pinsandaces.com/products/glove-accessory-caddie-black',
    tags: ['bag organization', 'golf gifts', 'accessory caddie', 'under-25', 'fresh-pick']
  },
  {
    title: 'Magnet Caddie',
    handle: 'magnet-caddie',
    vendor: 'Pins and Aces',
    productType: 'Accessories - Storage',
    price: '25.00',
    image: 'https://cdn.shopify.com/s/files/1/2435/1447/files/MagneticBag-Clip-Main.jpg?v=1765417273',
    description: 'A magnetic bag caddie for keeping towels and small golf accessories easier to grab during the round.',
    details: ['Magnetic attachment for golf bags', 'Helps organize towels and small accessories', 'Useful for carts, range sessions, and weekend rounds'],
    sku: 'WYX-PA-MAGNET-CADDIE',
    quantity: 20,
    sourceUrl: 'https://pinsandaces.com/products/magnet-caddie',
    tags: ['bag organization', 'golf accessories', 'golf gifts', 'under-30', 'fresh-pick']
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
query Publications { publications(first: 30) { nodes { id name } } }
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

function descriptionHtml(product: FreshProduct) {
  return `<p>${product.description}</p><h3>Why golfers use it</h3><ul>${product.details.map((detail) => `<li>${detail}</li>`).join('')}</ul><p>Useful golf gear for weekend rounds, range sessions, golf trips, and better bag habits.</p>`;
}

async function publishProduct(productId: string) {
  const publications = await shopifyAdminFetch<any>(PUBLICATIONS);
  const input = publications.publications.nodes
    .filter((publication: { name: string }) => /online store|shop|chatgpt|microsoft copilot/i.test(publication.name))
    .map((publication: { id: string }) => ({ publicationId: publication.id }));
  if (!input.length) return;
  const published = await shopifyAdminFetch<any>(PUBLISH, { id: productId, input });
  const publishErrors = errors(published);
  if (publishErrors.length) throw new Error(publishErrors.join(', '));
}

export async function importFreshProducts() {
  const locations = await shopifyAdminFetch<any>(LOCATIONS);
  const locationId = locations.locations.nodes[0]?.id;
  if (!locationId) throw new Error('No Shopify location found for inventory quantities.');

  const results: Array<{ handle: string; title: string; status: 'created' | 'exists'; shopifyStatus: string; quantity?: number }> = [];
  for (const product of freshProducts) {
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
        vendor: product.vendor,
        productType: product.productType,
        tags: [...product.tags, 'wyx-fresh-pick'],
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
