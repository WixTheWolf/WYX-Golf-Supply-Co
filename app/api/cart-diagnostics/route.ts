import { NextResponse } from 'next/server';
import { availableProducts } from '@/lib/catalog';
import { createCart } from '@/lib/shopify/cart';
import { getProducts } from '@/lib/shopify/products';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = availableProducts(await getProducts());
    const product = products.find((item) => item.availableForSale && item.variants.some((variant) => variant.availableForSale));
    const variant = product?.variants.find((item) => item.availableForSale);

    if (!product || !variant) {
      return NextResponse.json({ ok: false, error: 'No available Shopify product variant found.' }, { status: 404 });
    }

    const cart = await createCart(variant.id, 1);
    const checkout = new URL(cart.checkoutUrl);

    return NextResponse.json({
      ok: true,
      product: { title: product.title, handle: product.handle },
      variantId: variant.id,
      cartIdPrefix: cart.id.slice(0, 32),
      checkoutUrl: cart.checkoutUrl,
      checkoutHost: checkout.hostname,
      checkoutPath: checkout.pathname,
      totalQuantity: cart.totalQuantity
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Unknown cart diagnostics error.' }, { status: 500 });
  }
}
