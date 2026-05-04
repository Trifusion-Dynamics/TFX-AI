'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X, Check, Settings } from 'lucide-react'

interface CookiePreferences {
  essential: boolean
  analytics: boolean
  functional: boolean
  marketing: boolean
}

const STORAGE_KEY = 'tfxai_cookie_consent'

const defaultPreferences: CookiePreferences = {
  essential: true,
  analytics: true,
  functional: true,
  marketing: false,
}

interface ToggleProps {
  checked: boolean
  onChange: (val: boolean) => void
  disabled?: boolean
}

function Toggle({ checked, onChange, disabled = false }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:cursor-not-allowed"
      style={{
        background: checked
          ? 'linear-gradient(135deg, #bc5090, #7c3aed)'
          : '#374151',
      }}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md"
        style={{ translateX: checked ? 20 : 2, translateY: 0 }}
        aria-hidden="true"
      />
    </button>
  )
}

interface CategoryRowProps {
  title: string
  description: string
  checked: boolean
  onChange: (val: boolean) => void
  disabled?: boolean
  alwaysOnLabel?: boolean
}

function CategoryRow({
  title,
  description,
  checked,
  onChange,
  disabled = false,
  alwaysOnLabel = false,
}: CategoryRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-white/5 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">{title}</span>
          {alwaysOnLabel && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">
              Always On
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{description}</p>
      </div>
      <div className="flex-shrink-0 mt-0.5">
        <Toggle checked={checked} onChange={onChange} disabled={disabled} />
      </div>
    </div>
  )
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences)

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (!stored) {
          setShowBanner(true)
        }
      } catch {
        // SSR or blocked storage — fail silently
      }
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const saveAndClose = (prefs: CookiePreferences) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          accepted: true,
          preferences: prefs,
          timestamp: Date.now(),
        })
      )
    } catch {
      // fail silently
    }
    setShowBanner(false)
  }

  const acceptAll = () => {
    const all: CookiePreferences = {
      essential: true,
      analytics: true,
      functional: true,
      marketing: true,
    }
    setPreferences(all)
    saveAndClose(all)
  }

  const rejectAll = () => {
    const essentialOnly: CookiePreferences = {
      essential: true,
      analytics: false,
      functional: false,
      marketing: false,
    }
    setPreferences(essentialOnly)
    saveAndClose(essentialOnly)
  }

  const savePreferences = () => {
    saveAndClose(preferences)
  }

  const updatePref = (key: keyof Omit<CookiePreferences, 'essential'>) => (val: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: val }))
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <>
          {/* ── SIMPLE BAR ── */}
          {!showDetails && (
            <motion.div
              key="cookie-bar"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
              className="fixed bottom-0 left-0 right-0 z-50"
              role="region"
              aria-label="Cookie consent banner"
            >
              <div
                className="w-full px-4 py-4 sm:px-6"
                style={{
                  background: 'rgba(10, 10, 15, 0.97)',
                  backdropFilter: 'blur(16px)',
                  borderTop: '1px solid rgba(188, 80, 144, 0.25)',
                  boxShadow: '0 -4px 32px rgba(0,0,0,0.5)',
                }}
              >
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Left */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5"
                      style={{
                        background: 'linear-gradient(135deg, rgba(188,80,144,0.2), rgba(124,58,237,0.2))',
                        border: '1px solid rgba(188,80,144,0.3)',
                      }}
                    >
                      <Cookie
                        className="w-4 h-4"
                        style={{
                          background: 'linear-gradient(135deg, #bc5090, #7c3aed)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          color: '#bc5090',
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">We use cookies 🍪</p>
                      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed max-w-xl">
                        We use cookies to enhance your experience, analyze traffic, and personalize
                        content. By clicking &apos;Accept All&apos;, you agree to our use of cookies.
                      </p>
                    </div>
                  </div>

                  {/* Right: buttons */}
                  <div className="flex flex-wrap items-center gap-2 flex-shrink-0 w-full sm:w-auto">
                    <button
                      id="cookie-customize-btn"
                      onClick={() => setShowDetails(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:bg-purple-500/10"
                      style={{
                        border: '1px solid rgba(124,58,237,0.5)',
                        color: '#a78bfa',
                      }}
                    >
                      <Settings className="w-3 h-3" />
                      Customize
                    </button>
                    <button
                      id="cookie-reject-btn"
                      onClick={rejectAll}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 transition-all duration-200 hover:text-gray-200 hover:bg-white/5"
                    >
                      Reject All
                    </button>
                    <button
                      id="cookie-accept-btn"
                      onClick={acceptAll}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
                      style={{
                        background: 'linear-gradient(135deg, #bc5090, #7c3aed)',
                        boxShadow: '0 2px 12px rgba(188,80,144,0.35)',
                      }}
                    >
                      <Check className="w-3 h-3" />
                      Accept All
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── DETAILED PANEL ── */}
          {showDetails && (
            <motion.div
              key="cookie-detail"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
              className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-4 pt-4"
              role="dialog"
              aria-modal="true"
              aria-label="Cookie preferences"
            >
              <div
                className="w-full max-w-2xl rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(10, 10, 20, 0.98)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(188,80,144,0.2)',
                  boxShadow: '0 -8px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)',
                }}
              >
                {/* Header */}
                <div
                  className="flex items-center justify-between px-5 py-4"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="flex items-center gap-2.5">
                    <Cookie className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-semibold text-white">Cookie Preferences</span>
                  </div>
                  <button
                    id="cookie-detail-close-btn"
                    onClick={() => setShowDetails(false)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 transition-all duration-150 hover:text-gray-200 hover:bg-white/8"
                    aria-label="Close preferences"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Categories */}
                <div className="px-5">
                  <CategoryRow
                    title="Essential Cookies"
                    description="Required for the website to function. Cannot be disabled."
                    checked={true}
                    onChange={() => {}}
                    disabled={true}
                    alwaysOnLabel={true}
                  />
                  <CategoryRow
                    title="Analytics Cookies"
                    description="Help us understand how visitors interact with our website."
                    checked={preferences.analytics}
                    onChange={updatePref('analytics')}
                  />
                  <CategoryRow
                    title="Functional Cookies"
                    description="Remember your preferences like dark mode and language."
                    checked={preferences.functional}
                    onChange={updatePref('functional')}
                  />
                  <CategoryRow
                    title="Marketing Cookies"
                    description="Used to show relevant ads and track campaign effectiveness."
                    checked={preferences.marketing}
                    onChange={updatePref('marketing')}
                  />
                </div>

                {/* Footer buttons */}
                <div
                  className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 px-5 py-4"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <button
                    id="cookie-detail-reject-btn"
                    onClick={rejectAll}
                    className="px-4 py-2 rounded-lg text-xs font-medium text-gray-400 transition-all duration-200 hover:text-gray-200 hover:bg-white/5 order-1 sm:order-none"
                  >
                    Reject All
                  </button>
                  <button
                    id="cookie-save-prefs-btn"
                    onClick={savePreferences}
                    className="flex items-center justify-center gap-1.5 px-5 py-2 rounded-lg text-xs font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, #bc5090, #7c3aed)',
                      boxShadow: '0 2px 12px rgba(188,80,144,0.3)',
                    }}
                  >
                    <Check className="w-3 h-3" />
                    Save Preferences
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  )
}
