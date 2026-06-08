import { NextResponse } from 'next/server';
import { isAuthorizedAdminRequest, unauthorizedResponse } from '@/lib/adminAuth';
import { catalogExpansionProducts } from '@/lib/shopify/catalogExpansionProducts';
import { importProductDrafts } from '@/lib/shopify/freshProductImport';
import { nextProductExpansionProducts } from '@/lib/shopify/nextProductExpansionProducts';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!isAuthorizedAdminRequest(request)) return unauthorizedResponse();

  try {
    const products = await importProductDrafts([...catalogExpansionProducts, ...nextProductExpansionProducts]);
    return NextResponse.json({
      ok: true,
      mode: 'draft-only-approved-catalog',
      count: products.length,
      products
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : 'Approved catalog import failed.'
    }, { status: 500 });
  }
}
