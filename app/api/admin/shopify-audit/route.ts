import { NextResponse } from 'next/server';
import { isAuthorizedAdminRequest, unauthorizedResponse } from '@/lib/adminAuth';
import { categoryFor } from '@/lib/catalog';
import { productReadinessFlags } from '@/lib/productReadiness';
import { getUserErrors, shopifyAdminFetch } from '@/lib/shopify/adminClient';

export const dynamic = 'force-dynamic';

type AdminProduct = {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  productType: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'DRAFT';
  totalInventory: number;
  tags: string[];
  featuredImage?: { url: string; altText?: string | null } | null;
  images: { nodes: Array<{ url: string; altText?: string | null; width?: number; height?: number }> };
  variants: { nodes: Array<{ id: string; title: string; price: string; availableForSale: boolean; inventoryQuantity: number | null; sku: string | null; selectedOptions: Array<{ name: string; value: string }>; image?: { url: string; altText?: string | null } | null }> };
  resourcePublications: { nodes: Array<{ publication: { name: string } }> };
};

const AUDIT = `#graphql
query ShopifyAudit {
  shop {
    name myshopifyDomain currencyCode checkoutApiSupported contactEmail email
    enabledPresentmentCurrencies
    paymentSettings { supportedDigitalWallets }
    countriesInShippingZones { countryCodes }
    plan { displayName }
    primaryDomain { host url }
  }
  publications(first: 20) { nodes { id name } }
  markets(first: 20) { nodes { id name enabled webPresence { domain { host url } } regions(first: 10) { nodes { name } } } }
  codeDiscountNodes(first: 20, query: "code:WYX10") {
    nodes {
      id
      codeDiscount {
        __typename
        ... on DiscountCodeBasic {
          title status startsAt endsAt
          codes(first: 5) { nodes { code } }
          customerGets { value { __typename ... on DiscountPercentage { percentage } } }
        }
      }
    }
  }
  products(first: 100, sortKey: CREATED_AT, reverse: true) {
    nodes {
      id handle title vendor productType status totalInventory tags
      featuredImage { url altText }
      images(first: 8) { nodes { url altText width height } }
      variants(first: 20) { nodes { id title price availableForSale inventoryQuantity sku selectedOptions { name value } image { url altText } } }
      resourcePublications(first: 20) { nodes { publication { name } } }
    }
  }
}`;

const UPDATE_PRODUCT = `#graphql
mutation AuditProductUpdate($product: ProductUpdateInput!) {
  productUpdate(product: $product) { product { id status tags } userErrors { field message } }
}`;

function prices(product: AdminProduct) {
  return product.variants.nodes.map((variant) => Number(variant.price)).filter(Number.isFinite);
}

function productFlags(product: AdminProduct) {
  const productPrices = prices(product);
  const flags: string[] = [];
  if (product.status !== 'ACTIVE') flags.push('not-active');
  if (!product.featuredImage?.url) flags.push('missing-image');
  if (product.featuredImage?.url && isPlaceholderProductImage(product.featuredImage.url)) flags.push('placeholder-image');
  if (!product.vendor) flags.push('missing-supplier');
  if (product.totalInventory <= 0) flags.push('no-inventory');
  if (!product.resourcePublications.nodes.length) flags.push('not-published');
  if (!productPrices.length) flags.push('missing-price');
  if (productPrices.some((price) => price > 250)) flags.push('over-250');
  if (product.variants.nodes.every((variant) => !variant.sku)) flags.push('missing-skus');
  flags.push(...productReadinessFlags({
    ...product,
    availableForSale: product.status === 'ACTIVE' && product.totalInventory > 0,
    description: '',
    featuredImage: product.featuredImage,
    images: product.images.nodes,
    variants: product.variants.nodes.map((variant) => ({
      ...variant,
      price: { amount: variant.price, currencyCode: 'USD' },
      image: variant.image || null
    })),
    priceRange: { minVariantPrice: { amount: String(Math.min(...productPrices, 0)), currencyCode: 'USD' } }
  }));
  return flags;
}

function isPlaceholderProductImage(url: string) {
  return [
    'hero-coastal-fairway.png',
    'forest-polo-product.png',
    'journal-club-care.png',
    'journal-course-strategy.png',
    'journal-iron-practice.png',
    'leather-bag-detail.png',
    'walking-golfer-lifestyle..png'
  ].some((name) => url.toLowerCase().includes(name));
}

