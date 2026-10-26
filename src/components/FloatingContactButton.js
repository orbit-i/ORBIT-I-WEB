'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Phone, MessageSquare, Mail, X, ArrowRight, Sparkles } from 'lucide-react'

export default function FloatingContactButton() {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="print-hidden"
      style={{
        position: 'fixed',
        bottom: 24,
        left: 24,
        zIndex: 9999,
      }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              bottom: 68,
              left: 0,
              width: 260,
              background: '#ffffff',
              borderRadius: 16,
              boxShadow: '0 20px 40px rgba(15, 23, 42, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.08)',
              padding: '12px 10px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              zIndex: 100,
            }}
          >
            <div style={{ padding: '4px 8px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Direct Contact
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close contact menu"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', padding: 2 }}
              >
                <X size={14} />
              </button>
            </div>

            {/* WhatsApp */}
            <a
              href="https://wa.me/923190375751"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 10px',
                borderRadius: 10,
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                color: '#15803d',
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 600,
                transition: 'all 0.15s',
              }}
            >
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#22c55e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MessageSquare size={14} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', lineHeight: 1.2 }}>WhatsApp Chat</span>
                <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 500 }}>Instant Response</span>
              </div>
            </a>

            {/* Phone Call */}
            <a
              href="tel:+923190375751"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 10px',
                borderRadius: 10,
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                color: '#1d4ed8',
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 600,
                transition: 'all 0.15s',
              }}
            >
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Phone size={14} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', lineHeight: 1.2 }}>Voice Call</span>
                <span style={{ fontSize: 11, color: '#2563eb', fontWeight: 500 }}>+92 319 0375751</span>
              </div>
            </a>

            {/* Email */}
            <a
              href="mailto:contactus@orbit-i.tech"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 10px',
                borderRadius: 10,
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                color: '#334155',
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 600,
                transition: 'all 0.15s',
              }}
            >
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#64748b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Mail size={14} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', lineHeight: 1.2 }}>Email Inquiry</span>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>contactus@orbit-i.tech</span>
              </div>
            </a>

            {/* Contact Page */}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '8px',
                borderRadius: 8,
                background: '#2563eb',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <span>Open Inquiry Form</span>
              <ArrowRight size={13} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Launcher Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        aria-label="Contact options"
        title="Direct Contact Options"
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #2563eb, #10b981)',
          color: '#ffffff',
          border: '2px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35), 0 0 16px rgba(16, 185, 129, 0.3)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
        }}
      >
        {open ? <X size={22} /> : <Phone size={22} />}
      </motion.button>
    </div>
  )
}
