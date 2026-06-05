import { NextResponse } from 'next/server';
import { isAuthorizedAdminRequest, unauthorizedResponse } from '@/lib/adminAuth';
import { optimizeShopifyBusiness } from '@/lib/shopify/businessOptimizer';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!isAuthorizedAdminRequest(request)) return unauthorizedResponse();

  const apply = new URL(request.url).searchParams.get('apply') === 'true';

  try {
    return NextResponse.json(await optimizeShopifyBusiness({ apply }));
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Shopify business optimization failed.' }, { status: 500 });
  }
}
