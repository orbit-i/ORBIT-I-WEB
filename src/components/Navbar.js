'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import OrbitLogo from './OrbitLogo'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Sun, Moon, Search } from 'lucide-react'
import SearchModal from './SearchModal'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Services',
    href: '/services',
    dropdown: [
      { label: '✦ All Services Overview', href: '/services' },
      { label: 'Enterprise AI & ML', href: '/services/enterprise-ai-ml' },
      { label: 'Web Application Development', href: '/services/web-development' },
      { label: 'Mobile App Development', href: '/services/mobile-development' },
      { label: 'Custom Software Solutions', href: '/services/custom-software' },
      { label: 'UI/UX Design Systems', href: '/services/ui-ux-design' },
      { label: 'Cloud & DevOps Engineering', href: '/services/cloud-devops' },
      { label: 'Enterprise APIs & Integrations', href: '/services/enterprise-api' },
    ],
  },
  { label: 'Careers', href: '/careers' },
  {
    label: 'Blog',
    href: '/blog',
    dropdown: [
      { label: '✦ All Engineering Articles', href: '/blog' },
      { label: 'Artificial Intelligence', href: '/blog?category=Artificial+Intelligence' },
      { label: 'Web Engineering', href: '/blog?category=Web+Engineering' },
      { label: 'Cloud & DevOps', href: '/blog?category=Cloud+%26+DevOps' },
      { label: 'Cyber Security', href: '/blog?category=Cyber+Security' },
      { label: 'Data Science', href: '/blog?category=Data+Science' },
      { label: 'Regional Tech & Corridors', href: '/blog?category=Regional+Tech+%26+Sindh+Corridors' },
      { label: 'Enterprise Case Studies', href: '/blog?category=Enterprise+Case+Studies' },
    ],
  },
  { label: 'Team', href: '/team' },
  { label: 'Contact', href: '/contact' },
  { label: 'Client Portal', href: '/portal' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActive] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [theme, setTheme] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('orbit-theme') || 'dark' : 'dark'))
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('orbit-theme', next)
  }

  const go = (href) => {
    setMobileOpen(false)
    setActive(null)
    if (href.startsWith('#')) {
      if (pathname === '/') {
        setTimeout(() => {
          document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      } else {
        router.push('/' + href)
      }
    } else {
      router.push(href)
    }
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: 'flex',
          justifyContent: 'center',
          paddingTop: 14,
          pointerEvents: 'none',
        }}
      >
        <nav
          style={{
            pointerEvents: 'auto',
            width: 'calc(100% - 48px)',
            maxWidth: 1160,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            padding: scrolled ? '10px 22px' : '13px 26px',
            background: scrolled
              ? theme === 'dark' ? 'rgba(7,13,26,0.94)' : 'rgba(240,244,255,0.94)'
              : theme === 'dark' ? 'rgba(7,13,26,0.7)' : 'rgba(240,244,255,0.7)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--border-hover)',
            borderRadius: 100,
            boxShadow: scrolled ? '0 8px 32px rgba(7,13,26,0.4)' : 'none',
            transition: 'all 0.3s ease',
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
            <OrbitLogo size={38} showText={true} />
          </Link>

          {/* Desktop links */}
          <div className="nav-links">
            {navLinks.map((link) => (
              <div
                key={link.label}
                style={{ position: 'relative' }}
                onMouseEnter={() => link.dropdown && setActive(link.label)}
                onMouseLeave={() => setActive(null)}
              >
                <button
                  onClick={() => go(link.href)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '8px 12px',
                    background: pathname === link.href ? 'var(--accent-glow)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 13,
                    fontWeight: pathname === link.href ? 600 : 500,
                    color: pathname === link.href ? 'var(--text-primary)' : 'var(--text-secondary)',
                    borderRadius: 100,
                    transition: 'all 0.15s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--text-primary)'
                    e.currentTarget.style.background = 'var(--accent-glow)'
                  }}
                  onMouseLeave={(e) => {
                    if (pathname !== link.href) {
                      e.currentTarget.style.color = 'var(--text-secondary)'
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  {link.label}
                  {link.dropdown && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 4L5 7L8 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>

                <AnimatePresence>
                  {link.dropdown && activeDropdown === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.14 }}
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        marginTop: 8,
                        minWidth: 220,
                        padding: '8px 6px',
                        background: theme === 'dark' ? 'rgba(13,22,39,0.98)' : 'rgba(255,255,255,0.98)',
                        border: '1px solid var(--border-hover)',
                        borderRadius: 16,
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 16px 40px rgba(7,13,26,0.4)',
                        zIndex: 60,
                      }}
                    >
                      {link.dropdown.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => go(item.href)}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '10px 12px',
                            borderRadius: 10,
                            background: pathname === item.href ? 'var(--accent-glow)' : 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: 13,
                            fontWeight: pathname === item.href ? 600 : 500,
                            color: pathname === item.href ? 'var(--text-primary)' : 'var(--text-secondary)',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = 'var(--text-primary)'
                            e.currentTarget.style.background = 'var(--accent-glow)'
                          }}
                          onMouseLeave={(e) => {
                            if (pathname !== item.href) {
                              e.currentTarget.style.color = 'var(--text-secondary)'
                              e.currentTarget.style.background = 'transparent'
                            }
                          }}
                        >
                          {item.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {/* Search site button */}
            <button
              onClick={() => setSearchOpen(true)}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'var(--accent-glow)',
                border: '1px solid var(--border-hover)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              title="Search site (Ctrl+K)"
              aria-label="Search site"
            >
              <Search size={16} color="var(--text-secondary)" />
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'var(--accent-glow)',
                border: '1px solid var(--border-hover)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 15,
                transition: 'all 0.2s',
              }}
              title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
              aria-label="Toggle dark/light theme"
            >
              {theme === 'dark' ? <Sun size={17} color="#fbbf24" /> : <Moon size={17} color="#818cf8" />}
            </button>

            {/* CTA */}
            <button
              onClick={() => go('#contact')}
              className="nav-contact-btn btn-primary"
              style={{ padding: '9px 18px', fontSize: 13 }}
            >
              Contact Us
            </button>

            {/* Mobile hamburger - strictly hidden on desktop via responsive.css */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="nav-hamburger"
              aria-label="Toggle navigation menu"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 6,
                flexDirection: 'column',
                gap: 5,
              }}
            >
              <motion.span animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }} style={{ display: 'block', width: 20, height: 1.5, background: 'var(--text-primary)', transformOrigin: 'center', borderRadius: 2 }} />
              <motion.span animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }} style={{ display: 'block', width: 20, height: 1.5, background: 'var(--text-primary)', borderRadius: 2 }} />
              <motion.span animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }} style={{ display: 'block', width: 20, height: 1.5, background: 'var(--text-primary)', transformOrigin: 'center', borderRadius: 2 }} />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile drawer overlay menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              inset: 0,
              top: 0,
              zIndex: 40,
              paddingTop: 90,
              background: theme === 'dark' ? 'rgba(7,13,26,0.97)' : 'rgba(240,244,255,0.97)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderBottom: '1px solid var(--border-hover)',
              overflowY: 'auto',
            }}
          >
            <nav style={{ display: 'flex', flexDirection: 'column', padding: '0 24px 24px', gap: 4 }}>
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => go(link.href)}
                  style={{
                    textAlign: 'left',
                    padding: '14px 0',
                    borderBottom: '1px solid var(--border)',
                    background: 'transparent',
                    border: 'none',
                    borderBottomWidth: 1,
                    borderBottomStyle: 'solid',
                    borderBottomColor: 'var(--border)',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 16,
                    fontWeight: 500,
                    color: pathname === link.href ? 'var(--accent)' : 'var(--text-secondary)',
                  }}
                >
                  {link.label}
                </motion.button>
              ))}
              <button onClick={() => go('#contact')} className="btn-primary" style={{ marginTop: 16, justifyContent: 'center' }}>
                Contact Us
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
