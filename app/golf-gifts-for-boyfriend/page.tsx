import { intentPages } from '@/lib/intentPages';
import { IntentLandingPage } from '@/components/IntentLandingPage';
import type { Metadata } from 'next';

export const revalidate = 300;

const config = intentPages['golf-gifts-for-boyfriend'];

export const metadata: Metadata = {
  title: config.metaTitle,
  description: config.metaDescription,
  alternates: { canonical: '/golf-gifts-for-boyfriend' },
  openGraph: { title: config.metaTitle, description: config.metaDescription, url: '/golf-gifts-for-boyfriend' }
};

export default function GolfGiftsForBoyfriend() {
  return <IntentLandingPage config={config} />;
}
