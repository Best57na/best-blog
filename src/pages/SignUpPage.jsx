import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import logo from '../assets/logo.png'
import { API_BASE } from '../utils/api'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Name is required'
  if (!form.username.trim()) errors.username = 'Username is required'
  if (!form.email.trim()) errors.email = 'Email is required'
  else if (!emailRegex.test(form.email)) errors.email = 'Email must be a valid email'
  if (!form.password) errors.password = 'Password is required'
  else if (form.password.length < 8) errors.password = 'Password must be at least 8 characters'
  return errors
}

export default function SignUpPage() {
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
    const validationErrors = validate(form)
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
      const msg = err.response?.data?.error || 'Registration failed. Please try again.'
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
    `w-full bg-white border rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 transition-colors ${
      errors[field] ? 'border-red-400 focus:ring-red-100' : 'border-transparent focus:ring-gray-200'
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
        {success ? (
          <div className="bg-stone-200 rounded-3xl w-full max-w-md px-10 py-14 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#12B279' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration success</h2>
            <p className="text-sm text-gray-500 mb-8">Check your email to confirm your account before logging in.</p>
            <button onClick={() => navigate('/login')} className="px-8 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-full cursor-pointer hover:bg-gray-700 transition-colors">
              Go to Log in
            </button>
          </div>
        ) : (
          <div className="bg-stone-200 rounded-3xl w-full max-w-md px-10 py-10">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Sign up</h1>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Full name" className={inputClass('name')} />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
                <input type="text" name="username" value={form.username} onChange={handleChange} placeholder="Username" className={inputClass('username')} />
                {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
              </div>
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
                {isLoading ? 'Creating account…' : 'Sign up'}
              </button>
            </form>

            <p className="text-sm text-gray-500 text-center mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-gray-900 font-medium underline underline-offset-2">Log in</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
