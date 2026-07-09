import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

export default function SignUpPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' })
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.name && form.username && form.email && form.password) {
      setSuccess(true)
    }
  }

  return (
    <div className="min-h-screen bg-stone-100">
      {/* NavBar */}
      <nav className="flex items-center justify-between px-4 md:px-8 py-4 bg-stone-100">
        <Link to="/">
          <img src={logo} alt="logo" className="h-8" />
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-5 py-2 rounded-full border border-gray-300 text-sm font-medium text-gray-700 hover:bg-white transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="px-5 py-2 rounded-full bg-gray-900 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
          >
            Sign up
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="flex items-center justify-center px-4 py-10">
        {success ? (
          /* Success state */
          <div className="bg-stone-200 rounded-3xl w-full max-w-md px-10 py-14 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#12B279' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Registration success</h2>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-full cursor-pointer hover:bg-gray-700 transition-colors"
            >
              Continue
            </button>
          </div>
        ) : (
          /* Sign up form */
          <div className="bg-stone-200 rounded-3xl w-full max-w-md px-10 py-10">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Sign up</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full name"
                  required
                  className="w-full bg-white border-0 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Username"
                  required
                  className="w-full bg-white border-0 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className="w-full bg-white border-0 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  className="w-full bg-white border-0 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <button
                type="submit"
                className="mt-2 py-3 bg-gray-900 text-white text-sm font-medium rounded-full cursor-pointer hover:bg-gray-700 transition-colors"
              >
                Sign up
              </button>
            </form>

            <p className="text-sm text-gray-500 text-center mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-gray-900 font-medium underline underline-offset-2">
                Log in
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
