'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { verifyCertificate } from '@/lib/orbitApi'

export default function VerifyPage() {
  const [code, setCode] = useState('')
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [focused, setFocused] = useState(false)

  const handleVerify = async (e) => {
    e.preventDefault()
    if (!code.trim()) return
    setStatus('loading')
    setResult(null)

    try {
      const data = await verifyCertificate(code.trim())
      setResult(data)
      setStatus('found')
    } catch (err) {
      setStatus('notfound')
    }
  }

  const handleReset = () => {
    setCode('')
    setStatus('idle')
    setResult(null)
  }

  const details = result ? [
    { label: 'Intern Name', value: result.name },
    { label: 'Role', value: result.role },
    { label: 'Department', value: result.department },
    { label: 'Duration', value: result.duration },
    { label: 'Period', value: result.startDate && result.endDate ? `${result.startDate} — ${result.endDate}` : '—' },
    { label: 'Status', value: result.status, highlight: true },
    { label: 'Certificate Code', value: result.certificateCode, mono: true },
    { label: 'Issued By', value: result.issuedBy },
  ] : []

  return (
    <>
      <style>{`
        .verify-page {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text-primary);
        }
        .verify-main {
          padding-top: 120px;
          padding-bottom: 80px;
          position: relative;
          overflow: hidden;
        }
        .verify-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 40px 36px;
          width: 100%;
          max-width: 520px;
          margin: 0 auto;
          position: relative;
        }
        .verify-input {
          width: 100%;
          padding: 14px 18px;
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: 14px;
          color: var(--text-primary);
          font-size: 16px;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
          letter-spacing: 0.05em;
          outline: none;
          transition: all 0.2s;
          text-transform: uppercase;
        }
        .verify-input:focus {
          border-color: var(--accent);
          background: var(--bg-hover);
          box-shadow: 0 0 0 3px var(--accent-glow);
        }
        .verify-input::placeholder {
          color: var(--text-muted);
          text-transform: none;
          font-weight: 400;
          letter-spacing: 0;
        }
        .detail-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid var(--border);
          gap: 16px;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .detail-label {
          font-size: 12px;
          color: var(--text-muted);
          font-weight: 500;
          flex-shrink: 0;
        }
        .detail-value {
          font-size: 13px;
          color: var(--text-primary);
          font-weight: 500;
          text-align: right;
        }
        .verified-banner {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: rgba(34,197,94,0.08);
          border: 1px solid rgba(34,197,94,0.2);
          border-radius: 14px;
          margin-bottom: 24px;
        }
        .notfound-banner {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 14px;
        }
        .orbit-signature {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 16px;
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: 14px;
          margin-top: 20px;
        }
      `}</style>

      <div className="verify-page">
        <Navbar />

        <main className="verify-main">
          {/* Grid background */}
          <div className="grid-bg" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.5 }} />

          {/* Glow */}
          <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 500, height: 400, background: 'radial-gradient(ellipse, var(--accent-glow) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div className="container" style={{ position: 'relative' }}>
            {/* Back link */}
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: 48 }}>
              <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M11 7H3M3 7L6.5 3.5M3 7L6.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back to Home
              </Link>
            </motion.div>

            {/* Page header */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16, marginBottom: 48 }}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                <div className="tag"><span className="dot" />Certificate Verification System</div>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                style={{ fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: 1.1, letterSpacing: '-0.03em', fontFamily: 'Space Grotesk', fontWeight: 800, color: 'var(--text-primary)' }}>
                Intern Certificate{' '}
                <span className="gradient-text-blue">Verification</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 440, lineHeight: 1.65 }}>
                Verify the authenticity of any internship certificate issued by ORBIT-I Private Limited. Enter the unique certificate code to check its validity.
              </motion.p>
            </div>

            {/* Card */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
              <div className="verify-card">
                <AnimatePresence mode="wait">
                  {/* IDLE / LOADING */}
                  {(status === 'idle' || status === 'loading') && (
                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div>
                          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--accent-glow)', border: '1px solid var(--border-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: 'var(--accent)', marginBottom: 16 }}>◎</div>
                          <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Enter Certificate Code</h2>
                          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>The unique code is printed on the certificate issued by ORBIT-I.</p>
                        </div>

                        <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                          <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Certificate Code</label>
                            <input
                              type="text"
                              placeholder="e.g. ORBIT-2026-0001"
                              value={code}
                              onChange={(e) => setCode(e.target.value.toUpperCase())}
                              onFocus={() => setFocused(true)}
                              onBlur={() => setFocused(false)}
                              required
                              className="verify-input"
                            />
                            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
                              Try <strong style={{ color: 'var(--text-secondary)' }}>DEMO123</strong> to see a sample result.
                            </p>
                          </div>

                          <button type="submit" disabled={status === 'loading' || !code.trim()} className="btn-primary"
                            style={{ width: '100%', justifyContent: 'center', fontSize: 14, padding: '14px', opacity: status === 'loading' || !code.trim() ? 0.6 : 1 }}>
                            {status === 'loading' ? (
                              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                  style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%' }} />
                                Verifying...
                              </span>
                            ) : (
                              <>Verify Certificate <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></>
                            )}
                          </button>
                        </form>
                      </div>
                    </motion.div>
                  )}

                  {/* FOUND */}
                  {status === 'found' && (
                    <motion.div key="found" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                      style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      <div className="verified-banner">
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ color: '#22c55e', fontSize: 16 }}>✓</span>
                        </div>
                        <div>
                          <p style={{ fontFamily: 'Space Grotesk', fontSize: 14, fontWeight: 700, color: '#22c55e' }}>Certificate Verified</p>
                          <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>This certificate is authentic and issued by ORBIT-I Private Limited.</p>
                        </div>
                      </div>

                      <div>
                        <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Certificate Details</p>
                        <div style={{ border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
                          {details.map((row, i) => (
                            <div key={row.label} className="detail-row" style={{ padding: '12px 16px', background: i % 2 === 0 ? 'var(--bg-elevated)' : 'transparent', borderBottom: i < details.length - 1 ? '1px solid var(--border)' : 'none' }}>
                              <span className="detail-label">{row.label}</span>
                              <span className="detail-value" style={{
                                color: row.highlight ? '#22c55e' : 'var(--text-primary)',
                                fontFamily: row.mono ? 'Space Grotesk' : 'Inter',
                                fontWeight: row.mono ? 700 : 500,
                                letterSpacing: row.mono ? '0.04em' : 0,
                              }}>{row.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="orbit-signature">
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'radial-gradient(circle at 40% 40%, #1d4ed8, var(--bg))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ color: '#fff', fontSize: 12, fontWeight: 800, fontFamily: 'Space Grotesk' }}>O</span>
                        </div>
                        <div>
                          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Space Grotesk' }}>ORBIT-I Private Limited</p>
                          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>SECP Registered · Nawabshah, Sindh, Pakistan</p>
                        </div>
                      </div>

                      <button onClick={handleReset} className="btn-outline" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}>
                        Verify Another Certificate
                      </button>
                    </motion.div>
                  )}

                  {/* NOT FOUND */}
                  {status === 'notfound' && (
                    <motion.div key="notfound" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '20px 0', textAlign: 'center' }}>
                      <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#ef4444' }}>✕</div>
                      <div>
                        <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 700, color: '#ef4444', marginBottom: 8 }}>Certificate Not Found</h3>
                        <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 320, lineHeight: 1.6 }}>
                          No certificate was found with code{' '}
                          <strong style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk' }}>{code}</strong>.
                          Please double-check the code on your certificate.
                        </p>
                      </div>
                      <div style={{ padding: '14px 16px', borderRadius: 14, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)', width: '100%', textAlign: 'left' }}>
                        <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                          If you believe this is an error, contact us at{' '}
                          <a href="mailto:contactus@orbit-i.tech" style={{ color: 'var(--accent)', textDecoration: 'none' }}>contactus@orbit-i.tech</a>
                        </p>
                      </div>
                      <button onClick={handleReset} className="btn-primary" style={{ fontSize: 13 }}>Try Again</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 20, lineHeight: 1.6 }}>
                This verification system is maintained by ORBIT-I Private Limited.<br />
                All certificate records are stored securely in our database.
              </p>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}
