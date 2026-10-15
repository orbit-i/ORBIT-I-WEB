'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Megaphone, X, ArrowRight, Sparkles, AlertCircle } from 'lucide-react'

const BADGE_STYLES = {
  HIRING: { bg: 'rgba(99, 102, 241, 0.2)', border: 'rgba(99, 102, 241, 0.4)', text: '#a5b4fc', label: 'WE ARE HIRING' },
  UPDATE: { bg: 'rgba(34, 197, 94, 0.2)', border: 'rgba(34, 197, 94, 0.4)', text: '#86efac', label: 'ANNOUNCEMENT' },
  WARNING: { bg: 'rgba(245, 158, 11, 0.2)', border: 'rgba(245, 158, 11, 0.4)', text: '#fde047', label: 'NOTICE' },
  INFO: { bg: 'rgba(59, 130, 246, 0.2)', border: 'rgba(59, 130, 246, 0.4)', text: '#93c5fd', label: 'INFO' },
}

export default function SiteNoticeBar() {
  const [notice, setNotice] = useState(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('orbit_notice_dismissed')) {
      setDismissed(true)
      return
    }

    fetch('/api/notice')
      .then((r) => r.json())
      .then((data) => {
        if (data && data.enabled && data.message) {
          setNotice(data)
        }
      })
      .catch(() => {})
  }, [])

  if (!notice || dismissed) return null

  const badge = BADGE_STYLES[notice.type] || BADGE_STYLES.INFO

  const handleDismiss = () => {
    setDismissed(true)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('orbit_notice_dismissed', '1')
    }
  }

  return (
    <div
      style={{
        background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.98), rgba(30, 27, 75, 0.98), rgba(15, 23, 42, 0.98))',
        borderBottom: '1px solid rgba(99, 102, 241, 0.3)',
        padding: '8px 16px',
        position: 'relative',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        color: '#e2e8f0',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        <span
          style={{
            fontSize: 10,
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: 100,
            background: badge.bg,
            border: `1px solid ${badge.border}`,
            color: badge.text,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <Sparkles size={10} />
          {badge.label}
        </span>
        <span style={{ fontWeight: 500 }}>{notice.message}</span>
        {notice.link_url && (
          <Link
            href={notice.link_url}
            style={{
              color: '#a5b4fc',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
              marginLeft: 4,
            }}
          >
            <span>{notice.link_text || 'Learn More'}</span>
            <ArrowRight size={11} />
          </Link>
        )}
      </div>

      <button
        onClick={handleDismiss}
        aria-label="Dismiss notice"
        style={{
          position: 'absolute',
          right: 14,
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          color: '#94a3b8',
          cursor: 'pointer',
          padding: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <X size={14} />
      </button>
    </div>
  )
}
