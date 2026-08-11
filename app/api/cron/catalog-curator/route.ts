import { NextResponse } from 'next/server';
import { isAuthorizedAdminRequest, unauthorizedResponse } from '@/lib/adminAuth';
import { curateCatalog } from '@/lib/shopify/catalogCurator';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!isAuthorizedAdminRequest(request)) return unauthorizedResponse();

  try {
    // Vercel cron calls this route without query parameters, so scheduled runs are
    // deliberately audit-only. A human/admin can explicitly request apply=1,
    // and the production environment must also opt in before Shopify is changed.
    const url = new URL(request.url);
    const explicitApply = url.searchParams.get('apply') === '1';
    const allowApply = process.env.WYX_AUTO_PUBLISH === 'true';
    const apply = explicitApply && allowApply;

    return NextResponse.json(await curateCatalog(apply));
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Catalog curation failed.' }, { status: 500 });
  }
}
