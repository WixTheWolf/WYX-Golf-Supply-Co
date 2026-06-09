import { intentPages } from '@/lib/intentPages';
import { IntentLandingPage } from '@/components/IntentLandingPage';
import type { Metadata } from 'next';

export const revalidate = 300;

const config = intentPages['golf-gifts-for-wife'];

export const metadata: Metadata = {
  title: config.metaTitle,
  description: config.metaDescription,
  alternates: { canonical: '/golf-gifts-for-wife' },
  openGraph: { title: config.metaTitle, description: config.metaDescription, url: '/golf-gifts-for-wife' }
};

export default function GolfGiftsForWife() {
  return <IntentLandingPage config={config} />;
}
