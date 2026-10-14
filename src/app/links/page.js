'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

// ── All links data ────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    label: 'Website',
    links: [
      {
        title: 'orbit-i.tech',
        subtitle: 'Our official website',
        href: 'https://orbit-i.tech',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        ),
        color: '#3b82f6',
        badge: 'Official',
      },
      {
        title: 'Client Portal',
        subtitle: 'Track your project progress',
        href: 'https://orbit-i.tech/portal',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        ),
        color: '#818cf8',
      },
    ],
  },
  {
    label: 'Social Media',
    links: [
      {
        title: 'LinkedIn',
        subtitle: 'Professional updates & career opportunities',
        href: 'https://www.linkedin.com/company/orbit-i-private-limited/',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        ),
        color: '#0077b5',
      },
      {
        title: 'Facebook',
        subtitle: 'News, updates & community',
        href: 'https://www.facebook.com/orbitiprivatelimited',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        ),
        color: '#1877f2',
      },
      {
        title: 'Instagram',
        subtitle: 'Behind the scenes & team culture',
        href: 'https://www.instagram.com/orbiti_private_limited',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
          </svg>
        ),
        color: '#e4405f',
      },
      {
        title: 'TikTok',
        subtitle: 'Short videos & tech content',
        href: 'https://www.tiktok.com/@orbitiprivatelimited',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.14 8.14 0 0 0 4.77 1.52V6.75a4.85 4.85 0 0 1-1-.06z"/>
          </svg>
        ),
        color: '#ff0050',
      },
    ],
  },
  {
    label: 'Communication',
    links: [
      {
        title: 'WhatsApp Channel',
        subtitle: 'Announcements & updates',
        href: 'https://whatsapp.com/channel/0029Vb8I4kvJJhzUXqEnB50J',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
          </svg>
        ),
        color: '#25d366',
        badge: 'Channel',
      },
      {
        title: 'WhatsApp Chat',
        subtitle: 'Direct business enquiries',
        href: 'https://wa.me/923190375751',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
          </svg>
        ),
        color: '#25d366',
      },
      {
        title: 'Email Us',
        subtitle: 'contactus@orbit-i.tech',
        href: 'mailto:contactus@orbit-i.tech',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
        ),
        color: '#f59e0b',
      },
      {
        title: 'Call Us',
        subtitle: '+92 319 0375751',
        href: 'tel:+923190375751',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l.95-.95a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
        ),
        color: '#10b981',
      },
    ],
  },
  {
    label: 'Work With Us',
    links: [
      {
        title: 'Internship Program',
        subtitle: 'Apply for internship at ORBIT-I',
        href: 'https://orbit-i.tech/verify',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
        ),
        color: '#a78bfa',
      },
      {
        title: 'Start a Project',
        subtitle: 'Tell us about your idea',
        href: 'https://orbit-i.tech/#contact',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        ),
        color: '#3b82f6',
        badge: 'Hire Us',
      },
    ],
  },
]

