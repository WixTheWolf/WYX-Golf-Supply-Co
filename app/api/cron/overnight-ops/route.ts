import { NextResponse } from 'next/server';
import { execSync } from 'node:child_process';
import { isAuthorizedAdminRequest, unauthorizedResponse } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function GET(request: Request) {
  if (!isAuthorizedAdminRequest(request)) return unauthorizedResponse();

  try {
    const output = execSync('npm run overnight:ops', {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 280_000,
      env: { ...process.env, FORCE_COLOR: '0' },
    });

    return NextResponse.json({ ok: true, briefing: briefingFromOutput(output) });
  } catch (error) {
    const err = error as { stdout?: string; stderr?: string; message?: string };
    const output = typeof err.stdout === 'string' ? err.stdout : '';
    const message = [err.stderr, err.message].filter(Boolean).join('\n') || 'Overnight ops failed';
    return NextResponse.json({
      ok: false,
      briefing: briefingFromOutput(output),
      error: message.slice(-800),
    }, { status: 500 });
  }
}

function briefingFromOutput(output: string) {
  const marker = 'WYX_BRIEFING_JSON=';
  const line = output.split(/\r?\n/).reverse().find((entry) => entry.startsWith(marker));
  if (!line) return { status: 'unknown', summary: 'WYX system check completed without a parseable briefing.' };
  try {
    return JSON.parse(line.slice(marker.length));
  } catch {
    return { status: 'unknown', summary: 'WYX system check returned an invalid briefing payload.' };
  }
}
