/**
 * Sends priority supplier wholesale outreach emails from mwixted1@gmail.com.
 */
import { execSync } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

type OutreachMessage = {
  id: string;
  to: string;
  subject: string;
  body: string;
};

const messages: OutreachMessage[] = [
  {
    id: 'j-and-m-golf',
    to: 'orders@jandmgolf.com',
    subject: 'Wholesale / dropship application — WYX Golf Supply Co. (Shopify storefront)',
    body: `Hi J&M Golf team,

I'm Matthew Wixted, founder of WYX Golf Supply Co. — a curated golf accessories shop at wyxgolfsupply.com built for weekend golfers and gift buyers.

We're not a big-box retailer. We carry practical cart gear, training aids, towels, markers, and bag upgrades in the $22–$75 range. I'm applying for a wholesale account to source grips, branded accessories, and replenishable items with dropship or low-MOQ fulfillment to our Shopify store.

Why J&M: You stock real golf brands (Golf Pride, SuperStroke, OnCourse) with same-day ship — that's the credibility layer our customers expect.

What we'd start with: 15–25 SKUs — grips, tees, divot tools, ball retrievers, training accessories. We'll sample before scaling.

Our stack: Shopify + Headless storefront, US customers, growing catalog (80+ live SKUs).

Happy to provide EIN, resale certificate, and store URL. What do you need to approve the account?

Best,
Matthew Wixted
WYX Golf Supply Co.
mwixted1@gmail.com | wyxgolfsupply.com`
  },
  {
    id: 'jp-lann',
    to: 'info@jplann.com',
    subject: 'Wholesale account request — WYX Golf Supply Co.',
    body: `Hi JP Lann team,

I'm building WYX Golf Supply Co. (wyxgolfsupply.com) — a curated golf gift and accessories brand focused on useful gear under $75.

I'd like to open a wholesale account for compact ball retrievers, divot tools with removable markers, umbrella/retriever combos, and novelty ball packs (gift tier).

We sell through Shopify with US shipping. Initial test order + 10–15 SKU launch, scaling winners only.

Please send account application steps and minimum order terms.

Thank you,
Matthew Wixted
mwixted1@gmail.com`
  },
  {
    id: 'topdawg',
    to: 'partnerships@topdawg.com',
    subject: 'New Shopify store partnership — golf accessories category',
    body: `Hi TopDawg partnerships,

I'm launching WYX Golf Supply Co. on Shopify (wyxgolfsupply.com) in the golf accessories niche — cart gear, training aids, outdoor accessories.

We're looking for US-warehouse SKUs with reliable tracking (2–5 day ship) for cart phone mounts, chipping nets, ball retrievers, and rain gear.

We'll curate heavily (not bulk import). Plan: sample 8–12 products, list 20–30 after QA.

Please confirm Shopify app sync, MAP policy, and return handling for golf category suppliers.

Best,
Matthew Wixted
mwixted1@gmail.com`
  },
  {
    id: 'gt-golf-supply',
    to: 'sales@ggolf.com',
    subject: 'Wholesale account request — WYX Golf Supply Co.',
    body: `Hi GT Golf Supply team,

I'm Matthew Wixted, founder of WYX Golf Supply Co. (wyxgolfsupply.com) — a curated golf accessories shop for weekend golfers, gift buyers, and scramble organizers.

I'd like to open a wholesale account for divot tools and ball markers, wet/dry towels and tee packs, scramble/prize-table accessories, and pro shop replenishment items (grips, club-care tools).

We sell through Shopify with US customers. Initial plan: sample order + 10–15 SKU test, scaling winners only.

Please send account application steps, pricing tiers, and minimum order terms.

Thank you,
Matthew Wixted
mwixted1@gmail.com | wyxgolfsupply.com`
  },
  {
    id: 'stroke-and-distance',
    to: 'hello@strokeanddistance.com',
    subject: 'Wholesale inquiry — golf trip gift packs for WYX Golf Supply Co.',
    body: `Hi Stroke & Distance team,

I'm building WYX Golf Supply Co. (wyxgolfsupply.com) — a golf gift shop for weekend trips, bachelor outings, and scramble events.

Your custom cap tees and beverage caddies look like a strong fit for our trip-accessory and promotional gift packs. I'd like to learn about wholesale pricing and MOQ, customization options, and ship times to US customers.

We sell through Shopify and plan a 10–15 SKU test before scaling.

Best,
Matthew Wixted
mwixted1@gmail.com`
  },
  {
    id: 'faire',
    to: 'retailers@faire.com',
    subject: 'New retailer account — golf gift accessories for WYX Golf Supply Co.',
    body: `Hi Faire team,

I'm opening a retailer account for WYX Golf Supply Co. (wyxgolfsupply.com) — a curated golf gift shop focused on practical accessories under $75.

We're looking for boutique wholesale brands in leather valuables pouches, premium ball markers and divot tool sets, and bag tags/scorecard holders.

We'll start with a focused net-60 test order (3–5 brands, 8–12 SKUs) and sync winners to Shopify via the Faire app.

Store: Shopify | Audience: US | AOV target: $45–$75

Please confirm retailer onboarding steps and any category recommendations for golf gift buyers.

Matthew Wixted
mwixted1@gmail.com`
  },
  {
    id: 'cullinan-golf',
    to: 'info@cullinan-golf.com',
    subject: 'Dropship partner application — WYX Golf Supply Co.',
    body: `Hi Cullinan Golf team,

WYX Golf Supply Co. (wyxgolfsupply.com) is a curated golf accessories shop on Shopify. We're interested in your dropshipping and custom manufacturing program for performance polos, quarter-zips, small leather accessories, and tournament/teamwear capsules.

Please share partner application requirements, typical US ship times, return policy, and Shopify order workflow.

Matthew Wixted
mwixted1@gmail.com`
  },
  {
    id: 'hireko-golf',
    to: 'reseller@hirekogolf.com',
    subject: 'Dealer/reseller application — WYX Golf Supply Co.',
    body: `Hi Hireko Golf team,

WYX Golf Supply Co. (wyxgolfsupply.com) carries practical golf accessories for weekend golfers. We're evaluating grip and club-care items for our catalog.

I'd like to apply for your reseller program. Please send dealer terms, pricing tiers, and ship times for grips, regrip kits, and accessory components.

Matthew Wixted
mwixted1@gmail.com`
  }
];

function sendMail(message: OutreachMessage) {
  const payload = `To: ${message.to}
Subject: ${message.subject}
Reply-To: mwixted1@gmail.com

${message.body}`;
  execSync(`/usr/bin/mail -s ${JSON.stringify(message.subject)} ${message.to}`, { input: payload, stdio: ['pipe', 'pipe', 'pipe'] });
}

function main() {
  const logDir = join(process.cwd(), 'data');
  if (!existsSync(logDir)) mkdirSync(logDir, { recursive: true });
  const logPath = join(logDir, 'supplier-outreach-log.json');
  const sentAt = new Date().toISOString();
  const results = messages.map((message) => {
    try {
      sendMail(message);
      return { ...message, status: 'queued', sentAt };
    } catch (error) {
      return { ...message, status: 'failed', sentAt, error: error instanceof Error ? error.message : String(error) };
    }
  });
  writeFileSync(logPath, JSON.stringify(results, null, 2));
  const queued = results.filter((r) => r.status === 'queued').length;
  console.log(`✅ Supplier outreach queued: ${queued}/${results.length}`);
  console.log(`   log: ${logPath}`);
  if (results.some((r) => r.status === 'failed')) process.exit(1);
}

main();