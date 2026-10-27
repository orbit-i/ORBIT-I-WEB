'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Tag, Download, BookOpen, Clock, Calendar, ArrowRight, Sparkles } from 'lucide-react'

export default function BlogListingClient({ initialPosts = [], categories = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const categoryList = useMemo(() => {
    const defaultCats = ['ALL', 'Artificial Intelligence', 'Web Engineering', 'Cloud & DevOps', 'Cyber Security', 'Regional Tech & Sindh Hubs', 'Data Science']
    const dynamicCats = categories.map((c) => c.name)
    const combined = Array.from(new Set([...defaultCats, ...dynamicCats]))
    return combined
  }, [categories])

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const matchesCat =
        selectedCategory === 'ALL' ||
        (post.category || '').toLowerCase() === selectedCategory.toLowerCase()

      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        (post.title || '').toLowerCase().includes(q) ||
        (post.excerpt || '').toLowerCase().includes(q) ||
        (post.tags || '').toLowerCase().includes(q) ||
        (post.author || '').toLowerCase().includes(q)

      return matchesCat && matchesSearch
    })
  }, [initialPosts, selectedCategory, searchQuery])

  return (
    <div>
      {/* Search & Filter Header Bar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          marginBottom: 36,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          padding: '20px 24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: 1, minWidth: 260, maxWidth: 440 }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              placeholder="Search technical insights, AI agents, architecture..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 16px 11px 38px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                color: 'var(--text-primary)',
                fontSize: 13,
                outline: 'none',
              }}
            />
          </div>

          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Showing <strong style={{ color: 'var(--accent)' }}>{filteredPosts.length}</strong> of{' '}
            {initialPosts.length} Articles
          </div>
        </div>

        {/* Category Pills */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            paddingBottom: 4,
            scrollbarWidth: 'none',
          }}
        >
          {categoryList.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase()
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  fontSize: 12,
                  padding: '7px 14px',
                  borderRadius: 100,
                  border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border)',
                  background: isSelected ? 'var(--accent-glow)' : 'var(--bg-elevated)',
                  color: isSelected ? 'var(--accent-light)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: isSelected ? 700 : 500,
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                }}
              >
                {cat === 'ALL' ? '✦ All Categories' : cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* Articles Grid */}
      {filteredPosts.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 20,
          }}
        >
          <BookOpen size={40} color="var(--accent)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 18, color: 'var(--text-primary)', marginBottom: 8 }}>
            No Articles Found
          </h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 450, margin: '0 auto 16px' }}>
            No publications matched your search query. Try another keyword or explore all categories.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('ALL')
              setSearchQuery('')
            }}
            className="btn-outline"
            style={{ fontSize: 13 }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 26 }}>
          {filteredPosts.map((post) => {
            const hasDownloads =
              (Array.isArray(post.downloadable_files) && post.downloadable_files.length > 0) ||
              Boolean(post.downloadable_tags)

            return (
              <article
                key={post.id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 20,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-hover)'
                  e.currentTarget.style.transform = 'translateY(-3px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {/* Featured Image */}
                <div style={{ height: 190, background: '#090d16', overflow: 'hidden', position: 'relative' }}>
                  {post.featured_image ? (
                    <Image
                      src={post.featured_image}
                      alt={post.title}
                      width={500}
                      height={200}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      unoptimized
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        background: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.25), transparent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Sparkles size={32} color="var(--accent)" />
                    </div>
                  )}

                  {/* Category Pill Over Image */}
                  <div style={{ position: 'absolute', top: 12, left: 12 }}>
                    <span
                      style={{
                        fontSize: 10,
                        padding: '3px 9px',
                        borderRadius: 6,
                        background: 'rgba(15, 23, 42, 0.85)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid var(--border-hover)',
                        color: 'var(--accent-light)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {post.category}
                    </span>
                  </div>

                  {/* Downloadable Resources Indicator */}
                  {hasDownloads && (
                    <div style={{ position: 'absolute', top: 12, right: 12 }}>
                      <span
                        style={{
                          fontSize: 10,
                          padding: '3px 8px',
                          borderRadius: 6,
                          background: 'rgba(34, 197, 94, 0.2)',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(34, 197, 94, 0.4)',
                          color: '#4ade80',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <Download size={11} /> PDF Available
                      </span>
                    </div>
                  )}
                </div>

                {/* Article Content */}
                <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, fontSize: 11, color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} /> {post.read_time || '5 min read'}
                    </span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={12} />{' '}
                      {new Date(post.created_at || Date.now()).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10, lineHeight: 1.35 }}>
                    <Link href={`/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {post.title}
                    </Link>
                  </h2>

                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16, flex: 1 }}>
                    {post.excerpt}
                  </p>

                  {/* Tags Preview */}
                  {post.tags && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                      {post.tags.split(',').slice(0, 3).map((t) => (
                        <span
                          key={t}
                          style={{
                            fontSize: 10,
                            padding: '2px 7px',
                            borderRadius: 4,
                            background: 'var(--bg-elevated)',
                            color: 'var(--text-muted)',
                            border: '1px solid var(--border)',
                          }}
                        >
                          #{t.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer Meta */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: 12,
                      borderTop: '1px solid var(--border)',
                      fontSize: 12,
                    }}
                  >
                    <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{post.author}</span>
                    <Link
                      href={`/blog/${post.slug}`}
                      style={{
                        color: 'var(--accent)',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <span>Read Insight</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
