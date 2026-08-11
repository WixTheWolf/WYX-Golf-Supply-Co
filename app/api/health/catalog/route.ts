import { NextResponse } from 'next/server';
import { availableProducts, catalogCategories, categoryCount, categoryFor, hasSaleReadyMedia } from '@/lib/catalog';
import { isHiddenFromCoreStorefront } from '@/lib/merchandisingFilters';
import { hasKnownImageMismatch, hasMisleadingProductMedia } from '@/lib/productReadiness';
import { getProducts } from '@/lib/shopify/products';

export const dynamic = 'force-dynamic';

function tagSet(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  return new Set((product.tags || []).map((tag) => tag.toLowerCase()));
}

function blockers(product: Awaited<ReturnType<typeof getProducts>>[number], publicCatalog: boolean) {
  if (publicCatalog) return [];
  const tags = tagSet(product);
  const reasons: string[] = [];
  if (!product.availableForSale) reasons.push('not-available-for-sale');
  if (isHiddenFromCoreStorefront(product)) reasons.push('hidden-or-blocked-vendor');
  if (tags.has('supplier-review')) reasons.push('supplier-review');
  if (hasKnownImageMismatch(product)) reasons.push('known-image-mismatch');
  if (hasMisleadingProductMedia(product)) reasons.push('misleading-media');
  if (!hasSaleReadyMedia(product)) reasons.push('media-not-sale-ready');
  if (!reasons.length) reasons.push('public-price-or-content-gate');
  return reasons;
}

export async function GET() {
  try {
    const products = await getProducts({ fresh: true });
    const available = availableProducts(products);
    const availableHandles = new Set(available.map((product) => product.handle));

    return NextResponse.json({
      ok: true,
      source: 'shopify',
      products: products.length,
      availableForSale: available.length,
      categories: Object.fromEntries(catalogCategories.slice(1).map((category) => [category, categoryCount(available, category)])),
      productChecks: products.map((product) => {
        const activeVariant = product.variants.find((variant) => variant.availableForSale);
        const publicCatalog = availableHandles.has(product.handle);
        const tags = tagSet(product);
        return {
          handle: product.handle,
          title: product.title,
          vendor: product.vendor || null,
          category: categoryFor(product),
          publicCatalog,
          blockers: blockers(product, publicCatalog),
          fulfillment: {
            dsers: tags.has('supplier-dsers') || tags.has('fulfillment-aliexpress'),
            spocket: tags.has('supplier-spocket') || tags.has('fulfillment-spocket'),
            topdawg: tags.has('supplier-topdawg') || tags.has('fulfillment-topdawg'),
            collective: tags.has('supplier-collective') || tags.has('fulfillment-shopify-collective'),
            supplierReview: tags.has('supplier-review')
          },
          shopifyProductId: product.id,
          activeOnStorefront: product.availableForSale,
          saleReadyMedia: hasSaleReadyMedia(product),
          image: Boolean(product.featuredImage?.url),
          variants: product.variants.length,
          checkoutVariantId: activeVariant?.id || null,
          price: product.priceRange.minVariantPrice.amount,
          currency: product.priceRange.minVariantPrice.currencyCode,
          readyForVercelStorefront: publicCatalog && Boolean(activeVariant?.id)
        };
      })
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Catalog check failed.' }, { status: 503 });
  }
}
