'use client';

import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m, useScroll, useSpring } from 'framer-motion';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { motionTokens } from '@/lib/motion';

export function MotionProvider({ children }: { children: ReactNode }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, motionTokens.spring.soft);

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user" transition={{ duration: motionTokens.duration.standard, ease: motionTokens.ease.out }}>
        <m.div className="fixed inset-x-0 top-0 z-[90] h-[2px] origin-left bg-acid" style={{ scaleX }} aria-hidden="true" />
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: motionTokens.duration.quick, ease: motionTokens.ease.out }}
      >
        <m.div
          className="lux-page-curtain"
          aria-hidden="true"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          exit={{ scaleX: 1 }}
          transition={{ duration: .46, ease: motionTokens.ease.inOut }}
        ><span>WYX / The Edit</span></m.div>
        {children}
      </m.div>
    </AnimatePresence>
  );
}
