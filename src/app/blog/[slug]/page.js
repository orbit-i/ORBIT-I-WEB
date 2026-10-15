import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getBlogPostBySlug } from '@/server/utils/cmsStorage';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: 'Article Not Found | ORBIT-I' };

  return {
    title: post.seo_title || `${post.title} | ORBIT-I Blog`,
    description: post.seo_description || post.excerpt || 'Technical insight published by ORBIT-I.',
    keywords: post.focus_keyword || post.tags || 'ORBIT-I AI engineering',
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post || post.status === 'archived') {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '85vh', background: 'var(--bg)', paddingTop: 120, paddingBottom: 80, paddingLeft: 24, paddingRight: 24 }}>
        <article style={{ maxWidth: 840, margin: '0 auto', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24, padding: '48px 36px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
          <div style={{ marginBottom: 32, borderBottom: '1px solid var(--border)', paddingBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Link href="/blog" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none' }}>← Blog</Link>
              <span style={{ color: 'var(--text-muted)' }}>/</span>
              <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 4, background: 'var(--accent-glow)', color: 'var(--accent)', fontWeight: 600 }}>{post.category}</span>
            </div>
            <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(28px, 4.5vw, 44px)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.25, marginBottom: 14 }}>
              {post.title}
            </h1>
            {post.excerpt && (
              <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                {post.excerpt}
              </p>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: 'var(--text-muted)' }}>
              <span>By {post.author}</span>
              <span>•</span>
              <span>{post.read_time || '5 min read'}</span>
              <span>•</span>
              <span>{new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>

          {post.featured_image && (
            <div style={{ marginBottom: 32, borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)' }}>
              <Image src={post.featured_image} alt={post.title} width={800} height={400} style={{ width: '100%', height: 'auto', display: 'block' }} unoptimized />
            </div>
          )}

          {/* Article HTML Content */}
          <div
            className="article-body"
            style={{ fontSize: 16, lineHeight: 1.85, color: 'var(--text-secondary)' }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags && (
            <div style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Tags:</span>
              {post.tags.split(',').map((t) => (
                <span key={t} style={{ fontSize: 11, background: 'var(--bg-elevated)', border: '1px solid var(--border)', padding: '3px 10px', borderRadius: 100, color: 'var(--text-primary)' }}>
                  #{t.trim()}
                </span>
              ))}
            </div>
          )}

          <style>{`
            .article-body h2 { font-family: 'Space Grotesk', sans-serif; font-size: 24px; font-weight: 700; color: var(--text-primary); margin: 36px 0 16px; }
            .article-body h3 { font-family: 'Space Grotesk', sans-serif; font-size: 19px; font-weight: 600; color: var(--text-primary); margin: 26px 0 12px; }
            .article-body p { margin-bottom: 18px; }
            .article-body ul, .article-body ol { padding-left: 24px; margin-bottom: 20px; }
            .article-body li { margin-bottom: 8px; }
            .article-body blockquote { border-left: 3px solid var(--accent); padding: 12px 20px; margin: 28px 0; font-style: italic; color: var(--text-primary); background: var(--accent-glow); border-radius: 0 10px 10px 0; }
            .article-body code { background: var(--bg-elevated); padding: 2px 6px; border-radius: 4px; font-size: 14px; color: var(--accent); }
            .article-body pre { background: var(--bg-elevated); padding: 16px; border-radius: 12px; overflow-x: auto; margin: 24px 0; border: 1px solid var(--border); }
          `}</style>
        </article>
      </main>
      <Footer />
    </>
  );
}
