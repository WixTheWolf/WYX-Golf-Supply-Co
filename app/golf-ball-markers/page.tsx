import type { Metadata } from 'next';
import { IntentLandingPage } from '@/components/IntentLandingPage';
import { intentPages } from '@/lib/intentPages';

const config = intentPages['golf-ball-markers'];

export const revalidate = 300;
export const metadata: Metadata = {
  title: config.metaTitle,
  description: config.metaDescription,
  alternates: { canonical: '/golf-ball-markers' }
};

export default async function Page() {
  return IntentLandingPage({ config });
}
