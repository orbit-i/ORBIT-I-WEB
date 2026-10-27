'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Download,
  Share2,
  Copy,
  Check,
  ExternalLink,
  FileText,
  Clock,
  Calendar,
  User,
  ArrowLeft,
  Sparkles,
  Video,
} from 'lucide-react'

export default function BlogPostClient({ post }) {
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://orbit-i.tech/blog/${post.slug}`

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const downloadableFiles = Array.isArray(post.downloadable_files) ? post.downloadable_files : []

  return (
    <>
      <style>{`
        .article-body {
          font-size: 16px;
          line-height: 1.85;
          color: var(--text-secondary);
        }
        .article-body h1 { font-family: 'Space Grotesk', sans-serif; font-size: 28px; font-weight: 800; color: var(--text-primary); margin: 40px 0 16px; }
        .article-body h2 { font-family: 'Space Grotesk', sans-serif; font-size: 24px; font-weight: 700; color: var(--text-primary); margin: 36px 0 16px; border-bottom: 1px solid var(--border); padding-bottom: 8px; }
        .article-body h3 { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 600; color: var(--text-primary); margin: 28px 0 12px; }
        .article-body h4 { font-family: 'Space Grotesk', sans-serif; font-size: 17px; font-weight: 600; color: var(--text-primary); margin: 22px 0 10px; }
        .article-body p { margin-bottom: 20px; }
        .article-body ul, .article-body ol { padding-left: 24px; margin-bottom: 22px; }
        .article-body li { margin-bottom: 8px; }
        .article-body blockquote {
          border-left: 3px solid var(--accent);
          padding: 14px 22px;
          margin: 30px 0;
          font-style: italic;
          color: var(--text-primary);
          background: var(--accent-glow);
          border-radius: 0 12px 12px 0;
        }
        .article-body code {
          background: var(--bg-elevated);
          padding: 3px 7px;
          border-radius: 6px;
          font-size: 13.5px;
          color: var(--accent);
          font-family: monospace;
          border: 1px solid var(--border);
        }
        .article-body pre {
          background: #090d16;
          padding: 18px 22px;
          border-radius: 14px;
          overflow-x: auto;
          margin: 26px 0;
          border: 1px solid var(--border);
        }
        .article-body pre code {
          background: transparent;
          border: none;
          padding: 0;
          color: #e2e8f0;
        }
        .article-body img {
          max-width: 100%;
          height: auto;
          border-radius: 14px;
          margin: 24px 0;
          border: 1px solid var(--border);
        }
        .share-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.15s;
          border: 1px solid var(--border);
          background: var(--bg-elevated);
          color: var(--text-secondary);
        }
        .share-btn:hover {
          color: #fff;
          border-color: var(--accent);
          background: var(--accent);
        }
      `}</style>

      <article
        style={{
          maxWidth: 880,
          margin: '0 auto',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 24,
          padding: '42px 36px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        }}
      >
        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 10 }}>
          <Link
            href="/blog"
            style={{
              fontSize: 13,
              color: 'var(--accent)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={14} /> Back to Publications
          </Link>
          <span
            style={{
              fontSize: 11,
              padding: '3px 10px',
              borderRadius: 6,
              background: 'var(--accent-glow)',
              color: 'var(--accent)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              border: '1px solid var(--border-hover)',
            }}
          >
            {post.category || 'Artificial Intelligence'}
          </span>
        </div>

        {/* Title & Metadata */}
        <div style={{ marginBottom: 28, borderBottom: '1px solid var(--border)', paddingBottom: 24 }}>
          <h1
            style={{
              fontFamily: 'Space Grotesk',
              fontSize: 'clamp(28px, 4.5vw, 42px)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              lineHeight: 1.25,
              marginBottom: 16,
            }}
          >
            {post.title}
          </h1>

          {post.excerpt && (
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 20 }}>
              {post.excerpt}
            </p>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 14,
              fontSize: 12,
              color: 'var(--text-muted)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--text-primary)', fontWeight: 600 }}>
                <User size={13} color="var(--accent)" /> {post.author}
              </span>
              <span>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <Clock size={13} /> {post.read_time || '5 min read'}
              </span>
              <span>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <Calendar size={13} />{' '}
                {new Date(post.created_at || Date.now()).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>

            {/* Social Share Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={handleCopyLink} className="share-btn" title="Copy Article URL">
                {copied ? <Check size={12} color="#22c55e" /> : <Copy size={12} />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${post.title} — Read on ORBIT-I: ${shareUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn"
                title="Share to WhatsApp"
              >
                <span>WhatsApp</span>
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn"
                title="Share to LinkedIn"
              >
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {post.featured_image && (
          <div style={{ marginBottom: 32, borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)' }}>
            <Image
              src={post.featured_image}
              alt={post.title}
              width={880}
              height={440}
              style={{ width: '100%', height: 'auto', display: 'block', maxHeight: 440, objectFit: 'cover' }}
              unoptimized
            />
          </div>
        )}

        {/* Embedded Featured Video */}
        {post.featured_video && (
          <div style={{ marginBottom: 32, borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', background: '#000' }}>
            {post.featured_video.includes('youtube.com') || post.featured_video.includes('youtu.be') ? (
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src={
                    post.featured_video.includes('watch?v=')
                      ? post.featured_video.replace('watch?v=', 'embed/')
                      : post.featured_video.includes('youtu.be/')
                      ? post.featured_video.replace('youtu.be/', 'www.youtube.com/embed/')
                      : post.featured_video
                  }
                  title="Article Video"
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : post.featured_video.endsWith('.mp4') ? (
              <video controls style={{ width: '100%', display: 'block', maxHeight: 460 }}>
                <source src={post.featured_video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : null}
          </div>
        )}

        {/* Article HTML Content */}
        <div className="article-body" dangerouslySetInnerHTML={{ __html: post.content }} />

        {/* ─── DOWNLOADABLE RESOURCES / WHITEPAPERS SECTION ─── */}
        {downloadableFiles.length > 0 && (
          <div
            style={{
              marginTop: 40,
              padding: '24px',
              borderRadius: 16,
              background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(56,189,248,0.05))',
              border: '1px solid var(--border-hover)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: 'var(--accent-glow)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Download size={18} color="var(--accent)" />
              </div>
              <div>
                <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Downloadable Materials & Artifacts
                </h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
                  Official architectural whitepapers, benchmark datasets, and technical documentation.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
              {downloadableFiles.map((f, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 10,
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    flexWrap: 'wrap',
                    gap: 10,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FileText size={18} color="#818cf8" />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                        {f.title || 'Technical Whitepaper (PDF)'}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {f.size || 'PDF Document'} {f.type ? `• ${f.type}` : ''}
                      </div>
                    </div>
                  </div>
                  <a
                    href={f.url || '#'}
                    download={f.title || 'document.pdf'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ fontSize: 12, padding: '7px 14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <Download size={13} />
                    <span>Download File</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAGS CLOUD: DOWNLOADABLE VS GENERAL TAGS ─── */}
        <div style={{ marginTop: 36, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
          {/* General Topic Tags */}
          {post.tags && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: post.downloadable_tags ? 12 : 0 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Topic Tags:</span>
              {post.tags.split(',').map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 11,
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    padding: '3px 10px',
                    borderRadius: 100,
                    color: 'var(--text-primary)',
                  }}
                >
                  #{t.trim()}
                </span>
              ))}
            </div>
          )}

          {/* Downloadable / Resource Tags */}
          {post.downloadable_tags && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#4ade80', fontWeight: 600 }}>Downloadable Tags:</span>
              {post.downloadable_tags.split(',').map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 11,
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    padding: '3px 10px',
                    borderRadius: 100,
                    color: '#4ade80',
                    fontWeight: 600,
                  }}
                >
                  📥 {t.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Author Bio Card & Regional Software Engineering Seal */}
        <div
          style={{
            marginTop: 40,
            padding: '22px',
            borderRadius: 16,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 14,
          }}
        >
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.06em' }}>
              Published by ORBIT-I Editorial
            </div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
              ORBIT-I Engineering & AI Research Labs
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              Offices: Nawabshah (Headquarters) & Karachi (Regional Branch). Remote engineering delivered nationwide & globally.
            </div>
          </div>
          <Link href="/contact" className="btn-outline" style={{ fontSize: 12, padding: '7px 14px' }}>
            Consult Our Architects →
          </Link>
        </div>
      </article>
    </>
  )
}
