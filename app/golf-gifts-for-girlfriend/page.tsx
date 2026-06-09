import { intentPages } from '@/lib/intentPages';
import { IntentLandingPage } from '@/components/IntentLandingPage';
import type { Metadata } from 'next';

export const revalidate = 300;

const config = intentPages['golf-gifts-for-girlfriend'];

export const metadata: Metadata = {
  title: config.metaTitle,
  description: config.metaDescription,
  alternates: { canonical: '/golf-gifts-for-girlfriend' },
  openGraph: { title: config.metaTitle, description: config.metaDescription, url: '/golf-gifts-for-girlfriend' }
};

export default function GolfGiftsForGirlfriend() {
  return <IntentLandingPage config={config} />;
}
