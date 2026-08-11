import Image from 'next/image';
import Link from 'next/link';
import { ProductBadge } from '@/components/ProductBadge';
import { categoryFor } from '@/lib/catalog';
import { priceWithWyx10 } from '@/lib/pricing';
import { cleanText } from '@/lib/text';
import type { Product } from '@/types/shopify';

export function EditorialProductCard({ product, featured = false }: { product: Product; featured?: boolean }) {
  const title = cleanText(product.title);
  const image = product.featuredImage;
  return (
    <article className={`editorial-product-card ${featured ? 'featured' : ''}`}>
      <Link href={`/products/${product.handle}`} className="editorial-image-link" aria-label={`View ${title}`}>
        {image && <Image src={image.url} alt={cleanText(image.altText) || title} width={1200} height={900} sizes="(max-width: 650px) 100vw, (max-width: 900px) 50vw, 33vw" />}
        <span>{categoryFor(product)}</span>
        <ProductBadge product={product} />
      </Link>
      <div>
        <p className="eyebrow">{product.tags?.some((t) => t.toLowerCase() === 'hidden-gem') ? 'Hidden Gem' : 'Short List'}</p>
        <h3><Link href={`/products/${product.handle}`}>{title}</Link></h3>
        <p>{shortReason(product)}</p>
        <div className="product-card-footer">
          <span className="price">
            {priceWithWyx10(product.priceRange.minVariantPrice).formattedSale}
            <small> with WYX10</small>
          </span>
          <Link className="text-link" href={`/products/${product.handle}`}>Shop →</Link>
        </div>
      </div>
    </article>
  );
}

function shortReason(product: Product) {
  const text = `${product.title} ${product.productType} ${(product.tags || []).join(' ')}`.toLowerCase();
  const category = categoryFor(product);

  if (text.includes('identification stamp') || text.includes('golf ball stamp')) return 'A simple way to make your golf balls easier to identify without adding bulk to the bag.';
  if (text.includes('ball marker') || text.includes('hat clip')) return 'Small, useful, and easy to gift — the kind of accessory that earns a permanent pocket.';
  if (text.includes('gps watch') || category === 'Golf Tech') return 'Course-ready golf tech with a clear job: less guessing and a faster decision before the shot.';
  if (text.includes('ball retriever')) return 'A practical bag add for the rounds when one bad bounce does not need to cost another golf ball.';
  if (text.includes('arm sleeve') || text.includes('sun hat') || text.includes('wide brim')) return 'Useful sun-oriented gear for long rounds, golf trips, and hot-weather tee times.';
  if (text.includes('tumbler') || text.includes('cooler')) return 'A practical cart-and-trip add that makes long golf days a little easier.';
  if (text.includes('sunglasses')) return 'Course-ready eyewear for bright rounds and long days outside.';
  if (text.includes('rain hood') || text.includes('rain jacket') || text.includes('umbrella')) return 'Packable weather insurance for golf trips and forecasts that change after the first tee.';
  if (text.includes('rangefinder')) return 'A straightforward yardage tool for golfers who want a quicker number before committing to the shot.';
  if (text.includes('yardage book') || text.includes('scorecard holder') || text.includes('scorecard')) return 'A clean way to keep the scorecard, notes, and round essentials together.';
  if (text.includes('shoe bag')) return 'Keeps golf shoes separated from the rest of the travel bag. Simple, useful, trip-ready.';
  if (text.includes('bamboo tee') || text.includes('golf tee')) return 'The consumable every golfer eventually needs to restock — easy to add to any order.';
  if (text.includes('hat case') || text.includes('hat carrying')) return 'Travel protection for the golf hat you do not want flattened in the suitcase.';
  if (text.includes('groove sharpener') || text.includes('wedge tool') || text.includes('groove cleaner')) return 'Compact club-care gear for keeping grooves cleaner between rounds and range sessions.';
  if (text.includes('grip solvent') || text.includes('regrip kit') || text.includes('grip tape')) return 'A useful home-maintenance add for golfers who refresh their own grips.';
  if (text.includes('bag organizer') || text.includes('organizer insert') || text.includes('caddie')) return 'Keeps the small stuff from becoming a bottom-pocket search party.';
  if (text.includes('phone mount') || text.includes('cart mount')) return 'Keeps the phone visible and out of the cup holder during the round.';
  if (text.includes('club brush')) return 'A bag-friendly cleaner for the dirt and grass that show up every round.';
  if (text.includes('putting mirror') || text.includes('alignment mirror')) return 'A compact practice tool for checking setup and alignment without turning practice into a science project.';
  if (text.includes('swing trainer') || text.includes('tempo trainer') || text.includes('swing tempo') || text.includes('posture corrector')) return 'A compact practice aid for golfers trying to make range sessions more intentional.';
  if (text.includes('putting mat')) return 'At-home putting practice without needing a tee time or a trip to the course.';
  if (text.includes('alignment stick') || text.includes('alignment sticks')) return 'One of the simplest ways to give a range session more structure.';
  if (text.includes('quarter zip') || text.includes('quarter-zip') || text.includes('hoodie')) return 'Easy golf layering for early tee times, travel days, and the hours after the round.';
  if (text.includes('sock')) return 'A practical golf add-on that does not require knowing someone’s club specs.';
  if (text.includes('dad') && text.includes('cap')) return 'An easy everyday cap for the course, the range, and everywhere after the round.';
  if (text.includes('towel')) return 'The easy yes for carts, trips, wet grips, and cleaning up before the next shot.';
  if (text.includes('glove')) return 'A practical first-cart upgrade golfers can put to work immediately.';
  if (text.includes('hat') || text.includes('cap')) return 'An easy course-to-weekend style piece without overcomplicating the gift.';
  if (text.includes('polo') || text.includes('shirt') || category === 'Apparel') return 'Golf-ready style that works on the course and does not have to stay there.';
  if (text.includes('headcover') || text.includes('cover')) return 'A simple way to add personality to the bag without changing the clubs inside it.';
  if (text.includes('game set')) return 'Made for golf trips, group rounds, and the part of the weekend that continues after 18.';
  if (text.includes('ball')) return 'A practical add-on for trip bags, prize tables, and the next round.';

  return 'A useful WYX pick for weekend players, golf trips, and gift shoppers.';
}
