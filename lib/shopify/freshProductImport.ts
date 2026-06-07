import { getUserErrors, shopifyAdminFetch } from './adminClient';
import { catalogExpansionProducts } from './catalogExpansionProducts';

export type FreshProduct = {
  title: string;
  handle: string;
  vendor: string;
  productType: string;
  price: string;
  compareAtPrice?: string;
  image?: string;
  description: string;
  details: string[];
  sku: string;
  quantity: number;
  sourceUrl: string;
  tags: string[];
  status?: 'ACTIVE' | 'DRAFT';
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
  },
  {
    title: 'Divot Tool + Magnetic Ball Marker Set',
    handle: 'divot-tool-magnetic-ball-marker-set',
    vendor: 'Supplier Review',
    productType: 'Golf Accessories',
    price: '19.99',
    compareAtPrice: '24.99',
    description: 'A pocket-ready divot repair tool and magnetic ball marker set for golfers who want one clean green-side essential.',
    details: ['Strong under-$25 gift candidate', 'Works for dad gifts, scrambles, and trip kits', 'Low sizing risk and easy cart add-on'],
    sku: 'WYX-SR-DIVOT-MARKER-SET',
    quantity: 0,
    sourceUrl: 'supplier-review:JP Lann or GT Golf Supply divot tool and marker set',
    tags: ['supplier-review', 'golf gifts', 'ball marker', 'divot tool', 'under-25', 'scramble-prize'],
    status: 'DRAFT'
  },
  {
    title: 'Premium Golf Towel',
    handle: 'premium-golf-towel-supplier-review',
    vendor: 'Supplier Review',
    productType: 'Towels',
    price: '24.99',
    compareAtPrice: '29.99',
    description: 'A premium golf towel candidate for clean-contact kits, golf trips, and everyday bag upgrades.',
    details: ['Must use real supplier or manufactured WYX product photos before activation', 'Best for trip kits and dad gifts', 'Easy repeatable accessory category'],
    sku: 'WYX-SR-PREMIUM-TOWEL',
    quantity: 0,
    sourceUrl: 'supplier-review:GT Golf Supply, JP Lann, or approved towel supplier',
    tags: ['supplier-review', 'golf gifts', 'towel', 'trip-gear', 'bag-upgrade'],
    status: 'DRAFT'
  },
  {
    title: 'Golf Trip Tee Marker Towel Bundle',
    handle: 'golf-trip-tee-marker-towel-bundle',
    vendor: 'WYX Golf Supply Co.',
    productType: 'Golf Gift Bundle',
    price: '39.99',
    compareAtPrice: '49.99',
    description: 'A ready-made golf trip starter bundle built around the small things every group forgets: tees, markers, and a towel.',
    details: ['Bundle only real supplier products already approved in Shopify', 'Strong buddy-trip and bachelor-party fit', 'Designed to raise average order value without adding clutter'],
    sku: 'WYX-BUNDLE-TRIP-STARTER',
    quantity: 0,
    sourceUrl: 'bundle-review:assemble from approved Shopify products',
    tags: ['supplier-review', 'bundle', 'trip-gear', 'golf gifts', 'scramble-prize'],
    status: 'DRAFT'
  },
  {
    title: 'Compact Golf Laser Rangefinder',
    handle: 'compact-golf-laser-rangefinder',
    vendor: 'Supplier Review',
    productType: 'Golf Tech',
    price: '129.99',
    compareAtPrice: '159.99',
    description: 'A compact laser rangefinder candidate for golfers who want useful course tech without a premium price jump.',
    details: ['Warranty and returns must be confirmed before activation', 'Best for tech and training expansion', 'Keep under $150 retail if margin allows'],
    sku: 'WYX-SR-RANGEFINDER',
    quantity: 0,
    sourceUrl: 'supplier-review:rangefinder supplier with warranty and return terms',
    tags: ['supplier-review', 'golf tech', 'rangefinder', 'training-aid', 'premium'],
    status: 'DRAFT'
  },
  {
    title: 'Putting Alignment Mirror',
    handle: 'putting-alignment-mirror-supplier-review',
    vendor: 'Supplier Review',
    productType: 'Training Aids',
    price: '34.99',
    compareAtPrice: '44.99',
    description: 'A putting alignment mirror candidate for simple, visual practice at home or on the putting green.',
    details: ['Needs real product demo images or video', 'Compact enough for the golf bag', 'Strong gift for golfers trying to score better'],
    sku: 'WYX-SR-PUTTING-MIRROR',
    quantity: 0,
    sourceUrl: 'supplier-review:putting mirror or gate trainer supplier',
    tags: ['supplier-review', 'training-aid', 'putting', 'golf gifts', 'under-50'],
    status: 'DRAFT'
  },
  {
    title: 'Swing Tempo Trainer',
    handle: 'swing-tempo-trainer-supplier-review',
    vendor: 'Supplier Review',
    productType: 'Training Aids',
    price: '29.99',
    compareAtPrice: '39.99',
    description: 'A swing tempo trainer candidate for range sessions, warmups, and golfers working on rhythm instead of another random gadget.',
    details: ['Avoid cheap versions with unclear instructions', 'Best for range and training pages', 'Good under-$40 gift candidate'],
    sku: 'WYX-SR-SWING-TEMPO',
    quantity: 0,
    sourceUrl: 'supplier-review:swing tempo or grip trainer supplier',
    tags: ['supplier-review', 'training-aid', 'range-gear', 'golf gifts', 'under-40'],
    status: 'DRAFT'
  },
  {
    title: 'Brush + Groove Cleaner Kit',
    handle: 'brush-groove-cleaner-kit',
    vendor: 'Supplier Review',
    productType: 'Club Care',
    price: '24.99',
    compareAtPrice: '34.99',
    description: 'A clean-contact kit candidate with a brush and groove cleaner for golfers who want cleaner clubs without overthinking it.',
    details: ['Must be a real packaged kit or clearly bundled approved items', 'Strong checkout add-on', 'Fits towels and bag-upgrade pages'],
    sku: 'WYX-SR-BRUSH-GROOVE-KIT',
    quantity: 0,
    sourceUrl: 'supplier-review:JP Lann, GT Golf Supply, or approved club-care supplier',
    tags: ['supplier-review', 'club-care', 'bag-upgrade', 'clean-contact', 'under-35'],
    status: 'DRAFT'
  },
  {
    title: 'Golf Valuables Pouch',
    handle: 'golf-valuables-pouch-supplier-review',
    vendor: 'Supplier Review',
    productType: 'Golf Accessories',
    price: '34.99',
    compareAtPrice: '44.99',
    description: 'A premium valuables pouch candidate for tees, markers, cash, keys, and the small stuff that disappears in a golf bag.',
    details: ['Needs premium-looking lifestyle and product photos', 'Strong trip and bag-organization fit', 'Good companion to The Roo positioning'],
    sku: 'WYX-SR-VALUABLES-POUCH',
    quantity: 0,
    sourceUrl: 'supplier-review:golf valuables pouch supplier or WYX manufactured product',
    tags: ['supplier-review', 'bag-organization', 'trip-gear', 'golf gifts', 'under-50'],
    status: 'DRAFT'
  },
  {
    title: 'WYX Rope Hat Capsule',
    handle: 'wyx-rope-hat-capsule',
    vendor: 'WYX Golf Supply Co.',
    productType: 'Headwear',
    price: '38.00',
    compareAtPrice: '44.00',
    description: 'A WYX rope hat capsule candidate for the first real owned-brand merch drop.',
    details: ['Do not activate until embroidery artwork and product photos are real', 'Start with two colorways maximum', 'Best owned-brand item because sizing risk is low'],
    sku: 'WYX-POD-ROPE-HAT',
    quantity: 0,
    sourceUrl: 'supplier-review:Bear Grips, POD embroidery supplier, or owned inventory',
    tags: ['supplier-review', 'wyx-merch', 'headwear', 'golf hats', 'apparel'],
    status: 'DRAFT'
  },
  {
    title: 'WYX Performance Polo Capsule',
    handle: 'wyx-performance-polo-capsule',
    vendor: 'WYX Golf Supply Co.',
    productType: 'Apparel',
    price: '68.00',
    compareAtPrice: '78.00',
    description: 'A WYX performance polo capsule candidate for a small, premium apparel drop once sizing and real photos are ready.',
    details: ['Do not activate without size chart, fit notes, and real product photos', 'Start with two core colors', 'Higher AOV but higher return risk than hats'],
    sku: 'WYX-POD-PERFORMANCE-POLO',
    quantity: 0,
    sourceUrl: 'supplier-review:Bear Grips, Cullinan Golf, POD apparel supplier, or owned inventory',
    tags: ['supplier-review', 'wyx-merch', 'apparel', 'golf polo', 'premium'],
    status: 'DRAFT'
  },
  ...catalogExpansionProducts
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
  const sourceNote = product.status === 'DRAFT' ? '<p><strong>Internal note:</strong> supplier terms, product media, inventory, and fulfillment must be confirmed before this product is activated.</p>' : '';
  return `<p>${product.description}</p><h3>Why golfers use it</h3><ul>${product.details.map((detail) => `<li>${detail}</li>`).join('')}</ul><p>Useful golf gear for weekend rounds, range sessions, golf trips, and better bag habits.</p>${sourceNote}`;
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
        status: product.status || 'ACTIVE',
        seo: {
          title: `${product.title} | WYX Golf Supply Co.`,
          description: product.description
        }
      },
      media: product.image ? [{ originalSource: product.image, alt: product.title, mediaContentType: 'IMAGE' }] : []
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

    if ((product.status || 'ACTIVE') === 'ACTIVE') await publishProduct(productId);
    results.push({ handle: product.handle, title: product.title, status: 'created', shopifyStatus: product.status || 'ACTIVE', quantity: product.quantity });
  }
  return results;
}
