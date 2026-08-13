import type {Metadata} from 'next';import Image from 'next/image';import Link from 'next/link';import {notFound} from 'next/navigation';import {getPost,allPosts as posts} from '@/lib/journal';
export function generateStaticParams(){return posts.map(p=>({slug:p.slug}))}export async function generateMetadata({params}:{params:{slug:string}}):Promise<Metadata>{const p=getPost(params.slug);if(!p)return{title:'Journal'};
return{title:p.seo,description:p.description,alternates:{canonical:`/journal/${p.slug}`},openGraph:{title:p.seo,description:p.description,url:`/journal/${p.slug}`,images:[p.image]}}}
const siteUrl = 'https://wyxgolfsupply.com';

export default function Article({params}:{params:{slug:string}}){
  const p = getPost(params.slug);
  if(!p) notFound();
  const publication = p as typeof p & {datePublished?: string; dateModified?: string};
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: p.title,
    description: p.description,
    image: `${siteUrl}${p.image}`,
    url: `${siteUrl}/journal/${p.slug}`,
    datePublished: publication.datePublished || '2026-06-01',
    dateModified: publication.dateModified || '2026-06-08',
    author: {'@type':'Organization', name:'WYX Editorial', url: `${siteUrl}/about`},
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
      <p className="eyebrow">The Edit / Field Notes</p>
      <h1>{p.title}</h1>
      <p>{p.description}</p>
      <Image src={p.image} alt={p.title} width={1200} height={800}/>
      {p.sections.map(([h,body])=><section key={h}><h2>{h}</h2><p>{body}</p></section>)}
      {(() => {
        const links = (p as { links?: [string, string][] }).links;
        return links && links.length ? (
          <section>
            <h2>Shop This Guide</h2>
            <ul>{links.map(([label, href]) => <li key={href}><Link href={href}>{label}</Link></li>)}</ul>
          </section>
        ) : null;
      })()}
      <p>Browse <Link href="/products">the current edit</Link>, learn <Link href="/about">how WYX chooses</Link>, or return to <Link href="/journal">Field Notes</Link>.</p>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd)}}/>
    </article>
  );
}
