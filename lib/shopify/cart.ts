import type {Cart} from '@/types/shopify';import {hasShopify,shopifyFetch} from './client';import {CART_CREATE,CART_LINES_ADD,CART_LINES_REMOVE,CART_LINES_UPDATE,CART_QUERY} from './queries';
function line(node:any){return{id:node.id,quantity:node.quantity,cost:node.cost,merchandise:node.merchandise}}
function cart(c:any):Cart{return{id:c.id,checkoutUrl:c.checkoutUrl,totalQuantity:c.totalQuantity,cost:c.cost,lines:(c.lines?.edges||[]).map((e:any)=>line(e.node))}}
function errs(payload:any){const found=Object.values(payload).find((v:any)=>v?.userErrors);const errors=(found as any)?.userErrors||[];if(errors.length)throw new Error(errors.map((e:any)=>e.message).join(', '))}
export async function getCart(id:string){if(!hasShopify)throw new Error('Shopify cart requires env vars');const d=await shopifyFetch<any>(CART_QUERY,{id});return d.cart?cart(d.cart):null}
export async function createCart(merchandiseId:string,quantity=1){if(!hasShopify)throw new Error('Real checkout requires Shopify env vars');const d=await shopifyFetch<any>(CART_CREATE,{lines:[{merchandiseId,quantity}]});errs(d);return cart(d.cartCreate.cart)}
export async function addLine(cartId:string,merchandiseId:string,quantity=1){const d=await shopifyFetch<any>(CART_LINES_ADD,{cartId,lines:[{merchandiseId,quantity}]});errs(d);return cart(d.cartLinesAdd.cart)}
export async function updateLine(cartId:string,lineId:string,quantity:number){const d=await shopifyFetch<any>(CART_LINES_UPDATE,{cartId,lines:[{id:lineId,quantity}]});errs(d);return cart(d.cartLinesUpdate.cart)}
export async function removeLine(cartId:string,lineId:string){const d=await shopifyFetch<any>(CART_LINES_REMOVE,{cartId,lineIds:[lineId]});errs(d);return cart(d.cartLinesRemove.cart)}
