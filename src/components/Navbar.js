'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import OrbitLogo from './OrbitLogo'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Sun, Moon, Search, ChevronDown, ShieldCheck, ArrowRight, X, PhoneCall } from 'lucide-react'
import SearchModal from './SearchModal'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Services',
    href: '/services',
    dropdown: [
      { label: '✦ All Services Overview', href: '/services', desc: 'Complete enterprise engineering catalog' },
      { label: 'Enterprise AI & ML', href: '/services/enterprise-ai-ml', desc: 'Autonomous LLMs, RAG & agents' },
      { label: 'Web Application Development', href: '/services/web-development', desc: 'Next.js & React enterprise platforms' },
      { label: 'Mobile App Development', href: '/services/mobile-development', desc: 'Cross-platform iOS & Android apps' },
      { label: 'Custom Software & ERP', href: '/services/custom-software', desc: 'Tailored enterprise architectures' },
      { label: 'UI/UX Design Systems', href: '/services/ui-ux-design', desc: 'Figma-to-production design systems' },
      { label: 'Cloud & DevOps Engineering', href: '/services/cloud-devops', desc: 'AWS, Kubernetes & CI/CD pipelines' },
      { label: 'Enterprise APIs & Integrations', href: '/services/enterprise-api', desc: 'Secure high-throughput API gateways' },
    ],
  },
  { label: 'Careers', href: '/careers' },
  { label: 'Team', href: '/team' },
  { label: 'Locations', href: '/locations' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [activeDropdown, setActive] = useState(null)
  const [theme, setTheme] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('orbit-theme') || 'dark' : 'dark'))
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

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
      if (window.location.pathname === '/') {
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
      <header
        style={{
          position: 'static',
          width: '100%',
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
          zIndex: 50,
          color: '#0f172a',
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          {/* Clickable Brand Logo */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              flexShrink: 0,
            }}
            aria-label="ORBIT-I Home"
          >
            <OrbitLogo size={36} showText={true} />
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className="nav-links"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href))
              return (
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
                      gap: 5,
                      padding: '8px 12px',
                      background: isActive ? '#eff6ff' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 13,
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? '#2563eb' : '#334155',
                      borderRadius: 8,
                      transition: 'all 0.15s ease',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = '#2563eb'
                        e.currentTarget.style.background = '#f8fafc'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = '#334155'
                        e.currentTarget.style.background = 'transparent'
                      }
                    }}
                  >
                    {link.label}
                    {link.dropdown && (
                      <ChevronDown
                        size={13}
                        style={{
                          transform: activeDropdown === link.label ? 'rotate(180deg)' : 'rotate(0)',
                          transition: 'transform 0.2s',
                          color: '#64748b',
                        }}
                      />
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {link.dropdown && activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          marginTop: 6,
                          width: 320,
                          padding: '8px 6px',
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: 14,
                          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(0,0,0,0.04)',
                          zIndex: 100,
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
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              fontFamily: 'Inter, sans-serif',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 2,
                              transition: 'all 0.15s',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#f0f7ff'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent'
                            }}
                          >
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: '#0f172a',
                              }}
                            >
                              {item.label}
                            </span>
                            {item.desc && (
                              <span style={{ fontSize: 11, color: '#64748b' }}>
                                {item.desc}
                              </span>
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </nav>

          {/* Right Action Icons & Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            {/* Search Icon Button */}
            <button
              onClick={() => setSearchOpen(true)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#334155',
                transition: 'all 0.2s ease',
              }}
              title="Search Website (Press to open)"
              aria-label="Open Search"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6'
                e.currentTarget.style.color = '#2563eb'
                e.currentTarget.style.background = '#eff6ff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0'
                e.currentTarget.style.color = '#334155'
                e.currentTarget.style.background = '#f8fafc'
              }}
            >
              <Search size={16} />
            </button>

            {/* Portal Link */}
            <Link
              href="/portal"
              style={{
                display: 'none',
                alignItems: 'center',
                gap: 5,
                padding: '8px 12px',
                borderRadius: 8,
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                color: '#0f172a',
                fontSize: 12,
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.15s',
              }}
              className="lg:flex"
            >
              <ShieldCheck size={14} color="#2563eb" />
              <span>Portal</span>
            </Link>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#334155',
                transition: 'all 0.2s ease',
              }}
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle site theme"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#cbd5e1'
                e.currentTarget.style.background = '#f1f5f9'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0'
                e.currentTarget.style.background = '#f8fafc'
              }}
            >
              {theme === 'dark' ? <Sun size={16} color="#d97706" /> : <Moon size={16} color="#4f46e5" />}
            </button>

            {/* Contact Us CTA Button */}
            <Link
              href="/contact"
              className="nav-contact-btn"
              style={{
                display: 'none',
                alignItems: 'center',
                gap: 6,
                padding: '9px 18px',
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 100,
                background: '#2563eb',
                color: '#ffffff',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#1d4ed8'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#2563eb'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <span>Contact Us</span>
              <ArrowRight size={13} />
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="nav-hamburger"
              aria-label="Toggle Navigation Menu"
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                cursor: 'pointer',
                width: 38,
                height: 38,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <span
                style={{
                  display: 'block',
                  width: 18,
                  height: 2,
                  background: '#0f172a',
                  borderRadius: 2,
                  transform: mobileOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none',
                  transition: 'transform 0.2s ease',
                }}
              />
              <span
                style={{
                  display: 'block',
                  width: 18,
                  height: 2,
                  background: '#0f172a',
                  borderRadius: 2,
                  opacity: mobileOpen ? 0 : 1,
                  transition: 'opacity 0.2s ease',
                }}
              />
              <span
                style={{
                  display: 'block',
                  width: 18,
                  height: 2,
                  background: '#0f172a',
                  borderRadius: 2,
                  transform: mobileOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none',
                  transition: 'transform 0.2s ease',
                }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              background: '#ffffff',
              borderBottom: '2px solid #e2e8f0',
              boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              zIndex: 49,
            }}
          >
            <nav style={{ display: 'flex', flexDirection: 'column', padding: '16px 20px 24px', gap: 6 }}>
              {navLinks.map((link) => (
                <div key={link.label}>
                  <button
                    onClick={() => go(link.href)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '12px 14px',
                      borderRadius: 10,
                      background: pathname === link.href ? '#eff6ff' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 15,
                      fontWeight: pathname === link.href ? 700 : 500,
                      color: pathname === link.href ? '#2563eb' : '#0f172a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{link.label}</span>
                    <ArrowRight size={14} color="#94a3b8" />
                  </button>
                </div>
              ))}

              <div style={{ marginTop: 12, paddingTop: 14, borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link
                  href="/portal"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '12px',
                    borderRadius: 12,
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    color: '#0f172a',
                    fontWeight: 600,
                    textDecoration: 'none',
                    fontSize: 14,
                  }}
                >
                  <ShieldCheck size={16} color="#2563eb" />
                  <span>Client & Project Portal</span>
                </Link>

                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '12px',
                    borderRadius: 12,
                    background: '#2563eb',
                    color: '#ffffff',
                    fontWeight: 600,
                    textDecoration: 'none',
                    fontSize: 14,
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                  }}
                >
                  <span>Contact Engineering Lead</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Interactive Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
