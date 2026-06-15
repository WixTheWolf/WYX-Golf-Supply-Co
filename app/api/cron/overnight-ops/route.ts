import { NextResponse } from 'next/server';
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { isAuthorizedAdminRequest, unauthorizedResponse } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function GET(request: Request) {
  if (!isAuthorizedAdminRequest(request)) return unauthorizedResponse();

  try {
    execSync('npm run overnight:ops', {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: 'pipe',
      timeout: 280_000,
    });

    const briefingPath = join(process.cwd(), 'data', 'morning-briefing.json');
    const briefing = existsSync(briefingPath) ? JSON.parse(readFileSync(briefingPath, 'utf8')) : {};

    return NextResponse.json({ ok: true, briefing });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Overnight ops failed';
    return NextResponse.json({ ok: false, error: message.slice(-500) }, { status: 500 });
  }
}