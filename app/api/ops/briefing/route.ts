import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { isAuthorizedAdminRequest, unauthorizedResponse } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

function readJson(path: string) {
  return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : null;
}

export async function GET(request: Request) {
  if (!isAuthorizedAdminRequest(request)) return unauthorizedResponse();

  const root = process.cwd();
  const data = join(root, 'data');

  const briefing = readJson(join(data, 'morning-briefing.json'));
  const report = readJson(join(data, 'overnight-report.json'));
  const topdawg = readJson(join(data, 'topdawg-connection.json'));
  const dsers = readJson(join(data, 'dsers-spocket-connection.json'));
  const empire = readJson(join(data, 'empire-roadmap.json'));

  const dailyDir = join(data, 'daily-content', 'latest');
  const dailyContent = existsSync(dailyDir)
    ? ['instagram-carousel.json', 'facebook-post.json', 'x-thread.json', 'tiktok-video-script.json', 'linkedin-post.json']
        .filter((f) => existsSync(join(dailyDir, f)))
        .map((f) => ({ file: f, ...readJson(join(dailyDir, f)) }))
    : [];

  return NextResponse.json({
    ok: true,
    generatedAt: briefing?.generatedAt || new Date().toISOString(),
    summary: briefing?.summary || 'No overnight run yet.',
    topPriority: briefing?.topPriority || [],
    failedSteps: briefing?.failedSteps || [],
    links: report?.links || {
      storefront: 'https://wyxgolfsupply.com',
      open: 'https://wyxgolfsupply.com/open',
      kit: 'https://wyxgolfsupply.com/weekend-golfer-bag-upgrade-kit',
      googleFeed: 'https://wyxgolfsupply.com/feeds/google-products.xml',
      health: 'https://wyxgolfsupply.com/api/health/catalog',
    },
    pipeline: {
      topdawg: {
        shopifyConnected: topdawg?.shopifyConnected ?? false,
        importListMapped: topdawg?.importListMapped ?? false,
        sampleOrderPlaced: topdawg?.sampleOrderPlaced ?? false,
        headlessPublished: topdawg?.headlessPublishedCount ?? 0,
        target: 8,
      },
      dsers: {
        linked: dsers?.dsersMappedCount ?? 0,
        target: dsers?.dsersTargetCount ?? 21,
        testOrder: dsers?.testOrder?.confirmation || null,
        testOrderStatus: dsers?.testOrder?.dsersStatus || null,
      },
    },
    empire: empire?.phases?.[0] || null,
    dailyContent,
    lastOvernightRun: report?.completedAt || null,
  });
}