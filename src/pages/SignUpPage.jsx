import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import logo from '../assets/logo.svg'
import logoDark from '../assets/logo-dark.svg'
import { API_BASE } from '../utils/api'
import { useLanguage } from '../lib/language'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(form, t) {
  const errors = {}
  if (!form.name.trim()) errors.name = t('auth.nameRequired')
  if (!form.username.trim()) errors.username = t('auth.usernameRequired')
  if (!form.email.trim()) errors.email = t('auth.emailRequired')
  else if (!emailRegex.test(form.email)) errors.email = t('auth.emailInvalid')
  if (!form.password) errors.password = t('auth.passwordRequired')
  else if (form.password.length < 8) errors.password = t('auth.passwordMin')
  return errors
}

export default function SignUpPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate(form, t)
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return }

    setIsLoading(true)
    try {
      await axios.post(`${API_BASE}/auth/register`, {
        email: form.email,
        password: form.password,
        username: form.username,
        name: form.name,
      })
      setSuccess(true)
    } catch (err) {
      const msg = err.response?.data?.error || t('auth.registrationFailed')
      if (msg.toLowerCase().includes('username')) {
        setErrors({ username: msg })
      } else if (msg.toLowerCase().includes('email')) {
        setErrors({ email: msg })
      } else {
        toast.error(msg)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass = (field) =>
    `w-full bg-white dark:bg-gray-700 border rounded-xl px-4 py-3 text-sm text-gray-700 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
      errors[field] ? 'border-red-400 focus:ring-red-100 dark:focus:ring-red-500/20' : 'border-transparent focus:ring-gray-200 dark:focus:ring-gray-600'
    }`

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-gray-900">
      <nav className="flex items-center justify-between px-4 md:px-8 py-4 bg-stone-100 dark:bg-gray-900">
        <Link to="/">
          <img src={logo} alt={t('nav.logoAlt')} className="h-8 dark:hidden" />
          <img src={logoDark} alt={t('nav.logoAlt')} className="h-8 hidden dark:block" />
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/login" className="px-5 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 transition-colors">{t('nav.login')}</Link>
          <Link to="/signup" className="px-5 py-2 rounded-full bg-gray-900 dark:bg-gray-100 text-sm font-medium text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-white transition-colors">{t('nav.signup')}</Link>
        </div>
      </nav>

      <div className="flex items-center justify-center px-4 py-10">
        {success ? (
          <div className="bg-stone-200 dark:bg-gray-800 rounded-3xl w-full max-w-md px-10 py-14 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#12B279' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('auth.registrationSuccessTitle')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">{t('auth.checkEmailMessage')}</p>
            <button onClick={() => navigate('/login')} className="px-8 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium rounded-full cursor-pointer hover:bg-gray-700 dark:hover:bg-white transition-colors">
              {t('auth.goToLogin')}
            </button>
          </div>
        ) : (
          <div className="bg-stone-200 dark:bg-gray-800 rounded-3xl w-full max-w-md px-10 py-10">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-8">{t('auth.signup')}</h1>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('auth.name')}</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder={t('auth.namePlaceholder')} className={inputClass('name')} />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('auth.username')}</label>
                <input type="text" name="username" value={form.username} onChange={handleChange} placeholder={t('auth.usernamePlaceholder')} className={inputClass('username')} />
                {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('auth.email')}</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder={t('auth.emailPlaceholder')} className={inputClass('email')} />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('auth.password')}</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} placeholder={t('auth.passwordPlaceholder')} className={inputClass('password')} />
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium rounded-full cursor-pointer hover:bg-gray-700 dark:hover:bg-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? t('auth.creatingAccount') : t('auth.signup')}
              </button>
            </form>

            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-6">
              {t('auth.alreadyHaveAccount')}{' '}
              <Link to="/login" className="text-gray-900 dark:text-gray-100 font-medium underline underline-offset-2">{t('auth.login')}</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
