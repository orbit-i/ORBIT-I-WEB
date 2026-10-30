import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogPostClient from '@/components/BlogPostClient';
import { getBlogPostBySlug } from '@/server/utils/cmsStorage';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: 'Article Not Found | ORBIT-I Private Limited' };

  return {
    title: post.seo_title || `${post.title} | ORBIT-I Blog`,
    description: post.seo_description || post.excerpt || 'Technical insight and software engineering analysis by ORBIT-I Private Limited.',
    keywords: [
      post.focus_keyword,
      post.tags,
      post.downloadable_tags,
      'software company Nawabshah',
      'AI engineering Karachi',
      'enterprise software Pakistan',
    ].filter(Boolean).join(', '),
    openGraph: {
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt,
      type: 'article',
      url: `https://orbit-i.tech/blog/${post.slug}`,
      images: [
        {
          url: post.featured_image || 'https://orbit-i.tech/og-image.jpg',
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt,
      images: [post.featured_image || 'https://orbit-i.tech/og-image.jpg'],
    },
    alternates: {
      canonical: `https://orbit-i.tech/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post || post.status === 'archived') {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.seo_description || post.excerpt,
    image: post.featured_image ? [post.featured_image] : ['https://orbit-i.tech/orbitlogo-removebg-preview.png'],
    datePublished: post.created_at || new Date().toISOString(),
    dateModified: post.updated_at || post.created_at || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: post.author || 'ORBIT-I Engineering Team',
      url: 'https://orbit-i.tech',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ORBIT-I Private Limited',
      url: 'https://orbit-i.tech',
      logo: {
        '@type': 'ImageObject',
        url: 'https://orbit-i.tech/orbitlogo-removebg-preview.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://orbit-i.tech/blog/${post.slug}`,
    },
    keywords: post.focus_keyword || post.tags || 'ORBIT-I AI engineering',
  };

  return (
    <>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main style={{ minHeight: '85vh', background: 'var(--bg)', paddingTop: 40, paddingBottom: 80, paddingLeft: 24, paddingRight: 24 }}>
        <BlogPostClient post={post} />
      </main>
      <Footer />
    </>
  );
}
