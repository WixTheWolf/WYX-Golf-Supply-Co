import { NextRequest, NextResponse } from 'next/server';
import { availableProducts } from '@/lib/catalog';
import { coreMerchProducts } from '@/lib/merchandisingFilters';
import { addLine, addLines, createCart, createCartWithLines, getCart, removeLine, updateLine } from '@/lib/shopify/cart';
import { getProducts } from '@/lib/shopify/products';

type CartLineInput = { merchandiseId: string; quantity: number };

async function allowedVariantIds() {
  const products = coreMerchProducts(availableProducts(await getProducts()));
  return new Set(
    products.flatMap((product) => product.variants.filter((variant) => variant.availableForSale).map((variant) => variant.id))
  );
}

async function assertAllowedMerchandise(ids: string[]) {
  if (!ids.length || ids.some((id) => !id)) throw new Error('No purchasable product was selected.');
  const allowed = await allowedVariantIds();
  const blocked = ids.filter((id) => !allowed.has(id));
  if (blocked.length) throw new Error('One or more products are not currently part of the WYX drop.');
}

async function sanitizeCart(cart: any) {
  if (!cart?.lines?.length) return cart;
  const allowed = await allowedVariantIds();
  let next = cart;
  const blockedLines = cart.lines.filter((line: any) => !allowed.has(line.merchandise?.id));
  for (const line of blockedLines) next = await removeLine(next.id, line.id);
  return next;
}

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('cartId');
    if (!id) return NextResponse.json({ cart: null });
    return NextResponse.json({ cart: await sanitizeCart(await getCart(id)) });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();
    const lines = Array.isArray(b.lines) ? b.lines as CartLineInput[] : null;
    const quantity = Number(b.quantity || 1);
    let cart;

    if (lines) {
      await assertAllowedMerchandise(lines.map((line) => line.merchandiseId));
      cart = b.cartId ? await withFreshCartFallback(() => addLines(b.cartId, lines), () => createCartWithLines(lines)) : await createCartWithLines(lines);
    } else {
      await assertAllowedMerchandise([String(b.merchandiseId || '')]);
      cart = b.cartId ? await withFreshCartFallback(() => addLine(b.cartId, b.merchandiseId, quantity), () => createCart(b.merchandiseId, quantity)) : await createCart(b.merchandiseId, quantity);
    }

    return NextResponse.json({ cart: await sanitizeCart(cart) });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const b = await req.json();
    return NextResponse.json({ cart: await sanitizeCart(await updateLine(b.cartId, b.lineId, b.quantity)) });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const b = await req.json();
    return NextResponse.json({ cart: await sanitizeCart(await removeLine(b.cartId, b.lineId)) });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

async function withFreshCartFallback<T>(operation: () => Promise<T>, fallback: () => Promise<T>) {
  try {
    return await operation();
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : '';
    if (message.includes('cart') || message.includes('not found') || message.includes('invalid')) {
      return fallback();
    }
    throw error;
  }
}
