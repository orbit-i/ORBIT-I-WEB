const BASE_URL = process.env.NEXT_PUBLIC_ORBIT_API || ''

// ─── Helper ────────────────────────────────────────────────────────
async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Something went wrong')
  return data
}

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` }
}

// ─── Contact ───────────────────────────────────────────────────────
export const submitContact = (data) =>
  request('/api/contact', { method: 'POST', body: JSON.stringify(data) })

// ─── Certificates ──────────────────────────────────────────────────
export const verifyCertificate = (code) =>
  request(`/api/certificates/verify/${encodeURIComponent(code)}`)

// ─── Auth ──────────────────────────────────────────────────────────
export const registerClient = (data) =>
  request('/api/auth/register', { method: 'POST', body: JSON.stringify(data) })

export const loginClient = (data) =>
  request('/api/auth/login', { method: 'POST', body: JSON.stringify(data) })

// ─── Projects (authenticated) ──────────────────────────────────────
export const getMyProjects = (token) =>
  request('/api/projects/my', { headers: authHeaders(token) })

export const getProject = (id, token) =>
  request(`/api/projects/${id}`, { headers: authHeaders(token) })

// ─── Token helpers ─────────────────────────────────────────────────
export const saveToken = (token, user) => {
  localStorage.setItem('orbit_token', token)
  localStorage.setItem('orbit_user', JSON.stringify(user))
}

export const getToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('orbit_token') : null

export const getUser = () => {
  if (typeof window === 'undefined') return null
  try {
    return JSON.parse(localStorage.getItem('orbit_user'))
  } catch {
    return null
  }
}

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('orbit_token')
    localStorage.removeItem('orbit_user')
  }
}

export const isTokenExpired = (token) => {
  if (!token) return true
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return false
    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    const payload = JSON.parse(jsonPayload)
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return true
    }
    return false
  } catch {
    return false
  }
}

export const isLoggedIn = () => {
  const token = getToken()
  if (!token) return false
  if (isTokenExpired(token)) {
    logout()
    return false
  }
  return true
}
