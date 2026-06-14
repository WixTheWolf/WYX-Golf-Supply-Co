import { NextResponse } from 'next/server';
import { getUserErrors, shopifyAdminFetch } from '@/lib/shopify/adminClient';

export const dynamic = 'force-dynamic';

const INQUIRY_DEFINITION_CREATE = `#graphql
mutation InquiryDefinitionCreate($definition: MetaobjectDefinitionCreateInput!) {
  metaobjectDefinitionCreate(definition: $definition) {
    metaobjectDefinition { type }
    userErrors { field message }
  }
}`;

const INQUIRY_CREATE = `#graphql
mutation InquiryCreate($metaobject: MetaobjectCreateInput!) {
  metaobjectCreate(metaobject: $metaobject) {
    metaobject { id }
    userErrors { field message }
  }
}`;

function validEmail(value: unknown) {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

async function ensureDefinition() {
  const result = await shopifyAdminFetch<any>(INQUIRY_DEFINITION_CREATE, {
    definition: {
      name: 'WYX Bulk Inquiry',
      type: '$app:wyx_bulk_inquiry',
      access: { admin: 'MERCHANT_READ_WRITE' },
      fieldDefinitions: [
        { name: 'Email', key: 'email', type: 'single_line_text_field' },
        { name: 'Note', key: 'note', type: 'multi_line_text_field' },
        { name: 'Source', key: 'source', type: 'single_line_text_field' },
        { name: 'Created At', key: 'created_at', type: 'single_line_text_field' },
      ],
    },
  });
  const errors = getUserErrors(result);
  const message = errors.map((e: any) => e.message).join(', ');
  if (errors.length && !/already|taken|exists/i.test(message)) throw new Error(message);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.consent) return NextResponse.json({ ok: false, error: 'Consent required.' }, { status: 400 });
  if (!validEmail(body.email)) return NextResponse.json({ ok: false, error: 'Valid email required.' }, { status: 400 });
  if (!body.note || String(body.note).trim().length < 8) {
    return NextResponse.json({ ok: false, error: 'Tell us about your event or quantity.' }, { status: 400 });
  }

  const email = String(body.email).trim().toLowerCase().slice(0, 254);
  const note = String(body.note).trim().slice(0, 2000);
  const source = String(body.source || 'bulk-inquiry').trim().slice(0, 120);
  const now = new Date().toISOString();

  try {
    await ensureDefinition();
    const handle = `bulk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const result = await shopifyAdminFetch<any>(INQUIRY_CREATE, {
      metaobject: {
        type: '$app:wyx_bulk_inquiry',
        handle,
        fields: [
          { key: 'email', value: email },
          { key: 'note', value: note },
          { key: 'source', value: source },
          { key: 'created_at', value: now },
        ],
      },
    });
    const errors = getUserErrors(result);
    if (errors.length) throw new Error(errors.map((e: any) => e.message).join(', '));
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Inquiry failed.' },
      { status: 500 }
    );
  }
}