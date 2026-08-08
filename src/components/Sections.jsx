import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, User, Mail, X, Globe, Moon, Sun, Sparkles } from 'lucide-react'
import myPic from '../assets/My pic.jpg'
import logo from '../assets/logo.svg'
import logoDark from '../assets/logo-dark.svg'
import { useTheme } from '../lib/theme'
import { useLanguage } from '../lib/language'
import { clearSession } from '../lib/sessionAuth'

function buildDemoNotifications(t) {
  return [
    { id: 1, title: t('notif.welcomeTitle'), message: t('notif.welcomeMessage'), read: false, link: '/admin/profile' },
    { id: 2, title: t('notif.commentTitle'), message: t('notif.commentMessage'), read: false, link: '/admin/articles' },
    { id: 3, title: t('notif.publishedTitle'), message: t('notif.publishedMessage'), read: true, link: '/admin/articles' },
  ]
}

function useClickOutside(ref, onClose) {
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])
}

function NotificationBell() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem('notifications')
    if (stored) return JSON.parse(stored)
    const demo = buildDemoNotifications(t)
    localStorage.setItem('notifications', JSON.stringify(demo))
    return demo
  })
  const ref = useRef(null)
  useClickOutside(ref, () => setOpen(false))

  const unread = items.filter(n => !n.read).length

  const markAllRead = () => {
    const updated = items.map(n => ({ ...n, read: true }))
    setItems(updated)
    localStorage.setItem('notifications', JSON.stringify(updated))
  }

  const markRead = (id) => {
    const updated = items.map(n => n.id === id ? { ...n, read: true } : n)
    setItems(updated)
    localStorage.setItem('notifications', JSON.stringify(updated))
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors cursor-pointer"
      >
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t('nav.notifications')}</span>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                {t('nav.markAllRead')}
              </button>
            )}
          </div>
          {items.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-400 dark:text-gray-500">{t('nav.noNotifications')}</div>
          ) : (
            <ul className="max-h-72 overflow-y-auto">
              {items.map(n => (
                <li
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`px-4 py-3 border-b border-gray-50 dark:border-gray-700 last:border-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${!n.read ? 'bg-blue-50/40 dark:bg-blue-500/10' : ''}`}
                >
                  <div className="flex items-start gap-2">
                    <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${!n.read ? 'bg-blue-500' : 'bg-transparent'}`} />
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{n.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{n.message}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

function UserMenu({ currentUser, onLogout }) {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  useClickOutside(ref, () => setOpen(false))

  const initials = currentUser.name
    ? currentUser.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : currentUser.username?.[0]?.toUpperCase() || 'U'

  const isAdmin = currentUser.role === 'admin'
  const go = (path) => { navigate(path); setOpen(false) }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-9 h-9 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-600 transition-all flex-shrink-0"
      >
        {currentUser.profilePic ? (
          <img src={currentUser.profilePic} alt={t('nav.avatarAlt')} className="w-full h-full object-cover" />
        ) : initials ? (
          <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{initials}</span>
        ) : (
          <User size={18} className="text-gray-500 dark:text-gray-400" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-lg z-50 py-1.5 overflow-hidden">
          <button onClick={() => go(isAdmin ? '/admin/profile' : '/profile')}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
            {t('nav.profile')}
          </button>
          <button onClick={() => go(isAdmin ? '/admin/reset-password' : '/reset-password')}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
            {t('nav.resetPassword')}
          </button>
          {isAdmin && (
            <button onClick={() => go('/admin/articles')}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
              {t('nav.adminPanel')}
            </button>
          )}
          <button onClick={toggleTheme}
            className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            {theme === 'dark' ? t('nav.lightMode') : t('nav.darkMode')}
          </button>
          <div className="my-1 border-t border-gray-100 dark:border-gray-700" />
          <button onClick={() => { onLogout(); setOpen(false) }}
            className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
            {t('nav.logout')}
          </button>
        </div>
      )}
    </div>
  )
}

function LanguageSwitcher() {
  const { language, setLanguage, t, languages } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useClickOutside(ref, () => setOpen(false))

  const pinned = languages.filter(l => l.pinned)
  const rest = languages.filter(l => !l.pinned)

  const choose = (code) => { setLanguage(code); setOpen(false) }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        title={t('lang.switchLanguage')}
        className="flex items-center gap-1 p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors cursor-pointer"
      >
        <Globe size={20} />
        <span className="hidden sm:inline text-[11px] font-bold uppercase tracking-wide">{language}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-lg z-50 overflow-hidden">
          <div className="p-2 grid grid-cols-2 gap-1">
            {pinned.map(l => (
              <button
                key={l.code}
                onClick={() => choose(l.code)}
                className={`px-3 py-2 rounded-lg text-sm text-left transition-colors cursor-pointer ${
                  language === l.code
                    ? 'bg-sky-500 text-white'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {l.name}
              </button>
            ))}
          </div>
          <div className="px-3 pt-1 pb-1.5 border-t border-gray-100 dark:border-gray-700">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mt-1.5">{t('lang.more')}</p>
          </div>
          <ul className="max-h-48 overflow-y-auto pb-2">
            {rest.map(l => (
              <li key={l.code}>
                <button
                  onClick={() => choose(l.code)}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                    language === l.code
                      ? 'text-sky-600 dark:text-sky-400 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {l.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export function NavBar() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    clearSession()
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-40 px-4 md:px-8 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between max-w-[1600px] mx-auto">
        <Link to="/" onClick={() => setMobileOpen(false)}>
          <img src={logo} alt={t('nav.logoAlt')} className="h-8 dark:hidden" />
          <img src={logoDark} alt={t('nav.logoAlt')} className="h-8 hidden dark:block" />
        </Link>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/ai-travel-suite"
            title={t('nav.aiTravelSuiteTooltip')}
            className="relative p-2 rounded-full text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-500/10 transition-colors cursor-pointer"
          >
            <Sparkles size={20} />
          </Link>
          <LanguageSwitcher />
          {currentUser ? (
            <>
              <NotificationBell />
              <UserMenu currentUser={currentUser} onLogout={handleLogout} />
            </>
          ) : (
            <>
              <Link to="/login" className="px-5 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                {t('nav.login')}
              </Link>
              <Link to="/signup" className="px-5 py-2 rounded-full bg-gray-900 dark:bg-gray-100 text-sm font-medium text-white dark:text-gray-900 cursor-pointer hover:bg-gray-700 dark:hover:bg-white">
                {t('nav.signup')}
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={mobileOpen}
          className="md:hidden p-2 text-gray-700 dark:text-gray-200 cursor-pointer"
        >
          {mobileOpen ? (
            <X size={24} />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden max-w-[1600px] mx-auto mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-4">
          <Link
            to="/ai-travel-suite"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 text-sm font-medium text-sky-600 dark:text-sky-400"
          >
            <Sparkles size={18} />
            {t('nav.aiTravelSuiteTooltip')}
          </Link>

          <div className="flex items-center justify-between">
            <LanguageSwitcher />
            {currentUser && (
              <div className="flex items-center gap-2">
                <NotificationBell />
                <UserMenu currentUser={currentUser} onLogout={handleLogout} />
              </div>
            )}
          </div>

          {!currentUser && (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center px-5 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                {t('nav.login')}
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center px-5 py-2 rounded-full bg-gray-900 dark:bg-gray-100 text-sm font-medium text-white dark:text-gray-900"
              >
                {t('nav.signup')}
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

export function HeroSection() {
  const { t } = useLanguage()
  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto">
      <section className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 bg-stone-50 dark:bg-gray-800 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-700">
        <div className="flex-[1.2] flex flex-col items-center text-center md:self-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight m-0">
            {t('hero.title')}
          </h1>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-5 leading-relaxed max-w-xs">
            {t('hero.subtitle')}
          </p>
        </div>
        <div className="flex-1 w-full">
          <img src={myPic} alt="Thanakrit W." className="w-full h-64 md:h-80 object-cover object-top rounded-3xl" />
        </div>
        <div className="flex-[1.2] text-left w-full">
          <p className="text-xs text-gray-400 dark:text-gray-500 m-0">{t('hero.authorLabel')}</p>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-1 mb-3">Thanakrit W.</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed m-0">
            {t('hero.bio1')}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mt-4">
            {t('hero.bio2')}
          </p>
        </div>
      </section>
    </div>
  )
}

export function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="px-4 md:px-8 py-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 mt-auto">
      <div className="flex items-center justify-between max-w-[1600px] mx-auto">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">{t('footer.getInTouch')}</span>
          <div className="flex items-center gap-2">
            <a href="#" className="p-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
              <Mail size={14} />
            </a>
            <a href="#" className="p-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
              <X size={14} />
            </a>
            <a href="#" className="p-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
              <Globe size={14} />
            </a>
          </div>
        </div>
        <Link to="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">{t('footer.homePage')}</Link>
      </div>
    </footer>
  )
}
