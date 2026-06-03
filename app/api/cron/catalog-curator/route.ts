import { NextResponse } from 'next/server';
import { isAuthorizedAdminRequest, unauthorizedResponse } from '@/lib/adminAuth';
import { curateCatalog } from '@/lib/shopify/catalogCurator';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!isAuthorizedAdminRequest(request)) return unauthorizedResponse();

  try {
    return NextResponse.json(await curateCatalog(process.env.WYX_AUTO_PUBLISH === 'true'));
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Catalog curation failed.' }, { status: 500 });
  }
}
