import { NextResponse } from 'next/server';
import { ensureLaunchDiscount } from '@/lib/shopify/discounts';
import { curateCatalog } from '@/lib/shopify/catalogCurator';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!process.env.CRON_SECRET || request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const discount = await ensureLaunchDiscount();
    const curation = await curateCatalog(true);
    return NextResponse.json({ ok: true, discount, curation });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Launch ops failed.' }, { status: 500 });
  }
}
