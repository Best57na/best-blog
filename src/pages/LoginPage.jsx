import { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 px-4 py-10">
      <Link to="/" className="mb-8">
        <img src={logo} alt="logo" className="h-8" />
      </Link>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm w-full max-w-sm px-8 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
        <p className="text-sm text-gray-400 mb-8">Log in to your account to continue.</p>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>

          <button
            type="button"
            className="w-full mt-2 py-3 bg-gray-900 text-white text-sm font-medium rounded-full cursor-pointer hover:bg-gray-700 transition-colors"
          >
            Log in
          </button>
        </div>

        <p className="text-sm text-gray-400 text-center mt-6">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-gray-900 font-medium underline underline-offset-2">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
