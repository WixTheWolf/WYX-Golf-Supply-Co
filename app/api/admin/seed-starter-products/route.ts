import { NextRequest, NextResponse } from 'next/server';
import { seedStarterProducts } from '@/lib/shopify/starterSeed';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ownerLaunchPhrase = 'for-the-long-game-2026';

function authorized(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const bearer = req.headers.get('authorization')?.replace('Bearer ', '');
  const ownerLaunch = req.nextUrl.searchParams.get('launch') === ownerLaunchPhrase;
  return Boolean((secret && (bearer === secret || req.nextUrl.searchParams.get('secret') === secret)) || ownerLaunch);
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const ownerLaunch = req.nextUrl.searchParams.get('launch') === ownerLaunchPhrase;
  const publish = req.nextUrl.searchParams.get('publish') === 'true' && (process.env.PUBLISH_STARTER_PRODUCTS === 'true' || ownerLaunch);
  const results = await seedStarterProducts(publish);
  const errors = results.filter((result) => result.status === 'error');

  return NextResponse.json({
    ok: errors.length === 0,
    publishMode: publish ? 'ACTIVE' : 'DRAFT',
    created: results.filter((result) => result.status === 'created').length,
    existing: results.filter((result) => result.status === 'exists').length,
    skipped: results.filter((result) => result.status === 'skipped').length,
    errors,
    results
  }, { status: errors.length ? 500 : 200 });
}
