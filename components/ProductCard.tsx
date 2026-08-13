'use client';

import { ArrowUpRight, Plus } from '@phosphor-icons/react';
import { m } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { categoryFor } from '@/lib/catalog';
import { money } from '@/lib/demo';
import { motionTokens } from '@/lib/motion';
import { productBuyerPromise } from '@/lib/merchandising';
import { cleanText } from '@/lib/text';
import type { Product } from '@/types/shopify';
import { useCart } from './CartProvider';

export function ProductCard({ product, priority = false, index = 0 }: { product: Product; priority?: boolean; index?: number }) {
  const { add, loading } = useCart();
  const image = product.featuredImage;
  const secondary = product.images.find((item) => item.url !== image?.url);
  const availableVariants = product.variants.filter((item) => item.availableForSale && !item.id.startsWith('demo-'));
  const variant = availableVariants[0];
  const requiresChoice = availableVariants.length > 1;
  const title = cleanText(product.title);
  const alt = cleanText(image?.altText) || title;
  const href = `/products/${product.handle}`;

  return (
    <m.article className="lux-product-card" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-8%' }} transition={{ delay: Math.min(index, 3) * .055, duration: .52, ease: motionTokens.ease.out }}>
      <m.div className="lux-product-card__media" whileHover="hover" initial="rest">
        <Link href={href} aria-label={`View ${title}`}>
          {image ? (
            <>
              <m.div className="lux-product-card__image" variants={{ rest: { scale: 1 }, hover: { scale: 1.025 } }} transition={{ duration: .6, ease: motionTokens.ease.out }} style={{ '--product-transition': `product-${product.handle}` } as React.CSSProperties}>
                <Image src={image.url} alt={alt} fill priority={priority} sizes="(max-width: 680px) 100vw, (max-width: 1100px) 50vw, 25vw" />
              </m.div>
              {secondary && <m.div className="lux-product-card__secondary" variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }} transition={{ duration: .42, ease: motionTokens.ease.out }}><Image src={secondary.url} alt="" fill sizes="(max-width: 680px) 100vw, (max-width: 1100px) 50vw, 25vw" /></m.div>}
            </>
          ) : <span className="lux-product-card__placeholder">Image on the way</span>}
        </Link>
        <div className="lux-product-card__badges"><span>WYX Pick</span>{index < 2 && <span>Current edit</span>}</div>
        {variant && !requiresChoice ? (
          <button className="lux-product-card__quick" disabled={loading} onClick={() => add(variant.id)} aria-label={`Add ${title} to bag`}><Plus size={16} weight="bold" /> Quick add</button>
        ) : (
          <Link className="lux-product-card__quick" href={href}>Choose options <ArrowUpRight size={14} weight="bold" /></Link>
        )}
      </m.div>
      <div className="lux-product-card__body">
        <div><p>{categoryFor(product)} / {String(index + 1).padStart(3, '0')}</p><h3><Link href={href}>{title}</Link></h3></div>
        <strong>{money(product.priceRange.minVariantPrice)}</strong>
        <p>{productBuyerPromise(product)}</p>
      </div>
    </m.article>
  );
}
