import { NextResponse } from 'next/server';
import { curateCatalog } from '@/lib/shopify/catalogCurator';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!process.env.CRON_SECRET || request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    return NextResponse.json(await curateCatalog(process.env.WYX_AUTO_PUBLISH === 'true'));
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Catalog curation failed.' }, { status: 500 });
  }
}