// ── Individual link card ──────────────────────────────────────────────────────
function LinkCard({ link, index }) {
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  const handleClick = () => {
    setClicked(true)
    setTimeout(() => setClicked(false), 600)
  }

  return (
    <motion.a
      href={link.href}
      target={link.href.startsWith('http') ? '_blank' : undefined}
      rel="noopener noreferrer"
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.76, 0, 0.24, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 16px', borderRadius: 16, textDecoration: 'none',
        background: hovered ? 'var(--bg-elevated)' : 'var(--bg-card)',
        border: `1px solid ${hovered ? link.color + '40' : 'var(--border)'}`,
        transition: 'all 0.2s',
        transform: clicked ? 'scale(0.97)' : hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? `0 8px 32px ${link.color}18` : 'none',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* glow backdrop */}
      {hovered && (
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          background: `radial-gradient(ellipse at left, ${link.color}, transparent 70%)`,
          pointerEvents: 'none',
        }} />
      )}

      {/* icon */}
      <div style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        background: link.color + '18',
        border: `1px solid ${link.color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: link.color, transition: 'all 0.2s',
        transform: hovered ? 'scale(1.08)' : 'scale(1)',
      }}>
        {link.icon}
      </div>

      {/* text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontFamily: 'Space Grotesk', fontSize: 14, fontWeight: 700,
            color: hovered ? 'var(--text-primary)' : 'var(--text-primary)',
          }}>
            {link.title}
          </span>
          {link.badge && (
            <span style={{
              fontSize: 9, fontWeight: 700, padding: '2px 7px',
              borderRadius: 100, letterSpacing: '0.05em', textTransform: 'uppercase',
              background: link.color + '20', color: link.color, border: `1px solid ${link.color}30`,
            }}>
              {link.badge}
            </span>
          )}
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {link.subtitle}
        </p>
      </div>

      {/* arrow */}
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: hovered ? link.color : 'var(--text-muted)', flexShrink: 0, transition: 'all 0.2s', transform: hovered ? 'translate(2px, -2px)' : 'none' }}>
        <path d="M3 11L11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </motion.a>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LinksPage() {
  let cardIndex = 0

  return (
    <>
      <style>{`
        .links-page {
          min-height: 100vh;
          background: var(--bg);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 48px 20px 80px;
          position: relative;
          overflow: hidden;
        }
        .links-inner {
          width: 100%;
          max-width: 520px;
          display: flex;
          flex-direction: column;
          gap: 32px;
          position: relative;
          z-index: 1;
        }
        .section-label {
          font-size: 10px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 10px;
          padding-left: 4px;
        }
      `}</style>

      {/* ambient glow blobs */}
      <div style={{ position: 'fixed', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(59,130,246,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '10%', right: '-10%', width: 400, height: 400, background: 'radial-gradient(ellipse, rgba(129,140,248,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div className="links-page">
        <div className="links-inner">

          {/* ── Header / Profile card ── */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-hover)',
              borderRadius: 24, padding: '28px 24px', textAlign: 'center',
              position: 'relative', overflow: 'hidden',
            }}
          >
            {/* card glow */}
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 300, height: 200, background: 'radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

            {/* logo */}
            <div style={{ position: 'relative', display: 'inline-flex', marginBottom: 14 }}>
              <div style={{ width: 80, height: 80, borderRadius: 22, background: 'var(--bg-elevated)', border: '1px solid var(--border-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <Image src="/orbitlogo-removebg-preview.png" alt="ORBIT-I" width={56} height={56} style={{ objectFit: 'contain' }} />
              </div>
              {/* verified dot */}
              <div style={{ position: 'absolute', bottom: -2, right: -2, width: 22, height: 22, borderRadius: '50%', background: '#3b82f6', border: '2px solid var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6L5 8.5L9.5 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: 4 }}>
              ORBIT-I Private Limited
            </h1>
            <p style={{ fontSize: 13, color: 'var(--accent-light)', fontWeight: 600, marginBottom: 10 }}>
              Engineering Technology Company
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 380, margin: '0 auto 16px' }}>
              Delivering dependable software platforms, mobile apps & custom digital systems — Nawabshah, Sindh, Pakistan.
            </p>

            {/* tags */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              {['SECP Active', 'Est. 2024', 'Nawabshah', 'Pakistan'].map((t) => (
                <span key={t} style={{ fontSize: 10, padding: '3px 10px', background: 'var(--accent-glow)', border: '1px solid var(--border-hover)', borderRadius: 100, color: 'var(--accent-light)', fontWeight: 600 }}>
                  {t}
                </span>
              ))}
            </div>
          </motion.div>

          {/* ── Link sections ── */}
          {SECTIONS.map((section) => (
            <div key={section.label}>
              <p className="section-label">{section.label}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {section.links.map((link) => {
                  const i = cardIndex++
                  return <LinkCard key={link.title} link={link} index={i} />
                })}
              </div>
            </div>
          ))}

          {/* ── Footer ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            style={{ textAlign: 'center', paddingTop: 8 }}
          >
            <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, var(--border-hover), transparent)', marginBottom: 20 }} />
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              © 2026 ORBIT-I Private Limited · All rights reserved
            </p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, opacity: 0.6 }}>
              orbit-i.tech/links
            </p>
          </motion.div>

        </div>
      </div>
    </>
  )
}
