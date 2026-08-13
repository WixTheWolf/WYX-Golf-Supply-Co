'use client';

import { m } from 'framer-motion';
import type { ReactNode } from 'react';
import { revealVariants } from '@/lib/motion';

export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <m.div
      className={className}
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      transition={{ delay }}
    >
      {children}
    </m.div>
  );
}
