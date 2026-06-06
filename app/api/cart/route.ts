import { NextRequest, NextResponse } from 'next/server';
import { addLine, addLines, createCart, createCartWithLines, getCart, removeLine, updateLine } from '@/lib/shopify/cart';

type CartLineInput = { merchandiseId: string; quantity: number };

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('cartId');
    if (!id) return NextResponse.json({ cart: null });
    return NextResponse.json({ cart: await getCart(id) });
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
      cart = b.cartId ? await withFreshCartFallback(() => addLines(b.cartId, lines), () => createCartWithLines(lines)) : await createCartWithLines(lines);
    } else {
      cart = b.cartId ? await withFreshCartFallback(() => addLine(b.cartId, b.merchandiseId, quantity), () => createCart(b.merchandiseId, quantity)) : await createCart(b.merchandiseId, quantity);
    }

    return NextResponse.json({ cart });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const b = await req.json();
    return NextResponse.json({ cart: await updateLine(b.cartId, b.lineId, b.quantity) });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const b = await req.json();
    return NextResponse.json({ cart: await removeLine(b.cartId, b.lineId) });
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
