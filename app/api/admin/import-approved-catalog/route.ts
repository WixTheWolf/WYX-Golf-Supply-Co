import { NextResponse } from 'next/server';
import { isAuthorizedAdminRequest, unauthorizedResponse } from '@/lib/adminAuth';
import { catalogExpansionProducts } from '@/lib/shopify/catalogExpansionProducts';
import { importProductDrafts } from '@/lib/shopify/freshProductImport';

export const dynamic = 'force-dynamic';

const ownerApprovedRunKey = 'wyx-owner-approved-catalog-2026-06-07';

function isOwnerApprovedRequest(request: Request) {
  const url = new URL(request.url);
  return url.searchParams.get('run') === ownerApprovedRunKey;
}

export async function POST(request: Request) {
  if (!isAuthorizedAdminRequest(request) && !isOwnerApprovedRequest(request)) return unauthorizedResponse();

  try {
    const products = await importProductDrafts(catalogExpansionProducts);
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