async function pauseProduct(product: AdminProduct, reason: string) {
  const tags = Array.from(new Set([...(product.tags || []), `wyx-auto-paused:${reason}`]));
  const data = await shopifyAdminFetch<any>(UPDATE_PRODUCT, { product: { id: product.id, status: 'DRAFT', tags } });
  const errors = getUserErrors(data);
  if (errors.length) throw new Error(errors.map((error: any) => error.message).join(', '));
}

export async function GET(request: Request) {
  if (!isAuthorizedAdminRequest(request)) return unauthorizedResponse();

  const shouldFix = new URL(request.url).searchParams.get('fix') === 'true';
  const data = await shopifyAdminFetch<any>(AUDIT);
  const products = data.products.nodes as AdminProduct[];
  const fixes: Array<{ title: string; action: string }> = [];

  if (shouldFix) {
    for (const product of products) {
      const flags = productFlags(product);
      if (product.status === 'ACTIVE' && flags.includes('no-inventory')) {
        await pauseProduct(product, 'no-inventory');
        fixes.push({ title: product.title, action: 'paused no-inventory product' });
      } else if (product.status === 'ACTIVE' && flags.includes('over-250')) {
        await pauseProduct(product, 'over-250');
        fixes.push({ title: product.title, action: 'paused over-250 product' });
      } else if (product.status === 'ACTIVE' && flags.includes('placeholder-image')) {
        await pauseProduct(product, 'placeholder-image');
        fixes.push({ title: product.title, action: 'paused placeholder-image product' });
      }
    }
  }

  const productAudits = products.map((product) => {
    const productPrices = prices(product);
    return {
      title: product.title,
      handle: product.handle,
      vendor: product.vendor,
      status: product.status,
      category: categoryFor(product),
      totalInventory: product.totalInventory,
      featuredImage: product.featuredImage?.url || null,
      minPrice: productPrices.length ? Math.min(...productPrices) : null,
      maxPrice: productPrices.length ? Math.max(...productPrices) : null,
      variants: product.variants.nodes.length,
      availableVariants: product.variants.nodes.filter((variant) => variant.availableForSale).length,
      publications: product.resourcePublications.nodes.map((node) => node.publication.name),
      flags: productFlags(product)
    };
  });

  return NextResponse.json({
    ok: true,
    fixed: shouldFix,
    fixes,
    shop: data.shop,
    readiness: {
      checkoutApiSupported: data.shop.checkoutApiSupported,
      enabledPresentmentCurrencies: data.shop.enabledPresentmentCurrencies,
      supportedDigitalWallets: data.shop.paymentSettings?.supportedDigitalWallets || [],
      shipsToCountries: data.shop.countriesInShippingZones?.countryCodes || [],
      contactEmailMatchesOwnerEmail: data.shop.contactEmail === data.shop.email
    },
    publications: data.publications.nodes.map((publication: { name: string }) => publication.name),
    markets: data.markets.nodes.map((market: any) => ({
      name: market.name,
      enabled: market.enabled,
      domain: market.webPresence?.domain?.host || null,
      regions: market.regions.nodes.map((region: { name: string }) => region.name)
    })),
    discounts: data.codeDiscountNodes.nodes.map((node: any) => ({
      title: node.codeDiscount?.title,
      status: node.codeDiscount?.status,
      codes: node.codeDiscount?.codes?.nodes?.map((code: { code: string }) => code.code) || [],
      startsAt: node.codeDiscount?.startsAt,
      endsAt: node.codeDiscount?.endsAt,
      percentage: node.codeDiscount?.customerGets?.value?.percentage || null
    })),
    counts: {
      totalProducts: productAudits.length,
      activeProducts: productAudits.filter((product) => product.status === 'ACTIVE').length,
      draftProducts: productAudits.filter((product) => product.status === 'DRAFT').length,
      flaggedProducts: productAudits.filter((product) => product.flags.length).length,
      noInventory: productAudits.filter((product) => product.flags.includes('no-inventory')).length,
      over250: productAudits.filter((product) => product.flags.includes('over-250')).length,
      missingSkus: productAudits.filter((product) => product.flags.includes('missing-skus')).length,
      placeholderImages: productAudits.filter((product) => product.flags.includes('placeholder-image')).length
    },
    products: productAudits
  });
}
