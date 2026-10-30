'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  Shield,
  Lock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react'
import { saveToken, loginClient } from '@/lib/orbitApi'

export default function SuperAdminGateway({ onAuthenticated }) {
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    email: 'ab.samad@orbit-i.tech',
    password: '',
  })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [focused, setFocused] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('orbit_admin_last_email')
      if (savedEmail) {
        setForm((prev) => ({ ...prev, email: savedEmail }))
      }
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setStatus('loading')

    try {
      const data = await loginClient({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      })

      if (data.role !== 'ADMIN' && data.role !== 'SUPERADMIN') {
        throw new Error('Access Denied: Administrator role privileges required.')
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('orbit_admin_last_email', data.email)
      }

      saveToken(data.token, { name: data.name, email: data.email, role: data.role })
      setStatus('success')
      setTimeout(() => {
        onAuthenticated({ name: data.name, email: data.email, role: data.role })
      }, 700)
    } catch (err) {
      const msg = err.message || 'Invalid administrator credentials.'
      const isDbLeak = /access denied|database|mysql|connection|sql|table|host/i.test(msg)
      setError(isDbLeak ? 'Invalid credentials or authentication service offline.' : msg)
      setStatus('idle')
    }
  }

  const inputStyle = (field) => ({
    width: '100%',
    padding: '12px 16px',
    background: focused === field ? 'var(--bg-hover)' : 'var(--bg-elevated)',
    border: `1px solid ${focused === field ? 'var(--accent)' : 'var(--border)'}`,
    borderRadius: 12,
    color: 'var(--text-primary)',
    fontSize: 14,
    fontFamily: 'Inter',
    outline: 'none',
    transition: 'all 0.2s',
    boxShadow: focused === field ? '0 0 0 3px var(--accent-glow)' : 'none',
  })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Bar */}
      <header style={{ padding: '18px 32px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Image src="/orbitlogo-removebg-preview.png" alt="ORBIT-I" width={34} height={34} style={{ objectFit: 'contain' }} />
          <div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>ORBIT-I</span>
              <span style={{ fontSize: 10, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8', padding: '1px 6px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                <Shield size={10} /> SUPERADMIN VAULT
              </span>
            </div>
            <div style={{ fontSize: 9, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              Cyber Defense & Executive Control
            </div>
          </div>
        </div>

        <Link href="/" style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <ArrowLeft size={14} /> Back to Website
        </Link>
      </header>

      {/* Main Container */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', position: 'relative' }}>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            width: '100%',
            maxWidth: 440,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-hover)',
            borderRadius: 24,
            padding: '36px 32px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
            position: 'relative',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 26 }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 18,
              background: 'var(--accent-glow)',
              border: '1px solid var(--border-hover)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent)',
              marginBottom: 16,
            }}>
              <Lock size={26} />
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 100, marginBottom: 12 }}>
              <span className="dot" style={{ background: '#22c55e' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#818cf8', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                CYBER SHIELD ENFORCED ACCESS
              </span>
            </div>

            <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
              SuperAdmin Portal Login
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Sign in with your private administrator credentials. Protected against brute-force attacks by sliding-window rate limiters.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Master Administrator Email *
              </label>
              <input
                type="email"
                required
                placeholder="your.admin@orbit-i.tech"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                style={inputStyle('email')}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Master Password *
                </label>
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  style={{ ...inputStyle('password'), paddingRight: 42 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    padding: '12px 14px',
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.25)',
                    borderRadius: 10,
                    color: '#ef4444',
                    fontSize: 13,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <AlertCircle size={15} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success state */}
            {status === 'success' && (
              <div style={{ padding: '10px 14px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 10, color: '#22c55e', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={15} /> Access granted. Decrypting Control Vault...
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '13px',
                fontSize: 14,
                marginTop: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {status === 'loading' ? (
                'Authenticating with Cyber Shield...'
              ) : (
                <>
                  <span>Enter SuperAdmin Control Vault</span>
                  <Lock size={15} />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div style={{ marginTop: 24, textAlign: 'center', fontSize: 11, color: 'var(--text-muted)' }}>
            🔒 Protected by ORBIT-I Military-Grade WAF & Sliding-Window Rate Limiter
          </div>
        </motion.div>
      </main>
    </div>
  )
}
