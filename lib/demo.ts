import type {Product} from '@/types/shopify';
const usd=(amount:string)=>({amount,currencyCode:'USD'});
export const imageMap={hero:'/images/hero-coastal-fairway.png',ropeHat:'/images/rope-hat-product.png',polo:'/images/forest-polo-product.png',towel:'/images/golf-towel-product.png',walk:'/images/walking-golfer-lifestyle..png',leather:'/images/leather-bag-detail.png',iron:'/images/journal-iron-practice.png',care:'/images/journal-club-care.png',strategy:'/images/journal-course-strategy.png'};
const copy:{[k:string]:string}={
'long-game-rope-hat':'A cream rope hat with restrained WYX embroidery, made for course mornings, travel days, and everything after the round.',
'fairway-polo':'A forest green polo with clean structure, quiet detail, and the kind of everyday polish that works far beyond the first tee.',
'waffle-golf-towel':'A premium waffle towel with forest trim, built for the bag and styled for the long game.',
'leather-bag-tag':'A small detail with lasting presence. Built to bring a quiet mark of identity to your golf bag.',
'club-care-kit':'Everything needed to keep grooves clean, gear ready, and the ritual intact.',
'wyx-golf-ball-set':'A clean branded ball set for players who care about every detail, even the small ones.'};
const data=[['The Long Game Rope Hat','long-game-rope-hat','68.00','Core Collection',imageMap.ropeHat,'Headwear'],['The Fairway Polo','fairway-polo','128.00','Core Collection',imageMap.polo,'Apparel'],['The Waffle Golf Towel','waffle-golf-towel','42.00','New',imageMap.towel,'Gear'],['Leather Bag Tag','leather-bag-tag','54.00','Limited',imageMap.leather,'Accessories'],['Club Care Kit','club-care-kit','48.00','Core Collection',imageMap.care,'Club Care'],['WYX Golf Ball Set','wyx-golf-ball-set','36.00','New',imageMap.iron,'Gear']];
export const demoProducts:Product[]=data.map(([title,handle,price,badge,img,type])=>({id:`demo-${handle}`,handle,title,description:copy[handle],featuredImage:{url:img,altText:title},images:[{url:img,altText:title},{url:imageMap.hero,altText:'Coastal golf at golden hour'},{url:imageMap.leather,altText:'WYX product detail'}],variants:[{id:`demo-variant-${handle}`,title:'Default Title',availableForSale:false,price:usd(price)}],priceRange:{minVariantPrice:usd(price)},tags:[badge,type],productType:type}));
export function demoProduct(handle:string){return demoProducts.find(p=>p.handle===handle)||null}export function money(m:{amount:string;currencyCode:string}){return new Intl.NumberFormat('en-US',{style:'currency',currency:m.currencyCode}).format(Number(m.amount))}
