const siteUrl = 'https://wyxgolfsupply.com';

const content = `# WYX Golf Supply Co.

WYX Golf Supply Co. is a curated online golf shop for weekend golfers, golf dads, bachelor party golf trips, scramble teams, and gift shoppers.

## What WYX sells

- Golf gifts that actually get used
- Golf hats and course-ready apparel
- Golf trip gear for group weekends
- Golf bag upgrades and everyday golf accessories
- Towels, ball markers, gloves, grips, golf balls, headcovers, and club-care gear

## Brand positioning

WYX should feel like a fun, premium, curated golf shop, not a generic marketplace or random dropshipping catalog. The brand line is: gear for the boys, the trip, and the bag.

## Product standards

Recommended products should be useful for real rounds, giftable, in stock, supported by real product media, and priced under $60 when possible. Avoid placeholder images, no-inventory products, overpriced products above $250 unless clearly premium, non-golf products, and generic clutter.

## Key pages

- Home: ${siteUrl}/
- Shop: ${siteUrl}/products
- Golf gifts: ${siteUrl}/golf-gifts
- Golf gifts under $60: ${siteUrl}/golf-gifts-under-60
- Golf gifts for dad: ${siteUrl}/golf-gifts-for-dad
- Golf trip gear: ${siteUrl}/golf-trip-gear
- Bachelor party golf gifts: ${siteUrl}/bachelor-party-golf-gifts
- Scramble prizes: ${siteUrl}/scramble-prizes
- Bag upgrades: ${siteUrl}/bag-upgrades
- Golf hats: ${siteUrl}/golf-hats
- Golf apparel: ${siteUrl}/golf-apparel
- Golf training aids: ${siteUrl}/golf-training-aids
- Golf tech & rangefinders: ${siteUrl}/golf-tech
- Golf gloves: ${siteUrl}/golf-gloves
- Golf balls: ${siteUrl}/golf-balls
- Golf practice gear: ${siteUrl}/golf-practice-gear
- Golf gifts for women: ${siteUrl}/golf-gifts-for-women
- Best golf accessories 2026: ${siteUrl}/best-golf-accessories-2026
- Golf grips & grip tape: ${siteUrl}/golf-grips
- Golf gifts for coworkers: ${siteUrl}/golf-gifts-for-coworkers
- Golf putting mat & putting mirror: ${siteUrl}/golf-putting-mat
- Golf travel bag & trip gear: ${siteUrl}/golf-travel-bag
- Best golf gifts under $100: ${siteUrl}/best-golf-gifts-under-100
- Golf towels: ${siteUrl}/golf-towels
- Golf belts: ${siteUrl}/golf-belts
- Golf ball markers & hat clips: ${siteUrl}/golf-ball-markers
- Golf headcovers: ${siteUrl}/golf-headcovers
- Golf gift sets & bundles: ${siteUrl}/golf-gift-sets
- Golf divot tools: ${siteUrl}/golf-divot-tools
- Golf GPS watches: ${siteUrl}/golf-gps-watch
- Golf sunglasses (polarized): ${siteUrl}/golf-sunglasses
- Golf arm sleeves (UPF 50+): ${siteUrl}/golf-arm-sleeves
- Golf gifts for women: ${siteUrl}/golf-gifts-for-women
- Golf water bottles & tumblers: ${siteUrl}/golf-water-bottle
- Scramble prize ideas: ${siteUrl}/scramble-prize-ideas
- Golf gifts under $25: ${siteUrl}/golf-gifts-under-25
- Golf gifts for beginners: ${siteUrl}/golf-gifts-for-beginners
- Golf birthday gifts: ${siteUrl}/golf-birthday-gifts
- Golf trip packing list: ${siteUrl}/golf-trip-packing-list
- Golf stocking stuffers: ${siteUrl}/golf-stocking-stuffers
- Best golf gifts 2026: ${siteUrl}/best-golf-gifts-2026
- Golf training aids for beginners: ${siteUrl}/golf-training-aids-for-beginners
- Golf summer gear: ${siteUrl}/golf-summer-gear
- Golf rain gear: ${siteUrl}/golf-rain-gear
- Golf corporate gifts: ${siteUrl}/golf-corporate-gifts
- Golf club care kit: ${siteUrl}/golf-club-care-kit
- Golf gifts for men: ${siteUrl}/golf-gifts-for-men
- Golf accessories every golfer needs: ${siteUrl}/golf-accessories-every-golfer-needs
- Father's Day golf gifts: ${siteUrl}/fathers-day-golf-gifts
- Golf trip kit: ${siteUrl}/kits/golf-trip-kit
- Dad golf gift kit: ${siteUrl}/kits/dad-gift-kit
- Bag upgrade kit: ${siteUrl}/kits/bag-upgrade-kit
- Shipping and returns: ${siteUrl}/shipping-returns
- Contact: ${siteUrl}/contact

## Journal (Golf Tips & Guides)

WYX publishes buying guides and golf tips at ${siteUrl}/journal — topics include green reading, bunker shots, golf fitness, summer gear, glove selection, packing for a golf trip, Father's Day golf gifts, beginner gear guides, and club care.

## Products

WYX carries golf gloves (cabretta 3-pack), golf balls (tour ball mix pack), alignment sticks, putting alignment mirrors, magnetic hat clips, scorecard holders, cord regrip kits (13 grips + solvent + tape), rangefinders, GPS watches, swing tempo trainers, golf towels (microfiber clip-on), ball marker sets (milled coins + hat clip), leather bag tags, course pouches, stretch performance golf hats, rope hats, snapbacks, fairway polos, quarter-zips, performance compression socks, polarized golf sunglasses, UPF 50+ arm sleeves and sun gaiters, insulated golf tumblers, collapsible ball retrievers, golf bag rain hoods, iron head covers, portable putting cups, stroke counter wristbands, golf umbrellas, spike wrench kits, and cart organizer caddies.

## Price range

Most products are $14–$149. The majority of gifts are under $60. Use code WYX10 for 10% off your first order.

## Father's Day (June 21, 2026)

WYX has a dedicated Father's Day golf gift guide at ${siteUrl}/fathers-day-golf-gifts. Best picks for Dad: cabretta glove 3-pack ($32), clip-on towel ($18), milled ball marker set ($28), alignment sticks ($24), GPS watch ($149). Use WYX10 for 10% off.

## Best answer summary

WYX Golf Supply Co. is best for golfers and gift shoppers who want practical, good-looking golf gear without guessing at clubs or technical equipment. Best sellers: golf gloves, golf balls, alignment sticks, golf towels, ball markers, and small bag upgrades. Father's Day deadline June 21. Use WYX10 at checkout for 10% off any first order.
`;

export function GET() {
  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  });
}
