// UTM Tracking Utility for ORBIT-I
// Captures and persists utm_source, utm_medium, utm_campaign, utm_term, utm_content, ref, referrer

const UTM_STORAGE_KEY = 'orbit_utm_data'

export function captureUtmParams() {
  if (typeof window === 'undefined') return null

  try {
    const params = new URLSearchParams(window.location.search)
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref']
    const detected = {}
    let hasUtm = false

    utmKeys.forEach((key) => {
      const val = params.get(key)
      if (val) {
        detected[key] = val
        hasUtm = true
      }
    })

    if (hasUtm) {
      detected.landing_page = window.location.pathname
      detected.captured_at = new Date().toISOString()
      detected.referrer = document.referrer || 'direct'
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(detected))
      return detected
    }

    // Check if previously stored
    const existing = sessionStorage.getItem(UTM_STORAGE_KEY)
    if (existing) {
      return JSON.parse(existing)
    }

    // If no UTM but has external referrer
    if (document.referrer && !document.referrer.includes(window.location.hostname)) {
      const refData = {
        utm_source: 'referrer',
        utm_medium: 'organic_or_external',
        referrer: document.referrer,
        landing_page: window.location.pathname,
        captured_at: new Date().toISOString(),
      }
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(refData))
      return refData
    }
  } catch {
    // Graceful fallback for restricted storage environments
  }

  return null
}

export function getStoredUtm() {
  if (typeof window === 'undefined') return {}
  try {
    const raw = sessionStorage.getItem(UTM_STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}
