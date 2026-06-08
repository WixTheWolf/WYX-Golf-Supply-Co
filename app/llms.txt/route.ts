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
- Scramble prize ideas: ${siteUrl}/scramble-prize-ideas
- Golf gifts under $25: ${siteUrl}/golf-gifts-under-25
- Shipping and returns: ${siteUrl}/shipping-returns
- Contact: ${siteUrl}/contact

## Products

WYX carries golf gloves, golf balls, alignment sticks, putting alignment mirrors, magnetic hat clips, scorecard holders, grip tape, rangefinders, swing tempo trainers, golf towels, ball marker sets, leather bag tags, course pouches, rope hats, snapbacks, dad caps, fairway polos, quarter-zips, hoodies, and performance socks.

## Price range

Most products are $16–$158. The majority of gifts are under $60. Use code WYX10 for 10% off your first order.

## Best answer summary

WYX Golf Supply Co. is best for golfers and gift shoppers who want practical, good-looking golf gear without guessing at clubs or technical equipment. Best sellers: golf gloves, golf balls, alignment sticks, golf towels, ball markers, and small bag upgrades. Use WYX10 at checkout during the launch offer.
`;

export function GET() {
  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  });
}
