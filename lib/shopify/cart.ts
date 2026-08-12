import type { Cart } from '@/types/shopify';
import { hasShopify, shopifyFetch } from './client';
import { CART_ATTRIBUTES_UPDATE, CART_CREATE, CART_DISCOUNT_CODES_UPDATE, CART_LINES_ADD, CART_LINES_REMOVE, CART_LINES_UPDATE, CART_QUERY } from './queries';

const launchCode = 'WYX10';
const storefrontDomain = 'wyxgolfsupply.com';
const checkoutDomain = 'wyxgolfsupply.myshopify.com';

function line(node: any) {
  return { id: node.id, quantity: node.quantity, cost: node.cost, merchandise: node.merchandise };
}

function checkoutUrl(url: string) {
  try {
    const parsed = new URL(url);
    const isStorefrontHost = parsed.hostname === storefrontDomain || parsed.hostname.endsWith(`.${storefrontDomain}`);
    if (isStorefrontHost) parsed.hostname = checkoutDomain;
    return parsed.toString();
  } catch {
    return url;
  }
}

function cart(c: any): Cart {
  return {
    id: c.id,
    checkoutUrl: checkoutUrl(c.checkoutUrl),
    totalQuantity: c.totalQuantity,
    attributes: c.attributes || [],
    discountCodes: c.discountCodes || [],
    cost: c.cost,
    lines: (c.lines?.edges || []).map((e: any) => line(e.node))
  };
}

function errs(payload: any) {
  const errors = Object.values(payload).flatMap((value: any) => value?.userErrors || []);
  if (errors.length) throw new Error(errors.map((e: any) => e.message).join(', '));
}

async function tryApplyLaunchCode(nextCart: Cart) {
  const alreadyApplied = nextCart.discountCodes?.some((discount) => discount.code.toUpperCase() === launchCode && discount.applicable);
  if (alreadyApplied) return nextCart;
  try {
    const data = await shopifyFetch<any>(CART_DISCOUNT_CODES_UPDATE, { cartId: nextCart.id, discountCodes: [launchCode] });
    errs(data);
    return cart(data.cartDiscountCodesUpdate.cart);
  } catch {
    return nextCart;
  }
}

export async function getCart(id: string) {
  if (!hasShopify) throw new Error('Shopify cart requires env vars');
  const d = await shopifyFetch<any>(CART_QUERY, { id });
  return d.cart ? cart(d.cart) : null;
}

export async function createCart(merchandiseId: string, quantity = 1) {
  if (!hasShopify) throw new Error('Real checkout requires Shopify env vars');
  const d = await shopifyFetch<any>(CART_CREATE, { lines: [{ merchandiseId, quantity }] });
  errs(d);
  return tryApplyLaunchCode(cart(d.cartCreate.cart));
}

export async function addLine(cartId: string, merchandiseId: string, quantity = 1) {
  const d = await shopifyFetch<any>(CART_LINES_ADD, { cartId, lines: [{ merchandiseId, quantity }] });
  errs(d);
  return tryApplyLaunchCode(cart(d.cartLinesAdd.cart));
}

export async function createCartWithLines(lines: { merchandiseId: string; quantity: number }[]) {
  if (!hasShopify) throw new Error('Real checkout requires Shopify env vars');
  const d = await shopifyFetch<any>(CART_CREATE, { lines });
  errs(d);
  return tryApplyLaunchCode(cart(d.cartCreate.cart));
}

export async function addLines(cartId: string, lines: { merchandiseId: string; quantity: number }[]) {
  const d = await shopifyFetch<any>(CART_LINES_ADD, { cartId, lines });
  errs(d);
  return tryApplyLaunchCode(cart(d.cartLinesAdd.cart));
}

export async function updateCartAttributes(cartId: string, attributes: Array<{ key: string; value: string }>) {
  const safe = attributes
    .filter((attribute) => attribute.key && attribute.value)
    .slice(0, 20)
    .map((attribute) => ({ key: attribute.key.slice(0, 80), value: attribute.value.slice(0, 1000) }));
  if (!safe.length) return getCart(cartId);
  const d = await shopifyFetch<any>(CART_ATTRIBUTES_UPDATE, { cartId, attributes: safe });
  errs(d);
  return cart(d.cartAttributesUpdate.cart);
}

export async function updateLine(cartId: string, lineId: string, quantity: number) {
  const d = await shopifyFetch<any>(CART_LINES_UPDATE, { cartId, lines: [{ id: lineId, quantity }] });
  errs(d);
  return cart(d.cartLinesUpdate.cart);
}

export async function removeLine(cartId: string, lineId: string) {
  const d = await shopifyFetch<any>(CART_LINES_REMOVE, { cartId, lineIds: [lineId] });
  errs(d);
  return cart(d.cartLinesRemove.cart);
}
