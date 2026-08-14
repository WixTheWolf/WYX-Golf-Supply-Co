import type { Transition, Variants } from 'framer-motion';

export const motionTokens = {
  duration: {
    instant: 0.16,
    quick: 0.28,
    standard: 0.52,
    cinematic: 0.86,
    scene: 1.18
  },
  ease: {
    out: [0.22, 1, 0.36, 1] as const,
    inOut: [0.76, 0, 0.24, 1] as const
  },
  spring: {
    tactile: { type: 'spring', stiffness: 380, damping: 32, mass: 0.72 } as Transition,
    soft: { type: 'spring', stiffness: 170, damping: 26, mass: 0.9 } as Transition,
    glide: { type: 'spring', stiffness: 105, damping: 24, mass: 1.08 } as Transition
  }
};

export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: motionTokens.duration.standard, ease: motionTokens.ease.out }
  }
};

export const staggerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.075, delayChildren: 0.04 } }
};
