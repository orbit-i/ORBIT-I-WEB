'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { loginClient, registerClient, saveToken, isLoggedIn, getUser } from '@/lib/orbitApi'

export default function PortalPage() {
  const [tab, setTab] = useState('login')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const router = useRouter()

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', phone: '', company: '' })
  const [focused, setFocused] = useState(null)

  useEffect(() => {
    if (isLoggedIn()) {
      const user = getUser()
      if (user?.role === 'ADMIN') router.push('/portal/admin')
      else router.push('/portal/dashboard')
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setError('')
    try {
      const data = await loginClient(loginForm)
      saveToken(data.token, { name: data.name, email: data.email, role: data.role })
      if (data.role === 'ADMIN') router.push('/portal/admin')
      else router.push('/portal/dashboard')
    } catch (err) {
      setError(err.message)
      setStatus('idle')
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setError('')
    try {
      await registerClient(registerForm)
      setStatus('registered')
    } catch (err) {
      setError(err.message)
      setStatus('idle')
    }
  }

  const inputStyle = (field) => ({
    width: '100%', padding: '13px 16px',
    background: focused === field ? 'var(--bg-hover)' : 'var(--bg-elevated)',
    border: `1px solid ${focused === field ? 'var(--accent)' : 'var(--border)'}`,
    borderRadius: 12, color: 'var(--text-primary)',
    fontSize: 14, fontFamily: 'Inter', outline: 'none', transition: 'all 0.2s',
    boxShadow: focused === field ? '0 0 0 3px var(--accent-glow)' : 'none',
  })

  return (
    <>
      <style>{`
        .portal-page { min-height: 100vh; background: var(--bg); display: flex; flex-direction: column; }
        .portal-main { flex: 1; display: flex; align-items: center; justify-content: center; padding: 80px 20px; }
        .portal-card { width: 100%; max-width: 460px; }
      `}</style>

      <div className="portal-page">
        {/* Simple header */}
        <header style={{ padding: '20px 32px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <Image src="/orbitlogo-removebg-preview.png" alt="ORBIT-I" width={36} height={36} style={{ objectFit: 'contain' }} />
            <div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>ORBIT-I</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Client Portal</div>
            </div>
          </Link>
          <Link href="/" style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}>← Back to Home</Link>
        </header>

        <main className="portal-main">
          <motion.div className="portal-card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

            {/* Registered success state */}
            {status === 'registered' ? (
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '40px 0' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>✓</div>
                <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>Registration Submitted</h2>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 320, lineHeight: 1.6 }}>
                  Your account is pending admin approval. You will be notified once approved. This typically takes 24 hours.
                </p>
                <button className="btn-outline" style={{ fontSize: 13 }} onClick={() => { setStatus('idle'); setTab('login') }}>
                  Back to Login
                </button>
              </div>
            ) : (
              <>
                {/* Card header */}
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                  <div className="tag" style={{ display: 'inline-flex', marginBottom: 16 }}>
                    <span className="dot" />Client Portal
                  </div>
                  <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    {tab === 'login' ? 'Welcome Back' : 'Request Access'}
                  </h1>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6 }}>
                    {tab === 'login' ? 'Sign in to view your project progress' : 'Register to track your project with ORBIT-I'}
                  </p>
                </div>

                {/* Tab switcher */}
                <div style={{ display: 'flex', background: 'var(--bg-elevated)', borderRadius: 12, padding: 4, marginBottom: 24 }}>
                  {['login', 'register'].map((t) => (
                    <button key={t} onClick={() => { setTab(t); setError('') }} style={{
                      flex: 1, padding: '10px', borderRadius: 9, border: 'none', cursor: 'pointer',
                      fontFamily: 'Space Grotesk', fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                      background: tab === t ? 'var(--bg-card)' : 'transparent',
                      color: tab === t ? 'var(--text-primary)' : 'var(--text-muted)',
                      boxShadow: tab === t ? '0 2px 8px var(--card-shadow)' : 'none',
                    }}>
                      {t === 'login' ? 'Sign In' : 'Register'}
                    </button>
                  ))}
                </div>

                {/* Error message */}
                {error && (
                  <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, marginBottom: 16 }}>
                    <p style={{ fontSize: 13, color: '#ef4444' }}>{error}</p>
                  </div>
                )}

                {/* Card body */}
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '28px 24px' }}>
                  <AnimatePresence mode="wait">
                    {/* LOGIN FORM */}
                    {tab === 'login' && (
                      <motion.form key="login" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.2 }}
                        onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Email Address</label>
                          <input type="email" placeholder="your@email.com" value={loginForm.email} required
                            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                            onFocus={() => setFocused('lemail')} onBlur={() => setFocused(null)}
                            style={inputStyle('lemail')} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Password</label>
                          <input type="password" placeholder="Your password" value={loginForm.password} required
                            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                            onFocus={() => setFocused('lpass')} onBlur={() => setFocused(null)}
                            style={inputStyle('lpass')} />
                        </div>
                        <button type="submit" disabled={status === 'loading'} className="btn-primary"
                          style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 14, marginTop: 4, opacity: status === 'loading' ? 0.7 : 1 }}>
                          {status === 'loading' ? 'Signing in...' : 'Sign In →'}
                        </button>
                      </motion.form>
                    )}

                    {/* REGISTER FORM */}
                    {tab === 'register' && (
                      <motion.form key="register" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}
                        onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Full Name *</label>
                          <input type="text" placeholder="Your full name" value={registerForm.name} required
                            onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                            onFocus={() => setFocused('rname')} onBlur={() => setFocused(null)}
                            style={inputStyle('rname')} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Email Address *</label>
                          <input type="email" placeholder="your@email.com" value={registerForm.email} required
                            onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                            onFocus={() => setFocused('remail')} onBlur={() => setFocused(null)}
                            style={inputStyle('remail')} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Password *</label>
                          <input type="password" placeholder="Create a password" value={registerForm.password} required
                            onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                            onFocus={() => setFocused('rpass')} onBlur={() => setFocused(null)}
                            style={inputStyle('rpass')} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Phone Number</label>
                          <input type="text" placeholder="+92 300 0000000" value={registerForm.phone}
                            onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                            onFocus={() => setFocused('rphone')} onBlur={() => setFocused(null)}
                            style={inputStyle('rphone')} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Company / Organization</label>
                          <input type="text" placeholder="Your company name" value={registerForm.company}
                            onChange={(e) => setRegisterForm({ ...registerForm, company: e.target.value })}
                            onFocus={() => setFocused('rcompany')} onBlur={() => setFocused(null)}
                            style={inputStyle('rcompany')} />
                        </div>
                        <button type="submit" disabled={status === 'loading'} className="btn-primary"
                          style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 14, marginTop: 4, opacity: status === 'loading' ? 0.7 : 1 }}>
                          {status === 'loading' ? 'Submitting...' : 'Request Access →'}
                        </button>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
                          Your account requires admin approval before you can login.
                        </p>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </motion.div>
        </main>
      </div>
    </>
  )
}
