'use client';
import {useCart} from './CartProvider';
export function AddToCartButton({variantId}:{variantId?:string}){const{add,loading,error}=useCart();const disabled=!variantId||variantId.startsWith('demo-');return <div><button className="button primary" disabled={disabled||loading} onClick={()=>variantId&&add(variantId)}>{loading?'Adding...':disabled?'Shopify setup required':'Add to Cart'}</button>{disabled&&<p className="dev-note">Demo mode: add Shopify env vars and matching product handles for real checkout.</p>}{error&&<p className="error">{error}</p>}</div>}
