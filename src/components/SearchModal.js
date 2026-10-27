'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Search, X, ArrowRight, Sparkles, Briefcase, MapPin, Shield, FileCheck, Layers, ExternalLink } from 'lucide-react'

const searchDatabase = [
  // Services
  {
    title: 'Enterprise AI & Machine Learning Solutions',
    category: 'Service',
    href: '/services/enterprise-ai-ml',
    desc: 'Custom LLMs, autonomous operational agents, enterprise RAG, and predictive intelligence.',
    icon: <Sparkles size={16} color="#3b82f6" />,
    keywords: ['ai', 'ml', 'machine learning', 'rag', 'langchain', 'llm', 'agents', 'artificial intelligence', 'python'],
  },
  {
    title: 'Enterprise Web Application Development',
    category: 'Service',
    href: '/services/web-development',
    desc: 'High-performance React & Next.js web applications, portals, and SaaS platforms.',
    icon: <Layers size={16} color="#3b82f6" />,
    keywords: ['web', 'next.js', 'react', 'frontend', 'fullstack', 'saas', 'portal', 'website'],
  },
  {
    title: 'Mobile App Development (iOS & Android)',
    category: 'Service',
    href: '/services/mobile-development',
    desc: 'Cross-platform React Native & Flutter mobile apps with native speed and offline sync.',
    icon: <Layers size={16} color="#3b82f6" />,
    keywords: ['mobile', 'app', 'ios', 'android', 'react native', 'flutter', 'smartphone'],
  },
  {
    title: 'Custom Software Solutions & ERP Systems',
    category: 'Service',
    href: '/services/custom-software',
    desc: 'Tailored enterprise software, automated inventory systems, and business process automation.',
    icon: <Layers size={16} color="#3b82f6" />,
    keywords: ['erp', 'custom software', 'business automation', 'crm', 'enterprise software'],
  },
  {
    title: 'UI/UX Design Systems & Design Engineering',
    category: 'Service',
    href: '/services/ui-ux-design',
    desc: 'Figma-to-code design systems, accessibility-first interfaces, and rapid prototyping.',
    icon: <Layers size={16} color="#3b82f6" />,
    keywords: ['ui', 'ux', 'design', 'figma', 'prototype', 'wireframe', 'tailwind'],
  },
  {
    title: 'Cloud & DevOps Engineering',
    category: 'Service',
    href: '/services/cloud-devops',
    desc: 'AWS, GCP, Docker, Kubernetes, CI/CD pipelines, and high-availability infrastructure.',
    icon: <Layers size={16} color="#3b82f6" />,
    keywords: ['cloud', 'devops', 'aws', 'docker', 'kubernetes', 'ci/cd', 'deployment', 'infrastructure'],
  },
  {
    title: 'Enterprise APIs & Integrations',
    category: 'Service',
    href: '/services/enterprise-api',
    desc: 'RESTful and GraphQL API gateways, payment gateways, and third-party systems integration.',
    icon: <Layers size={16} color="#3b82f6" />,
    keywords: ['api', 'integration', 'graphql', 'rest', 'payment', 'microservices'],
  },

  // Company Pages
  {
    title: 'About ORBIT-I Private Limited',
    category: 'Company',
    href: '/about',
    desc: 'SECP registered technology enterprise headquartered in Nawabshah with regional branch in Karachi.',
    icon: <Shield size={16} color="#10b981" />,
    keywords: ['about', 'company', 'secp', 'nawabshah', 'karachi', 'history', 'incorporation'],
  },
  {
    title: 'Executive Leadership & Engineering Team',
    category: 'Company',
    href: '/team',
    desc: 'Meet our founders, architects, software engineers, and AI research specialists.',
    icon: <Briefcase size={16} color="#10b981" />,
    keywords: ['team', 'leadership', 'founders', 'engineers', 'staff', 'directors'],
  },
  {
    title: 'Corporate Offices & Regional Hubs',
    category: 'Company',
    href: '/locations',
    desc: 'Nawabshah Corporate HQ and Karachi Regional Branch.',
    icon: <MapPin size={16} color="#10b981" />,
    keywords: ['location', 'office', 'nawabshah', 'karachi', 'address', 'visit'],
  },
  {
    title: 'Careers & Engineering Internships',
    category: 'Careers',
    href: '/careers',
    desc: 'Explore open engineering positions, software fellowships, and internship opportunities.',
    icon: <Briefcase size={16} color="#f59e0b" />,
    keywords: ['career', 'jobs', 'internship', 'hiring', 'work', 'apply', 'cv'],
  },
  {
    title: 'Verify Internship Certificate',
    category: 'Tools',
    href: '/verify',
    desc: 'Cryptographically verify official ORBIT-I certificates of completion and internships.',
    icon: <FileCheck size={16} color="#8b5cf6" />,
    keywords: ['verify', 'certificate', 'verification', 'credential', 'internship letter', 'check'],
  },
  {
    title: 'Client Portal Login',
    category: 'Tools',
    href: '/portal',
    desc: 'Access real-time project milestone tracking, deliverables, and enterprise communication.',
    icon: <Shield size={16} color="#8b5cf6" />,
    keywords: ['portal', 'client login', 'dashboard', 'progress', 'signin', 'account'],
  },
  {
    title: 'Technical Blog & Engineering Insights',
    category: 'Resources',
    href: '/blog',
    desc: 'Deep dives on autonomous AI agents, enterprise software architecture, and Next.js best practices.',
    icon: <ExternalLink size={16} color="#06b6d4" />,
    keywords: ['blog', 'articles', 'tutorials', 'insights', 'news'],
  },
  {
    title: 'Contact Engineering & Sales',
    category: 'Contact',
    href: '/contact',
    desc: 'Connect with technical leads in Nawabshah (+92 319 0375751) or email contactus@orbit-i.tech.',
    icon: <MapPin size={16} color="#ef4444" />,
    keywords: ['contact', 'email', 'phone', 'call', 'whatsapp', 'inquiry', 'quote', 'support'],
  },
]

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 60)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setQuery('')
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const filteredResults = searchDatabase.filter((item) => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory
    if (!matchesCat) return false
    if (!query.trim()) return true
    const q = query.toLowerCase()
    return (
      item.title.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.keywords.some((k) => k.includes(q))
    )
  })

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search ORBIT-I Website"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: 'clamp(40px, 10vh, 100px)',
          paddingLeft: 16,
          paddingRight: 16,
          paddingBottom: 24,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2 }}
          style={{
            width: '100%',
            maxWidth: 640,
            background: '#ffffff',
            borderRadius: 20,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '80vh',
          }}
        >
          {/* Header Search Input */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '16px 20px',
              borderBottom: '1px solid #e2e8f0',
              background: '#f8fafc',
            }}
          >
            <Search size={20} color="#64748b" style={{ flexShrink: 0 }} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search services, careers, team, offices, verification..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: 15,
                color: '#0f172a',
                fontFamily: 'Inter, sans-serif',
              }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Clear search"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4,
                  color: '#94a3b8',
                }}
              >
                <X size={16} />
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close search"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 28,
                height: 28,
                borderRadius: 8,
                background: '#e2e8f0',
                border: 'none',
                cursor: 'pointer',
                color: '#475569',
              }}
            >
              <X size={15} />
            </button>
          </div>

          {/* Category Filter Chips */}
          <div
            style={{
              display: 'flex',
              gap: 6,
              padding: '10px 18px',
              borderBottom: '1px solid #f1f5f9',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              background: '#ffffff',
            }}
          >
            {['All', 'Service', 'Company', 'Careers', 'Tools'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  fontSize: 12,
                  padding: '4px 12px',
                  borderRadius: 100,
                  border: '1px solid',
                  borderColor: activeCategory === cat ? '#3b82f6' : '#e2e8f0',
                  background: activeCategory === cat ? '#eff6ff' : '#ffffff',
                  color: activeCategory === cat ? '#2563eb' : '#64748b',
                  fontWeight: activeCategory === cat ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results List */}
          <div
            style={{
              padding: '12px 14px',
              overflowY: 'auto',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            {filteredResults.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 16px', color: '#64748b' }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                  No matching results found
                </p>
                <p style={{ fontSize: 13 }}>
                  Try searching for &quot;AI&quot;, &quot;Web&quot;, &quot;Careers&quot;, &quot;Nawabshah&quot;, or &quot;Verify&quot;.
                </p>
              </div>
            ) : (
              filteredResults.map((item) => (
                <Link
                  key={item.href + item.title}
                  href={item.href}
                  onClick={onClose}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 14px',
                    borderRadius: 12,
                    textDecoration: 'none',
                    background: 'transparent',
                    border: '1px solid transparent',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f8fafc'
                    e.currentTarget.style.borderColor = '#e2e8f0'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.borderColor = 'transparent'
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <span
                        style={{
                          fontFamily: 'Space Grotesk, sans-serif',
                          fontSize: 14,
                          fontWeight: 700,
                          color: '#0f172a',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.title}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          padding: '2px 8px',
                          borderRadius: 100,
                          background: '#f1f5f9',
                          color: '#64748b',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                        }}
                      >
                        {item.category}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: 12,
                        color: '#64748b',
                        margin: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                  <ArrowRight size={15} color="#94a3b8" style={{ flexShrink: 0 }} />
                </Link>
              ))
            )}
          </div>

          {/* Footer Quick Action */}
          <div
            style={{
              padding: '12px 20px',
              borderTop: '1px solid #f1f5f9',
              background: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 12,
              color: '#64748b',
            }}
          >
            <span>
              Press <kbd style={{ padding: '2px 6px', background: '#e2e8f0', borderRadius: 4, fontSize: 11 }}>ESC</kbd> to exit
            </span>
            <Link
              href="/contact"
              onClick={onClose}
              style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}
            >
              Contact Engineering Lead →
            </Link>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
