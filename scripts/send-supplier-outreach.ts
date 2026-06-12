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