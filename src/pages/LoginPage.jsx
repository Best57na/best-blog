import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import logo from '../assets/logo.png'
import { API_BASE } from '../utils/api'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loginFailed, setLoginFailed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
    if (loginFailed) setLoginFailed(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Mockup bypass (for demo/testing without real account)
    if (form.email === 'test1234' && form.password === 'test1234') {
      const mockUser = { email: 'test1234', name: 'Test User', username: 'test1234', password: 'test1234' }
      localStorage.setItem('currentUser', JSON.stringify(mockUser))
      navigate('/admin/articles')
      return
    }

    const newErrors = {}
    if (!form.email.trim()) newErrors.email = 'Email is required'
    else if (!emailRegex.test(form.email)) newErrors.email = 'Email must be a valid email'
    if (!form.password) newErrors.password = 'Password is required'
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }

    setIsLoading(true)
    try {
      // 1. Login → get token
      const { data: loginData } = await axios.post(`${API_BASE}/auth/login`, {
        email: form.email,
        password: form.password,
      })
      const token = loginData.access_token
      localStorage.setItem('token', token)

      // 2. Get user profile
      const { data: user } = await axios.get(`${API_BASE}/auth/get-user`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      localStorage.setItem('currentUser', JSON.stringify(user))

      navigate('/admin/articles')
    } catch (err) {
      const msg = err.response?.data?.error || 'Your password is incorrect or this email doesn\'t exist'
      setLoginFailed(true)
      toast.error(msg, { description: 'Please try another password or email' })
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass = (field) =>
    `w-full bg-white border rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 transition-colors ${
      errors[field] || loginFailed
        ? 'border-red-400 focus:ring-red-100'
        : 'border-transparent focus:ring-gray-200'
    }`

  return (
    <div className="min-h-screen bg-stone-100">
      <nav className="flex items-center justify-between px-4 md:px-8 py-4 bg-stone-100">
        <Link to="/"><img src={logo} alt="logo" className="h-8" /></Link>
        <div className="flex items-center gap-3">
          <Link to="/login" className="px-5 py-2 rounded-full border border-gray-300 text-sm font-medium text-gray-700 hover:bg-white transition-colors">Log in</Link>
          <Link to="/signup" className="px-5 py-2 rounded-full bg-gray-900 text-sm font-medium text-white hover:bg-gray-700 transition-colors">Sign up</Link>
        </div>
      </nav>

      <div className="flex items-center justify-center px-4 py-10">
        <div className="bg-stone-200 rounded-3xl w-full max-w-md px-10 py-10">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Log in</h1>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className={inputClass('email')} />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" className={inputClass('password')} />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 py-3 bg-gray-900 text-white text-sm font-medium rounded-full cursor-pointer hover:bg-gray-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in…' : 'Log in'}
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            Don&apos;t have any account?{' '}
            <Link to="/signup" className="text-gray-900 font-medium underline underline-offset-2">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
