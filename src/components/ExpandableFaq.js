'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle, Clock } from 'lucide-react'

export default function ExpandableFaq({
  faqs = [],
  title = 'Frequently Asked Questions',
  subtitle = 'Find answers to common questions about our architecture, delivery, and governance.',
  showLastUpdated = true,
  lastUpdatedDate = 'October 2026',
}) {
  const [openIndex, setOpenIndex] = useState(0)

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i)
  }

  if (!faqs || faqs.length === 0) return null

  return (
    <div style={{ marginTop: 40, width: '100%' }}>
      {/* FAQ Header & Last Updated Badge */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          marginBottom: 28,
          textAlign: 'center',
        }}
      >
        {showLastUpdated && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 12px',
              borderRadius: 100,
              background: 'var(--accent-glow)',
              border: '1px solid var(--border-hover)',
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--accent-light)',
            }}
          >
            <Clock size={12} />
            <span>Last Updated: {lastUpdatedDate}</span>
          </div>
        )}

        <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          {title}
        </h2>
        {subtitle && (
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 560, lineHeight: 1.6, margin: 0 }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Accordion list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i
          return (
            <div
              key={i}
              style={{
                background: 'var(--bg-card)',
                border: `1px solid ${isOpen ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 16,
                overflow: 'hidden',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                boxShadow: isOpen ? '0 8px 24px var(--card-shadow)' : 'none',
              }}
            >
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${i}`}
                style={{
                  width: '100%',
                  padding: '18px 22px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <HelpCircle size={16} color="var(--accent)" style={{ flexShrink: 0 }} />
                  <span
                    style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: 15,
                      fontWeight: 700,
                      color: isOpen ? 'var(--accent-light)' : 'var(--text-primary)',
                      lineHeight: 1.4,
                    }}
                  >
                    {faq.q}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ flexShrink: 0, color: 'var(--text-muted)' }}
                >
                  <ChevronDown size={18} />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-answer-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div
                      style={{
                        padding: '0 22px 20px 50px',
                        fontSize: 14,
                        color: 'var(--text-secondary)',
                        lineHeight: 1.75,
                        borderTop: '1px solid var(--separator)',
                        paddingTop: 14,
                      }}
                    >
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
