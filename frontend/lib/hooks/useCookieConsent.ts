'use client'

const STORAGE_KEY = 'tfxai_cookie_consent'

interface CookiePreferences {
  essential: boolean
  analytics: boolean
  functional: boolean
  marketing: boolean
}

interface StoredConsent {
  accepted: boolean
  preferences: CookiePreferences
  timestamp: number
}

function getStored(): StoredConsent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as StoredConsent
  } catch {
    return null
  }
}

export function useCookieConsent() {
  function hasConsented(): boolean {
    return getStored() !== null
  }

  function getPreferences(): CookiePreferences | null {
    return getStored()?.preferences ?? null
  }

  function isAllowed(type: 'analytics' | 'functional' | 'marketing'): boolean {
    const prefs = getPreferences()
    if (!prefs) return false
    return prefs[type] === true
  }

  function clearConsent(): void {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // fail silently
    }
  }

  return { hasConsented, getPreferences, isAllowed, clearConsent }
}
