import { NextResponse } from 'next/server';
import { isAuthorizedAdminRequest, unauthorizedResponse } from '@/lib/adminAuth';
import { importFreshProducts } from '@/lib/shopify/freshProductImport';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!isAuthorizedAdminRequest(request)) return unauthorizedResponse();

  try {
    const products = await importFreshProducts();
    return NextResponse.json({ ok: true, products });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Fresh product import failed.' }, { status: 500 });
  }
}
