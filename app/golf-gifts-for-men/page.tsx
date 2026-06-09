import { intentPages } from '@/lib/intentPages';
import { IntentLandingPage } from '@/components/IntentLandingPage';
import type { Metadata } from 'next';

export const revalidate = 300;

const config = intentPages['golf-gifts-for-men'];

export const metadata: Metadata = {
  title: config.metaTitle,
  description: config.metaDescription,
  alternates: { canonical: '/golf-gifts-for-men' },
  openGraph: { title: config.metaTitle, description: config.metaDescription, url: '/golf-gifts-for-men' }
};

export default function GolfGiftsForMen() {
  return <IntentLandingPage config={config} />;
}
