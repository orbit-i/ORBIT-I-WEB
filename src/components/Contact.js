'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import TiltCard from './TiltCard'
import { submitContact } from '@/lib/orbitApi'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, delay, ease: [0.76, 0, 0.24, 1] },
})

const contactInfo = [
  { icon: '✉', label: 'Email', value: 'contactus@orbit-i.tech', href: 'mailto:contactus@orbit-i.tech' },
  { icon: '☎', label: 'Phone', value: '+92 319 0375751', href: 'tel:+923190375751' },
  { icon: '◎', label: 'Head Office', value: 'Nawabshah, Sindh, Pakistan', href: null },
  { icon: '◈', label: 'WhatsApp', value: 'Chat with us directly', href: 'https://wa.me/923190375751' },
]

const serviceOptions = [
  'Enterprise AI & ML Solutions', 'Web Application Development',
  'Mobile Application Development', 'Custom Software Solutions',
  'UI/UX Design Systems', 'Cloud & DevOps Engineering',
  'Enterprise API & Integrations', 'Other',
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', company: '', service: '', message: '' })
  const [status, setStatus] = useState('idle')
  const [focused, setFocused] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      await submitContact(form)
      setStatus('success')
      setForm({ name: '', email: '', company: '', service: '', message: '' })
    } catch (err) {
      setStatus('error')
      // Reset to idle after 3 seconds so user can try again
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const inputStyle = (field) => ({
    width: '100%', padding: '12px 14px',
    background: focused === field ? 'var(--bg-hover)' : 'var(--bg-elevated)',
    border: `1px solid ${focused === field ? 'var(--accent)' : 'var(--border)'}`,
    borderRadius: 12, color: 'var(--text-primary)',
    fontSize: 14, fontFamily: 'Inter', outline: 'none',
    transition: 'all 0.2s',
    boxShadow: focused === field ? '0 0 0 3px var(--accent-glow)' : 'none',
  })

  return (
    <section id="contact" style={{ paddingTop: 80, paddingBottom: 80, background: 'var(--bg)' }}>
      <div className="container">
        {/* CTA Banner */}
        <motion.div {...fadeUp(0)} style={{ marginBottom: 56 }}>
          <TiltCard style={{
            borderRadius: 20, padding: '40px 28px', textAlign: 'center',
            background: 'var(--bg-card)', border: '1px solid var(--border-hover)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 250, background: 'radial-gradient(ellipse, var(--accent-glow) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
              <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(22px, 4vw, 38px)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1.15, maxWidth: 520 }}>
                Ready to Discuss Your Next Engineering Project?
              </h2>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 400, lineHeight: 1.6 }}>
                Collaborate directly with our technical leads in Nawabshah, Sindh.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 6 }}>
                <a href="mailto:contactus@orbit-i.tech" className="btn-primary" style={{ fontSize: 13 }}>
                  Email Us Directly
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                <a href="https://wa.me/923190375751" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ fontSize: 13 }}>WhatsApp Chat</a>
              </div>
            </div>
          </TiltCard>
        </motion.div>

        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
          <motion.div {...fadeUp(0)}><div className="tag"><span className="dot" />Get In Touch</div></motion.div>
          <motion.h2 {...fadeUp(0.1)} style={{ fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
            Let's build something{' '}<span className="gradient-text-blue">remarkable together</span>
          </motion.h2>
        </div>

        {/* Two column — stacks on mobile */}
        <div className="contact-grid">
          {/* Contact info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {contactInfo.map((item, i) => (
              <motion.div key={item.label} {...fadeUp(0.04 * i)}>
                {item.href ? (
                  <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 14, textDecoration: 'none', background: 'var(--bg-card)', border: '1px solid var(--border)', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.background = 'var(--bg-elevated)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card)' }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-glow)', border: '1px solid var(--border-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, color: 'var(--accent)', flexShrink: 0 }}>{item.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{item.label}</p>
                      <p style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.value}</p>
                    </div>
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                      <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-glow)', border: '1px solid var(--border-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, color: 'var(--accent)', flexShrink: 0 }}>{item.icon}</div>
                    <div>
                      <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{item.label}</p>
                      <p style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{item.value}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            <motion.div {...fadeUp(0.2)} style={{ padding: '14px 16px', borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Follow Us</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[
                  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/orbit-i-private-limited/', color: '#0077b5' },
                  { label: 'Facebook', href: 'https://www.facebook.com/orbitiprivatelimited', color: '#1877f2' },
                  { label: 'Instagram', href: 'https://www.instagram.com/orbiti_private_limited', color: '#e4405f' },
                  { label: 'TikTok', href: 'https://www.tiktok.com/@orbitiprivatelimited', color: '#000' },
                  { label: 'WhatsApp', href: 'https://whatsapp.com/channel/0029Vb8I4kvJJhzUXqEnB50J', color: '#25d366' },
                ].map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{
                    fontSize: 11, padding: '5px 12px',
                    background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                    borderRadius: 100, color: 'var(--text-muted)', textDecoration: 'none',
                    fontFamily: 'Space Grotesk', fontWeight: 600, transition: 'all 0.15s',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = s.color; e.currentTarget.style.borderColor = s.color + '50' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}
                  >{s.label}</a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Form */}
          <motion.div {...fadeUp(0.15)}>
            <div style={{ borderRadius: 20, padding: '28px 24px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              {status === 'success' ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '40px 0', textAlign: 'center' }}
                >
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#22c55e' }}>✓</div>
                  <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Message Sent!</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 280 }}>We'll get back to you within 24 hours.</p>
                  <button className="btn-outline" style={{ fontSize: 13 }} onClick={() => setStatus('idle')}>Send Another</button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 }}>Send us a message</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>We'll respond within 24 hours.</p>
                  </div>

                  <div className="contact-name-email">
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 5 }}>Full Name *</label>
                      <input type="text" placeholder="Your full name" value={form.name} required
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                        style={inputStyle('name')} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 5 }}>Email Address *</label>
                      <input type="email" placeholder="your@email.com" value={form.email} required
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                        style={inputStyle('email')} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 5 }}>Company (Optional)</label>
                    <input type="text" placeholder="Your company name" value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      onFocus={() => setFocused('company')} onBlur={() => setFocused(null)}
                      style={inputStyle('company')} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 5 }}>Service Interested In *</label>
                    <select value={form.service} required
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                      onFocus={() => setFocused('service')} onBlur={() => setFocused(null)}
                      style={{ ...inputStyle('service'), cursor: 'pointer' }}
                    >
                      <option value="">Select a service...</option>
                      {serviceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 5 }}>Project Details *</label>
                    <textarea placeholder="Tell us about your project, requirements, timeline..." value={form.message} required rows={4}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      onFocus={() => setFocused('message')} onBlur={() => setFocused(null)}
                      style={{ ...inputStyle('message'), resize: 'vertical', minHeight: 100 }} />
                  </div>

                  <button type="submit" disabled={status === 'loading'} className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', fontSize: 14, padding: '13px', opacity: status === 'loading' ? 0.7 : 1 }}>
                    {status === 'loading' ? 'Sending...' : status === 'error' ? '✕ Failed — Try Again' : <>Send Message <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></>}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="separator" style={{ marginTop: 80 }} />

      <style>{`
        @media (min-width: 768px) {
          #contact-grid { display: grid !important; grid-template-columns: 2fr 3fr !important; gap: 20px !important; }
          #name-email-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  )
}
