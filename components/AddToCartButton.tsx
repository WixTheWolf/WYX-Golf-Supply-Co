'use client';
import {useCart} from './CartProvider';
export function AddToCartButton({variantId}:{variantId?:string}){const{add,loading,error}=useCart();const disabled=!variantId||variantId.startsWith('demo-');return <div><button className="button primary full" disabled={disabled||loading} onClick={()=>variantId&&add(variantId)}>{loading?'Adding...':disabled?'Currently Unavailable':'Add To Bag'}</button>{disabled&&<p className="dev-note">This product is not available to purchase right now.</p>}{error&&<p className="error">{error}</p>}</div>}
