'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TiltCard from '@/components/TiltCard'
import ConfirmationModal from '@/components/ConfirmationModal'
import { submitContact } from '@/lib/orbitApi'
import { getStoredUtm } from '@/lib/utm'
import { MapPin, Mail, Phone, CheckCircle2, AlertCircle, ArrowRight, MessageSquare, Send } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', company: '', service: '', message: '' })
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('')
  const [focused, setFocused] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  // Trigger modal to confirm details before final submission
  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setConfirmOpen(true)
  }

  // Actual submission after user confirms in modal
  const executeSubmission = async () => {
    setStatus('loading')
    setErrorMessage('')
    try {
      const utmData = getStoredUtm()
      await submitContact({ ...form, utm: utmData })
      setStatus('success')
      setConfirmOpen(false)
      setForm({ name: '', email: '', company: '', service: '', message: '' })
    } catch (err) {
      setErrorMessage(err.message || 'Unable to submit your inquiry at this moment. Please email contactus@orbit-i.tech or call +92 319 0375751.')
      setStatus('error')
      setConfirmOpen(false)
    }
  }

  const inputStyle = (field) => ({
    width: '100%',
    padding: '14px 16px',
    background: focused === field ? 'var(--bg-hover)' : 'var(--bg-elevated)',
    border: `1px solid ${focused === field ? 'var(--accent)' : 'var(--border)'}`,
    borderRadius: 12,
    color: 'var(--text-primary)',
    fontSize: 14,
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    transition: 'all 0.2s',
  })

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        <section style={{ padding: '48px 0 50px', position: 'relative' }}>
          <div className="grid-bg" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
          <div className="container" style={{ position: 'relative', textAlign: 'center', maxWidth: 800 }}>
            <span className="tag"><span className="dot" />Get In Touch</span>
            <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(32px, 5vw, 54px)', fontWeight: 800, color: 'var(--text-primary)', marginTop: 14, marginBottom: 16 }}>
              Contact <span className="gradient-text-blue">ORBIT-I Private Limited</span>
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Connect with our corporate headquarters in <strong>Nawabshah</strong> or branch office in <strong>Karachi</strong>. We respond to all commercial and technical inquiries within 24 hours.
            </p>
          </div>
        </section>

        <section style={{ padding: '0 0 80px' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 36, maxWidth: 1100, margin: '0 auto' }}>
              
              {/* Left Column: Office Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Nawabshah HQ */}
                <TiltCard style={{ background: 'var(--bg-card)', border: '1px solid var(--border-hover)', borderRadius: 20, padding: 28 }}>
                  <span style={{ fontSize: 10, padding: '4px 10px', background: 'var(--accent-glow)', border: '1px solid var(--border-hover)', borderRadius: 100, color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Corporate Headquarters
                  </span>
                  <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginTop: 12, marginBottom: 6 }}>
                    Nawabshah Office
                  </h2>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MapPin size={16} color="var(--accent)" style={{ flexShrink: 0 }} /> Nawabshah, Sindh, Pakistan
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    Engineering Labs, Research, Core Server Operations & Administration.
                  </p>
                </TiltCard>

                {/* Karachi Branch */}
                <TiltCard style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 28 }}>
                  <span style={{ fontSize: 10, padding: '4px 10px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 100, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Branch Office
                  </span>
                  <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginTop: 12, marginBottom: 6 }}>
                    Karachi Office
                  </h2>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MapPin size={16} color="var(--accent)" style={{ flexShrink: 0 }} /> Karachi, Sindh, Pakistan
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    Executive Client Consulting, Corporate Partnerships & Metropolitan Operations.
                  </p>
                </TiltCard>

                {/* Direct Clickable Contact Channels */}
                <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {/* Email */}
                  <a
                    href="mailto:contactus@orbit-i.tech"
                    style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}
                  >
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Mail size={18} color="#818cf8" />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email Us Directly</div>
                      <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14 }}>
                        contactus@orbit-i.tech
                      </div>
                    </div>
                  </a>

                  {/* Phone */}
                  <a
                    href="tel:+923190375751"
                    style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}
                  >
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Phone size={18} color="#38bdf8" />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Corporate Phone (Direct Call)</div>
                      <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14 }}>
                        +92 319 0375751
                      </div>
                    </div>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/923190375751"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}
                  >
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <MessageSquare size={18} color="#22c55e" />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>WhatsApp Chat</div>
                      <div style={{ color: '#22c55e', fontWeight: 600, fontSize: 14 }}>
                        +92 319 0375751 (Instant Response)
                      </div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Right Column: Interactive Form with Confirmation, Success & Error States */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24, padding: 36 }}>
                <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                  Send a Direct Message
                </h2>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
                  Fill in your project requirements and our engineering team will get in touch with you within 24 hours.
                </p>

                {status === 'success' ? (
                  <div
                    style={{
                      padding: '36px 20px',
                      background: 'rgba(34,197,94,0.06)',
                      border: '1px solid rgba(34,197,94,0.25)',
                      borderRadius: 16,
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 16,
                    }}
                  >
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#22c55e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(34,197,94,0.4)' }}>
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                      Inquiry Dispatched Successfully!
                    </h3>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 360, lineHeight: 1.6, margin: 0 }}>
                      Thank you! Our technical leads in Nawabshah & Karachi have received your project details and will reply with a detailed proposal within 24 hours.
                    </p>
                    <button
                      type="button"
                      onClick={() => setStatus('idle')}
                      className="btn-outline"
                      style={{ fontSize: 13, marginTop: 8 }}
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Full Name *</label>
                      <input
                        type="text" required placeholder="Ali Raza"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                        style={inputStyle('name')}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Email Address *</label>
                      <input
                        type="email" required placeholder="name@company.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                        style={inputStyle('email')}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Company / Org</label>
                        <input
                          type="text" placeholder="Orbit Solutions"
                          value={form.company}
                          onChange={(e) => setForm({ ...form, company: e.target.value })}
                          onFocus={() => setFocused('company')} onBlur={() => setFocused(null)}
                          style={inputStyle('company')}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Service of Interest</label>
                        <select
                          value={form.service}
                          onChange={(e) => setForm({ ...form, service: e.target.value })}
                          style={{ ...inputStyle('service'), cursor: 'pointer' }}
                        >
                          <option value="">Select Service</option>
                          <option value="Enterprise AI & ML">Enterprise AI & ML</option>
                          <option value="Web Development">Web Development</option>
                          <option value="Mobile Development">Mobile Development</option>
                          <option value="Custom Software">Custom Software</option>
                          <option value="Cloud & DevOps">Cloud & DevOps</option>
                          <option value="UI/UX Design Systems">UI/UX Design Systems</option>
                          <option value="Enterprise APIs">Enterprise APIs & Integrations</option>
                          <option value="Other">Other Inquiry</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Project Scope or Message *</label>
                      <textarea
                        required rows={4} placeholder="Describe your project, timeline, and goals..."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        onFocus={() => setFocused('msg')} onBlur={() => setFocused(null)}
                        style={{ ...inputStyle('msg'), resize: 'vertical' }}
                      />
                    </div>

                    {status === 'error' && (
                      <div
                        style={{
                          padding: '12px 16px',
                          background: 'rgba(239,68,68,0.1)',
                          border: '1px solid rgba(239,68,68,0.25)',
                          borderRadius: 10,
                          color: '#ef4444',
                          fontSize: 13,
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 10,
                        }}
                      >
                        <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
                        <div style={{ flex: 1 }}>
                          <strong>Submission Error: </strong>
                          <span>{errorMessage || 'Unable to send message. Please contact us via WhatsApp or Email directly.'}</span>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="btn-primary"
                      style={{
                        width: '100%',
                        padding: '14px',
                        fontSize: 14,
                        marginTop: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                      }}
                    >
                      <Send size={15} />
                      <span>Review & Submit Inquiry</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Confirmation Modal before dispatch */}
      <ConfirmationModal
        isOpen={confirmOpen}
        title="Confirm Project Inquiry"
        description="Please confirm your project details before dispatching to our engineering leads in Nawabshah and Karachi."
        details={[
          { label: 'Full Name', value: form.name },
          { label: 'Email', value: form.email },
          { label: 'Company', value: form.company || 'Not Specified' },
          { label: 'Selected Service', value: form.service || 'General Inquiry' },
          { label: 'Scope Preview', value: form.message ? (form.message.length > 70 ? form.message.slice(0, 70) + '...' : form.message) : '' },
        ]}
        confirmText="Confirm & Dispatch"
        cancelText="Review & Edit"
        isSubmitting={status === 'loading'}
        onConfirm={executeSubmission}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  )
}
