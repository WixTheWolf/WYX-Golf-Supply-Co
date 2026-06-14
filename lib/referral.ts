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
  return {
    short: `I found a golf gift shop that only lists gear weekend players keep in the bag. ${link} — code WYX10 for 10% off.`,
    golfer: `If you golf, check out WYX Golf Supply — practical bag upgrades, not novelty junk. Bag Upgrade Kit: ${link} (WYX10 = 10% off first order).`,
    gift: `Need a golf gift? WYX curates useful stuff under $75. ${link} — WYX10 saves 10% on first order.`,
  };
}

export function parseReferralFromSearch(search: string) {
  const params = new URLSearchParams(search);
  return params.get('ref') || params.get('utm_campaign')?.replace(/^ref_/, '') || null;
}