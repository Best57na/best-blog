import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, User, Mail, X, Globe, Moon, Sun } from 'lucide-react'
import myPic from '../assets/My pic.jpg'
import logo from '../assets/logo.svg'
import logoDark from '../assets/logo-dark.svg'
import { useTheme } from '../lib/theme'

const DEMO_NOTIFICATIONS = [
  { id: 1, title: 'Welcome to the admin panel', message: 'Start managing your articles and profile settings.', read: false, link: '/admin/profile' },
  { id: 2, title: 'New comment on your article', message: 'Someone left a comment on "Exploring Hidden Gems".', read: false, link: '/admin/articles' },
  { id: 3, title: 'Article published', message: 'Your article has been successfully published.', read: true, link: '/admin/articles' },
]

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
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem('notifications')
    if (stored) return JSON.parse(stored)
    localStorage.setItem('notifications', JSON.stringify(DEMO_NOTIFICATIONS))
    return DEMO_NOTIFICATIONS
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
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notifications</span>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                Mark all as read
              </button>
            )}
          </div>
          {items.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-400 dark:text-gray-500">No notifications</div>
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
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  useClickOutside(ref, () => setOpen(false))

  const initials = currentUser.name
    ? currentUser.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : currentUser.username?.[0]?.toUpperCase() || 'U'

  const go = (path) => { navigate(path); setOpen(false) }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-9 h-9 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-600 transition-all flex-shrink-0"
      >
        {currentUser.profilePic ? (
          <img src={currentUser.profilePic} alt="avatar" className="w-full h-full object-cover" />
        ) : initials ? (
          <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{initials}</span>
        ) : (
          <User size={18} className="text-gray-500 dark:text-gray-400" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-lg z-50 py-1.5 overflow-hidden">
          <button onClick={() => go('/admin/profile')}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
            Profile
          </button>
          <button onClick={() => go('/admin/reset-password')}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
            Reset password
          </button>
          <button onClick={() => go('/admin/articles')}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
            Admin panel
          </button>
          <button onClick={toggleTheme}
            className="w-full flex items-center justify-between text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
            <span className="flex items-center gap-2">
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              Dark mode
            </span>
            <span className={`relative w-8 h-4.5 rounded-full transition-colors ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-200'}`}>
              <span className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </span>
          </button>
          <div className="my-1 border-t border-gray-100 dark:border-gray-700" />
          <button onClick={() => { onLogout(); setOpen(false) }}
            className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
            Log out
          </button>
        </div>
      )}
    </div>
  )
}

export function NavBar() {
  const navigate = useNavigate()
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    navigate('/')
  }

  return (
    <nav className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <Link to="/">
        <img src={logo} alt="logo" className="h-8 dark:hidden" />
        <img src={logoDark} alt="logo" className="h-8 hidden dark:block" />
      </Link>

      <div className="hidden md:flex items-center gap-3">
        {currentUser ? (
          <>
            <NotificationBell />
            <UserMenu currentUser={currentUser} onLogout={handleLogout} />
          </>
        ) : (
          <>
            <Link to="/login" className="px-5 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
              Log in
            </Link>
            <Link to="/signup" className="px-5 py-2 rounded-full bg-gray-900 dark:bg-gray-100 text-sm font-medium text-white dark:text-gray-900 cursor-pointer hover:bg-gray-700 dark:hover:bg-white">
              Sign up
            </Link>
          </>
        )}
      </div>

      <button className="md:hidden p-2 text-gray-700 dark:text-gray-200 cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </nav>
  )
}

export function HeroSection() {
  return (
    <div className="p-4 md:p-6">
      <section className="flex flex-col md:flex-row items-center gap-6 md:gap-8 bg-stone-50 dark:bg-gray-800 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-700">
        <div className="flex-1 flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight m-0">
            Explore the World, One Story at a Time
          </h1>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-5 leading-relaxed max-w-xs md:max-w-48">
            Your guide to hidden destinations, travel tips, and unforgettable adventures around the globe.
          </p>
        </div>
        <div className="flex-1 w-full">
          <img src={myPic} alt="Thanakrit W." className="w-full h-64 md:h-80 object-cover object-top rounded-3xl" />
        </div>
        <div className="flex-1 text-left w-full">
          <p className="text-xs text-gray-400 dark:text-gray-500 m-0">- Author</p>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-1 mb-3">Thanakrit W.</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed m-0">
            I am a passionate traveler and writer who has explored over 30 countries across
            Asia, Europe, and South America. I love uncovering hidden gems and sharing
            honest, practical travel stories.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mt-4">
            When I'm not on the road, I spend my time planning the next adventure and
            helping fellow travelers make the most of every journey.
          </p>
        </div>
      </section>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="flex items-center justify-between px-4 md:px-8 py-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 mt-auto">
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500 dark:text-gray-400">Get In Touch</span>
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
      <span className="text-sm text-gray-500 dark:text-gray-400">Home page</span>
    </footer>
  )
}
