'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  Shield,
  Key,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Server,
  Zap,
} from 'lucide-react'
import { saveToken, loginClient } from '@/lib/orbitApi'

export default function SuperAdminGateway({ setupRequired, onAuthenticated }) {
  const [isSetup, setIsSetup] = useState(setupRequired)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [rateLimitCountdown, setRateLimitCountdown] = useState(null)
  const [focused, setFocused] = useState(null)

  // Calculate password strength
  const calcStrength = (pwd) => {
    if (!pwd) return { score: 0, text: 'None', color: '#6b7280' }
    let score = 0
    if (pwd.length >= 8) score += 25
    if (pwd.length >= 12) score += 15
    if (/[A-Z]/.test(pwd)) score += 20
    if (/[0-9]/.test(pwd)) score += 20
    if (/[^A-Za-z0-9]/.test(pwd)) score += 20

    if (score < 40) return { score, text: 'Weak', color: '#ef4444' }
    if (score < 75) return { score, text: 'Moderate', color: '#f59e0b' }
    return { score: 100, text: 'Military-Grade Strong', color: '#22c55e' }
  }

  const pwdStrength = calcStrength(form.password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setStatus('loading')

    if (isSetup) {
      // 1. Initial Setup Flow — User sets their OWN credentials
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match.')
        setStatus('idle')
        return
      }

      if (form.password.length < 8) {
        setError('Master Password must be at least 8 characters long.')
        setStatus('idle')
        return
      }

      try {
        const res = await fetch('/api/admin/setup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            password: form.password,
          }),
        })

        const data = await res.json()
        if (!res.ok) {
          if (res.status === 429) {
            setRateLimitCountdown(data.retryAfter || 60)
          }
          throw new Error(data.error || 'Setup rejected.')
        }

        saveToken(data.token, { name: data.name, email: data.email, role: 'ADMIN' })
        setStatus('success')
        setTimeout(() => {
          onAuthenticated({ name: data.name, email: data.email, role: 'ADMIN' })
        }, 800)
      } catch (err) {
        setError(err.message)
        setStatus('idle')
      }
    } else {
      // 2. Master Login Flow — Protected by loginRateLimiter
      try {
        const data = await loginClient({
          email: form.email.trim().toLowerCase(),
          password: form.password,
        })

        if (data.role !== 'ADMIN') {
          throw new Error('Access Denied: Administrator role privileges required.')
        }

        saveToken(data.token, { name: data.name, email: data.email, role: data.role })
        setStatus('success')
        setTimeout(() => {
          onAuthenticated({ name: data.name, email: data.email, role: data.role })
        }, 800)
      } catch (err) {
        setError(err.message)
        setStatus('idle')
      }
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
            maxWidth: 480,
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
              {isSetup ? <Sparkles size={26} /> : <Lock size={26} />}
            </div>

            <span className="tag" style={{ display: 'inline-flex', marginBottom: 10, fontSize: 10 }}>
              <span className="dot" />
              {isSetup ? 'First-Time SuperAdmin Master Setup' : 'Cyber Shield Enforced Access'}
            </span>

            <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
              {isSetup ? 'Create Master Credentials' : 'SuperAdmin Portal Login'}
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {isSetup
                ? 'No default credentials exist. Set your own private administrator credentials to initialize and permanently lock this control vault.'
                : 'Sign in with your private administrator credentials. Protected against brute-force attacks by sliding-window rate limiters.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {isSetup && (
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  SuperAdmin Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Master Administrator"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused(null)}
                  style={inputStyle('name')}
                />
              </div>
            )}

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
                  {isSetup ? 'Choose Master Password *' : 'Master Password *'}
                </label>
                {isSetup && form.password && (
                  <span style={{ fontSize: 11, fontWeight: 600, color: pwdStrength.color }}>
                    Strength: {pwdStrength.text}
                  </span>
                )}
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

              {isSetup && form.password && (
                <div style={{ width: '100%', height: 4, background: 'var(--bg-elevated)', borderRadius: 2, marginTop: 6, overflow: 'hidden' }}>
                  <div style={{ width: `${pwdStrength.score}%`, height: '100%', background: pwdStrength.color, transition: 'all 0.3s' }} />
                </div>
              )}
            </div>

            {isSetup && (
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Confirm Master Password *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  onFocus={() => setFocused('confirmPassword')}
                  onBlur={() => setFocused(null)}
                  style={inputStyle('confirmPassword')}
                />
              </div>
            )}

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, color: '#ef4444', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}
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
              ) : isSetup ? (
                <>Lock & Initialize Master Account <ArrowRight size={15} /></>
              ) : (
                <>Enter SuperAdmin Control Vault <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          {/* Toggle between setup and login if needed */}
          <div style={{ marginTop: 20, textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
            {isSetup ? (
              <button
                onClick={() => { setIsSetup(false); setError('') }}
                style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 12 }}
              >
                Already initialized? Switch to SuperAdmin Login
              </button>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <Shield size={12} color="var(--accent)" /> Protected by ORBIT-I WAF & Rate Limiter
              </span>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
