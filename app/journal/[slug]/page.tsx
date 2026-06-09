import type {Metadata} from 'next';import Image from 'next/image';import Link from 'next/link';import {notFound} from 'next/navigation';import {getPost,allPosts as posts} from '@/lib/journal';
export function generateStaticParams(){return posts.map(p=>({slug:p.slug}))}export async function generateMetadata({params}:{params:{slug:string}}):Promise<Metadata>{const p=getPost(params.slug);return p?{title:p.seo,description:p.description,openGraph:{images:[p.image]}}:{title:'Journal'}}
const siteUrl = 'https://wyxgolfsupply.com';

export default function Article({params}:{params:{slug:string}}){
  const p = getPost(params.slug);
  if(!p) notFound();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: p.title,
    description: p.description,
    image: `${siteUrl}${p.image}`,
    url: `${siteUrl}/journal/${p.slug}`,
    datePublished: '2026-06-01',
    dateModified: '2026-06-08',
    author: {'@type':'Organization', name:'WYX Golf Supply Co.', url: siteUrl},
    publisher: {
      '@type': 'Organization',
      name: 'WYX Golf Supply Co.',
      url: siteUrl,
      logo: {'@type':'ImageObject', url:`${siteUrl}/images/hero-coastal-fairway.png`}
    },
    mainEntityOfPage: {'@type':'WebPage','@id':`${siteUrl}/journal/${p.slug}`}
  };
  return (
    <article className="article">
      <p className="eyebrow">Field Notes</p>
      <h1>{p.title}</h1>
      <p>{p.description}</p>
      <Image src={p.image} alt={p.title} width={1200} height={800}/>
      {p.sections.map(([h,body])=><section key={h}><h2>{h}</h2><p>{body}</p></section>)}
      <p>Continue with <Link href="/products">WYX golf essentials</Link> or read <Link href="/story">The Long Game</Link>.</p>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd)}}/>
    </article>
  );
}
