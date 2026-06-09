import { intentPages } from '@/lib/intentPages';
import { IntentLandingPage } from '@/components/IntentLandingPage';
import type { Metadata } from 'next';

export const revalidate = 300;

const config = intentPages['golf-accessories-every-golfer-needs'];

export const metadata: Metadata = {
  title: config.metaTitle,
  description: config.metaDescription,
  alternates: { canonical: '/golf-accessories-every-golfer-needs' },
  openGraph: { title: config.metaTitle, description: config.metaDescription, url: '/golf-accessories-every-golfer-needs' }
};

export default function GolfAccessoriesEveryGolferNeeds() {
  return <IntentLandingPage config={config} />;
}
