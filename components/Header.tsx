'use client';
import Link from 'next/link';import {useCart} from './CartProvider';
export function Header(){const{count,setOpen}=useCart();return <header className="site-header"><Link className="brand" href="/">WYX Golf Supply Co.</Link><nav className="nav-links" aria-label="Primary navigation"><Link href="/products">Products</Link><Link href="/story">Story</Link><Link href="/journal">Journal</Link></nav><button className="header-cta" onClick={()=>setOpen(true)} aria-label={`Open cart with ${count} items`}>Cart ({count})</button></header>}
