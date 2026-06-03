import { NextResponse } from 'next/server';
import { availableProducts, catalogCategories, categoryCount, hasSaleReadyMedia } from '@/lib/catalog';
import { getProducts } from '@/lib/shopify/products';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await getProducts();
    const available = availableProducts(products);
    return NextResponse.json({
      ok: true,
      source: 'shopify',
      products: products.length,
      availableForSale: available.length,
      categories: Object.fromEntries(catalogCategories.slice(1).map((category) => [category, categoryCount(available, category)])),
      productChecks: products.map((product) => {
        const activeVariant = product.variants.find((variant) => variant.availableForSale);
        return {
          handle: product.handle,
          title: product.title,
          shopifyProductId: product.id,
          activeOnStorefront: product.availableForSale,
          saleReadyMedia: hasSaleReadyMedia(product),
          image: Boolean(product.featuredImage?.url),
          variants: product.variants.length,
          checkoutVariantId: activeVariant?.id || null,
          price: product.priceRange.minVariantPrice.amount,
          currency: product.priceRange.minVariantPrice.currencyCode,
          readyForVercelStorefront: product.availableForSale && hasSaleReadyMedia(product) && Boolean(activeVariant?.id)
        };
      })
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Catalog check failed.' }, { status: 503 });
  }
}
