import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getCmsPageBySlug } from '@/server/utils/cmsStorage';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await getCmsPageBySlug(slug);
  if (!page) return { title: 'Page Not Found | ORBIT-I' };

  return {
    title: page.meta_title || `${page.title} | ORBIT-I`,
    description: page.meta_description || page.excerpt || 'Official corporate page of ORBIT-I Private Limited.',
    keywords: page.keywords || 'ORBIT-I enterprise software',
  };
}

export default async function DynamicCmsPage({ params }) {
  const { slug } = await params;
  const page = await getCmsPageBySlug(slug);

  if (!page || page.status === 'archived') {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '85vh', background: 'var(--bg)', paddingTop: 120, paddingBottom: 80, paddingLeft: 24, paddingRight: 24 }}>
        <article style={{ maxWidth: 880, margin: '0 auto', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24, padding: '48px 36px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
          <div style={{ marginBottom: 28, borderBottom: '1px solid var(--border)', paddingBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Link href="/" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none' }}>← Home</Link>
              <span style={{ color: 'var(--text-muted)' }}>/</span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Pages</span>
              <span style={{ color: 'var(--text-muted)' }}>/</span>
              <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>{page.title}</span>
            </div>
            <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 12 }}>
              {page.title}
            </h1>
            {page.excerpt && (
              <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {page.excerpt}
              </p>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 16, fontSize: 12, color: 'var(--text-muted)' }}>
              <span>Updated: {new Date(page.updated_at || page.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              <span>•</span>
              <span>Verified Corporate Release</span>
            </div>
          </div>

          {/* Page Content HTML */}
          <div
            className="cms-content"
            style={{
              fontSize: 15,
              lineHeight: 1.8,
              color: 'var(--text-secondary)',
            }}
            dangerouslySetInnerHTML={{ __html: page.content_html }}
          />

          <style>{`
            .cms-content h2 { font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 700; color: var(--text-primary); margin: 32px 0 16px; }
            .cms-content h3 { font-family: 'Space Grotesk', sans-serif; font-size: 18px; font-weight: 600; color: var(--text-primary); margin: 24px 0 12px; }
            .cms-content p { margin-bottom: 16px; }
            .cms-content ul, .cms-content ol { padding-left: 24px; margin-bottom: 20px; }
            .cms-content li { margin-bottom: 8px; }
            .cms-content blockquote { border-left: 3px solid var(--accent); padding-left: 18px; margin: 24px 0; font-style: italic; color: var(--text-primary); background: var(--accent-glow); padding-top: 10px; padding-bottom: 10px; border-radius: 0 8px 8px 0; }
            .cms-content code { background: var(--bg-elevated); padding: 2px 6px; border-radius: 4px; font-size: 13px; color: var(--accent); }
            .cms-content pre { background: var(--bg-elevated); padding: 16px; border-radius: 12px; overflow-x: auto; margin: 20px 0; border: 1px solid var(--border); }
          `}</style>
        </article>
      </main>
      <Footer />
    </>
  );
}
