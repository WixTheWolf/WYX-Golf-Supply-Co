'use client';

import { ArrowUpRight } from '@phosphor-icons/react';
import Link from 'next/link';
import type { ReactNode } from 'react';

export function ArrowLink({ href, children, className = 'lux-link' }: { href: string; children: ReactNode; className?: string }) {
  return <Link href={href} className={className}>{children}<ArrowUpRight size={14} weight="bold" /></Link>;
}
