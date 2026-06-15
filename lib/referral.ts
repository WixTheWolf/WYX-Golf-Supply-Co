import { siteUrl } from '@/lib/feed';

export const DEFAULT_REFERRAL_CODE = 'WYX10';

export type ReferralChannel = 'text' | 'email' | 'facebook' | 'instagram' | 'twitter';

export function referralLink(path: string, ref = 'friend', medium: ReferralChannel = 'text') {
  const url = new URL(path, siteUrl);
  url.searchParams.set('utm_source', 'referral');
  url.searchParams.set('utm_medium', medium);
  url.searchParams.set('utm_campaign', `ref_${ref}`);
  url.searchParams.set('ref', ref);
  return url.toString();
}

export function shareMessages(path = '/weekend-golfer-bag-upgrade-kit') {
  const link = referralLink(path);
  const shortLink = `${siteUrl}/go?ref=share`;
  const giftLink = `${siteUrl}/gift?ref=share`;
  return {
    short: `Practical golf gifts that stay in the bag — not novelty junk. ${shortLink} (WYX10 = 10% off)`,
    golfer: `If you golf, check out WYX — bag upgrades that pass "would you keep it after round one?" ${shortLink} — WYX10 for 10% off.`,
    gift: `Need a Father's Day golf gift? Useful bag stuff under $75. ${giftLink} — code WYX10 saves 10%.`,
  };
}

export function parseReferralFromSearch(search: string) {
  const params = new URLSearchParams(search);
  return params.get('ref') || params.get('utm_campaign')?.replace(/^ref_/, '') || null;
}