import type { Metadata } from 'next';
import { IntentLandingPage } from '@/components/IntentLandingPage';
import { intentPages } from '@/lib/intentPages';

const config = intentPages['scramble-prizes'];

export const revalidate = 300;
export const metadata: Metadata = {
  title: config.metaTitle,
  description: config.metaDescription,
  alternates: { canonical: '/scramble-prizes' }
};

export default async function Page() {
  return IntentLandingPage({ config });
}

