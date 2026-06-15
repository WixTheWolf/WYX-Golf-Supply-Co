'use client';

import { useEffect } from 'react';
import { useCart } from './CartProvider';

export function CartAbandonGuard() {
  const { cart } = useCart();

  useEffect(() => {
    function onBeforeUnload(event: BeforeUnloadEvent) {
      if (!cart?.lines.length) return;
      event.preventDefault();
      event.returnValue = '';
    }
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [cart?.lines.length]);

  return null;
}