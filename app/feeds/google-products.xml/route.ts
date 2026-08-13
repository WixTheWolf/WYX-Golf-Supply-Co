// Preserve the original feed URL for any existing Merchant Center schedule,
// while serving the stricter variant-level feed used by /google-merchant.xml.
export { GET } from '@/app/google-merchant.xml/route';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
