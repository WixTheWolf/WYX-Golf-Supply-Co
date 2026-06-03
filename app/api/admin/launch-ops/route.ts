import { NextResponse } from 'next/server';
import { isAuthorizedAdminRequest, unauthorizedResponse } from '@/lib/adminAuth';
import { ensureLaunchDiscount } from '@/lib/shopify/discounts';
import { curateCatalog } from '@/lib/shopify/catalogCurator';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!isAuthorizedAdminRequest(request)) return unauthorizedResponse();

  try {
    const discount = await ensureLaunchDiscount();
    const curation = await curateCatalog(true);
    return NextResponse.json({ ok: true, discount, curation });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Launch ops failed.' }, { status: 500 });
  }
}
