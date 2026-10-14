import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { blogPosts, getBlogPostBySlug } from '@/data/blogData'

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)
  if (!post) return { title: 'Article Not Found' }

  return {
    title: `${post.title} | ORBIT-I Blog`,
    description: post.metaDesc,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.metaDesc,
      url: `https://orbit-i.tech/blog/${post.slug}`,
      type: 'article',
    },
    alternates: {
      canonical: `https://orbit-i.tech/blog/${post.slug}`,
    },
  }
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 100, minHeight: '100vh', background: 'var(--bg)' }}>
        <article style={{ padding: '40px 0 80px' }}>
          <div className="container" style={{ maxWidth: 840 }}>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
              <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
              <span>/</span>
              <Link href="/blog" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Blog</Link>
              <span>/</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{post.category}</span>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
              <span className="tag"><span className="dot" />{post.category}</span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{post.date} · {post.readTime}</span>
            </div>

            <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(28px, 4.5vw, 46px)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 16 }}>
              {post.title}
            </h1>

            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
              Published by <strong>{post.author}</strong> · ORBIT-I Private Limited (Nawabshah & Karachi)
            </p>

            {/* Post Content */}
            <div style={{
              fontSize: 16, lineHeight: 1.85, color: 'var(--text-secondary)',
              display: 'flex', flexDirection: 'column', gap: 20
            }}>
              {post.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('### ')) {
                  return (
                    <h2 key={index} style={{ fontFamily: 'Space Grotesk', fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginTop: 20, marginBottom: 6 }}>
                      {paragraph.replace('### ', '')}
                    </h2>
                  )
                }
                if (paragraph.startsWith('1. ') || paragraph.startsWith('- ')) {
                  return (
                    <div key={index} style={{ paddingLeft: 20, borderLeft: '2px solid var(--accent)', margin: '8px 0' }}>
                      {paragraph.split('\n').map((item, i) => (
                        <p key={i} style={{ marginBottom: 6 }}>{item}</p>
                      ))}
                    </div>
                  )
                }
                return (
                  <p key={index} dangerouslySetInnerHTML={{
                    __html: paragraph
                      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--text-primary);">$1</strong>')
                      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color:var(--accent);text-decoration:underline;">$1</a>')
                  }} />
                )
              })}
            </div>

            {/* Internal Backlink Box */}
            <div style={{ marginTop: 48, padding: 32, background: 'var(--bg-card)', border: '1px solid var(--border-hover)', borderRadius: 20, textAlign: 'center' }}>
              <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                Build Your Next Digital Platform with ORBIT-I
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
                From our corporate headquarters in Nawabshah and branch in Karachi, we engineer dependable software for forward-thinking organizations worldwide.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/services" className="btn-primary" style={{ textDecoration: 'none' }}>Explore All Services</Link>
                <Link href="/contact" className="btn-outline" style={{ textDecoration: 'none' }}>Consult Engineering Leads</Link>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
