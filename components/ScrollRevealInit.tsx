'use client';
import { useEffect } from 'react';

/**
 * WYX motion engine.
 * - Scroll reveals via IntersectionObserver, with a MutationObserver so
 *   sections added by client-side navigation still reveal (the old version
 *   only scanned once on mount and left them invisible).
 * - Pointer-tracked 3D tilt + gold glare on product cards (CSS custom
 *   properties only — the compositor does all the work). Desktop fine
 *   pointers only; disabled under prefers-reduced-motion.
 */
export function ScrollRevealInit() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ----- Scroll reveals -----
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
    );

    const observeAll = (root: ParentNode) => {
      root.querySelectorAll<HTMLElement>('.reveal:not(.is-revealed)').forEach((el) => io.observe(el));
    };
    observeAll(document);

    const mo = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement) {
            if (node.matches?.('.reveal')) io.observe(node);
            observeAll(node);
          }
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // ----- 3D tilt + glare on product cards -----
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    let activeCard: HTMLElement | null = null;
    let raf = 0;
    let lastEvent: PointerEvent | null = null;

    const applyTilt = () => {
      raf = 0;
      if (!activeCard || !lastEvent) return;
      const rect = activeCard.getBoundingClientRect();
      const x = (lastEvent.clientX - rect.left) / rect.width;
      const y = (lastEvent.clientY - rect.top) / rect.height;
      activeCard.style.setProperty('--ry', `${((x - 0.5) * 7).toFixed(2)}deg`);
      activeCard.style.setProperty('--rx', `${((0.5 - y) * 7).toFixed(2)}deg`);
      activeCard.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`);
      activeCard.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`);
    };

    const onMove = (event: PointerEvent) => {
      lastEvent = event;
      if (!raf) raf = requestAnimationFrame(applyTilt);
    };

    const resetCard = (card: HTMLElement) => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    };

    const onOver = (event: PointerEvent) => {
      const card = (event.target as HTMLElement).closest<HTMLElement>('.product-card, .editorial-product-card');
      if (card === activeCard) return;
      if (activeCard) resetCard(activeCard);
      activeCard = card;
    };

    const onOut = (event: PointerEvent) => {
      if (!activeCard) return;
      const next = event.relatedTarget as HTMLElement | null;
      if (!next || !activeCard.contains(next)) {
        resetCard(activeCard);
        activeCard = null;
      }
    };

    if (finePointer && !reduced) {
      document.addEventListener('pointerover', onOver, { passive: true });
      document.addEventListener('pointerout', onOut, { passive: true });
      document.addEventListener('pointermove', onMove, { passive: true });
    }

    return () => {
      io.disconnect();
      mo.disconnect();
      if (raf) cancelAnimationFrame(raf);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
      document.removeEventListener('pointermove', onMove);
    };
  }, []);

  return null;
}
