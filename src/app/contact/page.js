'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TiltCard from '@/components/TiltCard'
import { submitContact } from '@/lib/orbitApi'
import { MapPin, Mail, Phone, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react'

export default function ContactPage() {
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
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const inputStyle = (field) => ({
    width: '100%', padding: '14px 16px',
    background: focused === field ? 'var(--bg-hover)' : 'var(--bg-elevated)',
    border: `1px solid ${focused === field ? 'var(--accent)' : 'var(--border)'}`,
    borderRadius: 12, color: 'var(--text-primary)',
    fontSize: 14, fontFamily: 'Inter', outline: 'none',
    transition: 'all 0.2s',
  })

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 100, minHeight: '100vh', background: 'var(--bg)' }}>
        <section style={{ padding: '48px 0 60px', position: 'relative' }}>
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

                {/* Contact Channels */}
                <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Mail size={18} color="#818cf8" />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email Us Directly</div>
                      <a href="mailto:contactus@orbit-i.tech" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
                        contactus@orbit-i.tech
                      </a>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Phone size={18} color="#38bdf8" />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Corporate Phone / WhatsApp</div>
                      <a href="tel:+923190375751" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
                        +92 319 0375751
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Inquiry Form */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24, padding: 36 }}>
                <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                  Send a Direct Message
                </h2>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
                  Fill in your project requirements and our team will get in touch with you within 24 hours.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
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

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-primary"
                    style={{
                      width: '100%',
                      padding: '14px',
                      fontSize: 14,
                      marginTop: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                  >
                    {status === 'loading' ? 'Dispatching Message...' : <>Submit Inquiry <ArrowRight size={15} /></>}
                  </button>

                  {status === 'success' && (
                    <div style={{ padding: '12px 16px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, color: '#22c55e', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <CheckCircle2 size={16} /> Thank you! We received your inquiry and will contact you within 24 hours.
                    </div>
                  )}

                  {status === 'error' && (
                    <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, color: '#ef4444', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <AlertCircle size={16} /> Failed to send message. Please reach us via WhatsApp or Email directly.
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
