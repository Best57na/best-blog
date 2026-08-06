import { createContext, useContext, useState, useEffect } from 'react'
import { TRANSLATIONS, LANGUAGES } from '../i18n/translations'

const LanguageContext = createContext(null)
const STORAGE_KEY = 'site_language'
const RTL_LANGUAGES = new Set(['ar'])

function getInitialLanguage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && TRANSLATIONS[stored]) return stored
  } catch {
    // localStorage unavailable; fall back to default
  }
  return 'en'
}

function resolvePath(dict, path) {
  return path.split('.').reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : undefined), dict)
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language)
    document.documentElement.lang = language
    document.documentElement.dir = RTL_LANGUAGES.has(language) ? 'rtl' : 'ltr'
  }, [language])

  const setLanguage = (lang) => {
    if (TRANSLATIONS[lang]) setLanguageState(lang)
  }

  const t = (key) => {
    const value = resolvePath(TRANSLATIONS[language], key)
    if (value !== undefined) return value
    const fallback = resolvePath(TRANSLATIONS.en, key)
    return fallback !== undefined ? fallback : key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}
