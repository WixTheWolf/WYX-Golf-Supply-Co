import Image from 'next/image';
import Link from 'next/link';
import { categoryFor } from '@/lib/catalog';
import { money } from '@/lib/demo';
import { cleanText } from '@/lib/text';
import type { Product } from '@/types/shopify';

export function EditorialProductCard({ product, featured = false }: { product: Product; featured?: boolean }) {
  const title = cleanText(product.title);
  const image = product.featuredImage;
  return (
    <article className={`editorial-product-card ${featured ? 'featured' : ''}`}>
      <Link href={`/products/${product.handle}`} className="editorial-image-link" aria-label={`View ${title}`}>
        {image && <Image src={image.url} alt={cleanText(image.altText) || title} width={1200} height={900} />}
        <span>{categoryFor(product)}</span>
      </Link>
      <div>
        <p className="eyebrow">Short List</p>
        <h3><Link href={`/products/${product.handle}`}>{title}</Link></h3>
        <p>{shortReason(product)}</p>
        <div className="product-card-footer">
          <span className="price">{money(product.priceRange.minVariantPrice)}</span>
          <Link className="text-link" href={`/products/${product.handle}`}>Shop This</Link>
        </div>
      </div>
    </article>
  );
}

function shortReason(product: Product) {
  const text = `${product.title} ${product.productType} ${(product.tags || []).join(' ')}`.toLowerCase();
  if (text.includes('gps watch') || (text.includes('gps') && text.includes('watch'))) return 'Front, middle, back — no phone needed. 40,000 courses loaded and ready at the wrist.';
  if (text.includes('ball retriever') && text.includes('collapsible')) return 'Extends to 12 feet, collapses to 18 inches. Stops the water-hazard sacrifice without slowing down the group.';
  if (text.includes('arm sleeve') || text.includes('upf')) return 'Blocks 98% of UV rays, cools via moisture-wicking compression. Slip on in seconds before the round starts.';
  if (text.includes('golf tumbler') || text.includes('insulated') && text.includes('tumbler')) return 'Cart cup holder fit, ice for 12 hours, no sweat rings on the scorecard. The one cart accessory worth carrying.';
  if (text.includes('golf sunglasses') || text.includes('polarized') && text.includes('golf')) return 'High-contrast polarized lenses cut glare and track the ball against blue sky. Wraparound fit stays put through the swing.';
  if (text.includes('rain hood') || text.includes('bag cover') || text.includes('bag rain')) return 'Clips over any bag in seconds and packs into a palm-sized pouch. The one item that saves the whole bag when the forecast lies.';
  if (text.includes('rangefinder')) return 'Know your yardage every time. The upgrade that changes how you think about every approach.';
  if (text.includes('yardage book') || text.includes('scorecard holder') || text.includes('scorecard')) return 'Full-grain leather, pencil loop, tee pocket, and snap closure. One of the best golf gifts under $60.';
  if (text.includes('umbrella')) return 'Double-canopy, wind-vented, fits over you and the bag. The round-saver for early tee times in bad weather.';
  if (text.includes('shoe bag') || text.includes('shoe bag')) return 'Mesh-vented nylon. Keeps spikes separate from clothes on every trip.';
  if (text.includes('bamboo tee') || text.includes('golf tee')) return 'Fifty bamboo tees, biodegradable, stronger than wood. The consumable that always needs restocking.';
  if (text.includes('hat case') || text.includes('hat carrying')) return 'Rigid-shell protection for your favorite round hat. Packs in a carry-on without crushing the brim.';
  if (text.includes('groove sharpener') || text.includes('wedge tool')) return 'A simple 10-minute job that helps keep grooves clean between deeper club-care visits. Six groove widths, carbide head.';
  if (text.includes('grip solvent') || text.includes('regrip kit') || text.includes('solvent')) return 'Everything to regrip 14 clubs at home in one afternoon.';
  if (text.includes('bag organizer') || text.includes('organizer insert')) return 'Drops into any 14-way bag pocket and creates 6 separated compartments. Stops the bottom-pocket search.';
  if (text.includes('cooler tube') || text.includes('bag cooler')) return 'Holds 6 cans cold for 18 holes and clips to any bag D-ring. The trip accessory you did not know you needed.';
  if (text.includes('rain jacket') || text.includes('packable')) return 'Stuffs into its own chest pocket. Wind and water-resistant, clean enough for the clubhouse, essential for any trip.';
  if (text.includes('phone mount') || text.includes('cart mount')) return 'Clamps to any cart bar, holds in rain, 360° rotation, MagSafe compatible. One mounting, every round.';
  if (text.includes('milled ball marker set') || (text.includes('ball marker') && text.includes('set'))) return 'Three milled aluminum markers in gold, silver, and gunmetal. Ships gift-ready in a kraft box.';
  if (text.includes('club brush') || text.includes('groove cleaner')) return 'Dual-sided with a groove pick and nylon bristles. Clips to the bag ring and cleans between every shot.';
  if (text.includes('putting mirror') || text.includes('alignment mirror')) return 'Fix your eye position in 5 minutes on any surface. The putting practice tool that actually works.';
  if (text.includes('hat clip') || text.includes('magnetic')) return 'Stick it on your brim and never pat your pocket for a marker again. The easiest upgrade in the bag.';
  if (text.includes('grip tape') || text.includes('re-grip')) return 'One roll. Re-grip a full set at home. Stop paying the shop rate every season.';
  if (text.includes('swing trainer') || text.includes('tempo trainer') || text.includes('swing tempo')) return 'Grooves a repeatable rhythm at the range. Good gift for the golfer who actually wants to get better.';
  if (text.includes('alignment stick') || text.includes('alignment sticks')) return 'The training aid every golfer uses. Simple, useful, and easy to add to any order.';
  if (text.includes('quarter zip') || text.includes('quarter-zip')) return 'Warm enough for early tee times and coastal evenings. Layers over any polo.';
  if (text.includes('hoodie')) return 'The post-round essential. Built for range sessions, travel days, and everything after the last hole.';
  if (text.includes('sock')) return 'Three pairs, arch support, clean WYX stripe. The practical add-on every golfer can use.';
  if (text.includes('snapback')) return 'Flat brim, clean mark. Wears as well off the course as on it.';
  if (text.includes('dad') && text.includes('cap')) return 'The unstructured everyday cap that looks right on the course and everywhere else.';
  if (text.includes('towel')) return 'The easy yes for trips, carts, and cleaning up before the next shot.';
  if (text.includes('marker')) return 'Small, giftable, and useful enough to actually stay in the bag.';
  if (text.includes('ball')) return 'A practical add-on for trip bags, prize tables, and first-tee chaos.';
  if (text.includes('glove')) return 'A clean first-cart upgrade with real utility and a sharp gift price.';
  if (text.includes('hat') || text.includes('cap')) return 'Personality without trying too hard. Easy gift, easy cart.';
  if (text.includes('polo') || text.includes('shirt')) return 'Clean structure, quiet detail. Wears well beyond the first tee.';
  if (text.includes('headcover') || text.includes('cover')) return 'Turns the bag into a little more of a statement.';
  if (text.includes('game set')) return 'Built for golf trips, bachelor weekends, and post-round bragging rights.';
  if (text.includes('caddie')) return 'Keeps the little stuff from turning into a bottom-pocket search party.';
  return 'A useful WYX pick for weekend players and gift shoppers.';
}

