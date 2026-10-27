import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogListingClient from '@/components/BlogListingClient';
import { getBlogPosts, getBlogCategories } from '@/server/utils/cmsStorage';

export const metadata = {
  title: 'Blog & Technical Articles | ORBIT-I Private Limited (Nawabshah & Karachi)',
  description:
    'Read engineering deep-dives, autonomous AI agent blueprints, high-concurrency Next.js architecture, and technical software case studies from ORBIT-I Private Limited.',
  keywords: [
    'ORBIT-I blog',
    'software engineering articles Nawabshah',
    'AI development blog Karachi',
    'Sindh tech publications',
    'autonomous AI agents Next.js',
    'production RAG architecture',
    'enterprise software Sindh Pakistan',
  ],
  alternates: {
    canonical: 'https://orbit-i.tech/blog',
  },
};

export default async function BlogListingPage() {
  const [posts, categories] = await Promise.all([
    getBlogPosts().catch(() => []),
    getBlogCategories().catch(() => []),
  ]);

  const publishedPosts = (posts || []).filter((p) => p.status === 'published');

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '85vh', background: 'var(--bg)', paddingTop: 48, paddingBottom: 80, paddingLeft: 24, paddingRight: 24 }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          {/* Hero Header */}
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                padding: '4px 14px',
                background: 'var(--accent-glow)',
                borderRadius: 100,
                border: '1px solid var(--border-hover)',
              }}
            >
              ✦ Engineering Insights & Technical Whitepapers
            </span>
            <h1
              style={{
                fontFamily: 'Space Grotesk',
                fontSize: 'clamp(32px, 5vw, 50px)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginTop: 14,
                marginBottom: 12,
              }}
            >
              Engineering & AI <span className="gradient-text-blue">Publications</span>
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 680, margin: '0 auto', lineHeight: 1.7 }}>
              Deep-dives into autonomous agents, production RAG pipelines, zero-trust cloud infrastructure, and regional technology developments across Nawabshah, Karachi, and global markets.
            </p>
          </div>

          {/* Interactive Client Listing with Reactive Search & Category Filters */}
          <BlogListingClient initialPosts={publishedPosts} categories={categories} />
        </div>
      </main>
      <Footer />
    </>
  );
}
