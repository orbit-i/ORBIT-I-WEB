'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TiltCard from '@/components/TiltCard'
import Link from 'next/link'
import { blogPosts } from '@/data/blogData'

export default function BlogHubPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 100, minHeight: '100vh', background: 'var(--bg)' }}>
        <section style={{ padding: '48px 0 60px', position: 'relative' }}>
          <div className="grid-bg" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
          <div className="container" style={{ position: 'relative', textAlign: 'center', maxWidth: 840 }}>
            <span className="tag"><span className="dot" />Engineering Insights & Tech Thought Leadership</span>
            <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(32px, 5vw, 54px)', fontWeight: 800, color: 'var(--text-primary)', marginTop: 14, marginBottom: 16 }}>
              ORBIT-I <span className="gradient-text-blue">Tech Blog & Articles</span>
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              In-depth articles covering modern full-stack systems, autonomous AI agents, cloud architectures, and digital transformation across Pakistan and international tech markets.
            </p>
          </div>
        </section>

        <section style={{ padding: '0 0 80px' }}>
          <div className="container" style={{ maxWidth: 1000 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {blogPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                  <TiltCard style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 20,
                    padding: 32,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                    transition: 'border-color 0.2s, transform 0.2s',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                      <span style={{ fontSize: 11, padding: '4px 10px', background: 'var(--accent-glow)', border: '1px solid var(--border-hover)', borderRadius: 100, color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase' }}>
                        {post.category}
                      </span>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {post.date} · {post.readTime}
                      </div>
                    </div>

                    <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                      {post.title}
                    </h2>

                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                      {post.summary}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 14, marginTop: 4 }}>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>By {post.author}</span>
                      <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>Read Article →</span>
                    </div>
                  </TiltCard>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
