'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Share2,
  CheckCircle2,
  Globe,
  Clock,
  Users,
  Briefcase,
  GraduationCap,
  Shield,
  Upload,
  AlertCircle,
  Copy,
  Check,
  Building,
  Sparkles,
  ExternalLink,
} from 'lucide-react'
import { getStoredUtm } from '@/lib/utm'

export default function RoleDetailsClient({ role }) {
  const [copied, setCopied] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [cvFile, setCvFile] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    linkedin: '',
    coverNote: '',
  })

  const isFreelance = role.category === 'freelance'
  const isInternship = role.category === 'internship' || role.type?.toLowerCase().includes('intern')
  const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://orbit-i.tech/careers/${role.slug}`

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      } else {
        const input = document.createElement('input')
        input.value = shareUrl
        document.body.appendChild(input)
        input.select()
        document.execCommand('copy')
        document.body.removeChild(input)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      }
    } catch {}
  }

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${role.title} at ORBIT-I`,
          text: `Check out the ${role.title} opportunity at ORBIT-I Private Limited (${role.department} · ${role.mode}):`,
          url: shareUrl,
        })
      } catch {}
    } else {
      handleCopyLink()
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
      setErrorMessage('Please select a valid CV file (.pdf, .doc, or .docx).')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('CV file size exceeds 10MB limit.')
      return
    }
    setErrorMessage('')
    setCvFile(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setErrorMessage('')

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setErrorMessage('Please provide your full name, email address, and active contact number.')
      setSubmitting(false)
      return
    }

    if (!cvFile) {
      setErrorMessage('Please upload your CV / Resume document (.pdf, .doc, or .docx).')
      setSubmitting(false)
      return
    }

    try {
      const payload = new FormData()
      payload.append('name', formData.name.trim())
      payload.append('email', formData.email.trim())
      payload.append('phone', formData.phone.trim())
      payload.append('city', formData.city.trim() || 'Not specified')
      payload.append('roleId', role.slug || role.id)
      payload.append('roleTitle', role.title)
      payload.append('category', role.category || (isFreelance ? 'freelance' : 'internship'))
      payload.append('linkedin', formData.linkedin.trim())
      payload.append('coverNote', formData.coverNote.trim())
      payload.append('utm', JSON.stringify(getStoredUtm()))
      payload.append('cv', cvFile)

      const res = await fetch('/api/careers/apply', {
        method: 'POST',
        body: payload,
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok && data.success) {
        setSubmitted(true)
      } else {
        setErrorMessage(data.error || 'Failed to submit application. Please try again.')
      }
    } catch {
      setErrorMessage('Network error occurred. Please reach out via WhatsApp or email.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 40, paddingBottom: 80 }}>
      <div className="container" style={{ maxWidth: 960, margin: '0 auto', padding: '0 20px' }}>
        
        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <Link
            href="/careers"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              padding: '8px 14px',
              borderRadius: 100,
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              transition: 'all 0.2s',
            }}
          >
            <ArrowLeft size={14} /> Back to All Openings
          </Link>

          {/* Social Share & Copy Link Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={handleCopyLink}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                fontWeight: 600,
                color: copied ? '#22c55e' : 'var(--text-primary)',
                background: copied ? 'rgba(34,197,94,0.1)' : 'var(--bg-card)',
                border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : 'var(--border)'}`,
                padding: '8px 14px',
                borderRadius: 100,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              title="Copy shareable link"
            >
              {copied ? <Check size={14} color="#22c55e" /> : <Copy size={14} />}
              {copied ? 'Link Copied!' : 'Copy Share Link'}
            </button>

            <button
              onClick={handleNativeShare}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                fontWeight: 600,
                color: '#818cf8',
                background: 'rgba(99,102,241,0.1)',
                border: '1px solid rgba(99,102,241,0.25)',
                padding: '8px 14px',
                borderRadius: 100,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              title="Share on mobile/social"
            >
              <Share2 size={14} /> Share
            </button>
          </div>
        </div>

        {/* ROLE HEADER CARD */}
        <section
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 24,
            padding: '36px 32px',
            marginBottom: 32,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }}
        >
          {/* Top badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 16 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                padding: '4px 12px',
                borderRadius: 100,
                background: 'var(--bg-elevated)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
              }}
            >
              {role.department}
            </span>

            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                padding: '4px 12px',
                borderRadius: 100,
                background: isFreelance ? 'rgba(34,197,94,0.12)' : 'rgba(99,102,241,0.12)',
                border: isFreelance ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(99,102,241,0.3)',
                color: isFreelance ? '#4ade80' : '#818cf8',
              }}
            >
              {role.compensationBadge || (isFreelance ? 'Project Commission' : 'Unpaid • 2 Months')}
            </span>

            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: 100,
                background: 'rgba(56,189,248,0.1)',
                color: '#38bdf8',
                border: '1px solid rgba(56,189,248,0.25)',
              }}
            >
              {role.openings || 'Open Seats'}
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(24px, 4vw, 36px)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              lineHeight: 1.25,
              marginBottom: 16,
              letterSpacing: '-0.02em',
            }}
          >
            {role.title}
          </h1>

          {/* Metadata Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24, padding: '16px 20px', background: 'var(--bg-elevated)', borderRadius: 16, border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Globe size={16} color="#818cf8" />
              <div>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mode</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{role.mode || '100% Remote'}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={16} color="#818cf8" />
              <div>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Duration</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{role.duration || '2 Months'}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Building size={16} color="#818cf8" />
              <div>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hubs</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Nawabshah HQ / Karachi</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <GraduationCap size={16} color={isFreelance ? '#4ade80' : '#38bdf8'} />
              <div>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: isFreelance ? '#4ade80' : '#38bdf8', margin: 0 }}>{role.type || 'Internship'}</p>
              </div>
            </div>
          </div>

          <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24 }}>
            {role.summary}
          </p>

          <a
            href="#apply-section"
            className="btn-primary"
            style={{
              padding: '13px 28px',
              fontSize: 14,
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              textDecoration: 'none',
              borderRadius: 100,
              background: isFreelance ? 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)' : undefined,
            }}
          >
            Apply for this Role Now
          </a>
        </section>

        {/* DETAILS GRID: RESPONSIBILITIES & REQUIREMENTS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 32 }}>
          
          {/* Key Responsibilities */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 20,
              padding: '28px 26px',
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Briefcase size={18} color="#818cf8" /> What You Will Do
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(role.responsibilities || []).map((resp, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <CheckCircle2 size={16} color="#818cf8" style={{ flexShrink: 0, marginTop: 3 }} />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 20,
              padding: '28px 26px',
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={18} color="#38bdf8" /> Qualifications & Skills
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(role.requirements || []).map((req, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <CheckCircle2 size={16} color="#38bdf8" style={{ flexShrink: 0, marginTop: 3 }} />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* PERKS, DELIVERABLES & CREDENTIALS */}
        <section
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 20,
            padding: '28px 26px',
            marginBottom: 36,
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <GraduationCap size={18} color="#22c55e" /> Verifiable Deliverables & Perks
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            {(role.perks || []).map((p, idx) => (
              <div
                key={idx}
                style={{
                  padding: '14px 16px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                }}
              >
                <CheckCircle2 size={15} color="#22c55e" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{p}</span>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 20,
              padding: '14px 18px',
              borderRadius: 12,
              background: 'rgba(59,130,246,0.06)',
              border: '1px solid rgba(59,130,246,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontSize: 12,
              color: 'var(--text-secondary)',
            }}
          >
            <Shield size={18} color="#3b82f6" style={{ flexShrink: 0 }} />
            <span>
              All certificates issued upon internship completion are cryptographically recorded and verifiable globally 24/7 on our public registry at{' '}
              <Link href="/verify" style={{ color: '#60a5fa', fontWeight: 600, textDecoration: 'underline' }}>
                orbit-i.tech/verify
              </Link>.
            </span>
          </div>
        </section>

        {/* APPLICATION FORM SECTION */}
        <section
          id="apply-section"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 24,
            padding: '36px 32px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
              Apply for {role.title}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Complete the application form below. Our talent acquisition committee reviews submissions daily.
            </p>
          </div>

          {submitted ? (
            <div
              style={{
                textAlign: 'center',
                padding: '48px 24px',
                background: 'rgba(34,197,94,0.06)',
                border: '1px solid rgba(34,197,94,0.2)',
                borderRadius: 20,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'rgba(34,197,94,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <CheckCircle2 size={30} color="#22c55e" />
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                Application Successfully Received!
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto 20px', lineHeight: 1.6 }}>
                Thank you for applying for the <strong>{role.title}</strong> role. Our engineering evaluation team will review your CV and reach out via email or WhatsApp within 48–72 hours.
              </p>
              <Link href="/careers" className="btn-primary" style={{ display: 'inline-flex', padding: '11px 24px', fontSize: 13, textDecoration: 'none' }}>
                Explore Other Opportunities
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              
              {errorMessage && (
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: 10,
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    color: '#ef4444',
                    fontSize: 13,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Asad Ali"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 10,
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      fontSize: 13,
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. asad@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 10,
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      fontSize: 13,
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +92 300 1234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 10,
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      fontSize: 13,
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    City / Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Nawabshah, Karachi, Hyderabad, Remote"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 10,
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      fontSize: 13,
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  LinkedIn or GitHub Portfolio URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/... or https://github.com/..."
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 10,
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontSize: 13,
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Brief Cover Note / Why are you interested in this role?
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your background, relevant projects, and learning goals..."
                  value={formData.coverNote}
                  onChange={(e) => setFormData({ ...formData, coverNote: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 10,
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontSize: 13,
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* CV File Upload */}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Upload CV / Resume (.pdf, .doc, .docx - Max 10MB) *
                </label>
                <div
                  style={{
                    border: '2px dashed var(--border)',
                    borderRadius: 12,
                    padding: '24px 20px',
                    textAlign: 'center',
                    background: 'var(--bg-elevated)',
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="file"
                    required
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer',
                    }}
                  />
                  <Upload size={24} color="#818cf8" style={{ margin: '0 auto 8px' }} />
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    {cvFile ? cvFile.name : 'Click to select or drag & drop your CV document'}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '4px 0 0' }}>
                    {cvFile ? `${(cvFile.size / (1024 * 1024)).toFixed(2)} MB · Ready to submit` : 'Supported formats: PDF, DOC, DOCX up to 10MB'}
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: 14,
                  fontWeight: 700,
                  marginTop: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  background: isFreelance ? 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)' : undefined,
                }}
              >
                {submitting ? 'Submitting Application & Verifying CV...' : 'Submit Application'}
              </button>
            </form>
          )}
        </section>

      </div>
    </main>
  )
}

