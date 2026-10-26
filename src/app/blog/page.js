import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getBlogPosts } from '@/server/utils/cmsStorage';

export const metadata = {
  title: 'Blog & Technical Insights | ORBIT-I',
  description: 'Enterprise AI engineering, scalable software systems, cyber security insights, and technical articles by ORBIT-I.',
};

export default async function BlogListingPage() {
  const posts = await getBlogPosts();
  const publishedPosts = posts.filter((p) => p.status === 'published');

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '85vh', background: 'var(--bg)', paddingTop: 48, paddingBottom: 80, paddingLeft: 24, paddingRight: 24 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.12em', padding: '4px 12px', background: 'var(--accent-glow)', borderRadius: 100, border: '1px solid var(--border-hover)' }}>
              ✦ Insights & Publications
            </span>
            <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: 'var(--text-primary)', marginTop: 14, marginBottom: 12 }}>
              Engineering & AI Insights
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 650, margin: '0 auto' }}>
              Deep-dives into autonomous agents, production RAG, zero-trust cloud infrastructure, and modern full-stack development.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {publishedPosts.map((post) => (
              <article key={post.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, border-color 0.2s' }}>
                {post.featured_image && (
                  <div style={{ height: 180, background: '#111', overflow: 'hidden', position: 'relative' }}>
                    <Image
                      src={post.featured_image}
                      alt={post.title}
                      width={400}
                      height={180}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      unoptimized
                    />
                  </div>
                )}
                <div style={{ padding: 24, display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, fontSize: 11 }}>
                    <span style={{ padding: '2px 8px', borderRadius: 6, background: 'var(--accent-glow)', color: 'var(--accent)', fontWeight: 600 }}>
                      {post.category}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>{post.read_time || '5 min read'}</span>
                  </div>
                  <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10, lineHeight: 1.4 }}>
                    <Link href={`/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {post.title}
                    </Link>
                  </h2>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 18, flex: 1 }}>
                    {post.excerpt}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--text-muted)' }}>
                    <span>{post.author}</span>
                    <Link href={`/blog/${post.slug}`} style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
                      Read Article →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
